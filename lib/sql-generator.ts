import type { Channel, VariableItem, ExcludedEvent, CustomProperty } from "@/types"

// Mapping from Mixpanel properties to SQL columns
const propertyToSqlColumn: Record<string, string> = {
  UTM_Source: "utm_source",
  UTM_Medium: "utm_medium",
  UTM_Campaign: "utm_campaign",
  UTM_Content: "utm_content",
  UTM_Term: "utm_term",
  Current_URL: "mp_reserved_current_url",
  Referrer: "mp_reserved_referrer",
  Referring_Domain: "REGEXP_EXTRACT(mp_reserved_referrer, r'https?://(?:www\\.)?([a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,})')",
}

export function generateSqlCode(
  channels: Channel[],
  searchEngines: VariableItem[],
  socialSites: VariableItem[],
  paidChannelMediums: VariableItem[],
  excludedEvents: ExcludedEvent[],
  customProperties: CustomProperty[],
  uncategorizedChannelName = "Other",
  sourceDataset: string,
): string {

  // Build variable arrays for SQL
  const enabledSearchEngines = searchEngines.filter((item) => item.enabled).map((item) => `'${item.value}'`)
  const enabledSocialSites = socialSites.filter((item) => item.enabled).map((item) => `'${item.value}'`)
  const enabledPaidChannelMediums = paidChannelMediums.filter((item) => item.enabled).map((item) => `'${item.value}'`)

  // Get enabled custom properties
  const enabledCustomProperties = customProperties.filter((prop) => prop.enabled)

  let sql = `SELECT
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  mp_reserved_current_url,
  mp_reserved_referrer,`

  // Add custom properties to SELECT
  enabledCustomProperties.forEach((prop) => {
    if (prop.type === "url_parameter") {
      sql += `\n  REGEXP_EXTRACT(mp_reserved_current_url, r'[?&]${prop.parameterName}=([^&]+)') AS ${prop.name.toLowerCase().replace(/\s+/g, "_")},`
    } else {
      sql += `\n  ${prop.name.toLowerCase().replace(/\s+/g, "_")},`
    }
  })

  sql += `\n  CASE\n`

  // Generate SQL for each channel
  channels.forEach((channel, index) => {
    if (channel.conditionGroups.length === 0) return

    sql += `    -- ${channel.name}\n`
    sql += `    WHEN `

    // Special handling for Organic Search and Organic Social channels
    if (channel.name === "Organic Search") {
      sql += `REGEXP_EXTRACT(mp_reserved_referrer, r'https?://(?:www\\.)?([^/]+)') IN (${enabledSearchEngines.join(", ")}) THEN '${channel.name}'\n`
      return
    }

    if (channel.name === "Organic Social (Other)") {
      sql += `REGEXP_EXTRACT(mp_reserved_referrer, r'https?://(?:www\\.)?([^/]+)') IN (${enabledSocialSites.join(", ")}) THEN '${channel.name}'\n`
      return
    }

    // Continue with regular channel processing for all other channels
    // Generate SQL for condition groups
    const groupsCode = channel.conditionGroups
      .map((group) => {
        if (group.conditions.length === 0) return ""

        // Generate SQL for conditions
        const conditionsCode = group.conditions
          .map((condition) => {
            const { property, conditionType, value } = condition

            // Handle custom properties
            let sqlColumn: string
            const customProp = customProperties.find((cp) => cp.name === property && cp.enabled)
            if (customProp) {
              if (customProp.type === "url_parameter") {
                sqlColumn = `REGEXP_EXTRACT(mp_reserved_current_url, r'[?&]${customProp.parameterName}=([^&]+)')`
              } else {
                sqlColumn = customProp.name.toLowerCase().replace(/\s+/g, "_")
              }
            } else {
              sqlColumn = propertyToSqlColumn[property] || property.toLowerCase()
            }

            // Handle variable placeholders
            let processedValue = value
            if (value.includes("{{search}}")) {
              processedValue = value.replace("{{search}}", `(${enabledSearchEngines.join(", ")})`)
            }
            if (value.includes("{{social}}")) {
              processedValue = value.replace("{{social}}", `(${enabledSocialSites.join(", ")})`)
            }
            if (value.includes("{{paid_channel_medium}}")) {
              processedValue = value.replace("{{paid_channel_medium}}", `(${enabledPaidChannelMediums.join(", ")})`)
            }

            // Parse value for list types
            let parsedValue = processedValue
            if (conditionType === "is in list") {
              try {
                // Try to parse as JSON if it looks like an array
                if (processedValue.trim().startsWith("[") && processedValue.trim().endsWith("]")) {
                  const valueArray = JSON.parse(processedValue)
                  if (Array.isArray(valueArray)) {
                    parsedValue = `(${valueArray.map((v) => `'${v}'`).join(", ")})`
                  }
                } else if (processedValue.trim().startsWith("(") && processedValue.trim().endsWith(")")) {
                  // Already formatted as SQL list
                  parsedValue = processedValue
                } else {
                  // Otherwise, split by commas and create a list
                  const values = processedValue
                    .split(",")
                    .map((v) => v.trim())
                    .filter((v) => v !== "")
                    .map((v) => `'${v}'`)
                  parsedValue = `(${values.join(", ")})`
                }
              } catch (e) {
                // If parsing fails, treat as comma-separated values
                const values = processedValue
                  .split(",")
                  .map((v) => v.trim())
                  .filter((v) => v !== "")
                  .map((v) => `'${v}'`)
                parsedValue = `(${values.join(", ")})`
              }
            }

            switch (conditionType) {
              case "matches exactly":
                return `${sqlColumn} = '${parsedValue.replace(/[()]/g, "").replace(/'/g, "")}'`
              case "contains":
                if (parsedValue.includes("(")) {
                  return `${sqlColumn} IN ${parsedValue}`
                }
                return `${sqlColumn} LIKE '%${parsedValue}%'`
              case "begins with":
                return `${sqlColumn} LIKE '${parsedValue}%'`
              case "ends with":
                return `${sqlColumn} LIKE '%${parsedValue}'`
              case "matches regex":
                return `REGEXP_CONTAINS(${sqlColumn}, r'${parsedValue}')`
              case "partially matches regex":
                return `REGEXP_CONTAINS(${sqlColumn}, r'.*${parsedValue}.*')`
              case "is in list":
                return `${sqlColumn} IN ${parsedValue}`
              case "is not set":
                return `(${sqlColumn} IS NULL OR ${sqlColumn} = '' OR ${sqlColumn} = 'null')`
              default:
                return `${sqlColumn} = '${parsedValue}'`
            }
          })
          .filter(Boolean)

        // Join conditions with the group operator
        return conditionsCode.join(`\n      ${group.operator} `)
      })
      .filter(Boolean)

    // Join groups with the channel group operator
    const channelCode = groupsCode.join(`\n    )\n    ${channel.groupOperator} (\n      `)

    sql += `(${channelCode}) THEN '${channel.name}'\n`
  })

  // Add default case
  sql += `    -- Default\n`
  sql += `    ELSE '${uncategorizedChannelName}'\n`
  sql += `  END AS channel,\n`
  sql += `  COUNT(*) as event_count\n`
  sql += `FROM \`vendo-upwork.${sourceDataset}.export\`\n`

  // Add excluded events filter if any
  // const enabledExcludedEvents = excludedEvents.filter((event) => event.enabled)
  // if (enabledExcludedEvents.length > 0) {
  //   const excludedEventsList = enabledExcludedEvents.map((event) => `'${event.name}'`).join(", ")
  //   sql += `WHERE event NOT IN (${excludedEventsList})\n`
  // } else {
  //   sql += `WHERE event = "Page Viewed"\n`
  // }

  // Calculate GROUP BY columns
  const groupByCount = 8 + enabledCustomProperties.length
  const groupByColumns = Array.from({ length: groupByCount }, (_, i) => i + 1).join(", ")

  sql += `GROUP BY ${groupByColumns}\n`
  sql += `ORDER BY event_count DESC`

  return sql
}
