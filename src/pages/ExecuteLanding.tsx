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
const CORAL      = "#e86c5a";

const AVAILABLE_SEARCHES = [
  { name: "Brand Monitoring",    type: "explore" },
  { name: "Competitor Watch",    type: "explore" },
  { name: "Industry News",       type: "rss"     },
  { name: "Executive Coverage",  type: "explore" },
  { name: "Product Mentions",    type: "explore" },
  { name: "Market Trends",       type: "rss"     },
];

const SEARCH_TYPE_CFG: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  explore: { Icon: Search, color: BLUE,  bg: "rgba(79,106,245,0.10)"  },
  rss:     { Icon: Rss,    color: CORAL, bg: "rgba(232,108,90,0.10)"  },
};

// ── Execute action-centre illustration (pure SVG) ─────────────────────────────
function ExecuteVisual() {
  const panelX = 170, panelY = 8, panelW = 122, panelH = 208;
  const pCY = panelY + panelH / 2; // mid-point on panel's left edge

  // Insight source cards (left)
  const sources = [
    { color: TEAL,   y: 14,  items: [78, 55] },
    { color: PURPLE, y: 88,  items: [66, 48] },
    { color: AMBER,  y: 162, items: [72, 52] },
  ];

  // Action rows inside the main panel
  const actions = [
    { dot: TEAL,   w1: 86, w2: 60 },
    { dot: PURPLE, w1: 74, w2: 50 },
    { dot: BLUE,   w1: 80, w2: 55 },
    { dot: AMBER,  w1: 68, w2: 44 },
  ];

  return (
    <svg width="300" height="228" viewBox="0 0 300 228" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="ex-panel" x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,130,127,0.18)" />
        </filter>
        <filter id="ex-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Insight source cards (left) ── */}
      {sources.map(({ color, y, items }, i) => {
        const cardH = 60;
        const midY  = y + cardH / 2;
        const cx1   = 128, cx2 = panelX - 20;
        return (
          <g key={i}>
            {/* Bezier connector */}
            <path
              d={`M 119 ${midY} C ${cx1} ${midY} ${cx2} ${pCY} ${panelX} ${pCY}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.35}
            />

            {/* Card */}
            <g filter="url(#ex-card)">
              <rect x={5} y={y} width={114} height={cardH} rx={9} fill="white" />
              {/* Left colour stripe */}
              <rect x={5} y={y} width={5} height={cardH} rx={3} fill={color} />
              {/* Live dot */}
              <circle cx={109} cy={y + 12} r={4}   fill={color} opacity={0.18} />
              <circle cx={109} cy={y + 12} r={2.5} fill={color} />
              {/* Label badge */}
              <rect x={15} y={y + 8}  width={30} height={9} rx={4.5} fill={color} opacity={0.12} />
              <rect x={17} y={y + 11} width={20} height={3} rx={1.5} fill={color} opacity={0.55} />
              {/* Content lines */}
              {items.map((w, j) => (
                <rect key={j} x={13} y={y + 22 + j * 13} width={w} height={5} rx={2.5} fill="rgba(0,0,0,0.10)" />
              ))}
            </g>
          </g>
        );
      })}

      {/* ── Main action panel ── */}
      <g filter="url(#ex-panel)">
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={11} fill="white" />

        {/* Header bar */}
        <rect x={panelX}      y={panelY}      width={panelW} height={40} rx={11} fill={TEAL} />
        <rect x={panelX}      y={panelY + 22} width={panelW} height={18} fill={TEAL} />

        {/* Icon placeholder */}
        <rect x={panelX + 8}  y={panelY + 11} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />

        {/* Lightning bolt shape inside icon */}
        <path
          d={`M ${panelX + 18} ${panelY + 14} L ${panelX + 15} ${panelY + 20} L ${panelX + 18} ${panelY + 20} L ${panelX + 14} ${panelY + 27} L ${panelX + 21} ${panelY + 19} L ${panelX + 18} ${panelY + 19} Z`}
          fill="rgba(255,255,255,0.70)"
        />

        {/* Title lines */}
        <rect x={panelX + 30} y={panelY + 15} width={50} height={5} rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={panelX + 30} y={panelY + 23} width={34} height={4} rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* "N actions" badge */}
        <rect  x={panelX + panelW - 26} y={panelY + 14} width={20} height={11} rx={5.5} fill="rgba(255,255,255,0.22)" />
        <circle cx={panelX + panelW - 19} cy={panelY + 19.5} r={3} fill="rgba(255,255,255,0.60)" />
        <rect  x={panelX + panelW - 15}  y={panelY + 17} width={7}  height={4}  rx={2}   fill="rgba(255,255,255,0.40)" />

        {/* Action rows */}
        {actions.map(({ dot, w1, w2 }, i) => {
          const ry = panelY + 54 + i * 37;
          return (
            <g key={i}>
              {/* Priority dot */}
              <circle cx={panelX + 11} cy={ry + 4} r={4} fill={dot} />

              {/* Text lines */}
              <rect x={panelX + 21} y={ry}      width={w1 * 0.72} height={5} rx={2.5} fill="rgba(0,0,0,0.13)" />
              <rect x={panelX + 8}  y={ry + 11} width={w2 * 0.72} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

              {/* Chevron → (actionable feel) */}
              <path
                d={`M ${panelX + panelW - 13} ${ry + 1} L ${panelX + panelW - 9} ${ry + 4} L ${panelX + panelW - 13} ${ry + 7}`}
                fill="none"
                stroke="rgba(0,0,0,0.22)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Divider */}
              {i < actions.length - 1 && (
                <line
                  x1={panelX + 6} y1={ry + 22}
                  x2={panelX + panelW - 6} y2={ry + 22}
                  stroke="rgba(0,0,0,0.05)" strokeWidth={1}
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExecuteLanding() {
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
        <Sidebar activePage="execute" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered action recommendations
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <ExecuteVisual />
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
                From insight,<br />
                <span style={{ color: TEAL }}>decisive action.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Based on signals across your searches, Execute surfaces your highest-impact next steps — from content opportunities to outreach moments and strategic communications — so you always know exactly what to do next.
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
                    Select searches to power your recommendations
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
                    onClick={() => navigate("/execute-action")}
                    disabled={selectedSearches.length === 0}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Show me what to do
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Personalised by Mira AI · Across all your workflows · Updated in real time
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
