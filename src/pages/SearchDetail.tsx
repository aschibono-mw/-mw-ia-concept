import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  ArrowLeft, ChevronDown, RefreshCw, Download, Bell, Share2,
  Save, Search, Sparkles, TrendingUp, TrendingDown, MoreHorizontal,
  AlignLeft, AlignCenter, AlignRight, LayoutGrid, List,
  Calendar, Type, Network,
} from "lucide-react";

const TEAL = "#00827F";

const ARTICLES = [
  {
    id: 1,
    source: "Journalist Bulletin",
    flag: "CA",
    date: "May 29, 6:51 AM",
    reach: "5.09k",
    views: "3 Views",
    sentiment: "Neutral",
    similar: "9 Similar",
    ave: "$47.1 AVE",
    headline: "The Week in Canadian Press Releases: 10 Stories You Need to See",
    summary: "emyCase Communications, Cision PR and Cision Insights. To learn more, visit www.cision.ca and follow @CisionCA on Twitter. SOURCE Cision",
    tags: ["Cision", "Communications", "Cloud"],
  },
  {
    id: 2,
    source: "Yahoo Finance",
    flag: "US",
    date: "May 29, 6:48 AM",
    reach: "42.5M",
    views: "1 View",
    sentiment: "Neutral",
    similar: "4 Similar",
    ave: "$1.2M AVE",
    headline: "NetCarrier Appoints Doug Derstine as President and Chief Executive Officer",
    summary: "emyCarrier Communications, Cision and Cloud Insights. To learn more, visit www.cision.ca and follow @CisionCA on Twitter. SOURCE Cision. Communications, managed services, cloud infrastructure.",
    tags: ["Cision", "Cloud"],
  },
  {
    id: 3,
    source: "PR Newswire",
    flag: "US",
    date: "May 28, 4:12 PM",
    reach: "18.3M",
    views: "2 Views",
    sentiment: "Positive",
    similar: "6 Similar",
    ave: "$890k AVE",
    headline: "Bandwidth Inc. to Participate in TD Cowen Inaugural Disruptive Technology Summit",
    summary: "Bandwidth will present its business at the TD Cowen Disruptive Technology Summit in New York City on June 17, 2026.",
    tags: ["Communications", "Cloud"],
  },
  {
    id: 4,
    source: "Globe Newswire",
    flag: "CA",
    date: "May 28, 1:30 PM",
    reach: "3.2M",
    views: "1 View",
    sentiment: "Neutral",
    similar: "2 Similar",
    ave: "$210k AVE",
    headline: "Cision Releases Q1 2026 Media Intelligence Report",
    summary: "The report highlights key trends in earned media, PR technology adoption, and AI-driven communications across North America.",
    tags: ["Cision", "Cloud", "Communications"],
  },
  {
    id: 5,
    source: "TechCrunch",
    flag: "US",
    date: "May 27, 9:00 AM",
    reach: "8.7M",
    views: "5 Views",
    sentiment: "Positive",
    similar: "11 Similar",
    ave: "$530k AVE",
    headline: "How AI is Reshaping the $10B PR Software Market",
    summary: "Platforms like Cision, Meltwater, and Brandwatch are racing to embed generative AI into their core workflows.",
    tags: ["Cision", "Communications"],
  },
];

const CLUSTERS = [
  { rank: 1, text: "Entrepreneur, author, management thinker, and filmmaker explores self-awareness, purpose-led leadership, and transformative management at an exclusive Anand Rathi Wealth gathering", mentions: 2 },
  { rank: 2, text: "NetCarrier Announces the Appointment of Doug Derstine as President and Chief Executive Officer, effective May 18, 2026", mentions: 2 },
  { rank: 3, text: "Bandwidth Inc. to Participate in the TD Cowen Inaugural Disruptive Technology Summit in New York City on June 17, 2026", mentions: 1 },
];

const KEYWORDS = [
  { word: "press release headlines", size: "text-3xl", color: "#1a1a2e" },
  { word: "the week", size: "text-4xl", color: "#1a1a2e" },
  { word: "cision", size: "text-3xl", color: "#4F6AF5" },
  { word: "artist", size: "text-2xl", color: "#00827F" },
  { word: "clarenville", size: "text-2xl", color: "#e86c5a" },
  { word: "brandwatch", size: "text-2xl", color: "#1a1a2e" },
  { word: "emea", size: "text-2xl", color: "#00827F" },
  { word: "releases", size: "text-2xl", color: "#4F6AF5" },
  { word: "apac", size: "text-xl", color: "#00827F" },
  { word: "cnw", size: "text-xl", color: "#e86c5a" },
  { word: "anand rathi", size: "text-xl", color: "#1a1a2e" },
  { word: "tims", size: "text-lg", color: "#4F6AF5" },
  { word: "thousands of press", size: "text-2xl", color: "#1a1a2e" },
];

const SOURCES = [
  { rank: 1, name: "Chase", domain: "chase.com", flag: "US", reach: "49.6M", articles: 1 },
  { rank: 2, name: "Yahoo Finance", domain: "finance.yahoo.com", flag: "US", reach: "42.5M", articles: 1 },
  { rank: 3, name: "The Associated Press", domain: "getapnobile.com", flag: "US", reach: "32.1M", articles: 1 },
  { rank: 4, name: "Yahoo News UK", domain: "uk.news.yahoo.com", flag: "GB", reach: "1.56M", articles: 2 },
  { rank: 5, name: "Racine County Eye", domain: "racinecountyeye.com", flag: "US", reach: "63.6K", articles: 1 },
];

const TABS = ["Overview", "Analytics", "Topic Analysis", "X Insights", "Authors", "Media Contacts"];

export default function SearchDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const searchName = decodeURIComponent(name || "Search");
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activePage="discover" />
      <Header />

      <main className="ml-52 pt-16">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            {/* Breadcrumb with back arrow */}
            <div className="flex items-center gap-1 text-sm">
              <button
                onClick={() => navigate("/search")}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/search")} className="text-muted-foreground hover:text-foreground">
                ..
              </button>
              <span className="text-muted-foreground">/</span>
              <button onClick={() => navigate("/search")} className="text-muted-foreground hover:text-foreground">
                American Competitors
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-foreground">{searchName}</span>
            </div>

            {/* Date picker */}
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:bg-muted">
              <Calendar className="w-3.5 h-3.5" />
              Last 7 days
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {/* Typography / Aa */}
            <button className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:bg-muted font-medium">
              Aa
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Brand analysis */}
            <button className="flex items-center gap-1.5 text-sm border border-border rounded-md px-2.5 py-1.5 hover:bg-muted" style={{ color: TEAL }}>
              <Network className="w-3.5 h-3.5" />
              Brand analysis
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Download className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Bell className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><Share2 className="w-4 h-4" /></button>
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-1.5 rounded"
              style={{ backgroundColor: TEAL }}
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>

        {/* ── Query bar ── */}
        <div className="px-4 py-2 border-b border-border bg-white flex items-center gap-2 flex-wrap text-xs text-muted-foreground font-mono">
          <span className="text-foreground">
            "{searchName}" AND ("Communication" NEAR/2 "Cloud") NOT ("honorable" or "Brookings" or "This information was brought to you by Cision")
          </span>
          <span className="ml-auto text-muted-foreground">Ctrl + Enter to update results</span>
          <button
            className="text-white text-sm font-semibold px-4 py-1.5 rounded"
            style={{ backgroundColor: TEAL }}
          >
            Search
          </button>
        </div>

        {/* ── Filter bar ── */}
        <div className="px-4 py-2 border-b border-border bg-white flex items-center gap-2 flex-wrap">
          {["All Filters", "Saved Filter Sets", "Source Type", "Location", "Language", "Custom Categories"].map((f, i) => (
            <button key={f} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${i === 0 ? "border-border bg-foreground text-background" : "border-border hover:bg-muted text-foreground"}`}>
              {f} {i > 0 && <ChevronDown className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* ── Tab bar ── */}
        <div className="px-4 border-b border-border bg-white flex items-center gap-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 py-2">
            <button className="p-1.5 rounded hover:bg-muted"><List className="w-4 h-4 text-muted-foreground" /></button>
            <button className="p-1.5 rounded hover:bg-muted"><LayoutGrid className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>

        {/* ── Body: split layout ── */}
        <div className="flex h-[calc(100vh-220px)]">

          {/* Left: article list */}
          <div className="w-72 flex-shrink-0 border-r border-border overflow-y-auto bg-white">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-white">
              <span className="text-xs font-semibold text-foreground">15 results</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-muted rounded"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                <button className="p-1 hover:bg-muted rounded"><LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <button className="flex items-center gap-1 text-xs font-medium">Date <ChevronDown className="w-3 h-3" /></button>
            </div>
            <div className="divide-y divide-border">
              {ARTICLES.map(article => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article.id)}
                  className={`px-3 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedArticle === article.id ? "bg-teal-50/50 border-l-2 border-teal-500" : ""}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">{article.source}</span>
                    <span className="text-[10px] text-muted-foreground">{article.flag}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{article.date}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-snug mb-1.5 line-clamp-2">{article.headline}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mb-2">{article.summary}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">{article.reach} Reach</span>
                    <span className="text-[10px] text-muted-foreground">· {article.views}</span>
                    <span className="text-[10px] text-muted-foreground">· {article.sentiment}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{article.similar}</span>
                    <span className="text-[10px] text-muted-foreground mx-1">·</span>
                    <span className="text-[10px] text-muted-foreground">{article.ave}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: analytics */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-5 space-y-4">

              {/* AI Insight */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: TEAL }} />
                  <span className="text-sm font-semibold text-foreground">AI-Powered Insight</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {searchName} and NetCarrier highlight telecom execution and market positioning
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
                  <li>Bandwidth is using investor events to present its business at the TD Cowen Disruptive Technology Summit.</li>
                  <li>NetCarrier Communications announced Doug Derstine as president and chief executive officer, signaling a leadership transition at the company.</li>
                  <li>These items center on corporate positioning rather than product launches or financial results.</li>
                </ul>
                <button className="text-xs mt-3 font-medium hover:underline" style={{ color: TEAL }}>More Insights</button>
              </div>

              {/* KPIs */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-foreground">News KPIs</span>
                  <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Reach", value: "213M", change: "+142%", up: true },
                    { label: "Social Echo", value: "0", change: "+100%", up: true },
                    { label: "AVE", value: "1.97M", change: "+142%", up: true },
                  ].map(kpi => (
                    <div key={kpi.label}>
                      <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                      <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                      <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                        {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {kpi.change}
                        <span className="text-muted-foreground font-normal ml-1">vs prev period</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentions Trend */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Mentions Trend</span>
                  <div className="flex items-center gap-2">
                    <button className="text-xs border border-border rounded px-2 py-0.5 flex items-center gap-1">Prediction <ChevronDown className="w-3 h-3" /></button>
                    <button className="text-xs border border-border rounded px-2 py-0.5 flex items-center gap-1">Daily <ChevronDown className="w-3 h-3" /></button>
                    <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                  </div>
                </div>
                <div className="flex gap-6 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Mentions</p>
                    <p className="text-xl font-bold text-foreground">15</p>
                    <p className="text-xs text-green-600 font-medium">↑ 85.4% <span className="text-muted-foreground font-normal">previous period 103</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Average</p>
                    <p className="text-xl font-bold text-foreground">2</p>
                    <p className="text-xs text-green-600 font-medium">↑ 85.4% <span className="text-muted-foreground font-normal">previous period 14</span></p>
                  </div>
                </div>
                {/* Simple bar chart */}
                <div className="flex items-end gap-1 h-16 border-b border-border pb-1">
                  {[2, 1, 3, 4, 2, 8, 15].map((v, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / 15) * 100}%`, backgroundColor: i === 6 ? TEAL : "rgba(0,130,127,0.25)" }} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  {["May 23", "May 24", "May 25", "May 26", "May 27", "May 28", "May 29"].map(d => <span key={d}>{d}</span>)}
                </div>
              </div>

              {/* Clusters */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" style={{ color: TEAL }} />
                    <span className="text-sm font-semibold text-foreground">AI-Powered Clusters</span>
                  </div>
                  <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground uppercase mb-2">
                  <span>Clusters</span><span>Mentions</span>
                </div>
                <div className="space-y-2">
                  {CLUSTERS.map(c => (
                    <div key={c.rank} className="flex items-start gap-3 py-1.5 border-t border-border">
                      <span className="text-xs text-muted-foreground w-3 flex-shrink-0 mt-0.5">{c.rank}</span>
                      <p className="text-xs text-foreground flex-1 leading-relaxed">{c.text}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{c.mentions}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Top Keywords & Entities</span>
                  <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 leading-loose">
                  {KEYWORDS.map(k => (
                    <span key={k.word} className={`${k.size} font-bold cursor-pointer hover:opacity-80`} style={{ color: k.color }}>
                      {k.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Locations + Sentiment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Locations</span>
                    <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { country: "United States", flag: "🇺🇸", count: 8, pct: 80 },
                      { country: "Canada", flag: "🇨🇦", count: 4, pct: 40 },
                      { country: "United Kingdom", flag: "🇬🇧", count: 2, pct: 20 },
                      { country: "Mexico", flag: "🇲🇽", count: 1, pct: 10 },
                    ].map(loc => (
                      <div key={loc.country} className="flex items-center gap-2">
                        <span className="text-xs w-3">{loc.flag}</span>
                        <span className="text-xs text-foreground w-24 truncate">{loc.country}</span>
                        <div className="flex-1 h-3 bg-muted rounded-sm overflow-hidden">
                          <div className="h-full rounded-sm" style={{ width: `${loc.pct}%`, backgroundColor: "#f59e0b" }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-4">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Sentiment</span>
                    <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#6b7280" strokeWidth="4"
                          strokeDasharray="58.6 29.4" strokeLinecap="round" />
                        <circle cx="18" cy="18" r="14" fill="none" stroke={TEAL} strokeWidth="4"
                          strokeDasharray="5.8 82.2" strokeDashoffset="-58.6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500 flex-shrink-0" />
                        <span className="text-foreground">Neutral</span>
                        <span className="text-muted-foreground ml-auto">14 · 93.3%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: TEAL }} />
                        <span className="text-foreground">Positive</span>
                        <span className="text-muted-foreground ml-auto">1 · 6.67%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">News Sources by Reach</span>
                  <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left pb-2 font-medium w-6">#</th>
                      <th className="text-left pb-2 font-medium">Sources</th>
                      <th className="text-right pb-2 font-medium">Reach</th>
                      <th className="text-right pb-2 font-medium">Articles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SOURCES.map(s => (
                      <tr key={s.rank}>
                        <td className="py-2 text-muted-foreground">{s.rank}</td>
                        <td className="py-2">
                          <div className="font-medium text-foreground">{s.name}</div>
                          <div className="text-muted-foreground">{s.flag} · {s.domain}</div>
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-muted rounded-sm overflow-hidden">
                              <div className="h-full rounded-sm" style={{ width: `${Math.min((parseFloat(s.reach) / 50) * 100, 100)}%`, backgroundColor: TEAL }} />
                            </div>
                            <span>{s.reach}</span>
                          </div>
                        </td>
                        <td className="py-2 text-right text-muted-foreground">{s.articles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">1–5 of 12 <span className="ml-2 cursor-pointer hover:text-foreground">›</span></p>
              </div>

              {/* Journalists */}
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Journalists by Reach</span>
                  <button className="text-xs font-medium hover:underline" style={{ color: TEAL }}>View Full Analysis</button>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                  <LayoutGrid className="w-10 h-10 opacity-20" />
                  <p className="text-sm">No Data</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
