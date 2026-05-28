import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagsTab } from "@/components/content-manager/TagsTab";
import { AutomationTab } from "@/components/content-manager/AutomationTab";
import { RSSFeedsTab } from "@/components/content-manager/RSSFeedsTab";
import { AddedContentTab } from "@/components/content-manager/AddedContentTab";
import { LabelsTab } from "@/components/content-manager/LabelsTab";
import { NewsfeedsTab } from "@/components/content-manager/NewsfeedsTab";
import { SourcesTab } from "@/components/content-manager/SourcesTab";
import { DigestsTab } from "@/components/content-manager/DigestsTab";

const TABS = [
  { value: "digests", label: "Digests" },
  { value: "tags", label: "Tags" },
  { value: "automation", label: "Automation" },
  { value: "rss-feeds", label: "Incoming RSS feeds" },
  { value: "added-content", label: "Added content" },
  { value: "labels", label: "Labels" },
  { value: "newsfeeds", label: "Newsfeeds" },
  { value: "sources", label: "Sources" },
];

const ContentManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "digests";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="content-manager" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
                Everything organised, all in one place.
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your tags, labels, sources, feeds, automation rules, and digests from a single hub.
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

              <TabsContent value="tags">
                <TagsTab />
              </TabsContent>

              <TabsContent value="automation">
                <AutomationTab />
              </TabsContent>

              <TabsContent value="rss-feeds">
                <RSSFeedsTab />
              </TabsContent>

              <TabsContent value="added-content">
                <AddedContentTab />
              </TabsContent>

              <TabsContent value="labels">
                <LabelsTab />
              </TabsContent>

              <TabsContent value="newsfeeds">
                <NewsfeedsTab />
              </TabsContent>

              <TabsContent value="sources">
                <SourcesTab />
              </TabsContent>

              <TabsContent value="digests">
                <DigestsTab />
              </TabsContent>

              {TABS.filter((t) => !["tags","automation","rss-feeds","added-content","labels","newsfeeds","sources","digests"].includes(t.value)).map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="bg-card rounded-lg border border-border p-12 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">{tab.label} content coming soon.</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentManager;
