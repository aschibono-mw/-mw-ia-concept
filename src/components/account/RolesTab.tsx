import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Lock } from "lucide-react";

const PERMISSION_GROUPS = [
  {
    group: "Content",
    permissions: ["View searches", "Create searches", "Edit searches", "Delete searches", "Manage tags & labels"],
  },
  {
    group: "Dashboards",
    permissions: ["View dashboards", "Create dashboards", "Share dashboards"],
  },
  {
    group: "Newsletters & Digests",
    permissions: ["View newsletters", "Create newsletters", "Send newsletters", "Manage digest recipients"],
  },
  {
    group: "Outreach",
    permissions: ["View contacts", "Create contacts", "Send pitches"],
  },
  {
    group: "Administration",
    permissions: ["Manage users", "Manage roles", "View billing", "Manage integrations", "Access API"],
  },
];

const initialRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all features and settings.",
    userCount: 2,
    system: true,
    permissions: PERMISSION_GROUPS.flatMap((g) => g.permissions),
  },
  {
    id: "2",
    name: "Editor",
    description: "Can create, edit, and publish content across the platform.",
    userCount: 2,
    system: true,
    permissions: ["View searches", "Create searches", "Edit searches", "View dashboards", "Create dashboards", "View newsletters", "Create newsletters", "Send newsletters"],
  },
  {
    id: "3",
    name: "Analyst",
    description: "Read-only access with ability to export data and build reports.",
    userCount: 2,
    system: true,
    permissions: ["View searches", "View dashboards", "View newsletters", "View contacts"],
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to shared content.",
    userCount: 3,
    system: true,
    permissions: ["View searches", "View dashboards"],
  },
  {
    id: "5",
    name: "PR Manager",
    description: "Manages outreach, pitches and journalist relationships.",
    userCount: 1,
    system: false,
    permissions: ["View searches", "View contacts", "Create contacts", "Send pitches", "View newsletters"],
  },
];

export const RolesTab = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [selected, setSelected] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newPerms, setNewPerms] = useState<string[]>([]);

  const selectedRole = roles.find((r) => r.id === selected) || roles[0];

  const togglePerm = (perm: string) =>
    setNewPerms((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));

  const handleCreate = () => {
    if (!newRoleName.trim()) return;
    setRoles((prev) => [
      ...prev,
      { id: String(prev.length + 1), name: newRoleName, description: newRoleDesc, userCount: 0, system: false, permissions: newPerms },
    ]);
    setNewRoleName("");
    setNewRoleDesc("");
    setNewPerms([]);
    setCreateOpen(false);
  };

  return (
    <>
      <div className="flex gap-6">
        {/* Role list */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Roles ({roles.length})</span>
              <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => setCreateOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                New role
              </Button>
            </div>
            <div className="divide-y divide-border">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelected(role.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${(selected === role.id || (!selected && role.id === "1")) ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{role.name}</span>
                    <div className="flex items-center gap-1.5">
                      {role.system && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">{role.userCount} user{role.userCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions panel */}
        <div className="flex-1">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">{selectedRole.name}</h2>
                  {selectedRole.system && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      <Lock className="w-3 h-3" /> System role
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedRole.description}</p>
              </div>
              {!selectedRole.system && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MoreVertical className="w-3.5 h-3.5" /> Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 bg-card">
                    <DropdownMenuItem className="cursor-pointer"><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="space-y-6">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.group}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{group.group}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedRole.permissions.includes(perm) ? "bg-primary border-primary" : "border-border"}`}>
                          {selectedRole.permissions.includes(perm) && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-foreground">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Role name</Label>
              <Input placeholder="e.g. Social Media Manager" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input placeholder="What can this role do?" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{group.group}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <Checkbox checked={newPerms.includes(perm)} onCheckedChange={() => togglePerm(perm)} />
                        <span className="text-sm">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newRoleName.trim()}>Create role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
