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
  { label: "Brand mentions",        Icon: Globe,       color: TEAL,   bg: TEAL_LIGHT },
  { label: "Competitor coverage",   Icon: TrendingUp,  color: "#4F6AF5", bg: "rgba(79,106,245,0.10)" },
  { label: "Industry news",         Icon: Radio,       color: AMBER,  bg: "rgba(245,158,11,0.10)" },
  { label: "Executive visibility",  Icon: Users,       color: PURPLE, bg: "rgba(182,39,161,0.08)" },
  { label: "Crisis signals",        Icon: ShieldAlert, color: "#e86c5a", bg: "rgba(232,108,90,0.10)" },
  { label: "Market trends",         Icon: BarChart2,   color: "#0ea5e9", bg: "rgba(14,165,233,0.10)" },
  { label: "Regulatory updates",    Icon: Building2,   color: "#8b5cf6", bg: "rgba(139,92,246,0.10)" },
];

// ── Search result stack visual (pure SVG) ────────────────────────────────────
function SearchVisual() {
  // Lens geometry
  const cx = 88, cy = 80;   // lens centre
  const R  = 58;             // outer radius
  const sw = 11;             // stroke width
  const ir = R - sw / 2;    // inner radius for clip = 52.5

  // Handle: from outer edge at 45°, extending 52px further at 45°
  const d   = 0.7071;
  const hx1 = cx + R * d,   hy1 = cy + R * d;   // start (on ring edge)
  const hx2 = hx1 + 50 * d, hy2 = hy1 + 50 * d; // end

  // Chip positions (right of lens)
  const chipX = cx + R + 14;

  return (
    <svg width="248" height="230" viewBox="0 0 248 230" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <clipPath id="sv-clip">
          <circle cx={cx} cy={cy} r={ir} />
        </clipPath>
        <filter id="sv-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,130,127,0.20)" />
        </filter>
        <filter id="chip-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.10)" />
        </filter>
      </defs>

      {/* ── Handle (drawn first, ring paints over the join) ── */}
      <line
        x1={hx1} y1={hy1} x2={hx2} y2={hy2}
        stroke={TEAL} strokeWidth={sw} strokeLinecap="round"
      />

      {/* ── Lens white fill + shadow ── */}
      <circle cx={cx} cy={cy} r={ir} fill="white" filter="url(#sv-shadow)" />

      {/* ── Content clipped to lens ── */}
      <g clipPath="url(#sv-clip)">
        {/* Search bar bg */}
        <rect x={cx-42} y={cy-46} width={84} height={14} rx={4} fill="#F2F5F5" />
        {/* Search icon (circle + handle) */}
        <circle cx={cx-33} cy={cy-39} r={3.5} fill="none" stroke={TEAL} strokeWidth={1.5} />
        <line x1={cx-30} y1={cy-36} x2={cx-28} y2={cy-34} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
        {/* Search bar fill */}
        <rect x={cx-24} y={cy-41} width={32} height={4} rx={2} fill={TEAL + "40"} />
        {/* Cursor */}
        <rect x={cx+10} y={cy-42} width={1} height={8} rx={0.5} fill={TEAL + "80"} />

        {/* Divider */}
        <line x1={cx-44} y1={cy-28} x2={cx+44} y2={cy-28} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />

        {/* Row 1 — TEAL */}
        <circle cx={cx-38} cy={cy-19} r={3} fill={TEAL} />
        <rect x={cx-32} y={cy-21} width={22} height={4} rx={2} fill={TEAL + "45"} />
        <rect x={cx-44} y={cy-12} width={76} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
        <rect x={cx-44} y={cy-5}  width={52} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

        {/* Row 2 — PURPLE */}
        <circle cx={cx-38} cy={cy+9}  r={3} fill={PURPLE} />
        <rect x={cx-32} y={cy+7}  width={18} height={4} rx={2} fill={PURPLE + "45"} />
        <rect x={cx-44} y={cy+16} width={66} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
        <rect x={cx-44} y={cy+23} width={44} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

        {/* Row 3 — AMBER */}
        <circle cx={cx-38} cy={cy+36} r={3} fill={AMBER} />
        <rect x={cx-32} y={cy+34} width={24} height={4} rx={2} fill={AMBER + "45"} />
        <rect x={cx-44} y={cy+43} width={70} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
      </g>

      {/* ── Lens ring (on top of clip to sharpen edge) ── */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={TEAL} strokeWidth={sw} />

      {/* ── Floating chip 1 ── */}
      <g filter="url(#chip-shadow)">
        <rect x={chipX} y={6}  width={74} height={46} rx={8} fill="white" />
        <circle cx={chipX+10} cy={20} r={3}  fill="#4F6AF5" />
        <rect x={chipX+17}   y={17} width={24} height={4} rx={2} fill="#4F6AF550" />
        <rect x={chipX+6}    y={26} width={60} height={5} rx={2.5} fill="rgba(0,0,0,0.11)" />
        <rect x={chipX+6}    y={34} width={40} height={4} rx={2}   fill="rgba(0,0,0,0.06)" />
      </g>

      {/* ── Floating chip 2 ── */}
      <g filter="url(#chip-shadow)">
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
export default function SearchLanding() {
  const navigate = useNavigate();
  const [query, setQuery]               = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Brand mentions"]);

  const toggleTopic = (label: string) =>
    setSelectedTopics(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );

  const displayedTopics = query
    ? TOPICS.filter(t => t.label.toLowerCase().includes(query.toLowerCase()))
    : TOPICS.slice(0, 5);

  const canContinue = selectedTopics.length > 0 || query.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="discover" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            {/* ── Rounded grey pane ── */}
            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered media search
              </p>

              {/* Illustration — clipped so result cards peek up */}
              <div style={{
                position: "relative", height: 190, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -58, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.82)", transformOrigin: "top center", flexShrink: 0 }}>
                  <SearchVisual />
                </div>
                {/* Fade at base — tall enough to bleed over the headline */}
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
                <span style={{ color: TEAL }}>that matters to you.</span>
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
                {/* Header row */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                  <p className="text-[14px] font-semibold text-foreground">
                    What do you want to track? Use keywords, phrases, or full sentences.
                  </p>
                  <button
                    className="flex items-center gap-1 text-[12px] font-medium whitespace-nowrap ml-4 flex-shrink-0 hover:opacity-70 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    <span style={{ fontSize: 11 }}>{"<>"}</span> View boolean
                  </button>
                </div>

                {/* Input + send */}
                <div className="px-5 pb-3">
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ border: `1.5px solid ${query ? `${TEAL}50` : "rgba(0,0,0,0.10)"}` }}
                  >
                    <input
                      type="text"
                      placeholder={`e.g., "track mentions of our CEO in tech news" or just "brand crisis"`}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && query.trim()) { e.preventDefault(); navigate("/search"); }}}
                      className="flex-1 text-[13px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground/50"
                    />
                    <span className="text-[11px] text-muted-foreground/40 whitespace-nowrap flex-shrink-0">↵ to send</span>
                    <button
                      disabled={!query.trim()}
                      onClick={() => navigate("/search")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                      style={{ backgroundColor: TEAL }}
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Try chips */}
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
