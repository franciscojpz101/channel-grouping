import { bigquery } from "./config"

export type BigQueryExecutionParams = {
  query: string
  sourceDatasetId: string
  destinationDatasetId: string
}

export type BigQueryResult = {
  destinationDataset: string
  destinationTable: string
}

const location = "US"

export async function executeBigQuery(params: BigQueryExecutionParams): Promise<BigQueryResult> {
  const { query, sourceDatasetId, destinationDatasetId } = params

  const [datasets] = await bigquery.getDatasets()
  const exists = datasets.some(ds => ds.id === destinationDatasetId)
  if (!exists) {
    await bigquery.createDataset(destinationDatasetId, { location })
  }

  try {
    const timestamp = Date.now()

    const destinationTable = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      datasetId: destinationDatasetId,
      tableId: `output_${timestamp}`,
    };

    await bigquery.createQueryJob({
      query,
      location,
      defaultDataset: { datasetId: sourceDatasetId },
      destinationTable,
      writeDisposition: "WRITE_TRUNCATE",
    })

    return {
      destinationDataset: destinationDatasetId,
      destinationTable: destinationTable.tableId,
    }
  } catch (error) {
    console.error("BigQuery execution error:", error)
    throw new Error(`BigQuery execution failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}