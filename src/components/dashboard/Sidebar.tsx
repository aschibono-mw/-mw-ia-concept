import { useState, useEffect } from "react";
import { Home, Compass, BarChart2, Rows3, Mail, Users, Sparkles, Bot, UsersRound, ChevronRight, Bell, FileText, FileStack, BarChart, Zap, Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import meltwaterIcon from "@/assets/meltwater-icon.svg";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  id: string;
  tip: string;
}

const topNavItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", path: "/home2", id: "home2", tip: "Your overview dashboard" },
];

const mainNavItems: NavItem[] = [
  { icon: <Search className="w-5 h-5" />,  label: "Search",   path: "/discover",     id: "discover",     tip: "Find and save searches across 300,000+ sources" },
  { icon: <Search className="w-5 h-5" />,  label: "Search+",  path: "/search-plus",  id: "search-plus",  tip: "Advanced search with analytics, discovery, and comparison" },
  { icon: <Rows3 className="w-5 h-5" />,   label: "Monitor",  path: "/monitor",      id: "monitor",      tip: "Track coverage in real-time streams"           },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze", path: "/analyze",  id: "analyze",  tip: "Dashboards and performance insights"            },
  { icon: <Zap className="w-5 h-5" />,     label: "Execute",  path: "/execute",  id: "execute",  tip: "AI-recommended next actions"                    },
  { icon: <Users className="w-5 h-5" />,   label: "Outreach", path: "/outreach", id: "outreach", tip: "Pitch and manage media contacts"                },
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

// Reusable nav link
function NavLink({
  to, activePage, id, tip, children,
}: {
  to: string;
  activePage: string;
  id: string;
  tip?: string;
  children: React.ReactNode;
}) {
  const linkEl = (
    <Link
      to={to}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        activePage === id
          ? "text-foreground bg-sidebar-accent"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {children}
    </Link>
  );

  if (!tip) return linkEl;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
      <TooltipContent side="right" className="z-[9999]">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
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
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {topNavItems.map((item) => (
            <li key={item.label}>
              <NavLink to={item.path} activePage={activePage} id={item.id} tip={item.tip}>
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mx-3 my-2 border-t border-sidebar-border" />

        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Workflow</p>

        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <NavLink to={item.path} activePage={activePage} id={item.id} tip={item.tip}>
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Tools</p>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/newsletters"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activePage === "newsletters"
                  ? "text-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0">
                <Mail className="w-3 h-3 text-white" />
              </div>
              Newsletters
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Design and send branded email newsletters</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/reports"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activePage === "reports"
                  ? "text-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0">
                <BarChart className="w-3 h-3 text-white" />
              </div>
              Reports
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Shareable reports for stakeholders</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Discover</p>

        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">AI-powered insights across all your media data</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Trending topics and social signals</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="https://klear.com/creators/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activePage === "klear"
                  ? "text-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                <Users className="w-3 h-3 text-white" />
              </div>
              Klear
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Influencer discovery and management</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="https://oauth.linkfluence.com/sso/pre-login?clientId=lCASlzEBUSoEdBWGfyAhfyQOMInIOy&redirect=https%3A%2F%2Fradarly.linkfluence.com%2Fsso%2Fredirect%3Fredirect%3Dhttps%253A%252F%252Fradarly.linkfluence.com%252Flogin"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activePage === "radarly"
                  ? "text-foreground bg-sidebar-accent"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0">
                <Eye className="w-3 h-3 text-white" />
              </div>
              Radarly
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Social listening and audience intelligence</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        <Tooltip>
          <TooltipTrigger asChild>
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
              Ask Mira
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[9999]">Your AI assistant for smarter media analysis</TooltipContent>
        </Tooltip>
      </nav>
      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
};
