import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Wand2, LayoutGrid, Bell, HelpCircle, User, ChevronDown, FileText, Mail, AlertCircle, ShieldCheck, LogOut, Building2, UserCircle, FolderOpen, Users, FileStack, Rows3, Send, ChevronRight, ChevronLeft, Check, FolderKanban, Grid2x2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import meltwaterIcon from "@/assets/meltwater-icon.svg";
import { mockAlerts } from "@/components/alerts/mockData";
import { getAlertIcon } from "@/components/alerts/alertIcons";
import { alertTypeLabels } from "@/components/alerts/types";
import { mockNotifications } from "@/components/notifications/mockData";
import { getNotificationIcon } from "@/components/notifications/notificationIcons";
import { notificationTypeLabels } from "@/components/notifications/types";

const createMenuItems = [
  { icon: Search, label: "Search" },
  { icon: Rows3, label: "Monitor" },
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: FileText, label: "Report" },
  { icon: FileStack, label: "Digest" },
  { icon: Send, label: "Outreach" },
  { icon: Mail, label: "Newsletter" },
  { icon: AlertCircle, label: "Alert" },
];

const pageTitles: Record<string, string> = {
  "/": "Meltwater",
  "/home2": "Home",
  "/discover": "Explore",
  "/search": "Explore",
  "/home2-dashboard": "Home",
  "/monitor-streams": "Monitor",
  "/analyze-dashboard": "Analyze",
  "/outreach-campaigns": "Outreach",
  "/genai-lens-explore": "GenAI Lens",
  "/social-trends-explore": "Social Trends",
  "/reports-library": "Reports",
  "/search-plus": "Explore+",
  "/search-plus-hub": "Explore+",
  "/monitor": "Monitor",
  "/analyze": "Analyze",
  "/distribute": "Newsletters",
  "/newsletters": "Newsletters",
  "/outreach": "Outreach",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/digests": "Digests",
  "/mira": "Ask Mira",
  "/content-manager": "Assets",
  "/projects-manager": "Projects",
  "/account": "Account",
  "/genai-lens": "GenAI Lens",
  "/social-trends": "Social Trends",
  "/execute": "Engage",
  "/engage":"Execute",
  "/outreach": "Outreach",
};

const unreadAlertsCount = mockAlerts.filter(a => !a.isRead).length;
const unreadNotificationsCount = mockNotifications.filter(n => !n.isRead).length;
const totalUnreadCount = unreadAlertsCount + unreadNotificationsCount;

const accounts = [
  { id: "1", name: "Company Demo" },
  { id: "2", name: "Meltwater Product" },
  { id: "3", name: "mLabs prod" },
  { id: "4", name: "Phoenix" },
  { id: "5", name: "Tony Schibono's Buddy Account" },
];

const workspaces = [
  { id: "1", name: "Brand & Comms" },
  { id: "2", name: "Competitive Intel" },
  { id: "3", name: "Executive Insights" },
];

export const Header = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [bellTab, setBellTab] = useState<string>("alerts");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuView, setUserMenuView] = useState<"menu" | "accounts" | "workspaces">("menu");
  const [activeAccountId, setActiveAccountId] = useState("5");
  const [accountSearch, setAccountSearch] = useState("");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("1");
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageTitles[location.pathname] ||
    (location.pathname.startsWith("/search-detail/")
      ? decodeURIComponent(location.pathname.replace("/search-detail/", ""))
      : location.pathname.startsWith("/analyze-detail/")
      ? decodeURIComponent(location.pathname.replace("/analyze-detail/", ""))
      : "Meltwater");

  const activeAccount = accounts.find((a) => a.id === activeAccountId)!;
  const filteredAccounts = accounts.filter((a) =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase())
  );
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId)!;
  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  const handleUserMenuOpenChange = (open: boolean) => {
    setUserMenuOpen(open);
    if (!open) {
      // Reset to main menu view when closing
      setTimeout(() => {
        setUserMenuView("menu");
        setAccountSearch("");
        setWorkspaceSearch("");
      }, 150);
    }
  };

  const handleCreateMenuClick = (label: string) => {
    if (label === "Search") {
      // If already on Explore page, dispatch event to open builder
      if (location.pathname === "/discover") {
        window.dispatchEvent(new CustomEvent('openSearchBuilder'));
      } else {
        navigate("/discover?openBuilder=true");
      }
      setIsCreateOpen(false);
    } else if (label === "Dashboard") {
      // If already on Analyze page, dispatch event to open drawer
      if (location.pathname === "/analyze") {
        window.dispatchEvent(new CustomEvent('openDashboardDrawer'));
      } else {
        navigate("/analyze?openDrawer=true");
      }
      setIsCreateOpen(false);
    }
  };
  
  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
      {/* Logo and Title */}
      <div className="flex items-center gap-1.5 min-w-[200px]">
        <img src={meltwaterIcon} alt="Meltwater" className="h-4 w-auto" style={{ filter: "brightness(0)" }} />
        <span className="text-xl font-bold font-nunito text-foreground">{pageTitle}</span>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Right Actions */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <DropdownMenu open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`gap-2 rounded-full px-5 h-10 border-border bg-white hover:bg-gray-100 hover:text-foreground ${isCreateOpen ? 'bg-gray-100' : ''}`}
            >
              Create
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-lg z-50">
            {createMenuItems.map((item) => (
              <DropdownMenuItem 
                key={item.label} 
                className="cursor-pointer group"
                onClick={() => handleCreateMenuClick(item.label)}
              >
                <item.icon className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-white" />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 ml-1">
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <Wand2 className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                {totalUnreadCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 w-5 h-5 text-white text-xs font-medium rounded-full flex items-center justify-center shadow-md"
                    style={{ background: 'var(--gradient-badge)' }}
                  >
                    {totalUnreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-card p-0">
                <Tabs value={bellTab} onValueChange={setBellTab} className="w-full">
                  <div className="border-b border-border">
                    <TabsList className="w-full h-auto p-0 bg-transparent rounded-none">
                      <TabsTrigger 
                        value="alerts" 
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-sm font-medium"
                      >
                        Alerts
                        {unreadAlertsCount > 0 && (
                          <span className="ml-1.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full inline-flex items-center justify-center">
                            {unreadAlertsCount}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-notification data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 text-sm font-medium"
                      >
                        Notifications
                        {unreadNotificationsCount > 0 && (
                          <span className="ml-1.5 w-5 h-5 bg-notification text-white text-xs font-medium rounded-full inline-flex items-center justify-center">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="alerts" className="m-0">
                    <div className="max-h-[24rem] overflow-y-auto">
                      {mockAlerts.map((alert) => {
                        const AlertIcon = getAlertIcon(alert.type);
                        return (
                          <div 
                            key={alert.id} 
                            className={`px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer ${!alert.isRead ? 'bg-primary/5' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!alert.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                                <AlertIcon className={`w-4 h-4 ${!alert.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <span className={`text-xs ${!alert.isRead ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                    {alertTypeLabels[alert.type]}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                </div>
                                <p className={`text-sm text-foreground ${!alert.isRead ? 'font-semibold' : ''}`}>
                                  {alert.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {alert.description}
                                </p>
                                <span className="text-xs text-muted-foreground/70 mt-1 block">
                                  {alert.source}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-3 border-t border-border flex items-center justify-center gap-4">
                      <a href="/alerts" className="text-sm text-foreground hover:text-primary cursor-pointer">View all</a>
                      <span className="h-4 w-px bg-border" />
                      <span className="text-sm text-foreground hover:text-primary cursor-pointer">Mark all as read</span>
                      <span className="h-4 w-px bg-border" />
                      <a href="/alerts?tab=manage" className="text-sm text-foreground hover:text-primary cursor-pointer">Manage alerts</a>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="m-0">
                    <div className="max-h-[24rem] overflow-y-auto">
                      {mockNotifications.map((notification) => {
                        const NotifIcon = getNotificationIcon(notification.type);
                        return (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer ${!notification.isRead ? 'bg-notification/5' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.isRead ? 'bg-notification/10' : 'bg-muted'}`}>
                                <NotifIcon className={`w-4 h-4 ${!notification.isRead ? 'text-notification' : 'text-muted-foreground'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <span className={`text-xs ${!notification.isRead ? 'text-notification font-medium' : 'text-muted-foreground'}`}>
                                    {notificationTypeLabels[notification.type]}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                                </div>
                                <p className={`text-sm text-foreground ${!notification.isRead ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {notification.description}
                                </p>
                                {notification.actionLabel && (
                                  <span className="text-xs text-notification font-medium mt-1.5 inline-block hover:underline">
                                    {notification.actionLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-3 border-t border-border flex items-center justify-center gap-3 whitespace-nowrap">
                      <a href="/alerts?tab=all-notifications" className="text-xs text-foreground hover:text-primary cursor-pointer">View all</a>
                      <span className="h-4 w-px bg-border" />
                      <span className="text-xs text-foreground hover:text-primary cursor-pointer">Mark all as read</span>
                      <span className="h-4 w-px bg-border" />
                      <a href="/alerts?tab=notifications" className="text-xs text-foreground hover:text-primary cursor-pointer">Manage notifications</a>
                    </div>
                  </TabsContent>
                </Tabs>
              </DropdownMenuContent>
          </DropdownMenu>
          {/* More from Meltwater */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
                <Grid2x2 className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">More from Meltwater</p>
              <a
                href="https://klear.com/creators/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2 block"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0,130,127,0.10)" }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00827F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Klear</p>
                  <p className="text-xs text-muted-foreground leading-snug">Build, scale and measure influencer marketing campaigns</p>
                </div>
              </a>
              <a
                href="https://oauth.linkfluence.com/sso/pre-login?clientId=lCASlzEBUSoEdBWGfyAhfyQOMInIOy&redirect=https%3A%2F%2Fradarly.linkfluence.com%2Fsso%2Fredirect%3Fredirect%3Dhttps%253A%252F%252Fradarly.linkfluence.com%252Flogin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors block"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0,130,127,0.10)" }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="#00827F" strokeWidth="2"/>
                    <path d="M2 12h3M19 12h3M12 2v3M12 19v3" stroke="#00827F" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="#00827F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Radarly</p>
                  <p className="text-xs text-muted-foreground leading-snug">Conduct real-time consumer research with AI-enabled insights</p>
                </div>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <DropdownMenu open={userMenuOpen} onOpenChange={handleUserMenuOpenChange}>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card p-0 overflow-hidden">

              {/* ── MAIN MENU VIEW ── */}
              {userMenuView === "menu" && (
                <>
                  {/* User info */}
                  <div
                    className="flex items-center gap-3 p-3 border-b border-border cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm hover:underline">John Box</span>
                      <span className="text-xs text-muted-foreground truncate">John.Box@meltwater.com</span>
                    </div>
                  </div>

                  {/* Account switcher row */}
                  <DropdownMenuItem
                    className="cursor-pointer mx-1 mt-1 rounded-md"
                    onSelect={(e) => {
                      e.preventDefault();
                      setUserMenuView("accounts");
                      setAccountSearch("");
                    }}
                  >
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground leading-none mb-0.5">Account</span>
                      <span className="text-sm font-medium truncate">{activeAccount.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-1" />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Workspace switcher row */}
                  <DropdownMenuItem
                    className="cursor-pointer mx-1 rounded-md"
                    onSelect={(e) => {
                      e.preventDefault();
                      setUserMenuView("workspaces");
                      setWorkspaceSearch("");
                    }}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground leading-none mb-0.5">Workspace</span>
                      <span className="text-sm font-medium truncate">{activeWorkspace.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-1" />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer mx-1 rounded-md" onClick={() => navigate("/profile")}>
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">Update your personal details and preferences</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer mx-1 rounded-md" onClick={() => navigate("/account")}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Account
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">Manage your organization's settings, billing, and subscription details</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer mx-1 rounded-md" onClick={() => navigate("/content-manager")}>
                        <FileStack className="w-4 h-4 mr-2" />
                        Assets
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">Manage your brand assets and templates</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer mx-1 rounded-md" onClick={() => navigate("/projects-manager")}>
                        <FolderKanban className="w-4 h-4 mr-2" />
                        Projects
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">Bundle your searches, dashboards, and reports into focused workspaces</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer mx-1 rounded-md" onClick={() => navigate("/social-accounts")}>
                        <Users className="w-4 h-4 mr-2" />
                        Social Connections
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="left">Add your social accounts and define monitored topics and hashtags</TooltipContent>
                  </Tooltip>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="cursor-pointer mx-1 mb-1 rounded-md text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              )}

              {/* ── ACCOUNT SWITCHER VIEW ── */}
              {userMenuView === "accounts" && (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                    <button
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setUserMenuView("menu")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="font-medium">Accounts</span>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Find account</p>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        className="w-full pl-7 pr-3 py-1.5 text-sm bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder=""
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Account list */}
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {filteredAccounts.map((account) => (
                      <DropdownMenuItem
                        key={account.id}
                        className="cursor-pointer mx-1 rounded-md flex items-center justify-between"
                        onSelect={(e) => {
                          e.preventDefault();
                          setActiveAccountId(account.id);
                          setUserMenuView("menu");
                          setAccountSearch("");
                        }}
                      >
                        <span className={`text-sm ${account.id === activeAccountId ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {account.name}
                        </span>
                        {account.id === activeAccountId && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    {filteredAccounts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No accounts found</p>
                    )}
                  </div>
                </>
              )}

              {/* ── WORKSPACE SWITCHER VIEW ── */}
              {userMenuView === "workspaces" && (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                    <button
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setUserMenuView("menu")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="font-medium">Workspaces</span>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">Find workspace</p>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        className="w-full pl-7 pr-3 py-1.5 text-sm bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder=""
                        value={workspaceSearch}
                        onChange={(e) => setWorkspaceSearch(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Workspace list */}
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {filteredWorkspaces.map((workspace) => (
                      <DropdownMenuItem
                        key={workspace.id}
                        className="cursor-pointer mx-1 rounded-md flex items-center justify-between"
                        onSelect={(e) => {
                          e.preventDefault();
                          setActiveWorkspaceId(workspace.id);
                          setUserMenuView("menu");
                          setWorkspaceSearch("");
                        }}
                      >
                        <span className={`text-sm ${workspace.id === activeWorkspaceId ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {workspace.name}
                        </span>
                        {workspace.id === activeWorkspaceId && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    {filteredWorkspaces.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No workspaces found</p>
                    )}
                  </div>

                  <div className="border-t border-border px-1 py-1">
                    <DropdownMenuItem className="cursor-pointer rounded-md text-muted-foreground">
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      Manage Workspaces
                    </DropdownMenuItem>
                  </div>
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
