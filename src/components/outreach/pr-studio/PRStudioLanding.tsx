import { useState } from "react";
import { CategoriesPanel } from "@/components/dashboard/CategoriesPanel";
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  FileText,
  Mail,
  ChevronDown,
  Trash2,
  Copy,
  Pencil,
  Send,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Pitch } from "./types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PRStudioLandingProps {
  pitches: Pitch[];
  onCreateNew: () => void;
  onOpenPitch: (pitchId: string) => void;
  onDeletePitch: (pitchId: string) => void;
  onDuplicatePitch: (pitchId: string) => void;
  onToggleStar: (pitchId: string) => void;
}

type StatusFilter = "all" | "draft" | "generated" | "sent";
type TypeFilter = "all" | "media-pitch" | "press-release";

export const PRStudioLanding = ({
  pitches,
  onCreateNew,
  onOpenPitch,
  onDeletePitch,
  onDuplicatePitch,
  onToggleStar,
}: PRStudioLandingProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPitches = pitches.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === filteredPitches.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPitches.map((p) => p.id));
    }
  };

  const handleDelete = (id: string) => {
    onDeletePitch(id);
    setDeleteConfirmId(null);
    setSelectedItems((prev) => prev.filter((i) => i !== id));
    toast.success("Pitch deleted");
  };

  const handleBulkDelete = () => {
    selectedItems.forEach((id) => onDeletePitch(id));
    setSelectedItems([]);
    toast.success(`${selectedItems.length} pitches deleted`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
            Generated
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs">
            Draft
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
            Sent
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "media-pitch" ? (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Mail className="w-3.5 h-3.5" />
        Media Pitch
      </div>
    ) : (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <FileText className="w-3.5 h-3.5" />
        Press Release
      </div>
    );
  };

  const statusCounts = {
    all: pitches.length,
    draft: pitches.filter((p) => p.status === "draft").length,
    generated: pitches.filter((p) => p.status === "generated").length,
    sent: pitches.filter((p) => p.status === "sent").length,
  };

  const pitchFolders = [
    { name: "Brand", count: 3 },
    { name: "Product", count: 2 },
    { name: "Executive", count: 2 },
    { name: "Crisis", count: 1 },
    { name: "Events", count: 1 },
  ];

  return (
    <div className="flex gap-4">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0">
        <CategoriesPanel categories={pitchFolders} onAddCategory={() => {}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
      {/* Search & Filters */}
      <div className="bg-card rounded-lg border border-border">
        {/* Search & Actions */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pitches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {typeFilter === "all" ? "All Types" : typeFilter === "media-pitch" ? "Media Pitches" : "Press Releases"}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("media-pitch")}>Media Pitches</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("press-release")}>Press Releases</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 flex items-center gap-1 border-b border-border">
          {(["all", "draft", "generated", "sent"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-3 py-2 text-sm font-medium capitalize transition-colors relative",
                statusFilter === status
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status === "all" ? "All" : status} ({statusCounts[status]})
              {statusFilter === status && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border-t border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 w-10">
                  <Checkbox
                    checked={selectedItems.length === filteredPitches.length && filteredPitches.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-foreground">Name</th>
                <th className="p-4 text-sm font-semibold text-foreground">Type</th>
                <th className="p-4 text-sm font-semibold text-foreground">Status</th>
                <th className="p-4 text-sm font-semibold text-foreground">Created by</th>
                <th className="p-4 text-sm font-semibold text-foreground">Last updated</th>
                <th className="p-4 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPitches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    No pitches found. Create your first one to get started.
                  </td>
                </tr>
              ) : (
                filteredPitches.map((pitch) => (
                  <tr
                    key={pitch.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedItems.includes(pitch.id)}
                        onCheckedChange={() => toggleItem(pitch.id)}
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onOpenPitch(pitch.id)}
                        className="text-sm font-medium text-foreground hover:text-primary text-left"
                      >
                        {pitch.name}
                      </button>
                    </td>
                    <td className="p-4">{getTypeBadge(pitch.type)}</td>
                    <td className="p-4">{getStatusBadge(pitch.status)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{pitch.createdBy}</td>
                    <td className="p-4 text-sm text-muted-foreground">{pitch.lastUpdated}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onToggleStar(pitch.id)}
                        >
                          <Star
                            className={cn(
                              "w-4 h-4",
                              pitch.starred
                                ? "text-primary fill-primary"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onOpenPitch(pitch.id)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicatePitch(pitch.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              Send to Outreach
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteConfirmId(pitch.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredPitches.length} of {pitches.length} pitches</span>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background rounded-lg shadow-lg px-4 py-3 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">{selectedItems.length} selected</span>
          <div className="h-4 w-px bg-background/20" />
          <Button
            size="sm"
            variant="secondary"
            className="h-8 gap-2 text-destructive"
            onClick={handleBulkDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-background/70 hover:text-background hover:bg-background/10"
            onClick={() => setSelectedItems([])}
          >
            ✕
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this pitch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The pitch and its generated content will be permanently removed.
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
    </div>
  );
};
