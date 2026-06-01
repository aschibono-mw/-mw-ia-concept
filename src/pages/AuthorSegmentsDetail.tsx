import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft, ChevronDown, ChevronRight, ChevronLeft,
  Download, Info, MoreHorizontal, Pencil, Filter,
} from "lucide-react";

const TEAL = "#00827F";
const BLUE = "#3B82F6";

// ── Shared card shell ──────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-border rounded-lg overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
    <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
      {title}
      <Info className="w-3.5 h-3.5 text-muted-foreground" />
    </div>
    <div className="flex items-center gap-1">
      {action}
      <button className="p-1 hover:bg-muted rounded text-muted-foreground">
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ── DonutChart ─────────────────────────────────────────────────────────────────

const DonutChart = ({ slices }: { slices: { label: string; value: number; color: string }[] }) => {
  const total = slices.reduce((s, d) => s + d.value, 0);
  let cursor = -Math.PI / 2;
  const cx = 50; const cy = 50; const r = 42; const ir = 24;
  const paths = slices.map((s) => {
    const angle = (s.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cursor);
    const y1 = cy + r * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + r * Math.cos(cursor);
    const y2 = cy + r * Math.sin(cursor);
    const large = angle > Math.PI ? 1 : 0;
    return (
      <path key={s.label} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`} fill={s.color} />
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

const SEGMENTS = [
  { rank: 1,  name: "Computer And Video Games", authors: "4.22k" },
  { rank: 2,  name: "Roleplaying Games",        authors: "2.46k" },
  { rank: 3,  name: "Games",                    authors: "4.29k" },
  { rank: 4,  name: "Comics And Animation",     authors: "4.72k" },
  { rank: 5,  name: "Anime And Manga",          authors: "2.33k" },
  { rank: 6,  name: "Shooter Games",            authors: "1.21k" },
  { rank: 7,  name: "Game Systems And Consoles",authors: "674"   },
  { rank: 8,  name: "Comics",                   authors: "1.95k" },
  { rank: 9,  name: "Movies",                   authors: "2.89k" },
  { rank: 10, name: "Tv And Video",             authors: "6.85k" },
];

const TOP_INTERESTS = [
  { name: "Star Wars",       count: 7, pct: 90 },
  { name: "Marvel Studios",  count: 6, pct: 77 },
  { name: "Grok",            count: 6, pct: 77 },
  { name: "The Fantastic Four", count: 5, pct: 64 },
  { name: "WWE",             count: 5, pct: 64 },
];

const TOP_AUTHORS = [
  { name: "Variety",           handle: "@Variety",           followers: "3.04M", color: "#1C1917" },
  { name: "Lucas Silveira",    handle: "@lucasfreano",        followers: "1.33M", color: "#EF4444" },
  { name: "Kureiji Ollie (オリー) 🎃@ホロライブID", handle: "@kureijiollie", followers: "1.03M", color: "#3B82F6" },
  { name: "Arin Hanson",       handle: "@egoraptor",          followers: "1.01M", color: "#F97316" },
  { name: "Moona Hoshinova (ムーナ)🎃hololiveID", handle: "@moonahoshinova", followers: "860k", color: "#A855F7" },
];

const TOP_LOCATIONS = [
  { name: "United States 🇺🇸", count: "4.84K", pct: 95 },
  { name: "Unknown 🌐",        count: "1.94K", pct: 38 },
  { name: "Brazil 🇧🇷",        count: "772",   pct: 15 },
  { name: "UK 🇬🇧",             count: "523",   pct: 10 },
  { name: "Spain 🇪🇸",          count: "466",   pct: 9  },
];

const OCCUPATIONS_SLICES = [
  { label: "Writer",       value: 23.2, color: "#3B82F6" },
  { label: "Creator",      value: 19.6, color: "#EAB308" },
  { label: "Designer",     value: 10.0, color: "#EF4444" },
  { label: "Actor",        value: 9.82, color: "#6B7280" },
  { label: "Editor",       value: 8.76, color: "#10B981" },
  { label: "Director",     value: 6.93, color: "#8B5CF6" },
  { label: "Voice Actor",  value: 5.49, color: "#F97316" },
  { label: "Engineer",     value: 5.39, color: "#06B6D4" },
  { label: "Programmer",   value: 5.39, color: "#84CC16" },
  { label: "Manager",      value: 5.49, color: "#EC4899" },
];

const KEYWORDS = [
  { word: "Resident Evil",           size: "text-3xl font-black" },
  { word: "Videogames",              size: "text-base font-semibold" },
  { word: "#residentevil",           size: "text-2xl font-black" },
  { word: "#bringbackjillvalentine", size: "text-base font-bold" },
  { word: "Bandai Namco",            size: "text-sm font-semibold" },
  { word: "#doctorstrange",          size: "text-sm font-medium" },
  { word: "#adawong",                size: "text-sm font-medium" },
  { word: "German FGC",              size: "text-sm font-medium" },
  { word: "#fltfgc",                 size: "text-sm font-medium" },
  { word: "#kofxv",                  size: "text-sm font-medium" },
  { word: "#retwt",                  size: "text-sm font-medium" },
  { word: "#xboxseries",             size: "text-base font-semibold" },
  { word: "#streetfighter6",         size: "text-base font-bold" },
  { word: "leon kennedy",            size: "text-sm font-medium" },
  { word: "#dmbj",                   size: "text-sm font-medium" },
  { word: "#rockstargames",          size: "text-sm font-medium" },
  { word: "#prx",                    size: "text-xs" },
  { word: "cfn",                     size: "text-xs" },
  { word: "#amstrad",                size: "text-xs" },
  { word: "#jerkysquad",             size: "text-xs" },
  { word: "ninja gaiden",            size: "text-xs" },
  { word: "Red Canids",              size: "text-base font-semibold" },
  { word: "#エアティ",                size: "text-xs" },
];

const TABS = ["Overview", "Segments", "Authors", "Ad Targeting", "Media Preferences"];
const FILTER_PILLS = ["Segments", "Age", "Gender", "Location", "Tier"];

// ── Sunburst placeholder ───────────────────────────────────────────────────────

const SunburstPlaceholder = () => {
  const innerSlices = [
    { label: "Games",          value: 35, color: "#FBBF24" },
    { label: "Comics",         value: 20, color: "#F97316" },
    { label: "Entertainment",  value: 20, color: "#3B82F6" },
    { label: "Social",         value: 15, color: "#10B981" },
    { label: "Other",          value: 10, color: "#8B5CF6" },
  ];
  const outerSlices = [
    { value: 15, color: "#FCD34D" }, { value: 8,  color: "#FDE68A" },
    { value: 9,  color: "#FED7AA" }, { value: 7,  color: "#FDBA74" },
    { value: 10, color: "#FB923C" }, { value: 6,  color: "#F87171" },
    { value: 8,  color: "#93C5FD" }, { value: 7,  color: "#60A5FA" },
    { value: 10, color: "#6EE7B7" }, { value: 6,  color: "#34D399" },
    { value: 8,  color: "#C4B5FD" }, { value: 6,  color: "#A78BFA" },
  ];

  const makeRing = (slices: { value: number; color: string }[], r1: number, r2: number) => {
    const total = slices.reduce((s, d) => s + d.value, 0);
    let cursor = -Math.PI / 2;
    const cx = 50; const cy = 50;
    return slices.map((s, i) => {
      const angle = (s.value / total) * 2 * Math.PI;
      const x1o = cx + r2 * Math.cos(cursor); const y1o = cy + r2 * Math.sin(cursor);
      const x1i = cx + r1 * Math.cos(cursor); const y1i = cy + r1 * Math.sin(cursor);
      cursor += angle;
      const x2o = cx + r2 * Math.cos(cursor); const y2o = cy + r2 * Math.sin(cursor);
      const x2i = cx + r1 * Math.cos(cursor); const y2i = cy + r1 * Math.sin(cursor);
      const large = angle > Math.PI ? 1 : 0;
      return (
        <path key={i}
          d={`M${x1i},${y1i} L${x1o},${y1o} A${r2},${r2} 0 ${large},1 ${x2o},${y2o} L${x2i},${y2i} A${r1},${r1} 0 ${large},0 ${x1i},${y1i} Z`}
          fill={s.color} stroke="white" strokeWidth="0.5"
        />
      );
    });
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {makeRing(innerSlices, 18, 34)}
      {makeRing(outerSlices, 35, 48)}
    </svg>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function AuthorSegmentsDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dashName = decodeURIComponent(name || "Dashboard");
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activePage="author-segments" />
      <Header />

      <main className="ml-52 pt-16">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/author-segments")}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">{dashName}</span>
            <button className="p-1 hover:bg-muted rounded text-muted-foreground">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Inputs <span className="text-foreground font-medium">CAPCOM</span></span>
            <span className="text-muted-foreground">Mar 6, 2026 – Mar 20, 2026</span>
            <button
              className="text-sm font-semibold text-white px-4 py-1.5 rounded"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              Actions <ChevronDown className="w-3 h-3 inline ml-0.5" />
            </button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="px-4 border-b border-border bg-white flex items-center">
          {TABS.map(tab => (
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
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-white">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {FILTER_PILLS.map((f, i) => (
            <button
              key={f}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                i === 0
                  ? "border-border bg-foreground text-background font-semibold"
                  : "border-border hover:bg-muted text-foreground"
              }`}
            >
              {f} {i > 0 && <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          ))}
          <button
            className="ml-auto text-sm font-semibold text-white px-4 py-1.5 rounded"
            style={{ backgroundColor: TEAL }}
          >
            Update results
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-5 space-y-4 bg-gray-50">

          {/* Row 1: Relevance Rank + Author Segments sunburst */}
          <div className="grid grid-cols-2 gap-4">

            <Card>
              <CardHeader title="Relevance Rank" />
              <div className="px-4 py-2">
                <div className="flex text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 px-1">
                  <span className="flex-1">Segments</span>
                  <span>Authors</span>
                </div>
                {SEGMENTS.map(s => (
                  <div key={s.rank} className="flex items-center gap-3 py-2.5 border-t border-border text-sm">
                    <span className="text-muted-foreground w-5 text-xs">{s.rank}</span>
                    <span className="flex-1 text-foreground font-medium">{s.name}</span>
                    <span className="text-muted-foreground text-xs">{s.authors}</span>
                    <button className="p-0.5 hover:bg-muted rounded text-muted-foreground">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 text-xs text-muted-foreground">
                  <button className="hover:text-foreground">‹</button>
                  <span>1–10 of 130</span>
                  <button className="hover:text-foreground">›</button>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Author Segments" />
              <div className="p-4 flex items-center justify-center h-72">
                <SunburstPlaceholder />
              </div>
            </Card>
          </div>

          {/* Row 2: Top Interests + Top Authors */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Top Interests" />
              <div className="px-4 py-3 space-y-3">
                {TOP_INTERESTS.map(i => (
                  <div key={i.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{i.name}</span>
                      <span className="text-muted-foreground">{i.count}</span>
                    </div>
                    <div className="h-6 rounded overflow-hidden" style={{ backgroundColor: "#FEF9C3" }}>
                      <div className="h-full rounded" style={{ width: `${i.pct}%`, backgroundColor: "#EAB308" }} />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground pt-1">1–5 of 16  ›</p>
              </div>
            </Card>

            <Card>
              <CardHeader title="Top Authors" />
              <div className="px-4 py-3">
                <div className="flex text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  <span className="flex-1">Authors</span>
                  <span>Followers</span>
                </div>
                {TOP_AUTHORS.map(a => (
                  <div key={a.handle} className="flex items-center gap-3 py-2.5 border-t border-border">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: a.color }}>
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.handle}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{a.followers}</span>
                  </div>
                ))}
                <div className="pt-3 text-center">
                  <button className="text-xs font-semibold underline" style={{ color: TEAL }}>View All</button>
                </div>
              </div>
            </Card>
          </div>

          {/* Row 3: Top Locations + Top Occupations */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Top Author Locations" />
              <div className="px-4 py-3 space-y-3">
                {TOP_LOCATIONS.map(l => (
                  <div key={l.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{l.name}</span>
                      <span className="text-muted-foreground">{l.count}</span>
                    </div>
                    <div className="h-6 rounded overflow-hidden bg-blue-50">
                      <div className="h-full rounded" style={{ width: `${l.pct}%`, backgroundColor: BLUE }} />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground pt-1">1–5 of 100  ›</p>
              </div>
            </Card>

            <Card>
              <CardHeader title="Top Occupations" />
              <div className="px-4 py-3 flex items-center gap-5">
                <div className="w-36 h-36 flex-shrink-0">
                  <DonutChart slices={OCCUPATIONS_SLICES} />
                </div>
                <div className="space-y-1.5 flex-1">
                  {OCCUPATIONS_SLICES.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-foreground flex-1">{s.label}</span>
                      <span className="text-muted-foreground">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Row 4: Main Demographics + Keywords & Hashtags */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Main Demographics" />
              <div className="px-4 py-3 space-y-0">
                {[
                  { icon: "👍", label: "Age",         value: "18–24",        count: "54%" },
                  { icon: "⚥",  label: "Gender",      value: "Male",         count: "64%" },
                  { icon: "🌍", label: "Countries",   value: "United States",count: "4,839" },
                  { icon: "💼", label: "Occupations", value: "Writer",       count: "241" },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                    <span className="text-base w-6">{d.icon}</span>
                    <span className="text-sm text-muted-foreground w-24">{d.label}</span>
                    <span className="flex-1 text-sm font-medium text-foreground">{d.value}</span>
                    <span className="text-sm text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Keywords & Hashtags" />
              <div className="px-4 py-4 flex flex-wrap gap-x-2 gap-y-1 leading-relaxed">
                {KEYWORDS.map(k => (
                  <span key={k.word} className={`${k.size} cursor-pointer hover:opacity-80`} style={{ color: TEAL }}>
                    {k.word}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Row 5: Age/Gender stacked bar */}
          <Card>
            <CardHeader title="Age/Gender" />
            <div className="px-5 py-4">
              <div className="flex items-end gap-4 h-40">
                {[
                  { age: "13–17", female: 0,   male: 50  },
                  { age: "18–24", female: 120, male: 320 },
                  { age: "25–34", female: 80,  male: 280 },
                  { age: "35–44", female: 10,  male: 30  },
                  { age: "45–54", female: 5,   male: 15  },
                  { age: "55–64", female: 2,   male: 8   },
                  { age: "65+",   female: 1,   male: 3   },
                ].map(d => {
                  const max = 440;
                  const totalH = ((d.female + d.male) / max) * 130;
                  const femH   = totalH > 0 ? (d.female / (d.female + d.male)) * totalH : 0;
                  const maleH  = totalH - femH;
                  return (
                    <div key={d.age} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col justify-end" style={{ height: 130 }}>
                        <div className="w-full rounded-sm" style={{ height: femH, backgroundColor: "#FCD34D" }} />
                        <div className="w-full rounded-sm" style={{ height: maleH, backgroundColor: BLUE }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.age}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-yellow-300" /> Female</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: BLUE }} /> Male</span>
              </div>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}
