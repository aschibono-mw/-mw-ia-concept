import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import {
  MoreVertical, Search, Info, ChevronDown, ChevronUp, ChevronsUpDown,
  FolderKanban, Plus,
} from "lucide-react";

const TEAL = "#00827F";

interface Project {
  id: number;
  name: string;
  visibility: "Only Me" | "Team" | "Everyone";
  lastUsed: string;
  lastUsedSort: number;
}

const PROJECTS: Project[] = [
  { id: 1, name: "Brand Health Q2 2026",        visibility: "Team",     lastUsed: "Just now",      lastUsedSort: 0 },
  { id: 2, name: "Competitor Intelligence",      visibility: "Only Me",  lastUsed: "2 hours ago",   lastUsedSort: 2 },
  { id: 3, name: "Executive Visibility Report",  visibility: "Everyone", lastUsed: "Yesterday",     lastUsedSort: 24 },
  { id: 4, name: "Crisis Comms Monitoring",      visibility: "Team",     lastUsed: "3 days ago",    lastUsedSort: 72 },
  { id: 5, name: "Q1 Media Coverage Recap",      visibility: "Only Me",  lastUsed: "Apr 10, 2026",  lastUsedSort: 480 },
];

const VISIBILITY_COLORS: Record<string, { bg: string; color: string }> = {
  "Only Me":  { bg: "rgba(107,114,128,0.10)", color: "#6b7280" },
  "Team":     { bg: "rgba(0,130,127,0.10)",   color: TEAL },
  "Everyone": { bg: "rgba(79,106,245,0.10)",  color: "#4F6AF5" },
};

type SortDir = "asc" | "desc" | null;

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || !dir) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground opacity-40" />;
  return dir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5" style={{ color: TEAL }} />
    : <ChevronDown className="w-3.5 h-3.5" style={{ color: TEAL }} />;
}

const ProjectsManager = () => {
  const [search, setSearch]       = useState("");
  const [sortDir, setSortDir]     = useState<SortDir>("asc");
  const [menuOpen, setMenuOpen]   = useState<number | null>(null);
  const [visMenuOpen, setVisMenuOpen] = useState<number | null>(null);
  const [projects, setProjects]   = useState<Project[]>(PROJECTS);

  const handleSortLastUsed = () => {
    setSortDir(d => d === "asc" ? "desc" : "asc");
  };

  const filtered = projects
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === "asc" ? a.lastUsedSort - b.lastUsedSort : b.lastUsedSort - a.lastUsedSort);

  const setVisibility = (id: number, vis: Project["visibility"]) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, visibility: vis } : p));
    setVisMenuOpen(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="projects-manager" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="px-8 pt-6 pb-10">

          {/* Page header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">
                Give Mira the context to go deeper
              </h1>
              <p className="text-sm text-muted-foreground">
                Projects bundle your searches, dashboards, and reports into focused workspaces. The richer the context, the sharper Mira's insights.
              </p>
            </div>
            <button
              className="flex items-center gap-2 text-white font-semibold text-[13px] rounded-lg px-4 py-2 mt-1 flex-shrink-0"
              style={{ backgroundColor: TEAL }}
            >
              <Plus className="w-3.5 h-3.5" /> New Project
            </button>
          </div>

          {/* Table card */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-foreground">{filtered.length} Projects</span>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Find"
                  className="pl-8 pr-4 h-8 w-52 text-sm rounded-full border border-border bg-muted/40 outline-none focus:border-border focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Column headers */}
            <div className="grid border-b border-border bg-white"
              style={{ gridTemplateColumns: "2fr 1.2fr 1.2fr 48px" }}>
              <div className="px-5 py-3 text-xs font-semibold text-foreground uppercase tracking-wide">Project Name</div>
              <div className="px-4 py-3 text-xs font-semibold text-foreground uppercase tracking-wide">Visibility</div>
              <button
                onClick={handleSortLastUsed}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 hover:text-foreground transition-colors text-foreground"
              >
                Last Used
                <SortIcon active dir={sortDir} />
              </button>
              <div />
            </div>

            {/* Rows */}
            {filtered.map((project) => {
              const visCfg = VISIBILITY_COLORS[project.visibility];
              return (
                <div
                  key={project.id}
                  className="grid border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group relative"
                  style={{ gridTemplateColumns: "2fr 1.2fr 1.2fr 48px" }}
                >
                  {/* Name */}
                  <div className="px-5 py-4 flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-[14px] font-medium text-foreground">{project.name}</span>
                  </div>

                  {/* Visibility */}
                  <div className="px-4 py-4 flex items-center relative">
                    <button
                      onClick={() => setVisMenuOpen(v => v === project.id ? null : project.id)}
                      className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-semibold transition-colors hover:opacity-80"
                      style={{ backgroundColor: visCfg.bg, color: visCfg.color }}
                    >
                      {project.visibility}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {visMenuOpen === project.id && (
                      <div className="absolute left-4 top-12 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[130px]">
                        {(["Only Me", "Team", "Everyone"] as Project["visibility"][]).map(opt => (
                          <button
                            key={opt}
                            onClick={() => setVisibility(project.id, opt)}
                            className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted/50 flex items-center gap-2"
                          >
                            <span
                              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: VISIBILITY_COLORS[opt].color }}
                            />
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Last used */}
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-[14px] text-muted-foreground">{project.lastUsed}</span>
                  </div>

                  {/* Actions menu */}
                  <div className="flex items-center justify-center relative">
                    <button
                      onClick={() => setMenuOpen(m => m === project.id ? null : project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-muted"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-2 top-10 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
                        <button className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Open project</button>
                        <button className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Rename</button>
                        <button className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Duplicate</button>
                        <div className="border-t border-border my-1" />
                        <button className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-muted/50" onClick={() => setMenuOpen(null)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No projects match your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectsManager;
