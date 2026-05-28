import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  ArrowRight, FileText, TrendingUp, BarChart2,
  Users, ShieldAlert, Sparkles, Star, Clock,
} from "lucide-react";

const TEAL   = "#00827F";
const PURPLE = "#B627A1";
const AMBER  = "#f59e0b";
const BLUE   = "#4F6AF5";
const CORAL  = "#e86c5a";
const GRAY   = "#6b7280";

// ── Report types ──────────────────────────────────────────────────────────────
const REPORT_TYPES = [
  { id: "brand",       label: "Brand Coverage",        Icon: BarChart2,   color: TEAL,   bg: "rgba(0,130,127,0.10)"   },
  { id: "competitive", label: "Competitive Analysis",  Icon: TrendingUp,  color: BLUE,   bg: "rgba(79,106,245,0.10)"  },
  { id: "sov",         label: "Share of Voice",        Icon: FileText,    color: PURPLE, bg: "rgba(182,39,161,0.08)"  },
  { id: "executive",   label: "Executive Visibility",  Icon: Users,       color: AMBER,  bg: "rgba(245,158,11,0.10)"  },
  { id: "crisis",      label: "Crisis & Risk",         Icon: ShieldAlert, color: CORAL,  bg: "rgba(232,108,90,0.10)"  },
  { id: "custom",      label: "Custom Report",         Icon: Sparkles,    color: GRAY,   bg: "rgba(107,114,128,0.10)" },
];

// ── Recent reports ────────────────────────────────────────────────────────────
const RECENT_REPORTS = [
  { name: "Executive Visibility Report",   type: "executive",   updated: "Today",    starred: true  },
  { name: "Quarterly Brand Performance",   type: "brand",       updated: "Oct 12",   starred: true  },
  { name: "Competitive Landscape Q3",      type: "competitive", updated: "Oct 5",    starred: false },
  { name: "Brand Risk Assessment",         type: "crisis",      updated: "Sep 28",   starred: false },
];

// ── Reports illustration — stacked document cards ─────────────────────────────
function ReportsVisual() {
  // Three stacked report-style cards, fanned slightly
  const cW = 150, cH = 190;
  const cx  = 160, cy = 118; // center of the stack

  // Back-left card (purple, rotated -10°)
  // Back-right card (amber, rotated +9°)
  // Front card (teal, straight)

  // Mini bar data for front card chart
  const bars = [44, 68, 52, 88, 60, 76, 56];
  const chartX = cx - cW / 2 + 14;
  const chartY = cy - cH / 2 + 70;
  const chartH = 72;
  const bW = (cW - 32) / bars.length - 3;

  // Trend line points
  const trendPts = bars.map((h, i) => {
    const x = chartX + i * (bW + 3) + bW / 2;
    const y = chartY + chartH - (h / 100) * chartH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="330" height="248" viewBox="0 0 330 248" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id="rp-back" x="-25%" y="-20%" width="150%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.10)" />
        </filter>
        <filter id="rp-front" x="-25%" y="-20%" width="150%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(0,130,127,0.20)" />
        </filter>
      </defs>

      {/* ── Back-left card (purple) — rotated -10° ── */}
      <g filter="url(#rp-back)" transform={`rotate(-10, ${cx}, ${cy})`}>
        <rect x={cx - cW / 2 - 18} y={cy - cH / 2} width={cW} height={cH} rx={10} fill="white" />
        {/* Header stripe */}
        <rect x={cx - cW / 2 - 18} y={cy - cH / 2} width={cW} height={34} rx={10} fill={PURPLE} />
        <rect x={cx - cW / 2 - 18} y={cy - cH / 2 + 18} width={cW} height={16} fill={PURPLE} />
        {/* Title lines */}
        <rect x={cx - cW / 2 - 18 + 12} y={cy - cH / 2 + 11} width={52} height={5} rx={2.5} fill="rgba(255,255,255,0.50)" />
        <rect x={cx - cW / 2 - 18 + 12} y={cy - cH / 2 + 21} width={36} height={4} rx={2}   fill="rgba(255,255,255,0.30)" />
        {/* Donut chart placeholder */}
        <circle cx={cx - cW / 2 - 18 + 46} cy={cy - cH / 2 + 80} r={28} fill="none" stroke={PURPLE} strokeWidth={14} opacity={0.12} />
        <circle cx={cx - cW / 2 - 18 + 46} cy={cy - cH / 2 + 80} r={28} fill="none" stroke={PURPLE} strokeWidth={14}
          strokeDasharray={`${0.65 * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
          strokeDashoffset={`${0.25 * 2 * Math.PI * 28}`} opacity={0.65}
          strokeLinecap="round" />
        <circle cx={cx - cW / 2 - 18 + 46} cy={cy - cH / 2 + 80} r={28} fill="none" stroke={AMBER} strokeWidth={14}
          strokeDasharray={`${0.22 * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
          strokeDashoffset={`${-0.4 * 2 * Math.PI * 28}`} opacity={0.55}
          strokeLinecap="round" />
        {/* Content lines */}
        {[0,1,2,3].map(i => (
          <rect key={i} x={cx - cW / 2 - 18 + 86} y={cy - cH / 2 + 60 + i * 14}
            width={[42, 34, 38, 28][i]} height={5} rx={2.5} fill="rgba(0,0,0,0.10)" />
        ))}
        {[0,1,2].map(i => (
          <rect key={i} x={cx - cW / 2 - 18 + 12} y={cy - cH / 2 + 128 + i * 14}
            width={[110, 88, 98][i]} height={4} rx={2} fill="rgba(0,0,0,0.07)" />
        ))}
      </g>

      {/* ── Back-right card (amber) — rotated +9° ── */}
      <g filter="url(#rp-back)" transform={`rotate(9, ${cx}, ${cy})`}>
        <rect x={cx - cW / 2 + 20} y={cy - cH / 2} width={cW} height={cH} rx={10} fill="white" />
        <rect x={cx - cW / 2 + 20} y={cy - cH / 2} width={cW} height={34} rx={10} fill={AMBER} />
        <rect x={cx - cW / 2 + 20} y={cy - cH / 2 + 18} width={cW} height={16} fill={AMBER} />
        <rect x={cx - cW / 2 + 20 + 12} y={cy - cH / 2 + 11} width={52} height={5} rx={2.5} fill="rgba(255,255,255,0.55)" />
        <rect x={cx - cW / 2 + 20 + 12} y={cy - cH / 2 + 21} width={36} height={4} rx={2}   fill="rgba(255,255,255,0.32)" />
        {/* Simple horizontal bar chart */}
        {[70, 50, 82, 44, 62].map((w, i) => (
          <g key={i}>
            <rect x={cx - cW / 2 + 20 + 12} y={cy - cH / 2 + 50 + i * 18}
              width={(cW - 28) * 0.85} height={6} rx={3} fill="rgba(0,0,0,0.06)" />
            <rect x={cx - cW / 2 + 20 + 12} y={cy - cH / 2 + 50 + i * 18}
              width={(cW - 28) * 0.85 * (w / 100)} height={6} rx={3} fill={AMBER} opacity={0.55} />
          </g>
        ))}
        {[0,1,2].map(i => (
          <rect key={i} x={cx - cW / 2 + 20 + 12} y={cy - cH / 2 + 148 + i * 13}
            width={[100, 82, 92][i]} height={4} rx={2} fill="rgba(0,0,0,0.07)" />
        ))}
      </g>

      {/* ── Front card (teal) — straight, on top ── */}
      <g filter="url(#rp-front)">
        <rect x={cx - cW / 2} y={cy - cH / 2} width={cW} height={cH} rx={11} fill="white" />
        {/* Header */}
        <rect x={cx - cW / 2}      y={cy - cH / 2}      width={cW} height={36} rx={11} fill={TEAL} />
        <rect x={cx - cW / 2}      y={cy - cH / 2 + 20} width={cW} height={16} fill={TEAL} />
        <rect x={cx - cW / 2 + 10} y={cy - cH / 2 + 12} width={52} height={5}  rx={2.5} fill="rgba(255,255,255,0.50)" />
        <rect x={cx - cW / 2 + 10} y={cy - cH / 2 + 22} width={36} height={4}  rx={2}   fill="rgba(255,255,255,0.30)" />
        {/* "Scheduled" badge */}
        <rect x={cx + cW / 2 - 42} y={cy - cH / 2 + 13} width={34} height={11} rx={5.5} fill="rgba(255,255,255,0.22)" />
        <rect x={cx + cW / 2 - 40} y={cy - cH / 2 + 16} width={30} height={4}  rx={2}   fill="rgba(255,255,255,0.55)" />

        {/* Bar chart */}
        {bars.map((h, i) => (
          <rect key={i}
            x={chartX + i * (bW + 3)} y={chartY + chartH - (h / 100) * chartH}
            width={bW} height={(h / 100) * chartH} rx={2.5}
            fill={TEAL} opacity={i === 3 ? 0.80 : 0.30 + i * 0.07}
          />
        ))}
        {/* Trend line overlay */}
        <polyline points={trendPts} fill="none" stroke={AMBER} strokeWidth={1.5}
          strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
        {bars.map((h, i) => (
          <circle key={i}
            cx={chartX + i * (bW + 3) + bW / 2}
            cy={chartY + chartH - (h / 100) * chartH}
            r={i === 3 ? 2.5 : 1.8}
            fill={AMBER} opacity={0.85}
          />
        ))}

        {/* Legend */}
        <rect x={cx - cW / 2 + 10} y={chartY + chartH + 6} width={8} height={4} rx={2} fill={TEAL} opacity={0.60} />
        <rect x={cx - cW / 2 + 21} y={chartY + chartH + 6} width={28} height={4} rx={2} fill="rgba(0,0,0,0.12)" />
        <rect x={cx - cW / 2 + 58} y={chartY + chartH + 6} width={8} height={4} rx={2} fill={AMBER} opacity={0.80} />
        <rect x={cx - cW / 2 + 69} y={chartY + chartH + 6} width={24} height={4} rx={2} fill="rgba(0,0,0,0.12)" />

        {/* Bottom text lines */}
        {[0,1].map(i => (
          <rect key={i}
            x={cx - cW / 2 + 10} y={chartY + chartH + 20 + i * 13}
            width={[122, 96][i]} height={4} rx={2} fill="rgba(0,0,0,0.08)" />
        ))}
      </g>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportsLanding() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [reportName, setReportName]     = useState("");

  const canCreate = !!selectedType;

  const getTypeConfig = (id: string) => REPORT_TYPES.find(r => r.id === id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1" style={{ paddingTop: 64 }}>
        <Sidebar activePage="reports" />
        <main className="ml-52 flex-1 overflow-auto bg-white">
          <div className="px-8 pt-8 pb-10">

            <div
              className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center"
              style={{ backgroundColor: "#F2F5F5" }}
            >
              {/* Eyebrow */}
              <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
                All your reports, one place
              </p>

              {/* Illustration */}
              <div style={{
                position: "relative", height: 140, overflow: "hidden",
                display: "flex", justifyContent: "center", alignItems: "flex-start",
                width: "100%", marginBottom: -28, marginTop: -6,
              }}>
                <div style={{ transform: "scale(0.60)", transformOrigin: "top center", flexShrink: 0 }}>
                  <ReportsVisual />
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
                Every report,<br />
                <span style={{ color: TEAL }}>always ready.</span>
              </h1>

              {/* Body */}
              <p
                className="text-[15px] leading-relaxed mb-8 text-center"
                style={{ color: "#6b7280", maxWidth: 540 }}
              >
                Build, schedule, and share reports across brand, competitive, and executive coverage — all in one place, powered by Mira AI and delivered to the right people at the right time.
              </p>

              {/* Report creator card */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  width: "min(580px, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >

                {/* ── Section 1: Report type ── */}
                <div className="px-5 pt-5 pb-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    What type of report?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {REPORT_TYPES.map(({ id, label, Icon, color, bg }) => {
                      const active = selectedType === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedType(active ? null : id)}
                          className="flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-all"
                          style={{
                            border: `1.5px solid ${active ? color + "50" : "rgba(0,0,0,0.08)"}`,
                            backgroundColor: active ? color + "0c" : "rgba(0,0,0,0.01)",
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: active ? bg : "rgba(0,0,0,0.05)" }}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: active ? color : GRAY }} />
                          </div>
                          <span
                            className="text-[12px] font-medium leading-tight"
                            style={{ color: active ? color : "var(--foreground)" }}
                          >
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section 2: Report name ── */}
                <div className="px-5 py-4 border-t border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Report name <span className="normal-case font-normal text-muted-foreground/60">(optional)</span>
                  </p>
                  <input
                    type="text"
                    placeholder={
                      selectedType
                        ? `e.g. "${getTypeConfig(selectedType)?.label} — Q4 2024"`
                        : "Name your report…"
                    }
                    value={reportName}
                    onChange={e => setReportName(e.target.value)}
                    className="w-full px-4 py-2.5 text-[13px] rounded-xl outline-none transition-all"
                    style={{
                      border: `1.5px solid ${reportName ? `${TEAL}50` : "rgba(0,0,0,0.10)"}`,
                      backgroundColor: "rgba(0,0,0,0.015)",
                    }}
                  />
                </div>

                {/* ── Section 3: Recent reports ── */}
                <div className="px-5 py-4 border-t border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Recent reports
                  </p>
                  <div className="flex flex-col gap-1">
                    {RECENT_REPORTS.map(r => {
                      const cfg = getTypeConfig(r.type);
                      return (
                        <button
                          key={r.name}
                          onClick={() => navigate("/reports-library")}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors text-left group"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: cfg ? cfg.bg : "rgba(0,0,0,0.05)" }}
                          >
                            {cfg && <cfg.Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-foreground truncate">{r.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <p className="text-[11px] text-muted-foreground">{r.updated}</p>
                            </div>
                          </div>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cfg ? cfg.bg : "rgba(0,0,0,0.05)", color: cfg ? cfg.color : GRAY }}
                          >
                            {cfg?.label}
                          </span>
                          {r.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Footer ── */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-t border-border gap-4"
                  style={{ backgroundColor: "#f7f8f9" }}
                >
                  <p className="text-xs text-muted-foreground">
                    {canCreate
                      ? `Creating a ${getTypeConfig(selectedType!)?.label}`
                      : "Select a report type to get started"}
                  </p>
                  <button
                    onClick={() => navigate("/reports-library")}
                    disabled={!canCreate}
                    className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                    style={{ backgroundColor: "#111111" }}
                  >
                    Build my report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Scheduled delivery · PDF & web formats · Shared with your team · Powered by Mira AI
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
