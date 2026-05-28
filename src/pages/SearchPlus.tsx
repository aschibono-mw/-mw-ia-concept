import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Search, Sparkles, ArrowRight, X, Globe, TrendingUp,
  Radio, Users, ShieldAlert, BarChart2, Building2,
} from "lucide-react";

// ── Brand tokens ────────────────────────────────────────────────────────────
const TEAL       = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";
const PURPLE     = "#B627A1";
const AMBER      = "#f59e0b";

// ── Suggested starter topics ─────────────────────────────────────────────────
const TOPICS = [
  { label: "Brand mentions",        Icon: Globe,       color: TEAL,      bg: TEAL_LIGHT },
  { label: "Competitor coverage",   Icon: TrendingUp,  color: "#4F6AF5", bg: "rgba(79,106,245,0.10)" },
  { label: "Industry news",         Icon: Radio,       color: AMBER,     bg: "rgba(245,158,11,0.10)" },
  { label: "Executive visibility",  Icon: Users,       color: PURPLE,    bg: "rgba(182,39,161,0.08)" },
  { label: "Crisis signals",        Icon: ShieldAlert, color: "#e86c5a", bg: "rgba(232,108,90,0.10)" },
  { label: "Market trends",         Icon: BarChart2,   color: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
  { label: "Regulatory updates",    Icon: Building2,   color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
];

// ── Search visual (same as SearchLanding) ────────────────────────────────────
function SearchVisual() {
  const cx = 88, cy = 80;
  const R  = 58;
  const sw = 11;
  const ir = R - sw / 2;
  const d   = 0.7071;
  const hx1 = cx + R * d,   hy1 = cy + R * d;
  const hx2 = hx1 + 50 * d, hy2 = hy1 + 50 * d;
  const chipX = cx + R + 14;

  return (
    <svg width="248" height="230" viewBox="0 0 248 230" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="sp-clip">
          <circle cx={cx} cy={cy} r={ir} />
        </clipPath>
        <filter id="sp-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,130,127,0.20)" />
        </filter>
        <filter id="sp-chip-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.10)" />
        </filter>
      </defs>
      <line x1={hx1} y1={hy1} x2={hx2} y2={hy2} stroke={PURPLE} strokeWidth={sw} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={ir} fill="white" filter="url(#sp-shadow)" />
      <g clipPath="url(#sp-clip)">
        <rect x={cx-42} y={cy-46} width={84} height={14} rx={4} fill="#F2F5F5" />
        <circle cx={cx-33} cy={cy-39} r={3.5} fill="none" stroke={PURPLE} strokeWidth={1.5} />
        <line x1={cx-30} y1={cy-36} x2={cx-28} y2={cy-34} stroke={PURPLE} strokeWidth={1.5} strokeLinecap="round" />
        <rect x={cx-24} y={cy-41} width={32} height={4} rx={2} fill={PURPLE + "40"} />
        <rect x={cx+10} y={cy-42} width={1} height={8} rx={0.5} fill={PURPLE + "80"} />
        <line x1={cx-44} y1={cy-28} x2={cx+44} y2={cy-28} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />
        <circle cx={cx-38} cy={cy-19} r={3} fill={PURPLE} />
        <rect x={cx-32} y={cy-21} width={22} height={4} rx={2} fill={PURPLE + "45"} />
        <rect x={cx-44} y={cy-12} width={76} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
        <rect x={cx-44} y={cy-5}  width={52} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />
        <circle cx={cx-38} cy={cy+9}  r={3} fill={TEAL} />
        <rect x={cx-32} y={cy+7}  width={18} height={4} rx={2} fill={TEAL + "45"} />
        <rect x={cx-44} y={cy+16} width={66} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
        <rect x={cx-44} y={cy+23} width={44} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />
        <circle cx={cx-38} cy={cy+36} r={3} fill={AMBER} />
        <rect x={cx-32} y={cy+34} width={24} height={4} rx={2} fill={AMBER + "45"} />
        <rect x={cx-44} y={cy+43} width={70} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={PURPLE} strokeWidth={sw} />
      <g filter="url(#sp-chip-shadow)">
        <rect x={chipX} y={6}  width={74} height={46} rx={8} fill="white" />
        <circle cx={chipX+10} cy={20} r={3}  fill="#4F6AF5" />
        <rect x={chipX+17}   y={17} width={24} height={4} rx={2} fill="#4F6AF550" />
        <rect x={chipX+6}    y={26} width={60} height={5} rx={2.5} fill="rgba(0,0,0,0.11)" />
        <rect x={chipX+6}    y={34} width={40} height={4} rx={2}   fill="rgba(0,0,0,0.06)" />
      </g>
      <g filter="url(#sp-chip-shadow)">
        <rect x={chipX+4} y={72} width={68} height={44} rx={8} fill="white" />
        <circle cx={chipX+14} cy={85} r={3}  fill="#e86c5a" />
        <rect x={chipX+21}    y={82} width={20} height={4} rx={2} fill="#e86c5a50" />
        <rect x={chipX+8}     y={91} width={54} height={5} rx={2.5} fill="rgba(0,0,0,0.11)" />
        <rect x={chipX+8}     y={99} width={36} height={4} rx={2}   fill="rgba(0,0,0,0.06)" />
      </g>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SearchPlus() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="search-plus" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            {/* ── Hero pane ── */}
            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center mb-8"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered media search
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 190, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -58, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.82)", transformOrigin: "top center", flexShrink: 0 }}>
                  <SearchVisual />
                </div>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 90, pointerEvents: "none",
                  background: "linear-gradient(to bottom, transparent, #F2F5F5)",
                }} />
              </div>

              {/* Headline */}
              <h1
                className="font-nunito font-black leading-[1.05] tracking-tight text-foreground mb-3 text-center"
                style={{ fontSize: "clamp(38px, 5vw, 56px)", position: "relative", zIndex: 1 }}
              >
                Find every signal<br />
                <span style={{ color: PURPLE }}>that matters to you.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 560 }}
              >
                Power your dashboards, newsletters, digests, and alert triggers — across millions of articles, broadcasts and social posts in real time.
                Tell Mira what you care about and it does the rest.
              </p>

              {/* ── AI search card ── */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  width: "min(620px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                  <p className="text-[14px] font-semibold text-foreground">
                    What do you want to track? Use keywords, phrases, or full sentences.
                  </p>
                  <button
                    className="flex items-center gap-1 text-[12px] font-medium whitespace-nowrap ml-4 flex-shrink-0 hover:opacity-70 transition-opacity"
                    style={{ color: PURPLE }}
                  >
                    <span style={{ fontSize: 11 }}>{"<>"}</span> View boolean
                  </button>
                </div>

                <div className="px-5 pb-3">
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ border: `1.5px solid ${query ? `${PURPLE}50` : "rgba(0,0,0,0.10)"}` }}
                  >
                    <input
                      type="text"
                      placeholder={`e.g., "track mentions of our CEO in tech news" or just "brand crisis"`}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && query.trim()) { e.preventDefault(); navigate("/search-plus-hub"); }}}
                      className="flex-1 text-[13px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground/50"
                    />
                    <span className="text-[11px] text-muted-foreground/40 whitespace-nowrap flex-shrink-0">↵ to send</span>
                    <button
                      disabled={!query.trim()}
                      onClick={() => navigate("/search-plus-hub")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                      style={{ backgroundColor: PURPLE }}
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-5 pb-4 flex-wrap">
                  <span className="text-[12px] text-muted-foreground font-medium">Try:</span>
                  {["brand mentions", "competitor tracking", "executive coverage", "industry news"].map(chip => (
                    <button
                      key={chip}
                      onClick={() => setQuery(chip)}
                      className="text-[12px] text-muted-foreground hover:text-foreground px-3 py-1 rounded-full transition-all"
                      style={{ border: "1px solid rgba(0,0,0,0.10)" }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Covers 300,000+ sources · Updated in real time · Powered by Mira AI
              </p>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}
