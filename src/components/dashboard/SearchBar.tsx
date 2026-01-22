import { useState, useRef, useEffect } from "react";
import { Search, Clock, LayoutGrid, FileText, Mail, Star, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchResultType = "search" | "dashboard" | "report" | "newsletter";

interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  category: string;
  starred?: boolean;
}

// Sample data for autocomplete
const allAssets: SearchResult[] = [
  // Searches
  { id: "s1", name: "Brand + Earnings Risk", type: "search", category: "Brand", starred: true },
  { id: "s2", name: "Industry News Search", type: "search", category: "Industry" },
  { id: "s3", name: "Competitor Monitoring", type: "search", category: "Competition" },
  { id: "s4", name: "Brand Mentions", type: "search", category: "Brand", starred: true },
  { id: "s5", name: "Crisis Watch", type: "search", category: "Crisis" },
  { id: "s6", name: "Market Analysis", type: "search", category: "Market" },
  // Dashboards
  { id: "d1", name: "Quarterly Earnings", type: "dashboard", category: "Finance", starred: true },
  { id: "d2", name: "Public Affairs Monitor", type: "dashboard", category: "Policy" },
  { id: "d3", name: "Risk Monitor", type: "dashboard", category: "Risk", starred: true },
  { id: "d4", name: "Investor Sentiment", type: "dashboard", category: "Finance" },
  { id: "d5", name: "Sentiment Tracker", type: "dashboard", category: "Brand" },
  { id: "d6", name: "Global Coverage", type: "dashboard", category: "Crisis" },
  // Reports
  { id: "r1", name: "Executive Visibility Report", type: "report", category: "Leadership", starred: true },
  { id: "r2", name: "Daily Coverage Digest", type: "report", category: "Brand" },
  { id: "r3", name: "Brand Risk Assessment", type: "report", category: "Brand" },
  { id: "r4", name: "Narrative Shift Report", type: "report", category: "Brand" },
  // Newsletters
  { id: "n1", name: "The Daily Media Brief", type: "newsletter", category: "Media", starred: true },
  { id: "n2", name: "The Brand Pulse", type: "newsletter", category: "Brand" },
  { id: "n3", name: "Morning Media Roundup", type: "newsletter", category: "Media" },
];

const recentSearches = [
  "Brand + Earnings Risk",
  "Competitor launch",
  "Crisis sentiment",
];

const recentFiles: SearchResult[] = [
  { id: "d1", name: "Quarterly Earnings", type: "dashboard", category: "Finance", starred: true },
  { id: "r1", name: "Executive Visibility Report", type: "report", category: "Leadership", starred: true },
  { id: "n1", name: "The Daily Media Brief", type: "newsletter", category: "Media", starred: true },
];

const getIcon = (type: SearchResultType) => {
  switch (type) {
    case "search":
      return <Search className="w-4 h-4" />;
    case "dashboard":
      return <LayoutGrid className="w-4 h-4" />;
    case "report":
      return <FileText className="w-4 h-4" />;
    case "newsletter":
      return <Mail className="w-4 h-4" />;
  }
};

const getTypeLabel = (type: SearchResultType) => {
  switch (type) {
    case "search":
      return "Search";
    case "dashboard":
      return "Dashboard";
    case "report":
      return "Report";
    case "newsletter":
      return "Newsletter";
  }
};

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter results based on query
  useEffect(() => {
    if (query.trim()) {
      const filtered = allAssets.filter(asset =>
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setIsOpen(false);
  };

  const showRecent = isOpen && !query.trim();
  const showResults = isOpen && query.trim() && results.length > 0;
  const showNoResults = isOpen && query.trim() && results.length === 0;

  return (
    <div ref={containerRef} className="relative w-80 flex-shrink-0 z-50">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        className={cn(
          "pl-10 pr-8 bg-background border-border h-10 transition-all duration-200",
          isOpen ? "rounded-t-2xl rounded-b-none border-b-0 shadow-lg" : "rounded-full"
        )}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border border-t-0 border-border rounded-b-2xl shadow-lg overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150">
          {/* Recent searches - shown when no query */}
          {showRecent && (
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Searches</span>
              </div>
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{search}</span>
                </button>
              ))}

              <div className="px-3 py-2 mt-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Files</span>
              </div>
              {recentFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleSelect(file.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                >
                  <span className="text-muted-foreground">{getIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground">{file.name}</span>
                  </div>
                  {file.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {getTypeLabel(file.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search results */}
          {showResults && (
            <div className="p-2">
              <div className="px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Results</span>
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                >
                  <span className="text-muted-foreground">{getIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground">{result.name}</span>
                  </div>
                  {result.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  <span className="text-xs text-muted-foreground">
                    {result.category}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {getTypeLabel(result.type)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching for dashboards, reports, or newsletters</p>
            </div>
          )}

          {/* Quick actions footer */}
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
