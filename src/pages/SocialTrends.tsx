import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ChevronLeft, ChevronRight, Info, Download, Search, MapPin, ChevronDown, Zap } from "lucide-react";

// ── Chart data ───────────────────────────────────────────────────────────────
const X_LABELS = [
  "Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16","Apr 17","Apr 18","Apr 19",
  "Apr 20","Apr 21","Apr 22","Apr 23","Apr 24","Apr 25","Apr 26","Apr 27","Apr 28","Apr 29",
  "Apr 30","May 01","May 02","May 03","May 04","May 05","May 06","May 07","May 08",
];

const chartSeries = [
  {
    id: "blowthisup", color: "#3B82F6",
    data: [295,305,300,290,285,310,320,315,308,300,295,285,290,295,300,310,315,305,295,285,290,300,315,320,315,320,325,330,332],
  },
  {
    id: "meme", color: "#EAB308",
    data: [230,240,235,225,220,245,250,245,240,235,228,222,228,235,240,248,252,245,238,230,235,240,245,248,242,245,248,250,252],
  },
  {
    id: "tiktokshop", color: "#EF4444",
    data: [245,250,242,235,228,238,245,240,235,225,220,215,220,225,230,238,242,235,225,218,222,228,232,235,228,222,218,215,210],
  },
  {
    id: "dance", color: "#22C55E",
    data: [200,205,198,188,178,185,192,195,188,178,172,168,175,180,188,195,200,192,182,172,178,185,192,200,205,210,215,220,225],
  },
];

// Convert data to SVG path
const toPath = (data: number[], cLeft: number, cRight: number, cTop: number, cBottom: number, maxVal: number) => {
  const n = data.length;
  const w = cRight - cLeft;
  const h = cBottom - cTop;
  return data.map((v, i) => {
    const x = cLeft + (i / (n - 1)) * w;
    const y = cBottom - (v / maxVal) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
};

// ── Rank change badge ────────────────────────────────────────────────────────
const RankBadge = ({ change }: { change: string | number | "new" }) => {
  if (change === "new") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-600 text-xs font-medium whitespace-nowrap">
      <Zap className="w-3 h-3" /> New
    </span>
  );
  const n = Number(change);
  if (n === 0) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground text-xs font-medium whitespace-nowrap">
      → 0
    </span>
  );
  if (n > 0) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-green-300 bg-green-50 text-green-600 text-xs font-medium whitespace-nowrap">
      ↑ {n}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-500 text-xs font-medium whitespace-nowrap">
      ↓ {Math.abs(n)}
    </span>
  );
};

// ── Mock hashtag data ────────────────────────────────────────────────────────
const hashtags = [
  { rank: 1,  change: 0,     name: "blowthisup",     views: "2.04B",    posts: "755.09k", audience: "35+\n36%", countries: "US, PH, GB, NG, ZA" },
  { rank: 2,  change: 0,     name: "meme",           views: "1.65B",    posts: "324.74k", audience: "35+\n43%", countries: "US, BR, ID, MX, PH" },
  { rank: 3,  change: 1,     name: "tiktokshop",     views: "1.67B",    posts: "453.4k",  audience: "—",        countries: "US, BR, MX, VN, TH" },
  { rank: 4,  change: -1,    name: "dance",          views: "1.42B",    posts: "392.03k", audience: "35+\n42%", countries: "US, ID, PH, PK, BR" },
  { rank: 5,  change: 0,     name: "music",          views: "1.38B",    posts: "282.82k", audience: "35+\n40%", countries: "US, ID, BR, PH, MX" },
  { rank: 6,  change: 0,     name: "michaeljackson", views: "1.67B",    posts: "109.86k", audience: "—",        countries: "US, GB, MX, BR, FR" },
  { rank: 7,  change: 40,    name: "mothersday",     views: "953.98M",  posts: "540.37k", audience: "35+\n44%", countries: "US, PK, PH, ZA, MX" },
  { rank: 8,  change: "new", name: "metgala",        views: "1.58B",    posts: "77.06k",  audience: "—",        countries: "US, GB, ID, FR, MX" },
  { rank: 9,  change: "new", name: "hantavirus",     views: "1.28B",    posts: "99.67k",  audience: "35+\n39%", countries: "US, GB, ES, MX, ID" },
  { rank: 10, change: -3,    name: "ad",             views: "2.34B",    posts: "27.09k",  audience: "35+\n44%", countries: "US, GB, CA, ZA, ID" },
];

const trendItems = [
  { id: "blowthisup", posts: "755.09k", color: "#3B82F6" },
  { id: "meme",       posts: "324.74k", color: "#EAB308" },
  { id: "tiktokshop", posts: "453.4k",  color: "#EF4444" },
  { id: "dance",      posts: "392.03k", color: "#22C55E" },
  { id: "music",      posts: "282.82k", color: null },
  { id: "michaelj...",posts: "109.86k", color: null },
  { id: "mothersday", posts: "540.37k", color: null },
  { id: "metgala",    posts: "77.06k",  color: null },
  { id: "hantavirus", posts: "99.67k",  color: null },
  { id: "ad",         posts: "27.09k",  color: null },
];

const PLATFORMS = [
  { id: "tiktok",    label: "TikTok",    soon: false },
  { id: "x",         label: "X",         soon: false },
  { id: "instagram", label: "Instagram", soon: false },
  { id: "news",      label: "News",      soon: true },
];

// Chart constants
const CL = 58, CR = 760, CT = 10, CB = 250, MAX = 370;
const yTicks = [0, 50, 100, 150, 200, 250, 300, 350];

const SocialTrends = () => {
  const [platform, setPlatform] = useState("tiktok");
  const [subTab, setSubTab] = useState("hashtags");
  const [selected, setSelected] = useState<string[]>(["blowthisup", "meme", "tiktokshop", "dance"]);

  const toggleSelected = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 7 ? [...prev, id] : prev
    );
  };

  const visibleSeries = chartSeries.filter((s) => selected.includes(s.id));

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="social-trends" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-5">

          {/* ── Page title ── */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">Discover what's trending on social</h1>
            <p className="text-sm text-muted-foreground">Track the top hashtags and tracks across TikTok, X, Instagram, and more.</p>
          </div>

          {/* ── Platform tabs ── */}
          <div className="grid grid-cols-4 gap-0 mb-4 border-b border-border">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => !p.soon && setPlatform(p.id)}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                  platform === p.id
                    ? "border-teal-500 text-teal-600 bg-teal-50/50"
                    : p.soon
                    ? "border-transparent text-muted-foreground/50 cursor-default"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Platform icon */}
                {p.id === "tiktok" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                )}
                {p.id === "x" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
                {p.id === "instagram" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <defs>
                      <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F58529"/>
                        <stop offset="50%" stopColor="#DD2A7B"/>
                        <stop offset="100%" stopColor="#8134AF"/>
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="#DD2A7B"/>
                  </svg>
                )}
                {p.id === "news" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-40">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h12v2H6zm0 4h8v2H6z"/>
                  </svg>
                )}
                <span>{p.label}</span>
                {p.soon && (
                  <span className="text-xs text-muted-foreground/50 font-normal">(Coming soon)</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Sub-tab + filters ── */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {/* Hashtags / Tracks */}
            <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setSubTab("hashtags")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                  subTab === "hashtags" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none">#</span>
                Hashtags
              </button>
              <div className="w-px h-5 bg-border" />
              <button
                onClick={() => setSubTab("tracks")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                  subTab === "tracks" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 8 Q8 4 12 8 Q8 12 4 8Z" />
                </svg>
                Tracks
              </button>
            </div>

            {/* Date range */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="text-muted-foreground">Date range:</span>
              <span className="font-medium">Last 7 Days</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Category */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">All</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Location */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:bg-muted transition-colors">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">United States</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* ── Top 200 Hashtags table ── */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-5">
            {/* Table toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Top 200 Hashtags</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background w-52 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter or describe topic..."
                  />
                </div>
                <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">Rank</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-32">Rank Change</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Views</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Posts</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <span className="flex items-center gap-1">Primary Audience <Info className="w-3 h-3" /></span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Countries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hashtags.map((row) => (
                  <tr key={row.rank} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm font-semibold text-foreground">
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RankBadge change={row.change} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">#</span>
                        <span className="font-medium text-foreground">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">{row.views}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.posts}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-pre-line text-xs leading-snug">{row.audience}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.countries}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-end gap-3">
              <span className="text-xs text-muted-foreground">1–10 of 200</span>
              <button className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-40" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Historical Trend ── */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Historical Trend</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="flex">
              {/* Left panel — selector */}
              <div className="w-56 border-r border-border flex-shrink-0 p-3">
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    className="pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-background w-full focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Find"
                  />
                </div>

                {/* Selected count */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Selected ({selected.length}/7)
                  </span>
                  <button
                    onClick={() => setSelected([])}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear
                  </button>
                </div>

                {/* List */}
                <div className="space-y-0.5">
                  {trendItems.map((item) => {
                    const isSelected = selected.includes(item.id);
                    const seriesColor = chartSeries.find(s => s.id === item.id)?.color || item.color;
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 py-1.5 px-1 rounded hover:bg-muted/50 cursor-pointer group"
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "border-transparent"
                              : "border-border bg-background"
                          }`}
                          style={isSelected && seriesColor ? { background: seriesColor, borderColor: seriesColor } : {}}
                          onClick={() => toggleSelected(item.id)}
                        >
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        {/* Color dot */}
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: isSelected && seriesColor ? seriesColor : "#CBD5E1" }}
                        />
                        <span className="text-sm text-foreground flex-1 truncate">{item.id}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{item.posts}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <button className="p-0.5 hover:bg-muted rounded text-muted-foreground disabled:opacity-40" disabled>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-muted-foreground">1 - 10 of 200</span>
                  <button className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right panel — chart */}
              <div className="flex-1 p-4 min-w-0">
                <svg
                  viewBox={`0 0 ${CR + 10} ${CB + 30}`}
                  className="w-full"
                  style={{ height: 320 }}
                >
                  {/* Y-axis grid lines + labels */}
                  {yTicks.map((tick) => {
                    const y = CB - (tick / MAX) * (CB - CT);
                    return (
                      <g key={tick}>
                        <line x1={CL} y1={y} x2={CR} y2={y} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={CL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                          {tick === 0 ? "0" : `${tick}M`}
                        </text>
                      </g>
                    );
                  })}

                  {/* X-axis labels — every 3 days */}
                  {X_LABELS.map((label, i) => {
                    if (i % 3 !== 0) return null;
                    const x = CL + (i / (X_LABELS.length - 1)) * (CR - CL);
                    return (
                      <text key={i} x={x} y={CB + 18} textAnchor="middle" fontSize="9" fill="#94A3B8">
                        {label}
                      </text>
                    );
                  })}

                  {/* Bottom axis line */}
                  <line x1={CL} y1={CB} x2={CR} y2={CB} stroke="#E2E8F0" strokeWidth="1" />

                  {/* Series lines */}
                  {visibleSeries.map((series) => (
                    <path
                      key={series.id}
                      d={toPath(series.data, CL, CR, CT, CB, MAX)}
                      fill="none"
                      stroke={series.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SocialTrends;
