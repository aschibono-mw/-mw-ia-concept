import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Box",
    department: "Public relations",
    role: "C-Level",
    telephone: "",
    language: "English",
    timezone: "Europe/London",
    startPage: "Home",
    defaultAccount: "Tony Schibono's Buddy Account",
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="profile" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="p-6 max-w-3xl">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold font-nunito text-foreground mb-1">Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal details and preferences.</p>
          </div>

          <div className="space-y-6">

            {/* Profile card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">Personal information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Select value={form.department} onValueChange={(v) => set("department", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Public relations", "Marketing", "Communications", "Executive", "Sales", "Other"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => set("role", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["C-Level", "VP / Director", "Manager", "Analyst", "Coordinator", "Other"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input id="telephone" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="e.g. +1 555 000 0000" />
                </div>
              </div>
            </div>

            {/* Preferences card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">Preferences</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <Select value={form.language} onValueChange={(v) => set("language", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["English", "French", "German", "Spanish", "Portuguese", "Japanese"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time zone</Label>
                  <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Europe/London", "America/New_York", "America/Chicago", "America/Los_Angeles", "Asia/Tokyo", "Australia/Sydney"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Start page</Label>
                  <Select value={form.startPage} onValueChange={(v) => set("startPage", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Home", "Explore", "Monitor", "Analyze", "Media Relations"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Default account</Label>
                  <Select value={form.defaultAccount} onValueChange={(v) => set("defaultAccount", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Tony Schibono's Buddy Account", "Brand & Comms Team"].map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
              <Button className="text-white" style={{ backgroundColor: "#00827F" }}>Save changes</Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
