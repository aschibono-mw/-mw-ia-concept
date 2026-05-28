import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, ArrowRight, ChevronDown, Check, Globe, Building2 } from "lucide-react";

const TEAL   = "#00827F";
const PURPLE = "#B627A1";
const AMBER  = "#f59e0b";
const BLUE   = "#4F6AF5";
const CORAL  = "#e86c5a";

// ── Brand / sub-brand data (Nike example) ────────────────────────────────────
interface Brand {
  id: string;
  name: string;
  url: string;
  description: string;
  color: string;
  isParent?: boolean;
}

const BRANDS: Brand[] = [
  { id: "nike",           name: "Nike",           url: "nike.com",          description: "Main brand",              color: "#111111", isParent: true },
  { id: "jordan",         name: "Jordan Brand",   url: "jordan.com",        description: "Premium basketball",      color: CORAL   },
  { id: "converse",       name: "Converse",       url: "converse.com",      description: "Lifestyle & street",      color: "#E31937" },
  { id: "nike-running",   name: "Nike Running",   url: "nike.com/running",  description: "Performance running",     color: TEAL    },
  { id: "nike-basketball",name: "Nike Basketball",url: "nike.com/basketball","description": "Basketball performance", color: "#F37021" },
  { id: "nike-training",  name: "Nike Training",  url: "nike.com/training", description: "Training & fitness",      color: BLUE    },
  { id: "nike-sb",        name: "Nike SB",        url: "nike.com/sb",       description: "Skateboarding",           color: PURPLE  },
];

// ── GenAI Lens illustration — raw signals → AI lens panel → narrative topics ──
function GenAILensVisual() {
  // Source cards on the left (raw, unstructured signals)
  const panelX = 170, panelY = 8, panelW = 122, panelH = 208;
  const pCY = panelY + panelH / 2;

  const sources = [
    { color: TEAL,   y: 14,  items: [74, 52] },
    { color: CORAL,  y: 88,  items: [62, 46] },
    { color: AMBER,  y: 162, items: [70, 50] },
  ];

  // Narrative topic rows inside the lens panel
  // Each row has a coloured topic pill on the left + sparkle indicator on right
  const topics = [
    { pill: PURPLE, pillW: 36, w1: 58, w2: 44 },
    { pill: TEAL,   pillW: 28, w1: 64, w2: 38 },
    { pill: BLUE,   pillW: 32, w1: 54, w2: 46 },
    { pill: AMBER,  pillW: 40, w1: 60, w2: 36 },
  ];

  return (
    <svg width="300" height="228" viewBox="0 0 300 228" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        {/* Purple-to-teal gradient for panel header */}
        <linearGradient id="gl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={PURPLE} />
          <stop offset="100%" stopColor={TEAL}   />
        </linearGradient>
        <filter id="gl-panel" x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(182,39,161,0.18)" />
        </filter>
        <filter id="gl-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Raw signal source cards (left) ── */}
      {sources.map(({ color, y, items }, i) => {
        const cardH = 60;
        const midY  = y + cardH / 2;
        const cx1   = 130, cx2 = panelX - 20;
        return (
          <g key={i}>
            {/* Bezier connector */}
            <path
              d={`M 119 ${midY} C ${cx1} ${midY} ${cx2} ${pCY} ${panelX} ${pCY}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.32}
            />
            <g filter="url(#gl-card)">
              <rect x={5} y={y} width={114} height={cardH} rx={9} fill="white" />
              <rect x={5} y={y} width={5}   height={cardH} rx={3} fill={color} />
              {/* Pulse dot */}
              <circle cx={109} cy={y + 12} r={4}   fill={color} opacity={0.18} />
              <circle cx={109} cy={y + 12} r={2.5} fill={color} />
              {/* Raw content lines — slightly more chaotic widths to feel "unstructured" */}
              <rect x={13} y={y + 9}  width={items[0]} height={5} rx={2.5} fill="rgba(0,0,0,0.10)" />
              <rect x={13} y={y + 19} width={items[1] - 8} height={4} rx={2} fill="rgba(0,0,0,0.07)" />
              <rect x={13} y={y + 28} width={items[0] - 18} height={4} rx={2} fill="rgba(0,0,0,0.05)" />
              <rect x={13} y={y + 37} width={items[1]} height={4} rx={2} fill="rgba(0,0,0,0.07)" />
              <rect x={13} y={y + 46} width={items[0] - 30} height={4} rx={2} fill="rgba(0,0,0,0.04)" />
            </g>
          </g>
        );
      })}

      {/* ── Main GenAI Lens panel ── */}
      <g filter="url(#gl-panel)">
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={11} fill="white" />

        {/* Header — purple → teal gradient */}
        <rect x={panelX}      y={panelY}      width={panelW} height={40} rx={11} fill="url(#gl-grad)" />
        <rect x={panelX}      y={panelY + 22} width={panelW} height={18} fill="url(#gl-grad)" />

        {/* Lens icon placeholder */}
        <rect x={panelX + 8}  y={panelY + 11} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />
        {/* Lens circles */}
        <circle cx={panelX + 16} cy={panelY + 19} r={5}   fill="none" stroke="rgba(255,255,255,0.70)" strokeWidth={1.5} />
        <circle cx={panelX + 16} cy={panelY + 19} r={2.5} fill="rgba(255,255,255,0.55)" />
        {/* Sparkle rays around lens */}
        <line x1={panelX + 22} y1={panelY + 13} x2={panelX + 24} y2={panelY + 11} stroke="rgba(255,255,255,0.50)" strokeWidth={1} />
        <line x1={panelX + 22} y1={panelY + 25} x2={panelX + 24} y2={panelY + 27} stroke="rgba(255,255,255,0.50)" strokeWidth={1} />
        <line x1={panelX + 25} y1={panelY + 19} x2={panelX + 27} y2={panelY + 19} stroke="rgba(255,255,255,0.50)" strokeWidth={1} />

        {/* Title lines */}
        <rect x={panelX + 30} y={panelY + 15} width={50} height={5} rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={panelX + 30} y={panelY + 23} width={34} height={4} rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* "AI" badge */}
        <rect  x={panelX + panelW - 24} y={panelY + 14} width={18} height={11} rx={5.5} fill="rgba(255,255,255,0.22)" />
        <rect  x={panelX + panelW - 22} y={panelY + 17} width={14} height={4}  rx={2}   fill="rgba(255,255,255,0.55)" />

        {/* Narrative topic rows */}
        {topics.map(({ pill, pillW, w1, w2 }, i) => {
          const ry = panelY + 54 + i * 37;
          return (
            <g key={i}>
              {/* Topic pill label */}
              <rect x={panelX + 8} y={ry} width={pillW} height={9} rx={4.5} fill={pill} opacity={0.18} />
              <rect x={panelX + 11} y={ry + 2} width={pillW - 6} height={5} rx={2} fill={pill} opacity={0.55} />

              {/* Narrative insight lines */}
              <rect x={panelX + 8}  y={ry + 13} width={w1 * 0.82} height={5} rx={2.5} fill="rgba(0,0,0,0.13)" />
              <rect x={panelX + 8}  y={ry + 21} width={w2 * 0.82} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

              {/* Sparkle indicator (AI-generated) */}
              {/* 4-point star shape */}
              <path
                d={`M ${panelX + panelW - 11} ${ry + 2}
                    L ${panelX + panelW - 10} ${ry + 6}
                    L ${panelX + panelW - 6}  ${ry + 7}
                    L ${panelX + panelW - 10} ${ry + 8}
                    L ${panelX + panelW - 11} ${ry + 12}
                    L ${panelX + panelW - 12} ${ry + 8}
                    L ${panelX + panelW - 16} ${ry + 7}
                    L ${panelX + panelW - 12} ${ry + 6} Z`}
                fill={pill}
                opacity={0.35}
              />

              {/* Divider */}
              {i < topics.length - 1 && (
                <line
                  x1={panelX + 6} y1={ry + 29}
                  x2={panelX + panelW - 6} y2={ry + 29}
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
export default function GenAILensLanding() {
  const navigate = useNavigate();
  const [selected, setSelected]     = useState<Brand>(BRANDS[0]);
  const [dropOpen, setDropOpen]     = useState(false);
  const [brandUrl, setBrandUrl]     = useState(BRANDS[0].url);
  const [urlEdited, setUrlEdited]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectBrand = (brand: Brand) => {
    setSelected(brand);
    if (!urlEdited) setBrandUrl(brand.url);
    setDropOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="genai-lens" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI narrative intelligence
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <GenAILensVisual />
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
                AI brand monitoring<br />
                <span style={{ color: TEAL }}>for LLM visibility.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Connect your searches and GenAI Lens surfaces the narratives, themes, and sentiment driving your coverage — turning raw signals into structured intelligence you can understand and act on instantly.
              </p>

              {/* Brand selector card */}
              <div
                className="bg-white rounded-2xl"
                style={{
                  width: "min(560px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div className="px-5 pt-5 pb-4 flex flex-col gap-4">

                  {/* Brand dropdown */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Brand to analyse
                    </p>
                    <div ref={dropRef} className="relative">
                      {/* Trigger */}
                      <button
                        onClick={() => setDropOpen(o => !o)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                        style={{
                          border: `1.5px solid ${dropOpen ? `${TEAL}60` : "rgba(0,0,0,0.12)"}`,
                          backgroundColor: dropOpen ? `${TEAL}04` : "white",
                        }}
                      >
                        {/* Colour swatch */}
                        <div
                          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: selected.color + "18" }}
                        >
                          <Building2 className="w-3.5 h-3.5" style={{ color: selected.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-semibold text-foreground">{selected.name}</span>
                            {selected.isParent && (
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: `${selected.color}15`, color: selected.color }}
                              >
                                Main brand
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-muted-foreground">{selected.description}</p>
                        </div>
                        <ChevronDown
                          className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
                          style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </button>

                      {/* Dropdown list */}
                      {dropOpen && (
                        <div
                          className="absolute left-0 right-0 mt-1 bg-white rounded-xl overflow-hidden z-20"
                          style={{
                            border: "1.5px solid rgba(0,0,0,0.10)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                          }}
                        >
                          {/* Parent brand */}
                          {BRANDS.filter(b => b.isParent).map(brand => (
                            <button
                              key={brand.id}
                              onClick={() => selectBrand(brand)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: brand.color + "18" }}
                              >
                                <Building2 className="w-3.5 h-3.5" style={{ color: brand.color }} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-semibold text-foreground">{brand.name}</span>
                                  <span
                                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                    style={{ backgroundColor: `${brand.color}15`, color: brand.color }}
                                  >
                                    Main brand
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{brand.url}</p>
                              </div>
                              {selected.id === brand.id && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />}
                            </button>
                          ))}

                          {/* Sub-brands divider */}
                          <div className="mx-4 border-t border-border/60" />
                          <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            Sub-brands
                          </p>

                          {BRANDS.filter(b => !b.isParent).map(brand => (
                            <button
                              key={brand.id}
                              onClick={() => selectBrand(brand)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: brand.color + "18" }}
                              >
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brand.color }} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[13px] font-medium text-foreground">{brand.name}</p>
                                <p className="text-[11px] text-muted-foreground">{brand.description}</p>
                              </div>
                              {selected.id === brand.id && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand URL input */}
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Brand website
                    </p>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                        style={{ color: brandUrl ? TEAL : "var(--muted-foreground)" }}
                      />
                      <input
                        type="text"
                        placeholder="e.g. nike.com"
                        value={brandUrl}
                        onChange={e => { setBrandUrl(e.target.value); setUrlEdited(true); }}
                        className="w-full pl-8 pr-3 py-2.5 text-[13px] rounded-xl outline-none transition-all"
                        style={{
                          border: `1.5px solid ${brandUrl ? `${TEAL}50` : "rgba(0,0,0,0.10)"}`,
                          backgroundColor: "rgba(0,0,0,0.015)",
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Used to identify how your brand appears in AI-generated responses across LLMs.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-t border-border gap-4 rounded-b-2xl"
                  style={{ backgroundColor: "#f7f8f9" }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
                    <span className="text-xs font-medium text-muted-foreground">
                      Analysing <span className="font-semibold text-foreground">{selected.name}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/genai-lens-explore")}
                    disabled={!brandUrl.trim()}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Start analysing
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Powered by Mira AI · Across all your searches · Themes updated continuously
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
