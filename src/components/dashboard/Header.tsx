import { useState } from "react";
import { Search, Wand2, LayoutGrid, Bell, HelpCircle, User, ChevronDown, FileText, Mail, Newspaper, AlertCircle, Settings, ShieldCheck, LogOut, TrendingUp, Plus, Building2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import meltwaterLogo from "@/assets/meltwater-logo.png";

const createMenuItems = [
  { icon: Search, label: "Search" },
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: FileText, label: "Report" },
  { icon: Mail, label: "Outreach" },
  { icon: Newspaper, label: "Newsletter" },
  { icon: AlertCircle, label: "Alert" },
];

const alertsData = [
  {
    source: "Industry News Search",
    description: "Surge in Discussions on AI Market Trends"
  },
  {
    source: "Competitor Monitoring",
    description: "Increased Mentions of Product Launch"
  },
  {
    source: "Brand Mentions",
    description: "Social Media Buzz Around Campaign"
  },
  {
    source: "Crisis Watch",
    description: "Rising Sentiment on Customer Feedback"
  },
  {
    source: "Market Analysis",
    description: "Trending Topics in Tech Industry"
  }
];

export const Header = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center min-w-[200px]">
        <img src={meltwaterLogo} alt="Meltwater" className="h-[22px] w-auto" />
      </div>

      {/* Search Bar */}
      <div className="relative w-80 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search"
          className="pl-10 bg-background border-border rounded-full h-10"
        />
      </div>

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
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-card p-0">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm">Alerts</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {alertsData.map((alert, index) => (
                  <div key={index} className="px-3 py-2 border-b border-border hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground">{alert.source}</span>
                        <p className="text-sm text-foreground truncate">{alert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <DropdownMenuItem className="cursor-pointer justify-center">
                  View More
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer justify-center text-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Alert
                </DropdownMenuItem>
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
            <DropdownMenuContent align="end" className="w-56 bg-card">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Tony Schibono</span>
                  <span className="text-xs text-muted-foreground">tony.schibono@meltwater.com</span>
                </div>
              </div>
              
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer">
                <Building2 className="w-4 h-4 mr-2" />
                Account
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
