import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Wand2, LayoutGrid, Bell, HelpCircle, User, ChevronDown, FileText, Mail, AlertCircle, ShieldCheck, LogOut, Building2, UserCircle, FolderOpen, Users, FileStack, Rows3, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import meltwaterIcon from "@/assets/meltwater-icon.svg";
import { mockAlerts } from "@/components/alerts/mockData";
import { getAlertIcon } from "@/components/alerts/alertIcons";
import { alertTypeLabels } from "@/components/alerts/types";

const createMenuItems = [
  { icon: Search, label: "Search" },
  { icon: Rows3, label: "Monitor" },
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: FileText, label: "Brief" },
  { icon: Send, label: "Pitch" },
  { icon: Mail, label: "Newsletter" },
  { icon: AlertCircle, label: "Alert" },
];

const pageTitles: Record<string, string> = {
  "/": "Meltwater",
  "/discover": "Explore",
  "/monitor": "Monitor",
  "/analyze": "Analyze",
  "/distribute": "Newsletters",
  "/outreach": "Outreach",
};

export const Header = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Meltwater";
  
  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <img src={meltwaterIcon} alt="Meltwater" className="h-4 w-auto" />
        <span className="text-xl font-semibold text-foreground">{pageTitle}</span>
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
              <DropdownMenuItem key={item.label} className="cursor-pointer group">
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
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center shadow-md">
                  3
                </span>
              </button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-card p-0">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm">Alerts</h3>
                </div>
                <div className="max-h-[28rem] overflow-y-auto">
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
                  <span className="text-sm text-foreground hover:text-primary cursor-pointer">View all alerts</span>
                  <span className="h-4 w-px bg-border" />
                  <span className="text-sm text-foreground hover:text-primary cursor-pointer">Manage alerts</span>
                </div>
              </DropdownMenuContent>
          </DropdownMenu>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">John Box</span>
                  <span className="text-xs text-muted-foreground">John.Box@meltwater.com</span>
                </div>
              </div>
              
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FolderOpen className="w-4 h-4 mr-2" />
                Asset Manager
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Saved Documents
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileStack className="w-4 h-4 mr-2" />
                Content Manager
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                Social Accounts
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <Building2 className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
