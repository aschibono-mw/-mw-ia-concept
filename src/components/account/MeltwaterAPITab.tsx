import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Copy, Eye, EyeOff, MoreVertical, Trash2, RefreshCw, ExternalLink } from "lucide-react";

const initialKeys = [
  {
    id: "1",
    name: "Production",
    key: "mw_prod_a7f3c2e1b9d4f8a2c6e0b3d7f1a4c8e2",
    created: "Jan 12, 2025",
    lastUsed: "Today",
    status: "Active",
  },
  {
    id: "2",
    name: "Staging",
    key: "mw_stag_b8e4d3f2c0a5e9b3d7f1a2c6e4b8d0f4",
    created: "Mar 3, 2025",
    lastUsed: "3 days ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Legacy – Dashboard v1",
    key: "mw_legc_c9f5e4g3d1b6f0c4e8g2b3d7f5c9e1g5",
    created: "Aug 15, 2024",
    lastUsed: "2 months ago",
    status: "Active",
  },
];

const maskKey = (key: string) => key.slice(0, 10) + "•".repeat(24) + key.slice(-4);

export const MeltwaterAPITab = () => {
  const [keys, setKeys] = useState(initialKeys);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleVisible = (id: string) =>
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const newKey = "mw_new_" + Math.random().toString(36).slice(2, 34);
    setKeys((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: newKeyName,
        key: newKey,
        created: "Today",
        lastUsed: "Never",
        status: "Active",
      },
    ]);
    setNewKeyName("");
    setCreateOpen(false);
  };

  const deleteKey = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id));

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-blue-800 font-medium">API access is available on your plan</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Use your API key to authenticate requests to the Meltwater API. Keep your keys secure — treat them like passwords.
          </p>
          <a href="#" className="text-sm text-blue-600 font-medium inline-flex items-center gap-1 mt-1.5 hover:underline">
            View API documentation <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Keys table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-base font-semibold text-foreground">
            API keys <span className="font-normal text-muted-foreground">({keys.length})</span>
          </span>
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Generate key
          </Button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide text-left">Name</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide text-left">Key</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide text-left">Created</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide text-left">Last used</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keys.map((apiKey) => (
              <tr key={apiKey.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{apiKey.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">{apiKey.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {visible[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => toggleVisible(apiKey.id)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visible[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyKey(apiKey.id, apiKey.key)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedId === apiKey.id && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{apiKey.created}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{apiKey.lastUsed}</span>
                </td>
                <td className="px-4 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card">
                      <DropdownMenuItem className="cursor-pointer"><RefreshCw className="w-4 h-4 mr-2" />Regenerate</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => deleteKey(apiKey.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Revoke key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-2.5 border-t border-border text-right">
          <span className="text-xs text-muted-foreground">1–{keys.length} of {keys.length}</span>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">API usage this month</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total requests", value: "84,291", cap: null },
            { label: "Documents retrieved", value: "12,840", cap: null },
            { label: "Rate limit", value: "1,000 / min", cap: null },
          ].map((stat) => (
            <div key={stat.label} className="p-3 bg-muted/40 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Generate API key</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Key name</Label>
              <Input
                placeholder="e.g. Production, Staging, CI/CD"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Give this key a name so you can identify it later.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newKeyName.trim()}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
