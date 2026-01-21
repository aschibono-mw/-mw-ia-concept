import { Home, Compass, BarChart2, Share2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", active: true },
  { icon: <Compass className="w-5 h-5" />, label: "Discover" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze" },
  { icon: <Share2 className="w-5 h-5" />, label: "Distribute" },
  { icon: <Users className="w-5 h-5" />, label: "Outreach" },
];

export const Sidebar = () => {
  return (
    <aside className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
            <path d="M12 4L4 8l8 4 8-4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-lg font-semibold text-foreground">Meltwater</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "text-sidebar-primary bg-sidebar-accent"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Promotional Space */}
        <div className="mt-8 pt-8 border-t border-sidebar-border">
          <p className="px-3 text-xs text-sidebar-muted font-medium uppercase tracking-wider">
            Promotional Space
          </p>
        </div>
      </nav>
    </aside>
  );
};
