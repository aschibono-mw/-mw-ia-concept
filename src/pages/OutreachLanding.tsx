import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ArrowRight, Send, Clock, Star, FileText, Users } from "lucide-react";

const TEAL   = "#00827F";
const PURPLE = "#B627A1";
const AMBER  = "#f59e0b";
const BLUE   = "#4F6AF5";
const CORAL  = "#e86c5a";

// ── Target media beats ────────────────────────────────────────────────────────
const BEATS = [
  { id: "tech",      label: "Tech & Innovation", color: BLUE   },
  { id: "business",  label: "Business & Finance", color: TEAL  },
  { id: "trade",     label: "Trade & Industry",   color: AMBER  },
  { id: "broadcast", label: "Broadcast & TV",     color: CORAL  },
  { id: "consumer",  label: "Consumer & Lifestyle", color: PURPLE },
];

// ── Recent pitches ────────────────────────────────────────────────────────────
const RECENT_PITCHES = [
  { name: "The Daily Media Brief",       category: "Brand",       sent: "Yesterday",   recipients: 10, starred: true  },
  { name: "Competitor Watch Update",     category: "Competition", sent: "Sep 28",      recipients: 18, starred: true  },
  { name: "Industry Trends Digest",      category: "Market",      sent: "Draft",       recipients: 0,  starred: false },
];

// ── Outreach illustration — panel sends outward to contact cards ───────────────
function OutreachVisual() {
  // Panel sits on the LEFT; contact cards radiate to the RIGHT
  const panelX = 6, panelY = 8, panelW = 120, panelH = 208;
  const pCY = panelY + panelH / 2; // mid-point on panel's right edge

  // Outreach rows inside the panel
  const rows = [
    { status: TEAL,   label: "sent",    w1: 74, w2: 50 },
    { status: PURPLE, label: "draft",   w1: 62, w2: 44 },
    { status: BLUE,   label: "opened",  w1: 70, w2: 48 },
    { status: AMBER,  label: "replied", w1: 58, w2: 40 },
  ];

  // Contact cards (right side)
  const contacts = [
    { color: TEAL,   y: 14,  avatar: "#00827F" },
    { color: PURPLE, y: 90,  avatar: "#B627A1" },
    { color: AMBER,  y: 164, avatar: "#f59e0b" },
  ];

  const cardX = 172, cardW = 118;

  return (
    <svg width="298" height="228" viewBox="0 0 298 228" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="or-panel" x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,130,127,0.18)" />
        </filter>
        <filter id="or-card" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.09)" />
        </filter>
      </defs>

      {/* ── Contact cards (right) — drawn first so panel renders on top ── */}
      {contacts.map(({ color, y }, i) => {
        const cardH = 60;
        const midY  = y + cardH / 2;
        const cx1   = panelX + panelW + 24;
        const cx2   = cardX - 22;
        return (
          <g key={i}>
            {/* Bezier from panel right edge → card left edge */}
            <path
              d={`M ${panelX + panelW} ${pCY} C ${cx1} ${pCY} ${cx2} ${midY} ${cardX} ${midY}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.35}
            />
            <g filter="url(#or-card)">
              <rect x={cardX} y={y} width={cardW} height={cardH} rx={9} fill="white" />
              {/* Right colour stripe */}
              <rect x={cardX + cardW - 5} y={y} width={5} height={cardH} rx={3} fill={color} />

              {/* Avatar circle */}
              <circle cx={cardX + 18} cy={y + 20} r={11} fill={color} opacity={0.12} />
              <circle cx={cardX + 18} cy={y + 20} r={8}  fill={color} opacity={0.22} />
              {/* Person silhouette */}
              <circle cx={cardX + 18} cy={y + 17} r={3.5} fill={color} opacity={0.7} />
              <path
                d={`M ${cardX + 11} ${y + 28} Q ${cardX + 18} ${y + 23} ${cardX + 25} ${y + 28}`}
                fill={color} opacity={0.5}
              />

              {/* Name + outlet lines */}
              <rect x={cardX + 33} y={y + 12} width={52} height={5}   rx={2.5} fill="rgba(0,0,0,0.14)" />
              <rect x={cardX + 33} y={y + 21} width={38} height={4}   rx={2}   fill="rgba(0,0,0,0.08)" />

              {/* Outlet badge */}
              <rect x={cardX + 8}  y={y + 38} width={36} height={9}   rx={4.5} fill={color} opacity={0.10} />
              <rect x={cardX + 11} y={y + 41} width={24} height={3}   rx={1.5} fill={color} opacity={0.50} />

              {/* "Replied" / "Sent" indicator dot */}
              <circle cx={cardX + cardW - 16} cy={y + 44} r={4}   fill={color} opacity={0.18} />
              <circle cx={cardX + cardW - 16} cy={y + 44} r={2.5} fill={color} />
            </g>
          </g>
        );
      })}

      {/* ── Main outreach panel (left) ── */}
      <g filter="url(#or-panel)">
        <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={11} fill="white" />

        {/* Header bar */}
        <rect x={panelX}      y={panelY}      width={panelW} height={40} rx={11} fill={TEAL} />
        <rect x={panelX}      y={panelY + 22} width={panelW} height={18} fill={TEAL} />

        {/* Icon placeholder */}
        <rect x={panelX + 8}  y={panelY + 11} width={18} height={18} rx={4} fill="rgba(255,255,255,0.22)" />

        {/* Envelope shape in icon */}
        <rect  x={panelX + 11} y={panelY + 15} width={12} height={8} rx={1.5} fill="rgba(255,255,255,0.65)" />
        <path
          d={`M ${panelX + 11} ${panelY + 15} L ${panelX + 17} ${panelY + 20} L ${panelX + 23} ${panelY + 15}`}
          fill="none" stroke="rgba(0,130,127,0.6)" strokeWidth={1.2} strokeLinejoin="round"
        />

        {/* Title lines */}
        <rect x={panelX + 30} y={panelY + 15} width={52} height={5} rx={2.5} fill="rgba(255,255,255,0.45)" />
        <rect x={panelX + 30} y={panelY + 23} width={36} height={4} rx={2}   fill="rgba(255,255,255,0.28)" />

        {/* Campaign count badge */}
        <rect x={panelX + panelW - 26} y={panelY + 14} width={20} height={11} rx={5.5} fill="rgba(255,255,255,0.22)" />
        <rect x={panelX + panelW - 23} y={panelY + 17} width={14} height={4}  rx={2}   fill="rgba(255,255,255,0.55)" />

        {/* Outreach rows */}
        {rows.map(({ status, w1, w2 }, i) => {
          const ry = panelY + 54 + i * 37;
          // Status pill width varies by label length
          const pillW = [28, 24, 32, 32][i];
          return (
            <g key={i}>
              {/* Send arrow chevron on left */}
              <path
                d={`M ${panelX + 8} ${ry + 2} L ${panelX + 12} ${ry + 5} L ${panelX + 8} ${ry + 8}`}
                fill="none"
                stroke={status}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Text lines */}
              <rect x={panelX + 18} y={ry}      width={w1 * 0.76} height={5} rx={2.5} fill="rgba(0,0,0,0.13)" />
              <rect x={panelX + 8}  y={ry + 11} width={w2 * 0.76} height={4} rx={2}   fill="rgba(0,0,0,0.07)" />

              {/* Status pill (right side) */}
              <rect
                x={panelX + panelW - pillW - 4} y={ry + 1}
                width={pillW} height={9} rx={4.5}
                fill={status} opacity={0.14}
              />
              <rect
                x={panelX + panelW - pillW - 1} y={ry + 3}
                width={pillW - 6} height={4} rx={2}
                fill={status} opacity={0.45}
              />

              {/* Divider */}
              {i < rows.length - 1 && (
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
export default function OutreachLanding() {
  const navigate = useNavigate();
  const [pitch, setPitch]           = useState("");
  const [selectedBeats, setSelectedBeats] = useState<string[]>(["tech", "business"]);

  const toggleBeat = (id: string) =>
    setSelectedBeats(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );

  const canContinue = pitch.trim().length > 0 || selectedBeats.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="outreach" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                AI-powered media outreach
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                  <OutreachVisual />
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
                The right pitch,<br />
                <span style={{ color: TEAL }}>to the right person.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Connect your searches and Mira identifies the best contacts for your story — then helps you reach them at exactly the right moment with personalised pitches and smart follow-ups.
              </p>

              {/* Pitch starter card */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  width: "min(580px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >

                {/* ── Section 1: Story input ── */}
                <div className="px-5 pt-5 pb-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    What's your story?
                  </p>
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ border: `1.5px solid ${pitch ? `${TEAL}50` : "rgba(0,0,0,0.10)"}` }}
                  >
                    <input
                      type="text"
                      placeholder='e.g. "New product launch targeting tech media" or "Executive thought leadership"'
                      value={pitch}
                      onChange={e => setPitch(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && pitch.trim()) navigate("/outreach-campaigns"); }}
                      className="flex-1 text-[13px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground/50"
                    />
                    <span className="text-[11px] text-muted-foreground/40 whitespace-nowrap flex-shrink-0">↵ to send</span>
                    <button
                      disabled={!pitch.trim()}
                      onClick={() => navigate("/outreach-campaigns")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                      style={{ backgroundColor: TEAL }}
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  {/* Quick prompt chips */}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className="text-[12px] text-muted-foreground font-medium">Try:</span>
                    {["product launch", "exec interview", "crisis response", "thought leadership"].map(chip => (
                      <button
                        key={chip}
                        onClick={() => setPitch(chip)}
                        className="text-[12px] text-muted-foreground hover:text-foreground px-3 py-1 rounded-full transition-all"
                        style={{ border: "1px solid rgba(0,0,0,0.10)" }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Section 2: Target media ── */}
                <div className="px-5 py-4 border-t border-border/60">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Target media
                    </p>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        {selectedBeats.length > 0
                          ? `${selectedBeats.length} beat${selectedBeats.length !== 1 ? "s" : ""} selected`
                          : "Select at least one"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BEATS.map(beat => {
                      const active = selectedBeats.includes(beat.id);
                      return (
                        <button
                          key={beat.id}
                          onClick={() => toggleBeat(beat.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                          style={{
                            border: `1.5px solid ${active ? beat.color + "50" : "rgba(0,0,0,0.10)"}`,
                            backgroundColor: active ? beat.color + "0f" : "transparent",
                            color: active ? beat.color : "var(--muted-foreground)",
                          }}
                        >
                          {active && (
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: beat.color }} />
                          )}
                          {beat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section 3: Recent pitches ── */}
                <div className="px-5 py-4 border-t border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Continue a recent pitch
                  </p>
                  <div className="flex flex-col gap-1">
                    {RECENT_PITCHES.map(p => (
                      <button
                        key={p.name}
                        onClick={() => navigate("/outreach-campaigns")}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors text-left group"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                        >
                          {p.sent === "Draft"
                            ? <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            : <Send className="w-3.5 h-3.5" style={{ color: TEAL }} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {p.sent === "Draft" ? "Draft" : `Sent to ${p.recipients} recipients · ${p.sent}`}
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "var(--muted-foreground)" }}
                        >
                          {p.category}
                        </span>
                        {p.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Footer CTA ── */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-t border-border gap-4"
                  style={{ backgroundColor: "#f7f8f9" }}
                >
                  <p className="text-xs text-muted-foreground">
                    Mira will find the best contacts for your story
                  </p>
                  <button
                    onClick={() => navigate("/outreach-campaigns")}
                    disabled={!canContinue}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Start my pitch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Across 1M+ media contacts · Personalised by Mira AI · Smart send-time optimisation
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
