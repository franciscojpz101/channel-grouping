import { type NextRequest, NextResponse } from "next/server"
import { executeBigQuery } from "@/lib/bigquery/service"
import { addDestinationDataset } from "@/lib/firebase/service"
import type { QueryExecutionParams } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const params: QueryExecutionParams = await request.json()
    const { query, sourceDatasetId, destinationDatasetId, groupingConfig } = params

    // Execute query in BigQuery
    const queryResult = await executeBigQuery({
      query,
      sourceDatasetId,
      destinationDatasetId,
    })

    if (queryResult.destinationTable) {
      try {
        // const destination_dataset = `${queryResult.destinationDataset}.${queryResult.destinationTable}`
        const destination_dataset = {
          datasetId: queryResult.destinationDataset,
          tableId: queryResult.destinationTable,
        }
        await addDestinationDataset(destination_dataset, groupingConfig)
      } catch (error) {
        console.error("Error adding dataset to firebase:", error)
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        destinationDataset: queryResult.destinationDataset,
        destinationTable: queryResult.destinationTable,
      },
    })
  } catch (error) {
    console.error("Query execution error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Query execution failed",
      },
      { status: 500 },
    )
  }
}
