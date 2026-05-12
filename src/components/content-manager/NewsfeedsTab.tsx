import { useState } from "react";
import { Newspaper, Plus, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
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

interface Newsfeed {
  id: number;
  name: string;
  type: "Manual" | "Automated" | "Curated";
  createdBy: string;
  modifiedDate: string;
}

const initialFeeds: Newsfeed[] = [
  { id: 1, name: "Yelp Feed",                  type: "Manual",    createdBy: "Antonio Schibono", modifiedDate: "Dec 9, 2025 8:44 PM"  },
  { id: 2, name: "Daily Executive Brief",       type: "Automated", createdBy: "Rachel Wu",        modifiedDate: "May 10, 2026 9:00 AM" },
  { id: 3, name: "Competitor Watch Digest",     type: "Curated",   createdBy: "Tom Nguyen",       modifiedDate: "May 8, 2026 2:15 PM"  },
  { id: 4, name: "ESG & Sustainability Pulse",  type: "Automated", createdBy: "Sophia Patel",     modifiedDate: "May 6, 2026 11:30 AM" },
  { id: 5, name: "Crisis Monitor Feed",         type: "Manual",    createdBy: "David Kim",        modifiedDate: "Apr 29, 2026 4:00 PM" },
  { id: 6, name: "Product Launch Tracker",      type: "Curated",   createdBy: "Alex Morgan",      modifiedDate: "Apr 22, 2026 10:45 AM"},
];

const ROWS_OPTIONS = [10, 25, 50];

export const NewsfeedsTab = () => {
  const [feeds, setFeeds] = useState<Newsfeed[]>(initialFeeds);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Newsfeed["type"]>("Manual");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = feeds.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const start = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, filtered.length);

  const allSelected = paginated.length > 0 && paginated.every((f) => selected.includes(f.id));
  const someSelected = paginated.some((f) => selected.includes(f.id)) && !allSelected;

  const toggleAll = () =>
    allSelected
      ? setSelected((prev) => prev.filter((id) => !paginated.find((f) => f.id === id)))
      : setSelected((prev) => [...new Set([...prev, ...paginated.map((f) => f.id)])]);

  const toggleOne = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    setFeeds((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        type: newType,
        createdBy: "John Box",
        modifiedDate: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setNewName("");
    setNewType("Manual");
    setIsCreateOpen(false);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setFeeds((prev) => prev.filter((f) => f.id !== deletingId));
      setSelected((prev) => prev.filter((i) => i !== deletingId));
    }
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const deletingFeed = feeds.find((f) => f.id === deletingId);

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-base font-semibold text-foreground">Newsfeeds</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Find"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="h-8 w-44 text-sm pl-3"
              />
            </div>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create Newsfeed
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_120px_180px_200px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            className={someSelected ? "opacity-60" : ""}
            aria-label="Select all"
          />
          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
            Name <ArrowUp className="w-3 h-3" />
          </div>
          <div>Type</div>
          <div>Created by</div>
          <div>Modified date</div>
          <div />
        </div>

        {/* Rows */}
        {paginated.length > 0 ? (
          <div className="divide-y divide-border">
            {paginated.map((feed) => (
              <div
                key={feed.id}
                className="grid grid-cols-[40px_1fr_120px_180px_200px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <Checkbox
                  checked={selected.includes(feed.id)}
                  onCheckedChange={() => toggleOne(feed.id)}
                  aria-label={`Select ${feed.name}`}
                />
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <Newspaper className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{feed.name}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{feed.type}</span>
                </div>
                <div>
                  <span className="text-sm text-foreground">{feed.createdBy}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{feed.modifiedDate}</span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-card">
                      <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => confirmDelete(feed.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">No newsfeeds found.</div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 font-medium text-foreground hover:text-primary">
                  {rowsPerPage} <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-20 bg-card">
                {ROWS_OPTIONS.map((n) => (
                  <DropdownMenuItem key={n} className="cursor-pointer" onClick={() => { setRowsPerPage(n); setPage(1); }}>{n}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span>{start}–{end} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Newsfeed</DialogTitle>
            <DialogDescription>A newsfeed groups content streams into a curated view.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name <span className="text-destructive">*</span></label>
              <Input autoFocus placeholder="e.g. Daily Executive Brief" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }} />
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
                  {(["Manual", "Automated", "Curated"] as Newsfeed["type"][]).map((t) => (
                    <DropdownMenuItem key={t} className="cursor-pointer" onClick={() => setNewType(t)}>{t}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete newsfeed?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete <span className="font-medium text-foreground">"{deletingFeed?.name}"</span>? This cannot be undone.
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
