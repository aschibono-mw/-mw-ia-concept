import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Plus,
  Search,
  X,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import { AlertType, alertTypeLabels, alertTypeDescriptions } from './types';
import { getAlertIcon } from './alertIcons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockSearches = [
  'Brand Mentions Search',
  'Executive Leadership Coverage',
  'Competitor Analysis',
  'Industry News Search',
  'Influencer Mentions Tracker',
  'Crisis & Reputation Risk',
];

const searchAlertTypes: AlertType[] = [
  'every_mention',
  'follow_post',
  'sentiment_shift',
  'spike_detection',
  'top_reach',
  'x_influencer',
];

const eventAlertTypes: AlertType[] = ['company_events', 'industry_events'];
const socialAlertTypes: AlertType[] = ['likely_boosted'];
const rssAlertTypes: AlertType[] = ['rss_feed'];

const nonSearchAlertTypes: AlertType[] = [...eventAlertTypes, ...socialAlertTypes, ...rssAlertTypes];

const isSearchRelatedType = (type: AlertType) => searchAlertTypes.includes(type);

export const CreateAlertDialog = ({ open, onOpenChange }: CreateAlertDialogProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<AlertType | null>(null);
  const [searchType, setSearchType] = useState<'optimized' | 'standard' | 'custom'>('standard');
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const [relevanceBoost, setRelevanceBoost] = useState(false);
  const [similarMentions, setSimilarMentions] = useState('exclude');
  const [showImages, setShowImages] = useState(true);
  const [notifyMode, setNotifyMode] = useState<'immediate' | 'daily'>('immediate');
  const [recipients, setRecipients] = useState<{ name: string; email: string }[]>([
    { name: 'Mariano Titanti', email: 'mariano.titanti@meltwater.com' },
  ]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState(true);

  const handleReset = () => {
    setStep(1);
    setSelectedType(null);
    setSearchType('standard');
    setSelectedSearches([]);
    setRelevanceBoost(false);
    setSimilarMentions('exclude');
    setShowImages(true);
    setNotifyMode('immediate');
    setRecipients([{ name: 'Mariano Titanti', email: 'mariano.titanti@meltwater.com' }]);
    setRecipientSearch('');
    setDeliveryEmail(true);
  };

  const handleClose = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  const handleNextFromType = () => {
    if (!selectedType) return;
    if (isSearchRelatedType(selectedType)) {
      setStep(2); // go to search selection
    } else {
      setStep(3); // skip search, go to details
    }
  };

  const handleNextFromSearch = () => {
    if (selectedSearches.length > 0) setStep(3);
  };

  const handleSave = () => {
    handleClose(false);
  };

  const removeRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r.email !== email));
  };

  const toggleSearch = (search: string) => {
    setSelectedSearches(prev =>
      prev.includes(search) ? prev.filter(s => s !== search) : prev.length < 10 ? [...prev, search] : prev
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            Create alert
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-6 px-6 pt-4 pb-2">
          <button
            onClick={() => (step === 2 || step === 3) && setStep(1)}
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
              step === 1
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {step > 1 ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                1
              </div>
            )}
            Type
          </button>
          {selectedType && isSearchRelatedType(selectedType) && (
            <button
              onClick={() => step === 3 && setStep(2)}
              className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
                step === 2
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground'
              } ${step < 2 ? 'cursor-default' : 'hover:text-foreground'}`}
              disabled={step < 2}
            >
              {step > 2 ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              ) : (
                <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${
                  step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
              )}
              Search
            </button>
          )}
          <button
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
              step === 3
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            } cursor-default`}
            disabled={step < 3}
          >
            <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${
              step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {selectedType && isSearchRelatedType(selectedType) ? '3' : '2'}
            </div>
            Details
          </button>
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="px-6 pb-6 space-y-6 bg-background/60 mx-0">
            <p className="text-sm text-foreground/70">Select the type of alert you want to create.</p>

            {/* Search-based alerts */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Search alerts</h4>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">These alerts require attaching a search</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {searchAlertTypes.map((type) => {
                  const Icon = getAlertIcon(type);
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {alertTypeLabels[type]}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {alertTypeDescriptions[type]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event alerts */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Event alerts</h4>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">The alerts below can only be created one at a time</p>
              </div>
              <div className="space-y-2">
                {eventAlertTypes.map((type) => {
                  const Icon = getAlertIcon(type);
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {alertTypeLabels[type]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alertTypeDescriptions[type]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social alerts */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Social alerts</h4>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">The alerts below can only be created one at a time</p>
              </div>
              <div className="space-y-2">
                {socialAlertTypes.map((type) => {
                  const Icon = getAlertIcon(type);
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {alertTypeLabels[type]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alertTypeDescriptions[type]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RSS alerts */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">RSS alerts</h4>
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">The alerts below can only be created one at a time</p>
              </div>
              <div className="space-y-2">
                {rssAlertTypes.map((type) => {
                  const Icon = getAlertIcon(type);
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50 shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {alertTypeLabels[type]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {alertTypeDescriptions[type]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button onClick={handleNextFromType} disabled={!selectedType}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Search Selection (only for search-related types) */}
        {step === 2 && (
          <div className="px-6 pb-6 space-y-6 bg-background/60 mx-0">
            <p className="text-sm text-foreground/70">Select the searches to attach to this alert.</p>

            <div className="border border-border/80 rounded-lg p-4 space-y-3 bg-card shadow-sm">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-foreground">Search type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Choose how searches are applied to this alert</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                {(['optimized', 'standard'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      searchType === t
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {t === 'optimized' ? 'Optimized searches' : 'Standard searches'}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-border/80 rounded-lg p-4 space-y-3 bg-card shadow-sm">
              <div>
                <Label className="text-sm font-bold text-foreground">Searches</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Select searches</p>
              </div>
              <p className="text-xs text-muted-foreground">{selectedSearches.length}/10</p>
              {selectedSearches.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSearches.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 text-xs">
                      {s}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSearch(s)} />
                    </Badge>
                  ))}
                </div>
              )}
              <button
                className="text-sm text-primary hover:underline flex items-center gap-1"
                onClick={() => {}}
              >
                <Plus className="w-3.5 h-3.5" />
                Add search
              </button>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {mockSearches.filter(s => !selectedSearches.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSearch(s)}
                    className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleNextFromSearch} disabled={selectedSearches.length === 0}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && selectedType && (
          <div className="px-6 pb-6 space-y-5 bg-background/60">
            <h3 className="text-base font-semibold text-foreground">
              Configure details for {alertTypeLabels[selectedType]} alert
            </h3>

            {/* Relevance Boost */}
            <div className="border border-primary/40 rounded-lg p-4 space-y-3 bg-primary/5 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-sm font-bold text-foreground">Relevance Boost</Label>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Beta</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Reduce noise by prioritizing mentions that match your intent.
              </p>
              <div className="flex items-center justify-between border border-border rounded-md px-3 py-2.5 bg-background">
                <span className="text-sm text-foreground">Enable relevance filtering</span>
                <Switch checked={relevanceBoost} onCheckedChange={setRelevanceBoost} />
              </div>
            </div>

            {/* Settings */}
            <div className="border border-border/80 rounded-lg p-4 space-y-4 bg-card shadow-sm">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-foreground">Settings</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Configure alert behavior</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Similar Mentions</span>
                <Select value={similarMentions} onValueChange={setSimilarMentions}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exclude">Exclude similar mentions</SelectItem>
                    <SelectItem value="include">Include similar mentions</SelectItem>
                    <SelectItem value="group">Group similar mentions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Display</span>
                <div className="flex items-center gap-2">
                  <Checkbox checked={showImages} onCheckedChange={(v) => setShowImages(!!v)} />
                  <span className="text-sm text-foreground">Images</span>
                </div>
              </div>
            </div>

            {/* When to notify */}
            <div className="border border-border/80 rounded-lg p-4 space-y-3 bg-card shadow-sm">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-foreground">When to notify me</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>Choose notification frequency</TooltipContent>
                </Tooltip>
              </div>
              <RadioGroup value={notifyMode} onValueChange={(v) => setNotifyMode(v as 'immediate' | 'daily')}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="immediate" id="notify-immediate" className="mt-1" />
                  <div>
                    <Label htmlFor="notify-immediate" className="text-sm font-medium cursor-pointer">
                      Immediately (every mention)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      You will receive notification for every single mention as they happen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="daily" id="notify-daily" className="mt-1" />
                  <div>
                    <Label htmlFor="notify-daily" className="text-sm font-medium cursor-pointer">
                      Daily threshold (last 24 hours)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Sends an alert as soon as mentions exceed your threshold (24-hour window is fixed)
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Recipients */}
            <div className="border border-border/80 rounded-lg p-4 space-y-3 bg-card shadow-sm">
              <div>
                <Label className="text-sm font-bold text-foreground">Recipients</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Send alerts to the following people</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or enter an email address"
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">{recipients.length}/10</p>
              <div className="space-y-2">
                {recipients.map((r) => (
                  <div key={r.email} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                    <button onClick={() => removeRecipient(r.email)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="border border-border/80 rounded-lg p-4 space-y-3 bg-card shadow-sm">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-bold text-foreground">Delivery method</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>How you receive alerts</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground">How would you like to receive alerts?</p>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Standard</span>
                <div className="flex items-center gap-2">
                  <Checkbox checked={deliveryEmail} onCheckedChange={(v) => setDeliveryEmail(!!v)} />
                  <span className="text-sm text-foreground">Email</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="ghost" onClick={() => selectedType && isSearchRelatedType(selectedType) ? setStep(2) : setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
