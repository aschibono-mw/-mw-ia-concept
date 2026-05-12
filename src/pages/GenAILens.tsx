import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Copy,
  Info, Download, SlidersHorizontal, LayoutGrid, Search,
  MapPin, Sparkles, Plus, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Tiny sparkline SVG ──────────────────────────────────────────────────────
const Sparkline = ({ points, color, fill }: { points: string; color: string; fill: string }) => (
  <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`fill-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
      </linearGradient>
    </defs>
    <path d={fill} fill={`url(#fill-${color.replace("#","")})`} />
    <path d={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── AI Model icons ──────────────────────────────────────────────────────────
const ModelIcon = ({ type }: { type: string }) => {
  const icons: Record<string, JSX.Element> = {
    claude: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <circle cx="16" cy="16" r="15" fill="#CC785C" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line key={i} x1="16" y1="16"
            x2={16 + 9 * Math.cos((deg * Math.PI) / 180)}
            y2={16 + 9 * Math.sin((deg * Math.PI) / 180)}
            stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        ))}
      </svg>
    ),
    openai: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <circle cx="16" cy="16" r="15" fill="#10A37F" />
        <path d="M16 8 C20 8 24 12 24 16 C24 20 20 24 16 24 C12 24 8 20 8 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 8 C12 8 8 12 8 16 C8 20 12 24 16 24 C20 24 24 20 24 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    gemini: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <defs>
          <linearGradient id="gem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#gem-grad)" />
        <path d="M16 6 C16 6 20 16 16 26 C12 16 16 6 16 6Z" fill="white" opacity="0.9" />
        <path d="M6 16 C6 16 16 12 26 16 C16 20 6 16 6 16Z" fill="white" opacity="0.6" />
      </svg>
    ),
    perplexity: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <circle cx="16" cy="16" r="15" fill="#20808D" />
        <polygon points="16,7 19,13 26,13 21,18 23,25 16,20 9,25 11,18 6,13 13,13" fill="white" opacity="0.9" />
      </svg>
    ),
    copilot: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <defs>
          <linearGradient id="cop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BCF2" />
            <stop offset="50%" stopColor="#8661C5" />
            <stop offset="100%" stopColor="#F25022" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#cop-grad)" />
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.9" />
        <circle cx="16" cy="16" r="3" fill="url(#cop-grad)" />
      </svg>
    ),
  };
  return icons[type] || icons.claude;
};

// ── Sentiment face ──────────────────────────────────────────────────────────
const SentimentFace = ({ type }: { type: "positive" | "neutral" | "negative" }) => {
  const color = type === "positive" ? "#F59E0B" : type === "neutral" ? "#94A3B8" : "#EF4444";
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0">
      <circle cx="12" cy="12" r="11" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill={color} />
      <circle cx="15" cy="10" r="1.5" fill={color} />
      {type === "positive" && <path d="M8 14 Q12 18 16 14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />}
      {type === "neutral"  && <path d="M8 14 H16"          fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />}
      {type === "negative" && <path d="M8 16 Q12 12 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  );
};

// ── Tag chip ────────────────────────────────────────────────────────────────
const Tag = ({ label, variant = "default" }: { label: string; variant?: "default" | "brand" | "product" }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap";
  const styles = {
    default: "bg-muted text-foreground border border-border",
    brand:   "bg-blue-50 text-blue-700 border border-blue-200",
    product: "bg-green-50 text-green-700 border border-green-200",
  };
  return <span className={`${base} ${styles[variant]}`}>{label}</span>;
};

// ── Mock results data ───────────────────────────────────────────────────────
const results = [
  {
    model: "claude", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["community", "human experience", "classes", "emphasizes connection"], extraPhrases: 19,
    brands: ["Othership"], extraBrands: 0,
    products: ["Robbie Bent"], extraProducts: 0,
    links: ["Robbie Bent - Insider..."], extraLinks: 0,
  },
  {
    model: "openai", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["alternative", "social wellness", "guided emotional breathwork sessions", "tech workers"], extraPhrases: 23,
    brands: ["Othership"], extraBrands: 0,
    products: [], extraProducts: 0,
    links: ["is @othership...", "Othership: the...", "Othership's Jo..."], extraLinks: 16,
  },
  {
    model: "gemini", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["market", "community", "hybrid work", "experiences"], extraPhrases: 31,
    brands: ["Othership", "Triblcoo", "NSpace", "OfficeSpace"], extraBrands: 1,
    products: ["Workplace Management Platform", "Immersive Wellness Bathhouse"], extraProducts: 0,
    links: ["Othership Rev...", "Othership | Im..."], extraLinks: 5,
  },
  {
    model: "openai", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["community", "remote workers", "trend", "quality"], extraPhrases: 20,
    brands: ["Othership", "WeWork"], extraBrands: 0,
    products: [], extraProducts: 0,
    links: ["www.othershi...", "www.forbes.c...", "www.crunchb..."], extraLinks: 1,
  },
  {
    model: "openai", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "neutral" as const,
    keyPhrases: ["experience", "expansion", "growth", "breathwork app"], extraPhrases: 50,
    brands: ["Othership", "ZenaTech", "NHS", "Othership Limited"], extraBrands: 10,
    products: ["breathwork app", "Workplace Manager", "Workplace Scheduler"], extraProducts: 0,
    links: ["Othership | W...", "www.sec.gov...", "ZenaTech Cor..."], extraLinks: 8,
  },
  {
    model: "perplexity", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["self", "market", "wellness experience", "contrast therapy"], extraPhrases: 25,
    brands: ["Othership"], extraBrands: 0,
    products: [], extraProducts: 0,
    links: ["othership.us", "myfamilyphoto...", "davidwilliamro..."], extraLinks: 8,
  },
  {
    model: "claude", prompt: "Brand Snapshot", promptDesc: "Tell me about Othership. How do people generally...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["wellness", "information", "experience", "search results"], extraPhrases: 9,
    brands: ["Othership", "Headspace", "SoulCycle", "Daybreaker"], extraBrands: 2,
    products: ["immersive sauna and ice bath wellness", "Emily Bent", "Robbie Bent", "Shawn M..."], extraProducts: 0,
    links: ["Othership 202...", "Comparing Co..."], extraLinks: 2,
  },
  {
    model: "claude", prompt: "Brand Snapshot", promptDesc: "Tell me about Yelp. How do people generally per...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["million", "advertising marketplace", "advertising products", "auto services"], extraPhrases: 22,
    brands: ["Yelp"], extraBrands: 0,
    products: [], extraProducts: 0,
    links: ["Yelp Inc. – Inv...", "Yelp (NYSE:YL...", "Yelp: Food, Se..."], extraLinks: 3,
  },
  {
    model: "openai", prompt: "Brand Snapshot", promptDesc: "Tell me about Yelp. How do people generally per...",
    date: "05/12/2026", sentiment: "neutral" as const,
    keyPhrases: ["users", "home services", "model", "restaurant losses"], extraPhrases: 19,
    brands: ["Yelp", "Google", "OpenAI", "Amazon"], extraBrands: 5,
    products: ["Yelp Assistant", "Hatch", "Apple Maps", "Bing"], extraProducts: 1,
    links: ["Yelp Delivers I...", "Is Yelp Still Re...", "Yelp Vs. Goog..."], extraLinks: 8,
  },
  {
    model: "gemini", prompt: "Brand Snapshot", promptDesc: "Tell me about Yelp. How do people generally per...",
    date: "05/12/2026", sentiment: "positive" as const,
    keyPhrases: ["user", "review platform", "million", "services"], extraPhrases: 29,
    brands: ["Yelp"], extraBrands: 0,
    products: [], extraProducts: 0,
    links: ["40+ Yelp Stati...", "78 Yelp Statis...", "Yelp – Wikipe..."], extraLinks: 8,
  },
];

// ── KPI metric cards data ───────────────────────────────────────────────────
const kpiCards = [
  {
    label: "Visibility Score", value: "8%", change: "→ 0", changeType: "neutral",
    prev: "Previous period 8%", color: "#3B82F6",
    path: "M0,28 C10,26 20,20 30,22 C40,24 50,18 60,20 C70,22 80,16 90,18 C100,20 110,15 120,17",
    fill: "M0,28 C10,26 20,20 30,22 C40,24 50,18 60,20 C70,22 80,16 90,18 C100,20 110,15 120,17 L120,40 L0,40Z",
  },
  {
    label: "Mention Rate", value: "2%", change: "↓ 33.3%", changeType: "negative",
    prev: "Previous period 3%", color: "#F97316",
    path: "M0,18 C10,20 20,24 30,22 C40,20 50,26 60,24 C70,22 80,28 90,26 C100,24 110,30 120,28",
    fill: "M0,18 C10,20 20,24 30,22 C40,20 50,26 60,24 C70,22 80,28 90,26 C100,24 110,30 120,28 L120,40 L0,40Z",
  },
  {
    label: "Total Mentions", value: "162", change: "↓ 21%", changeType: "negative",
    prev: "Previous period 205", color: "#8B5CF6",
    path: "M0,22 C10,20 20,18 30,16 C40,14 50,20 60,18 C70,16 80,22 90,20 C100,18 110,24 120,22",
    fill: "M0,22 C10,20 20,18 30,16 C40,14 50,20 60,18 C70,16 80,22 90,20 C100,18 110,24 120,22 L120,40 L0,40Z",
  },
  {
    label: "Sentiment Score", value: "51%", change: "→ 0", changeType: "neutral",
    prev: "Previous period 51%", color: "#22C55E",
    path: "M0,20 C10,22 20,18 30,20 C40,22 50,18 60,20 C70,22 80,18 90,20 C100,22 110,18 120,20",
    fill: "M0,20 C10,22 20,18 30,20 C40,22 50,18 60,20 C70,22 80,18 90,20 C100,22 110,18 120,20 L120,40 L0,40Z",
  },
];

const TABS = ["Overview", "Trends", "Benchmarking", "Sentiment", "Sources", "Prompt"];

// ── Main page ───────────────────────────────────────────────────────────────
const GenAILens = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [insightExpanded, setInsightExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("All");
  const [selectedPrompt, setSelectedPrompt] = useState("100");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="genai-lens" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-5">

          {/* ── Filter bar ── */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Date range */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 7h14" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Last 7 days
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Brand / Amazon */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <span className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">A</span>
              </span>
              Amazon
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Model */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="8" cy="2" r="1.5" fill="currentColor" opacity="0.5"/>
                <circle cx="8" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
                <circle cx="2" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>
                <circle cx="14" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>
              </svg>
              Model All
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Prompt */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Prompt (100)
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Labels */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h5l7 7-5 5-7-7V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <circle cx="5.5" cy="5.5" r="1" fill="currentColor"/>
              </svg>
              Labels
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Target Country */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Target Country
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <div className="flex-1" />

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-sm border-dashed text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-3.5 h-3.5" />
              Create a prompt
            </Button>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex items-center border-b border-border mb-5 gap-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  activeTab === tab
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="px-3 py-2.5 text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── Overview tab content ── */}
          {activeTab === "Overview" && (
            <>
              {/* AI Insights panel */}
              <div className="rounded-xl border mb-5 overflow-hidden" style={{
                borderColor: "transparent",
                background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #7C3AED, #06B6D4, #8B5CF6) border-box",
                border: "1.5px solid transparent",
              }}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-foreground">AI Insights</span>
                  </div>
                  <ul className="space-y-1.5 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground mt-2 flex-shrink-0" />
                      <span><strong>AI</strong> and <strong>users</strong> saw unexpected spikes in coverage late in the period.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground mt-2 flex-shrink-0" />
                      <span>Overall sentiment remained neutral throughout the coverage window.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground mt-2 flex-shrink-0" />
                      <span>Coverage was diverse, with no single outlet dominating.</span>
                    </li>
                    {insightExpanded && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-foreground mt-2 flex-shrink-0" />
                          <span>Brand Snapshot prompts accounted for the majority of LLM responses this period.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-foreground mt-2 flex-shrink-0" />
                          <span>Othership and Yelp were the most frequently referenced brands across all models.</span>
                        </li>
                      </>
                    )}
                  </ul>
                  <button
                    onClick={() => setInsightExpanded(!insightExpanded)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-sm text-muted-foreground hover:text-foreground border-t border-border/50 transition-colors"
                  >
                    {insightExpanded ? "Show less" : "Show more"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${insightExpanded ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border-t border-border/30">
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-4 gap-4 mb-5">
                {kpiCards.map((kpi) => (
                  <div key={kpi.label} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm text-muted-foreground">{kpi.label}</span>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex items-end gap-3 mb-1">
                      <span className="text-3xl font-bold text-foreground">{kpi.value}</span>
                      <span className={`text-sm font-medium mb-1 ${
                        kpi.changeType === "negative" ? "text-red-500" :
                        kpi.changeType === "positive" ? "text-green-500" :
                        "text-muted-foreground"
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{kpi.prev}</p>
                    <Sparkline points={kpi.path} fill={kpi.fill} color={kpi.color} />
                  </div>
                ))}
              </div>

              {/* Results table */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Table toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      Results for Last 7 days (4852 results)
                    </span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-sm hover:bg-muted transition-colors">
                      <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                      All Mentions
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        className="pl-8 pr-3 py-1.5 text-sm border border-border rounded bg-card w-40 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Find"
                      />
                    </div>
                    <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-left">
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-12">Model</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-52">Prompt</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Date</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">Sentiment</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Key phrases</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Organizations/Brands</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Products/People</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Links</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors group">
                          {/* Model */}
                          <td className="px-4 py-3">
                            <ModelIcon type={row.model} />
                          </td>
                          {/* Prompt */}
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground text-sm">{row.prompt}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">{row.promptDesc}</p>
                          </td>
                          {/* Date */}
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{row.date}</td>
                          {/* Sentiment */}
                          <td className="px-4 py-3">
                            <SentimentFace type={row.sentiment} />
                          </td>
                          {/* Key phrases */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {row.keyPhrases.slice(0, 3).map((p) => (
                                <Tag key={p} label={p} />
                              ))}
                              {row.extraPhrases > 0 && (
                                <span className="text-xs font-medium text-primary cursor-pointer">+{row.extraPhrases}</span>
                              )}
                            </div>
                          </td>
                          {/* Organizations / Brands */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {row.brands.slice(0, 2).map((b) => (
                                <Tag key={b} label={b} variant="brand" />
                              ))}
                              {(row.brands.length > 2 || row.extraBrands > 0) && (
                                <span className="text-xs font-medium text-primary cursor-pointer">+{row.extraBrands || row.brands.length - 2}</span>
                              )}
                            </div>
                          </td>
                          {/* Products / People */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {row.products.slice(0, 1).map((p) => (
                                <Tag key={p} label={p} variant="product" />
                              ))}
                              {row.extraProducts > 0 && (
                                <span className="text-xs font-medium text-primary cursor-pointer">+{row.extraProducts}</span>
                              )}
                            </div>
                          </td>
                          {/* Links */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5 max-w-[160px]">
                              {row.links.slice(0, 2).map((l) => (
                                <a key={l} href="#" className="text-xs text-primary hover:underline truncate block">{l}</a>
                              ))}
                              {row.extraLinks > 0 && (
                                <span className="text-xs font-medium text-primary cursor-pointer">+{row.extraLinks}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-2.5 border-t border-border flex items-center justify-end gap-3">
                  <span className="text-xs text-muted-foreground">1–10 of 4852</span>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Placeholder tabs ── */}
          {activeTab !== "Overview" && (
            <div className="bg-card border border-border rounded-lg p-16 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{activeTab} view coming soon.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default GenAILens;
