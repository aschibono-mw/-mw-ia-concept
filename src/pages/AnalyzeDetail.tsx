import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft, ChevronDown, RefreshCw, Download, Share2,
  Filter, TrendingUp, MoreHorizontal, Info, Calendar,
  LayoutGrid, List,
} from "lucide-react";

const TEAL = "#00827F";

// ── Mini chart helpers ─────────────────────────────────────────────────────────

const SparkLine = ({ data, color = TEAL }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const area = `0,${h} ${pts.join(" ")} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sg)" />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

const TrendLine = ({ data, prevData }: { data: number[]; prevData: number[] }) => {
  const allVals = [...data, ...prevData];
  const max = Math.max(...allVals);
  const min = Math.min(...allVals);
  const range = max - min || 1;
  const w = 340;
  const h = 80;
  const toPath = (arr: number[]) =>
    arr.map((v, i) => {
      const x = (i / (arr.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <polyline points={toPath(prevData)} fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3" />
      <polyline points={toPath(data)} fill="none" stroke={TEAL} strokeWidth="2" />
    </svg>
  );
};

const DonutChart = ({ slices }: { slices: { label: string; value: number; color: string }[] }) => {
  const total = slices.reduce((s, d) => s + d.value, 0);
  let cursor = -Math.PI / 2;
  const cx = 50; const cy = 50; const r = 38; const ir = 24;
  const paths = slices.map((s) => {
    const angle = (s.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cursor);
    const y1 = cy + r * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + r * Math.cos(cursor);
    const y2 = cy + r * Math.sin(cursor);
    const large = angle > Math.PI ? 1 : 0;
    return (
      <path
        key={s.label}
        d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
        fill={s.color}
      />
    );
  });
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {paths}
      <circle cx={cx} cy={cy} r={ir} fill="white" />
    </svg>
  );
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const mentionsTrend = [110, 150, 130, 170, 200, 180, 243];
const prevTrend     = [80,  120, 100, 140, 160, 130, 100];
const dateLabels    = ["May 23", "May 24", "May 25", "May 26", "May 27", "May 28", "May 29"];

const genderSlices = [
  { label: "Male",   value: 70, color: TEAL   },
  { label: "Female", value: 30, color: "#FCD34D" },
];

const sourceSlices = [
  { label: "News – Online",     value: 28.6, color: TEAL        },
  { label: "Telegram",          value: 24.0, color: "#60A5FA"   },
  { label: "Reddit",            value: 21.8, color: "#F97316"   },
  { label: "YouTube",           value: 7.68, color: "#EF4444"   },
  { label: "X",                 value: 6.82, color: "#1C1917"   },
  { label: "Broadcast – Radio", value: 5.76, color: "#EC4899"   },
  { label: "Pinterest",         value: 7.63, color: "#A855F7"   },
  { label: "Podcasts",          value: 1.28, color: "#94A3B8"   },
];

const languages = [
  { lang: "English",          count: 912, pct: 70.2, growth: "+7.04%", color: "#22C55E" },
  { lang: "Ukrainian",        count: 323, pct: 24.9, growth: "+2.22%", color: "#22C55E" },
  { lang: "Spanish",          count: 37,  pct: 2.85, growth: "+517%",  color: "#22C55E" },
  { lang: "Russian",          count: 5,   pct: 0.39, growth: "+25%",   color: "#22C55E" },
  { lang: "Finnish",          count: 4,   pct: 0.31, growth: "—",      color: "#94A3B8" },
  { lang: "Bahasa Indonesia", count: 4,   pct: 0.31, growth: "+0",     color: "#94A3B8" },
];

const topics = [
  { name: "Shopping",        count: "1.05K", pct: 75, growth: "+6.16%",  color: "#22C55E" },
  { name: "Apparel",         count: "921",   pct: 65, growth: "+15.5%",  color: "#22C55E" },
  { name: "Footwear",        count: "799",   pct: 57, growth: "+86.6%",  color: "#22C55E" },
  { name: "Athletic Apparel",count: "401",   pct: 28, growth: "+36.4%",  color: "#22C55E" },
  { name: "Sports",          count: "362",   pct: 26, growth: "+36.7%",  color: "#22C55E" },
];

const hashtags = [
  { tag: "#2025shoetrends", size: "text-2xl font-black" },
  { tag: "#new",            size: "text-lg font-bold"   },
  { tag: "#2025fashiontrends", size: "text-xl font-black" },
  { tag: "#2025trends",     size: "text-xl font-bold"   },
  { tag: "#itgirl",         size: "text-lg font-semibold" },
  { tag: "#airforce",       size: "text-base font-semibold" },
  { tag: "#shoes",          size: "text-base font-semibold" },
  { tag: "#Monsoon25",      size: "text-3xl font-black" },
  { tag: "#itgirlstyle",    size: "text-xl font-bold"   },
  { tag: "#style",          size: "text-sm font-medium" },
  { tag: "#nike",           size: "text-sm font-medium" },
  { tag: "#gлowup",         size: "text-sm font-medium" },
  { tag: "#sneakers",       size: "text-base font-semibold" },
  { tag: "#adidas",         size: "text-base font-semibold" },
  { tag: "#yeezy",          size: "text-sm font-medium" },
  { tag: "#jordan",         size: "text-sm font-medium" },
  { tag: "#fashion",        size: "text-sm font-medium" },
  { tag: "#vans",           size: "text-sm font-medium" },
  { tag: "#trend",          size: "text-sm font-medium" },
  { tag: "#trending",       size: "text-sm font-medium" },
];

const keyphrases = [
  { phrase: "gym shoes",          size: "text-2xl font-black" },
  { phrase: "cosy knit",          size: "text-2xl font-bold"  },
  { phrase: "knitwear",           size: "text-xl font-black"  },
  { phrase: "new balance",        size: "text-2xl font-black" },
  { phrase: "ski outfit",         size: "text-xl font-bold"   },
  { phrase: "office wear",        size: "text-lg font-bold"   },
  { phrase: "pilates outfit",     size: "text-xl font-black"  },
  { phrase: "new everyday shoe",  size: "text-sm font-medium" },
  { phrase: "sporty-ballet vibes",size: "text-sm font-medium" },
  { phrase: "comfy-cute vibe",    size: "text-sm font-medium" },
  { phrase: "best gym shoes",     size: "text-sm font-semibold" },
  { phrase: "spring/summer",      size: "text-sm font-medium" },
];

const ageGroups = [
  { label: "Mostly young a...", count: 20, pct: 51.3, growth: "+5.38%",  bar: 51  },
  { label: "Mostly adults",    count: 13, pct: 33.3, growth: "+13.3%",  bar: 33  },
  { label: "Mostly teenagers", count: 4,  pct: 10.3, growth: "—",       bar: 10  },
  { label: "Mostly children",  count: 1,  pct: 2.56, growth: "—",       bar: 3   },
  { label: "Mostly seniors",   count: 1,  pct: 2.56, growth: "—",       bar: 3   },
];

const imgObjects = [
  { name: "footwear",     count: 98,  pct: 27.1, growth: "▼ 2.97%",  color: "#EF4444" },
  { name: "person",       count: 52,  pct: 14.4, growth: "▲ 5.48%",  color: "#22C55E" },
  { name: "shirt",        count: 20,  pct: 5.54, growth: "▲ 53.8%",  color: "#22C55E" },
  { name: "socks",        count: 17,  pct: 4.71, growth: "▲ 21.4%",  color: "#22C55E" },
  { name: "necklace",     count: 11,  pct: 3.05, growth: "▲ 57.1%",  color: "#22C55E" },
  { name: "leg warmers",  count: 10,  pct: 2.77, growth: "▲ 150%",   color: "#22C55E" },
];

// ── Component ─────────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-border rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex items-start justify-between px-4 pt-4 pb-2">
    <div>
      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
        {title}
        <Info className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
      </div>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <button className="p-1 hover:bg-muted rounded text-muted-foreground">
      <MoreHorizontal className="w-4 h-4" />
    </button>
  </div>
);

export default function AnalyzeDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dashName = decodeURIComponent(name || "Dashboard");
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Analytics", "Topic Analysis", "X Insights", "Authors", "Media Contacts"];

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activePage="analyze" />
      <Header />

      <main className="ml-52 pt-16">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white">
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => navigate("/analyze-dashboard")}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/analyze-dashboard")} className="text-muted-foreground hover:text-foreground">
              ..
            </button>
            <span className="text-muted-foreground">/</span>
            <button onClick={() => navigate("/analyze-dashboard")} className="text-muted-foreground hover:text-foreground">
              Competitive Analysis
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-foreground">{dashName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Download className="w-4 h-4" /></button>
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-1.5 rounded"
              style={{ backgroundColor: TEAL }}
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-white">
          <button className="flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-full">
            Adidas shoes ✕
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:bg-muted" style={{ color: TEAL }}>
            <Filter className="w-3 h-3" /> All Filters
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded text-muted-foreground"><RefreshCw className="w-3.5 h-3.5" /></button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border px-2.5 py-1.5 rounded hover:bg-muted">
              <Calendar className="w-3.5 h-3.5" /> Last 7 days (CST) <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="px-4 border-b border-border bg-white flex items-center">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 py-2">
            <button className="p-1.5 rounded hover:bg-muted"><List className="w-4 h-4 text-muted-foreground" /></button>
            <button className="p-1.5 rounded hover:bg-muted"><LayoutGrid className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-5 space-y-4 bg-gray-50">

          {/* Row 1: Total Mentions + Trend */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Total Mentions" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-black text-foreground">1.41K</span>
                  <span className="text-sm font-semibold text-green-500 mb-1">▲ +7.32%</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Previous period 1.31K</p>
                <div className="h-16">
                  <SparkLine data={mentionsTrend} />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Total Mentions Trend" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4">
                <div className="flex items-center gap-4 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: TEAL }} /> Mentions</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded bg-slate-300" /> Previous period</span>
                </div>
                <TrendLine data={mentionsTrend} prevData={prevTrend} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  {dateLabels.map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            </Card>
          </div>

          {/* Audiences section header */}
          <p className="text-sm font-semibold text-foreground pt-2">Audiences discussing this content</p>

          {/* Row 2: Gender + Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Author's Gender" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 flex items-center gap-6">
                <div className="w-28 h-28 flex-shrink-0">
                  <DonutChart slices={genderSlices} />
                </div>
                <div className="space-y-2">
                  {genderSlices.map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-foreground">{s.label}</span>
                      <span className="text-muted-foreground ml-auto pl-4">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Author's Demographic" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 mb-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: TEAL }} /> Male</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-yellow-300" /> Female</span>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {[["13–17", 100], ["18–24", 20], ["25–34", 10], ["35–44", 5], ["45–54", 5], ["55–64", 3], ["65–121", 2]].map(([label, pct]) => (
                    <div key={label} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full rounded-sm" style={{ height: `${(pct as number)}%`, backgroundColor: TEAL, opacity: 0.85 }} />
                      <span className="text-[9px] text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Row 3: Occupations + Top Languages */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Author's Occupations" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-5 flex flex-wrap gap-x-3 gap-y-1.5 leading-snug">
                {[
                  ["real estate broker", "text-xs"],["physician","text-xs"],["music promoter","text-xs"],
                  ["blogger","text-2xl font-black"],["manager","text-2xl font-black"],["dentist","text-2xl font-bold"],
                  ["biomedical scientist","text-3xl font-black"],
                  ["trainee","text-xl font-bold"],["financiero","text-sm"],["engineer","text-base font-semibold"],["autor","text-sm"],
                  ["project manager","text-sm"],["ingeniero de diseno","text-sm"],["ingeniero","text-sm"],["network engineer","text-xs"],
                  ["investor","text-xs"],["promoter","text-xs"],
                ].map(([w, cls]) => (
                  <span key={w} className={`${cls} text-foreground`} style={{ color: TEAL }}>{w}</span>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Top Languages" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4">
                <div className="flex text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
                  <span className="w-4 mr-2">#</span>
                  <span className="flex-1">Language</span>
                  <span className="w-12 text-right">Count</span>
                  <span className="w-16 text-right">Growth</span>
                  <span className="w-20" />
                  <span className="w-10 text-right">%</span>
                </div>
                {languages.map((l, i) => (
                  <div key={l.lang} className="flex items-center gap-2 py-1.5 border-t border-border text-xs">
                    <span className="w-4 text-muted-foreground text-[10px]">{i + 1}</span>
                    <span className="flex-1 text-foreground">{l.lang}</span>
                    <span className="w-12 text-right text-foreground">{l.count}</span>
                    <span className="w-16 text-right text-green-500 text-[10px] font-semibold">{l.growth}</span>
                    <div className="w-20 h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${l.pct}%`, backgroundColor: "#22C55E" }} />
                    </div>
                    <span className="w-10 text-right text-muted-foreground">{l.pct}%</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground mt-2 text-right">1–6 of 13  &rsaquo;</p>
              </div>
            </Card>
          </div>

          {/* Section header */}
          <p className="text-sm font-semibold text-foreground pt-2">Platforms and Topics Driving the Conversation</p>

          {/* Row 4: Source type + Topics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Share of Voice by Source Type" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 flex items-start gap-4">
                <div className="w-36 h-36 flex-shrink-0">
                  <DonutChart slices={sourceSlices} />
                </div>
                <div className="space-y-1.5 flex-1 pt-1">
                  {sourceSlices.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-foreground flex-1">{s.label}</span>
                      <span className="text-muted-foreground">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Main topics of conversation" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 space-y-2.5 pt-1">
                {topics.map(t => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-foreground font-medium">{t.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{t.count}</span>
                        <span className="text-green-500 text-[10px] font-semibold">▲ {t.growth}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${t.pct}%`, backgroundColor: TEAL }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{t.pct}%</span>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground text-right mt-1">1–5 of 205  &rsaquo;</p>
              </div>
            </Card>
          </div>

          {/* Section header */}
          <p className="text-sm font-semibold text-foreground pt-2">Engagement Trends Across Social Content</p>

          {/* Row 5: Hashtags + Keyphrases */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Most Engaging hashtags" subtitle="Last 7 days | Engagement" />
              <div className="px-4 pb-5 flex flex-wrap gap-x-2 gap-y-1 leading-relaxed">
                {hashtags.map(h => (
                  <span key={h.tag} className={`${h.size} cursor-pointer hover:opacity-80`} style={{ color: TEAL }}>
                    {h.tag}
                  </span>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Most Engaging Keyphrases" subtitle="Last 7 days | Engagement" />
              <div className="px-4 pb-5 flex flex-wrap gap-x-2 gap-y-1 leading-relaxed">
                {keyphrases.map(k => (
                  <span key={k.phrase} className={`${k.size} cursor-pointer hover:opacity-80`} style={{ color: TEAL }}>
                    {k.phrase}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 6: Engaging Pictures & Videos */}
          <Card>
            <CardHeader title="Engaging Pictures & Videos" subtitle="Last 7 days | Sort by engagement" />
            <div className="px-4 pb-4">
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded bg-muted overflow-hidden"
                    style={{ backgroundColor: `hsl(${(i * 37) % 360}, 20%, ${80 + (i % 3) * 5}%)` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-muted-foreground">1–68 of 100  &rsaquo;</p>
                <button
                  className="text-xs font-semibold text-white px-3 py-1.5 rounded"
                  style={{ backgroundColor: TEAL }}
                >
                  View related mentions
                </button>
              </div>
            </div>
          </Card>

          {/* Row 7: Age + Gender in image + Objects */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader title="Age Detected within Image" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 space-y-2 pt-1">
                {ageGroups.map((a, i) => (
                  <div key={a.label} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-4 text-[10px]">{i + 1}</span>
                    <span className="flex-1 text-foreground truncate">{a.label}</span>
                    <span className="text-foreground w-6 text-right">{a.count}</span>
                    <span className="text-green-500 text-[10px] font-semibold w-14 text-right">{a.growth}</span>
                    <div className="w-12 h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded bg-purple-400" style={{ width: `${a.bar}%` }} />
                    </div>
                    <span className="text-muted-foreground w-10 text-right">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Gender Detected within Image" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 flex items-center gap-4">
                <div className="w-28 h-28 flex-shrink-0">
                  <DonutChart slices={[
                    { label: "Mostly female", value: 52.3, color: "#FCD34D" },
                    { label: "Mostly male",   value: 34.1, color: TEAL       },
                    { label: "Mixed gender",  value: 13.6, color: "#94A3B8"  },
                  ]} />
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: "Mostly female", pct: "52.3%", color: "#FCD34D" },
                    { label: "Mostly male",   pct: "34.1%", color: TEAL      },
                    { label: "Mixed gender",  pct: "13.6%", color: "#94A3B8" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-foreground">{s.label}</span>
                      <span className="text-muted-foreground ml-auto pl-2">{s.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Objects and Animals within Pictures" subtitle="Last 7 days | Mentions" />
              <div className="px-4 pb-4 space-y-2 pt-1">
                {imgObjects.map((o, i) => (
                  <div key={o.name} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-4 text-[10px]">{i + 1}</span>
                    <span className="flex-1 text-foreground">{o.name}</span>
                    <span className="text-foreground w-6 text-right">{o.count}</span>
                    <span className="text-[10px] font-semibold w-14 text-right" style={{ color: o.color }}>{o.growth}</span>
                    <div className="w-12 h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${o.pct}%`, backgroundColor: o.color }} />
                    </div>
                    <span className="text-muted-foreground w-10 text-right">{o.pct}%</span>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground text-right mt-1">1–6 of 59  &rsaquo;</p>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
