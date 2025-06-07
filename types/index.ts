export type ConditionType =
  | "matches exactly"
  | "contains"
  | "begins with"
  | "ends with"
  | "matches regex"
  | "partially matches regex"
  | "is in list"
  | "is not set"

export type Condition = {
  id: string
  property: string
  conditionType: ConditionType
  value: string
}

export type ConditionGroup = {
  id: string
  conditions: Condition[]
  operator: "AND" | "OR"
}

export type Channel = {
  id: string
  name: string
  conditionGroups: ConditionGroup[]
  groupOperator: "AND" | "OR"
}

export type VariableItem = {
  id: string
  value: string
  enabled: boolean
}

export type ExcludedEvent = {
  id: string
  name: string
  enabled: boolean
}

export type CustomProperty = {
  id: string
  name: string
  type: "url_parameter" | "event_property"
  parameterName?: string // For URL parameters, the name of the parameter to extract
  enabled: boolean
}

export type Dataset = {
  id: string
  name: string
  createdAt?: string
  description?: string
}

export type QueryExecutionParams = {
  query: string
  sourceDatasetId: string
  destinationDatasetId: string
  groupingConfig: GroupingConfig
}

export type QueryResult = {
  destinationDataset: string
  destinationTable: string
}

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export type GroupingConfig = {
  channels: Channel[]
  searchEngines: VariableItem[]
  socialSites: VariableItem[]
  paidChannelMediums: VariableItem[]
  excludedEvents: ExcludedEvent[]
  customProperties: CustomProperty[]
  uncategorizedChannelName: string
}