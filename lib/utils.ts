import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { VariableItem, ExcludedEvent, CustomProperty } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => Math.random().toString(36).substring(2, 9)

// Create variable items with IDs
export const createVariableItems = (values: string[]): VariableItem[] => {
  return values.map((value) => ({
    id: generateId(),
    value,
    enabled: true,
  }))
}

// Create excluded events with IDs
export const createExcludedEvents = (names: string[]): ExcludedEvent[] => {
  return names.map((name) => ({
    id: generateId(),
    name,
    enabled: false,
  }))
}

// Create custom properties with IDs
export const createCustomProperties = (properties: Omit<CustomProperty, "id">[]): CustomProperty[] => {
  return properties.map((property) => ({
    ...property,
    id: generateId(),
  }))
}

// Get all available properties including custom ones
export const getAllAvailableProperties = (customProperties: CustomProperty[], baseProperties: string[]): string[] => {
  const enabledCustomProperties = customProperties.filter((prop) => prop.enabled).map((prop) => prop.name)

  return [...baseProperties, ...enabledCustomProperties]
}
