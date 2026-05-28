import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, Check, CheckCircle, Rss, ArrowRight } from "lucide-react";

const TEAL       = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";
const PURPLE     = "#B627A1";
const AMBER      = "#f59e0b";
const BLUE       = "#4F6AF5";

const AVAILABLE_SEARCHES = [
  { name: "Brand Monitoring",    type: "explore" },
  { name: "Competitor Watch",    type: "explore" },
  { name: "Industry News",       type: "rss"     },
  { name: "Executive Coverage",  type: "explore" },
  { name: "Product Mentions",    type: "explore" },
  { name: "Market Trends",       type: "rss"     },
];

const SEARCH_TYPE_CFG: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  explore: { Icon: Search, color: BLUE,     bg: "rgba(79,106,245,0.10)" },
  rss:     { Icon: Rss,    color: "#e86c5a", bg: "rgba(232,108,90,0.10)" },
};

// ── Monitor streams illustration (pure SVG) ───────────────────────────────────
function MonitorVisual() {
  const panelX = 172, panelY = 8, panelW = 118, panelH = 208;
  const pCY = panelY + panelH / 2; // convergence Y on panel left edge

  const streams = [
    { color: TEAL,   y: 15,  items: [80, 58] },
    { color: PURPLE, y: 90,  items: [68, 52] },
    { color: AMBER,  y: 165, items: [76, 54] },
  ];

  const rows = [
    { dot: TEAL,   w1: 88, w2: 62 },
    { dot: PURPLE, w1: 76, w2: 50 },
    { dot: BLUE,   w1: 84, w2: 58 },
    { dot: AMBER,  w1: 70, w2: 46 },
  ];

  return (
    <svg width="298" height="228" viewBox="0 0 298 228" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="mv-panel" x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,130,127,0.18)" />
        </filter>
        <filter id="mv-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Stream lane cards (left) ── */}
      {streams.map(({ color, y, items }, i) => {
        const cardH = 62;
        const midY  = y + cardH / 2;
        // Bezier from card right edge → panel left edge at pCY
        const cx1   = 130, cx2 = panelX - 22;
        return (
          <g key={i}>
            {/* Connector curve */}
            <path
              d={`M 123 ${midY} C ${cx1} ${midY} ${cx2} ${pCY} ${panelX} ${pCY}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.35}
            />

            {/* Card */}
            <g filter="url(#mv-card)">
              <rect x={5} y={y} width={118} height={cardH} rx={9} fill="white" />
              {/* Colour left stripe */}
              <rect x={5} y={y} width={5} height={cardH} rx={3} fill={color} />
              {/* Pulsing indicator dot */}
              <circle cx={112} cy={y + 12} r={4} fill={color} opacity={0.2} />
              <circle cx={112} cy={y + 12} r={2.5} fill={color} />
              {/* Topic badge */}
              <rect x={16} y={y + 8} width={32} height={9} rx={4.5} fill={color} opacity={0.12} />
              <rect x={18} y={y + 11} width={22} height={3} rx={1.5} fill={color} opacity={0.55} />
              {/* Content lines */}
              {items.map((w, j) => (
                <rect key={j} x={14} y={y + 23 + j * 13} width={w} height={5} rx={2.5} fill="rgba(0,0,0,0.10)" />
              ))}
            </g>
          </g>
        );
      })}

      {/* ── Main monitor panel ── */}
      <g filter="url(#mv-panel)">
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={11} fill="white" />

        {/* Header bar */}
        <rect x={panelX} y={panelY} width={panelW} height={40} rx={11} fill={TEAL} />
        <rect x={panelX} y={panelY + 22} width={panelW} height={18} fill={TEAL} />

        {/* Icon placeholder */}
        <rect x={panelX + 8} y={panelY + 11} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />

        {/* Title lines */}
        <rect x={panelX + 30} y={panelY + 15} width={46} height={5} rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={panelX + 30} y={panelY + 23} width={30} height={4} rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* Live badge (white ring + dot) */}
        <circle cx={panelX + panelW - 12} cy={panelY + 20} r={6}   fill="rgba(255,255,255,0.20)" />
        <circle cx={panelX + panelW - 12} cy={panelY + 20} r={3.5} fill="white" opacity={0.75} />

        {/* Content rows */}
        {rows.map(({ dot, w1, w2 }, i) => {
          const ry = panelY + 54 + i * 38;
          return (
            <g key={i}>
              <circle cx={panelX + 11} cy={ry + 3}  r={4}   fill={dot} />
              <rect   x={panelX + 20}  y={ry}         width={w1 * 0.78} height={5}   rx={2.5} fill="rgba(0,0,0,0.13)" />
              <rect   x={panelX + 8}   y={ry + 11}    width={w2 * 0.78} height={4}   rx={2}   fill="rgba(0,0,0,0.07)" />
              {i < rows.length - 1 && (
                <line x1={panelX + 6} y1={ry + 22} x2={panelX + panelW - 6} y2={ry + 22}
                  stroke="rgba(0,0,0,0.05)" strokeWidth={1} />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MonitorLanding() {
  const navigate = useNavigate();
  const [selectedSearches, setSelectedSearches] = useState<string[]>(
    AVAILABLE_SEARCHES.slice(0, 3).map(s => s.name)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearch = (name: string) =>
    setSelectedSearches(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );

  const visible = AVAILABLE_SEARCHES.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="monitor" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered media monitoring
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <MonitorVisual />
                </div>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
                  pointerEvents: "none",
                  background: "linear-gradient(to bottom, transparent, #F2F5F5)",
                }} />
              </div>

              {/* Headline */}
              <h1
                className="font-nunito font-black leading-[1.05] tracking-tight text-foreground mb-3 text-center"
                style={{ fontSize: "clamp(38px, 5vw, 56px)", position: "relative", zIndex: 1 }}
              >
                Every story,<br />
                <span style={{ color: TEAL }}>the moment it breaks.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Connect your searches and watch coverage flow in across news, social, and broadcast — organised into streams you can track at a glance.
              </p>

              {/* Search selector card */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  width: "min(560px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Select searches to power your streams
                  </p>

                  {/* Search input */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search your saved searches…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg outline-none transition-all"
                      style={{
                        border: `1.5px solid ${searchQuery ? `${TEAL}50` : "rgba(0,0,0,0.10)"}`,
                        backgroundColor: "rgba(0,0,0,0.02)",
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    {visible.slice(0, 3).map(s => {
                      const cfg = SEARCH_TYPE_CFG[s.type] || SEARCH_TYPE_CFG.explore;
                      const isSelected = selectedSearches.includes(s.name);
                      return (
                        <div
                          key={s.name}
                          onClick={() => toggleSearch(s.name)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all"
                          style={{
                            border: `1.5px solid ${isSelected ? `${TEAL}40` : "rgba(0,0,0,0.07)"}`,
                            backgroundColor: isSelected ? `${TEAL}07` : "transparent",
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
                            style={{
                              border: `2px solid ${isSelected ? TEAL : "rgba(0,0,0,0.2)"}`,
                              backgroundColor: isSelected ? TEAL : "transparent",
                            }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <cfg.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                          <span
                            className="text-[13px] font-medium flex-1"
                            style={{ color: isSelected ? "var(--foreground)" : "var(--muted-foreground)" }}
                          >
                            {s.name}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {s.type}
                          </span>
                        </div>
                      );
                    })}
                    {visible.length === 0 && (
                      <p className="text-[13px] text-muted-foreground text-center py-3">
                        No searches match "{searchQuery}"
                      </p>
                    )}
                    {!searchQuery && AVAILABLE_SEARCHES.length > 3 && (
                      <p className="text-[11px] text-muted-foreground text-center pt-1 pb-0.5">
                        +{AVAILABLE_SEARCHES.length - 3} more · type to search
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-t border-border gap-4"
                  style={{ backgroundColor: "#f7f8f9" }}
                >
                  {selectedSearches.length > 0 ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                      <span className="text-xs font-semibold" style={{ color: TEAL }}>
                        {selectedSearches.length} search{selectedSearches.length !== 1 ? "es" : ""} selected
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      Select at least one to continue
                    </p>
                  )}
                  <button
                    onClick={() => navigate("/monitor-streams")}
                    disabled={selectedSearches.length === 0}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Set up my streams
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Updated in real time · Across 300,000+ sources · Organised by Mira AI
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
