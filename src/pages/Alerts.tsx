import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAlerts } from "@/components/alerts/mockData";
import { mockNotifications } from "@/components/notifications/mockData";
import { notificationTypeLabels } from "@/components/notifications/types";
import { getNotificationIcon } from "@/components/notifications/notificationIcons";
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
import { ExpandableSearch } from "@/components/alerts/ExpandableSearch";
import { CreateAlertDialog } from "@/components/alerts/CreateAlertDialog";
import { ManageNotificationsTab } from "@/components/alerts/ManageNotificationsTab";

// Mock data for managed alerts (alert configurations)
const managedAlerts = [
  { id: "1", name: "Brand Crisis Monitor", subtitle: "Brand Coverage, Crisis Keywords", purpose: "Crisis", urgency: "Urgent", delivery: "Email, Slack", enabled: true, lastTriggered: "2 hours ago", type: "spike_detection" as AlertType },
  { id: "2", name: "Competitor Launch Tracker", subtitle: "Competitor A, Product Launches", purpose: "Competitor", urgency: "Important", delivery: "Email", enabled: true, lastTriggered: "Yesterday", type: "sentiment_shift" as AlertType },
  { id: "3", name: "Campaign Performance", subtitle: "Summer Campaign 2026", purpose: "Campaign", urgency: "All", delivery: "Slack", enabled: true, lastTriggered: "3 days ago", type: "company_events" as AlertType },
  { id: "4", name: "CEO Mentions", subtitle: "CEO Name, Executive Team", purpose: "Executive", urgency: "Important", delivery: "Email, In-app", enabled: false, lastTriggered: "1 week ago", type: "top_reach" as AlertType },
  { id: "5", name: "Industry News Daily", subtitle: "Industry Keywords", purpose: "Custom", urgency: "All", delivery: "Email", enabled: true, lastTriggered: "Today", type: "industry_events" as AlertType },
  { id: "6", name: "Social Influencers", subtitle: "Influencer Mentions Tracker", purpose: "Executive", urgency: "Urgent", delivery: "Email, Slack", enabled: true, lastTriggered: "5 hours ago", type: "x_influencer" as AlertType },
  { id: "7", name: "Product Launches", subtitle: "Competitor Product Launches", purpose: "Competitor", urgency: "All", delivery: "In-app", enabled: false, lastTriggered: "2 weeks ago", type: "company_events" as AlertType },
  { id: "8", name: "Earnings Coverage", subtitle: "Earnings Call Mentions", purpose: "Campaign", urgency: "Important", delivery: "Email", enabled: true, lastTriggered: "Yesterday", type: "top_reach" as AlertType },
];

const purposeColors: Record<string, string> = {
  Crisis: "bg-red-100 text-red-700",
  Competitor: "bg-blue-100 text-blue-700",
  Campaign: "bg-green-100 text-green-700",
  Executive: "bg-teal-100 text-teal-700",
  Custom: "bg-gray-100 text-gray-600",
};

const urgencyColors: Record<string, string> = {
  Urgent: "bg-orange-100 text-orange-700",
  Important: "bg-yellow-100 text-yellow-700",
  All: "bg-gray-100 text-gray-500",
};

const viewCategories = [
  { label: "All", count: 8, color: "text-primary" },
  { label: "Urgent", count: 2, color: "text-red-500" },
  { label: "Paused", count: 1, color: "text-muted-foreground" },
  { label: "Needs attention", count: 1, color: "text-orange-500" },
  { label: "My alerts", count: 5, color: "text-muted-foreground" },
  { label: "Team alerts", count: 3, color: "text-muted-foreground" },
];

const Alerts = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === "manage" ? "manage" : tabFromUrl === "notifications" ? "notifications" : tabFromUrl === "all-notifications" ? "all-notifications" : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [createAlertOpen, setCreateAlertOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All");

  // Sync tab with URL parameter
  useEffect(() => {
    if (tabFromUrl === "manage") {
      setActiveTab("manage");
    } else if (tabFromUrl === "notifications") {
      setActiveTab("notifications");
    } else if (tabFromUrl === "all-notifications") {
      setActiveTab("all-notifications");
    }
  }, [tabFromUrl]);

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
              <Button className="gap-2" onClick={() => setCreateAlertOpen(true)}>
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
                  <TabsTrigger value="all-notifications" className="gap-2">
                    All Notifications
                    {mockNotifications.filter(n => !n.isRead).length > 0 && (
                      <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full inline-flex items-center justify-center">
                        {mockNotifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="manage">Manage Alerts</TabsTrigger>
                  <TabsTrigger value="notifications">Manage Notifications</TabsTrigger>
                </TabsList>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                  <ExpandableSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search alerts..."
                    inactivityTimeout={5000}
                  />
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
                <div className="flex gap-6">
                  {/* Views Sidebar */}
                  <div className="w-48 flex-shrink-0">
                    <div className="bg-card rounded-lg border border-border p-4">
                      <h3 className="font-semibold text-card-foreground mb-3">Views</h3>
                      <div className="divide-y divide-border">
                        {viewCategories.map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => setSelectedView(cat.label)}
                            className={`flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-muted/50 transition-colors ${selectedView === cat.label ? "bg-muted font-medium" : ""}`}
                          >
                            <span className={cat.label === "Urgent" || cat.label === "Needs attention" ? cat.color : "text-foreground"}>
                              {cat.label}
                            </span>
                            <span className={`text-xs ${selectedView === cat.label ? "text-primary" : "text-muted-foreground"}`}>{cat.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 bg-card rounded-lg border border-border">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="text-sm font-bold text-foreground">{selectedView} <span className="text-foreground font-normal">({managedAlerts.filter(a => {
                        if (selectedView === "All") return true;
                        if (selectedView === "Urgent") return a.urgency === "Urgent";
                        if (selectedView === "Paused") return !a.enabled;
                        if (selectedView === "Needs attention") return a.urgency === "Important";
                        if (selectedView === "My alerts") return ["1","3","5","6","8"].includes(a.id);
                        if (selectedView === "Team alerts") return ["2","4","7"].includes(a.id);
                        return true;
                      }).length} alerts)</span></span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="p-4 text-sm font-bold text-foreground">Name</th>
                          <th className="p-4 text-sm font-bold text-foreground">Purpose</th>
                          <th className="p-4 text-sm font-bold text-foreground">Urgency</th>
                          <th className="p-4 text-sm font-bold text-foreground">Delivery</th>
                          <th className="p-4 text-sm font-bold text-foreground">Status</th>
                          <th className="p-4 text-sm font-bold text-foreground">Last Triggered</th>
                          <th className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {managedAlerts.filter(a => {
                          if (selectedView === "All") return true;
                          if (selectedView === "Urgent") return a.urgency === "Urgent";
                          if (selectedView === "Paused") return !a.enabled;
                          if (selectedView === "Needs attention") return a.urgency === "Important";
                          if (selectedView === "My alerts") return ["1","3","5","6","8"].includes(a.id);
                          if (selectedView === "Team alerts") return ["2","4","7"].includes(a.id);
                          return true;
                        }).map((alert) => (
                          <tr key={alert.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                            <td className="px-4 py-3.5">
                              <div>
                                <p className="text-sm font-medium text-foreground">{alert.name}</p>
                                <p className="text-xs text-muted-foreground">{alert.subtitle}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${purposeColors[alert.purpose] || "bg-muted text-muted-foreground"}`}>
                                {alert.purpose}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${urgencyColors[alert.urgency] || "bg-muted text-muted-foreground"}`}>
                                {alert.urgency}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-sm text-muted-foreground">{alert.delivery}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <Switch checked={alert.enabled} />
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-sm text-muted-foreground">{alert.lastTriggered}</span>
                            </td>
                            <td className="px-4 py-3.5">
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
                        ))}
                      </tbody>
                    </table>
                    <div className="px-4 py-2.5 border-t border-border text-right">
                      <span className="text-xs text-muted-foreground">1-{managedAlerts.length} of {managedAlerts.length}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* All Notifications Tab */}
              <TabsContent value="all-notifications" className="mt-0">
                <div className="bg-card rounded-lg border border-border">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-medium text-foreground">
                      {mockNotifications.length} notifications
                    </span>
                    <button className="text-sm text-primary hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockNotifications.map((notification) => {
                      const NotifIcon = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`px-4 py-4 hover:bg-muted/50 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                              <NotifIcon className={`w-5 h-5 ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className={`text-xs ${!notification.isRead ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                  {notificationTypeLabels[notification.type]}
                                </span>
                                <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                              </div>
                              <p className={`text-sm text-foreground mb-1 ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.description}
                              </p>
                              {notification.actionLabel && (
                                <button className="text-sm text-primary hover:underline mt-1.5">
                                  {notification.actionLabel}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Manage Notifications Tab */}
              <TabsContent value="notifications" className="mt-0">
                <ManageNotificationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
        <CreateAlertDialog open={createAlertOpen} onOpenChange={setCreateAlertOpen} />
    </div>
  );
};

export default Alerts;
