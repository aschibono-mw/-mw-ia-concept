import { useState, useRef, useEffect } from "react";
import {
  Search, Sparkles, Clock, LayoutGrid, FileText, Mail,
  Star, TrendingUp, X, ArrowRight, Rss, Bell, BookOpen,
  BarChart2, ChevronRight, Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TEAL       = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";
const PURPLE     = "#B627A1";
const AMBER      = "#f59e0b";
const BLUE       = "#4F6AF5";

// ── MarqueeSelector ───────────────────────────────────────────────────────────
function MarqueeSelector({ onClose }: { onClose: () => void }) {
  const [phase, setPhase]           = useState<"selecting" | "selected">("selecting");
  const [dragStart, setDragStart]   = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd]       = useState<{ x: number; y: number } | null>(null);
  const [finalRect, setFinalRect]   = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [query, setQuery]           = useState("");
  const queryInputRef               = useRef<HTMLInputElement>(null);

  // Escape always exits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Normalise raw drag coords into a rect
  const toRect = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(b.x - a.x),
    h: Math.abs(b.y - a.y),
  });

  const liveRect = dragStart && dragEnd ? toRect(dragStart, dragEnd) : null;
  const displayRect = phase === "selected" ? finalRect : liveRect;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (phase !== "selecting") return;
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragEnd({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || phase !== "selecting") return;
    setDragEnd({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart || phase !== "selecting") return;
    const rect = toRect(dragStart, { x: e.clientX, y: e.clientY });
    if (rect.w > 24 && rect.h > 24) {
      setFinalRect(rect);
      setPhase("selected");
      setTimeout(() => queryInputRef.current?.focus(), 80);
    } else {
      // Too small — reset so user can try again
      setDragStart(null);
      setDragEnd(null);
    }
  };

  // Popup positioning: below the selection, clamped to viewport
  const POPUP_W = 420;
  const POPUP_H = 76; // label row ~24 + gap 8 + input 44
  let popupLeft = 0, popupTop = 0, flipAbove = false;
  if (finalRect) {
    popupLeft = Math.max(12, Math.min(
      finalRect.x + finalRect.w / 2 - POPUP_W / 2,
      window.innerWidth - POPUP_W - 12
    ));
    popupTop = finalRect.y + finalRect.h + 14;
    if (popupTop + POPUP_H > window.innerHeight - 16) {
      popupTop = finalRect.y - POPUP_H - 14;
      flipAbove = true;
    }
  }

  return (
    <>
      {/* ── Full-screen capture overlay ── */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          cursor: phase === "selecting" ? "crosshair" : "default",
          userSelect: "none",
        }}
      >
        {/* Selection rectangle — box-shadow creates the dim cutout */}
        {displayRect && displayRect.w > 4 && displayRect.h > 4 && (
          <div
            style={{
              position: "absolute",
              left: displayRect.x,
              top: displayRect.y,
              width: displayRect.w,
              height: displayRect.h,
              border: `2px dashed ${TEAL}`,
              borderRadius: 4,
              background: "rgba(0,130,127,0.05)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.28)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Hint banner — visible before dragging starts */}
        {phase === "selecting" && !dragStart && (
          <div
            style={{
              position: "absolute",
              top: 72,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(12,12,12,0.80)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.1,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Selector icon inline */}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeDasharray="2.5 2.5" strokeLinecap="round"/>
              <path d="M6 5.5 L6 10.5 L7.8 8.9 L9.2 11.5 L10.2 11 L8.8 8.4 L11 8.4 Z" fill="rgba(255,255,255,0.7)" transform="scale(0.85) translate(1,1)"/>
            </svg>
            Drag to select anything on screen
            <span style={{ opacity: 0.5, margin: "0 2px" }}>·</span>
            <kbd style={{ background: "rgba(255,255,255,0.14)", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>Esc</kbd>
            to cancel
          </div>
        )}
      </div>

      {/* ── Contextual Ask Mira popup ── */}
      {phase === "selected" && finalRect && (
        <div
          style={{
            position: "fixed",
            left: popupLeft,
            top: popupTop,
            width: POPUP_W,
            zIndex: 10000,
            display: "flex",
            flexDirection: flipAbove ? "column-reverse" : "column",
            gap: 8,
          }}
        >
          {/* Context label row */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, paddingLeft: 14, paddingRight: 8 }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeDasharray="2.5 2.5" strokeLinecap="round"/>
              <path d="M6 5.5 L6 10.5 L7.8 8.9 L9.2 11.5 L10.2 11 L8.8 8.4 L11 8.4 Z" fill="rgba(255,255,255,0.75)" transform="scale(0.85) translate(1,1)"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", flex: 1 }}>
              Ask Mira about your selection
            </span>
            <button
              onClick={onClose}
              title="Exit selection mode (Esc)"
              style={{
                background: "rgba(255,255,255,0.16)",
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                cursor: "pointer",
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Ask Mira input — identical style to the main bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 44,
              borderRadius: 999,
              backgroundColor: "#ffffff",
              border: "1.5px solid rgba(0,0,0,0.14)",
              boxShadow: "0 6px 28px rgba(0,0,0,0.30)",
              overflow: "hidden",
            }}
          >
            <Sparkles style={{ width: 16, height: 16, color: TEAL, flexShrink: 0, marginLeft: 14 }} />
            <input
              ref={queryInputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask Mira about this…"
              onKeyDown={e => {
                if (e.key === "Escape") onClose();
                if (e.key === "Enter" && query.trim()) onClose();
              }}
              style={{
                flex: 1,
                padding: "0 8px 0 10px",
                fontSize: 14,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--foreground)",
              }}
            />
            <button
              onClick={() => { if (query.trim()) onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginRight: 6,
                padding: "0 14px",
                height: 32,
                borderRadius: 999,
                background: "linear-gradient(135deg, #B627A1 0%, #00827F 100%)",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Ask Mira
              <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

type SearchResultType = "search" | "monitor" | "dashboard" | "newsletter" | "digest" | "alert" | "report";

interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  category: string;
  starred?: boolean;
}

// ── Section config — maps type → app section label + colour + icon ─────────
const SECTION_CFG: Record<SearchResultType, {
  label: string;
  color: string;
  bg: string;
  Icon: React.ElementType;
  route: string;
}> = {
  search:     { label: "Discover",    color: TEAL,    bg: TEAL_LIGHT,                   Icon: Search,    route: "/discover"   },
  monitor:    { label: "Monitor",     color: "#e86c5a", bg: "rgba(232,108,90,0.10)",    Icon: Rss,       route: "/monitor"    },
  dashboard:  { label: "Analyze",     color: BLUE,    bg: "rgba(79,106,245,0.10)",      Icon: BarChart2, route: "/analyze"    },
  newsletter: { label: "Newsletters", color: PURPLE,  bg: "rgba(182,39,161,0.08)",      Icon: Mail,      route: "/newsletters"},
  digest:     { label: "Digests",     color: AMBER,   bg: "rgba(245,158,11,0.10)",      Icon: BookOpen,  route: "/digests"    },
  alert:      { label: "Alerts",      color: "#ef4444", bg: "rgba(239,68,68,0.08)",     Icon: Bell,      route: "/alerts"     },
  report:     { label: "Reports",     color: "#6b7280", bg: "rgba(107,114,128,0.10)",   Icon: FileText,  route: "/reports"    },
};

// ── All assets ────────────────────────────────────────────────────────────────
const allAssets: SearchResult[] = [
  // Searches
  { id: "s1", name: "Brand + Earnings Risk",    type: "search",    category: "Brand",      starred: true  },
  { id: "s2", name: "Competitor Monitoring",    type: "search",    category: "Competition"               },
  { id: "s3", name: "Industry News Search",     type: "search",    category: "Industry"                  },
  { id: "s4", name: "Brand Mentions",           type: "search",    category: "Brand",      starred: true  },
  { id: "s5", name: "Crisis Watch",             type: "search",    category: "Crisis"                    },
  // Monitors
  { id: "m1", name: "Brand Stream",             type: "monitor",   category: "Brand",      starred: true  },
  { id: "m2", name: "Competitor Watch",         type: "monitor",   category: "Competition"               },
  { id: "m3", name: "Executive Radar",          type: "monitor",   category: "Leadership", starred: true  },
  // Dashboards
  { id: "d1", name: "Quarterly Earnings",       type: "dashboard", category: "Finance",    starred: true  },
  { id: "d2", name: "Brand Health Overview",    type: "dashboard", category: "Brand"                     },
  { id: "d3", name: "Risk Monitor",             type: "dashboard", category: "Risk",       starred: true  },
  { id: "d4", name: "Investor Sentiment",       type: "dashboard", category: "Finance"                   },
  // Newsletters
  { id: "n1", name: "The Daily Media Brief",    type: "newsletter", category: "Media",     starred: true  },
  { id: "n2", name: "The Brand Pulse",          type: "newsletter", category: "Brand"                    },
  { id: "n3", name: "Morning Media Roundup",    type: "newsletter", category: "Media"                    },
  // Digests
  { id: "dg1", name: "Weekly Comms Digest",     type: "digest",    category: "Comms",      starred: true  },
  { id: "dg2", name: "Crisis Briefing",         type: "digest",    category: "Crisis"                    },
  // Alerts
  { id: "a1", name: "CEO Mention Alert",        type: "alert",     category: "Leadership", starred: true  },
  { id: "a2", name: "Negative Sentiment Alert", type: "alert",     category: "Brand"                     },
  // Reports
  { id: "r1", name: "Executive Visibility Report", type: "report", category: "Leadership", starred: true  },
  { id: "r2", name: "Brand Risk Assessment",    type: "report",    category: "Brand"                     },
];

const recentSearchQueries = ["Brand + Earnings Risk", "Competitor launch", "Crisis sentiment"];

// ── Recents shown when no query ───────────────────────────────────────────────
const RECENT_SECTIONS: Array<{ type: SearchResultType; items: string[] }> = [
  { type: "monitor",    items: ["Brand Stream", "Executive Radar"] },
  { type: "dashboard",  items: ["Quarterly Earnings", "Risk Monitor"] },
  { type: "newsletter", items: ["The Daily Media Brief"] },
  { type: "report",     items: ["Executive Visibility Report"] },
];

// ── Dimensions ────────────────────────────────────────────────────────────────
const TOTAL_W = 480;
const BTN_W   = 100;
const GAP     = 8;
const INPUT_W = TOTAL_W - BTN_W - GAP;

export const SearchBar = () => {
  const [mode, setMode]             = useState<"search" | "mira">("search");
  const [isOpen, setIsOpen]         = useState(false);
  const [query, setQuery]           = useState("");
  const [miraQuery, setMiraQuery]   = useState("");
  const [results, setResults]       = useState<SearchResult[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isPickerActive, setIsPickerActive] = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const miraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter results
  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const filtered = allAssets.filter(a =>
        a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      );
      setResults(filtered.slice(0, 10));
    } else {
      setResults([]);
    }
  }, [query]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchToMira = () => {
    setMode("mira");
    setIsOpen(false);
    setTimeout(() => miraInputRef.current?.focus(), 260);
  };

  const switchToSearch = () => {
    setMode("search");
    setTimeout(() => inputRef.current?.focus(), 260);
  };

  const showRecent    = isOpen && !query.trim();
  const showResults   = isOpen && query.trim().length > 0 && results.length > 0;
  const showNoResults = isOpen && query.trim().length > 0 && results.length === 0;

  const transition = "width 0.26s cubic-bezier(0.4, 0, 0.2, 1)";

  // Group search results by type for display
  const groupedResults: Partial<Record<SearchResultType, SearchResult[]>> = {};
  results.forEach(r => {
    if (!groupedResults[r.type]) groupedResults[r.type] = [];
    groupedResults[r.type]!.push(r);
  });

  return (
    <div ref={containerRef} style={{ position: "relative", zIndex: 50 }}>
      <div style={{ display: "flex", gap: GAP, alignItems: "center" }}>

        {/* ══ SEARCH SIDE ══════════════════════════════════════════════════════ */}
        <div style={{ width: mode === "search" ? INPUT_W : BTN_W, transition, overflow: "hidden", flexShrink: 0 }}>
          {mode === "search" ? (
            <div className="relative" style={{ width: INPUT_W }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className={cn(
                  "w-full pl-10 pr-8 h-10 text-sm outline-none transition-all duration-200",
                  isOpen ? "rounded-t-2xl rounded-b-none border-b-0 shadow-lg" : "rounded-full"
                )}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1.5px solid rgba(0,0,0,0.18)",
                  boxShadow: isOpen ? undefined : "0 1px 4px rgba(0,0,0,0.08)",
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={switchToSearch}
              className="h-10 flex items-center justify-center gap-1.5 rounded-full px-3 whitespace-nowrap text-[13px] font-semibold transition-all hover:opacity-90"
              style={{ width: BTN_W, backgroundColor: "#ffffff", border: "1.5px solid rgba(0,0,0,0.18)", color: "var(--foreground)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              Search
            </button>
          )}
        </div>

        {/* ══ MIRA SIDE ════════════════════════════════════════════════════════ */}
        <div style={{ width: mode === "mira" ? INPUT_W : BTN_W, transition, overflow: "hidden", flexShrink: 0 }}>
          {mode === "mira" ? (
            <div
              className="relative flex items-center h-10 rounded-full"
              style={{ width: INPUT_W, backgroundColor: "#ffffff", border: "1.5px solid rgba(0,0,0,0.18)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <Sparkles className="absolute left-3 w-4 h-4 flex-shrink-0 pointer-events-none" style={{ color: TEAL }} />
              <input
                ref={miraInputRef}
                type="text"
                placeholder="Ask Mira anything…"
                value={miraQuery}
                onChange={e => setMiraQuery(e.target.value)}
                className="flex-1 pl-9 pr-2 h-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                style={{ color: "var(--foreground)" }}
                onKeyDown={e => { if (e.key === "Escape") switchToSearch(); }}
              />
              {/* Dictation button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsListening(l => !l)}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-colors flex-shrink-0"
                    style={isListening
                      ? { color: TEAL }
                      : { color: "var(--muted-foreground)" }
                    }
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[9999] max-w-[200px] text-center leading-snug">
                  {isListening ? "Stop dictation" : "Dictate your message to Mira"}
                </TooltipContent>
              </Tooltip>

              {/* Element-picker button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsPickerActive(true)}
                    className="flex items-center justify-center w-8 h-8 mr-1 rounded-full transition-colors flex-shrink-0"
                    style={isPickerActive
                      ? { backgroundColor: TEAL_LIGHT, color: TEAL }
                      : { color: "var(--muted-foreground)" }
                    }
                  >
                    <svg width="26" height="26" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="2.5 2.5"/>
                      <path d="M6 5.5 L6 10.5 L7.8 8.9 L9.2 11.5 L10.2 11 L8.8 8.4 L11 8.4 Z" fill="currentColor" transform="scale(0.85) translate(1, 1)"/>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[9999] max-w-[200px] text-center leading-snug">
                  Draw a selection on the page to ask Mira about anything you see
                </TooltipContent>
              </Tooltip>

              <button
                className="flex items-center gap-1.5 mr-1.5 px-3 h-7 rounded-full text-white text-[12px] font-bold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #B627A1 0%, #00827F 100%)", border: "none" }}
              >
                Ask Mira
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={switchToMira}
              className="h-10 flex items-center justify-center gap-1.5 rounded-full px-3 whitespace-nowrap text-[13px] font-semibold text-white transition-all hover:opacity-80"
              style={{ width: BTN_W, background: "linear-gradient(135deg, #B627A1 0%, #00827F 100%)", border: "none" }}
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ffffff" }} />
              Ask Mira
            </button>
          )}
        </div>
      </div>

      {/* ── Search dropdown ───────────────────────────────────────────────────── */}
      {mode === "search" && isOpen && (
        <div
          className="absolute bg-background border border-t-0 border-border rounded-b-2xl shadow-lg overflow-hidden"
          style={{ top: "100%", left: 0, width: INPUT_W, zIndex: 50 }}
        >

          {/* ── RECENT STATE (no query) ── */}
          {showRecent && (
            <div className="py-2">

              {/* Recent search queries */}
              <div className="px-4 pt-1 pb-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Recent Searches</span>
              </div>
              {recentSearchQueries.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(s); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-[13px] text-foreground">{s}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="mx-4 my-2 border-t border-border/60" />

              {/* Sections grouped by app area */}
              {RECENT_SECTIONS.map(({ type, items }) => {
                const cfg = SECTION_CFG[type];
                const Icon = cfg.Icon;
                return (
                  <div key={type}>
                    {/* Section header — clicking navigates to the section */}
                    <div className="flex items-center justify-between px-4 pt-2 pb-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cfg.bg }}
                        >
                          <Icon className="w-2.5 h-2.5" style={{ color: cfg.color }} />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                          {cfg.label}
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-0.5 text-[10px] font-medium hover:opacity-70 transition-opacity"
                        style={{ color: cfg.color }}
                      >
                        View all
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Items in this section */}
                    {items.map(name => {
                      const asset = allAssets.find(a => a.name === name && a.type === type);
                      return (
                        <button
                          key={name}
                          onClick={() => { setQuery(name); setIsOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors text-left group"
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                          <span className="text-[13px] text-foreground flex-1 truncate">{name}</span>
                          {asset?.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── RESULTS STATE (query typed) ── */}
          {showResults && (
            <div className="py-2">
              {(Object.keys(groupedResults) as SearchResultType[]).map(type => {
                const cfg = SECTION_CFG[type];
                const Icon = cfg.Icon;
                const items = groupedResults[type]!;
                return (
                  <div key={type}>
                    <div className="flex items-center gap-1.5 px-4 pt-2 pb-1">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <Icon className="w-2.5 h-2.5" style={{ color: cfg.color }} />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {cfg.label}
                      </span>
                    </div>
                    {items.map(r => (
                      <button
                        key={r.id}
                        onClick={() => { setQuery(r.name); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cfg.color }} />
                        <span className="text-[13px] text-foreground flex-1 truncate">{r.name}</span>
                        {r.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          {r.category}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── NO RESULTS ── */}
          {showNoResults && (
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching across Monitor, Analyze, Newsletters, or Reports
              </p>
            </div>
          )}

          {/* ── Footer ── */}
          {(showRecent || showResults) && (
            <div className="border-t border-border px-4 py-2 flex items-center justify-between bg-muted/30">
              <span className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] mr-1">↑↓</kbd>
                to navigate
              </span>
              <span className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] mr-1">↵</kbd>
                to select
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Marquee selection overlay ── */}
      {isPickerActive && (
        <MarqueeSelector onClose={() => setIsPickerActive(false)} />
      )}
    </div>
  );
};
