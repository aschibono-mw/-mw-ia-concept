import { Home, Compass, BarChart2, Share2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", path: "/", id: "home" },
  { icon: <Compass className="w-5 h-5" />, label: "Discover", path: "/discover", id: "discover" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze", path: "/analyze", id: "analyze" },
  { icon: <Share2 className="w-5 h-5" />, label: "Distribute", path: "/distribute", id: "distribute" },
  { icon: <Users className="w-5 h-5" />, label: "Outreach", path: "/outreach", id: "outreach" },
];

interface SidebarProps {
  activePage?: string;
}

export const Sidebar = ({ activePage = "home" }: SidebarProps) => {
  return (
    <aside className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-16">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activePage === item.id
                    ? "text-foreground bg-sidebar-accent"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
