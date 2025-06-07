import type { Channel, VariableItem, ExcludedEvent, CustomProperty } from "@/types"

export function generateMixpanelCode(
  channels: Channel[],
  showAdvanced: boolean,
  searchEngines: VariableItem[],
  socialSites: VariableItem[],
  paidChannelMediums: VariableItem[],
  excludedEvents: ExcludedEvent[],
  customProperties: CustomProperty[],
  uncategorizedChannelName = "Other",
): string {
  let code = "LET(\n"

  // Add predefined variables if advanced mode is enabled
  if (showAdvanced) {
    // Filter enabled search engines
    const enabledSearchEngines = searchEngines.filter((item) => item.enabled).map((item) => `"${item.value}"`)

    if (enabledSearchEngines.length > 0) {
      code += `    search, [${enabledSearchEngines.join(", ")}],\n\n`
    }

    // Filter enabled social sites
    const enabledSocialSites = socialSites.filter((item) => item.enabled).map((item) => `"${item.value}"`)

    if (enabledSocialSites.length > 0) {
      code += `  LET(\n    social, [${enabledSocialSites.join(", ")}],\n\n`
    }

    // Filter enabled paid channel mediums
    const enabledPaidChannelMediums = paidChannelMediums.filter((item) => item.enabled).map((item) => `"${item.value}"`)

    if (enabledPaidChannelMediums.length > 0) {
      code += `  LET(\n     paid_channel_medium, [${enabledPaidChannelMediums.join(", ")}],\n\n`
    }

    // Add custom URL parameter extractions
    const enabledUrlParameters = customProperties.filter((prop) => prop.enabled && prop.type === "url_parameter")
    if (enabledUrlParameters.length > 0) {
      enabledUrlParameters.forEach((prop) => {
        code += `  LET(\n    ${prop.name.toLowerCase().replace(/\s+/g, "_")}, REGEX_EXTRACT(@Current_URL, "${prop.parameterName}=([^&]+)"),\n\n`
      })
    }

    // Add excluded events
    const enabledExcludedEvents = excludedEvents.filter((event) => event.enabled).map((event) => `"${event.name}"`)

    if (enabledExcludedEvents.length > 0) {
      code += `  // Exclude events from channel grouping. Events listed below are excluded from channel grouping calculations. Generally these are server side events.\n`
      code += `  If(@"""{"label":"Event Name","propertyDefaultType":"string","resourceType":"event","type":"string","value":"$event_name"}"""@in [${enabledExcludedEvents.join(", ")}], UNDEFINED,\n\n`
    }
  }

  code += "// Channel Classifier\nIFS(\n"

  // Generate code for each channel
  channels.forEach((channel, index) => {
    if (channel.conditionGroups.length === 0) return

    code += `  // ${channel.name}\n`

    // Generate code for condition groups
    const groupsCode = channel.conditionGroups
      .map((group) => {
        if (group.conditions.length === 0) return ""

        // Generate code for conditions
        const conditionsCode = group.conditions
          .map((condition) => {
            const { property, conditionType, value } = condition

            // Handle custom properties
            let mixpanelProperty = property
            const customProp = customProperties.find((cp) => cp.name === property && cp.enabled)
            if (customProp) {
              if (customProp.type === "url_parameter") {
                mixpanelProperty = customProp.name.toLowerCase().replace(/\s+/g, "_")
              } else {
                mixpanelProperty = `@${property}`
              }
            } else {
              mixpanelProperty = `@${property}`
            }

            // Parse value for list types
            let parsedValue = value
            if (conditionType === "is in list") {
              try {
                // Try to parse as JSON if it looks like an array
                if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
                  const valueArray = JSON.parse(value)
                  if (Array.isArray(valueArray)) {
                    parsedValue = JSON.stringify(valueArray)
                  }
                } else {
                  // Otherwise, split by commas and create an array
                  parsedValue = JSON.stringify(
                    value
                      .split(",")
                      .map((v) => v.trim())
                      .filter((v) => v !== ""),
                  )
                }
              } catch (e) {
                // If parsing fails, use as is
                parsedValue = `[${value}]`
              }
            }

            switch (conditionType) {
              case "matches exactly":
                return `${mixpanelProperty} = ${parsedValue.includes("[") ? parsedValue : `"${parsedValue}"`}`
              case "contains":
                return `${mixpanelProperty} IN ${parsedValue.includes("[") ? parsedValue : `["${parsedValue}"]`}`
              case "begins with":
                return `REGEX_MATCH(${mixpanelProperty}, "^${parsedValue}")`
              case "ends with":
                return `REGEX_MATCH(${mixpanelProperty}, "${parsedValue}$")`
              case "matches regex":
                return `REGEX_MATCH(${mixpanelProperty}, "${parsedValue}")`
              case "partially matches regex":
                return `REGEX_MATCH(${mixpanelProperty}, ".*${parsedValue}.*")`
              case "is in list":
                return `${mixpanelProperty} IN ${parsedValue}`
              case "is not set":
                return `(${mixpanelProperty} = "" OR ${mixpanelProperty} = "null" OR ${mixpanelProperty} IS NULL)`
              default:
                return `${mixpanelProperty} = "${parsedValue}"`
            }
          })
          .filter(Boolean)

        // Join conditions with the group operator
        return conditionsCode.join(`\n    ${group.operator} `)
      })
      .filter(Boolean)

    // Join groups with the channel group operator
    const channelCode = groupsCode.join(`\n  )\n  ${channel.groupOperator} (\n  `)

    code += `  (${channelCode}),\n  "${channel.name}",\n\n`
  })

  // Add default case with the customizable uncategorized channel name
  code += `  // Default\n  TRUE, "${uncategorizedChannelName}"\n)`

  // Close LET statements if advanced mode is enabled
  if (showAdvanced) {
    // Count how many LET statements we opened
    let letCount = 0
    if (searchEngines.some((item) => item.enabled)) letCount++
    if (socialSites.some((item) => item.enabled)) letCount++
    if (paidChannelMediums.some((item) => item.enabled)) letCount++
    if (customProperties.some((prop) => prop.enabled && prop.type === "url_parameter")) {
      letCount += customProperties.filter((prop) => prop.enabled && prop.type === "url_parameter").length
    }
    if (excludedEvents.some((event) => event.enabled)) letCount++

    // Close the appropriate number of LET statements
    for (let i = 0; i < letCount; i++) {
      if (i === letCount - 1) {
        code += "\n)"
      } else {
        code += "\n  )"
      }
    }
  }

  return code
}
