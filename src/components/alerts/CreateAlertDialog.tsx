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
  Mail,
  AlertTriangle,
  Eye,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
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

const isSearchRelatedType = (type: AlertType) => searchAlertTypes.includes(type);

export const CreateAlertDialog = ({ open, onOpenChange }: CreateAlertDialogProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTypes, setSelectedTypes] = useState<AlertType[]>([]);
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
    setSelectedTypes([]);
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

  const toggleType = (type: AlertType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const hasSearchRelatedType = selectedTypes.some(isSearchRelatedType);

  const handleNextFromStep1 = () => {
    if (selectedTypes.length === 0) return;
    if (hasSearchRelatedType && selectedSearches.length === 0) return;
    setStep(2);
  };

  const handleNextFromDetails = () => {
    setStep(3);
  };

  const handleSave = () => {
    handleClose(false);
  };

  const getEstimatedAlertCount = () => {
    const searchCount = selectedSearches.length || 1;
    const recipientCount = recipients.length || 1;
    if (notifyMode === 'immediate') {
      const basePerDay = selectedTypes.includes('every_mention') ? 120 : selectedTypes.includes('spike_detection') ? 8 : 25;
      return basePerDay * searchCount * recipientCount * (selectedTypes.length || 1);
    }
    return searchCount * recipientCount;
  };

  const estimatedAlerts = getEstimatedAlertCount();
  const isHighVolume = notifyMode === 'immediate' && estimatedAlerts > 50;

  const removeRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r.email !== email));
  };

  const toggleSearch = (search: string) => {
    setSelectedSearches(prev =>
      prev.includes(search) ? prev.filter(s => s !== search) : prev.length < 10 ? [...prev, search] : prev
    );
  };

  const primaryType = selectedTypes[0] || 'every_mention';

  const renderTypeCard = (type: AlertType, layout: 'grid' | 'list' = 'grid') => {
    const Icon = getAlertIcon(type);
    const isSelected = selectedTypes.includes(type);
    return (
      <button
        key={type}
        onClick={() => toggleType(type)}
        className={`${layout === 'list' ? 'w-full' : ''} flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
            : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isSelected ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {alertTypeLabels[type]}
            </p>
            {isSelected && <Check className="w-4 h-4 text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {alertTypeDescriptions[type]}
          </p>
        </div>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            Create alert
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 px-6 pt-4 pb-2 border-b border-border">
          <button
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
              step === 1 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {step > 1 ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">1</div>
            )}
            Setup
          </button>

          <button
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
              step === 2 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            } ${step < 2 ? 'cursor-default' : 'hover:text-foreground'}`}
            disabled={step < 2}
            onClick={() => step > 2 && setStep(2)}
          >
            {step > 2 ? (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${
                step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>2</div>
            )}
            Details
          </button>

          <button
            className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
              step === 3 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            } cursor-default`}
            disabled={step < 3}
          >
            <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${
              step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>3</div>
            Preview
          </button>
        </div>

        {/* Step 1: Search + Type Selection */}
        {step === 1 && (
          <div className="px-6 pb-6 bg-card mx-0">
            <p className="text-sm font-medium text-muted-foreground py-4">Select your searches and alert types.</p>

            {/* Search selection - always shown first */}
            <div className="border-b border-border pb-4 mb-4 space-y-3">
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

            <div className="border-b border-border pb-4 mb-4 space-y-3">
              <div>
                <Label className="text-sm font-bold text-foreground">Searches</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Select searches to attach to this alert</p>
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

            {/* Alert type selection - only shown after searches are selected */}
            {selectedSearches.length > 0 && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-sm font-bold text-foreground">Alert types</Label>
                    {selectedTypes.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{selectedTypes.length} selected</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Select one or more alert types to create.</p>
                </div>

                {/* Search-based alerts */}
                <div className="border-b border-border pb-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Search alerts</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {searchAlertTypes.map((type) => renderTypeCard(type, 'grid'))}
                  </div>
                </div>

                {/* Event alerts */}
                <div className="border-b border-border py-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Event alerts</h4>
                  <div className="space-y-2">
                    {eventAlertTypes.map((type) => renderTypeCard(type, 'list'))}
                  </div>
                </div>

                {/* Social alerts */}
                <div className="border-b border-border py-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Social alerts</h4>
                  <div className="space-y-2">
                    {socialAlertTypes.map((type) => renderTypeCard(type, 'list'))}
                  </div>
                </div>

                {/* RSS alerts */}
                <div className="pt-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">RSS alerts</h4>
                  <div className="space-y-2">
                    {rssAlertTypes.map((type) => renderTypeCard(type, 'list'))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center pt-4 border-t border-border mt-4">
              <Button
                onClick={handleNextFromStep1}
                disabled={selectedTypes.length === 0 || (hasSearchRelatedType && selectedSearches.length === 0)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 bg-card">
            <h3 className="text-base font-semibold text-foreground py-4 border-b border-border">
              Configure details for {selectedTypes.length === 1 ? alertTypeLabels[primaryType] : `${selectedTypes.length} alert types`}
            </h3>

            {/* Relevance Boost */}
            <div className="py-4 border-b border-border space-y-3 bg-primary/5 -mx-6 px-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-sm font-bold text-foreground">Relevance Boost</Label>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Beta</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Reduce noise by prioritizing mentions that match your intent.
              </p>
              <div className="flex items-center justify-between border border-border rounded-md px-3 py-2.5 bg-card">
                <span className="text-sm text-foreground">Enable relevance filtering</span>
                <Switch checked={relevanceBoost} onCheckedChange={setRelevanceBoost} />
              </div>
            </div>

            {/* Settings */}
            <div className="py-4 border-b border-border space-y-4">
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
            <div className="py-4 border-b border-border space-y-3">
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
            <div className="py-4 border-b border-border space-y-3">
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
            <div className="py-4 space-y-3">
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
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleNextFromDetails}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 bg-card">
            {/* Estimated Alert Volume */}
            <div className={`py-4 border-b border-border space-y-2 ${
              isHighVolume ? 'bg-destructive/5 -mx-6 px-6' : ''
            }`}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm font-bold text-foreground">Estimated alert volume</Label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-foreground">~{estimatedAlerts.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">
                  {notifyMode === 'immediate' ? 'emails per day' : 'emails per day'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {selectedSearches.length || 1} search{(selectedSearches.length || 1) > 1 ? 'es' : ''} × {recipients.length} recipient{recipients.length > 1 ? 's' : ''} × {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} × {notifyMode === 'immediate' ? 'every mention' : 'daily digest'}
              </p>

              {isHighVolume && (
                <div className="flex items-start gap-2 mt-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">High alert volume detected</p>
                    <p className="text-xs text-destructive/80">
                      This configuration will generate a large number of emails. Consider these changes:
                    </p>
                    <ul className="text-xs text-destructive/80 list-disc pl-4 space-y-0.5">
                      <li>Switch to <button className="underline font-medium" onClick={() => { setNotifyMode('daily'); setStep(2); }}>Daily threshold</button> instead of immediate notifications</li>
                      {selectedSearches.length > 2 && (
                        <li>Reduce the number of attached searches (currently {selectedSearches.length})</li>
                      )}
                      {!relevanceBoost && (
                        <li>Enable <button className="underline font-medium" onClick={() => { setRelevanceBoost(true); setStep(2); }}>Relevance Boost</button> to filter noise</li>
                      )}
                      <li>Use a more specific alert type like Spike Detection or Top Reach</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Types Summary */}
            {selectedTypes.length > 1 && (
              <div className="py-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-sm font-bold text-foreground">Alert types being created</Label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTypes.map(type => {
                    const Icon = getAlertIcon(type);
                    return (
                      <Badge key={type} variant="secondary" className="gap-1.5 text-xs py-1">
                        <Icon className="w-3 h-3" />
                        {alertTypeLabels[type]}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email Preview */}
            <div className="py-4 border-b border-border overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-foreground/60" />
                <span className="text-sm font-bold text-foreground">Email preview</span>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="max-w-md mx-auto bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {(() => { const Icon = getAlertIcon(primaryType); return <Icon className="w-5 h-5 text-primary" />; })()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{alertTypeLabels[primaryType]} Alert</p>
                        <p className="text-xs text-muted-foreground">{selectedSearches[0] || 'Your Search'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-b border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Why you received this</p>
                    <p className="text-xs text-foreground">
                      This article matched your search: <span className="font-semibold">"{selectedSearches[0] || 'Brand Monitoring'}"</span>
                    </p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">keyword match</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">brand</span>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded bg-destructive/10 text-destructive text-[10px] font-bold flex items-center justify-center">Y!</div>
                        <div>
                          <p className="text-xs font-medium text-foreground">News Source · Wire Service</p>
                          <p className="text-[10px] text-muted-foreground">News | US | Feb 10, 2:36 PM</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary flex items-center gap-0.5 shrink-0">
                        View article <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground leading-snug mb-2">
                      Sample Article Title: Breaking News Coverage Related to Your Brand Monitoring Search
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The article discusses developments related to your search query, demonstrating how mentions appear in your alert emails...
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📈</span>
                        <span className="text-xs font-medium text-foreground">649.7k Reach</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        <span className="text-xs text-muted-foreground">Neutral Sentiment</span>
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <span className="text-xs text-primary cursor-pointer">Tag</span>
                        <span className="text-xs text-primary cursor-pointer">Share</span>
                      </div>
                    </div>
                  </div>

                  <div className="mx-5 mb-4 p-3 rounded-lg bg-muted border border-border text-center">
                    <p className="text-xs font-medium text-foreground mb-2">Was this alert helpful?</p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground">
                        <ThumbsUp className="w-3 h-3" /> Yes
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground">
                        <ThumbsDown className="w-3 h-3" /> No
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pb-4 flex items-center justify-center gap-3">
                    <button className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-xs font-medium">
                      Edit alert frequency
                    </button>
                    <button className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground">
                      View all alerts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => setStep(2)}>
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
