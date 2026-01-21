import { Search, LayoutGrid, FileText, Pencil, Star, ChevronDown } from "lucide-react";

interface ListItem {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}

const recentItems: ListItem[] = [
  { 
    icon: <Search className="w-4 h-4 text-muted-foreground" />, 
    label: "Brand + Earnings Risk",
    action: <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
  },
  { 
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />, 
    label: "Weekly Brand Health",
    action: <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
  },
  { 
    icon: <FileText className="w-4 h-4 text-muted-foreground" />, 
    label: "The Daily Media Brief",
    action: <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
  },
  { 
    icon: <Search className="w-4 h-4 text-muted-foreground" />, 
    label: "Competitor Analysis",
    action: <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
  },
  { 
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />, 
    label: "Market Trends Q1",
    action: <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
  },
];

const favoriteItems: ListItem[] = [
  { 
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />, 
    label: "Executive Visibility",
    action: <Star className="w-3.5 h-3.5 text-primary fill-primary" />
  },
  { 
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />, 
    label: "Crisis Watch",
    action: <Star className="w-3.5 h-3.5 text-primary fill-primary" />
  },
  { 
    icon: <FileText className="w-4 h-4 text-muted-foreground" />, 
    label: "The Daily Media Brief",
    action: <Star className="w-3.5 h-3.5 text-primary fill-primary" />
  },
  { 
    icon: <Search className="w-4 h-4 text-muted-foreground" />, 
    label: "Industry Insights",
    action: <Star className="w-3.5 h-3.5 text-primary fill-primary" />
  },
  { 
    icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />, 
    label: "Media Coverage Report",
    action: <Star className="w-3.5 h-3.5 text-primary fill-primary" />
  },
];

interface PanelSectionProps {
  title: string;
  items: ListItem[];
}

const PanelSection = ({ title, items }: PanelSectionProps) => (
  <div className="bg-card rounded-lg border border-border p-4">
    <h3 className="font-semibold text-card-foreground mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2 py-1.5">
          {item.icon}
          <span className="flex-1 text-sm text-card-foreground truncate cursor-pointer hover:underline">
            {item.label}
          </span>
          {item.action}
        </li>
      ))}
    </ul>
    <button className="flex items-center justify-center gap-1 w-full mt-3 text-sm text-muted-foreground hover:text-foreground">
      Show more
      <ChevronDown className="w-4 h-4" />
    </button>
  </div>
);

export const RightPanel = () => {
  return (
    <div className="w-64 space-y-4">
      <PanelSection title="Recents" items={recentItems} />
      <PanelSection title="Favorites" items={favoriteItems} />
    </div>
  );
};
