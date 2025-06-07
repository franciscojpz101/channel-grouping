import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Condition, ConditionGroup } from "@/types"

interface ConditionRowProps {
  channelId: string
  group: ConditionGroup
  groupIndex: number
  condition: Condition
  conditionIndex: number
  availableProperties: string[]
  updateCondition: (
    channelId: string,
    groupId: string,
    conditionId: string,
    updates: Partial<Condition>
  ) => void
  updateConditionGroupOperator: (
    channelId: string,
    groupId: string,
    operator: "AND" | "OR"
  ) => void
  removeCondition: (
    channelId: string,
    groupId: string,
    conditionId: string
  ) => void
}

export const ConditionRow: React.FC<ConditionRowProps> = ({
  channelId,
  group,
  condition,
  conditionIndex,
  availableProperties,
  updateCondition,
  updateConditionGroupOperator,
  removeCondition,
}) => (
  <div className="flex items-center space-x-2">
    <Select
      value={condition.property}
      onValueChange={(value) =>
        updateCondition(channelId, group.id, condition.id, { property: value })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableProperties.map((prop) => (
          <SelectItem key={prop} value={prop}>
            {prop}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select
      value={condition.conditionType}
      onValueChange={(value) =>
        updateCondition(channelId, group.id, condition.id, {
          conditionType: value as Condition["conditionType"],
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="matches exactly">matches exactly (=)</SelectItem>
        <SelectItem value="contains">contains</SelectItem>
        <SelectItem value="begins with">begins with</SelectItem>
        <SelectItem value="ends with">ends with</SelectItem>
        <SelectItem value="matches regex">matches regex</SelectItem>
        <SelectItem value="partially matches regex">
          partially matches regex
        </SelectItem>
        <SelectItem value="is in list">is in list</SelectItem>
        <SelectItem value="is not set">is not set</SelectItem>
      </SelectContent>
    </Select>
    <Input
      value={condition.value}
      onChange={(e) =>
        updateCondition(channelId, group.id, condition.id, {
          value: e.target.value,
        })
      }
      placeholder={
        condition.conditionType === "is in list"
          ? "value1, value2, value3"
          : condition.conditionType === "is not set"
          ? "No value needed"
          : "Value"
      }
      className="flex-1"
      disabled={condition.conditionType === "is not set"}
    />
    <div className="flex items-center space-x-1">
      {conditionIndex < group.conditions.length - 1 && (
        <Select
          value={group.operator}
          onValueChange={(value) =>
            updateConditionGroupOperator(
              channelId,
              group.id,
              value as "AND" | "OR"
            )
          }
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      )}
      {group.conditions.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeCondition(channelId, group.id, condition.id)}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
)
