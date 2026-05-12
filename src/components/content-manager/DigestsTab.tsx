import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, SlidersHorizontal, MoreVertical, Pencil, Trash2, Send } from "lucide-react";
import { CreateDigestDialog } from "@/components/digests/CreateDigestDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const digests = [
  { id: "1",  name: "Digest Report",               basedOn: "Yelp Brand Search, Yelp Negative ...",              recipients: ["Antonio Schibono"], createdBy: "Antonio Schibono" },
  { id: "2",  name: "Weekly Brand Monitor",          basedOn: "Meltwater Brand Coverage, Competitor Mentions",     recipients: ["Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres", "Mei Chen", "Luca Rossi", "Fatima Al-Hassan", "Noah Patel", "Chloe Dupont", "Marcus Webb", "Ingrid Svensson", "Yusuf Diallo", "Elena Vasquez", "Tariq Hassan", "Simone Moreau", "Dmitri Volkov", "Aisha Okonkwo"], createdBy: "Sarah Lin" },
  { id: "3",  name: "Executive News Briefing",       basedOn: "CEO Mentions, Leadership Coverage, ...",            recipients: ["David Marsh", "Antonio Schibono", "Priya Nair", "Tom Reeves", "Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres"], createdBy: "David Marsh" },
  { id: "4",  name: "Competitor Intelligence",       basedOn: "Competitor A, Competitor B, Market Share ...",      recipients: ["Priya Nair"], createdBy: "Priya Nair" },
  { id: "5",  name: "Social Listening Weekly",       basedOn: "Twitter Brand Mentions, Instagram Tags",            recipients: ["Tom Reeves", "Sarah Lin", "James Okoro", "Rachel Kim", "Ben Torres", "Mei Chen"], createdBy: "Tom Reeves" },
  { id: "6",  name: "Crisis & Reputation Alerts",    basedOn: "Negative Sentiment Search, Crisis Keywords",        recipients: ["Antonio Schibono", "David Marsh"], createdBy: "Antonio Schibono" },
  { id: "7",  name: "Industry Trends Digest",        basedOn: "SaaS Industry News, Analyst Reports, ...",          recipients: ["Priya Nair", "Tom Reeves", "Luca Rossi", "Mei Chen"], createdBy: "Priya Nair" },
  { id: "8",  name: "Campaign Performance Roundup",  basedOn: "Q2 Campaign Search, Paid Media Coverage",           recipients: ["Sarah Lin"], createdBy: "Sarah Lin" },
  { id: "9",  name: "Product Launch Tracker",        basedOn: "Product Mentions, Launch Keywords, Reviews",        recipients: ["James Okoro", "Priya Nair", "Ben Torres", "Rachel Kim", "Chloe Dupont", "Marcus Webb", "Ingrid Svensson", "Yusuf Diallo", "Elena Vasquez", "Tariq Hassan", "Simone Moreau"], createdBy: "James Okoro" },
  { id: "10", name: "Monthly Earnings Coverage",     basedOn: "Earnings Call Search, Financial Media",             recipients: ["David Marsh"], createdBy: "David Marsh" },
];

export const DigestsTab = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const toggleAll = () =>
    setSelected(selected.length === digests.length ? [] : digests.map((d) => d.id));

  const toggleOne = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-base font-semibold text-foreground">
            Digests <span className="font-normal text-muted-foreground">({digests.length})</span>
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create Digest
            </Button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left bg-muted/30">
              <th className="px-4 py-2.5 w-10">
                <Checkbox
                  checked={selected.length === digests.length && digests.length > 0}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Based on</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Recipients</th>
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Created by</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {digests.map((digest) => (
              <tr key={digest.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 py-3.5">
                  <Checkbox checked={selected.includes(digest.id)} onCheckedChange={() => toggleOne(digest.id)} />
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-foreground">{digest.name}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{digest.basedOn}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{digest.recipients.slice(0, 2).join(", ")}</span>
                    {digest.recipients.length > 2 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs font-medium text-primary cursor-pointer hover:underline">
                            +{digest.recipients.length - 2} more
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[220px]">
                          <p className="text-xs leading-relaxed">{digest.recipients.slice(2).join(", ")}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-muted-foreground">{digest.createdBy}</span>
                </td>
                <td className="px-4 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-card">
                      <DropdownMenuItem className="cursor-pointer"><Send className="w-4 h-4 mr-2" />Send now</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-2.5 border-t border-border text-right">
          <span className="text-xs text-muted-foreground">1–{digests.length} of {digests.length}</span>
        </div>
      </div>

      <CreateDigestDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};
