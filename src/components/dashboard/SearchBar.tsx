import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Clock, LayoutGrid, FileText, Mail, Star, TrendingUp, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TEAL = "#00827F";
const TEAL_LIGHT = "rgba(0,130,127,0.08)";

type SearchResultType = "search" | "dashboard" | "report" | "newsletter";

interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  category: string;
  starred?: boolean;
}

const allAssets: SearchResult[] = [
  { id: "s1", name: "Brand + Earnings Risk", type: "search", category: "Brand", starred: true },
  { id: "s2", name: "Industry News Search", type: "search", category: "Industry" },
  { id: "s3", name: "Competitor Monitoring", type: "search", category: "Competition" },
  { id: "s4", name: "Brand Mentions", type: "search", category: "Brand", starred: true },
  { id: "s5", name: "Crisis Watch", type: "search", category: "Crisis" },
  { id: "s6", name: "Market Analysis", type: "search", category: "Market" },
  { id: "d1", name: "Quarterly Earnings", type: "dashboard", category: "Finance", starred: true },
  { id: "d2", name: "Public Affairs Monitor", type: "dashboard", category: "Policy" },
  { id: "d3", name: "Risk Monitor", type: "dashboard", category: "Risk", starred: true },
  { id: "d4", name: "Investor Sentiment", type: "dashboard", category: "Finance" },
  { id: "d5", name: "Sentiment Tracker", type: "dashboard", category: "Brand" },
  { id: "r1", name: "Executive Visibility Report", type: "report", category: "Leadership", starred: true },
  { id: "r2", name: "Daily Coverage Digest", type: "report", category: "Brand" },
  { id: "r3", name: "Brand Risk Assessment", type: "report", category: "Brand" },
  { id: "n1", name: "The Daily Media Brief", type: "newsletter", category: "Media", starred: true },
  { id: "n2", name: "The Brand Pulse", type: "newsletter", category: "Brand" },
  { id: "n3", name: "Morning Media Roundup", type: "newsletter", category: "Media" },
];

const recentSearches = ["Brand + Earnings Risk", "Competitor launch", "Crisis sentiment"];

const recentFiles: SearchResult[] = [
  { id: "d1", name: "Quarterly Earnings", type: "dashboard", category: "Finance", starred: true },
  { id: "r1", name: "Executive Visibility Report", type: "report", category: "Leadership", starred: true },
  { id: "n1", name: "The Daily Media Brief", type: "newsletter", category: "Media", starred: true },
];

const getIcon = (type: SearchResultType) => {
  switch (type) {
    case "search":      return <Search className="w-4 h-4" />;
    case "dashboard":   return <LayoutGrid className="w-4 h-4" />;
    case "report":      return <FileText className="w-4 h-4" />;
    case "newsletter":  return <Mail className="w-4 h-4" />;
  }
};

const getTypeLabel = (type: SearchResultType) => {
  switch (type) {
    case "search":      return "Search";
    case "dashboard":   return "Dashboard";
    case "report":      return "Report";
    case "newsletter":  return "Newsletter";
  }
};

// ── Dimensions ────────────────────────────────────────────────────────────────
const TOTAL_W  = 480;
const BTN_W    = 100; // collapsed side
const GAP      = 8;
const INPUT_W  = TOTAL_W - BTN_W - GAP;

export const SearchBar = () => {
  const [mode, setMode]           = useState<"search" | "mira">("search");
  const [isOpen, setIsOpen]       = useState(false);
  const [query, setQuery]         = useState("");
  const [miraQuery, setMiraQuery] = useState("");
  const [results, setResults]     = useState<SearchResult[]>([]);

  const inputRef      = useRef<HTMLInputElement>(null);
  const miraInputRef  = useRef<HTMLInputElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);

  // Filter results
  useEffect(() => {
    if (query.trim()) {
      const filtered = allAssets.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
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

  return (
    <div ref={containerRef} style={{ position: "relative", zIndex: 50 }}>
      <div style={{ display: "flex", gap: GAP, alignItems: "center" }}>

        {/* ══ SEARCH SIDE ══════════════════════════════════════════════════════ */}
        <div style={{
          width: mode === "search" ? INPUT_W : BTN_W,
          transition,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {mode === "search" ? (
            // ── Expanded search input ──
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
            // ── Collapsed search icon-button ──
            <button
              onClick={switchToSearch}
              className="h-10 flex items-center justify-center gap-1.5 rounded-full px-3 whitespace-nowrap text-[13px] font-semibold transition-all hover:opacity-90"
              style={{
                width: BTN_W,
                backgroundColor: "#ffffff",
                border: "1.5px solid rgba(0,0,0,0.18)",
                color: "var(--foreground)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              Search
            </button>
          )}
        </div>

        {/* ══ MIRA SIDE ════════════════════════════════════════════════════════ */}
        <div style={{
          width: mode === "mira" ? INPUT_W : BTN_W,
          transition,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {mode === "mira" ? (
            // ── Expanded Mira input — white with teal→purple gradient border ──
            <div
              className="relative flex items-center h-10 rounded-full"
              style={{
                width: INPUT_W,
                backgroundColor: "#ffffff",
                border: "1.5px solid rgba(0,0,0,0.18)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
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
              <button
                className="flex items-center gap-1.5 mr-1.5 px-3 h-7 rounded-full text-white text-[12px] font-bold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #B627A1 0%, #00827F 100%)", border: "none" }}
              >
                Ask Mira
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            // ── Collapsed Mira icon-button — light gradient fill ──
            <button
              onClick={switchToMira}
              className="h-10 flex items-center justify-center gap-1.5 rounded-full px-3 whitespace-nowrap text-[13px] font-semibold text-white transition-all hover:opacity-80"
              style={{
                width: BTN_W,
                background: "linear-gradient(135deg, #B627A1 0%, #00827F 100%)",
                border: "none",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ffffff" }} />
              Ask Mira
            </button>
          )}
        </div>
      </div>

      {/* ── Search dropdown (only in search mode) ──────────────────────────── */}
      {mode === "search" && isOpen && (
        <div
          className="absolute bg-background border border-t-0 border-border rounded-b-2xl shadow-lg overflow-hidden"
          style={{ top: "100%", left: 0, width: INPUT_W, zIndex: 50 }}
        >
          {showRecent && (
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Searches</span>
              </div>
              {recentSearches.map((s, i) => (
                <button key={i} onClick={() => { setQuery(s); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{s}</span>
                </button>
              ))}
              <div className="px-3 py-2 mt-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Files</span>
              </div>
              {recentFiles.map(f => (
                <button key={f.id} onClick={() => { setQuery(f.name); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left group">
                  <span className="text-muted-foreground">{getIcon(f.type)}</span>
                  <span className="text-sm text-foreground flex-1">{f.name}</span>
                  {f.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{getTypeLabel(f.type)}</span>
                </button>
              ))}
            </div>
          )}

          {showResults && (
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Results</span>
              </div>
              {results.map(r => (
                <button key={r.id} onClick={() => { setQuery(r.name); setIsOpen(false); }}
                  className="w-full grid grid-cols-[20px_1fr_20px_80px] items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-b-0">
                  <span className="text-muted-foreground">{getIcon(r.type)}</span>
                  <span className="text-sm text-foreground truncate">{r.name}</span>
                  <span className="flex justify-center">{r.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}</span>
                  <span className="text-xs text-muted-foreground text-right">{r.category}</span>
                </button>
              ))}
            </div>
          )}

          {showNoResults && (
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching for dashboards, reports, or newsletters</p>
            </div>
          )}

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
    </div>
  );
};
