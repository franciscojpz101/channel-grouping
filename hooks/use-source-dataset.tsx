"use client"

import { useState, useEffect } from "react"

export function useSourceDataset() {
  const [sourceDataset, setSourceDataset] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSourceDataset()
  }, [])

  const fetchSourceDataset = async () => {
    try {
      const response = await fetch("/api/dataset")
      const data = await response.json()

      if (data.success) {
        setSourceDataset(data.sourceDatasets)
      }
    } catch (error) {
      console.error("Failed to fetch dataset:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    sourceDataset,
    loading,
    refetch: fetchSourceDataset,
  }
}
