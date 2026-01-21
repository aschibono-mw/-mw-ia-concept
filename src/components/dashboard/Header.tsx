import { Search, Sparkles, LayoutGrid, Bell, HelpCircle, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import meltwaterLogo from "@/assets/meltwater-logo.png";

export const Header = () => {
  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <img src={meltwaterLogo} alt="Meltwater" className="w-8 h-8" />
        <span className="text-lg font-semibold text-foreground">Meltwater</span>
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
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <Button variant="outline" className="gap-2 rounded-full px-4">
          Create
          <ChevronDown className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Sparkles className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
