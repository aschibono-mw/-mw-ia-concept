import { useState } from "react";
import { Tag, Trash2, Plus, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TagItem {
  id: number;
  name: string;
  visibility: "visible" | "hidden";
}

const initialTags: TagItem[] = [
  { id: 1,  name: "Brand Reputation",        visibility: "visible" },
  { id: 2,  name: "CEO Coverage",            visibility: "visible" },
  { id: 3,  name: "Competitor Mentions",     visibility: "visible" },
  { id: 4,  name: "Crisis Watch",            visibility: "visible" },
  { id: 5,  name: "Product Launch",          visibility: "visible" },
  { id: 6,  name: "Earnings Season",         visibility: "visible" },
  { id: 7,  name: "ESG & Sustainability",    visibility: "visible" },
  { id: 8,  name: "Industry Trends",         visibility: "visible" },
  { id: 9,  name: "Investor Relations",      visibility: "visible" },
  { id: 10, name: "Partnership Announcements", visibility: "visible" },
  { id: 11, name: "Regulatory News",         visibility: "visible" },
  { id: 12, name: "Social Media Buzz",       visibility: "visible" },
  { id: 13, name: "Thought Leadership",      visibility: "visible" },
  { id: 14, name: "Awards & Recognition",    visibility: "visible" },
  { id: 15, name: "Mergers & Acquisitions",  visibility: "visible" },
  { id: 16, name: "Archived – Q1 2025",      visibility: "hidden"  },
  { id: 17, name: "Archived – Q4 2024",      visibility: "hidden"  },
  { id: 18, name: "Internal Draft",          visibility: "hidden"  },
  { id: 19, name: "Do Not Use",              visibility: "hidden"  },
  { id: 20, name: "Temp – Spring Campaign",  visibility: "hidden"  },
];

type VisibilityFilter = "Visible" | "Hidden" | "All";

export const TagsTab = () => {
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [selected, setSelected] = useState<number[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("Visible");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = tags.filter((t) => {
    const matchesVisibility =
      visibilityFilter === "All" ||
      t.visibility === visibilityFilter.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVisibility && matchesSearch;
  });

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filtered.map((t) => t.id));
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateTag = () => {
    const name = newTagName.trim();
    if (!name) return;
    const newTag: TagItem = {
      id: Date.now(),
      name,
      visibility: "visible",
    };
    setTags((prev) => [...prev, newTag]);
    setNewTagName("");
    setIsCreateOpen(false);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteOne = () => {
    if (deletingId !== null) {
      setTags((prev) => prev.filter((t) => t.id !== deletingId));
      setSelected((prev) => prev.filter((i) => i !== deletingId));
    }
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const handleBatchDelete = () => {
    setTags((prev) => prev.filter((t) => !selected.includes(t.id)));
    setSelected([]);
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const openBatchDeleteConfirm = () => {
    setDeletingId(null);
    setIsDeleteConfirmOpen(true);
  };

  const deleteCount = deletingId !== null ? 1 : selected.length;
  const deleteName =
    deletingId !== null
      ? tags.find((t) => t.id === deletingId)?.name
      : null;

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Visibility filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                {visibilityFilter}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 bg-card">
              {(["Visible", "Hidden", "All"] as VisibilityFilter[]).map((v) => (
                <DropdownMenuItem
                  key={v}
                  className="cursor-pointer"
                  onClick={() => setVisibilityFilter(v)}
                >
                  {v}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Batch delete */}
          {selected.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8 gap-1.5"
              onClick={openBatchDeleteConfirm}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete {selected.length} tag{selected.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Inline search */}
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-48 text-sm"
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

          {/* Create tag */}
          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Create tag
          </Button>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[40px_1fr_40px] items-center px-4 py-2.5 border-b border-border bg-muted/30">
        <Checkbox
          checked={allSelected}
          ref={(el) => { if (el) (el as HTMLButtonElement).dataset.indeterminate = someSelected ? "true" : "false"; }}
          onCheckedChange={toggleAll}
          aria-label="Select all"
          className={someSelected ? "opacity-60" : ""}
        />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Name {filtered.length > 0 && <span className="normal-case font-normal">({filtered.length})</span>}
        </span>
        <span />
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {filtered.map((tag) => (
          <div
            key={tag.id}
            className="grid grid-cols-[40px_1fr_40px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
          >
            <Checkbox
              checked={selected.includes(tag.id)}
              onCheckedChange={() => toggleOne(tag.id)}
              aria-label={`Select ${tag.name}`}
            />
            <div className="flex items-center gap-2.5 min-w-0">
              <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground truncate">{tag.name}</span>
            </div>
            <button
              onClick={() => confirmDelete(tag.id)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
              aria-label={`Delete ${tag.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No tags found.
          </div>
        )}
      </div>

      {/* Create tag dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              autoFocus
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateTag(); }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setNewTagName(""); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {deleteCount > 1 ? `${deleteCount} tags` : "tag"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            {deleteName
              ? <>Are you sure you want to delete <span className="font-medium text-foreground">"{deleteName}"</span>? This cannot be undone.</>
              : <>Are you sure you want to delete {deleteCount} tag{deleteCount > 1 ? "s" : ""}? This cannot be undone.</>
            }
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deletingId !== null ? handleDeleteOne : handleBatchDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
