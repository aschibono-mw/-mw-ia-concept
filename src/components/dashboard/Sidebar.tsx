import { useState, useEffect } from "react";
import { Home, Compass, BarChart2, Rows3, Mail, Users, Sparkles, Bot, UsersRound, ChevronRight, ChevronDown, Bell, FileText, FileStack, BarChart, Zap, Search, Eye, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import meltwaterIcon from "@/assets/meltwater-icon.svg";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavMode } from "@/contexts/NavContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  id: string;
  tip: string;
  chevron?: boolean;
}

const currentNavItems: NavItem[] = [
  { icon: <Search className="w-5 h-5" />,    label: "Explore",         path: "/search",              id: "discover",   tip: "Find and save searches across 300,000+ sources", chevron: true },
  { icon: <Rows3 className="w-5 h-5" />,     label: "Monitor",         path: "/monitor-streams",     id: "monitor",    tip: "Track coverage in real-time streams" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze",         path: "/analyze-dashboard",   id: "analyze",    tip: "Dashboards and performance insights" },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: "Engage", path: "/execute", id: "engage", tip: "Engage influencers and grow your social presence", chevron: true },
  { icon: <Users className="w-5 h-5" />,     label: "Media Relations", path: "/outreach-campaigns",  id: "outreach",   tip: "Manage journalist relationships, pitches, and PR campaigns", chevron: true },
  { icon: <Mail className="w-5 h-5" />,      label: "Newsletters",     path: "/newsletters",         id: "newsletters", tip: "Design and send branded email newsletters" },
];

const futureNavItems: NavItem[] = [
  { icon: <Search className="w-5 h-5" />,    label: "Search",   path: "/future/search",              id: "discover",   tip: "Find and save searches across 300,000+ sources" },
  { icon: <Rows3 className="w-5 h-5" />,     label: "Monitor",  path: "/future/monitor-streams",     id: "monitor",    tip: "Track coverage in real-time streams" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Analyze",  path: "/future/analyze-dashboard",   id: "analyze",    tip: "Dashboards and performance insights" },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: "Engage", path: "/future/execute", id: "engage", tip: "Engage influencers and grow your social presence" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Execute",  path: "/future/execute",             id: "execute",    tip: "AI-recommended next actions" },
  { icon: <Mail className="w-5 h-5" />,     label: "Send",     path: "/newsletters",                id: "newsletters", tip: "Design and send branded email newsletters" },
  { icon: <Users className="w-5 h-5" />,    label: "Outreach", path: "/future/outreach-campaigns",  id: "outreach",   tip: "Manage journalist relationships, pitches, and PR campaigns" },
];

const topNavItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", path: "/home2-dashboard", id: "home2", tip: "Your overview dashboard" },
];

interface PromoCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}

const promoCards: PromoCard[] = [
  { icon: <Sparkles className="w-5 h-5" />, title: "GenAI Lens", description: "AI-powered insights across all your media data", cta: "Try it now" },
  { icon: <Bot className="w-5 h-5" />, title: "Mira Companion", description: "Your AI assistant for smarter media analysis", cta: "Meet Mira" },
  { icon: <UsersRound className="w-5 h-5" />, title: "Audience Segments", description: "Deep audience insights powered by intelligence", cta: "Explore" },
];

interface SidebarProps {
  activePage?: string;
}

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
      <TooltipContent side="right" className="z-[99999] pointer-events-none" style={{ zIndex: 99999 }}>{tip}</TooltipContent>
    </Tooltip>
  );
}

const mediaRelationsSubItems = [
  { label: "Media Lists",   path: "/outreach-campaigns" },
  { label: "Search",        path: "/outreach-campaigns" },
  { label: "Outreach",      path: "/outreach-campaigns" },
  { label: "PR Assistant",  path: "/outreach-campaigns" },
];

const engageSubItems = [
  { label: "Conversations", path: "/execute", beta: false },
  { label: "Publish",       path: "/execute", beta: false },
  { label: "Asset Library", path: "/execute", beta: false },
  { label: "Measure",       path: "/execute", beta: false },
  { label: "Advertise",     path: "/execute", beta: true },
];

const exploreSubItems = [
  { label: "Searches",           path: "/search" },
  { label: "Optimized searches", path: "/search" },
  { label: "Compare",            path: "/search" },
  { label: "Discover",           path: "/search" },
  { label: "Analytics",          path: "/search" },
  { label: "Author Segments",    path: "/author-segments" },
  { label: "Tags",               path: "/search" },
  { label: "Rules",              path: "/search" },
  { label: "Author lists",       path: "/search" },
  { label: "Filter sets",        path: "/search" },
];

export const Sidebar = ({ activePage = "home" }: SidebarProps) => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = (id: string) => setOpenMenu((prev) => (prev === id ? null : id));
  const exploreOpen = openMenu === "discover";
  const engageOpen = openMenu === "engage";
  const mediaRelationsOpen = openMenu === "outreach";
  const navMode = useNavMode();
  const isFuture = navMode === "future";
  const mainNavItems = isFuture ? futureNavItems : currentNavItems;
  const prefix = isFuture ? "/future" : "";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoCards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-52 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-16" style={{ zIndex: 50 }}>
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {topNavItems.map((item) => (
            <li key={item.label}>
              <NavLink to={isFuture ? `${prefix}/home2-dashboard` : item.path} activePage={activePage} id={item.id} tip={item.tip}>
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              {item.id === "outreach" && item.chevron ? (
                <>
                  <button
                    onClick={() => toggleMenu("outreach")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activePage === item.id
                        ? "text-foreground bg-sidebar-accent"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform", mediaRelationsOpen && "rotate-180")} />
                  </button>
                  {mediaRelationsOpen && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-3">
                      {mediaRelationsSubItems.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            className="block px-2 py-1.5 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.id === "engage" && item.chevron ? (
                <>
                  <button
                    onClick={() => toggleMenu("engage")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activePage === item.id
                        ? "text-foreground bg-sidebar-accent"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform", engageOpen && "rotate-180")} />
                  </button>
                  {engageOpen && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-3">
                      {engageSubItems.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                          >
                            {sub.label}
                            {sub.beta && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border" style={{ color: "#B627A1", borderColor: "#B627A1" }}>Beta</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.id === "discover" && item.chevron ? (
                <>
                  <button
                    onClick={() => toggleMenu("discover")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activePage === item.id
                        ? "text-foreground bg-sidebar-accent"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform", exploreOpen && "rotate-180")} />
                  </button>
                  {exploreOpen && (
                    <ul className="mt-1 ml-4 space-y-0.5 border-l border-sidebar-border pl-3">
                      {exploreSubItems.map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.path}
                            className="block px-2 py-1.5 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={item.path} activePage={activePage} id={item.id} tip={item.tip}>
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.chevron && <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mx-3 my-3 border-t border-sidebar-border" />

        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Discover</p>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`${prefix}/genai-lens-explore`}
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
          <TooltipContent side="right" className="z-[99999] pointer-events-none" style={{ zIndex: 99999 }}>AI-powered insights across all your media data</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`${prefix}/social-trends-explore`}
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
          <TooltipContent side="right" className="z-[99999] pointer-events-none" style={{ zIndex: 99999 }}>Trending topics and social signals</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={`${prefix}/mira`}
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
              {isFuture ? "Ask Mira" : "Mira Studio"}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-[99999] pointer-events-none" style={{ zIndex: 99999 }}>Your AI assistant for smarter media analysis</TooltipContent>
        </Tooltip>
      </nav>
      <div className="flex-1" />
    </aside>
  );
};
