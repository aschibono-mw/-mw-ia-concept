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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Link2, 
  FileText, 
  Copy, 
  Check,
  Users,
  Globe,
  Lock,
  Calendar,
  Clock,
  Send,
  Download,
  Linkedin,
  Twitter,
  Slack
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
}

export const ShareDialog = ({ open, onOpenChange, itemName }: ShareDialogProps) => {
  const [activeTab, setActiveTab] = useState('link');
  const [shareFormat, setShareFormat] = useState<'link' | 'pdf'>('link');
  const [accessLevel, setAccessLevel] = useState<'anyone' | 'specific'>('anyone');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [includeComments, setIncludeComments] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [notifyRecipients, setNotifyRecipients] = useState(true);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `https://app.example.com/share/s/${Math.random().toString(36).substring(7)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    toast.success(`Shared "${itemName}" successfully`);
    onOpenChange(false);
  };

  const handleDownloadPdf = () => {
    toast.success('PDF download started');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Share "{itemName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share as</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShareFormat('link')}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left',
                  shareFormat === 'link'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  shareFormat === 'link' ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Link2 className={cn('w-5 h-5', shareFormat === 'link' ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <div className="font-medium text-sm">Share Link</div>
                  <div className="text-xs text-muted-foreground">Live, always up-to-date</div>
                </div>
              </button>
              <button
                onClick={() => setShareFormat('pdf')}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left',
                  shareFormat === 'pdf'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/30'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  shareFormat === 'pdf' ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <FileText className={cn('w-5 h-5', shareFormat === 'pdf' ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <div className="font-medium text-sm">Send as PDF</div>
                  <div className="text-xs text-muted-foreground">Static snapshot</div>
                </div>
              </button>
            </div>
          </div>

          <Separator />

          {shareFormat === 'link' ? (
            <>
              {/* Link Sharing Options */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link" className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Copy Link
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Send via Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-4 mt-4">
                  {/* Access Level */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Who can access</Label>
                    <RadioGroup value={accessLevel} onValueChange={(v) => setAccessLevel(v as 'anyone' | 'specific')}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="anyone" id="anyone" />
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="anyone" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Anyone with the link</div>
                          <div className="text-xs text-muted-foreground">No sign-in required</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="specific" id="specific" />
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor="specific" className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">Specific people only</div>
                          <div className="text-xs text-muted-foreground">Recipients must sign in</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Shareable Link */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shareable link</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={shareLink} 
                        readOnly 
                        className="bg-muted text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleCopyLink}
                        className="shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Share Buttons */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quick share to</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Slack className="w-4 h-4" />
                        Slack
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Twitter className="w-4 h-4" />
                        X
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-medium">Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="expiration" 
                          checked={expirationEnabled}
                          onCheckedChange={(checked) => setExpirationEnabled(checked as boolean)}
                        />
                        <Label htmlFor="expiration" className="flex items-center gap-2 cursor-pointer text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          Set expiration date
                        </Label>
                      </div>
                      {expirationEnabled && (
                        <Input type="date" className="ml-7 w-48" />
                      )}
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="includeComments" 
                          checked={includeComments}
                          onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                        />
                        <Label htmlFor="includeComments" className="cursor-pointer text-sm">
                          Include comments
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-4">
                  {/* Email Recipients */}
                  <div className="space-y-2">
                    <Label htmlFor="recipients" className="text-sm font-medium">Recipients</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="recipients"
                        placeholder="Enter email addresses, separated by commas"
                        value={emailRecipients}
                        onChange={(e) => setEmailRecipients(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message (optional)</Label>
                    <textarea 
                      id="message"
                      placeholder="Add a personal message..."
                      className="w-full min-h-[80px] px-3 py-2 rounded-md border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Email Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="notify" 
                        checked={notifyRecipients}
                        onCheckedChange={(checked) => setNotifyRecipients(checked as boolean)}
                      />
                      <Label htmlFor="notify" className="cursor-pointer text-sm">
                        Send email notification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="includeCommentsEmail" 
                        checked={includeComments}
                        onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                      />
                      <Label htmlFor="includeCommentsEmail" className="cursor-pointer text-sm">
                        Include comments
                      </Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <>
              {/* PDF Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdfRecipients" className="text-sm font-medium">Send to (optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="pdfRecipients"
                      placeholder="Enter email addresses to send PDF, or download directly"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">PDF includes</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="pdfComments" 
                        checked={includeComments}
                        onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                      />
                      <Label htmlFor="pdfComments" className="cursor-pointer text-sm">
                        Include comments and annotations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="pdfHistory" 
                        checked={includeHistory}
                        onCheckedChange={(checked) => setIncludeHistory(checked as boolean)}
                      />
                      <Label htmlFor="pdfHistory" className="cursor-pointer text-sm">
                        Include edit history
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadPdf}>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={handleShare}
                    disabled={!emailRecipients.trim()}
                  >
                    <Send className="w-4 h-4" />
                    Send PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {shareFormat === 'link' && (
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} className="gap-2">
              <Send className="w-4 h-4" />
              {activeTab === 'email' ? 'Send' : 'Done'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
