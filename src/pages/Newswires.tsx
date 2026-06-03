import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Plus, ChevronDown, Radio, FileText, ExternalLink, MoreVertical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEAL = "#00827F";

type ReleaseStatus = "Published" | "Draft" | "Scheduled";

interface PressRelease {
  id: string;
  title: string;
  status: ReleaseStatus;
  date: string;
  wire: string;
}

const RELEASES: PressRelease[] = [
  { id: "1", title: "Meltwater Announces Record Q2 2026 Results",      status: "Published",  date: "Jun 2, 2026",  wire: "PR Newswire" },
  { id: "2", title: "Meltwater Expands AI-Powered Media Intelligence Platform", status: "Published", date: "May 20, 2026", wire: "Business Wire" },
  { id: "3", title: "Meltwater Partners with Leading ESG Data Providers", status: "Scheduled", date: "Jun 10, 2026", wire: "GlobeNewswire" },
  { id: "4", title: "Q3 Investor Day Preview",                          status: "Draft",      date: "—",            wire: "—" },
];

const STATUS_STYLES: Record<ReleaseStatus, string> = {
  Published:  "bg-green-100 text-green-700",
  Scheduled:  "bg-blue-100 text-blue-700",
  Draft:      "bg-gray-100 text-gray-600",
};

const FILTER_OPTIONS = ["All Press Releases", "Published", "Scheduled", "Drafts"];

const Newswires = () => {
  const [filter, setFilter] = useState("All Press Releases");
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = RELEASES.filter((r) => {
    if (filter === "All Press Releases") return true;
    if (filter === "Drafts") return r.status === "Draft";
    return r.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="newswires" />
      <Header />

      <main className="ml-52 pt-16 bg-white" style={{ minHeight: "100vh" }}>
        <div className="px-8 pt-8 pb-10" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="rounded-[28px] px-8 pt-6 pb-8" style={{ backgroundColor: "#F2F5F5", minHeight: "calc(100vh - 64px - 72px)" }}>

            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">Newswires</h1>
                <p className="text-sm text-muted-foreground">Publish and distribute press releases across major newswire services.</p>
              </div>

              {/* Actions button */}
              <div className="relative">
                <button
                  onClick={() => setActionsOpen((o) => !o)}
                  className="flex items-center gap-2 text-white font-semibold text-sm rounded-lg px-4 py-2"
                  style={{ backgroundColor: TEAL }}
                >
                  Actions <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {actionsOpen && (
                  <div className="absolute right-0 top-10 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 flex items-center gap-2"
                      onClick={() => setActionsOpen(false)}
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" />
                      Create a Newswire
                    </button>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 flex items-center gap-2"
                      onClick={() => setActionsOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Manage Accounts
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter + table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">

              {/* Toolbar */}
              <div className="flex items-center px-5 py-3 border-b border-border">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((o) => !o)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/40 transition-colors"
                  >
                    {filter} <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  {filterOpen && (
                    <div className="absolute left-0 top-9 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                      {FILTER_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setFilter(opt); setFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 ${filter === opt ? "font-semibold" : ""}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Table header */}
              <div className="grid border-b border-border bg-muted/20" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 48px" }}>
                <div className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</div>
                <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</div>
                <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</div>
                <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wire Service</div>
                <div />
              </div>

              {/* Rows */}
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="grid border-b border-border last:border-0 hover:bg-muted/20 transition-colors group relative"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 48px" }}
                >
                  <div className="px-5 py-4 flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{r.title}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="px-4 py-4 flex items-center text-sm text-muted-foreground">{r.date}</div>
                  <div className="px-4 py-4 flex items-center text-sm text-muted-foreground">{r.wire}</div>
                  <div className="flex items-center justify-center relative">
                    <button
                      onClick={() => setMenuOpen((m) => m === r.id ? null : r.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-muted transition-opacity transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpen === r.id && (
                      <div className="absolute right-2 top-10 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50" onClick={() => setMenuOpen(null)}>View</button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Edit</button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center gap-2" onClick={() => setMenuOpen(null)}>
                          <ExternalLink className="w-3.5 h-3.5" /> View Live
                        </button>
                        <div className="border-t border-border my-1" />
                        <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-16 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(0,130,127,0.08)" }}>
                    <Radio className="w-5 h-5" style={{ color: TEAL }} />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">No press releases yet</p>
                  <p className="text-xs text-muted-foreground mb-4">Use Actions → Create a Newswire to get started</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Newswires;
