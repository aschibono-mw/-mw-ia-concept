import { useState, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Sparkles, TrendingUp, Search, LayoutGrid, Bell, ChevronRight,
  Info, BookOpen, Zap, Users, FileText, Eye, Newspaper, Plus,
  ChevronLeft, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TEAL = "#00827F";

const recentSearches = [
  { name: "Tesla Brand",   trend: [20,22,19,28,35,30,38], last: "May 12 · 10:16 AM" },
  { name: "Cybertruck",    trend: [30,28,32,25,20,22,18], last: "May 12 · 10:16 AM" },
  { name: "Elon Musk",     trend: [15,18,20,22,28,35,42], last: "May 12 · 10:16 AM" },
  { name: "Space X",       trend: [40,38,35,30,28,25,22], last: "May 12 · 10:16 AM" },
  { name: "Model S",       trend: [10,12,15,14,18,20,19], last: "May 12 · 10:16 AM" },
];

const recentDashboards = [
  { name: "Tesla Brand",       usedIn: "5 places",  lastEdited: "Oct 13, 2025" },
  { name: "Competitors",       usedIn: "2 places",  lastEdited: "Oct 13, 2025" },
  { name: "Crypto Markets",    usedIn: "1 place",   lastEdited: "Oct 13, 2025" },
  { name: "Space X vs Tesla",  usedIn: "15 places", lastEdited: "Oct 13, 2025" },
  { name: "Cybertruck Launch", usedIn: "3 places",  lastEdited: "Oct 11, 2025" },
];

const recentAlerts = [
  { type: "Spike Detection", time: "2 min ago",  text: "Brand mentions spiked 63% on X following cryptic product teaser videos — analysts speculate affordable Model Y launch imminent." },
  { type: "Spike Detection", time: "25 min ago", text: "Tesla Cybertruck recall coverage surging across 8,400+ automotive and news sources, driving negative sentiment to a 30-day high." },
  { type: "Spike Detection", time: "1 hr ago",   text: "Elon Musk's latest X post referencing Tesla's Robotaxi program generated 160k+ engagements within 4 hours." },
];

const insightChartPoints = [20, 22, 20, 35, 60, 55, 40, 38];

const resourceCards = [
  { icon: Search,    title: "Explore Insights and Trends",      desc: "Create and manage searches to monitor brand, competitor, and industry coverage." },
  { icon: Eye,       title: "Monitor Media Coverage",           desc: "Personalise your monitoring experience to easily view, organise, and share coverage." },
  { icon: Users,     title: "Engage on Social Media",           desc: "Manage social media marketing across your connected channels." },
  { icon: FileText,  title: "Report on Media Coverage",         desc: "Access and manage all of your reports." },
  { icon: Newspaper, title: "Find and Engage Journalists",      desc: "Conduct media research, manage lists, and pitch relevant story ideas." },
  { icon: Sparkles,  title: "GenAI Lens",                       desc: "Understand audiences, identify new ones, generate author lists, and more." },
];

// ── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ values, color = "#22c55e" }: { values: number[]; color?: string }) => {
  const w = 64, h = 24, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" points={pts} />
    </svg>
  );
};

// ── Hero chart ────────────────────────────────────────────────────────────────
const CHART_DATES = ["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12","Apr 12"];

const HeroChart = () => {
  const w = 1000, h = 160, topPad = 36, bottomPad = 12, sidePad = 12;
  const vals = insightChartPoints;
  const min = 0, max = 70;
  const chartH = h - topPad - bottomPad;

  const pts = vals.map((v, i) => {
    const x = sidePad + (i / (vals.length - 1)) * (w - sidePad * 2);
    const y = topPad + (1 - (v - min) / (max - min)) * chartH;
    return { x, y, str: `${x},${y}` };
  });
  const peakIdx = vals.indexOf(Math.max(...vals));
  const peakPt  = pts[peakIdx];
  const areaPath = `${pts[0].x},${h - bottomPad} ` + pts.map(p => p.str).join(" ") + ` ${pts[pts.length-1].x},${h - bottomPad}`;

  const svgRef  = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ idx: number; mouseX: number; svgLineX: number; dotPxY: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !wrapRef.current) return;
    const svgRect  = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const relFrac  = (e.clientX - svgRect.left) / svgRect.width;
    const svgLineX = relFrac * w;
    const rawIdx   = Math.round((svgLineX - sidePad) / (w - sidePad * 2) * (vals.length - 1));
    const idx      = Math.max(0, Math.min(vals.length - 1, rawIdx));
    const dotPxY   = (pts[idx].y / h) * svgRect.height + (svgRect.top - wrapRect.top);
    setHover({ idx, mouseX: e.clientX - wrapRect.left, svgLineX, dotPxY });
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg ref={svgRef} width="100%" height="100%"
        viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
        style={{ display: "block", cursor: "crosshair" }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="heroGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={TEAL} stopOpacity="0.18" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0"    />
          </linearGradient>
        </defs>
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <line key={i} x1={sidePad} y1={topPad + t * chartH} x2={w - sidePad} y2={topPad + t * chartH}
            stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        ))}
        <polygon fill="url(#heroGrad2)" points={areaPath} />
        <polyline fill="none" stroke={TEAL} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" points={pts.map(p => p.str).join(" ")} />
        {hover?.idx !== peakIdx && (
          <>
            <circle cx={peakPt.x} cy={peakPt.y} r={5} fill={TEAL} />
            <circle cx={peakPt.x} cy={peakPt.y} r={9} fill={TEAL} opacity={0.15} />
          </>
        )}
        {hover && (
          <>
            <line x1={hover.svgLineX} y1={topPad} x2={hover.svgLineX} y2={h - bottomPad}
              stroke={TEAL} strokeWidth="1" opacity="0.3" />
            <circle cx={pts[hover.idx].x} cy={pts[hover.idx].y} r={4.5} fill="white" stroke={TEAL} strokeWidth="2" />
          </>
        )}
      </svg>

      {/* Peak label */}
      {hover?.idx !== peakIdx && (
        <div style={{
          position: "absolute",
          left: `${(peakPt.x / w) * 100}%`,
          top: `${(peakPt.y / h) * 100}%`,
          transform: "translate(-50%, calc(-100% - 12px))",
          pointerEvents: "none",
          background: TEAL, color: "#fff",
          borderRadius: 6, padding: "3px 8px",
          fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,130,127,0.25)",
        }}>
          60k peak
        </div>
      )}

      {/* Hover tooltip */}
      {hover && (() => {
        const svgRect  = svgRef.current!.getBoundingClientRect();
        const flipLeft = hover.mouseX > svgRect.width * 0.72;
        return (
          <div style={{
            position: "absolute",
            left: hover.mouseX, top: hover.dotPxY,
            transform: flipLeft ? "translate(calc(-100% - 10px), -50%)" : "translate(10px, -50%)",
            pointerEvents: "none",
            background: TEAL, color: "#fff",
            borderRadius: 6, padding: "3px 8px",
            fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,130,127,0.25)",
            transition: "left 0.06s ease, top 0.06s ease",
          }}>
            {CHART_DATES[hover.idx]} · {vals[hover.idx]}k
          </div>
        );
      })()}
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const Home2Dashboard = () => {
  const [tipIndex, setTipIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activePage="home2" />
      <Header />

      <main className="ml-52 pt-16 min-h-screen bg-white">
        <div className="px-8 pt-8 pb-10">
          <div className="rounded-[28px] px-10 pt-8 pb-10" style={{ backgroundColor: "#F2F5F5" }}>
          <div className="w-full max-w-[1100px] mx-auto space-y-6">

            {/* ── Hero ── */}
            <div className="pt-4 pb-2">
              <div className="flex items-start justify-between pb-4">
                <div>
                  <h1 className="text-2xl font-bold font-nunito text-foreground">Welcome back John!</h1>
                  <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your searches today.</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Peak mentions</span>
                      <span className="text-lg font-bold text-foreground leading-tight">60k</span>
                    </div>
                    <div className="w-px h-8 bg-border mx-1" />
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Period</span>
                      <span className="text-sm font-semibold text-foreground leading-tight">Apr 6–12</span>
                    </div>
                    <div className="w-px h-8 bg-border mx-1" />
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">vs prev week</span>
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-0.5 leading-tight">
                        <ArrowUpRight className="w-3.5 h-3.5" />+23%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border"
                    style={{ color: TEAL, backgroundColor: "rgba(0,130,127,0.07)", borderColor: "rgba(0,130,127,0.20)" }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Insight: Tesla Cybercore tech now in media
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  We noticed increasing mentions this past week on Tesla's <span className="font-semibold text-foreground">cybercore battery technology announcement</span>, peaking at 60k. Mentions decline to normal levels again at end of week.
                </p>
              </div>

              <div style={{ height: 180 }}>
                <div className="flex gap-3 h-full">
                  <div className="flex flex-col justify-between text-[10px] text-muted-foreground text-right w-7 flex-shrink-0 pb-6 pt-1">
                    <span>60k</span><span>40k</span><span>20k</span><span>0</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1"><HeroChart /></div>
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1 pt-2">
                      {["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12"].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 pb-2">
                <span className="text-[11px] text-muted-foreground">Recent emerging insight · Tesla Brand search</span>
                <button className="text-[11px] font-medium hover:underline flex items-center gap-1" style={{ color: TEAL }}>
                  View full analysis <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ── Row 2: Searches | Dashboards | Alerts ── */}
            <div className="grid grid-cols-3 gap-5">

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Recent Searches</h2>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="pb-2 text-xs font-medium text-muted-foreground">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentSearches.map((s) => (
                      <tr key={s.name} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 text-sm font-medium text-primary hover:underline cursor-pointer">{s.name}</td>
                        <td className="py-2">
                          <Sparkline values={s.trend} color={s.trend[0] > s.trend[s.trend.length-1] ? "#ef4444" : "#22c55e"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 pt-2 border-t border-border">
                  <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    All Searches <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Recent Dashboards</h2>
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                      <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="space-y-0 divide-y divide-border">
                  {recentDashboards.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 py-2.5 hover:bg-muted/30 transition-colors rounded px-1 cursor-pointer">
                      <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-primary flex-1 truncate">{d.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{d.usedIn}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border">
                  <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    All Dashboards <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    Recent Alerts <span className="text-xs font-normal text-muted-foreground">(5 unread)</span>
                  </h2>
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-0 divide-y divide-border">
                  {recentAlerts.map((a, i) => (
                    <div key={i} className="py-2.5 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-medium text-primary">{a.type}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    All Alerts <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Row 3: Resources ── */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Resources & Product Updates</h2>
              <div className="grid grid-cols-3 gap-4">
                {resourceCards.map((card) => (
                  <div key={card.title} className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <card.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-snug">{card.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2 gap-1">
                        <Zap className="w-3 h-3" /> Product Updates
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2 gap-1">
                        <BookOpen className="w-3 h-3" /> Resources
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          </div>{/* end grey panel */}
        </div>
      </main>
    </div>
  );
};

export default Home2Dashboard;
