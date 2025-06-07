"use client"

import type React from "react"
import type { ExcludedEvent } from "@/types"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface ExcludedEventsListProps {
  events: ExcludedEvent[]
  setEvents: React.Dispatch<React.SetStateAction<ExcludedEvent[]>>
}

export function ExcludedEventsList({ events, setEvents }: ExcludedEventsListProps) {
  const [newEvent, setNewEvent] = useState<string>("")

  const addExcludedEvent = (name: string) => {
    if (!name.trim()) return

    // Check if the event already exists
    if (events.some((event) => event.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Duplicate event",
        description: "This event is already in the list",
        duration: 2000,
      })
      return
    }

    // Generate a new ID for the event
    const newId = Math.random().toString(36).substring(2, 9)
    setEvents([...events, { id: newId, name, enabled: true }])
  }

  const removeExcludedEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const toggleExcludedEvent = (id: string) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, enabled: !event.enabled } : event)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Input
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Add an event to exclude"
          className="flex-1"
        />
        <Button
          onClick={() => {
            addExcludedEvent(newEvent)
            setNewEvent("")
          }}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 space-y-2">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events added yet</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${event.id}`}
                    checked={event.enabled}
                    onCheckedChange={() => toggleExcludedEvent(event.id)}
                  />
                  <Label
                    htmlFor={`event-${event.id}`}
                    className={cn("text-sm", !event.enabled && "text-muted-foreground line-through")}
                  >
                    {event.name}
                  </Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeExcludedEvent(event.id)} className="h-6 w-6">
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
