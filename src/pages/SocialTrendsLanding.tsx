import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, Check, CheckCircle, Rss, ArrowRight } from "lucide-react";

const TEAL   = "#00827F";
const PURPLE = "#B627A1";
const AMBER  = "#f59e0b";
const BLUE   = "#4F6AF5";
const CORAL  = "#e86c5a";
const PINK   = "#E1306C";

const AVAILABLE_SEARCHES = [
  { name: "Brand Monitoring",    type: "explore" },
  { name: "Competitor Watch",    type: "explore" },
  { name: "Industry News",       type: "rss"     },
  { name: "Executive Coverage",  type: "explore" },
  { name: "Product Mentions",    type: "explore" },
  { name: "Market Trends",       type: "rss"     },
];

const SEARCH_TYPE_CFG: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  explore: { Icon: Search, color: BLUE,  bg: "rgba(79,106,245,0.10)" },
  rss:     { Icon: Rss,    color: CORAL, bg: "rgba(232,108,90,0.10)" },
};

// ── Social Trends illustration — platform cards → trending topics panel ────────
function SocialTrendsVisual() {
  const panelX = 170, panelY = 8, panelW = 122, panelH = 208;
  const pCY = panelY + panelH / 2;

  // Social platform source cards (left) — each represents a platform cluster
  const platforms = [
    { color: PINK,   y: 14,  items: [72, 54, 48] },   // Instagram / TikTok
    { color: BLUE,   y: 88,  items: [64, 50, 42] },   // X / Twitter
    { color: PURPLE, y: 162, items: [68, 52, 44] },   // LinkedIn / other
  ];

  // Trending topic rows in the panel
  const trends = [
    { rank: 1, color: PINK,   w1: 70, w2: 48, barW: 28, delta: "+4.2k" },
    { rank: 2, color: BLUE,   w1: 62, w2: 42, barW: 22, delta: "+2.8k" },
    { rank: 3, color: TEAL,   w1: 66, w2: 40, barW: 18, delta: "+1.5k" },
    { rank: 4, color: AMBER,  w1: 58, w2: 38, barW: 14, delta: "+930"  },
  ];

  return (
    <svg width="300" height="228" viewBox="0 0 300 228" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        {/* Pink → purple gradient for panel header */}
        <linearGradient id="st-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={PINK}   />
          <stop offset="100%" stopColor={PURPLE} />
        </linearGradient>
        <filter id="st-panel" x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(225,48,108,0.18)" />
        </filter>
        <filter id="st-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Platform source cards (left) ── */}
      {platforms.map(({ color, y, items }, i) => {
        const cardH = 60;
        const midY  = y + cardH / 2;
        const cx1   = 130, cx2 = panelX - 20;
        return (
          <g key={i}>
            <path
              d={`M 119 ${midY} C ${cx1} ${midY} ${cx2} ${pCY} ${panelX} ${pCY}`}
              fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.32}
            />
            <g filter="url(#st-card)">
              <rect x={5} y={y} width={114} height={cardH} rx={9} fill="white" />
              <rect x={5} y={y} width={5}   height={cardH} rx={3} fill={color} />
              {/* Platform "notification" pulse */}
              <circle cx={109} cy={y + 12} r={4}   fill={color} opacity={0.18} />
              <circle cx={109} cy={y + 12} r={2.5} fill={color} />
              {/* Hashtag # shape suggestion */}
              <rect x={13} y={y + 8}  width={8}  height={2} rx={1} fill={color} opacity={0.40} />
              <rect x={13} y={y + 13} width={8}  height={2} rx={1} fill={color} opacity={0.40} />
              <rect x={15} y={y + 6}  width={2}  height={10} rx={1} fill={color} opacity={0.40} />
              <rect x={19} y={y + 6}  width={2}  height={10} rx={1} fill={color} opacity={0.40} />
              {/* Content lines (posts/mentions) */}
              <rect x={28} y={y + 8}  width={items[0]} height={4} rx={2} fill="rgba(0,0,0,0.12)" />
              <rect x={28} y={y + 17} width={items[1]} height={4} rx={2} fill="rgba(0,0,0,0.08)" />
              <rect x={28} y={y + 26} width={items[2]} height={4} rx={2} fill="rgba(0,0,0,0.06)" />
              {/* Volume mini-bar row at bottom */}
              {[16, 22, 14, 26, 18, 12, 20].map((h, j) => (
                <rect key={j}
                  x={13 + j * 12} y={y + cardH - 6 - h * 0.18}
                  width={8} height={h * 0.18} rx={1}
                  fill={color} opacity={0.20 + j * 0.03}
                />
              ))}
            </g>
          </g>
        );
      })}

      {/* ── Main trending topics panel ── */}
      <g filter="url(#st-panel)">
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={11} fill="white" />

        {/* Header — pink → purple gradient */}
        <rect x={panelX}      y={panelY}      width={panelW} height={40} rx={11} fill="url(#st-grad)" />
        <rect x={panelX}      y={panelY + 22} width={panelW} height={18} fill="url(#st-grad)" />

        {/* Trending arrow icon in header */}
        <rect x={panelX + 8} y={panelY + 11} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />
        {/* Up-trend arrow */}
        <path
          d={`M ${panelX + 12} ${panelY + 25} L ${panelX + 12} ${panelY + 19} L ${panelX + 17} ${panelY + 14} L ${panelX + 22} ${panelY + 19} L ${panelX + 22} ${panelY + 25}`}
          fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx={panelX + 17} cy={panelY + 14} r={2} fill="rgba(255,255,255,0.75)" />

        {/* Title lines */}
        <rect x={panelX + 30} y={panelY + 15} width={52} height={5} rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={panelX + 30} y={panelY + 23} width={36} height={4} rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* "Live" badge */}
        <circle cx={panelX + panelW - 14} cy={panelY + 19} r={5}   fill="rgba(255,255,255,0.20)" />
        <circle cx={panelX + panelW - 14} cy={panelY + 19} r={3}   fill="rgba(255,255,255,0.65)" />

        {/* Trending topic rows */}
        {trends.map(({ rank, color, w1, w2, barW }, i) => {
          const ry = panelY + 54 + i * 37;
          return (
            <g key={i}>
              {/* Rank pill */}
              <rect x={panelX + 7} y={ry} width={14} height={9} rx={4.5} fill={color} opacity={0.18} />
              <rect x={panelX + 9} y={ry + 2} width={10} height={5} rx={2} fill={color} opacity={0.55} />

              {/* Topic text lines */}
              <rect x={panelX + 26} y={ry}      width={w1 * 0.64} height={5} rx={2.5} fill="rgba(0,0,0,0.13)" />
              <rect x={panelX + 8}  y={ry + 11} width={w2 * 0.64} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

              {/* Trending up arrow (right side) */}
              <path
                d={`M ${panelX + panelW - 16} ${ry + 7} L ${panelX + panelW - 13} ${ry + 3} L ${panelX + panelW - 10} ${ry + 7}`}
                fill="none" stroke={color} strokeWidth={1.3}
                strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Volume delta bar */}
              <rect
                x={panelX + panelW - 9 - barW} y={ry + 14}
                width={barW} height={3} rx={1.5}
                fill={color} opacity={0.30}
              />
              <rect
                x={panelX + panelW - 9 - barW} y={ry + 14}
                width={barW * 0.6} height={3} rx={1.5}
                fill={color} opacity={0.55}
              />

              {/* Divider */}
              {i < trends.length - 1 && (
                <line
                  x1={panelX + 6} y1={ry + 24}
                  x2={panelX + panelW - 6} y2={ry + 24}
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
export default function SocialTrendsLanding() {
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
        <Sidebar activePage="social-trends" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                Real-time social intelligence
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <SocialTrendsVisual />
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
                What the world<br />
                <span style={{ color: TEAL }}>is talking about.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Connect your searches and Social Trends shows you exactly which topics, hashtags, and conversations are gaining momentum across every major platform — so you never miss a cultural moment.
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
                    Select searches to track trends for
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
                    onClick={() => navigate("/social-trends-explore")}
                    disabled={selectedSearches.length === 0}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Explore what's trending
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Across TikTok, Instagram, X, LinkedIn & more · Updated in real time · Powered by Mira AI
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
