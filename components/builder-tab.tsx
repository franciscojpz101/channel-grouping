import React, { useState, useCallback, useMemo } from "react"
import { PlusCircle, Info } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Channel, ConditionGroup, Condition, CustomProperty } from "@/types"
import { createEmptyChannel } from "@/data/default-channels"
import { baseAvailableProperties } from "@/data/default-variables"
import { getAllAvailableProperties, generateId } from "@/lib/utils"
import { ChannelCard } from "@/components/channel-card"

interface BuilderTabProps {
  showAdvanced: boolean
  setShowAdvanced: (value: boolean) => void
  handleGenerateCode: () => void
  handleGenerateSql: () => void
  channels: Channel[]
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>
  customProperties: CustomProperty[]
  setChannelToDelete: React.Dispatch<React.SetStateAction<string | null>>
  sourceDatasetLoading: boolean
}

export function BuilderTab({
  showAdvanced,
  setShowAdvanced,
  handleGenerateCode,
  handleGenerateSql,
  channels,
  setChannels,
  customProperties,
  setChannelToDelete,
  sourceDatasetLoading,
}: BuilderTabProps) {
  const [expandedChannelIds, setExpandedChannelIds] = useState<Set<string>>(new Set())

  const availableProperties = useMemo(
    () => getAllAvailableProperties(customProperties, baseAvailableProperties),
    [customProperties]
  )

  // Memoized handlers
  const handleDeleteChannel = useCallback(
    (channelId: string) => setChannelToDelete(channelId),
    [setChannelToDelete]
  )

  const updateChannelName = useCallback(
    (channelId: string, name: string) =>
      setChannels((prev) =>
        prev.map((channel) => (channel.id === channelId ? { ...channel, name } : channel))
      ),
    [setChannels]
  )

  const updateChannelGroupOperator = useCallback(
    (channelId: string, groupOperator: "AND" | "OR") =>
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId ? { ...channel, groupOperator } : channel
        )
      ),
    [setChannels]
  )

  const removeConditionGroup = useCallback(
    (channelId: string, groupId: string) =>
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                conditionGroups: channel.conditionGroups.filter((group) => group.id !== groupId),
              }
            : channel
        )
      ),
    [setChannels]
  )

  const updateCondition = useCallback(
    (channelId: string, groupId: string, conditionId: string, updates: Partial<Condition>) =>
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                conditionGroups: channel.conditionGroups.map((group) =>
                  group.id === groupId
                    ? {
                        ...group,
                        conditions: group.conditions.map((condition) =>
                          condition.id === conditionId ? { ...condition, ...updates } : condition
                        ),
                      }
                    : group
                ),
              }
            : channel
        )
      ),
    [setChannels]
  )

  const updateConditionGroupOperator = useCallback(
    (channelId: string, groupId: string, operator: "AND" | "OR") =>
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                conditionGroups: channel.conditionGroups.map((group) =>
                  group.id === groupId ? { ...group, operator } : group
                ),
              }
            : channel
        )
      ),
    [setChannels]
  )

  const removeCondition = useCallback(
    (channelId: string, groupId: string, conditionId: string) =>
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                conditionGroups: channel.conditionGroups.map((group) =>
                  group.id === groupId
                    ? {
                        ...group,
                        conditions: group.conditions.filter((condition) => condition.id !== conditionId),
                      }
                    : group
                ),
              }
            : channel
        )
      ),
    [setChannels]
  )

  const addCondition = useCallback(
    (channelId: string, groupId: string) => {
      const createEmptyCondition = (): Condition => ({
        id: generateId(),
        property: "UTM_Source",
        conditionType: "contains",
        value: "",
      })

      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                conditionGroups: channel.conditionGroups.map((group) =>
                  group.id === groupId
                    ? { ...group, conditions: [...group.conditions, createEmptyCondition()] }
                    : group
                ),
              }
            : channel
        )
      )
    },
    [setChannels]
  )

  const addConditionGroup = useCallback(
    (channelId: string) => {
      const createEmptyConditionGroup = (): ConditionGroup => ({
        id: generateId(),
        conditions: [
          {
            id: generateId(),
            property: "UTM_Source",
            conditionType: "contains",
            value: "",
          },
        ],
        operator: "AND",
      })

      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? { ...channel, conditionGroups: [...channel.conditionGroups, createEmptyConditionGroup()] }
            : channel
        )
      )
    },
    [setChannels]
  )

  const addChannel = useCallback(() => {
    const newChannel = createEmptyChannel()
    setChannels((prev) => [...prev, newChannel])
    setExpandedChannelIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(newChannel.id)
      return newSet
    })
  }, [setChannels])

  const toggleExpand = useCallback(
    (channelId: string) => {
      setExpandedChannelIds((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(channelId)) {
          newSet.delete(channelId)
        } else {
          newSet.add(channelId)
        }
        return newSet
      })
    },
    []
  )

  return (
    <TabsContent value="builder" className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="advanced-mode">Advanced Mode</Label>
          <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Advanced mode includes predefined variables (search engines, social media sites, paid channels)
                  and generates a more complete code structure with nested LET statements and variable definitions.
                  Use this when you need the full Mixpanel implementation.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleGenerateCode}>Generate Mixpanel Code</Button>
          <Button onClick={handleGenerateSql} variant="outline" disabled={sourceDatasetLoading}>
            Generate SQL Code
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isExpanded={expandedChannelIds.has(channel.id)}
            toggleExpand={toggleExpand}
            channelsLength={channels.length}
            handleDeleteChannel={handleDeleteChannel}
            updateChannelName={updateChannelName}
            updateChannelGroupOperator={updateChannelGroupOperator}
            removeConditionGroup={removeConditionGroup}
            addCondition={addCondition}
            addConditionGroup={addConditionGroup}
            availableProperties={availableProperties}
            updateCondition={updateCondition}
            updateConditionGroupOperator={updateConditionGroupOperator}
            removeCondition={removeCondition}
          />
        ))}
      </div>
      <Button onClick={addChannel} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Channel
      </Button>
    </TabsContent>
  )
}