import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";

export const ProfileTab = () => {
  const [companyName, setCompanyName] = useState("Meltwater");
  const [website, setWebsite] = useState("https://www.meltwater.com");
  const [industry, setIndustry] = useState("technology");
  const [timezone, setTimezone] = useState("america-new-york");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("mm-dd-yyyy");

  return (
    <div className="space-y-8">
      {/* Company Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Company information</h2>
        <p className="text-sm text-muted-foreground mb-6">Update your company's profile details.</p>

        <div className="flex items-start gap-8 mb-6">
          {/* Logo upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center relative group cursor-pointer hover:bg-muted/80 transition-colors">
              <span className="text-2xl font-bold text-muted-foreground">M</span>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <button className="text-xs text-primary hover:underline">Upload logo</button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Company name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance & Banking</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="media">Media & Entertainment</SelectItem>
                  <SelectItem value="government">Government & Public Sector</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm">Save changes</Button>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Regional settings</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Set the default timezone, language, and date format for your account.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1.5">
            <Label className="text-sm">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america-new-york">America / New York (UTC-5)</SelectItem>
                <SelectItem value="america-chicago">America / Chicago (UTC-6)</SelectItem>
                <SelectItem value="america-denver">America / Denver (UTC-7)</SelectItem>
                <SelectItem value="america-los-angeles">America / Los Angeles (UTC-8)</SelectItem>
                <SelectItem value="europe-london">Europe / London (UTC+0)</SelectItem>
                <SelectItem value="europe-paris">Europe / Paris (UTC+1)</SelectItem>
                <SelectItem value="asia-singapore">Asia / Singapore (UTC+8)</SelectItem>
                <SelectItem value="australia-sydney">Australia / Sydney (UTC+11)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Date format</Label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm">Save changes</Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-lg border border-destructive/30 p-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" size="sm">Delete account</Button>
      </div>
    </div>
  );
};
