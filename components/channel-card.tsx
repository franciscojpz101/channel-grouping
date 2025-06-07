import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, PlusCircle } from "lucide-react"
import { ExpandIcon } from "@/components/ui/expand-icon"
import { ConditionRow } from "./condition-row"
import type { Channel, ConditionGroup, Condition } from "@/types"

interface ChannelCardProps {
  channel: Channel
  isExpanded: boolean
  toggleExpand: (id: string) => void
  channelsLength: number
  handleDeleteChannel: (id: string) => void
  updateChannelName: (id: string, name: string) => void
  updateChannelGroupOperator: (id: string, op: "AND" | "OR") => void
  removeConditionGroup: (channelId: string, groupId: string) => void
  addCondition: (channelId: string, groupId: string) => void
  addConditionGroup: (channelId: string) => void
  availableProperties: string[]
  updateCondition: (channelId: string, groupId: string, conditionId: string, updates: Partial<Condition>) => void
  updateConditionGroupOperator: (channelId: string, groupId: string, operator: "AND" | "OR") => void
  removeCondition: (channelId: string, groupId: string, conditionId: string) => void
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel, isExpanded, toggleExpand, channelsLength, handleDeleteChannel, updateChannelName, updateChannelGroupOperator,
  removeConditionGroup, addCondition, addConditionGroup, availableProperties, updateCondition, updateConditionGroupOperator, removeCondition
}) => {
  const totalConditions = channel.conditionGroups.reduce((total, group) => total + group.conditions.length, 0)
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer bg-background hover:bg-muted/50" onClick={() => toggleExpand(channel.id)}>
        <div className="flex items-center space-x-2">
          <div className="font-medium">{channel.name}</div>
          <Badge variant="secondary" className="ml-2">{totalConditions} conditions</Badge>
          {channel.conditionGroups.length > 1 && (
            <Badge variant="outline" className="ml-1">{channel.conditionGroups.length} groups</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {channelsLength > 1 && (
            <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDeleteChannel(channel.id) }} className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ExpandIcon expanded={isExpanded} />
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor={`channel-name-${channel.id}`}>Channel Name</Label>
              <Input id={`channel-name-${channel.id}`} value={channel.name} onChange={e => updateChannelName(channel.id, e.target.value)} className="font-semibold" placeholder="Enter Channel Name" />
            </div>
            {channel.conditionGroups.length > 1 && (
              <div className="flex items-center space-x-2 mb-2">
                <Label>Match</Label>
                <Select value={channel.groupOperator} onValueChange={value => updateChannelGroupOperator(channel.id, value as "AND" | "OR")}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">ALL groups (AND)</SelectItem>
                    <SelectItem value="OR">ANY group (OR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {channel.conditionGroups.map((group, groupIndex) => (
              <Card key={group.id} className="border border-muted">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {`Match ${group.operator === "AND" ? "ALL" : "ANY"} rules in this group`}
                    </CardTitle>
                    {channel.conditionGroups.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeConditionGroup(channel.id, group.id)} className="h-6 w-6">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 py-2 px-4">
                  {group.conditions.map((condition, conditionIndex) => (
                    <ConditionRow
                      key={condition.id}
                      channelId={channel.id}
                      group={group}
                      groupIndex={groupIndex}
                      condition={condition}
                      conditionIndex={conditionIndex}
                      availableProperties={availableProperties}
                      updateCondition={updateCondition}
                      updateConditionGroupOperator={updateConditionGroupOperator}
                      removeCondition={removeCondition}
                    />
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addCondition(channel.id, group.id)} className="mt-2">
                    Add Condition
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={() => addConditionGroup(channel.id)} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Condition Group
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}