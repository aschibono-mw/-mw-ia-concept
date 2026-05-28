import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/account/UsersTab";
import { RolesTab } from "@/components/account/RolesTab";
import { ThirdPartyTab } from "@/components/account/ThirdPartyTab";
import { SocialConnectionsTab } from "@/components/account/SocialConnectionsTab";

const TABS = [
  { value: "users",               label: "Users" },
  { value: "roles",               label: "Roles" },
  { value: "third-party",         label: "Third party integrations" },
  { value: "social-connections",  label: "Social connections" },
  { value: "approved-senders",    label: "Approved senders" },
  { value: "email-integration",   label: "Email integration" },
];

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "users";

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
              <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
                Manage your team, access, and integrations
              </h1>
              <p className="text-sm text-muted-foreground">
                Control who can access your workspace, define roles and permissions, and connect your tools and services.
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

              <TabsContent value="users">
                <UsersTab />
              </TabsContent>

              <TabsContent value="roles">
                <RolesTab />
              </TabsContent>

              <TabsContent value="third-party">
                <ThirdPartyTab />
              </TabsContent>

              <TabsContent value="social-connections">
                <SocialConnectionsTab />
              </TabsContent>

              <TabsContent value="approved-senders">
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Approved senders settings coming soon.
                </div>
              </TabsContent>

              <TabsContent value="email-integration">
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Email integration settings coming soon.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
