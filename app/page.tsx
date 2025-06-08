"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert } from "@/components/alert"
import { BuilderTab } from "@/components/builder-tab"
import { CodeTab } from "@/components/code-tab"
import { SqlTab } from "@/components/sql-tab"
import { SettingsTab } from "@/components/settings-tab"

import { generateMixpanelCode } from "@/lib/code-generator"
import { generateSqlCode } from "@/lib/sql-generator"
import { createVariableItems, createExcludedEvents, createCustomProperties } from "@/lib/utils"
import { useSourceDataset } from "@/hooks/use-source-dataset"
import {
  defaultSearchEngines,
  defaultSocialSites,
  defaultPaidChannelMediums,
  defaultExcludedEvents,
  defaultCustomProperties,
} from "@/data/default-variables"
import { getDefaultChannels } from "@/data/default-channels"
import type { Channel, CustomProperty } from "@/types"

export default function MixpanelRuleGenerator() {
  const [activeTab, setActiveTab] = useState("builder")
  const [showAdvanced, setShowAdvanced] = useState(true)

  const [channels, setChannels] = useState<Channel[]>(getDefaultChannels)
  const [uncategorizedChannelName, setUncategorizedChannelName] = useState("Other")
  const [searchEngines, setSearchEngines] = useState(createVariableItems(defaultSearchEngines))
  const [socialSites, setSocialSites] = useState(createVariableItems(defaultSocialSites))
  const [paidChannelMediums, setPaidChannelMediums] = useState(createVariableItems(defaultPaidChannelMediums))
  const [excludedEvents, setExcludedEvents] = useState(createExcludedEvents(defaultExcludedEvents))
  const [customProperties, setCustomProperties] = useState<CustomProperty[]>(createCustomProperties(defaultCustomProperties))
  const [groupingConfig, setGroupingConfig] = useState({
    channels,
    uncategorizedChannelName,
    searchEngines,
    socialSites,
    paidChannelMediums,
    excludedEvents,
    customProperties,
  })

  const [generatedSql, setGeneratedSql] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  const [channelToDelete, setChannelToDelete] = useState<string | null>(null)

  useEffect(() => {
    setGroupingConfig({
      channels,
      uncategorizedChannelName,
      searchEngines,
      socialSites,
      paidChannelMediums,
      excludedEvents,
      customProperties,
    })
  }, [
    uncategorizedChannelName,
    searchEngines,
    socialSites,
    paidChannelMediums,
    excludedEvents,
    customProperties,
  ])

  const { sourceDataset, loading: sourceDatasetLoading } = useSourceDataset()

  const confirmDeleteChannel = useCallback(() => {
    if (channelToDelete) {
      setChannels((prev) => prev.filter((channel) => channel.id !== channelToDelete))
      setChannelToDelete(null)
    }
  }, [channelToDelete])

  const cancelDeleteChannel = useCallback(() => setChannelToDelete(null), [])

  const handleGenerateSql = useCallback(() => {
    const sql = generateSqlCode(
      channels,
      searchEngines,
      socialSites,
      paidChannelMediums,
      excludedEvents,
      customProperties,
      uncategorizedChannelName,
      sourceDataset,
    )
    setGeneratedSql(sql)
    setActiveTab("sql")
  }, [
    channels,
    searchEngines,
    socialSites,
    paidChannelMediums,
    excludedEvents,
    customProperties,
    uncategorizedChannelName,
    sourceDataset,
  ])

  const handleGenerateCode = useCallback(() => {
    const code = generateMixpanelCode(
      channels,
      showAdvanced,
      searchEngines,
      socialSites,
      paidChannelMediums,
      excludedEvents,
      customProperties,
      uncategorizedChannelName,
    )
    setGeneratedCode(code)
    setActiveTab("code")
  }, [
    channels,
    showAdvanced,
    searchEngines,
    socialSites,
    paidChannelMediums,
    excludedEvents,
    customProperties,
    uncategorizedChannelName,
  ])

  return (
    <div className="container mx-auto py-8 xl:max-w-6xl px-5 md:px-10 sm:w-full">
      <h1 className="text-3xl font-bold mb-6">Channel Grouping</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 max-sm:flex max-sm:flex-col max-sm:h-auto">
          <TabsTrigger className="w-full" value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger className="w-full" value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger className="w-full" value="code">Mixpanel Custom Event Code</TabsTrigger>
          <TabsTrigger className="w-full" value="sql">SQL Code</TabsTrigger>
        </TabsList>

        <BuilderTab
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          handleGenerateCode={handleGenerateCode}
          handleGenerateSql={handleGenerateSql}
          channels={channels}
          setChannels={setChannels}
          customProperties={customProperties}
          setChannelToDelete={setChannelToDelete}
          sourceDatasetLoading={sourceDatasetLoading}
        />
        <SettingsTab
          uncategorizedChannelName={uncategorizedChannelName}
          setUncategorizedChannelName={setUncategorizedChannelName}
          searchEngines={searchEngines}
          setSearchEngines={setSearchEngines}
          socialSites={socialSites}
          setSocialSites={setSocialSites}
          paidChannelMediums={paidChannelMediums}
          setPaidChannelMediums={setPaidChannelMediums}
          customProperties={customProperties}
          setCustomProperties={setCustomProperties}
          excludedEvents={excludedEvents}
          setExcludedEvents={setExcludedEvents}
        />
        <CodeTab generatedCode={generatedCode} />
        <SqlTab generatedSql={generatedSql} sourceDataset={sourceDataset} groupingConfig={groupingConfig} />
      </Tabs>
      <Alert
        open={!!channelToDelete}
        onOpenChange={(open) => !open && setChannelToDelete(null)}
        cancelDeleteChannel={cancelDeleteChannel}
        confirmDeleteChannel={confirmDeleteChannel}
      />
    </div>
  )
}
