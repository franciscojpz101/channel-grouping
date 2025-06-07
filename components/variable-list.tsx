"use client"

import type React from "react"
import type { VariableItem } from "@/types"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface VariableListProps {
  list: VariableItem[]
  setList: React.Dispatch<React.SetStateAction<VariableItem[]>>
  placeholder: string
}

export function VariableList({ list, setList, placeholder }: VariableListProps) {
  const [newValue, setNewValue] = useState<string>("")

  const addVariableItem = (value: string) => {
    if (!value.trim()) return

    // Check if the value already exists
    if (list.some((item) => item.value.toLowerCase() === value.toLowerCase())) {
      toast({
        title: "Duplicate value",
        description: "This value already exists in the list",
        duration: 2000,
      })
      return
    }

    // Generate a new ID for the item
    const newId = Math.random().toString(36).substring(2, 9)
    setList([...list, { id: newId, value, enabled: true }])
  }

  const removeVariableItem = (id: string) => {
    setList(list.filter((item) => item.id !== id))
  }

  const toggleVariableItem = (id: string) => {
    setList(list.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          onClick={() => {
            addVariableItem(newValue)
            setNewValue("")
          }}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 space-y-2">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items added yet</p>
          ) : (
            list.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.enabled}
                    onCheckedChange={() => toggleVariableItem(item.id)}
                  />
                  <Label
                    htmlFor={`item-${item.id}`}
                    className={cn("text-sm", !item.enabled && "text-muted-foreground line-through")}
                  >
                    {item.value}
                  </Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeVariableItem(item.id)} className="h-6 w-6">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
