import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExploreSearch } from './types';
import { Search, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSearches: ExploreSearch[];
  onAddStream: (streamName: string, search: ExploreSearch) => void;
}

export const AddStreamDialog = ({
  open,
  onOpenChange,
  existingSearches,
  onAddStream,
}: AddStreamDialogProps) => {
  const [activeTab, setActiveTab] = useState('existing');
  const [streamName, setStreamName] = useState('');
  const [selectedSearch, setSelectedSearch] = useState<ExploreSearch | null>(null);
  const [newSearchName, setNewSearchName] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredSearches = existingSearches.filter((search) =>
    search.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSubmit = () => {
    if (activeTab === 'existing' && selectedSearch && streamName) {
      onAddStream(streamName, selectedSearch);
    } else if (activeTab === 'new' && newSearchName && streamName) {
      const newSearch: ExploreSearch = {
        id: `new-${Date.now()}`,
        name: newSearchName,
        category: 'Custom',
      };
      onAddStream(streamName, newSearch);
    }
    
    // Reset state
    setStreamName('');
    setSelectedSearch(null);
    setNewSearchName('');
    setSearchFilter('');
    onOpenChange(false);
  };

  const isValid = streamName && (
    (activeTab === 'existing' && selectedSearch) ||
    (activeTab === 'new' && newSearchName)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Stream</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="stream-name">Stream Name</Label>
            <Input
              id="stream-name"
              placeholder="e.g., Brand Mentions, Competitor News"
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Use Existing Search</TabsTrigger>
              <TabsTrigger value="new">Create New Search</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter searches..."
                  className="pl-9"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                {filteredSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => setSelectedSearch(search)}
                    className={cn(
                      'w-full flex items-center justify-between p-2 rounded-md text-left text-sm transition-colors',
                      selectedSearch?.id === search.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <div>
                      <div className="font-medium">{search.name}</div>
                      <div className={cn(
                        'text-xs',
                        selectedSearch?.id === search.id
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}>
                        {search.category}
                      </div>
                    </div>
                    {selectedSearch?.id === search.id && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
                {filteredSearches.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No searches found
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label htmlFor="new-search-name">Search Name</Label>
                <Input
                  id="new-search-name"
                  placeholder="e.g., Industry News, Market Trends"
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will create a new explore search that you can configure later with keywords and filters.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stream
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
