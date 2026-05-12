import { useState, useEffect } from "react";
import { Home, Compass, BarChart2, Rows3, Mail, Users, Sparkles, Bot, UsersRound, ChevronRight, Bell, FileText, FileStack, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import meltwaterIcon from "@/assets/meltwater-icon.svg";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", path: "/", id: "home" },
  { icon: <Compass className="w-5 h-5" />, label: "Explore", path: "/discover", id: "discover" },
  { icon: <Rows3 className="w-5 h-5" />, label: "Monitor", path: "/monitor", id: "monitor" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze", path: "/analyze", id: "analyze" },
  { icon: <Mail className="w-5 h-5" />, label: "Newsletters", path: "/newsletters", id: "newsletters" },
  { icon: <Users className="w-5 h-5" />, label: "Outreach", path: "/outreach", id: "outreach" },
  { icon: <BarChart className="w-5 h-5" />, label: "Reports", path: "/reports", id: "reports" },
];

interface PromoCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}

const promoCards: PromoCard[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "GenAI Lens",
    description: "AI-powered insights across all your media data",
    cta: "Try it now"
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: "Mira Companion",
    description: "Your AI assistant for smarter media analysis",
    cta: "Meet Mira"
  },
  {
    icon: <UsersRound className="w-5 h-5" />,
    title: "Audience Segments",
    description: "Deep audience insights powered by intelligence",
    cta: "Explore"
  },
];

interface SidebarProps {
  activePage?: string;
}

export const Sidebar = ({ activePage = "home" }: SidebarProps) => {
  const [currentPromo, setCurrentPromo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoCards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-16">
      {/* Navigation */}
      <nav className="px-3 py-4">
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

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        {/* Social Trends */}
        <Link
          to="/social-trends"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activePage === "social-trends"
              ? "text-foreground bg-sidebar-accent"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0">
            <BarChart2 className="w-3 h-3 text-white" />
          </div>
          Social Trends
        </Link>

        {/* GenAI Lens */}
        <Link
          to="/genai-lens"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activePage === "genai-lens"
              ? "text-foreground bg-sidebar-accent"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          GenAI Lens
        </Link>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        {/* Mira Studio */}
        <Link
          to="/mira"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activePage === "mira"
              ? "text-foreground bg-sidebar-accent"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center shrink-0">
            <img src={meltwaterIcon} alt="Mira" className="w-3 h-3 brightness-0 invert" />
          </div>
          Mira Studio
        </Link>
      </nav>
      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
};
