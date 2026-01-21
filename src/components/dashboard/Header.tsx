import { Search, Wand2, LayoutGrid, Bell, HelpCircle, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import meltwaterLogo from "@/assets/meltwater-logo.png";

export const Header = () => {
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
        <Button variant="outline" className="gap-2 rounded-full px-5 h-10 border-border bg-background">
          Create
          <ChevronDown className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 ml-1">
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <Wand2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="w-11 h-11 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
