import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  Sparkles, ArrowRight, Check, CheckCircle, Search, Rss,
  BarChart2, Eye, Users, Clock, Edit3, AlignJustify, Inbox,
  Send, ChevronRight, MoreVertical, Plus, AlertTriangle,
  CalendarDays, List, UserRound, ExternalLink, ChevronDown,
  ChevronUp, ChevronsUpDown,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────
const TEAL = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";
const PURPLE = "#B627A1";

const CURATION_SKILLS = {
  "coverage-roundup": {
    id: "coverage-roundup", label: "Coverage Roundup", color: TEAL, bg: TEAL_LIGHT,
    Icon: AlignJustify,
    description: "Aggregates the top articles across all sources, organised by topic and coverage volume.",
  },
  "executive-briefing": {
    id: "executive-briefing", label: "Executive Briefing", color: PURPLE, bg: "rgba(182,39,161,0.08)",
    Icon: Sparkles,
    description: "Distils key insights and strategic signals into a concise, executive-ready summary.",
  },
  "analytics-snapshot": {
    id: "analytics-snapshot", label: "Analytics Snapshot", color: "#e86c5a", bg: "rgba(232,108,90,0.10)",
    Icon: BarChart2,
    description: "Surfaces share of voice, sentiment trends, and top metrics for the period.",
  },
};

const SEARCH_TYPE_CFG: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  explore: { Icon: Search,  color: "#4F6AF5", bg: "rgba(79,106,245,0.10)" },
  rss:     { Icon: Rss,     color: "#e86c5a", bg: "rgba(232,108,90,0.10)" },
};

const AVAILABLE_SEARCHES = [
  { name: "Brand Monitoring",   type: "explore" },
  { name: "Competitor Watch",   type: "explore" },
  { name: "Industry News",      type: "rss" },
  { name: "Executive Coverage", type: "explore" },
  { name: "Product Mentions",   type: "explore" },
  { name: "Market Trends",      type: "rss" },
];

const GEN_STEPS_BASE = [
  { pct: 0,  msg: "Setting up your newsletter series…" },
  { pct: 18, msg: "Connecting to Brand Monitoring search…" },
  { pct: 42, msg: "Mira is scanning and ranking articles…" },
  { pct: 67, msg: "Curating your first edition…" },
  { pct: 88, msg: "Applying your style and preferences…" },
];

const GEN_STEPS_WITH_REF = [
  { pct: 0,  msg: "Setting up your newsletter series…" },
  { pct: 15, msg: "Connecting to Brand Monitoring search…" },
  { pct: 32, msg: "Analysing your reference edition for style and structure…" },
  { pct: 56, msg: "Mira is applying your editorial voice to article selection…" },
  { pct: 78, msg: "Curating your first edition in your style…" },
  { pct: 92, msg: "Final formatting and quality checks…" },
];

const MOCK_ANALYSIS: Record<string, any> = {
  "coverage-roundup": {
    sections: ["Corporate News", "Competitor Coverage", "Industry Must-Reads"],
    sources: ["Yahoo Finance", "CNBC", "Bloomberg", "Fast Company"], sourcesExtra: 4,
    cadence: "Weekly (Mondays)", format: "Broad coverage · ~12 articles · 1–2 sentence summaries",
    audience: "Internal comms & leadership team",
  },
  "executive-briefing": {
    sections: ["Key Highlights", "Strategic Context", "What to Watch"],
    sources: ["Reuters", "Financial Times", "Bloomberg", "Axios"], sourcesExtra: 2,
    cadence: "Weekly (Fridays)", format: "Executive-facing · ~8 articles · 2–3 sentence summaries",
    audience: "Leadership & C-Suite",
  },
  "analytics-snapshot": {
    sections: ["Share of Voice", "Sentiment Breakdown", "Top Stories by Reach"],
    sources: ["Meltwater", "Brandwatch", "Google Analytics"], sourcesExtra: 2,
    cadence: "Monthly", format: "Data-focused · ~6 metric sections · Charts + narrative",
    audience: "Brand & comms team",
  },
};

const SKILL_EXAMPLE_COPY: Record<string, any> = {
  "coverage-roundup": {
    headline: "Share a roundup Mira can learn from",
    subhead: "Upload or paste a previous edition and Mira will study how you select stories, structure coverage, and balance topics.",
    learnPoints: ["Story selection and prioritisation", "Section structure and cadence", "Tone and editorial voice"],
    uploadLabel: "Drop a previous roundup edition here",
    pasteLabel: "Or paste a past edition below",
    pastePlaceholder: "Paste the full content of a previous roundup…",
  },
  "executive-briefing": {
    headline: "Show Mira how you brief the room",
    subhead: "Upload or paste a past executive briefing and Mira will learn how you distil complex news into clear, decisive intelligence.",
    learnPoints: ["How you frame and synthesise news", "Level of depth vs. brevity", "The language your executives expect"],
    uploadLabel: "Drop a previous executive briefing here",
    pasteLabel: "Or paste a past briefing below",
    pastePlaceholder: "Paste a previous executive briefing…",
  },
  "analytics-snapshot": {
    headline: "Teach Mira your metrics narrative",
    subhead: "Upload or paste a past report and Mira will learn which numbers you lead with and what story matters most.",
    learnPoints: ["Which metrics you prioritise", "How you contextualise and benchmark", "The narrative arc your audience expects"],
    uploadLabel: "Drop a previous analytics report here",
    pasteLabel: "Or paste a past report below",
    pastePlaceholder: "Paste a previous analytics or performance report…",
  },
};

// ── Onboarding Visual ──────────────────────────────────────────────────────────
function OnboardingVisual() {
  const articles = [
    { title: "Meltwater expands AI capabilities with new acquisition", source: "TechCrunch", age: "2h ago" },
    { title: "Media intelligence: what leading brands do differently", source: "Forbes", age: "5h ago" },
    { title: "Q1 earnings: media software sector up 14%", source: "Reuters", age: "8h ago" },
  ];
  return (
    <div className="flex gap-4 items-center">
      {/* Source cards */}
      <div className="flex flex-col gap-2.5 flex-1">
        {articles.map((a, i) => (
          <div key={i} className="p-3 bg-white rounded-lg border border-black/[0.09] shadow-sm">
            <p className="text-[10.5px] font-semibold leading-snug mb-1 text-foreground">{a.title}</p>
            <div className="flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: TEAL }} />
              <span className="text-[10px] font-semibold" style={{ color: TEAL }}>{a.source}</span>
              <span className="text-[10px] text-muted-foreground">{a.age}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow + sparkle */}
      <div className="flex flex-col items-center gap-1.5 px-0.5">
        <Sparkles className="w-5 h-5" style={{ color: TEAL }} />
        <ArrowRight className="w-4 h-4 opacity-35" style={{ color: TEAL }} />
      </div>

      {/* Newsletter preview */}
      <div className="w-32 flex-shrink-0 bg-white rounded-xl overflow-hidden border" style={{ borderColor: `${TEAL}50`, boxShadow: `0 12px 32px rgba(0,130,127,0.14)` }}>
        <div className="px-3 py-2.5 flex items-center gap-1.5" style={{ backgroundColor: TEAL }}>
          <div className="w-2.5 h-2.5 rounded-sm bg-white/75 flex-shrink-0" />
          <div className="h-1 w-10 rounded-full bg-white/50" />
        </div>
        <div className="p-2.5 flex flex-col gap-1.5">
          <div className="h-1.5 w-[92%] rounded-full bg-black/[0.18]" />
          <div className="h-1 w-[68%] rounded-full bg-black/[0.09]" />
          <div className="h-px w-full bg-black/[0.07] my-0.5" />
          {[78, 58, 88, 50, 72].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, backgroundColor: i % 3 === 0 ? `${TEAL}40` : "rgba(0,0,0,0.07)" }} />
          ))}
        </div>
        <div className="h-4 bg-black/[0.03] border-t border-black/[0.06]" />
      </div>
    </div>
  );
}

// ── Newsletter Stack Visual ────────────────────────────────────────────────────
function NewsletterStackVisual() {
  const V_PURPLE = "#B627A1";
  const V_AMBER  = "#f59e0b";
  const G8  = "rgba(0,0,0,0.08)";
  const G13 = "rgba(0,0,0,0.13)";

  const cardW = 170;
  const cardH = 214;

  const MiniCard = ({
    color, top, left, rotate, zIndex, featured,
  }: { color: string; top: number; left: number; rotate: number; zIndex: number; featured?: boolean }) => (
    <div style={{
      position: "absolute", top, left, width: cardW, height: cardH,
      borderRadius: 14, backgroundColor: "white",
      boxShadow: featured ? "0 14px 40px rgba(0,0,0,0.16)" : "0 4px 14px rgba(0,0,0,0.10)",
      overflow: "hidden",
      transform: `rotate(${rotate}deg)`,
      transformOrigin: "center center",
      zIndex,
    }}>
      <div style={{ height: 42, backgroundColor: color, display: "flex", alignItems: "center", padding: "0 12px", gap: 7 }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
        <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.35)" }} />
        {featured && <Sparkles style={{ width: 12, height: 12, color: "rgba(255,255,255,0.75)", flexShrink: 0 }} />}
      </div>
      <div style={{ padding: "11px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
        {featured ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ height: 7, borderRadius: 3, backgroundColor: G13, width: "90%" }} />
              <div style={{ height: 7, borderRadius: 3, backgroundColor: G13, width: "66%" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
              <div style={{ height: 5, width: 50, borderRadius: 3, backgroundColor: `${color}45` }} />
              <div style={{ height: 5, width: 28, borderRadius: 3, backgroundColor: G8, marginLeft: 4 }} />
            </div>
            <div style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)", margin: "1px 0" }} />
            {[82, 60, 74, 55, 70].map((w, i) => (
              <div key={i} style={{ height: 5, borderRadius: 3, width: `${w}%`, backgroundColor: i === 0 ? `${color}28` : G8 }} />
            ))}
            <div style={{ marginTop: 4, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, backgroundColor: `${color}14` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color }} />
              <div style={{ height: 5, width: 52, borderRadius: 3, backgroundColor: `${color}40` }} />
            </div>
          </>
        ) : (
          [86, 63, 76, 50, 68, 58, 78, 46].map((w, i) => (
            <div key={i} style={{ height: 5, borderRadius: 3, backgroundColor: G8, width: `${w}%` }} />
          ))
        )}
      </div>
    </div>
  );

  // Container sized so all three rotated cards fit without clipping
  return (
    <div style={{ position: "relative", width: 270, height: 290, flexShrink: 0 }}>
      {/* Back-left — purple, rotated CCW */}
      <MiniCard color={V_PURPLE} top={42} left={0}  rotate={-9} zIndex={1} />
      {/* Back-right — amber, rotated CW */}
      <MiniCard color={V_AMBER}  top={28} left={74} rotate={7}  zIndex={2} />
      {/* Front — teal, straight */}
      <MiniCard color={TEAL}     top={24} left={34} rotate={0}  zIndex={3} featured />
    </div>
  );
}

// ── Newsletter Onboarding ──────────────────────────────────────────────────────
function NewsletterOnboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const [phase, setPhase]       = useState<"landing" | "wizard" | "generating">("landing");
  const [step, setStep]         = useState(0);
  const [skill, setSkill]       = useState<string | null>(null);
  const [logoUrl, setLogoUrl]   = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [refFileName, setRefFileName] = useState("");
  const [refPaste, setRefPaste]       = useState("");
  const [analysisState, setAnalysisState] = useState<null | "loading" | "shown" | "confirmed">(null);
  const [recipients, setRecipients] = useState("");
  const [selectedSearches, setSelectedSearches] = useState<string[]>(AVAILABLE_SEARCHES.slice(0, 3).map(s => s.name));
  const [searchQuery, setSearchQuery] = useState("");
  const [cadence, setCadence]   = useState("Weekly");
  const [sendDay, setSendDay]   = useState("Friday");
  const [sendTime, setSendTime] = useState("8:00 AM");
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage]   = useState(GEN_STEPS_BASE[0].msg);
  const [genDone, setGenDone]   = useState(false);

  const logoInputRef    = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  const STEP_LABELS = ["Share an example", "Choose a skill", "Upload your logo", "Add recipients", "Set a schedule"];
  const hasRefContent = !!(refFileName || refPaste.trim());

  useEffect(() => {
    if (phase !== "generating") return;
    const GEN_STEPS = hasRefContent ? GEN_STEPS_WITH_REF : GEN_STEPS_BASE;
    setGenProgress(GEN_STEPS[0].pct);
    setGenMessage(GEN_STEPS[0].msg);
    setGenDone(false);
    let i = 1;
    const tick = setInterval(() => {
      if (i < GEN_STEPS.length) {
        setGenProgress(GEN_STEPS[i].pct);
        setGenMessage(GEN_STEPS[i].msg);
        i++;
      } else {
        clearInterval(tick);
        setGenProgress(100);
        setGenMessage("Your first edition is ready!");
        setGenDone(true);
        setTimeout(() => onComplete({ skill, logoUrl, recipients, cadence, sendDay, sendTime, selectedSearches }), 1400);
      }
    }, 920);
    return () => clearInterval(tick);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const recipientCount = recipients.split(/[\n,]/).map(s => s.trim()).filter(s => s.includes("@")).length;

  // ── Generating ──────────────────────────────────────────────────────────────
  if (phase === "generating") {
    const activeSkill = skill ? CURATION_SKILLS[skill as keyof typeof CURATION_SKILLS] : null;
    return (
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#fafffe" }}>
        <div className="max-w-[460px] w-full text-center">
          <div className="w-18 h-18 rounded-2xl mx-auto mb-8 flex items-center justify-center"
            style={{ backgroundColor: activeSkill ? activeSkill.bg : TEAL_LIGHT, border: `2px solid ${activeSkill ? activeSkill.color : TEAL}25`, width: 72, height: 72 }}>
            {genDone
              ? <CheckCircle className="w-8 h-8 text-green-500" />
              : <Sparkles className="w-8 h-8 animate-pulse" style={{ color: activeSkill ? activeSkill.color : TEAL }} />
            }
          </div>
          <h2 className="text-[22px] font-extrabold tracking-tight mb-2">
            {genDone ? "Your newsletter is ready!" : "Generating your newsletter…"}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 min-h-6">
            {genDone ? "Head to the editor to review and customise before sending." : genMessage}
          </p>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-black/[0.07] overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${genProgress}%`, backgroundColor: genDone ? "#22c55e" : (activeSkill ? activeSkill.color : TEAL) }} />
          </div>
          <div className="flex justify-between">
            <span className="text-[11px] text-muted-foreground">
              Skill: <strong>{activeSkill?.label}</strong> · Sources: <strong>{selectedSearches.length} searches</strong>
            </span>
            <span className="text-[11px] font-bold" style={{ color: genDone ? "#22c55e" : (activeSkill ? activeSkill.color : TEAL) }}>
              {genProgress}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Landing ─────────────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="flex-1 overflow-auto bg-white">
        <div className="px-8 pt-8 pb-10">

          {/* Rounded grey pane — centered column */}
          <div className="rounded-[28px] px-12 pt-8 pb-10 flex flex-col items-center" style={{ backgroundColor: "#F2F5F5" }}>

            {/* Eyebrow — sits above the illustration */}
            <p className="text-[13px] font-bold text-foreground mb-3 tracking-wide text-center">
              AI-powered newsletters
            </p>

            {/* Illustration — clipped at bottom, inner shadow fades it out */}
            <div style={{ position: "relative", height: 118, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", marginBottom: 2, marginTop: -6 }}>
              <div style={{ transform: "scale(0.66)", transformOrigin: "top center", flexShrink: 0 }}>
                <NewsletterStackVisual />
              </div>
              {/* Soft fade at the base */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 36, pointerEvents: "none",
                background: "linear-gradient(to bottom, transparent, #F2F5F5)",
              }} />
            </div>

            {/* Headline */}
            <h1 className="font-nunito font-black leading-[1.05] tracking-tight text-foreground mb-3 text-center"
              style={{ fontSize: "clamp(38px, 5vw, 56px)" }}>
              Newsletters that think<br />
              <span style={{ color: TEAL }}>for themselves.</span>
            </h1>

            {/* Body */}
            <p className="text-[15px] leading-relaxed mb-8 text-center" style={{ color: "#6b7280", maxWidth: 540 }}>
              Connect your saved searches. Mira monitors the news, curates the most relevant stories, and assembles a polished edition — automatically, every time.
            </p>

            {/* Search selector card — narrower, centred */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ width: "min(560px, 100%)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="px-4 pt-4 pb-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select searches to power your newsletter</p>

                {/* Search / filter input */}
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
                  {AVAILABLE_SEARCHES.filter(s =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 3).map(s => {
                    const cfg = SEARCH_TYPE_CFG[s.type] || SEARCH_TYPE_CFG.explore;
                    const isSelected = selectedSearches.includes(s.name);
                    return (
                      <div key={s.name}
                        onClick={() => setSelectedSearches(prev =>
                          prev.includes(s.name) ? prev.filter(n => n !== s.name) : [...prev, s.name]
                        )}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all"
                        style={{
                          border: `1.5px solid ${isSelected ? `${TEAL}40` : "rgba(0,0,0,0.07)"}`,
                          backgroundColor: isSelected ? `${TEAL}07` : "transparent",
                        }}>
                        <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
                          style={{ border: `2px solid ${isSelected ? TEAL : "rgba(0,0,0,0.2)"}`, backgroundColor: isSelected ? TEAL : "transparent" }}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <cfg.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                        <span className="text-[13px] font-medium flex-1"
                          style={{ color: isSelected ? "var(--foreground)" : "var(--muted-foreground)" }}>
                          {s.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {s.type}
                        </span>
                      </div>
                    );
                  })}
                  {AVAILABLE_SEARCHES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-[13px] text-muted-foreground text-center py-3">No searches match "{searchQuery}"</p>
                  )}
                  {!searchQuery && AVAILABLE_SEARCHES.length > 3 && (
                    <p className="text-[11px] text-muted-foreground text-center pt-1 pb-0.5">
                      +{AVAILABLE_SEARCHES.length - 3} more · type to search
                    </p>
                  )}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border gap-4" style={{ backgroundColor: "#f7f8f9" }}>
                {selectedSearches.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
                    <span className="text-xs font-semibold" style={{ color: TEAL }}>
                      {selectedSearches.length} search{selectedSearches.length !== 1 ? "es" : ""} selected
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground flex-shrink-0">Select at least one to continue</p>
                )}
                <button
                  onClick={() => setPhase("wizard")}
                  disabled={selectedSearches.length === 0}
                  className="flex items-center gap-2 text-white font-bold text-[13px] rounded-full px-5 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex-shrink-0"
                  style={{ backgroundColor: "#111111" }}>
                  Generate my first newsletter
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3">Ready in about 30 seconds · Nothing is sent without your review</p>

          </div>{/* /grey pane */}
        </div>
      </div>
    );
  }

  // ── Wizard ───────────────────────────────────────────────────────────────────
  const activeSkill = skill ? CURATION_SKILLS[skill as keyof typeof CURATION_SKILLS] : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#fafffe" }}>
      {/* Header */}
      <div className="px-8 pt-5 pb-5 border-b border-border bg-white flex-shrink-0">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-extrabold font-nunito text-xl tracking-tight mb-0.5">Set up your newsletter</h2>
            <p className="text-[13px] text-muted-foreground">Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}</p>
          </div>
          <button onClick={() => setPhase("landing")} className="text-[13px] text-muted-foreground hover:text-foreground mt-1">← Back</button>
        </div>
        {/* Step indicators */}
        <div className="flex items-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                    style={{ backgroundColor: done || active ? TEAL : "rgba(0,0,0,0.08)", border: `2px solid ${done || active ? TEAL : "rgba(0,0,0,0.12)"}` }}>
                    {done ? <Check className="w-2.5 h-2.5 text-white" />
                      : <span className="text-[10px] font-bold leading-none" style={{ color: active ? "#fff" : "rgba(0,0,0,0.4)" }}>{i + 1}</span>}
                  </div>
                  <span className="text-xs whitespace-nowrap" style={{ fontWeight: active ? 700 : 500, color: active || done ? TEAL : "rgba(0,0,0,0.4)" }}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className="w-9 h-0.5 mx-3 transition-colors" style={{ backgroundColor: i < step ? TEAL : "rgba(0,0,0,0.1)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto py-8 px-8">

        {/* Step 0: Share an example */}
        {step === 0 && (() => {
          const ex = SKILL_EXAMPLE_COPY[skill || "executive-briefing"] || SKILL_EXAMPLE_COPY["executive-briefing"];
          const SkillIcon = activeSkill?.Icon || Sparkles;
          const ac = activeSkill ? activeSkill.color : TEAL;
          const ab = activeSkill ? activeSkill.bg : TEAL_LIGHT;
          return (
            <div className="max-w-[580px] mx-auto">
              <input ref={refFileInputRef} type="file" accept=".pdf,.html,.htm,.docx,.doc,.txt" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) { setRefFileName(f.name); setRefPaste(""); setAnalysisState(null); } }} />

              {/* Skill header */}
              <div className="flex items-start gap-4 mb-7 p-5 rounded-xl" style={{ backgroundColor: ab, border: `1.5px solid ${ac}25` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ac}20` }}>
                  <SkillIcon className="w-5 h-5" style={{ color: ac }} />
                </div>
                <div>
                  <p className="font-bold text-[16px] mb-1" style={{ color: ac }}>{ex.headline}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{ex.subhead}</p>
                </div>
              </div>

              {/* Learn points */}
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mira will analyse</span>
              </div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {ex.learnPoints.map((pt: string) => (
                  <div key={pt} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 border border-black/[0.07] bg-black/[0.04]">
                    <Check className="w-2.5 h-2.5" style={{ color: TEAL }} />
                    <span className="text-[11px] text-muted-foreground font-medium">{pt}</span>
                  </div>
                ))}
              </div>

              {/* File upload */}
              {refFileName ? (
                <div className="flex items-center gap-3 p-4 mb-4 rounded-xl" style={{ backgroundColor: ab, border: `1.5px solid ${ac}30` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ac}18` }}>
                    <CheckCircle className="w-4 h-4" style={{ color: ac }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px] truncate">{refFileName}</p>
                    <p className="text-[11px] text-muted-foreground">Ready for Mira to learn from</p>
                  </div>
                  <button onClick={() => setRefFileName("")} className="text-[11px] text-muted-foreground hover:text-foreground flex-shrink-0">Remove</button>
                </div>
              ) : (
                <div onClick={() => refFileInputRef.current?.click()}
                  className="border-2 border-dashed border-black/15 rounded-xl p-6 text-center cursor-pointer mb-4 transition-all hover:border-teal-600 hover:bg-teal-50">
                  <p className="font-semibold text-[13.5px] mb-1">{ex.uploadLabel}</p>
                  <p className="text-xs text-muted-foreground">PDF, HTML, DOCX or TXT</p>
                </div>
              )}

              {/* OR divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-black/[0.08]" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-black/[0.08]" />
              </div>

              {/* Paste */}
              <p className="text-xs font-semibold text-muted-foreground mb-2">{ex.pasteLabel}</p>
              <textarea rows={5} placeholder={ex.pastePlaceholder} value={refPaste}
                disabled={!!refFileName || analysisState === "shown" || analysisState === "confirmed"}
                onChange={e => { setRefPaste(e.target.value); setAnalysisState(null); }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13px] resize-none mb-3 focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{ focusRingColor: TEAL } as any} />
              <p className="text-xs text-muted-foreground">Optional — you can skip this and Mira will still produce a great first edition.</p>

              {/* Analyse CTA */}
              {hasRefContent && !analysisState && (
                <div className="mt-4 p-5 rounded-xl flex items-center justify-between gap-4" style={{ backgroundColor: ab, border: `1.5px solid ${ac}25` }}>
                  <div>
                    <p className="font-semibold text-[13px] mb-0.5">{refFileName ? `"${refFileName}" ready to analyse` : `${refPaste.trim().split(/\s+/).length} words ready to analyse`}</p>
                    <p className="text-xs text-muted-foreground">Let Mira read your example before you continue</p>
                  </div>
                  <button onClick={() => { setAnalysisState("loading"); setTimeout(() => setAnalysisState("shown"), 1900); }}
                    className="flex items-center gap-1.5 text-white font-bold text-[13px] rounded-lg px-4 py-2 flex-shrink-0"
                    style={{ backgroundColor: ac }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Analyse with Mira
                  </button>
                </div>
              )}

              {/* Loading */}
              {analysisState === "loading" && (
                <div className="mt-4 p-6 bg-white rounded-xl border border-border text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-3 animate-pulse" style={{ color: ac }} />
                  <p className="font-semibold text-[14px] mb-1">Mira is reading your example…</p>
                  <p className="text-xs text-muted-foreground">Detecting structure, tone, sources and cadence</p>
                  <div className="mt-3 h-1 w-full rounded-full bg-black/[0.07] overflow-hidden">
                    <div className="h-full rounded-full animate-pulse" style={{ width: "60%", backgroundColor: ac }} />
                  </div>
                </div>
              )}

              {/* Analysis results */}
              {(analysisState === "shown" || analysisState === "confirmed") && (() => {
                const analysis = MOCK_ANALYSIS[skill || "executive-briefing"] || MOCK_ANALYSIS["executive-briefing"];
                const isConfirmed = analysisState === "confirmed";
                const rows = [
                  { label: "Sections detected", Icon: AlignJustify, content: (
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {analysis.sections.map((s: string) => (
                        <span key={s} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ border: `1.5px solid ${ac}35`, backgroundColor: ab, color: ac }}>{s}</span>
                      ))}
                    </div>
                  )},
                  { label: "Sources identified", Icon: Search, content: (
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {analysis.sources.map((s: string) => (
                        <span key={s} className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-black/10 bg-black/[0.03]">{s}</span>
                      ))}
                      {analysis.sourcesExtra > 0 && <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-black/10 bg-black/[0.03] text-muted-foreground">+{analysis.sourcesExtra} more</span>}
                    </div>
                  )},
                  { label: "Cadence", Icon: Clock, content: <p className="text-[14px] font-bold mt-0.5">{analysis.cadence}</p> },
                  { label: "Format & tone", Icon: Edit3, content: <p className="text-[14px] font-bold mt-0.5">{analysis.format}</p> },
                  { label: "Audience", Icon: Users, content: <p className="text-[14px] font-bold mt-0.5">{analysis.audience}</p> },
                ];
                return (
                  <div className="mt-4 rounded-xl overflow-hidden" style={{ border: `1.5px solid ${ac}30`, boxShadow: `0 4px 20px ${ac}15` }}>
                    <div className="px-5 py-3.5 flex items-center gap-2.5" style={{ backgroundColor: ab, borderBottom: `1px solid ${ac}20` }}>
                      {isConfirmed ? <CheckCircle className="w-4 h-4" style={{ color: ac }} /> : <Sparkles className="w-4 h-4" style={{ color: ac }} />}
                      <span className="font-bold text-[14px]" style={{ color: ac }}>
                        {isConfirmed ? "Mira is calibrated to your style" : "Detected from your example"}
                      </span>
                      {isConfirmed && <button onClick={() => setAnalysisState("shown")} className="ml-auto text-[11px] text-muted-foreground">Edit</button>}
                    </div>
                    <div className="bg-white">
                      {rows.map((row, i) => (
                        <div key={row.label} className="px-5 py-3.5 flex items-start gap-4" style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <div className="w-7 h-7 rounded-lg bg-black/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <row.Icon className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{row.label}</p>
                            {row.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!isConfirmed && (
                      <div className="px-5 py-4 border-t border-border bg-black/[0.015] flex gap-2.5">
                        <button onClick={() => setAnalysisState("confirmed")}
                          className="flex items-center gap-1.5 text-white font-bold text-[13px] rounded-lg px-5 py-2"
                          style={{ backgroundColor: ac }}>
                          <Check className="w-3 h-3" /> Yes, looks good
                        </button>
                        <button onClick={() => { setAnalysisState(null); setRefFileName(""); setRefPaste(""); }}
                          className="text-[13px] font-semibold text-muted-foreground border border-black/15 rounded-lg px-4 py-2 hover:border-black/25">
                          Edit a few things
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* Step 1: Choose skill */}
        {step === 1 && (
          <div className="max-w-[600px] mx-auto">
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
              Choose how Mira approaches curation for this newsletter. You can change it anytime.
            </p>
            <div className="flex flex-col gap-3">
              {Object.values(CURATION_SKILLS).map(s => {
                const active = skill === s.id;
                const SkillIcon = s.Icon;
                return (
                  <div key={s.id} onClick={() => setSkill(s.id)}
                    className="p-5 rounded-xl cursor-pointer transition-all flex items-start gap-4"
                    style={{
                      border: `2px solid ${active ? s.color : "rgba(0,0,0,0.1)"}`,
                      backgroundColor: active ? s.bg : "white",
                      boxShadow: active ? `0 0 0 3px ${s.color}12` : "0 1px 4px rgba(0,0,0,0.04)",
                    }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${s.color}18` }}>
                      <SkillIcon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-[15px]" style={{ color: active ? s.color : "inherit" }}>{s.label}</span>
                        {active && <CheckCircle className="w-4 h-4" style={{ color: s.color }} />}
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Logo */}
        {step === 2 && (
          <div className="max-w-[560px] mx-auto">
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) { setLogoUrl(URL.createObjectURL(f)); setLogoName(f.name); } }} />
            <p className="text-[13px] font-bold mb-1">Logo</p>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">Add your brand logo so every edition feels on-brand.</p>
            {logoUrl ? (
              <div className="p-4 rounded-xl flex items-center gap-4 mb-6" style={{ border: `2px solid ${TEAL}30`, backgroundColor: TEAL_LIGHT }}>
                <div className="w-20 h-12 rounded-lg bg-white border border-black/[0.09] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5"><CheckCircle className="w-3.5 h-3.5" style={{ color: TEAL }} /><p className="font-semibold text-[13px]">Logo uploaded</p></div>
                  <p className="text-xs text-muted-foreground truncate mb-1.5">{logoName}</p>
                  <div className="flex gap-4">
                    <button onClick={() => logoInputRef.current?.click()} className="text-xs font-medium" style={{ color: TEAL }}>Replace</button>
                    <button onClick={() => { setLogoUrl(null); setLogoName(""); }} className="text-xs text-muted-foreground">Remove</button>
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-black/15 rounded-xl p-8 text-center cursor-pointer mb-6 transition-all hover:border-teal-600 hover:bg-teal-50">
                <p className="font-semibold text-[13.5px] mb-1">Click to upload your logo</p>
                <p className="text-xs text-muted-foreground">PNG, SVG or JPG · Recommended 200 × 60 px</p>
              </div>
            )}
            <div className="border-t border-border mb-6" />
            <p className="text-xs font-bold mb-3">Brand assets</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 max-w-[400px]">
              Upload a brand guide, deck, or any creative assets. Mira will use them to inform the look and feel.
            </p>
            <div className="border-2 border-dashed border-black/15 rounded-xl p-7 text-center cursor-pointer transition-all hover:border-purple-500 hover:bg-purple-50/50">
              <p className="font-semibold text-[13.5px] mb-1">Upload brand assets</p>
              <p className="text-xs text-muted-foreground">Brand guides · PowerPoints · PDFs · Images</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Optional — both can be updated anytime in settings</p>
          </div>
        )}

        {/* Step 3: Recipients */}
        {step === 3 && (
          <div className="max-w-[500px] mx-auto">
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
              Who should receive this newsletter? Enter email addresses below — one per line, or comma-separated.
            </p>
            <textarea rows={6} placeholder={"sarah@company.com\nmichael@company.com\nleadership@company.com\n\nOr paste a comma-separated list…"}
              value={recipients} onChange={e => setRecipients(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[13px] resize-none mb-3 focus:outline-none" />
            {recipientCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg mb-4" style={{ backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL}20` }}>
                <CheckCircle className="w-3.5 h-3.5" style={{ color: TEAL }} />
                <span className="text-xs font-semibold" style={{ color: TEAL }}>{recipientCount} valid email address{recipientCount !== 1 ? "es" : ""} detected</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Optional — skip this and configure recipient lists after your series is created.</p>
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (() => {
          const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const MONTH_DAYS = ["1st", "2nd", "3rd", "4th", "5th", "7th", "10th", "14th", "15th", "21st", "28th"];
          const SEND_TIMES = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "5:00 PM"];
          const scheduleLabel = cadence === "Daily" ? `Every day at ${sendTime}` : cadence === "Weekly" ? `Every ${sendDay} at ${sendTime}` : `Monthly on the ${sendDay} at ${sendTime}`;
          const handleCadenceChange = (c: string) => {
            setCadence(c);
            if (c === "Daily") setSendDay("");
            if (c === "Weekly" && !WEEKDAYS.includes(sendDay)) setSendDay("Friday");
            if (c === "Monthly" && !MONTH_DAYS.includes(sendDay)) setSendDay("1st");
          };
          return (
            <div className="max-w-[520px] mx-auto">
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
                Set when each edition should be sent. Mira will complete curation before this time.
              </p>
              {/* Cadence */}
              <div className="mb-6">
                <p className="text-[13px] font-semibold mb-2">Cadence</p>
                <div className="flex gap-2">
                  {["Daily", "Weekly", "Monthly"].map(c => (
                    <div key={c} onClick={() => handleCadenceChange(c)}
                      className="flex-1 py-2.5 text-center rounded-xl cursor-pointer transition-all"
                      style={{ border: `2px solid ${cadence === c ? TEAL : "rgba(0,0,0,0.12)"}`, backgroundColor: cadence === c ? TEAL_LIGHT : "transparent" }}>
                      <span className="text-[14px]" style={{ fontWeight: cadence === c ? 700 : 500, color: cadence === c ? TEAL : "var(--muted-foreground)" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              {cadence !== "Daily" && (
                <div className="mb-6">
                  <p className="text-[13px] font-semibold mb-2">{cadence === "Weekly" ? "Day of week" : "Day of month"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(cadence === "Weekly" ? WEEKDAYS : MONTH_DAYS).map(day => (
                      <div key={day} onClick={() => setSendDay(day)}
                        className="px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                        style={{ border: `1.5px solid ${sendDay === day ? TEAL : "rgba(0,0,0,0.12)"}`, backgroundColor: sendDay === day ? TEAL_LIGHT : "transparent" }}>
                        <span className="text-[13px]" style={{ fontWeight: sendDay === day ? 700 : 400, color: sendDay === day ? TEAL : "var(--muted-foreground)" }}>
                          {cadence === "Weekly" ? day.slice(0, 3) : day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-8">
                <p className="text-[13px] font-semibold mb-2">Send time</p>
                <div className="flex flex-wrap gap-1.5">
                  {SEND_TIMES.map(t => (
                    <div key={t} onClick={() => setSendTime(t)}
                      className="px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                      style={{ border: `1.5px solid ${sendTime === t ? TEAL : "rgba(0,0,0,0.12)"}`, backgroundColor: sendTime === t ? TEAL_LIGHT : "transparent" }}>
                      <span className="text-xs" style={{ fontWeight: sendTime === t ? 700 : 400, color: sendTime === t ? TEAL : "var(--muted-foreground)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: TEAL_LIGHT, border: `1.5px solid ${TEAL}20` }}>
                <Clock className="w-5 h-5 flex-shrink-0" style={{ color: TEAL }} />
                <div>
                  <p className="text-[14px] font-bold" style={{ color: TEAL }}>{scheduleLabel}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mira will have your edition ready before the send time.</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-border bg-white flex items-center justify-between flex-shrink-0">
        <button onClick={() => step === 0 ? setPhase("landing") : setStep(s => s - 1)}
          className="text-[13px] text-muted-foreground hover:text-foreground">
          {step === 0 ? "← Overview" : "← Back"}
        </button>
        <div className="flex items-center gap-3">
          {step > 0 && step < STEP_LABELS.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} className="text-[13px] text-muted-foreground hover:text-foreground">
              Skip for now
            </button>
          )}
          {step === STEP_LABELS.length - 1 && (
            <button onClick={() => setPhase("generating")} className="text-[13px] text-muted-foreground hover:text-foreground">
              Skip &amp; generate
            </button>
          )}
          <button
            onClick={() => step < STEP_LABELS.length - 1 ? setStep(s => s + 1) : setPhase("generating")}
            disabled={step === 1 && !skill}
            className="flex items-center gap-1.5 text-white font-bold text-[13px] rounded-lg px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: TEAL }}>
            {step === STEP_LABELS.length - 1 ? (
              <><Sparkles className="w-3.5 h-3.5" /> Generate my newsletter</>
            ) : (
              <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inbox data ────────────────────────────────────────────────────────────────
const AMBER       = "#b45309";
const AMBER_LIGHT = "rgba(245,158,11,0.10)";

const SERIES_COLORS: Record<string, string> = {
  "daily-brief":       "#00827F",
  "monthly-roundup":   "#B627A1",
  "media-coverage":    "#e86c5a",
  "competitor-digest": "#4F6AF5",
};

const SERIES = [
  {
    id: "daily-brief", name: "The Daily Brief", cadence: "Daily", sendTime: "7:00 AM", sendDay: null,
    status: "curating", articlesCount: 23, progress: 35,
    searches: [{ name: "Brand Monitoring", type: "explore" }, { name: "Meltwater Leadership", type: "explore" }, { name: "TechCrunch", type: "rss" }],
    recipients: 8, nextSend: "Tomorrow, 7:00 AM", latestLabel: "April 20, 2026",
    curationSkill: "executive-briefing",
    description: "Daily snapshot of brand mentions and industry news from saved searches.",
  },
  {
    id: "monthly-roundup", name: "Monthly Round Up", cadence: "Monthly", sendTime: "9:00 AM", sendDay: "1st",
    status: "curating", articlesCount: 47, progress: 68,
    searches: [{ name: "Meltwater", type: "explore" }, { name: "Google Alerts", type: "explore" }, { name: "SocialReach", type: "tag" }, { name: "TechCrunch", type: "rss" }],
    recipients: 24, nextSend: "May 1, 9:00 AM", latestLabel: "April 2026",
    curationSkill: "coverage-roundup",
    description: "Monthly digest pulling top stories across brand, industry, and social searches.",
  },
  {
    id: "media-coverage", name: "Media Coverage Monthly", cadence: "Monthly", sendTime: "8:30 AM", sendDay: "3rd",
    status: "ready", articlesCount: 12, progress: 100,
    searches: [{ name: "Meltwater Leadership", type: "explore" }, { name: "Cision", type: "explore" }, { name: "Burrelles", type: "explore" }],
    recipients: 16, nextSend: "April 22, 8:30 AM", latestLabel: "April 2026",
    deadline: "April 22, 2026", daysUntil: 2,
    curationSkill: "coverage-roundup",
    description: "Monthly overview of earned media coverage from top monitoring searches.",
  },
  {
    id: "competitor-digest", name: "Competitor Digest", cadence: "Weekly", sendTime: "8:00 AM", sendDay: "Friday",
    status: "curating", articlesCount: 12, progress: 20,
    searches: [{ name: "Meltwater", type: "explore" }, { name: "LexisNexis Newsdesk", type: "explore" }, { name: "TVEyes", type: "explore" }],
    recipients: 12, nextSend: "Fri Apr 25, 8:00 AM", latestLabel: "Week of Apr 14",
    curationSkill: "analytics-snapshot",
    description: "Weekly competitive intelligence digest from saved competitor searches.",
  },
] as const;

type Series = typeof SERIES[number] & { [k: string]: any };

const EDITION_HISTORY: Record<string, { label: string; sent: string; time: string; articles: number; open: string; clicks: string }[]> = {
  "daily-brief": [
    { label: "April 19, 2026", sent: "Apr 19", time: "7:02 AM", articles: 6,  open: "51%", clicks: "12%" },
    { label: "April 18, 2026", sent: "Apr 18", time: "7:01 AM", articles: 8,  open: "47%", clicks: "9%"  },
    { label: "April 17, 2026", sent: "Apr 17", time: "7:00 AM", articles: 5,  open: "44%", clicks: "11%" },
    { label: "April 16, 2026", sent: "Apr 16", time: "7:03 AM", articles: 7,  open: "39%", clicks: "8%"  },
  ],
  "monthly-roundup": [
    { label: "March 2026",    sent: "Mar 1",  time: "9:00 AM", articles: 8,  open: "42%", clicks: "14%" },
    { label: "February 2026", sent: "Feb 1",  time: "9:00 AM", articles: 12, open: "38%", clicks: "11%" },
    { label: "January 2026",  sent: "Jan 1",  time: "9:00 AM", articles: 10, open: "29%", clicks: "9%"  },
    { label: "December 2025", sent: "Dec 2",  time: "9:00 AM", articles: 14, open: "35%", clicks: "12%" },
  ],
  "media-coverage": [
    { label: "March 2026",    sent: "Mar 3",  time: "8:30 AM", articles: 9,  open: "44%", clicks: "16%" },
    { label: "February 2026", sent: "Feb 3",  time: "8:30 AM", articles: 7,  open: "36%", clicks: "13%" },
    { label: "January 2026",  sent: "Jan 2",  time: "8:30 AM", articles: 11, open: "41%", clicks: "15%" },
  ],
  "competitor-digest": [
    { label: "Week of Apr 7",  sent: "Apr 7",  time: "8:00 AM", articles: 9,  open: "48%", clicks: "17%" },
    { label: "Week of Mar 31", sent: "Mar 31", time: "8:00 AM", articles: 11, open: "52%", clicks: "19%" },
    { label: "Week of Mar 24", sent: "Mar 24", time: "8:00 AM", articles: 8,  open: "44%", clicks: "15%" },
  ],
};

const ALL_VIEW_ID        = "__all__";
const RECIPIENTS_VIEW_ID = "__recipients__";
const STATUS_ORDER: Record<string, number> = { ready: 0, curating: 1, sent: 2 };
const DATE_SORT: Record<string, number> = {
  "Tomorrow": 20260421, "April 22, 2026": 20260422, "Fri Apr 25, 8:00 AM": 20260425, "May 1, 9:00 AM": 20260501,
  "Apr 19": 20260419, "Apr 18": 20260418, "Apr 17": 20260417, "Apr 16": 20260416,
  "Apr 7": 20260407, "Mar 31": 20260331, "Mar 24": 20260324,
  "Mar 1": 20260301, "Mar 3": 20260303,
  "Feb 1": 20260201, "Feb 3": 20260203,
  "Jan 1": 20260101, "Jan 2": 20260102, "Dec 2": 20251202,
};

const buildInboxItems = () => {
  const inProgress = SERIES.map((s: any) => ({
    _key: `ip-${s.id}`, type: "inprogress", series: s,
    editionLabel: s.latestLabel, status: s.status, date: s.nextSend,
    dateSortVal: DATE_SORT[s.nextSend] ?? 99999999,
    articles: s.articlesCount, recipients: s.recipients, open: null, clicks: null,
  }));
  const sent = SERIES.flatMap((s: any) =>
    (EDITION_HISTORY[s.id] || []).map((ed, i) => ({
      _key: `sent-${s.id}-${i}`, type: "sent", series: s,
      editionLabel: ed.label, status: "sent", date: ed.sent,
      dateSortVal: DATE_SORT[ed.sent] ?? 0,
      articles: ed.articles, recipients: s.recipients,
      open: parseFloat(ed.open), clicks: parseFloat(ed.clicks),
    }))
  );
  return [...inProgress, ...sent];
};
const ALL_INBOX_ITEMS = buildInboxItems();

// ── NlIcon ────────────────────────────────────────────────────────────────────
function NlIcon({ size = 20, color }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, flexShrink: 0, display: "block", color }}>
      <rect x="0" y="0" width="16" height="16" fill="white" rx="1.5" />
      <path d="M13.5147 0H1.61067C1.18618 0.00275609 0.77971 0.171878 0.478553 0.471041C0.177396 0.770204 0.00557648 1.17554 0 1.6V14.4C0.00557648 14.8245 0.177396 15.2298 0.478553 15.529C0.77971 15.8281 1.18618 15.9972 1.61067 16H13.5147C13.9392 15.9972 14.3456 15.8281 14.6468 15.529C14.9479 15.2298 15.1198 14.8245 15.1253 14.4V1.6C15.1198 1.17554 14.9479 0.770204 14.6468 0.471041C14.3456 0.171878 13.9392 0.00275609 13.5147 0ZM13.5147 14.3787H1.61067V1.6H13.5147V14.3787ZM3.232 4.55467H4.85333V6.176H3.232V4.55467ZM3.232 7.75467H8.62933V9.376H3.232V7.75467ZM10.2613 7.75467H11.8827V9.376H10.272L10.2613 7.75467ZM11.8827 10.9547V12.576H3.232V11.008L11.8827 10.9547ZM11.8827 4.55467V6.176H6.496V4.55467H11.8827Z" fill="currentColor" />
    </svg>
  );
}

function NlStackIcon({ size = 18, color }: { size?: number; color?: string }) {
  const off = Math.round(size * 0.22);
  const total = size + off * 2;
  return (
    <div style={{ position: "relative", width: total, height: total, flexShrink: 0 }}>
      <div style={{ position: "absolute", top: off * 2, left: off * 2, opacity: 0.35 }}><NlIcon size={size} color={color} /></div>
      <div style={{ position: "absolute", top: off, left: off, opacity: 0.65 }}><NlIcon size={size} color={color} /></div>
      <div style={{ position: "absolute", top: 0, left: 0 }}><NlIcon size={size} color={color} /></div>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === "curating") return (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5" style={{ backgroundColor: TEAL_LIGHT }}>
      <Sparkles className="w-2.5 h-2.5 animate-pulse" style={{ color: TEAL }} />
      <span className="text-[11px] font-semibold leading-none" style={{ color: TEAL }}>Auto-curating</span>
    </span>
  );
  if (status === "ready") return (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5" style={{ backgroundColor: AMBER_LIGHT }}>
      <CheckCircle className="w-2.5 h-2.5" style={{ color: AMBER }} />
      <span className="text-[11px] font-semibold leading-none" style={{ color: AMBER }}>Ready for review</span>
    </span>
  );
  return null;
}

function CadenceBadge({ cadence }: { cadence: string }) {
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded bg-black/[0.05]">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{cadence}</span>
    </span>
  );
}

// ── SearchPills ───────────────────────────────────────────────────────────────
function SearchPills({ searches = [] as any[], max = 3 }: { searches?: any[]; max?: number }) {
  const visible = searches.slice(0, max);
  const overflow = searches.length - max;
  return (
    <div className="flex gap-1 flex-wrap items-center">
      {visible.map((s: any) => {
        const cfg = SEARCH_TYPE_CFG[s.type] || SEARCH_TYPE_CFG.explore;
        return (
          <span key={s.name} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5" style={{ backgroundColor: cfg.bg }}>
            <cfg.Icon className="w-2.5 h-2.5" style={{ color: cfg.color }} />
            <span className="text-[11px] font-medium" style={{ color: cfg.color }}>{s.name}</span>
          </span>
        );
      })}
      {overflow > 0 && <span className="text-[11px] text-muted-foreground">+{overflow} more</span>}
    </div>
  );
}

// ── NewsletterThumbnail ───────────────────────────────────────────────────────
function NewsletterThumbnail({ series, size = "md" }: { series: any; size?: "md" | "lg" }) {
  const accent = SERIES_COLORS[series.id] || TEAL;
  const w = size === "lg" ? 88 : 68;
  const h = size === "lg" ? 110 : 86;
  const rowWidths: Record<string, number[]> = {
    "daily-brief":      [82, 58, 90, 64, 75, 50],
    "monthly-roundup":  [90, 70, 60, 85, 55, 78],
    "media-coverage":   [75, 55, 88, 62, 70, 48],
    "competitor-digest":[85, 65, 78, 55, 90, 60],
  };
  const rows = rowWidths[series.id] || [80, 60, 85, 55, 72, 48];
  return (
    <div style={{ width: w, height: h, flexShrink: 0, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(0,0,0,0.13)", boxShadow: "0 3px 10px rgba(0,0,0,0.12)", backgroundColor: "#fff", display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ backgroundColor: accent, padding: "7px 8px 6px", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.75)", flexShrink: 0 }} />
        <div style={{ height: 4, width: 30, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.55)" }} />
      </div>
      <div style={{ padding: "6px 7px 4px" }}>
        <div style={{ height: 4, width: "88%", borderRadius: 2, backgroundColor: "rgba(0,0,0,0.18)", marginBottom: 4 }} />
        <div style={{ height: 3, width: "65%", borderRadius: 2, backgroundColor: "rgba(0,0,0,0.09)" }} />
      </div>
      <div style={{ height: 1, margin: "0 7px 4px", backgroundColor: "rgba(0,0,0,0.07)" }} />
      <div style={{ padding: "0 7px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {rows.map((pct, i) => (
          <div key={i} style={{ height: 3, width: `${pct}%`, borderRadius: 2, backgroundColor: i % 3 === 0 ? `${accent}40` : "rgba(0,0,0,0.08)" }} />
        ))}
      </div>
      <div style={{ height: 7, backgroundColor: "rgba(0,0,0,0.04)", borderTop: "1px solid rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// ── StackedThumbnails ─────────────────────────────────────────────────────────
function StackedThumbnails() {
  const stack = [...SERIES].slice(0, 3).reverse();
  const w = 68, h = 86;
  return (
    <div style={{ position: "relative", width: w + 20, height: h + 12, flexShrink: 0 }}>
      {stack.map((series: any, i) => {
        const isFront = i === stack.length - 1;
        const backness = stack.length - 1 - i;
        const rotate = backness === 0 ? 0 : backness === 1 ? -5 : -9;
        const tx = backness === 0 ? 10 : backness === 1 ? 4 : 0;
        const ty = backness === 0 ? 12 : backness === 1 ? 6 : 0;
        return (
          <div key={series.id} style={{ position: "absolute", top: ty, left: tx, zIndex: i + 1, transform: `rotate(${rotate}deg)`, transformOrigin: "bottom center", opacity: isFront ? 1 : 0.75 - backness * 0.1, filter: isFront ? "none" : `brightness(${1 - backness * 0.06})` }}>
            <NewsletterThumbnail series={series} size="md" />
          </div>
        );
      })}
    </div>
  );
}

// ── SeriesListItem ────────────────────────────────────────────────────────────
function SeriesListItem({ series, selected, onClick }: { series: any; selected: boolean; onClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = selected ? TEAL : series.status === "ready" ? AMBER : "rgba(0,0,0,0.28)";
  return (
    <div onClick={onClick} className="group relative px-4 py-3 cursor-pointer border-b border-border"
      style={{ borderLeft: `3px solid ${selected ? TEAL : "transparent"}`, backgroundColor: selected ? TEAL_LIGHT : "transparent" }}>
      <div className="flex items-start justify-between gap-2">
        <NlStackIcon size={18} color={accent} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] leading-snug mb-1" style={{ fontWeight: selected ? 700 : 500 }}>{series.name}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <CadenceBadge cadence={series.cadence} />
            <StatusBadge status={series.status} />
          </div>
          <p className="text-[11px] mt-1" style={{ color: series.status === "ready" ? AMBER : "var(--muted-foreground)" }}>
            {series.status === "curating" && `${series.articlesCount} articles curated so far`}
            {series.status === "ready" && `${series.articlesCount} articles · Send in ${series.daysUntil}d`}
          </p>
          {series.sendTime && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {series.cadence === "Daily" ? `Daily · ${series.sendTime}` : series.sendDay ? `${series.sendDay} · ${series.sendTime}` : series.sendTime}
              </span>
            </div>
          )}
        </div>
        <button onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/[0.06]">
          <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      {menuOpen && (
        <div className="absolute right-2 top-8 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[180px]" onClick={e => e.stopPropagation()}>
          {["Edit series settings", "Manage recipients", "Duplicate series"].map(l => (
            <button key={l} className="w-full text-left text-[13px] px-3 py-2 hover:bg-muted"
              onClick={() => setMenuOpen(false)}>{l}</button>
          ))}
          <div className="border-t border-border my-1" />
          <button className="w-full text-left text-[13px] px-3 py-2 hover:bg-muted text-red-600" onClick={() => setMenuOpen(false)}>Delete series</button>
        </div>
      )}
    </div>
  );
}

// ── SortHeader ────────────────────────────────────────────────────────────────
function SortHeader({ colKey, label, align, sortCol, sortDir, onSort }: any) {
  const active = sortCol === colKey;
  return (
    <div onClick={() => onSort(colKey)} className="flex items-center gap-1 cursor-pointer select-none group"
      style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      <span className="text-[11px] uppercase tracking-wider" style={{ fontWeight: active ? 700 : 600, color: active ? TEAL : "var(--muted-foreground)" }}>
        {label}
      </span>
      <div className="flex flex-col gap-px opacity-35 group-hover:opacity-70">
        <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderBottom: `4px solid ${active && sortDir === "asc" ? TEAL : "#999"}` }} />
        <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: `4px solid ${active && sortDir === "desc" ? TEAL : "#999"}` }} />
      </div>
    </div>
  );
}

// ── InboxRow ──────────────────────────────────────────────────────────────────
const COL_GRID = "1.6fr 140px 150px 1fr 1fr 1fr 1fr 210px";

function InboxRow({ item }: { item: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isReady = item.status === "ready";
  const isCurating = item.status === "curating";
  const isSent = item.status === "sent";

  const rowBg = isReady ? "rgba(245,158,11,0.07)" : isCurating ? "rgba(0,130,127,0.04)" : "transparent";

  return (
    <div className="group relative border-b border-border" style={{ display: "grid", gridTemplateColumns: COL_GRID, alignItems: "center", padding: "10px 20px", gap: "12px", backgroundColor: rowBg, cursor: "pointer" }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.025)")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = rowBg)}>

      {/* Edition */}
      <div className="flex items-center gap-3 min-w-0">
        <NlIcon size={18} color={isSent ? "rgba(0,0,0,0.22)" : isReady ? AMBER : TEAL} />
        <div className="min-w-0">
          <p className="text-[13px] font-bold truncate">{item.editionLabel}</p>
          <p className="text-[11px] text-muted-foreground truncate">{item.series.name}</p>
        </div>
      </div>

      {/* Status */}
      <div>
        {isSent
          ? <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 bg-black/[0.05]">
              <Send className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground">Sent</span>
            </span>
          : <StatusBadge status={item.status} />
        }
      </div>

      {/* Send Date */}
      <div>
        <p className="text-[13px] font-medium">{item.date}</p>
        {!isSent && <p className="text-[10px] text-muted-foreground mt-0.5">{isReady ? "send by" : "next send"}</p>}
      </div>

      {/* Recipients */}
      <div className="text-right"><span className="text-[13px] font-medium">{item.recipients}</span></div>

      {/* Articles */}
      <div className="text-right"><span className="text-[13px] font-medium">{item.articles}</span></div>

      {/* Open */}
      <div className="text-right">
        {item.open != null
          ? <span className="text-[13px] font-semibold" style={{ color: item.open >= 45 ? TEAL : "inherit" }}>{item.open}%</span>
          : <span className="text-[13px] text-muted-foreground">—</span>
        }
      </div>

      {/* Clicks */}
      <div className="text-right">
        {item.clicks != null
          ? <span className="text-[13px] font-semibold" style={{ color: item.clicks >= 15 ? TEAL : "inherit" }}>{item.clicks}%</span>
          : <span className="text-[13px] text-muted-foreground">—</span>
        }
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        {isSent
          ? <button className="p-1.5 rounded hover:bg-black/[0.06] text-muted-foreground"><ExternalLink className="w-3.5 h-3.5" /></button>
          : isReady
          ? <>
              <button className="text-[11px] font-semibold px-3 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted">Preview</button>
              <button className="text-[11px] font-semibold px-3 py-1.5 rounded text-white" style={{ backgroundColor: AMBER }}>Review &amp; Edit</button>
            </>
          : <>
              <button className="text-[11px] font-semibold px-3 py-1.5 rounded border text-muted-foreground hover:bg-muted" style={{ borderColor: "var(--border)" }}>Preview</button>
              <button className="text-[11px] font-semibold px-3 py-1.5 rounded border" style={{ borderColor: TEAL, color: TEAL }}>Edit</button>
            </>
        }
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-black/[0.06]" onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}>
          <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {menuOpen && (
          <div className="absolute right-4 top-8 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[200px]">
            <button className="w-full text-left text-[13px] px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>View edition</button>
            <button className="w-full text-left text-[13px] px-3 py-2 hover:bg-muted" onClick={() => setMenuOpen(false)}>View analytics</button>
            <div className="border-t border-border my-1" />
            <button className="w-full text-left text-[13px] px-3 py-2 hover:bg-muted text-red-600" onClick={() => setMenuOpen(false)}>Delete record</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AllNewslettersInbox ───────────────────────────────────────────────────────
function AllNewslettersInbox() {
  const [filter, setFilter]   = useState("all");
  const [sortCol, setSortCol] = useState("status");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const sentCount     = ALL_INBOX_ITEMS.filter(i => i.type === "sent").length;
  const readyCount    = SERIES.filter((s: any) => s.status === "ready").length;
  const curatingCount = SERIES.filter((s: any) => s.status === "curating").length;

  const filtered = ALL_INBOX_ITEMS.filter(item => {
    if (filter === "inprogress") return item.type === "inprogress";
    if (filter === "sent")       return item.type === "sent";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: any, bv: any;
    switch (sortCol) {
      case "edition":    av = `${a.series.name} ${a.editionLabel}`;   bv = `${b.series.name} ${b.editionLabel}`; break;
      case "status":     av = STATUS_ORDER[a.status] ?? 9;             bv = STATUS_ORDER[b.status] ?? 9;          break;
      case "date":       av = a.dateSortVal;                           bv = b.dateSortVal;                        break;
      case "recipients": av = a.recipients;                            bv = b.recipients;                         break;
      case "articles":   av = a.articles;                              bv = b.articles;                           break;
      case "open":       av = a.open   ?? -1;                          bv = b.open   ?? -1;                       break;
      case "clicks":     av = a.clicks ?? -1;                          bv = b.clicks ?? -1;                       break;
      default: return 0;
    }
    const primary = typeof av === "string"
      ? (sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av))
      : (sortDir === "asc" ? av - bv : bv - av);
    if (primary === 0 && sortCol === "status") return b.dateSortVal - a.dateSortVal;
    return primary;
  });

  // Performance metrics
  const allEditions = Object.values(EDITION_HISTORY).flat();
  const opens  = allEditions.map(e => parseFloat(e.open));
  const clicks = allEditions.map(e => parseFloat(e.clicks));
  const avgOpen   = (opens.reduce((a, b) => a + b, 0) / opens.length).toFixed(1);
  const avgClicks = (clicks.reduce((a, b) => a + b, 0) / clicks.length).toFixed(1);
  const totalRecipients = SERIES.reduce((a: number, s: any) => a + s.recipients, 0);
  const recentOpens = Object.values(EDITION_HISTORY).map(eds => parseFloat(eds[0]?.open ?? "0"));
  const prevOpens   = Object.values(EDITION_HISTORY).map(eds => parseFloat(eds[1]?.open ?? eds[0]?.open ?? "0"));
  const openTrend   = (recentOpens.reduce((a,b)=>a+b,0)/recentOpens.length) - (prevOpens.reduce((a,b)=>a+b,0)/prevOpens.length);
  const recentClicks = Object.values(EDITION_HISTORY).map(eds => parseFloat(eds[0]?.clicks ?? "0"));
  const prevClicks   = Object.values(EDITION_HISTORY).map(eds => parseFloat(eds[1]?.clicks ?? eds[0]?.clicks ?? "0"));
  const clickTrend   = (recentClicks.reduce((a,b)=>a+b,0)/recentClicks.length) - (prevClicks.reduce((a,b)=>a+b,0)/prevClicks.length);

  const metrics = [
    { label: "Avg Open Rate",     value: `${avgOpen}%`,       trend: openTrend,  trendLabel: "vs prev editions" },
    { label: "Avg Click Rate",    value: `${avgClicks}%`,     trend: clickTrend, trendLabel: "vs prev editions" },
    { label: "Editions Sent",     value: allEditions.length,  trend: null,       trendLabel: "total sent"        },
    { label: "Total Subscribers", value: totalRecipients,     trend: null,       trendLabel: "across all series" },
    { label: "Active Series",     value: SERIES.length,       trend: null,       trendLabel: "newsletters"       },
  ];

  const HEADER_COLS = [
    { key: "edition",    label: "Edition",    align: "left"  },
    { key: "status",     label: "Status",     align: "left"  },
    { key: "date",       label: "Send Date",  align: "left"  },
    { key: "recipients", label: "Recipients", align: "right" },
    { key: "articles",   label: "Articles",  align: "right" },
    { key: "open",       label: "Open",       align: "right" },
    { key: "clicks",     label: "Clicks",     align: "right" },
    { key: "_action",    label: "",           align: "right", noSort: true },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-5">
            <StackedThumbnails />
            <div>
              <p className="font-bold text-xl mb-0.5">All Newsletters</p>
              <p className="text-[13px] text-muted-foreground">{SERIES.length} series · {sentCount} sent editions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {readyCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1" style={{ backgroundColor: AMBER_LIGHT }}>
                <AlertTriangle className="w-3 h-3" style={{ color: AMBER }} />
                <span className="text-xs font-bold" style={{ color: AMBER }}>{readyCount} need review</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1" style={{ backgroundColor: TEAL_LIGHT }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: TEAL }} />
              <span className="text-xs font-bold" style={{ color: TEAL }}>{curatingCount} auto-curating</span>
            </div>
          </div>
        </div>

        {/* Performance strip */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex-shrink-0">Overall Performance</span>
          <div className="flex flex-1 border border-border rounded-lg overflow-hidden bg-white">
            {metrics.map((m, i) => (
              <div key={m.label} className="flex-1 px-3 py-2 flex items-baseline gap-2"
                style={{ borderRight: i < metrics.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="text-[15px] font-bold flex-shrink-0">{m.value}</span>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">{m.label}</p>
                  {m.trend !== null
                    ? <p className="text-[10px] font-semibold" style={{ color: m.trend > 0 ? "#16a34a" : m.trend < 0 ? "#dc2626" : "var(--muted-foreground)" }}>
                        {m.trend > 0 ? `↑ +${m.trend.toFixed(1)}%` : m.trend < 0 ? `↓ ${m.trend.toFixed(1)}%` : "—"}
                      </p>
                    : <p className="text-[10px] text-muted-foreground">{m.trendLabel}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {[
            { key: "all",        label: "All",         count: ALL_INBOX_ITEMS.length },
            { key: "inprogress", label: "In Progress", count: SERIES.length },
            { key: "sent",       label: "Sent",        count: sentCount },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs cursor-pointer transition-colors"
              style={{
                backgroundColor: filter === tab.key ? TEAL_LIGHT : "transparent",
                border: `1px solid ${filter === tab.key ? "rgba(0,130,127,0.25)" : "var(--border)"}`,
                color: filter === tab.key ? TEAL : "var(--muted-foreground)",
                fontWeight: filter === tab.key ? 700 : 500,
              }}>
              {tab.label}
              <span className="rounded-full px-1.5 py-px text-[10px] font-bold"
                style={{ backgroundColor: filter === tab.key ? "rgba(0,130,127,0.15)" : "rgba(0,0,0,0.07)", color: filter === tab.key ? TEAL : "var(--muted-foreground)" }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div className="border-b border-border bg-black/[0.02]"
        style={{ display: "grid", gridTemplateColumns: COL_GRID, padding: "8px 20px", gap: 12, alignItems: "center" }}>
        {HEADER_COLS.map(col => (
          col.noSort
            ? <div key={col.key} />
            : <SortHeader key={col.key} colKey={col.key} label={col.label} align={col.align} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        ))}
      </div>

      {/* Rows */}
      <div>
        {sorted.map(item => <InboxRow key={item._key} item={item} />)}
        {sorted.length === 0 && (
          <div className="flex items-center justify-center h-24">
            <p className="text-[13px] text-muted-foreground">No editions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SeriesDetail ──────────────────────────────────────────────────────────────
function SeriesDetail({ series }: { series: any }) {
  const editions = EDITION_HISTORY[series.id] || [];
  const opens    = editions.map(e => parseFloat(e.open));
  const clicks   = editions.map(e => parseFloat(e.clicks));
  const avgOpen  = opens.length ? (opens.reduce((a,b)=>a+b,0)/opens.length).toFixed(1) : null;
  const avgClicks = clicks.length ? (clicks.reduce((a,b)=>a+b,0)/clicks.length).toFixed(1) : null;
  const skill    = CURATION_SKILLS[series.curationSkill as keyof typeof CURATION_SKILLS];
  const SkillIcon = skill?.Icon || Sparkles;

  return (
    <div>
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border bg-white">
        <div className="flex items-start gap-4 mb-3">
          <NewsletterThumbnail series={series} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-xl">{series.name}</h2>
              <CadenceBadge cadence={series.cadence} />
            </div>
            <p className="text-[13px] text-muted-foreground mb-2">{series.description}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Mira skill:</span>
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5" style={{ backgroundColor: skill?.bg, border: `1px solid ${skill?.color}28` }}>
                <SkillIcon className="w-2.5 h-2.5" style={{ color: skill?.color }} />
                <span className="text-[11px] font-semibold" style={{ color: skill?.color }}>{skill?.label}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <button className="text-[12px] border border-border rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {series.recipients} recipients
            </button>
            <button className="text-[12px] border border-border rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curation settings
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">Next send: <strong>{series.nextSend}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-muted-foreground">Sources:</span>
            <SearchPills searches={series.searches} max={4} />
          </div>
        </div>
      </div>

      {/* Performance metrics */}
      {editions.length > 0 && (
        <div className="px-6 py-3 border-b border-border bg-white flex items-center gap-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex-shrink-0">Performance</span>
          <div className="flex flex-1 border border-border rounded-lg overflow-hidden">
            {[
              { label: "Avg Open Rate",   value: `${avgOpen}%` },
              { label: "Avg Click Rate",  value: `${avgClicks}%` },
              { label: "Editions Sent",   value: editions.length },
              { label: "Avg Articles",    value: (editions.reduce((a,e)=>a+e.articles,0)/editions.length).toFixed(1) },
              { label: "Recipients",      value: series.recipients },
            ].map((m, i, arr) => (
              <div key={m.label} className="flex-1 px-3 py-2 flex items-baseline gap-2"
                style={{ borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="text-[15px] font-bold">{m.value}</span>
                <span className="text-[11px] text-muted-foreground font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current edition */}
      <div className="px-6 pt-5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Next {series.cadence} Edition
        </p>
        <div className="bg-white border border-border rounded-xl p-4 mb-5" style={{ borderLeft: `3px solid ${SERIES_COLORS[series.id] || TEAL}` }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-[14px]">{series.latestLabel}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{series.articlesCount} articles curated</p>
            </div>
            <StatusBadge status={series.status} />
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all" style={{ width: `${series.progress}%`, backgroundColor: SERIES_COLORS[series.id] || TEAL }} />
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">{series.progress}% curated</p>
          <div className="flex gap-2">
            <button className="text-[12px] font-semibold px-4 py-1.5 rounded-lg border text-muted-foreground hover:bg-muted" style={{ borderColor: "var(--border)" }}>Preview draft</button>
            {series.status === "ready"
              ? <button className="text-[12px] font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: AMBER }}>Review &amp; Edit</button>
              : <button className="text-[12px] font-semibold px-4 py-1.5 rounded-lg border" style={{ borderColor: TEAL, color: TEAL }}>Open in editor</button>
            }
          </div>
        </div>

        {/* Edition history */}
        {editions.length > 0 && (
          <>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Sent ({editions.length})
            </p>
            <div className="border border-border rounded-xl overflow-hidden bg-white mb-6">
              <div className="flex items-center px-5 py-2 bg-black/[0.02] border-b border-border">
                <span className="flex-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Edition</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-10 text-center">Open</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-10 text-center ml-6">Clicks</span>
                <div className="w-7" />
              </div>
              {editions.map((ed, idx) => (
                <div key={ed.label} className="flex items-center px-5 py-3 border-b last:border-b-0 border-border hover:bg-muted/50 group">
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{ed.label}</p>
                    <p className="text-[11px] text-muted-foreground">{ed.sent} · {ed.time} · {ed.articles} articles</p>
                  </div>
                  <span className="text-[13px] font-semibold w-10 text-center" style={{ color: parseFloat(ed.open) >= 45 ? TEAL : "inherit" }}>{ed.open}</span>
                  <span className="text-[13px] font-semibold w-10 text-center ml-6" style={{ color: parseFloat(ed.clicks) >= 15 ? TEAL : "inherit" }}>{ed.clicks}</span>
                  <button className="w-7 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── RecipientsPlaceholder ─────────────────────────────────────────────────────
function RecipientsPlaceholder() {
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-5 pb-4 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl mb-0.5">Recipient Lists</h2>
            <p className="text-[13px] text-muted-foreground">8 lists · 7,022 total subscribers</p>
          </div>
          <button className="flex items-center gap-1.5 text-white font-semibold text-sm rounded-lg px-4 py-2" style={{ backgroundColor: PURPLE }}>
            <Plus className="w-4 h-4" /> New List
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {[
            { name: "External List",     subscribers: "2,840", usedIn: "3 Newsletters",   owner: "Maricela", updated: "Mar 25, 2026" },
            { name: "C-Suite Leadership", subscribers: "12",    usedIn: "2 Newsletters",   owner: "Maricela", updated: "Mar 25, 2026" },
            { name: "Tech Team",         subscribers: "34",    usedIn: "4 Newsletters",   owner: "Maricela", updated: "Mar 25, 2026" },
            { name: "Media Team",        subscribers: "2,677", usedIn: "The Daily Brief", owner: "Maricela", updated: "Mar 25, 2026" },
            { name: "Leadership Team",   subscribers: "111",   usedIn: "Monthly Round Up",owner: "Maricela", updated: "Mar 25, 2026" },
            { name: "Press Contacts",    subscribers: "448",   usedIn: "1 Newsletter",    owner: "Tony",     updated: "Apr 2, 2026"  },
            { name: "Partner Network",   subscribers: "892",   usedIn: "2 Newsletters",   owner: "Tony",     updated: "Apr 10, 2026" },
            { name: "Board Members",     subscribers: "8",     usedIn: "Monthly Round Up",owner: "Maricela", updated: "Feb 14, 2026" },
          ].map((list, idx, arr) => (
            <div key={list.name} className="grid px-4 py-3 hover:bg-muted/50 cursor-pointer"
              style={{ gridTemplateColumns: "2fr 110px 200px 110px 1fr", borderBottom: idx < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-[13px] font-semibold" style={{ color: TEAL }}>{list.name}</span>
              </div>
              <span className="text-[13px]">{list.subscribers}</span>
              <span className="text-[12px] text-muted-foreground">{list.usedIn}</span>
              <span className="text-[13px]">{list.owner}</span>
              <span className="text-[13px] text-muted-foreground text-right">{list.updated}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const Newsletters = () => {
  const [onboarded, setOnboarded]   = useState(false);
  const [selectedId, setSelectedId] = useState(ALL_VIEW_ID);
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState<"newsletters" | "recipients">("newsletters");

  const selectedSeries = SERIES.find((s: any) => s.id === selectedId) as any;
  const readyCount     = SERIES.filter((s: any) => s.status === "ready").length;
  const filteredSeries = SERIES.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()));

  if (!onboarded) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar activePage="newsletters" />
        <Header />
        <main className="ml-52 pt-16 min-h-screen">
          <NewsletterOnboarding onComplete={() => setOnboarded(true)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="newsletters" />
      <Header />
      <main className="ml-52 pt-16">

        {/* ── Page header ── */}
        <div className="px-8 pt-6 bg-background">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
                Design, curate and send branded newsletters
              </h1>
              <p className="text-sm text-muted-foreground">
                Build series powered by your searches. Mira curates each edition automatically.
              </p>
            </div>
            <button
              className="flex items-center gap-2 text-white font-semibold text-[13px] rounded-lg px-4 py-2 mt-1 flex-shrink-0"
              style={{ backgroundColor: TEAL }}
            >
              <Plus className="w-3.5 h-3.5" /> New Newsletter Series
            </button>
          </div>

          {/* Tab nav */}
          <div className="border-b border-border">
            <nav className="flex gap-1">
              {([
                { id: "newsletters", label: "Newsletters" },
                { id: "recipients",  label: "Recipient Lists" },
              ] as const).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
                  style={{
                    borderBottomColor: activeTab === id ? TEAL : "transparent",
                    color: activeTab === id ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Newsletters tab ── */}
        {activeTab === "newsletters" && (
          <div className="flex">

            {/* Left sidebar */}
            <div className="w-[260px] flex-shrink-0 flex flex-col border-r border-border bg-white sticky top-16 self-start" style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-muted/50 border border-border">
                  <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search series..."
                    className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground" />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {/* All Newsletters */}
                <div onClick={() => setSelectedId(ALL_VIEW_ID)}
                  className="mx-3 my-1 px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
                  style={{
                    backgroundColor: selectedId === ALL_VIEW_ID ? TEAL_LIGHT : "transparent",
                    border: `1px solid ${selectedId === ALL_VIEW_ID ? "rgba(0,130,127,0.2)" : "transparent"}`,
                  }}>
                  <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: selectedId === ALL_VIEW_ID ? "rgba(0,130,127,0.15)" : "rgba(0,0,0,0.06)" }}>
                    <Inbox className="w-4 h-4" style={{ color: selectedId === ALL_VIEW_ID ? TEAL : "var(--muted-foreground)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px]" style={{ fontWeight: selectedId === ALL_VIEW_ID ? 700 : 500, color: selectedId === ALL_VIEW_ID ? TEAL : "inherit" }}>All Newsletters</p>
                    <p className="text-[11px] text-muted-foreground">{SERIES.length} series · all editions</p>
                  </div>
                  {readyCount > 0 && (
                    <span className="rounded-full px-2 py-px text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: TEAL }}>{readyCount}</span>
                  )}
                </div>

                <div className="mx-3 mb-1 border-t border-border" />

                {/* Series section label */}
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Series ({filteredSeries.length})
                  </span>
                  {readyCount > 0 && (
                    <span className="rounded-full px-2 py-px text-[10px] font-bold text-white" style={{ backgroundColor: TEAL }}>
                      {readyCount} need review
                    </span>
                  )}
                </div>

                {(filteredSeries as any[]).map((s: any) => (
                  <SeriesListItem key={s.id} series={s} selected={selectedId === s.id} onClick={() => setSelectedId(s.id)} />
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex-1" style={{ backgroundColor: selectedId === ALL_VIEW_ID ? "white" : "rgba(0,0,0,0.02)" }}>
              {selectedId === ALL_VIEW_ID
                ? <AllNewslettersInbox />
                : selectedSeries
                ? <SeriesDetail series={selectedSeries} />
                : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[13px] text-muted-foreground">Select a series to view editions</p>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ── Recipient Lists tab ── */}
        {activeTab === "recipients" && (
          <div className="bg-white">
            <RecipientsPlaceholder />
          </div>
        )}

      </main>
    </div>
  );
};

export default Newsletters;
