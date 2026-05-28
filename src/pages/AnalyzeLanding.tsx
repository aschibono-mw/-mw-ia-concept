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
  explore: { Icon: Search, color: BLUE,      bg: "rgba(79,106,245,0.10)" },
  rss:     { Icon: Rss,    color: "#e86c5a", bg: "rgba(232,108,90,0.10)" },
};

// ── Analytics dashboard illustration (pure SVG) ───────────────────────────────
function AnalyzeVisual() {
  const frontX = 92, frontY = 14;
  const cardW  = 158, cardH = 198;

  // Bar chart inside front card
  const chartX   = frontX + 14;
  const chartTop = frontY + 52;
  const chartH   = 96;
  const bars     = [52, 78, 44, 92, 62, 74];
  const totalBarW = 132;
  const barW = totalBarW / bars.length - 4;

  const barPts = bars.map((h, i) => {
    const x = chartX + i * (barW + 4) + barW / 2;
    const y = chartTop + chartH - (h / 100) * chartH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="338" height="248" viewBox="0 0 338 248" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="av-front" x="-25%" y="-20%" width="150%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,130,127,0.18)" />
        </filter>
        <filter id="av-back" x="-35%" y="-30%" width="170%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Back-left card — metric + sparkline ── */}
      <g transform="rotate(-11 62 108)" filter="url(#av-back)">
        <rect x={10} y={28} width={104} height={160} rx={10} fill="white" />
        {/* Purple header */}
        <rect x={10} y={28} width={104} height={36} rx={10} fill={PURPLE} />
        <rect x={10} y={46}  width={104} height={18} fill={PURPLE} />
        <rect x={18} y={35}  width={16}  height={16} rx={3} fill="rgba(255,255,255,0.22)" />
        <rect x={38} y={39}  width={36}  height={5}  rx={2.5} fill="rgba(255,255,255,0.42)" />
        <rect x={38} y={47}  width={24}  height={4}  rx={2}   fill="rgba(255,255,255,0.25)" />
        {/* Big number placeholder */}
        <rect x={18} y={76}  width={50}  height={18} rx={4}   fill="rgba(0,0,0,0.11)" />
        <rect x={18} y={98}  width={32}  height={6}  rx={3}   fill="rgba(0,0,0,0.07)" />
        {/* Trend up arrow */}
        <polyline points="78,96 84,90 90,93" fill="none" stroke={PURPLE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        {/* Mini sparkline */}
        <polyline
          points="18,136 28,128 38,132 50,120 62,123 74,114 90,116"
          fill="none" stroke={PURPLE} strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" opacity={0.55}
        />
        {/* Bottom lines */}
        <rect x={18} y={153} width={72} height={5}  rx={2.5} fill="rgba(0,0,0,0.08)" />
        <rect x={18} y={161} width={48} height={4}  rx={2}   fill="rgba(0,0,0,0.05)" />
      </g>

      {/* ── Back-right card — donut chart ── */}
      <g transform="rotate(10 248 103)" filter="url(#av-back)">
        <rect x={200} y={24} width={96} height={158} rx={10} fill="white" />
        {/* Amber header */}
        <rect x={200} y={24} width={96}  height={36} rx={10} fill={AMBER} />
        <rect x={200} y={42} width={96}  height={18} fill={AMBER} />
        <rect x={208} y={32} width={14}  height={14} rx={3} fill="rgba(255,255,255,0.22)" />
        <rect x={226} y={36} width={34}  height={5}  rx={2.5} fill="rgba(255,255,255,0.42)" />
        <rect x={226} y={44} width={22}  height={4}  rx={2}   fill="rgba(255,255,255,0.25)" />
        {/* Donut ring */}
        <circle cx={248} cy={108} r={28} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={9} />
        <circle cx={248} cy={108} r={28} fill="none" stroke={AMBER}
          strokeWidth={9} strokeDasharray="88 88" strokeDashoffset="22"
          strokeLinecap="round" transform="rotate(-90 248 108)" opacity={0.85} />
        <circle cx={248} cy={108} r={28} fill="none" stroke={TEAL}
          strokeWidth={9} strokeDasharray="38 138" strokeDashoffset="-66"
          strokeLinecap="round" transform="rotate(-90 248 108)" opacity={0.75} />
        {/* Centre label placeholder */}
        <rect x={236} y={104} width={24} height={8} rx={3} fill="rgba(0,0,0,0.09)" />
        {/* Legend rows */}
        <circle cx={210} cy={150} r={3} fill={AMBER} />
        <rect   x={216} y={147} width={26} height={4} rx={2} fill="rgba(0,0,0,0.08)" />
        <circle cx={210} cy={160} r={3} fill={TEAL} />
        <rect   x={216} y={157} width={20} height={4} rx={2} fill="rgba(0,0,0,0.08)" />
      </g>

      {/* ── Front card — bar chart ── */}
      <g filter="url(#av-front)">
        <rect x={frontX} y={frontY} width={cardW} height={cardH} rx={11} fill="white" />

        {/* Header */}
        <rect x={frontX} y={frontY}    width={cardW} height={38} rx={11} fill={TEAL} />
        <rect x={frontX} y={frontY+20} width={cardW} height={18} fill={TEAL} />
        <rect x={frontX+8}  y={frontY+10} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />
        <rect x={frontX+30} y={frontY+14} width={46} height={5}  rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={frontX+30} y={frontY+22} width={30} height={4}  rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* Gridlines */}
        {[0, 33, 66, 100].map((pct, i) => {
          const y = chartTop + chartH - (pct / 100) * chartH;
          return (
            <line key={i}
              x1={chartX} y1={y} x2={chartX + totalBarW} y2={y}
              stroke="rgba(0,0,0,0.06)" strokeWidth={1}
            />
          );
        })}

        {/* Bars */}
        {bars.map((h, i) => {
          const barH = (h / 100) * chartH;
          const x = chartX + i * (barW + 4);
          const y = chartTop + chartH - barH;
          const highlighted = i === 3;
          return (
            <rect key={i} x={x} y={y} width={barW} height={barH} rx={3}
              fill={highlighted ? TEAL : TEAL}
              opacity={highlighted ? 1 : 0.38 + i * 0.08}
            />
          );
        })}

        {/* Trend line */}
        <polyline
          points={barPts}
          fill="none" stroke={PURPLE} strokeWidth={1.8}
          strokeLinecap="round" strokeLinejoin="round" opacity={0.65}
        />
        {/* Trend line peak dot */}
        {(() => {
          const peakIdx = bars.indexOf(Math.max(...bars));
          const px = chartX + peakIdx * (barW + 4) + barW / 2;
          const py = chartTop + chartH - (bars[peakIdx] / 100) * chartH;
          return <circle cx={px} cy={py} r={3} fill={PURPLE} opacity={0.75} />;
        })()}

        {/* X-axis */}
        <line x1={chartX} y1={chartTop + chartH + 1}
          x2={chartX + totalBarW} y2={chartTop + chartH + 1}
          stroke="rgba(0,0,0,0.10)" strokeWidth={1} />

        {/* Legend */}
        <circle cx={frontX + 12} cy={frontY + cardH - 14} r={3} fill={TEAL} />
        <rect   x={frontX + 18}  y={frontY + cardH - 16} width={22} height={4} rx={2} fill="rgba(0,0,0,0.09)" />
        <circle cx={frontX + 52} cy={frontY + cardH - 14} r={3} fill={PURPLE} />
        <rect   x={frontX + 58}  y={frontY + cardH - 16} width={22} height={4} rx={2} fill="rgba(0,0,0,0.09)" />
        <circle cx={frontX + 92} cy={frontY + cardH - 14} r={3} fill={AMBER} />
        <rect   x={frontX + 98}  y={frontY + cardH - 16} width={22} height={4} rx={2} fill="rgba(0,0,0,0.09)" />
      </g>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnalyzeLanding() {
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
        <Sidebar activePage="analyze" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered analytics
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <AnalyzeVisual />
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
                Insights that speak<br />
                <span style={{ color: TEAL }}>for themselves.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Connect your searches and Mira turns raw coverage into dashboards — tracking share of voice, sentiment, trends, and more, updated automatically.
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
                    Select searches to power your dashboard
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
                    onClick={() => navigate("/analyze-dashboard")}
                    disabled={selectedSearches.length === 0}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Build my dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Auto-updated · Shareable · Powered by Mira AI
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
