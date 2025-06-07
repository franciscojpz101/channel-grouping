"use client"

import type React from "react"
import type { CustomProperty } from "@/types"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface CustomPropertiesListProps {
  properties: CustomProperty[]
  setProperties: React.Dispatch<React.SetStateAction<CustomProperty[]>>
}

export function CustomPropertiesList({ properties, setProperties }: CustomPropertiesListProps) {
  const [newPropertyName, setNewPropertyName] = useState<string>("")
  const [newPropertyType, setNewPropertyType] = useState<"url_parameter" | "event_property">("url_parameter")
  const [newParameterName, setNewParameterName] = useState<string>("")

  const addCustomProperty = () => {
    if (!newPropertyName.trim()) {
      toast({
        title: "Property name required",
        description: "Please enter a property name",
        duration: 2000,
      })
      return
    }

    if (newPropertyType === "url_parameter" && !newParameterName.trim()) {
      toast({
        title: "Parameter name required",
        description: "Please enter a URL parameter name",
        duration: 2000,
      })
      return
    }

    // Check if the property already exists
    if (properties.some((prop) => prop.name.toLowerCase() === newPropertyName.toLowerCase())) {
      toast({
        title: "Duplicate property",
        description: "This property already exists in the list",
        duration: 2000,
      })
      return
    }

    // Generate a new ID for the property
    const newId = Math.random().toString(36).substring(2, 9)
    const newProperty: CustomProperty = {
      id: newId,
      name: newPropertyName,
      type: newPropertyType,
      parameterName: newPropertyType === "url_parameter" ? newParameterName : undefined,
      enabled: true,
    }

    setProperties([...properties, newProperty])
    setNewPropertyName("")
    setNewParameterName("")
  }

  const removeCustomProperty = (id: string) => {
    setProperties(properties.filter((prop) => prop.id !== id))
  }

  const toggleCustomProperty = (id: string) => {
    setProperties(properties.map((prop) => (prop.id === id ? { ...prop, enabled: !prop.enabled } : prop)))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 border rounded-md">
        <h4 className="font-medium">Add Custom Property</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="property-name">Property Name</Label>
            <Input
              id="property-name"
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
              placeholder="e.g., Variant, Product ID"
            />
          </div>

          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select
              value={newPropertyType}
              onValueChange={(value: "url_parameter" | "event_property") => setNewPropertyType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url_parameter">URL Parameter</SelectItem>
                <SelectItem value="event_property">Event Property</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {newPropertyType === "url_parameter" && (
          <div>
            <Label htmlFor="parameter-name">URL Parameter Name</Label>
            <Input
              id="parameter-name"
              value={newParameterName}
              onChange={(e) => setNewParameterName(e.target.value)}
              placeholder="e.g., variant, product_id, country"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The name of the URL parameter to extract (e.g., "variant" from ?variant=123)
            </p>
          </div>
        )}

        <Button onClick={addCustomProperty} size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Property
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4 space-y-3">
          {properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom properties added yet</p>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`property-${property.id}`}
                    checked={property.enabled}
                    onCheckedChange={() => toggleCustomProperty(property.id)}
                  />
                  <div className="flex flex-col">
                    <Label
                      htmlFor={`property-${property.id}`}
                      className={cn("text-sm font-medium", !property.enabled && "text-muted-foreground line-through")}
                    >
                      {property.name}
                    </Label>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          property.type === "url_parameter"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800",
                        )}
                      >
                        {property.type === "url_parameter" ? "URL Parameter" : "Event Property"}
                      </span>
                      {property.parameterName && <span>Parameter: {property.parameterName}</span>}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomProperty(property.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
