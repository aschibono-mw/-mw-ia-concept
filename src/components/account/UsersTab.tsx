import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MoreVertical, Mail, Shield, Trash2, UserCheck } from "lucide-react";

const ROLES = ["Admin", "Editor", "Viewer", "Analyst"];

const initialUsers = [
  { id: "1", name: "Antonio Schibono", email: "antonio.schibono@meltwater.com", role: "Admin",  status: "Active",  lastActive: "Today" },
  { id: "2", name: "Sarah Lin",        email: "sarah.lin@meltwater.com",        role: "Editor", status: "Active",  lastActive: "Yesterday" },
  { id: "3", name: "David Marsh",      email: "david.marsh@meltwater.com",      role: "Admin",  status: "Active",  lastActive: "2 days ago" },
  { id: "4", name: "Priya Nair",       email: "priya.nair@meltwater.com",       role: "Analyst",status: "Active",  lastActive: "3 days ago" },
  { id: "5", name: "Tom Reeves",       email: "tom.reeves@meltwater.com",       role: "Viewer", status: "Active",  lastActive: "1 week ago" },
  { id: "6", name: "James Okoro",      email: "james.okoro@meltwater.com",      role: "Editor", status: "Active",  lastActive: "Today" },
  { id: "7", name: "Rachel Kim",       email: "rachel.kim@meltwater.com",       role: "Viewer", status: "Active",  lastActive: "4 days ago" },
  { id: "8", name: "Ben Torres",       email: "ben.torres@meltwater.com",       role: "Analyst",status: "Active",  lastActive: "5 days ago" },
  { id: "9", name: "Mei Chen",         email: "mei.chen@meltwater.com",         role: "Editor", status: "Invited", lastActive: "—" },
  { id: "10",name: "Luca Rossi",       email: "luca.rossi@meltwater.com",       role: "Viewer", status: "Invited", lastActive: "—" },
];

const statusColors: Record<string, string> = {
  Active:  "bg-green-100 text-green-700",
  Invited: "bg-amber-100 text-amber-700",
  Inactive:"bg-muted text-muted-foreground",
};

const roleColors: Record<string, string> = {
  Admin:   "bg-primary/10 text-primary",
  Editor:  "bg-blue-100 text-blue-700",
  Analyst: "bg-purple-100 text-purple-700",
  Viewer:  "bg-muted text-muted-foreground",
};

export const UsersTab = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((u) => u.id));

  const toggleOne = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const nameParts = inviteEmail.split("@")[0].split(".");
    const name = nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    setUsers((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name,
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "Invited",
        lastActive: "—",
      },
    ]);
    setInviteEmail("");
    setInviteRole("Viewer");
    setInviteOpen(false);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              Users <span className="font-normal text-muted-foreground">({filtered.length})</span>
            </span>
            {selected.length > 0 && (
              <span className="text-sm text-muted-foreground ml-2">{selected.length} selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-8 w-56 text-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setInviteOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Invite user
            </Button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left bg-muted/30">
              <th className="px-4 py-2.5 w-10">
                <Checkbox
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Last active</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3">
                  <Checkbox checked={selected.includes(user.id)} onCheckedChange={() => toggleOne(user.id)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleColors[user.role] || "bg-muted text-muted-foreground"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status] || "bg-muted text-muted-foreground"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-card">
                      <DropdownMenuItem className="cursor-pointer"><UserCheck className="w-4 h-4 mr-2" />Change role</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Mail className="w-4 h-4 mr-2" />Resend invite</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Shield className="w-4 h-4 mr-2" />View permissions</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive"><Trash2 className="w-4 h-4 mr-2" />Remove user</DropdownMenuItem>
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

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
