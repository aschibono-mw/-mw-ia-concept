import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { X, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const TEAL   = "#00827F";
const BLUE   = "#4F6AF5";
const PURPLE = "#B627A1";
const AMBER  = "#f59e0b";
const CORAL  = "#e86c5a";

// Suggestion chips
const SUGGESTIONS = [
  { label: "Your brand name",      example: "e.g. Tesla"         },
  { label: "A competitor",         example: "e.g. Rivian"        },
  { label: "An executive",         example: "e.g. Elon Musk"     },
  { label: "An industry topic",    example: "e.g. EV industry"   },
  { label: "A product or campaign",example: "e.g. Cybertruck"    },
];

// What you'll get — shown as a preview inside the card
const PREVIEWS = [
  { color: TEAL,   label: "Media coverage",    sub: "Across 300,000+ sources in real time"  },
  { color: BLUE,   label: "Sentiment trends",  sub: "Positive, negative, and neutral signals" },
  { color: PURPLE, label: "Spike alerts",      sub: "Instant notifications on unusual volume" },
  { color: AMBER,  label: "Competitive context", sub: "How you compare to others in your space" },
];

// ── Illustration: input → signals ────────────────────────────────────────────
function SearchSetupIllustration() {
  const sources = [
    { y: 20,  color: BLUE,   label: "News",       lines: [68, 48, 55] },
    { y: 120, color: CORAL,  label: "Social",     lines: [75, 52, 44] },
    { y: 220, color: PURPLE, label: "Broadcast",  lines: [58, 70, 42] },
    { y: 320, color: AMBER,  label: "Podcasts",   lines: [62, 46, 58] },
  ];

  // Central search panel
  const px = 220, py = 60, pw = 220, ph = 240;
  const headerH = 40;

  return (
    <svg width="100%" viewBox="0 0 560 400" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id="ss-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.10)" />
        </filter>
        <filter id="ss-card" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,0.07)" />
        </filter>
        <linearGradient id="ss-header" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="100%" stopColor="#005f5d" />
        </linearGradient>
        <linearGradient id="ss-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="#F2F5F5" stopOpacity="0" />
          <stop offset="100%" stopColor="#F2F5F5" stopOpacity="1" />
        </linearGradient>
        <clipPath id="ss-clip">
          <rect x={px} y={py} width={pw} height={ph} rx={14} />
        </clipPath>
      </defs>

      {/* Source cards (left) */}
      {sources.map((src, i) => (
        <g key={i} filter="url(#ss-card)">
          <rect x={10} y={src.y} width={155} height={68} rx={10} fill="white" />
          <rect x={10} y={src.y} width={155} height={22} rx={10} fill={src.color} opacity={0.9} />
          <rect x={10} y={src.y + 13} width={155} height={9} fill={src.color} opacity={0.9} />
          <text x={20} y={src.y + 15} fontSize="9.5" fontWeight="700" fill="white">{src.label}</text>
          {src.lines.map((len, j) => (
            <rect key={j} x={18} y={src.y + 30 + j * 12} width={len} height={4} rx={2} fill="#e2e8f0" />
          ))}
        </g>
      ))}

      {/* Connectors: source cards → central panel */}
      {sources.map((src, i) => {
        const sx = 165, sy = src.y + 34;
        const ex = px,  ey = py + headerH + 28 + i * 44;
        const mx = (sx + ex) / 2;
        return (
          <path key={i}
            d={`M ${sx},${sy} C ${mx},${sy} ${mx},${ey} ${ex},${ey}`}
            fill="none" stroke={src.color} strokeWidth="1.5" opacity="0.3" strokeDasharray="5,4"
          />
        );
      })}

      {/* Central panel */}
      <rect x={px} y={py} width={pw} height={ph} rx={14} fill="white" filter="url(#ss-shadow)" />
      {/* Header */}
      <rect x={px} y={py} width={pw} height={headerH} rx={14} fill="url(#ss-header)" />
      <rect x={px} y={py + headerH - 8} width={pw} height={8} fill={TEAL} />

      {/* Header text */}
      <text x={px + 14} y={py + 16} fontSize="10" fontWeight="700" fill="white">Your search</text>
      <text x={px + 14} y={py + 29} fontSize="8" fill="rgba(255,255,255,0.70)">meltwater.com</text>
      {/* Sparkle */}
      <polygon
        points={`${px+pw-20},${py+14} ${px+pw-17},${py+19} ${px+pw-12},${py+21} ${px+pw-17},${py+23} ${px+pw-20},${py+28} ${px+pw-23},${py+23} ${px+pw-28},${py+21} ${px+pw-23},${py+19}`}
        fill="rgba(255,255,255,0.55)"
      />

      {/* Panel content */}
      <g clipPath="url(#ss-clip)">
        {/* Search input mock */}
        <rect x={px+12} y={py+headerH+10} width={pw-24} height={28} rx={7} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x={px+24} y={py+headerH+28} fontSize="9" fill="#94a3b8">Track "Tesla Brand"</text>
        <rect x={px+pw-36} y={py+headerH+14} width={20} height={20} rx={5} fill={TEAL} />
        <text x={px+pw-26} y={py+headerH+27} textAnchor="middle" fontSize="10" fill="white" fontWeight="800">→</text>

        {/* Result rows */}
        {[
          { color: TEAL,   pct: 78, label: "Media coverage"    },
          { color: BLUE,   pct: 62, label: "Sentiment trends"  },
          { color: PURPLE, pct: 45, label: "Spike alerts"      },
          { color: AMBER,  pct: 55, label: "Competitors"       },
        ].map((row, i) => (
          <g key={i}>
            <circle cx={px+20} cy={py+headerH+62+i*38} r={4} fill={row.color} />
            <text x={px+31} y={py+headerH+65+i*38} fontSize="8.5" fill="#334155" fontWeight="600">{row.label}</text>
            <rect x={px+31} y={py+headerH+70+i*38} width={pw-55} height={4} rx={2} fill="#f1f5f9" />
            <rect x={px+31} y={py+headerH+70+i*38} width={(pw-55)*row.pct/100} height={4} rx={2} fill={row.color} opacity={0.55} />
          </g>
        ))}
      </g>

      {/* Fade overlay */}
      <rect x="0" y="0" width="560" height="400" fill="url(#ss-fade)" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const Home2 = () => {
  const navigate = useNavigate();
  const [input,   setInput]   = useState("");
  const [chips,   setChips]   = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  const addChip = (val: string) => {
    const v = val.trim();
    if (v && !chips.includes(v)) setChips(prev => [...prev, v]);
    setInput("");
  };

  const removeChip = (val: string) => setChips(prev => prev.filter(c => c !== val));

  const canContinue = chips.length > 0 || input.trim().length > 1;

  const handleContinue = () => {
    if (input.trim()) addChip(input.trim());
    navigate("/home2-dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="home2" />

        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-12">
            <div
              className="rounded-[28px] flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5", padding: "52px 64px 56px" }}
            >

              {/* Eyebrow */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 24,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: TEAL, boxShadow: `0 0 0 3px rgba(0,130,127,0.2)`,
                }} />
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
                  color: TEAL, textTransform: "uppercase",
                }}>
                  Setup · Step 1 of 3
                </p>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 52, fontWeight: 800, lineHeight: 1.08,
                textAlign: "center", letterSpacing: "-0.03em",
                marginBottom: 16, color: "#0f1a1a",
                fontFamily: "Nunito, sans-serif",
              }}>
                Welcome — you're in.<br />
                <span style={{ color: TEAL }}>Let's make Meltwater yours.</span>
              </h1>

              {/* Sub */}
              <p style={{
                fontSize: 15, color: "#64748b", textAlign: "center",
                maxWidth: 520, lineHeight: 1.7, marginBottom: 36,
              }}>
                You now have access to real-time media intelligence across 300,000+ sources.
                The first step is telling us what matters to you — your brand, your competitors,
                and the topics your team cares about. We'll handle the rest.
              </p>

              {/* ── White card ── */}
              <div style={{
                width: "100%", maxWidth: 540,
                background: "white", borderRadius: 20,
                boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
                overflow: "hidden",
                marginBottom: 36,
              }}>

                {/* Card header strip */}
                <div style={{
                  background: `linear-gradient(135deg, #0f1a1a 0%, #1a2e2e 100%)`,
                  padding: "18px 22px 16px",
                }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.25, letterSpacing: "-0.02em", fontFamily: "Nunito, sans-serif" }}>
                    What should we track for you?
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 5, lineHeight: 1.5 }}>
                    A <strong style={{ color: "white", fontWeight: 700 }}>Search</strong> monitors a topic across 300,000+ sources — news, social, broadcast, and podcasts — the moment it's mentioned.
                  </p>
                </div>

                {/* Input area */}
                <div style={{ padding: "18px 20px 14px" }}>

                  {/* Tag input */}
                  <div
                    onClick={() => (document.getElementById("search-input") as HTMLInputElement)?.focus()}
                    style={{
                      display: "flex", flexWrap: "wrap", alignItems: "center",
                      gap: 6, minHeight: 46,
                      border: `1.5px solid ${focused ? TEAL : "#e2e8f0"}`,
                      borderRadius: 12, padding: "8px 12px",
                      cursor: "text",
                      transition: "border-color 0.15s",
                      boxShadow: focused ? `0 0 0 3px rgba(0,130,127,0.08)` : "none",
                    }}
                  >
                    {chips.map((chip) => (
                      <span
                        key={chip}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: "rgba(0,130,127,0.10)", color: TEAL,
                          borderRadius: 8, padding: "3px 10px",
                          fontSize: 12, fontWeight: 600,
                        }}
                      >
                        {chip}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeChip(chip); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: TEAL, display: "flex" }}
                        >
                          <X style={{ width: 11, height: 11 }} />
                        </button>
                      </span>
                    ))}
                    <input
                      id="search-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === ",") && input.trim()) {
                          e.preventDefault();
                          addChip(input);
                        }
                        if (e.key === "Backspace" && !input && chips.length) {
                          removeChip(chips[chips.length - 1]);
                        }
                      }}
                      placeholder={chips.length ? `Add another — e.g., "a competitor" or "product launch"` : `e.g., "track mentions of our CEO in tech news" or just "brand crisis"`}
                      style={{
                        flex: 1, minWidth: 140, fontSize: 13,
                        border: "none", outline: "none", background: "transparent",
                        color: "#0f1a1a",
                      }}
                    />
                  </div>

                  {/* Suggestion chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginRight: 2 }}>Start with:</span>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => addChip(s.example.replace("e.g. ", ""))}
                        style={{
                          fontSize: 11.5, color: "#475569",
                          background: "#f1f5f9", border: "1px solid #e2e8f0",
                          borderRadius: 20, padding: "4px 10px",
                          cursor: "pointer", fontWeight: 500,
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* What you'll unlock */}
                <div style={{
                  borderTop: "1px solid #f1f5f9",
                  padding: "14px 20px",
                  background: "#fafbfc",
                }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.10em", marginBottom: 10 }}>
                    You'll unlock instantly
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                    {PREVIEWS.map((p) => (
                      <div key={p.label} style={{
                        display: "flex", alignItems: "flex-start", gap: 9,
                        background: "white", borderRadius: 10,
                        border: "1px solid #f1f5f9",
                        padding: "9px 10px",
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                          background: `${p.color}18`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <CheckCircle2 style={{ width: 13, height: 13, color: p.color }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#0f1a1a", lineHeight: 1.2 }}>{p.label}</p>
                          <p style={{ fontSize: 10.5, color: "#94a3b8", lineHeight: 1.4, marginTop: 1 }}>{p.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    style={{
                      width: "100%", padding: "13px 20px",
                      background: canContinue ? TEAL : "#e2e8f0",
                      color: canContinue ? "white" : "#94a3b8",
                      borderRadius: 12, border: "none",
                      cursor: canContinue ? "pointer" : "not-allowed",
                      fontSize: 14, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.15s, opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { if (canContinue) (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                  >
                    {canContinue ? (
                      <>Start tracking — build my workspace <ArrowRight style={{ width: 16, height: 16 }} /></>
                    ) : (
                      <>Type a topic above to get started</>
                    )}
                  </button>
                </div>

                {/* Mira assist */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 20px",
                  background: "rgba(0,130,127,0.03)",
                  borderTop: "1px solid #f1f5f9",
                }}>
                  <Sparkles style={{ width: 13, height: 13, color: TEAL, flexShrink: 0 }} />
                  <p style={{ fontSize: 11.5, color: "#64748b" }}>
                    Not sure where to start?{" "}
                    <button
                      onClick={() => navigate("/mira")}
                      style={{ color: TEAL, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 11.5, padding: 0 }}
                    >
                      Ask Mira — she'll help you figure it out →
                    </button>
                  </p>
                </div>
              </div>

              {/* Footer note */}
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, letterSpacing: "0.04em" }}>
                300,000+ sources · Updated in real time · AI-powered by Mira
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home2;
