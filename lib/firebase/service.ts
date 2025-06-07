import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "./config"
import type { GroupingConfig } from "@/types"

export type DestinationDataset = {
  datasetId: string
  tableId: string
}

export async function getSourceDataset(): Promise<string> {
  try {
    const collectionId = "vendo_upwork"
    const documentId = "user_1"
    const sourceDatasetField = "source_dataset"

    const docRef = doc(db, collectionId, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()[sourceDatasetField] as string
    } else {
      throw new Error(`No source dataset found in Firestore document`)
    }
  } catch (error) {
    console.error(`Error fetching source dataset:`, error)
    throw error
  }
}

export async function addDestinationDataset(dataset: DestinationDataset, groupingConfig: GroupingConfig): Promise<void> {
  try {
    const collectionId = "vendo_upwork"
    const documentId = "user_1"
    const destinationDatasetField = "destinationWithGroupingConfig"

    const docRef = doc(db, collectionId, documentId)

    await updateDoc(docRef, {
      [destinationDatasetField]: arrayUnion({ dataset, groupingConfig }),
    })
  } catch (error) {
    console.error("Error adding destination dataset to firebase:", error)
    throw error
  }
}
