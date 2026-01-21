import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Search, ChevronDown, Star, MoreVertical, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchItem {
  id: number;
  name: string;
  category: string;
  lastEdited: string;
  owner: string;
  starred?: boolean;
}

const searchItems: SearchItem[] = [
  { id: 1, name: "Brand + Earnings Risk", category: "Brand", lastEdited: "3 hrs ago", owner: "Rachel Wu", starred: true },
  { id: 2, name: "Regulatory & Policy Mentions", category: "Policy", lastEdited: "7 hrs ago", owner: "Sophia Patel", starred: true },
  { id: 3, name: "Executive Leadership Coverage", category: "Leadership", lastEdited: "Yesterday", owner: "Tom Nguyen", starred: true },
  { id: 4, name: "Industry Layoffs & Restructuring", category: "Leadership", lastEdited: "2 days ago", owner: "David Kim", starred: true },
  { id: 5, name: "Brand Sentiment Watch", category: "Brand", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true },
  { id: 6, name: "M&A and Acquisition Activity", category: "Competition", lastEdited: "2 days ago", owner: "Alex Morgan", starred: true },
  { id: 7, name: "Social Backlash Monitoring", category: "Social", lastEdited: "4 days ago", owner: "Sophia Patel", starred: true },
  { id: 8, name: "Influencer Mentions Tracker", category: "Social", lastEdited: "5 days ago", owner: "Laura Burn..", starred: true },
  { id: 9, name: "Crisis & Reputation Risk", category: "Crisis", lastEdited: "Nov 20", owner: "Tom Nguyen", starred: true },
];

const categories = [
  { name: "Brand", count: 24 },
  { name: "Market", count: 20 },
  { name: "Competition", count: 17 },
  { name: "Social", count: 12 },
  { name: "Leadership", count: 10 },
  { name: "Finance", count: 5 },
  { name: "Product", count: 5 },
  { name: "Policy", count: 4 },
  { name: "Risk", count: 1 },
  { name: "Crisis", count: 1 },
];

const Discover = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === searchItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(searchItems.map(item => item.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="discover" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Discover and explore media coverage in one place
              </h1>
              <p className="text-sm text-muted-foreground">
                Build searches across news, social, and online sources.
              </p>
            </div>

            {/* Build a new search */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <button className="w-full flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-card-foreground">Build a new search</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-6 items-start">
              {/* Main Table */}
              <div className="flex-1 bg-card rounded-lg border border-border">
                {/* Table Header Controls */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <button className="flex items-center gap-1 font-semibold text-card-foreground">
                    Recent
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground">
                    Owner: Anyone
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-4 w-10">
                        <Checkbox 
                          checked={selectedItems.length === searchItems.length}
                          onCheckedChange={toggleAll}
                        />
                      </th>
                      <th className="p-4 text-sm font-bold text-foreground">Name</th>
                      <th className="p-4 text-sm font-bold text-foreground">Category</th>
                      <th className="p-4 text-sm font-bold text-foreground">
                        <button className="flex items-center gap-1">
                          Last edited
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="p-4 text-sm font-bold text-foreground">Owner</th>
                      <th className="p-4 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchItems.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox 
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground underline cursor-pointer hover:text-primary">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-foreground underline cursor-pointer hover:text-primary">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
                            <span className="text-sm text-foreground cursor-pointer hover:text-primary">{item.owner}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                            <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Categories Sidebar */}
              <div className="w-64 sticky top-20">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-card-foreground">Categories</h3>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <button className="text-sm text-foreground hover:text-primary hover:underline cursor-pointer">
                          {category.name} ({category.count})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
