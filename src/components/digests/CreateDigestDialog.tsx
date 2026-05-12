import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Mail,
  Clock,
  Calendar,
  Users,
  FileText,
} from 'lucide-react';

interface CreateDigestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockSearches = [
  { name: 'Yelp Brand Search', type: 'Standard' },
  { name: 'Yelp Negative Mentions', type: 'Standard' },
  { name: 'Competitor A Coverage', type: 'Optimized' },
  { name: 'CEO Mentions', type: 'Optimized' },
  { name: 'Product Launches', type: 'Standard' },
  { name: 'Industry News', type: 'Standard' },
  { name: 'Crisis Keywords', type: 'Standard' },
  { name: 'Social Mentions', type: 'Standard' },
];

const mockUsers = [
  { name: 'Antonio Schibono', email: 'antonio.schibono@meltwater.com' },
  { name: 'Sarah Lin', email: 'sarah.lin@meltwater.com' },
  { name: 'David Marsh', email: 'david.marsh@meltwater.com' },
  { name: 'Priya Nair', email: 'priya.nair@meltwater.com' },
  { name: 'Tom Reeves', email: 'tom.reeves@meltwater.com' },
  { name: 'James Okoro', email: 'james.okoro@meltwater.com' },
  { name: 'Rachel Kim', email: 'rachel.kim@meltwater.com' },
];

const steps = [
  { num: 1, label: 'Content' },
  { num: 2, label: 'Schedule' },
  { num: 3, label: 'Recipients' },
  { num: 4, label: 'Preview' },
] as const;

const Stepper = ({ current, onNavigate }: { current: number; onNavigate: (n: 1 | 2 | 3 | 4) => void }) => (
  <div className="flex items-center gap-0 mt-5">
    {steps.map(({ num, label }, idx) => {
      const done = current > num;
      const active = current === num;
      const future = current < num;
      return (
        <div key={num} className="flex items-center">
          <button
            onClick={() => done && onNavigate(num as 1 | 2 | 3 | 4)}
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

const StepFooter = ({ onBack, onNext, nextLabel = 'Next', nextDisabled = false }: {
  onBack?: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean;
}) => (
  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-4">
    {onBack && <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>}
    <Button size="sm" onClick={onNext} disabled={nextDisabled}>{nextLabel}</Button>
  </div>
);

export const CreateDigestDialog = ({ open, onOpenChange }: CreateDigestDialogProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 - Content
  const [digestName, setDigestName] = useState('');
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Step 2 - Schedule
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sendTime, setSendTime] = useState('08:00');
  const [sendDay, setSendDay] = useState('monday');
  const [sendDate, setSendDate] = useState('1');
  const [timezone, setTimezone] = useState('America/New_York');
  const [includeWeekends, setIncludeWeekends] = useState(false);

  // Step 3 - Recipients
  const [recipients, setRecipients] = useState<{ name: string; email: string }[]>([
    { name: 'Antonio Schibono', email: 'antonio.schibono@meltwater.com' },
  ]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleReset = () => {
    setStep(1);
    setDigestName('');
    setSelectedSearches([]);
    setSearchFilter('');
    setFrequency('daily');
    setSendTime('08:00');
    setSendDay('monday');
    setTimezone('America/New_York');
    setIncludeWeekends(false);
    setRecipients([{ name: 'Antonio Schibono', email: 'antonio.schibono@meltwater.com' }]);
    setRecipientSearch('');
  };

  const handleClose = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  const toggleSearch = (name: string) => {
    setSelectedSearches(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const removeRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r.email !== email));
  };

  const addRecipient = (user: { name: string; email: string }) => {
    if (!recipients.find(r => r.email === user.email)) {
      setRecipients(prev => [...prev, user]);
    }
    setRecipientSearch('');
    setShowSuggestions(false);
  };

  const filteredSearches = mockSearches.filter(s =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(u =>
    (u.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
     u.email.toLowerCase().includes(recipientSearch.toLowerCase())) &&
    !recipients.find(r => r.email === u.email)
  );

  const frequencyLabel = frequency === 'daily' ? 'Daily' : frequency === 'weekly' ? 'Weekly' : 'Monthly';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            Create digest
          </DialogTitle>
          <Stepper current={step} onNavigate={setStep} />
        </div>

        {/* ── Step 1: Content ───────────────────────────────── */}
        {step === 1 && (
          <div className="px-6 py-5 space-y-4">
            {/* Digest name */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Digest name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Weekly Brand Monitor"
                value={digestName}
                onChange={(e) => setDigestName(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Selected search tags */}
            {selectedSearches.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSearches.map(s => (
                  <Badge key={s} variant="secondary" className="gap-1 text-xs font-medium">
                    {s}
                    <X className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" onClick={() => toggleSearch(s)} />
                  </Badge>
                ))}
              </div>
            )}

            {/* Search picker */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Based on <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">Select one or more saved searches to include in this digest</p>

              {/* Filter input */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter searches..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              <div className="rounded-lg border border-border bg-card divide-y divide-border max-h-[240px] overflow-y-auto">
                {filteredSearches.map((s) => {
                  const isSelected = selectedSearches.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      onClick={() => toggleSearch(s.name)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className={`text-sm flex-1 ${isSelected ? 'text-primary font-medium' : 'text-foreground'}`}>
                        {s.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.type}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{selectedSearches.length} selected</p>
            </div>

            <StepFooter
              onNext={() => setStep(2)}
              nextDisabled={!digestName.trim() || selectedSearches.length === 0}
            />
          </div>
        )}

        {/* ── Step 2: Schedule ──────────────────────────────── */}
        {step === 2 && (
          <div className="px-6 py-5 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">When should this digest be sent?</h3>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Frequency</label>
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      frequency === f
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Day of week (weekly only) */}
            {frequency === 'weekly' && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Day of week</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSendDay(day)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize transition-colors ${
                        sendDay === day
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Day of month (monthly only) */}
            {frequency === 'monthly' && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Day of month</label>
                <Select value={sendDate} onValueChange={setSendDate}>
                  <SelectTrigger className="w-40 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => String(i + 1)).map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                    <SelectItem value="last">Last day of month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Send time</label>
              <div className="flex items-center gap-3">
                <Input
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-36 text-sm"
                />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Timezone</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Include weekends (daily only) */}
            {frequency === 'daily' && (
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">Include weekends</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Send the digest on Saturdays and Sundays</p>
                </div>
                <Switch checked={includeWeekends} onCheckedChange={setIncludeWeekends} />
              </div>
            )}

            {/* Summary */}
            <div className="rounded-lg bg-muted/50 px-4 py-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                This digest will be sent{' '}
                <span className="font-semibold text-foreground">
                  {frequency === 'daily' && `daily${includeWeekends ? '' : ' (weekdays)'}`}
                  {frequency === 'weekly' && `every ${sendDay.charAt(0).toUpperCase() + sendDay.slice(1)}`}
                  {frequency === 'monthly' && `on day ${sendDate} of each month`}
                </span>{' '}
                at <span className="font-semibold text-foreground">{sendTime}</span>
              </p>
            </div>

            <StepFooter onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {/* ── Step 3: Recipients ────────────────────────────── */}
        {step === 3 && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Who should receive this digest?</h3>
            </div>

            {/* Search / add recipients */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or enter an email address"
                value={recipientSearch}
                onChange={(e) => { setRecipientSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="pl-9 text-sm"
              />
              {/* Suggestions dropdown */}
              {showSuggestions && recipientSearch && filteredUsers.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-md divide-y divide-border">
                  {filteredUsers.map(u => (
                    <button
                      key={u.email}
                      onMouseDown={() => addRecipient(u)}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">{recipients.length}/50 recipients</p>

            {/* Recipient list */}
            <div className="space-y-1.5">
              {recipients.map(r => (
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
                  <button onClick={() => removeRecipient(r.email)} className="text-muted-foreground hover:text-foreground p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {recipients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No recipients added yet</p>
              )}
            </div>

            <StepFooter
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              nextDisabled={recipients.length === 0}
            />
          </div>
        )}

        {/* ── Step 4: Preview ───────────────────────────────── */}
        {step === 4 && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Review your digest</h3>
            </div>

            {/* Summary card */}
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</span>
                <span className="text-sm font-medium text-foreground">{digestName}</span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Based on</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[300px]">
                    {selectedSearches.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Schedule</span>
                <span className="text-sm text-foreground">
                  {frequencyLabel}
                  {frequency === 'weekly' && ` · ${sendDay.charAt(0).toUpperCase() + sendDay.slice(1)}`}
                  {frequency === 'monthly' && ` · Day ${sendDate}`}
                  {' · '}{sendTime}
                </span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recipients</span>
                  <div className="flex flex-col items-end gap-1">
                    {recipients.slice(0, 3).map(r => (
                      <span key={r.email} className="text-sm text-foreground">{r.name}</span>
                    ))}
                    {recipients.length > 3 && (
                      <span className="text-xs text-primary font-medium">+{recipients.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email preview mockup */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Email preview</p>
              <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                {/* Email header */}
                <div className="bg-muted/40 px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{digestName || 'Digest Report'}</p>
                      <p className="text-xs text-muted-foreground">{frequencyLabel} digest · {selectedSearches.slice(0, 2).join(', ')}{selectedSearches.length > 2 ? ` +${selectedSearches.length - 2} more` : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Sample articles */}
                <div className="divide-y divide-border">
                  {[
                    { title: 'Brand Coverage Roundup: Key Mentions This Period', source: 'Reuters', time: '2 hours ago', sentiment: 'Positive', reach: '1.2M' },
                    { title: 'Industry Analysis: Market Trends and Competitor Activity', source: 'Bloomberg', time: '5 hours ago', sentiment: 'Neutral', reach: '890K' },
                    { title: 'Executive Spotlight: Leadership Quotes in the News', source: 'Financial Times', time: '8 hours ago', sentiment: 'Positive', reach: '540K' },
                  ].map((article, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">{article.source}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{article.time}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug mb-2">{article.title}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          article.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                        }`}>{article.sentiment}</span>
                        <span className="text-[10px] text-muted-foreground">📈 {article.reach} reach</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground">View all mentions in Meltwater →</p>
                </div>
              </div>
            </div>

            <StepFooter
              onBack={() => setStep(3)}
              onNext={() => handleClose(false)}
              nextLabel="Create digest"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
