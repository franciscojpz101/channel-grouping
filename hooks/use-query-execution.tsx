"use client"

import { useState } from "react"
import type { QueryExecutionParams, QueryResult } from "@/types"

export function useQueryExecution() {
  const [loading, setLoading] = useState(false)

  const executeQuery = async (params: QueryExecutionParams): Promise<QueryResult> => {
    setLoading(true)

    try {
      const response = await fetch("/api/execute-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Query execution failed")
      }

      return result.data
    } finally {
      setLoading(false)
    }
  }

  return { executeQuery, loading }
}
