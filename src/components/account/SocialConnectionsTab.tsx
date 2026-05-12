import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, RefreshCw, Trash2, AlertCircle, CheckCircle2, Plus } from "lucide-react";

const NETWORKS = ["All", "LinkedIn", "X (Twitter)", "Facebook", "Instagram", "YouTube"];

const initialAccounts = [
  {
    id: "1",
    network: "LinkedIn",
    handle: "@Meltwater",
    fullName: "Meltwater",
    type: "Company Page",
    connectedBy: "Antonio Schibono",
    connectedOn: "Jan 8, 2025",
    status: "Connected",
    followers: "48.2K",
  },
  {
    id: "2",
    network: "X (Twitter)",
    handle: "@meltwater",
    fullName: "Meltwater",
    type: "Brand Account",
    connectedBy: "Antonio Schibono",
    connectedOn: "Jan 8, 2025",
    status: "Connected",
    followers: "31.5K",
  },
  {
    id: "3",
    network: "Facebook",
    handle: "Meltwater",
    fullName: "Meltwater",
    type: "Business Page",
    connectedBy: "Sarah Lin",
    connectedOn: "Feb 14, 2025",
    status: "Connected",
    followers: "22.1K",
  },
  {
    id: "4",
    network: "Instagram",
    handle: "@meltwater",
    fullName: "Meltwater",
    type: "Business Account",
    connectedBy: "Sarah Lin",
    connectedOn: "Feb 14, 2025",
    status: "Error",
    followers: "18.7K",
  },
  {
    id: "5",
    network: "LinkedIn",
    handle: "@antonio-schibono",
    fullName: "Antonio Schibono",
    type: "Personal Profile",
    connectedBy: "Antonio Schibono",
    connectedOn: "Mar 3, 2025",
    status: "Connected",
    followers: "4.1K",
  },
  {
    id: "6",
    network: "YouTube",
    handle: "@MeltwaterOfficial",
    fullName: "Meltwater Official",
    type: "Brand Channel",
    connectedBy: "David Marsh",
    connectedOn: "Apr 1, 2025",
    status: "Connected",
    followers: "9.3K",
  },
];

const networkColors: Record<string, string> = {
  "LinkedIn":    "bg-[#0A66C2] text-white",
  "X (Twitter)": "bg-black text-white",
  "Facebook":    "bg-[#1877F2] text-white",
  "Instagram":   "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white",
  "YouTube":     "bg-[#FF0000] text-white",
};

const networkInitials: Record<string, string> = {
  "LinkedIn":    "in",
  "X (Twitter)": "𝕏",
  "Facebook":    "f",
  "Instagram":   "ig",
  "YouTube":     "▶",
};

export const SocialConnectionsTab = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeNetwork, setActiveNetwork] = useState("All");

  const filtered = accounts.filter(
    (a) => activeNetwork === "All" || a.network === activeNetwork
  );

  const disconnect = (id: string) => setAccounts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">Social connections</h2>
            <p className="text-sm text-muted-foreground">
              Connect your social media accounts to publish content, monitor mentions, and track performance across channels.
            </p>
          </div>
          <Button size="sm" className="gap-1.5 shrink-0">
            <Plus className="w-3.5 h-3.5" />
            Add account
          </Button>
        </div>
      </div>

      {/* Error banner (Instagram has error) */}
      {accounts.some((a) => a.status === "Error") && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">One account needs attention</p>
            <p className="text-sm text-amber-700 mt-0.5">
              The Instagram connection for @meltwater has expired. Reconnect to restore publishing and monitoring.
            </p>
          </div>
        </div>
      )}

      {/* Network filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {NETWORKS.map((net) => (
          <button
            key={net}
            onClick={() => setActiveNetwork(net)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeNetwork === net
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {net}
          </button>
        ))}
      </div>

      {/* Accounts table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Account</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Followers</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Connected by</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((account) => (
              <tr key={account.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${networkColors[account.network] || "bg-muted text-foreground"}`}>
                      {networkInitials[account.network]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{account.fullName}</p>
                      <p className="text-xs text-muted-foreground">{account.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{account.type}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{account.followers}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-sm text-foreground">{account.connectedBy}</p>
                    <p className="text-xs text-muted-foreground">{account.connectedOn}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  {account.status === "Connected" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5" /> Reconnect
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card">
                      <DropdownMenuItem className="cursor-pointer"><RefreshCw className="w-4 h-4 mr-2" />Reconnect</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => disconnect(account.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-2.5 border-t border-border text-right">
          <span className="text-xs text-muted-foreground">1–{filtered.length} of {filtered.length}</span>
        </div>
      </div>
    </div>
  );
};
