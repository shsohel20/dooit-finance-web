import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrivacyControl from "./PrivacyControl";
import ConsentPreferencesPage from "./Consent";
import DSARPage from "./DataSubjectRights";
import DataPurgeStatistics from "./DataRetention";

const tabs = ['Privacy Control', 'Consent Management', 'Data Re-tension', 'Data Subject Rights'];


export default function PrivacyTabs() {
  return (
    <Tabs defaultValue="Privacy Control">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="Privacy Control">
        <PrivacyControl />
      </TabsContent>
      <TabsContent value="Consent Management">
        <ConsentPreferencesPage />
      </TabsContent>
      <TabsContent value="Data Re-tension">
        <DSARPage />
      </TabsContent>
      <TabsContent value="Data Subject Rights">
        <DataPurgeStatistics />
      </TabsContent>
      {/*
      <TabsContent value="data-retention">
        <DataRetention />
      </TabsContent>
      <TabsContent value="consent-preferences">
        <ConsentPreferences />
      </TabsContent> */}
    </Tabs>
  )
}