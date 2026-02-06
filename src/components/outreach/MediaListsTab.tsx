import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Building2,
  Pencil,
  Trash2,
  Mail,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaList, LIST_COLORS } from "./mediaListTypes";
import { CreateListDialog } from "./CreateListDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MediaListsTabProps {
  mediaLists: MediaList[];
  onCreateList: (name: string, description: string, color: string) => void;
  onDeleteList: (listId: string) => void;
  onUpdateList: (listId: string, updates: Partial<MediaList>) => void;
  onRemoveFromList: (listId: string, type: "journalist" | "outlet", itemId: number) => void;
}

// Mock journalist/outlet name lookups
const journalistNames: Record<number, { name: string; title: string; outlet: string }> = {
  1: { name: "Sarah Chen", title: "Senior Technology Reporter", outlet: "TechCrunch" },
  2: { name: "Michael Roberts", title: "Business Editor", outlet: "Wall Street Journal" },
  3: { name: "Emma Thompson", title: "Tech Correspondent", outlet: "BBC News" },
  4: { name: "James Wilson", title: "Staff Writer", outlet: "Wired" },
  5: { name: "Lisa Park", title: "Industry Analyst", outlet: "Bloomberg" },
  6: { name: "David Kim", title: "Contributing Editor", outlet: "Forbes" },
  7: { name: "Rachel Green", title: "Tech Reporter", outlet: "The Verge" },
  8: { name: "Tom Anderson", title: "Correspondent", outlet: "Reuters" },
};

const outletNames: Record<number, { name: string; type: string }> = {
  1: { name: "TechCrunch", type: "Online Publication" },
  2: { name: "Wall Street Journal", type: "Newspaper" },
  3: { name: "BBC News", type: "Broadcast" },
  4: { name: "Wired", type: "Magazine" },
  5: { name: "Bloomberg", type: "News Agency" },
  6: { name: "Forbes", type: "Magazine" },
};

export const MediaListsTab = ({
  mediaLists,
  onCreateList,
  onDeleteList,
  onUpdateList,
  onRemoveFromList,
}: MediaListsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [editingList, setEditingList] = useState<MediaList | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredLists = mediaLists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (list: MediaList) => {
    setEditingList(list);
    setEditName(list.name);
    setEditDescription(list.description || "");
    setEditColor(list.color);
  };

  const handleSaveEdit = () => {
    if (!editingList || !editName.trim()) return;
    onUpdateList(editingList.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      color: editColor,
    });
    setEditingList(null);
    toast.success("List updated");
  };

  const handleDelete = (listId: string) => {
    onDeleteList(listId);
    setDeleteConfirmId(null);
    if (expandedListId === listId) setExpandedListId(null);
    toast.success("List deleted");
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create List
          </Button>
        </div>
      </div>

      {/* Lists Grid */}
      {filteredLists.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 flex flex-col items-center justify-center text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-medium text-foreground mb-1">No media lists yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first list to organize journalists and outlets for outreach.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create List
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLists.map((list) => {
            const totalContacts = list.journalistIds.length + list.outletIds.length;
            const isExpanded = expandedListId === list.id;

            return (
              <div
                key={list.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                {/* List Header */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                >
                  <div
                    className="w-3 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: list.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground truncate">{list.name}</h3>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {totalContacts} {totalContacts === 1 ? "contact" : "contacts"}
                      </Badge>
                    </div>
                    {list.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">
                        {list.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {list.journalistIds.length} journalists
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {list.outletIds.length} outlets
                      </span>
                      <span>by {list.owner}</span>
                      <span>Updated {list.updatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Pitch List
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStartEdit(list)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit List
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Create Pitch
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteConfirmId(list.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {totalContacts === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        This list is empty. Add journalists or outlets from the Journalists & Outlets tab.
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[360px]">
                        {/* Journalists */}
                        {list.journalistIds.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Journalists ({list.journalistIds.length})
                            </div>
                            {list.journalistIds.map((id) => {
                              const j = journalistNames[id];
                              if (!j) return null;
                              return (
                                <div
                                  key={`j-${id}`}
                                  className="px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors border-b border-border last:border-0"
                                >
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                    {j.name.split(" ").map((n) => n[0]).join("")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{j.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {j.title} at {j.outlet}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => onRemoveFromList(list.id, "journalist", id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Outlets */}
                        {list.outletIds.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Outlets ({list.outletIds.length})
                            </div>
                            {list.outletIds.map((id) => {
                              const o = outletNames[id];
                              if (!o) return null;
                              return (
                                <div
                                  key={`o-${id}`}
                                  className="px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors border-b border-border last:border-0"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{o.name}</p>
                                    <p className="text-xs text-muted-foreground">{o.type}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => onRemoveFromList(list.id, "outlet", id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </ScrollArea>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create List Dialog */}
      <CreateListDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateList={onCreateList}
      />

      {/* Edit List Dialog */}
      <Dialog open={!!editingList} onOpenChange={() => setEditingList(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit Media List</DialogTitle>
            <DialogDescription>Update the list name, description, or color.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">List name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {LIST_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={cn(
                      "w-7 h-7 rounded-full transition-all",
                      editColor === color
                        ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingList(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this media list?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the list. Journalists and outlets in it won't be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
