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
    <aside className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-16">
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
