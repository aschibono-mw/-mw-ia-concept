import { useState } from "react";
import { Globe, Plus, Search, X, MoreVertical, ChevronDown, Trash2, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface Source {
  id: number;
  name: string;
  domain: string;
  type: "News" | "Blog" | "Trade" | "Social" | "Podcast";
  status: "active" | "excluded";
  addedBy: string;
  addedAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  News:    "bg-blue-100 text-blue-700",
  Blog:    "bg-purple-100 text-purple-700",
  Trade:   "bg-amber-100 text-amber-700",
  Social:  "bg-pink-100 text-pink-700",
  Podcast: "bg-teal-100 text-teal-700",
};

const initialSources: Source[] = [
  { id: 1,  name: "Reuters",              domain: "reuters.com",          type: "News",    status: "active",   addedBy: "Rachel Wu",    addedAt: "May 10, 2026" },
  { id: 2,  name: "Financial Times",      domain: "ft.com",               type: "News",    status: "active",   addedBy: "Tom Nguyen",   addedAt: "May 8, 2026"  },
  { id: 3,  name: "TechCrunch",           domain: "techcrunch.com",       type: "Blog",    status: "active",   addedBy: "Sophia Patel", addedAt: "May 5, 2026"  },
  { id: 4,  name: "PR Newswire",          domain: "prnewswire.com",       type: "News",    status: "active",   addedBy: "David Kim",    addedAt: "May 2, 2026"  },
  { id: 5,  name: "Harvard Business Rev", domain: "hbr.org",              type: "Trade",   status: "active",   addedBy: "Alex Morgan",  addedAt: "Apr 28, 2026" },
  { id: 6,  name: "The Economist",        domain: "economist.com",        type: "News",    status: "active",   addedBy: "Rachel Wu",    addedAt: "Apr 25, 2026" },
  { id: 7,  name: "Marketing Week",       domain: "marketingweek.com",    type: "Trade",   status: "active",   addedBy: "Tom Nguyen",   addedAt: "Apr 20, 2026" },
  { id: 8,  name: "Wired",               domain: "wired.com",            type: "Blog",    status: "active",   addedBy: "Sophia Patel", addedAt: "Apr 15, 2026" },
  { id: 9,  name: "The Verge",            domain: "theverge.com",         type: "Blog",    status: "excluded", addedBy: "David Kim",    addedAt: "Apr 10, 2026" },
  { id: 10, name: "Marketing Brew",       domain: "marketingbrew.com",    type: "Trade",   status: "active",   addedBy: "Alex Morgan",  addedAt: "Apr 5, 2026"  },
  { id: 11, name: "Digiday",             domain: "digiday.com",          type: "Trade",   status: "excluded", addedBy: "Rachel Wu",    addedAt: "Mar 28, 2026" },
  { id: 12, name: "How I Built This",     domain: "podcasts.apple.com",   type: "Podcast", status: "active",   addedBy: "Tom Nguyen",   addedAt: "Mar 20, 2026" },
];

type StatusFilter = "All" | "Active" | "Excluded";
type TypeFilter = "All" | Source["type"];
const STATUS_OPTIONS: StatusFilter[] = ["All", "Active", "Excluded"];
const TYPE_OPTIONS: TypeFilter[] = ["All", "News", "Blog", "Trade", "Social", "Podcast"];

export const SourcesTab = () => {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newType, setNewType] = useState<Source["type"]>("News");

  const filtered = sources.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === "All" || s.type === typeFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () =>
    allSelected ? setSelected([]) : setSelected(filtered.map((s) => s.id));

  const toggleOne = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleStatus = (id: number) =>
    setSources((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "excluded" : "active" } : s)
    );

  const handleAdd = () => {
    if (!newName.trim()) return;
    setSources((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        domain: newDomain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") || newName.trim().toLowerCase().replace(/\s+/, "") + ".com",
        type: newType,
        status: "active",
        addedBy: "John Box",
        addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
    ]);
    setNewName("");
    setNewDomain("");
    setNewType("News");
    setIsAddOpen(false);
  };

  const confirmDelete = (id: number | null) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setSources((prev) => prev.filter((s) => s.id !== deletingId));
      setSelected((prev) => prev.filter((i) => i !== deletingId));
    } else {
      setSources((prev) => prev.filter((s) => !selected.includes(s.id)));
      setSelected([]);
    }
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const deleteCount = deletingId !== null ? 1 : selected.length;
  const deletingSource = deletingId !== null ? sources.find((s) => s.id === deletingId) : null;

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                  {statusFilter === "All" ? "All statuses" : statusFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 bg-card">
                {STATUS_OPTIONS.map((s) => (
                  <DropdownMenuItem key={s} className="cursor-pointer" onClick={() => setStatusFilter(s)}>
                    {s === "All" ? "All statuses" : s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Type filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                  {typeFilter === "All" ? "All types" : typeFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36 bg-card">
                {TYPE_OPTIONS.map((t) => (
                  <DropdownMenuItem key={t} className="cursor-pointer" onClick={() => setTypeFilter(t)}>
                    {t === "All" ? "All types" : t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selected.length > 0 && (
              <Button variant="destructive" size="sm" className="h-8 gap-1.5" onClick={() => confirmDelete(null)}>
                <Trash2 className="w-3.5 h-3.5" />
                Delete {selected.length}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input autoFocus placeholder="Search sources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 w-52 text-sm" />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Search className="w-4 h-4" />
              </button>
            )}
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsAddOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Add source
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_160px_100px_100px_140px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} className={someSelected ? "opacity-60" : ""} aria-label="Select all" />
          <div>Name ({filtered.length})</div>
          <div>Domain</div>
          <div>Type</div>
          <div>Status</div>
          <div>Added</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map((source) => (
              <div key={source.id} className="grid grid-cols-[40px_1fr_160px_100px_100px_140px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group">
                <Checkbox checked={selected.includes(source.id)} onCheckedChange={() => toggleOne(source.id)} aria-label={`Select ${source.name}`} />
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{source.name}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{source.domain}</span>
                </div>
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[source.type]}`}>{source.type}</span>
                </div>
                <div>
                  <button
                    onClick={() => toggleStatus(source.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                      source.status === "active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    <Circle className={`w-1.5 h-1.5 ${source.status === "active" ? "fill-emerald-500 text-emerald-500" : "fill-red-400 text-red-400"}`} />
                    {source.status === "active" ? "Active" : "Excluded"}
                  </button>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{source.addedAt}</span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => toggleStatus(source.id)}>
                        {source.status === "active" ? "Exclude source" : "Re-include source"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => confirmDelete(source.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">No sources found.</div>
        )}
      </div>

      {/* Add source dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add source</DialogTitle>
            <DialogDescription>Add a publication or domain to track in your content streams.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Source name <span className="text-destructive">*</span></label>
              <Input autoFocus placeholder="e.g. Reuters" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Domain <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input placeholder="e.g. reuters.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between text-sm border border-border rounded-md px-3 py-2 hover:bg-muted">
                    {newType} <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-card">
                  {(["News", "Blog", "Trade", "Social", "Podcast"] as Source["type"][]).map((t) => (
                    <DropdownMenuItem key={t} className="cursor-pointer" onClick={() => setNewType(t)}>{t}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newName.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete {deleteCount > 1 ? `${deleteCount} sources` : "source"}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            {deletingSource
              ? <>Are you sure you want to delete <span className="font-medium text-foreground">"{deletingSource.name}"</span>? This cannot be undone.</>
              : <>Are you sure you want to delete {deleteCount} sources? This cannot be undone.</>
            }
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
