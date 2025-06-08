import { NextResponse } from "next/server"
import { getSourceDataset } from "@/lib/firebase/service"

export async function GET() {
  try {
    const sourceDatasets = await getSourceDataset()

    return NextResponse.json({
      success: true,
      sourceDatasets,
    })
  } catch (error) {
    console.error("Error fetching source dataset:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch source dataset" }, { status: 500 })
  }
}
