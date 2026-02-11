import { useState } from 'react';
import {
  Dialog,
  DialogContent,
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
  HelpCircle,
  Mail,
  AlertTriangle,
  Eye,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Bell,
  Clock,
  MessageSquare,
  Webhook,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
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
  { name: 'Brand Coverage', type: 'Standard' },
  { name: 'Crisis Keywords', type: 'Standard' },
  { name: 'Competitor A', type: 'Optimized' },
  { name: 'Product Launches', type: 'Standard' },
  { name: 'CEO Name', type: 'Optimized' },
  { name: 'Industry News', type: 'Standard' },
];

const searchAlertTypes: AlertType[] = [
  'every_mention', 'follow_post', 'sentiment_shift',
  'spike_detection', 'top_reach', 'x_influencer',
];
const eventAlertTypes: AlertType[] = ['company_events', 'industry_events'];
const socialAlertTypes: AlertType[] = ['likely_boosted'];
const rssAlertTypes: AlertType[] = ['rss_feed'];

// ─── Shared UI primitives ───────────────────────────────────────────

const Panel = ({ title, subtitle, children, className = '' }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={`rounded-lg border border-border bg-card ${className}`}>
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <div>{children}</div>
  </div>
);

const CategoryLabel = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{children}</h4>
);

const SectionLabel = ({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) => (
  <div className="flex items-center gap-1.5 mb-1">
    <span className="text-sm font-bold text-foreground">{children}</span>
    {tooltip && (
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )}
  </div>
);

const StepFooter = ({ onBack, onNext, nextLabel = 'Next', nextDisabled = false }: {
  onBack?: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean;
}) => (
  <div className="flex items-center justify-end gap-2 pt-4">
    {onBack && <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>}
    <Button size="sm" onClick={onNext} disabled={nextDisabled}>{nextLabel}</Button>
  </div>
);

// ─── Stepper ────────────────────────────────────────────────────────

const steps = [
  { num: 1, label: 'Searches' },
  { num: 2, label: 'Alert Types' },
  { num: 3, label: 'Details' },
  { num: 4, label: 'Preview' },
] as const;

const Stepper = ({ current, onNavigate }: { current: number; onNavigate: (n: 1|2|3|4) => void }) => (
  <div className="flex items-center gap-0 mt-5">
    {steps.map(({ num, label }, idx) => {
      const done = current > num;
      const active = current === num;
      const future = current < num;
      return (
        <div key={num} className="flex items-center">
          <button
            onClick={() => done && onNavigate(num as 1|2|3|4)}
            disabled={!done}
            className={`flex items-center gap-2 px-1 py-1 rounded-md transition-colors ${
              done ? 'cursor-pointer hover:bg-muted/60' : future ? 'cursor-default' : ''
            }`}
          >
            <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 transition-colors ${
              done ? 'bg-primary text-primary-foreground' :
              active ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : num}
            </div>
            <span className={`text-[13px] font-medium whitespace-nowrap ${
              active ? 'text-foreground' : done ? 'text-foreground/70' : 'text-muted-foreground'
            }`}>{label}</span>
          </button>
          {idx < steps.length - 1 && (
            <div className={`w-8 h-px mx-1 ${done ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main component ─────────────────────────────────────────────────

export const CreateAlertDialog = ({ open, onOpenChange }: CreateAlertDialogProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTypes, setSelectedTypes] = useState<AlertType[]>([]);
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const [relevanceBoost, setRelevanceBoost] = useState(false);
  const [searchType, setSearchType] = useState<'optimized' | 'standard' | 'custom'>('standard');
  const [similarMentions, setSimilarMentions] = useState('exclude');
  const [showImages, setShowImages] = useState(true);
  const [urgencyLevel, setUrgencyLevel] = useState([50]);
  const [relevanceTopics, setRelevanceTopics] = useState<string[]>([]);
  const [relevancePrompt, setRelevancePrompt] = useState('');
  const [strictness, setStrictness] = useState([65]);
  const [alwaysIncludeHighImpact, setAlwaysIncludeHighImpact] = useState(true);
  const [deliveryChannels, setDeliveryChannels] = useState({
    email: true, inApp: true, slack: false, teams: false, webhook: false,
  });
  const [frequency, setFrequency] = useState<'immediate' | 'hourly' | 'daily'>('immediate');
  const [quietHours, setQuietHours] = useState(false);
  const [recipients, setRecipients] = useState<{ name: string; email: string }[]>([
    { name: 'Mariano Titanti', email: 'mariano.titanti@meltwater.com' },
  ]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState(true);

  const handleReset = () => {
    setStep(1);
    setSelectedTypes([]);
    setSelectedSearches([]);
    setRelevanceBoost(false);
    setSimilarMentions('exclude');
    setShowImages(true);
    setFrequency('immediate');
    setUrgencyLevel([50]);
    setDeliveryChannels({ email: true, inApp: true, slack: false, teams: false, webhook: false });
    setQuietHours(false);
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

  const toggleSearch = (search: string) => {
    setSelectedSearches(prev =>
      prev.includes(search) ? prev.filter(s => s !== search) : prev.length < 10 ? [...prev, search] : prev
    );
  };

  const removeRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r.email !== email));
  };

  const primaryType = selectedTypes[0] || 'every_mention';

  const getEstimatedAlertCount = () => {
    const searchCount = selectedSearches.length || 1;
    const recipientCount = recipients.length || 1;
    if (frequency === 'immediate') {
      const basePerDay = selectedTypes.includes('every_mention') ? 120 : selectedTypes.includes('spike_detection') ? 8 : 25;
      return basePerDay * searchCount * recipientCount * (selectedTypes.length || 1);
    }
    return searchCount * recipientCount;
  };

  const estimatedAlerts = getEstimatedAlertCount();
  const isHighVolume = frequency === 'immediate' && estimatedAlerts > 50;

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
          <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {alertTypeLabels[type]}
            </p>
            {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
            {alertTypeDescriptions[type]}
          </p>
        </div>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Header + Stepper */}
        <div className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            Create alert
          </DialogTitle>
          <Stepper current={step} onNavigate={setStep} />
        </div>

        {/* ── Step 1: Searches ──────────────────────────────── */}
        {step === 1 && (
          <div className="px-6 pb-6 space-y-4">
            {/* Selected tags */}
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

            <Panel title="Saved searches" subtitle="Select one or more searches to monitor">
              <div>
                {mockSearches.map((s, i) => {
                  const isSelected = selectedSearches.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      onClick={() => toggleSearch(s.name)}
                      className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors ${
                        i < mockSearches.length - 1 ? 'border-b border-border' : ''
                      } ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className={`text-sm flex-1 ${isSelected ? 'text-primary font-medium' : 'text-foreground'}`}>
                        {s.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{s.type}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <p className="text-xs text-muted-foreground">{selectedSearches.length}/10 selected</p>
            <StepFooter onNext={() => { if (selectedSearches.length > 0) setStep(2); }} nextDisabled={selectedSearches.length === 0} />
          </div>
        )}

        {/* ── Step 2: Alert Types ──────────────────────────── */}
        {step === 2 && (
          <div className="px-6 pb-6 space-y-4">
            <Panel title="Alert types" subtitle="Select one or more alert types to create">
              <div className="p-4 space-y-5">
                <div>
                  <CategoryLabel>Search alerts</CategoryLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {searchAlertTypes.map(renderTypeCard)}
                  </div>
                </div>
                <div>
                  <CategoryLabel>Event alerts</CategoryLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {eventAlertTypes.map(renderTypeCard)}
                  </div>
                </div>
                <div>
                  <CategoryLabel>Social alerts</CategoryLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {socialAlertTypes.map(renderTypeCard)}
                  </div>
                </div>
                <div>
                  <CategoryLabel>RSS alerts</CategoryLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {rssAlertTypes.map(renderTypeCard)}
                  </div>
                </div>
              </div>
            </Panel>

            <StepFooter onBack={() => setStep(1)} onNext={() => { if (selectedTypes.length > 0) setStep(3); }} nextDisabled={selectedTypes.length === 0} />
          </div>
        )}

        {/* ── Step 3: Details ──────────────────────────────── */}
        {step === 3 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 space-y-5">
            {/* Page title + selected searches */}
            <div>
              <h2 className="text-base font-bold text-foreground">
                Configure details for {alertTypeLabels[selectedTypes[0] || 'every_mention']} alert
              </h2>
              {selectedSearches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSearches.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 text-xs font-medium">
                      <Search className="w-3 h-3" />
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Relevance Boost */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/[0.02] p-5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Relevance Boost</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">Beta</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Reduce noise by prioritizing mentions that match your intent.</p>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
                <span className="text-sm text-foreground">Enable relevance filtering</span>
                <Switch checked={relevanceBoost} onCheckedChange={setRelevanceBoost} />
              </div>

              {relevanceBoost && (
                <div className="mt-5 space-y-5">
                  {/* Choose what matters most */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">💡</span>
                      <span className="text-sm font-bold text-foreground">Choose what matters most</span>
                      <span className="text-xs text-muted-foreground">(select multiple)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Crisis / Breaking news',
                        'Product issues',
                        'Executive & leadership quotes',
                        'Partnerships & announcements',
                        'Financial / earnings coverage',
                      ].map((topic) => {
                        const selected = relevanceTopics.includes(topic);
                        return (
                          <button
                            key={topic}
                            onClick={() => setRelevanceTopics(prev =>
                              selected ? prev.filter(t => t !== topic) : [...prev, topic]
                            )}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              selected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* What do you want to be alerted about */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">What do you want to be alerted about?</p>
                    <p className="text-xs text-muted-foreground mb-2">Your search query controls what's included. This refines what's most relevant.</p>
                    <textarea
                      value={relevancePrompt}
                      onChange={(e) => setRelevancePrompt(e.target.value)}
                      placeholder="Prioritize breaking news about {Brand} from major outlets, product issues, and exec quotes."
                      className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Tip: Use positive phrasing (what to prioritize). Avoid exclusions like "don't show competitors".
                    </p>
                  </div>

                  {/* Strictness */}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-foreground">Strictness (relevance threshold)</p>
                      <button
                        onClick={() => setStrictness([65])}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        ↻ Reset to recommended
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Stricter = fewer, higher-confidence mentions.</p>
                    <Slider value={strictness} onValueChange={setStrictness} max={100} step={1} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">More Alerts</span>
                      <span className="text-sm font-semibold text-foreground">
                        ~{Math.round(200 - strictness[0] * 1.8)}–{Math.round(250 - strictness[0] * 2)} alerts/day
                      </span>
                      <span className="text-xs text-muted-foreground">Fewer Alerts</span>
                    </div>
                  </div>

                  {/* Always include high-impact */}
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <Checkbox
                      checked={alwaysIncludeHighImpact}
                      onCheckedChange={(v) => setAlwaysIncludeHighImpact(!!v)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Always include high-impact mentions (major outlets, exec quotes)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Prevents missing critical coverage even on stricter settings.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Urgency level */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-foreground" />
                <h3 className="text-sm font-bold text-foreground">Urgency level</h3>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>All coverage</span>
                <span>Important only</span>
                <span>Urgent spikes only</span>
              </div>
              <Slider value={urgencyLevel} onValueChange={setUrgencyLevel} max={100} step={1} className="mb-4" />
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">
                    {urgencyLevel[0] < 33 ? 'All coverage' : urgencyLevel[0] < 66 ? 'Important only' : 'Urgent spikes only'}:
                  </span>{' '}
                  {urgencyLevel[0] < 33
                    ? "You'll receive alerts for every mention across all sources."
                    : urgencyLevel[0] < 66
                    ? "We'll filter out low-relevance mentions using AI ranking"
                    : "Only high-impact spikes and critical mentions will trigger alerts."}
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="rounded-xl border border-border bg-card p-5">
              <SectionLabel tooltip="Configure alert behavior">Settings</SectionLabel>
              <div className="mt-3 space-y-4">
                <div className="space-y-1.5">
                  <CategoryLabel>Similar Mentions</CategoryLabel>
                  <Select value={similarMentions} onValueChange={setSimilarMentions}>
                    <SelectTrigger className="w-full text-sm">
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
                    <span className="text-sm text-foreground">Images</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery channels */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-foreground" />
                <h3 className="text-sm font-bold text-foreground">Delivery channels</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'email' as const, label: 'Email', icon: Mail },
                  { key: 'inApp' as const, label: 'In-app', icon: Bell },
                  { key: 'slack' as const, label: 'Slack', icon: MessageSquare },
                  { key: 'teams' as const, label: 'Teams', icon: MessageSquare },
                ] as const).map(({ key, label, icon: Icon }) => {
                  const enabled = deliveryChannels[key];
                  return (
                    <div key={key} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      enabled ? 'border-primary/30 bg-primary/5' : 'border-border'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${enabled ? 'text-primary' : 'text-foreground'}`}>{label}</span>
                      </div>
                      <Switch checked={enabled} onCheckedChange={(v) => setDeliveryChannels(prev => ({ ...prev, [key]: v }))} />
                    </div>
                  );
                })}
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2.5">
                    <Webhook className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Webhook</span>
                  </div>
                  <Switch checked={deliveryChannels.webhook} onCheckedChange={(v) => setDeliveryChannels(prev => ({ ...prev, webhook: v }))} />
                </div>
              </div>
            </div>

            {/* When to notify me */}
            <div className="rounded-xl border border-border bg-card p-5">
              <SectionLabel tooltip="Choose notification frequency">When to notify me</SectionLabel>
              <div className="mt-3">
                <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as 'immediate' | 'hourly' | 'daily')}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                    <RadioGroupItem value="immediate" id="notify-immediate" className="mt-0.5" />
                    <div>
                      <Label htmlFor="notify-immediate" className="text-sm font-semibold cursor-pointer text-foreground">
                        Immediately (every mention)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        You will receive notification for every single mention as they happen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                    <RadioGroupItem value="daily" id="notify-daily" className="mt-0.5" />
                    <div>
                      <Label htmlFor="notify-daily" className="text-sm font-semibold cursor-pointer text-foreground">
                        Daily threshold (last 24 hours)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sends an alert as soon as mentions exceed your threshold (24-hour window is fixed)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Timing */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-foreground" />
                <h3 className="text-sm font-bold text-foreground">Timing</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Frequency</p>
                  <div className="flex gap-2">
                    {(['immediate', 'hourly', 'daily'] as const).map((f) => (
                      <button key={f} onClick={() => setFrequency(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          frequency === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:bg-muted/50'
                        }`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Quiet hours</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pause alerts between 10pm – 7am</p>
                  </div>
                  <Switch checked={quietHours} onCheckedChange={setQuietHours} />
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="rounded-xl border border-border bg-card p-5">
              <SectionLabel>Recipients</SectionLabel>
              <p className="text-xs text-muted-foreground mb-3">Send alerts to the following people</p>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or enter an email address"
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-2">{recipients.length}/10</p>
              <div className="space-y-1.5">
                {recipients.map((r) => (
                  <div key={r.email} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
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

            {/* Delivery method */}
            <div className="rounded-xl border border-border bg-card p-5">
              <SectionLabel tooltip="How would you like to receive alerts?">Delivery method</SectionLabel>
              <p className="text-xs text-muted-foreground mb-3">How would you like to receive alerts?</p>
              <CategoryLabel>Standard</CategoryLabel>
              <div className="flex items-center gap-2 mt-1">
                <Checkbox checked={deliveryEmail} onCheckedChange={(v) => setDeliveryEmail(!!v)} />
                <span className="text-sm text-foreground">Email</span>
              </div>
            </div>

            <StepFooter onBack={() => setStep(2)} onNext={() => setStep(4)} />
          </div>
        )}

        {/* ── Step 4: Preview ──────────────────────────────── */}
        {step === 4 && selectedTypes.length > 0 && (
          <div className="px-6 pb-6 space-y-4">
            {/* Volume */}
            <Panel title="Estimated alert volume" subtitle={`Based on ${selectedSearches.length || 1} search(es) × ${recipients.length} recipient(s)`}>
              <div className="px-5 py-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-foreground">~{estimatedAlerts.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">emails per day</span>
                </div>
                {isHighVolume && (
                  <div className="flex items-start gap-2 mt-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-destructive">High alert volume detected</p>
                      <ul className="text-xs text-destructive/70 list-disc pl-4 space-y-0.5">
                        <li>Switch to <button className="underline font-medium" onClick={() => { setFrequency('daily'); setStep(3); }}>Daily threshold</button></li>
                        {!relevanceBoost && (
                          <li>Enable <button className="underline font-medium" onClick={() => { setRelevanceBoost(true); setStep(3); }}>Relevance Boost</button></li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* Selected types */}
            {selectedTypes.length > 1 && (
              <Panel title="Alert types being created">
                <div className="px-5 py-4 flex flex-wrap gap-1.5">
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
              </Panel>
            )}

            {/* Email Preview */}
            <Panel title="Email preview">
              <div className="p-4 bg-muted/30">
                <div className="max-w-md mx-auto bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-muted/30">
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

                  <div className="px-5 py-3">
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
                      <button className="text-xs text-primary flex items-center gap-0.5 shrink-0 font-medium">
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
            </Panel>

            <StepFooter onBack={() => setStep(3)} onNext={() => handleClose(false)} nextLabel="Save" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
