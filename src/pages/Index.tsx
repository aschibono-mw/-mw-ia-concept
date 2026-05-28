import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Sparkles, TrendingUp, Search, LayoutGrid, Bell, ChevronRight,
  Info, BookOpen, Zap, Users, FileText, Eye, Newspaper, Plus, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Mock data ────────────────────────────────────────────────────────────────

const recentSearches = [
  { name: "Tesla Brand",    trend: [20,22,19,28,35,30,38], last: "May 12 · 10:16 AM" },
  { name: "Cybertruck",     trend: [30,28,32,25,20,22,18], last: "May 12 · 10:16 AM" },
  { name: "Elon Musk",      trend: [15,18,20,22,28,35,42], last: "May 12 · 10:16 AM" },
  { name: "Space X",        trend: [40,38,35,30,28,25,22], last: "May 12 · 10:16 AM" },
  { name: "Model S",        trend: [10,12,15,14,18,20,19], last: "May 12 · 10:16 AM" },
];

const recentDashboards = [
  { name: "Tesla Brand",      usedIn: "5 places",  lastEdited: "Oct 13, 2025 · 10:16 AM" },
  { name: "Competitors",      usedIn: "2 places",  lastEdited: "Oct 13, 2025 · 10:16 AM" },
  { name: "Crypto Markets",   usedIn: "1 place",   lastEdited: "Oct 13, 2025 · 10:16 AM" },
  { name: "Space X vs Tesla", usedIn: "15 places", lastEdited: "Oct 13, 2025 · 10:16 AM" },
  { name: "Cybertruck Launch",usedIn: "3 places",  lastEdited: "Oct 11, 2025 · 9:04 AM"  },
];

const recentAlerts = [
  { type: "Spike Detection",    time: "2 min ago",  text: "Brand mentions spiked 63% on X following cryptic product teaser videos — analysts speculate affordable Model Y launch imminent." },
  { type: "Spike Detection",    time: "25 min ago", text: "Spike Detected. Tesla Cybertruck recall coverage surging across 8,400+ automotive and news sources, driving negative sentiment to a 30-day high." },
  { type: "Spike Detection",    time: "1 hr ago",   text: "Elon Musk's latest X post referencing Tesla's Robotaxi program generated 160k+ engagements within 4 hours, triggering a positive mention spike." },
];

const insightChartPoints = [20, 22, 20, 35, 60, 55, 40, 38];

const resourceCards = [
  { icon: Search,    title: "Explore Insights and Trends",        desc: "Create and manage searches to monitor brand, competitor, and industry media coverage." },
  { icon: Eye,       title: "Monitor Media Coverage",             desc: "Personalize your monitoring experience to easily view, organize, and share relevant media coverage." },
  { icon: Users,     title: "Engage on Social Media",             desc: "Manage social media marketing across your connected channels to publish, respond, and measure performance." },
  { icon: FileText,  title: "Report on Media Coverage",           desc: "Access and manage all of your reports." },
  { icon: Newspaper, title: "Find and Engage with Journalists",   desc: "Conduct media research, manage media lists, and pitch relevant story ideas to contacts." },
  { icon: Sparkles,  title: "GenAI Lens",                         desc: "Understand existing audiences, identify new ones, generate author lists, and download Ad Targets." },
];

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

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

// ─── Insight Chart ────────────────────────────────────────────────────────────

const InsightChart = () => {
  const w = 480, h = 100, pad = 12;
  const vals = insightChartPoints;
  const min = 0, max = 70;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
    return `${x},${y}`;
  });
  const peakIdx = vals.indexOf(Math.max(...vals));
  const peakPt = pts[peakIdx].split(",");
  const area = `${pts[0].split(",")[0]},${h - pad} ` + pts.join(" ") + ` ${pts[pts.length-1].split(",")[0]},${h - pad}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#areaGrad)" points={area} />
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={pts.join(" ")} />
      <circle cx={peakPt[0]} cy={peakPt[1]} r="4" fill="hsl(var(--primary))" />
    </svg>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Index = () => {
  const [tipIndex, setTipIndex] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="home" />
      <Header />

      <main className="ml-52 pt-16">

        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px] space-y-6">

            {/* Welcome heading */}
            <h1 className="text-2xl font-bold font-nunito text-foreground text-center">
              Welcome back John! Here's what's happening today...
            </h1>

            {/* Row 1: Emerging Insight + Recent Searches */}
            <div className="grid grid-cols-2 gap-6">

              {/* Recent Emerging Insight */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Recent Emerging Insight</h2>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                {/* AI insight chip */}
                <div className="flex items-center gap-2 text-xs text-primary font-medium bg-primary/5 border border-primary/20 rounded-full px-3 py-1.5 w-fit">
                  <Sparkles className="w-3 h-3" />
                  AI Insight: Tesla Cybercore tech now in the media
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We noticed increasing mentions this past week on Tesla's <span className="font-semibold text-foreground">cybercore battery technology announcement</span>, peaking at 60k. Mentions decline to normal levels again at end of week.
                </p>
                {/* Y-axis labels + chart */}
                <div className="flex gap-2">
                  <div className="flex flex-col justify-between text-xs text-muted-foreground py-1 text-right w-8 flex-shrink-0">
                    <span>60k</span>
                    <span>40k</span>
                    <span>20k</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1">
                    <InsightChart />
                    {/* X-axis */}
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                      {["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12"].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
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
                      <th className="pb-2 text-xs font-medium text-muted-foreground">Mentions Trend</th>
                      <th className="pb-2 text-xs font-medium text-muted-foreground text-right">Last edited ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentSearches.map((s) => (
                      <tr key={s.name} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 text-sm font-medium text-primary hover:underline cursor-pointer">{s.name}</td>
                        <td className="py-2.5">
                          <Sparkline values={s.trend} color={s.trend[0] > s.trend[s.trend.length-1] ? "#ef4444" : "#22c55e"} />
                        </td>
                        <td className="py-2.5 text-xs text-muted-foreground text-right whitespace-nowrap">{s.last}</td>
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
            </div>

            {/* Row 2: Recent Dashboards + Recent Alerts */}
            <div className="grid grid-cols-2 gap-6">

              {/* Recent Dashboards */}
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 text-xs font-medium text-muted-foreground flex items-center gap-1">Name <TrendingUp className="w-3 h-3" /></th>
                      <th className="pb-2 text-xs font-medium text-muted-foreground">Used in</th>
                      <th className="pb-2 text-xs font-medium text-muted-foreground text-right">Last edited ↓</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentDashboards.map((d) => (
                      <tr key={d.name} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium text-primary hover:underline cursor-pointer">{d.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-xs text-muted-foreground">{d.usedIn}</td>
                        <td className="py-2.5 text-xs text-muted-foreground text-right whitespace-nowrap">{d.lastEdited}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 pt-2 border-t border-border">
                  <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    All Dashboards <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    Recent Alerts <span className="text-xs font-normal text-muted-foreground ml-1">(Unread – 5)</span>
                  </h2>
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                      <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="space-y-0 divide-y divide-border">
                  {recentAlerts.map((a, i) => (
                    <div key={i} className="py-3 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs font-medium text-primary">{a.type}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{a.time}</span>
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

            {/* Row 3: Expert Tips + More From Meltwater */}
            <div className="grid grid-cols-2 gap-6">

              {/* Expert Tips */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">Expert Tips From Meltwater Users</h2>
                <div className="bg-muted/40 rounded-lg p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted border border-border flex-shrink-0 flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Learn how your peers are using Meltwater</p>
                    <p className="text-xs text-muted-foreground mb-3">Real tips and workflows from people who use it every day.</p>
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground">Danny Gardner</p>
                      <p className="text-xs text-muted-foreground">Brand Monitoring Expert</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">See Danny's tips</Button>
                  </div>
                </div>
                {/* Carousel dots */}
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => setTipIndex(i => Math.max(0, i-1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex gap-1.5">
                    {[0,1,2,3].map(i => (
                      <button key={i} onClick={() => setTipIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${tipIndex === i ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                  </div>
                  <button onClick={() => setTipIndex(i => Math.min(3, i+1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* More From Meltwater */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">More From Meltwater</h2>
                <div className="bg-muted/40 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-600 p-5 text-white">
                    <p className="text-xs font-medium uppercase tracking-wide mb-1 opacity-70">Meltwater Summit</p>
                    <p className="text-sm italic mb-1">Here's the goop!</p>
                    <p className="text-base font-bold mb-2">Gwyneth Paltrow</p>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Keynote Speaker</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-3">The future's taking shape. Join us at Meltwater Summit, May 5–6, with keynote Gwyneth Paltrow and the leaders shaping what's next.</p>
                    <Button size="sm" className="w-full h-7 text-xs">Register Today</Button>
                  </div>
                </div>
                {/* Carousel dots */}
                <div className="flex items-center justify-between mt-3">
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                  </div>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resources & Product Updates */}
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
                      {card.title !== "GenAI Lens" && (
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2 gap-1">
                          <TrendingUp className="w-3 h-3" /> Training
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
