import { useState } from "react";
import { Search, Wand2, LayoutGrid, Bell, HelpCircle, User, ChevronDown, FileText, PieChart, Mail, Newspaper, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
              <DropdownMenuItem key={item.label} className="cursor-pointer">
                <item.icon className="w-4 h-4 mr-2 text-muted-foreground" />
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
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
