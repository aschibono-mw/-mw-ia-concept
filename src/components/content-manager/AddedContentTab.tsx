import { useState } from "react";
import { FileText, Link2, Plus, Search, Trash2, X, ChevronDown, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface AddedItem {
  id: number;
  title: string;
  source: string;
  url: string;
  type: "Article" | "Blog" | "Press Release" | "Document" | "Video";
  addedBy: string;
  addedAt: string;
}

const initialItems: AddedItem[] = [
  {
    id: 1,
    title: "How AI is Reshaping the Media Monitoring Landscape",
    source: "Forbes",
    url: "https://forbes.com",
    type: "Article",
    addedBy: "Rachel Wu",
    addedAt: "May 11, 2026",
  },
  {
    id: 2,
    title: "Q1 2026 Earnings Call Transcript – Internal",
    source: "Internal",
    url: "",
    type: "Document",
    addedBy: "David Kim",
    addedAt: "May 9, 2026",
  },
  {
    id: 3,
    title: "Brand Perception Study: Consumer Trust in 2026",
    source: "Edelman",
    url: "https://edelman.com",
    type: "Document",
    addedBy: "Sophia Patel",
    addedAt: "May 7, 2026",
  },
  {
    id: 4,
    title: "The Future of ESG Reporting",
    source: "Harvard Business Review",
    url: "https://hbr.org",
    type: "Article",
    addedBy: "Tom Nguyen",
    addedAt: "May 5, 2026",
  },
  {
    id: 5,
    title: "Official Product Launch Press Release – Spring 2026",
    source: "PR Newswire",
    url: "https://prnewswire.com",
    type: "Press Release",
    addedBy: "Alex Morgan",
    addedAt: "Apr 30, 2026",
  },
  {
    id: 6,
    title: "Competitor Analysis: Market Share Shifts in EMEA",
    source: "Internal",
    url: "",
    type: "Document",
    addedBy: "Rachel Wu",
    addedAt: "Apr 28, 2026",
  },
  {
    id: 7,
    title: "CEO Keynote at TechSummit 2026",
    source: "YouTube",
    url: "https://youtube.com",
    type: "Video",
    addedBy: "Tom Nguyen",
    addedAt: "Apr 22, 2026",
  },
  {
    id: 8,
    title: "Navigating Regulatory Change in Financial Services",
    source: "The Economist",
    url: "https://economist.com",
    type: "Article",
    addedBy: "David Kim",
    addedAt: "Apr 18, 2026",
  },
  {
    id: 9,
    title: "Industry Trends: Sustainability in Supply Chains",
    source: "McKinsey",
    url: "https://mckinsey.com",
    type: "Blog",
    addedBy: "Sophia Patel",
    addedAt: "Apr 14, 2026",
  },
];

const typeColors: Record<string, string> = {
  Article:       "bg-blue-100 text-blue-700",
  Blog:          "bg-purple-100 text-purple-700",
  "Press Release": "bg-amber-100 text-amber-700",
  Document:      "bg-slate-100 text-slate-600",
  Video:         "bg-rose-100 text-rose-700",
};

type TypeFilter = "All" | AddedItem["type"];
const TYPE_OPTIONS: TypeFilter[] = ["All", "Article", "Blog", "Press Release", "Document", "Video"];

export const AddedContentTab = () => {
  const [items, setItems] = useState<AddedItem[]>(initialItems);
  const [selected, setSelected] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<AddedItem["type"]>("Article");

  const filtered = items.filter((item) => {
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () =>
    allSelected ? setSelected([]) : setSelected(filtered.map((i) => i.id));

  const toggleOne = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setItems((prev) => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        source: newUrl ? new URL(newUrl.startsWith("http") ? newUrl : `https://${newUrl}`).hostname.replace("www.", "") : "Manual",
        url: newUrl.trim(),
        type: newType,
        addedBy: "John Box",
        addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewUrl("");
    setNewType("Article");
    setIsAddOpen(false);
  };

  const confirmDelete = (id: number | null) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setItems((prev) => prev.filter((i) => i.id !== deletingId));
      setSelected((prev) => prev.filter((i) => i !== deletingId));
    } else {
      setItems((prev) => prev.filter((i) => !selected.includes(i.id)));
      setSelected([]);
    }
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const deleteCount = deletingId !== null ? 1 : selected.length;
  const deletingItem = deletingId !== null ? items.find((i) => i.id === deletingId) : null;

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Type filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                  {typeFilter === "All" ? "All types" : typeFilter}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 bg-card">
                {TYPE_OPTIONS.map((t) => (
                  <DropdownMenuItem key={t} className="cursor-pointer" onClick={() => setTypeFilter(t)}>
                    {t === "All" ? "All types" : t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Batch delete */}
            {selected.length > 0 && (
              <Button variant="destructive" size="sm" className="h-8 gap-1.5" onClick={() => confirmDelete(null)}>
                <Trash2 className="w-3.5 h-3.5" />
                Delete {selected.length} item{selected.length > 1 ? "s" : ""}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-52 text-sm"
                />
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsAddOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Add content
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_110px_140px_120px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            className={someSelected ? "opacity-60" : ""}
            aria-label="Select all"
          />
          <div>Title</div>
          <div>Type</div>
          <div>Added By</div>
          <div>Added</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[40px_1fr_110px_140px_120px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <Checkbox
                  checked={selected.includes(item.id)}
                  onCheckedChange={() => toggleOne(item.id)}
                  aria-label={`Select ${item.title}`}
                />
                <div className="flex items-start gap-2.5 min-w-0 pr-4">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-muted-foreground">{item.source}</span>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-foreground">{item.addedBy}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{item.addedAt}</span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-card">
                      {item.url && (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                            <Link2 className="w-3.5 h-3.5" /> Open URL
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive"
                        onClick={() => confirmDelete(item.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No content found.
          </div>
        )}
      </div>

      {/* Add content dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add content</DialogTitle>
            <DialogDescription>Manually add an article, document, or other content item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title <span className="text-destructive">*</span></label>
              <Input
                autoFocus
                placeholder="Content title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">URL <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                placeholder="https://example.com/article"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors">
                    {newType}
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-card">
                  {(["Article", "Blog", "Press Release", "Document", "Video"] as AddedItem["type"][]).map((t) => (
                    <DropdownMenuItem key={t} className="cursor-pointer" onClick={() => setNewType(t)}>{t}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newTitle.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {deleteCount > 1 ? `${deleteCount} items` : "item"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            {deletingItem
              ? <>Are you sure you want to delete <span className="font-medium text-foreground">"{deletingItem.title}"</span>? This cannot be undone.</>
              : <>Are you sure you want to delete {deleteCount} items? This cannot be undone.</>
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
