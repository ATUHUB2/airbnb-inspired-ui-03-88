
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { ThemeSettingsTab } from "./ThemeSettingsTab";
import { CompanySettingsTab } from "./CompanySettingsTab";
import { NotificationSettingsTab } from "./NotificationSettingsTab";
import { SocialSettingsTab } from "./SocialSettingsTab";
import { FooterSettingsTab } from "./FooterSettingsTab";
import { ContentSettingsTab } from "./ContentSettingsTab";
import { ImportExportTab } from "./ImportExportTab";
import PasswordResetTab from "./PasswordResetTab";

interface SettingsTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  settings?: any;
  isMobileView?: boolean;
  showTabsContent?: boolean;
  setShowTabsContent?: (show: boolean) => void;
}

const SettingsTabs = ({ 
  activeTab = "general", 
  setActiveTab = () => {}, 
  settings = {},
  isMobileView = false,
  showTabsContent = true,
  setShowTabsContent = () => {}
}: SettingsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="theme">Thème</TabsTrigger>
        <TabsTrigger value="content">Contenus</TabsTrigger>
        <TabsTrigger value="company">Entreprise</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        <TabsTrigger value="footer">Pied de page</TabsTrigger>
        <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        <TabsTrigger value="password-reset">Réinitialisation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <GeneralSettingsTab />
      </TabsContent>
      
      <TabsContent value="theme">
        <ThemeSettingsTab />
      </TabsContent>
      
      <TabsContent value="content">
        <ContentSettingsTab />
      </TabsContent>
      
      <TabsContent value="company">
        <CompanySettingsTab />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationSettingsTab />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialSettingsTab />
      </TabsContent>
      
      <TabsContent value="footer">
        <FooterSettingsTab />
      </TabsContent>
      
      <TabsContent value="import-export">
        <ImportExportTab onImport={() => Promise.resolve(true)} onExport={() => true} />
      </TabsContent>
      
      <TabsContent value="password-reset">
        <PasswordResetTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
