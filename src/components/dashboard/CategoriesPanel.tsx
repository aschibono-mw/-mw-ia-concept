import { Plus, Tag, Folder } from "lucide-react";

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
];

export const CategoriesPanel = ({ categories, onAddCategory }: CategoriesPanelProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Folders Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Folders</h3>
        <button 
          className="w-7 h-7 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={onAddCategory}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name}>
            <button className="flex items-center gap-2 text-sm text-foreground hover:text-primary cursor-pointer">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <span className="underline">{category.name} ({category.count})</span>
            </button>
          </li>
        ))}
      </ul>

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
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
};