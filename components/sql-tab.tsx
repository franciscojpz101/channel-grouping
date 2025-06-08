import React, { useState, useCallback } from "react"
import { TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { useQueryExecution } from "@/hooks/use-query-execution"
import type { GroupingConfig } from "@/types"

interface SqlTabProps {
  generatedSql: string
  sourceDataset: string
  groupingConfig: GroupingConfig
}

export function SqlTab({ generatedSql, sourceDataset, groupingConfig }: SqlTabProps) {
  const { executeQuery, loading: executing } = useQueryExecution()
  const [destinationDataset, setDestinationDataset] = useState<string>("")

  const onCopy = useCallback(() => {
    if (!generatedSql) return
    navigator.clipboard.writeText(generatedSql)
    toast({
      title: "Copied!",
      description: "SQL code has been copied to clipboard",
      duration: 2000,
    })
  }, [generatedSql])

  const onRunSql = useCallback(async () => {
    if (!destinationDataset.trim()) {
      toast({
        title: "Destination Dataset Required",
        description: "Please enter a destination dataset ID before running the SQL query.",
        variant: "destructive",
        duration: 2000,
      })
      return
    }
    toast({
      title: "Running SQL query...",
      description: "Query is being sent to BigQuery.",
      duration: Infinity,
    })
    try {
      await executeQuery({
        query: generatedSql,
        sourceDatasetId: sourceDataset,
        destinationDatasetId: destinationDataset,
        groupingConfig,
      })
      toast({
        title: "Query Executed Successfully",
        description: "Results have been saved to a dataset in BigQuery. The dataset information and configuration has also been stored in Firebase.",
        duration: Infinity,
      })
    } catch (error) {
      toast({
        title: "Query Execution Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }, [destinationDataset, executeQuery, generatedSql, sourceDataset])

  return (
    <TabsContent value="sql">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between max-sm:flex-col max-sm:space-y-5">
            <CardTitle>SQL Code</CardTitle>
            <div className="flex items-center space-x-4 max-sm:w-full">
              <Input
                value={destinationDataset}
                onChange={(e) => setDestinationDataset(e.target.value)}
                placeholder="Input destination dataset ID *"
                className="w-[220px] max-sm:w-full"
              />
              <Button
                variant="default"
                size="sm"
                onClick={onRunSql}
                disabled={!generatedSql || executing}
              >
                Run SQL
              </Button>
            </div>
          </div>
          <CardDescription>
            Copy and paste this SQL code into your BigQuery or data warehouse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              disabled={!generatedSql}
              className="absolute top-2 right-5 z-10"
            >
              <Copy className="h-4 w-4" />Copy
            </Button>
            <Textarea
              value={generatedSql}
              readOnly
              className="font-mono h-[500px] resize-none"
              placeholder="Click 'Generate SQL Code' in the Rule Builder tab to create your SQL code"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}