import { useCallback } from "react"
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

interface CodeTabProps {
  generatedCode: string
}

export function CodeTab({ generatedCode }: CodeTabProps) {
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      toast({
        title: "Copied!",
        description: "Code has been copied to clipboard",
        duration: 2000,
      })
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
        duration: 2000,
      })
    }
  }, [generatedCode, toast])

  return (
    <TabsContent value="code">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mixpanel Custom Event Code</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!generatedCode}
              aria-label="Copy code to clipboard"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          <CardDescription>
            Copy and paste this code into your Mixpanel implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={generatedCode}
              readOnly
              className="font-mono h-[500px] resize-none"
              placeholder="Click 'Generate Code' in the Rule Builder tab to create your Mixpanel code"
              aria-label="Generated Mixpanel code"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}