import { useState } from "react";
import { Rss, Plus, MoreVertical, Circle, ExternalLink } from "lucide-react";
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

interface RSSFeed {
  id: number;
  name: string;
  url: string;
  status: "active" | "inactive";
  lastFetched: string;
  articles: number;
}

const initialFeeds: RSSFeed[] = [
  {
    id: 1,
    name: "Reuters – Top News",
    url: "https://feeds.reuters.com/reuters/topNews",
    status: "active",
    lastFetched: "May 12, 2026 · 9:15 AM",
    articles: 1240,
  },
  {
    id: 2,
    name: "Financial Times – Markets",
    url: "https://www.ft.com/rss/home/uk",
    status: "active",
    lastFetched: "May 12, 2026 · 9:00 AM",
    articles: 874,
  },
  {
    id: 3,
    name: "TechCrunch – Startups",
    url: "https://techcrunch.com/feed/",
    status: "active",
    lastFetched: "May 12, 2026 · 8:45 AM",
    articles: 512,
  },
  {
    id: 4,
    name: "Harvard Business Review",
    url: "https://hbr.org/feed",
    status: "inactive",
    lastFetched: "Apr 30, 2026 · 6:00 AM",
    articles: 203,
  },
];

export const RSSFeedsTab = () => {
  const [feeds, setFeeds] = useState<RSSFeed[]>(initialFeeds);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");

  const toggleStatus = (id: number) => {
    setFeeds((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f
      )
    );
  };

  const deleteFeed = (id: number) => {
    setFeeds((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAdd = () => {
    if (!newFeedUrl.trim()) return;
    const newFeed: RSSFeed = {
      id: Date.now(),
      name: newFeedName.trim() || newFeedUrl.trim(),
      url: newFeedUrl.trim(),
      status: "active",
      lastFetched: "Just added",
      articles: 0,
    };
    setFeeds((prev) => [...prev, newFeed]);
    setNewFeedName("");
    setNewFeedUrl("");
    setIsAddOpen(false);
  };

  if (feeds.length === 0) {
    return (
      <>
        <div className="bg-card rounded-lg border border-border py-20 flex flex-col items-center gap-5 text-center px-6">
          {/* Illustration */}
          <div className="w-28 h-28 rounded-full bg-teal-50 flex items-center justify-center">
            <div className="relative">
              <Rss className="w-12 h-12 text-teal-400" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Incoming RSS feeds</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              RSS feeds allow you to pull specific content streams into our platform to support your communication efforts.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add incoming RSS feed
          </Button>
          <button className="text-sm text-primary hover:underline">Contact Support</button>
        </div>

        <AddFeedDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          name={newFeedName}
          url={newFeedUrl}
          onNameChange={setNewFeedName}
          onUrlChange={setNewFeedUrl}
          onAdd={handleAdd}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-base font-semibold text-foreground">
            {feeds.length} RSS feed{feeds.length !== 1 ? "s" : ""}
          </span>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Add incoming RSS feed
          </Button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_100px_180px_80px_44px] items-center px-4 py-2.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div>Name</div>
          <div>URL</div>
          <div>Status</div>
          <div>Last Fetched</div>
          <div>Articles</div>
          <div />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="grid grid-cols-[2fr_2fr_100px_180px_80px_44px] items-center px-4 py-3 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <Rss className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">{feed.name}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 pr-4">
                <span className="text-sm text-muted-foreground truncate">{feed.url}</span>
                <a href={feed.url} target="_blank" rel="noreferrer" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                </a>
              </div>
              <div>
                <button
                  onClick={() => toggleStatus(feed.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                    feed.status === "active"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Circle className={`w-1.5 h-1.5 ${feed.status === "active" ? "fill-emerald-500 text-emerald-500" : "fill-muted-foreground text-muted-foreground"}`} />
                  {feed.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">{feed.lastFetched}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">{feed.articles.toLocaleString()}</span>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-card">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => toggleStatus(feed.id)}>
                      {feed.status === "active" ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive"
                      onClick={() => deleteFeed(feed.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddFeedDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        name={newFeedName}
        url={newFeedUrl}
        onNameChange={setNewFeedName}
        onUrlChange={setNewFeedUrl}
        onAdd={handleAdd}
      />
    </>
  );
};

interface AddFeedDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  url: string;
  onNameChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  onAdd: () => void;
}

const AddFeedDialog = ({ open, onOpenChange, name, url, onNameChange, onUrlChange, onAdd }: AddFeedDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Add incoming RSS feed</DialogTitle>
        <DialogDescription>
          Paste the RSS feed URL to start pulling content into the platform.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Feed URL <span className="text-destructive">*</span></label>
          <Input
            autoFocus
            placeholder="https://example.com/feed.rss"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display name <span className="text-muted-foreground font-normal">(optional)</span></label>
          <Input
            placeholder="e.g. Reuters – Top News"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={onAdd} disabled={!url.trim()}>Add feed</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
