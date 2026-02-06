import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, FolderOpen } from "lucide-react";
import { MediaList } from "./mediaListTypes";
import { cn } from "@/lib/utils";

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaLists: MediaList[];
  selectedCount: number;
  onAddToLists: (listIds: string[]) => void;
  onCreateNewList: () => void;
}

export const AddToListDialog = ({
  open,
  onOpenChange,
  mediaLists,
  selectedCount,
  onAddToLists,
  onCreateNewList,
}: AddToListDialogProps) => {
  const [search, setSearch] = useState("");
  const [checkedLists, setCheckedLists] = useState<string[]>([]);

  const filteredLists = mediaLists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleList = (listId: string) => {
    setCheckedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  const handleAdd = () => {
    onAddToLists(checkedLists);
    setCheckedLists([]);
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add to Media List</DialogTitle>
          <DialogDescription>
            Add {selectedCount} selected {selectedCount === 1 ? "contact" : "contacts"} to one or more lists.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lists */}
          <ScrollArea className="h-[240px]">
            {filteredLists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <FolderOpen className="w-8 h-8 mb-2" />
                <p className="text-sm">No lists found</p>
              </div>
            ) : (
              <div className="space-y-1 pr-3">
                {filteredLists.map((list) => {
                  const isChecked = checkedLists.includes(list.id);
                  const totalContacts = list.journalistIds.length + list.outletIds.length;
                  return (
                    <label
                      key={list.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        isChecked ? "bg-primary/5" : "hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleList(list.id)}
                      />
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: list.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {list.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {totalContacts} {totalContacts === 1 ? "contact" : "contacts"}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Create New */}
          <button
            onClick={() => {
              onOpenChange(false);
              onCreateNewList();
            }}
            className="flex items-center gap-2 w-full p-3 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create new list
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={checkedLists.length === 0}>
            Add to {checkedLists.length > 0 ? checkedLists.length : ""} {checkedLists.length === 1 ? "List" : "Lists"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
