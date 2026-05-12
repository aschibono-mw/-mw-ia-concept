import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/account/ProfileTab";
import { UsersTab } from "@/components/account/UsersTab";
import { RolesTab } from "@/components/account/RolesTab";
import { ThirdPartyTab } from "@/components/account/ThirdPartyTab";
import { MeltwaterAPITab } from "@/components/account/MeltwaterAPITab";
import { SocialConnectionsTab } from "@/components/account/SocialConnectionsTab";

const TABS = [
  { value: "profile",             label: "Profile" },
  { value: "users",               label: "Users" },
  { value: "roles",               label: "Roles" },
  { value: "third-party",         label: "Third party integra..." },
  { value: "meltwater-api",       label: "Meltwater API" },
  { value: "social-connections",  label: "Social connections" },
];

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="account" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Account</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account profile, users, roles, integrations, and connected services.
              </p>
            </div>

            {/* Tabbed Navigation */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-auto p-0 bg-transparent border-b border-border rounded-none w-full justify-start gap-0 mb-6">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground hover:text-foreground transition-colors"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile">
                <ProfileTab />
              </TabsContent>

              <TabsContent value="users">
                <UsersTab />
              </TabsContent>

              <TabsContent value="roles">
                <RolesTab />
              </TabsContent>

              <TabsContent value="third-party">
                <ThirdPartyTab />
              </TabsContent>

              <TabsContent value="meltwater-api">
                <MeltwaterAPITab />
              </TabsContent>

              <TabsContent value="social-connections">
                <SocialConnectionsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
