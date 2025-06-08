import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VariableList } from "@/components/variable-list";
import { CustomPropertiesList } from "@/components/custom-properties-list";
import { ExcludedEventsList } from "@/components/excluded-events-list";
import type { VariableItem, ExcludedEvent, CustomProperty } from "@/types";

interface SettingsTabProps {
  uncategorizedChannelName: string;
  setUncategorizedChannelName: (name: string) => void;
  searchEngines: VariableItem[];
  setSearchEngines: React.Dispatch<React.SetStateAction<VariableItem[]>>;
  socialSites: VariableItem[];
  setSocialSites: React.Dispatch<React.SetStateAction<VariableItem[]>>;
  paidChannelMediums: VariableItem[];
  setPaidChannelMediums: React.Dispatch<React.SetStateAction<VariableItem[]>>;
  customProperties: CustomProperty[];
  setCustomProperties: React.Dispatch<React.SetStateAction<CustomProperty[]>>;
  excludedEvents: ExcludedEvent[];
  setExcludedEvents: React.Dispatch<React.SetStateAction<ExcludedEvent[]>>;
}

export function SettingsTab({
  uncategorizedChannelName,
  setUncategorizedChannelName,
  searchEngines,
  setSearchEngines,
  socialSites,
  setSocialSites,
  paidChannelMediums,
  setPaidChannelMediums,
  customProperties,
  setCustomProperties,
  excludedEvents,
  setExcludedEvents,
}: SettingsTabProps) {
  return (
    <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general settings for channel grouping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="uncategorized-channel-name">
              Uncategorized Channel Group Name
            </Label>
            <Input
              id="uncategorized-channel-name"
              value={uncategorizedChannelName}
              onChange={(e) => setUncategorizedChannelName(e.target.value)}
              placeholder="Name for uncategorized traffic"
              className="max-w-md"
              autoComplete="off"
            />
            <p className="text-sm text-muted-foreground">
              This is the name used for traffic that doesn't match any of your defined channels (default: "Other")
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variable Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Variable Settings</CardTitle>
          <CardDescription>
            Configure the predefined variables used in the advanced mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2">Search Engines</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define the list of search engines for organic search detection
            </p>
            <VariableList
              list={searchEngines}
              setList={setSearchEngines}
              placeholder="Add a search engine domain"
            />
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Social Media Sites</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define the list of social media sites for social traffic detection
            </p>
            <VariableList
              list={socialSites}
              setList={setSocialSites}
              placeholder="Add a social media domain"
            />
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Paid Channel Mediums</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define the list of UTM medium values that indicate paid traffic
            </p>
            <VariableList
              list={paidChannelMediums}
              setList={setPaidChannelMediums}
              placeholder="Add a paid channel medium"
            />
          </section>
        </CardContent>
      </Card>

      {/* Custom Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Properties</CardTitle>
          <CardDescription>
            Add custom URL parameters and event properties for use in your channel rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomPropertiesList
            properties={customProperties}
            setProperties={setCustomProperties}
          />
        </CardContent>
        <CardFooter>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong>URL Parameter:</strong> Extracts values from URL query parameters (e.g., variant=123 from the URL)
            </p>
            <p>
              <strong>Event Property:</strong> Uses a custom event property that you send with your events
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Excluded Events */}
      <Card>
        <CardHeader>
          <CardTitle>Excluded Events</CardTitle>
          <CardDescription>
            Select events to exclude from channel attribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExcludedEventsList
            events={excludedEvents}
            setEvents={setExcludedEvents}
          />
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Events selected here will be excluded from channel attribution in the generated code. This is useful for
            server-side events that don't have referrer information.
          </p>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}