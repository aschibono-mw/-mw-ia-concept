import { useState } from "react";
import { Tag, Trash2, Plus, Search, X, MoreVertical } from "lucide-react";
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

interface Label {
  id: number;
  name: string;
  color: string;
  usageCount: number;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#64748b", "#0ea5e9", "#a855f7", "#f43f5e",
];

const initialLabels: Label[] = [
  { id: 1,  name: "High Priority",       color: "#ef4444", usageCount: 142 },
  { id: 2,  name: "Needs Review",        color: "#f97316", usageCount: 87  },
  { id: 3,  name: "Approved",            color: "#22c55e", usageCount: 310 },
  { id: 4,  name: "Archived",            color: "#64748b", usageCount: 54  },
  { id: 5,  name: "Press Coverage",      color: "#3b82f6", usageCount: 203 },
  { id: 6,  name: "Social Media",        color: "#ec4899", usageCount: 178 },
  { id: 7,  name: "Executive Briefing",  color: "#8b5cf6", usageCount: 66  },
  { id: 8,  name: "Competitor Intel",    color: "#0ea5e9", usageCount: 91  },
  { id: 9,  name: "Crisis",              color: "#f43f5e", usageCount: 29  },
  { id: 10, name: "ESG",                 color: "#14b8a6", usageCount: 47  },
  { id: 11, name: "Product News",        color: "#eab308", usageCount: 115 },
  { id: 12, name: "Internal Only",       color: "#a855f7", usageCount: 38  },
];

export const LabelsTab = () => {
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = labels.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected = filtered.length > 0 && selected.length === filtered.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () =>
    allSelected ? setSelected([]) : setSelected(filtered.map((l) => l.id));

  const toggleOne = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    if (editingId !== null) {
      setLabels((prev) =>
        prev.map((l) => l.id === editingId ? { ...l, name: newName.trim(), color: newColor } : l)
      );
      setEditingId(null);
    } else {
      setLabels((prev) => [
        ...prev,
        { id: Date.now(), name: newName.trim(), color: newColor, usageCount: 0 },
      ]);
    }
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setIsCreateOpen(false);
  };

  const openEdit = (label: Label) => {
    setEditingId(label.id);
    setNewName(label.name);
    setNewColor(label.color);
    setIsCreateOpen(true);
  };

  const confirmDelete = (id: number | null) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      setLabels((prev) => prev.filter((l) => l.id !== deletingId));
      setSelected((prev) => prev.filter((i) => i !== deletingId));
    } else {
      setLabels((prev) => prev.filter((l) => !selected.includes(l.id)));
      setSelected([]);
    }
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const deleteCount = deletingId !== null ? 1 : selected.length;
  const deletingLabel = deletingId !== null ? labels.find((l) => l.id === deletingId) : null;

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <Button variant="destructive" size="sm" className="h-8 gap-1.5" onClick={() => confirmDelete(null)}>
                <Trash2 className="w-3.5 h-3.5" />
                Delete {selected.length} label{selected.length > 1 ? "s" : ""}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search labels..."
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
            <Button size="sm" className="h-8 gap-1.5" onClick={() => { setEditingId(null); setNewName(""); setNewColor(PRESET_COLORS[0]); setIsCreateOpen(true); }}>
              <Plus className="w-3.5 h-3.5" />
              Create label
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_100px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            className={someSelected ? "opacity-60" : ""}
            aria-label="Select all"
          />
          <div>Name ({filtered.length})</div>
          <div>Used in</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map((label) => (
              <div
                key={label.id}
                className="grid grid-cols-[40px_1fr_100px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <Checkbox
                  checked={selected.includes(label.id)}
                  onCheckedChange={() => toggleOne(label.id)}
                  aria-label={`Select ${label.name}`}
                />
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Colour swatch */}
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  {/* Pill preview */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${label.color}20`, color: label.color }}
                  >
                    <Tag className="w-3 h-3" />
                    {label.name}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {label.usageCount.toLocaleString()} item{label.usageCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-card">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(label)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive"
                        onClick={() => confirmDelete(label.id)}
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
            No labels found.
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(v) => { setIsCreateOpen(v); if (!v) setEditingId(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit label" : "Create label"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Label name</label>
              <Input
                autoFocus
                placeholder="e.g. High Priority"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Colour</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: color,
                      boxShadow: newColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                    }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              {/* Preview */}
              {newName && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${newColor}20`, color: newColor }}
                  >
                    <Tag className="w-3 h-3" />
                    {newName}
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingId(null); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>
              {editingId !== null ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {deleteCount > 1 ? `${deleteCount} labels` : "label"}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            {deletingLabel
              ? <>Are you sure you want to delete <span className="font-medium text-foreground">"{deletingLabel.name}"</span>? This cannot be undone.</>
              : <>Are you sure you want to delete {deleteCount} labels? This cannot be undone.</>
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
