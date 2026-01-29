import { Plus, Tag, Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryItem {
  name: string;
  count: number;
}

interface TagItem {
  name: string;
}

interface CategoriesPanelProps {
  categories: CategoryItem[];
  onAddCategory: () => void;
}

const defaultTags: TagItem[] = [
  { name: "Q4 Earnings" },
  { name: "Product Launch" },
  { name: "Executive" },
  { name: "Sustainability" },
  { name: "AI/ML" },
  { name: "Regulatory" },
  { name: "M&A" },
  { name: "Crisis" },
  { name: "Leadership" },
  { name: "Innovation" },
  { name: "Partnerships" },
  { name: "Strategy" },
  { name: "Tech" },
  { name: "Finance" },
  { name: "Legal" },
  { name: "HR" },
];

export const CategoriesPanel = ({ categories, onAddCategory }: CategoriesPanelProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Folders Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-card-foreground">Folders</h3>
        <button 
          className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={onAddCategory}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <ScrollArea className="h-56">
        <ul className="space-y-2 pr-3">
          {categories.map((category) => (
            <li key={category.name}>
              <button className="flex items-center gap-2 text-sm text-foreground hover:text-primary cursor-pointer">
                <Folder className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="underline">{category.name} ({category.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Labels Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-card-foreground">Labels</h3>
        <button 
          className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <ScrollArea className="h-32">
        <div className="flex flex-wrap gap-2 pr-3">
          {defaultTags.map((tag) => (
            <span 
              key={tag.name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
