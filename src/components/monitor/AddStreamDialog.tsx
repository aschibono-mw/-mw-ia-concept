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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExploreSearch } from './types';
import { Search, Plus, Check, Sparkles, Send, Code } from 'lucide-react';
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
  const [searchDescription, setSearchDescription] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [showBoolean, setShowBoolean] = useState(false);
  const [generatedBoolean, setGeneratedBoolean] = useState('');

  const suggestionChips = ['brand mentions', 'competitor tracking', 'executive coverage', 'industry news'];

  const filteredSearches = existingSearches.filter((search) =>
    search.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const generateMockBoolean = (input: string): string => {
    const keywords = input.split(/\s+/).filter(word => word.length > 2);
    if (keywords.length === 0) return `"${input}"`;
    
    if (keywords.length === 1) {
      return `("${keywords[0]}" OR "${keywords[0]}s" OR "${keywords[0]} news") AND (article OR post OR mention) AND NOT (spam OR "not relevant")`;
    }
    
    const orTerms = keywords.map(k => `"${k}"`).join(' OR ');
    return `(${orTerms}) AND (news OR social OR online OR article) AND NOT (spam OR advertisement OR "not relevant")`;
  };

  const handleSearchDescriptionChange = (value: string) => {
    setSearchDescription(value);
    if (value.trim()) {
      setGeneratedBoolean(generateMockBoolean(value));
    } else {
      setGeneratedBoolean('');
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'existing' && selectedSearch && streamName) {
      onAddStream(streamName, selectedSearch);
    } else if (activeTab === 'new' && searchDescription && streamName) {
      const newSearch: ExploreSearch = {
        id: `new-${Date.now()}`,
        name: searchDescription.length > 40 ? searchDescription.substring(0, 40) + '...' : searchDescription,
        category: 'Custom',
      };
      onAddStream(streamName, newSearch);
    }
    
    // Reset state
    setStreamName('');
    setSelectedSearch(null);
    setSearchDescription('');
    setSearchFilter('');
    setGeneratedBoolean('');
    setShowBoolean(false);
    onOpenChange(false);
  };

  const isValid = streamName && (
    (activeTab === 'existing' && selectedSearch) ||
    (activeTab === 'new' && searchDescription.trim())
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

            <TabsContent value="new" className="space-y-4 mt-4">
              {/* View Boolean Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Describe what you want to monitor.
                </p>
                <button
                  onClick={() => setShowBoolean(!showBoolean)}
                  className="flex items-center gap-1.5 text-xs font-medium text-foreground underline hover:text-primary transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  {showBoolean ? 'Hide boolean' : 'View boolean'}
                </button>
              </div>

              {/* Boolean Query Display */}
              {showBoolean && (
                <div className="rounded-md border border-border bg-muted/30 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Boolean Query</span>
                    {generatedBoolean && (
                      <button 
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                        onClick={() => navigator.clipboard.writeText(generatedBoolean)}
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  <div className="p-3 max-h-24 overflow-y-auto">
                    {generatedBoolean ? (
                      <code className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap break-all">
                        {generatedBoolean}
                      </code>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Your boolean query will appear here as you build your search.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Textarea 
                    placeholder='e.g., "track mentions of our CEO in tech news" or just "brand crisis"'
                    value={searchDescription}
                    onChange={(e) => handleSearchDescriptionChange(e.target.value)}
                    className="min-h-[70px] max-h-32 resize-none bg-background border-border pr-16"
                    rows={2}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                    ⏎ to send
                  </div>
                </div>
                <Button 
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  disabled={!searchDescription.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Helper chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Try:</span>
                {suggestionChips.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearchDescriptionChange(suggestion)}
                    className="text-xs px-2 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
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
