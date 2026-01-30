import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAlerts } from "@/components/alerts/mockData";
import { getAlertIcon } from "@/components/alerts/alertIcons";
import { alertTypeLabels, alertTypeDescriptions, AlertType } from "@/components/alerts/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Plus,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Mock data for managed alerts (alert configurations)
const managedAlerts = [
  { id: "1", name: "Brand Mentions Alert", type: "spike_detection" as AlertType, search: "Brand Mentions Search", enabled: true, frequency: "Real-time" },
  { id: "2", name: "Executive Coverage", type: "top_reach" as AlertType, search: "Executive Leadership Coverage", enabled: true, frequency: "Daily digest" },
  { id: "3", name: "Competitor Watch", type: "sentiment_shift" as AlertType, search: "Competitor Analysis", enabled: false, frequency: "Real-time" },
  { id: "4", name: "Industry News", type: "industry_events" as AlertType, search: "Industry News Search", enabled: true, frequency: "Weekly digest" },
  { id: "5", name: "Social Influencers", type: "x_influencer" as AlertType, search: "Influencer Mentions Tracker", enabled: true, frequency: "Real-time" },
  { id: "6", name: "Crisis Monitor", type: "every_mention" as AlertType, search: "Crisis & Reputation Risk", enabled: true, frequency: "Real-time" },
  { id: "7", name: "Product Launches", type: "company_events" as AlertType, search: "Competitor Product Launches", enabled: false, frequency: "Daily digest" },
  { id: "8", name: "Earnings Coverage", type: "top_reach" as AlertType, search: "Earnings Call Mentions", enabled: true, frequency: "Real-time" },
];

const Alerts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const unreadCount = mockAlerts.filter(a => !a.isRead).length;

  const toggleAlertSelection = (id: string) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="alerts" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6">
          <div className="max-w-[1100px] mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Alerts</h1>
                <p className="text-sm text-muted-foreground">
                  Stay informed with real-time notifications from your searches
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Alert
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-muted">
                  <TabsTrigger value="all" className="gap-2">
                    All Alerts
                    {unreadCount > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full inline-flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="manage">Manage Alerts</TabsTrigger>
                </TabsList>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search alerts..." 
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* All Alerts Tab */}
              <TabsContent value="all" className="mt-0">
                <div className="bg-card rounded-lg border border-border">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {mockAlerts.length} alerts
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            All types
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 bg-card">
                          <DropdownMenuItem className="cursor-pointer">All types</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Spike Detection</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Sentiment Shift</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Top Reach</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">X Influencer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <button className="text-sm text-primary hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  {/* Alert List */}
                  <div className="divide-y divide-border">
                    {mockAlerts.map((alert) => {
                      const AlertIcon = getAlertIcon(alert.type);
                      return (
                        <div 
                          key={alert.id} 
                          className={`px-4 py-4 hover:bg-muted/50 cursor-pointer ${!alert.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!alert.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                              <AlertIcon className={`w-5 h-5 ${!alert.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`text-xs ${!alert.isRead ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                  {alertTypeLabels[alert.type]}
                                </span>
                                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                              </div>
                              <p className={`text-sm text-foreground mb-1 ${!alert.isRead ? 'font-semibold' : ''}`}>
                                {alert.title}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {alert.description}
                              </p>
                              <span className="text-xs text-muted-foreground/70 mt-2 block">
                                {alert.source}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 bg-card">
                                <DropdownMenuItem className="cursor-pointer">Mark as read</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">View search</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Mute alert</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Manage Alerts Tab */}
              <TabsContent value="manage" className="mt-0">
                <div className="bg-card rounded-lg border border-border">
                  {/* Table */}
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="p-4 w-10">
                          <Checkbox />
                        </th>
                        <th className="p-4 text-sm font-bold text-foreground">Alert Name</th>
                        <th className="p-4 text-sm font-bold text-foreground">Type</th>
                        <th className="p-4 text-sm font-bold text-foreground">Connected Search</th>
                        <th className="p-4 text-sm font-bold text-foreground">Frequency</th>
                        <th className="p-4 text-sm font-bold text-foreground">Enabled</th>
                        <th className="p-4 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {managedAlerts.map((alert) => {
                        const AlertIcon = getAlertIcon(alert.type);
                        return (
                          <tr key={alert.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                            <td className="p-4">
                              <Checkbox 
                                checked={selectedAlerts.includes(alert.id)}
                                onCheckedChange={() => toggleAlertSelection(alert.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground hover:text-primary cursor-pointer">
                                  {alert.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <AlertIcon className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground">
                                  {alertTypeLabels[alert.type]}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground underline cursor-pointer hover:text-primary">
                                  {alert.search}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-muted-foreground">{alert.frequency}</span>
                            </td>
                            <td className="p-4">
                              <Switch checked={alert.enabled} />
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 hover:bg-muted rounded">
                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 bg-card">
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Alert Type Descriptions */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Alert Types</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(alertTypeDescriptions).slice(0, 6).map(([type, description]) => {
                      const AlertIcon = getAlertIcon(type as AlertType);
                      return (
                        <div key={type} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <AlertIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{alertTypeLabels[type as AlertType]}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
