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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
    if (selectedSearches.length === 0) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (selectedTypes.length === 0) return;
    setStep(3);
  };

  const handleNextFromDetails = () => {
    setStep(4);
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

  const renderTypeCard = (type: AlertType) => {
    const Icon = getAlertIcon(type);
    const isSelected = selectedTypes.includes(type);
    return (
      <button
        key={type}
        onClick={() => toggleType(type)}
        className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
            : 'border-border hover:border-foreground/20'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isSelected ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-foreground/50'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {alertTypeLabels[type]}
            </p>
            {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
          </div>
          <p className="text-xs text-foreground/50 line-clamp-2 mt-0.5 leading-relaxed">
            {alertTypeDescriptions[type]}
          </p>
        </div>
      </button>
    );
  };

  const SectionLabel = ({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) => (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold text-foreground">{children}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3.5 h-3.5 text-foreground/30" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  const CategoryLabel = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-[11px] font-semibold text-foreground/40 uppercase tracking-widest">{children}</h4>
  );

  const StepFooter = ({ onBack, onNext, nextLabel = 'Next', nextDisabled = false }: {
    onBack?: () => void;
    onNext: () => void;
    nextLabel?: string;
    nextDisabled?: boolean;
  }) => (
    <div className="flex items-center justify-end gap-2 pt-5 mt-2">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          Back
        </Button>
      )}
      <Button size="sm" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto p-0 bg-card border-border">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            Create alert
          </DialogTitle>

          {/* Step Indicators */}
          <div className="flex items-center gap-6 mt-5">
            {([
              { num: 1, label: 'Searches' },
              { num: 2, label: 'Alert Types' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Preview' },
            ] as const).map(({ num, label }) => (
              <button
                key={num}
                onClick={() => step > num && setStep(num as 1 | 2 | 3 | 4)}
                disabled={step < num}
                className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                  step === num ? 'text-primary' : step > num ? 'text-foreground/70 hover:text-foreground cursor-pointer' : 'text-foreground/30 cursor-default'
                }`}
              >
                {step > num ? (
                  <div className="w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                ) : (
                  <div className={`w-[18px] h-[18px] rounded-full text-[10px] flex items-center justify-center font-bold ${
                    step === num ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-foreground/40'
                  }`}>{num}</div>
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Search Selection */}
        {step === 1 && (
          <div className="px-6 pb-6 space-y-5">
            <p className="text-sm text-foreground/50">Select the searches to attach to your alert.</p>

            {/* Search type */}
            <div className="space-y-2">
              <SectionLabel tooltip="Choose how searches are applied to this alert">Search type</SectionLabel>
              <div className="flex gap-1.5">
                {(['optimized', 'standard'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-3 py-1.5 text-[13px] rounded-md border font-medium transition-colors ${
                      searchType === t
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {t === 'optimized' ? 'Optimized searches' : 'Standard searches'}
                  </button>
                ))}
              </div>
            </div>

            {/* Searches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <SectionLabel>Searches</SectionLabel>
                  <p className="text-xs text-foreground/40 mt-0.5">Select searches to attach to this alert</p>
                </div>
                <button
                  className="text-[13px] text-primary hover:underline flex items-center gap-1 font-medium"
                  onClick={() => {}}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add search
                </button>
              </div>
              <p className="text-xs text-foreground/40">{selectedSearches.length}/10</p>
              {selectedSearches.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSearches.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 text-xs font-medium">
                      {s}
                      <X className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" onClick={() => toggleSearch(s)} />
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-px rounded-lg overflow-hidden">
                {mockSearches.map((s) => {
                  const isSelected = selectedSearches.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSearch(s)}
                      className={`w-full text-left text-[13px] px-3 py-2.5 flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-primary/5 text-primary font-medium' : 'hover:bg-muted/60 text-foreground'
                      }`}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <StepFooter onNext={handleNextFromStep1} nextDisabled={selectedSearches.length === 0} />
          </div>
        )}

        {/* Step 2: Alert Type Selection */}
        {step === 2 && (
          <div className="px-6 pb-6 space-y-5">
            <p className="text-sm text-foreground/50">Select one or more alert types to create.</p>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <CategoryLabel>Search alerts</CategoryLabel>
                <div className="grid grid-cols-2 gap-2">
                  {searchAlertTypes.map((type) => renderTypeCard(type))}
                </div>
              </div>

              <div className="space-y-2.5">
                <CategoryLabel>Event alerts</CategoryLabel>
                <div className="grid grid-cols-2 gap-2">
                  {eventAlertTypes.map((type) => renderTypeCard(type))}
                </div>
              </div>

              <div className="space-y-2.5">
                <CategoryLabel>Social alerts</CategoryLabel>
                <div className="grid grid-cols-2 gap-2">
                  {socialAlertTypes.map((type) => renderTypeCard(type))}
                </div>
              </div>

              <div className="space-y-2.5">
                <CategoryLabel>RSS alerts</CategoryLabel>
                <div className="grid grid-cols-2 gap-2">
                  {rssAlertTypes.map((type) => renderTypeCard(type))}
                </div>
              </div>
            </div>

            <StepFooter onBack={() => setStep(1)} onNext={handleNextFromStep2} nextDisabled={selectedTypes.length === 0} />
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 space-y-5">
            <p className="text-sm text-foreground/50">
              Configure details for {selectedTypes.length === 1 ? alertTypeLabels[primaryType] : `${selectedTypes.length} alert types`}
            </p>

            {/* Relevance Boost */}
            <div className="p-4 space-y-2.5 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Relevance Boost</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">Beta</Badge>
              </div>
              <p className="text-xs text-foreground/50">
                Reduce noise by prioritizing mentions that match your intent.
              </p>
              <div className="flex items-center justify-between border border-border rounded-md px-3 py-2.5 bg-card">
                <span className="text-[13px] text-foreground">Enable relevance filtering</span>
                <Switch checked={relevanceBoost} onCheckedChange={setRelevanceBoost} />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <SectionLabel tooltip="Configure alert behavior">Settings</SectionLabel>
              <div className="space-y-1.5">
                <CategoryLabel>Similar Mentions</CategoryLabel>
                <Select value={similarMentions} onValueChange={setSimilarMentions}>
                  <SelectTrigger className="w-full text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exclude">Exclude similar mentions</SelectItem>
                    <SelectItem value="include">Include similar mentions</SelectItem>
                    <SelectItem value="group">Group similar mentions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <CategoryLabel>Display</CategoryLabel>
                <div className="flex items-center gap-2">
                  <Checkbox checked={showImages} onCheckedChange={(v) => setShowImages(!!v)} />
                  <span className="text-[13px] text-foreground">Images</span>
                </div>
              </div>
            </div>

            {/* When to notify */}
            <div className="space-y-3">
              <SectionLabel tooltip="Choose notification frequency">When to notify me</SectionLabel>
              <RadioGroup value={notifyMode} onValueChange={(v) => setNotifyMode(v as 'immediate' | 'daily')}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors -mx-3">
                  <RadioGroupItem value="immediate" id="notify-immediate" className="mt-0.5" />
                  <div>
                    <Label htmlFor="notify-immediate" className="text-[13px] font-semibold cursor-pointer text-foreground">
                      Immediately (every mention)
                    </Label>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      You will receive notification for every single mention as they happen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors -mx-3">
                  <RadioGroupItem value="daily" id="notify-daily" className="mt-0.5" />
                  <div>
                    <Label htmlFor="notify-daily" className="text-[13px] font-semibold cursor-pointer text-foreground">
                      Daily threshold (last 24 hours)
                    </Label>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      Sends an alert as soon as mentions exceed your threshold (24-hour window is fixed)
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Recipients */}
            <div className="space-y-2.5">
              <div>
                <SectionLabel>Recipients</SectionLabel>
                <p className="text-xs text-foreground/40 mt-0.5">Send alerts to the following people</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <Input
                  placeholder="Search by name or enter an email address"
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="pl-9 text-[13px]"
                />
              </div>
              <p className="text-xs text-foreground/40">{recipients.length}/10</p>
              <div className="space-y-1.5">
                {recipients.map((r) => (
                  <div key={r.email} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{r.name}</p>
                        <p className="text-xs text-foreground/40">{r.email}</p>
                      </div>
                    </div>
                    <button onClick={() => removeRecipient(r.email)} className="text-foreground/30 hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-2.5">
              <SectionLabel tooltip="How you receive alerts">Delivery method</SectionLabel>
              <p className="text-xs text-foreground/40">How would you like to receive alerts?</p>
              <div className="space-y-1.5">
                <CategoryLabel>Standard</CategoryLabel>
                <div className="flex items-center gap-2">
                  <Checkbox checked={deliveryEmail} onCheckedChange={(v) => setDeliveryEmail(!!v)} />
                  <span className="text-[13px] text-foreground">Email</span>
                </div>
              </div>
            </div>

            <StepFooter onBack={() => setStep(2)} onNext={handleNextFromDetails} />
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 space-y-5">
            {/* Estimated Alert Volume */}
            <div className={`space-y-2 ${isHighVolume ? 'p-4 bg-destructive/5 rounded-lg' : ''}`}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground/40" />
                <span className="text-sm font-semibold text-foreground">Estimated alert volume</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">~{estimatedAlerts.toLocaleString()}</span>
                <span className="text-sm text-foreground/50">emails per day</span>
              </div>
              <p className="text-xs text-foreground/40">
                Based on {selectedSearches.length || 1} search{(selectedSearches.length || 1) > 1 ? 'es' : ''} × {recipients.length} recipient{recipients.length > 1 ? 's' : ''} × {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} × {notifyMode === 'immediate' ? 'every mention' : 'daily digest'}
              </p>

              {isHighVolume && (
                <div className="flex items-start gap-2 mt-1 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[13px] font-semibold text-destructive">High alert volume detected</p>
                    <p className="text-xs text-destructive/70">
                      This configuration will generate a large number of emails. Consider these changes:
                    </p>
                    <ul className="text-xs text-destructive/70 list-disc pl-4 space-y-0.5">
                      <li>Switch to <button className="underline font-medium" onClick={() => { setNotifyMode('daily'); setStep(3); }}>Daily threshold</button> instead of immediate notifications</li>
                      {selectedSearches.length > 2 && (
                        <li>Reduce the number of attached searches (currently {selectedSearches.length})</li>
                      )}
                      {!relevanceBoost && (
                        <li>Enable <button className="underline font-medium" onClick={() => { setRelevanceBoost(true); setStep(3); }}>Relevance Boost</button> to filter noise</li>
                      )}
                      <li>Use a more specific alert type like Spike Detection or Top Reach</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Types Summary */}
            {selectedTypes.length > 1 && (
              <div>
                <span className="text-sm font-semibold text-foreground">Alert types being created</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTypes.map(type => {
                    const Icon = getAlertIcon(type);
                    return (
                      <Badge key={type} variant="secondary" className="gap-1.5 text-xs py-1 font-medium">
                        <Icon className="w-3 h-3" />
                        {alertTypeLabels[type]}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email Preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-foreground/40" />
                <span className="text-sm font-semibold text-foreground">Email preview</span>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="max-w-md mx-auto bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {(() => { const Icon = getAlertIcon(primaryType); return <Icon className="w-5 h-5 text-primary" />; })()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{alertTypeLabels[primaryType]} Alert</p>
                        <p className="text-xs text-foreground/50">{selectedSearches[0] || 'Your Search'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Why you received this</p>
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
                          <p className="text-[10px] text-foreground/40">News | US | Feb 10, 2:36 PM</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary flex items-center gap-0.5 shrink-0 font-medium">
                        View article <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground leading-snug mb-2">
                      Sample Article Title: Breaking News Coverage Related to Your Brand Monitoring Search
                    </h4>
                    <p className="text-xs text-foreground/50 leading-relaxed">
                      The article discusses developments related to your search query, demonstrating how mentions appear in your alert emails...
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📈</span>
                        <span className="text-xs font-medium text-foreground">649.7k Reach</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        <span className="text-xs text-foreground/50">Neutral Sentiment</span>
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <span className="text-xs text-primary cursor-pointer font-medium">Tag</span>
                        <span className="text-xs text-primary cursor-pointer font-medium">Share</span>
                      </div>
                    </div>
                  </div>

                  <div className="mx-5 mb-4 p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs font-medium text-foreground mb-2">Was this alert helpful?</p>
                    <div className="flex items-center justify-center gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-foreground font-medium">
                        <ThumbsUp className="w-3 h-3" /> Yes
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-foreground font-medium">
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

            <StepFooter onBack={() => setStep(3)} onNext={handleSave} nextLabel="Save" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
