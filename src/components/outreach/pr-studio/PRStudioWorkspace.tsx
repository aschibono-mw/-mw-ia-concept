import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Pencil,
  Sparkles,
  Copy,
  Send,
  RotateCcw,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  Quote,
  Languages,
  Palette,
  Ruler,
  FileText,
  Mail,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pitch,
  PitchFormat,
  PitchLength,
  PitchTone,
  PitchLanguage,
  PitchQuote,
  TONE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "./types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PRStudioWorkspaceProps {
  pitch: Pitch;
  onBack: () => void;
  onUpdatePitch: (pitchId: string, updates: Partial<Pitch>) => void;
}

const suggestedJournalists = [
  { name: "Sarah Chen", outlet: "TechCrunch", match: 95 },
  { name: "Michael Roberts", outlet: "Wall Street Journal", match: 88 },
  { name: "Lisa Park", outlet: "Bloomberg", match: 82 },
  { name: "Emma Thompson", outlet: "BBC News", match: 79 },
  { name: "David Kim", outlet: "Forbes", match: 74 },
];

export const PRStudioWorkspace = ({
  pitch,
  onBack,
  onUpdatePitch,
}: PRStudioWorkspaceProps) => {
  const [content, setContent] = useState(pitch.content || "");
  const [format, setFormat] = useState<PitchFormat>(pitch.type);
  const [length, setLength] = useState<PitchLength>(pitch.length);
  const [tone, setTone] = useState<PitchTone>(pitch.tone);
  const [language, setLanguage] = useState<PitchLanguage>(pitch.language);
  const [articleRef, setArticleRef] = useState(pitch.articleReference || "");
  const [quotes, setQuotes] = useState<PitchQuote[]>(pitch.quotes);
  const [generatedOutput, setGeneratedOutput] = useState(pitch.generatedOutput || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(pitch.name);
  const [showQuotes, setShowQuotes] = useState(quotes.length > 0);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAttribution, setNewQuoteAttribution] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const handleGenerate = () => {
    if (!content.trim()) {
      toast.error("Please enter your content first");
      return;
    }
    setIsGenerating(true);

    // Simulated generation
    setTimeout(() => {
      const mockOutput = generateMockContent(content, format, tone, length);
      setGeneratedOutput(mockOutput);
      setIsGenerating(false);
      onUpdatePitch(pitch.id, {
        content,
        generatedOutput: mockOutput,
        type: format,
        length,
        tone,
        language,
        articleReference: articleRef,
        quotes,
        status: "generated",
      });
      toast.success(`${format === "media-pitch" ? "Media pitch" : "Press release"} generated!`);
    }, 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockOutput = generateMockContent(content, format, tone, length) + "\n\n[Regenerated with updated parameters]";
      setGeneratedOutput(mockOutput);
      setIsGenerating(false);
      onUpdatePitch(pitch.id, { generatedOutput: mockOutput });
      toast.success("Content regenerated!");
    }, 1500);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdatePitch(pitch.id, { name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(generatedOutput);
    toast.success("Copied to clipboard");
  };

  const handleAddQuote = () => {
    if (!newQuoteText.trim()) return;
    const newQuote: PitchQuote = {
      id: `q-${Date.now()}`,
      text: newQuoteText.trim(),
      attribution: newQuoteAttribution.trim() || "Unknown",
    };
    setQuotes((prev) => [...prev, newQuote]);
    setNewQuoteText("");
    setNewQuoteAttribution("");
  };

  const handleRemoveQuote = (quoteId: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={nameInputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="h-9 text-lg font-semibold max-w-md"
            />
            <Button size="sm" variant="ghost" onClick={handleSaveName}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{pitch.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {generatedOutput && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              Generated
            </Badge>
          )}
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Panel – Configuration */}
        <div className="space-y-4">
          {/* Content Input */}
          <div className="bg-card rounded-lg border border-border p-5">
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              Your content
            </Label>
            <Textarea
              placeholder="Describe what you want to pitch. Include key messages, context, and any specific angles..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {content.length} characters
              </span>
            </div>
          </div>

          {/* Quotes */}
          <Collapsible open={showQuotes} onOpenChange={setShowQuotes}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    Quotes ({quotes.length})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    showQuotes && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-3">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-muted/50 rounded-md p-3 relative group"
                    >
                      <p className="text-sm text-foreground italic">"{quote.text}"</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        — {quote.attribution}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => handleRemoveQuote(quote.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter a quote..."
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      rows={2}
                      className="resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Attribution (e.g., Jane Doe, CEO)"
                        value={newQuoteAttribution}
                        onChange={(e) => setNewQuoteAttribution(e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddQuote}
                        disabled={!newQuoteText.trim()}
                        className="shrink-0 gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Writing Style */}
          <div className="bg-card rounded-lg border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              Writing style
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  Language
                </Label>
                <Select
                  value={language}
                  onValueChange={(v) => setLanguage(v as PitchLanguage)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tone
                </Label>
                <Select
                  value={tone}
                  onValueChange={(v) => setTone(v as PitchTone)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Article Reference (optional)
              </Label>
              <Input
                placeholder="Paste a URL for style reference..."
                value={articleRef}
                onChange={(e) => setArticleRef(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Format & Length */}
          <div className="bg-card rounded-lg border border-border p-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Format
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat("media-pitch")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                    format === "media-pitch"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Media Pitch
                </button>
                <button
                  onClick={() => setFormat("press-release")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                    format === "press-release"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  Press Release
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                Length
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["short", "medium", "long"] as PitchLength[]).map((len) => (
                  <button
                    key={len}
                    onClick={() => setLength(len)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                      length === len
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !content.trim()}
            className="w-full gap-2 h-11"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate {format === "media-pitch" ? "Media Pitch" : "Press Release"}
              </>
            )}
          </Button>
        </div>

        {/* Right Panel – Output */}
        <div className="space-y-4">
          <Tabs defaultValue="output">
            <TabsList className="bg-muted/50 w-full justify-start">
              <TabsTrigger value="output" className="gap-2 flex-1">
                <FileText className="w-4 h-4" />
                {pitch.name.length > 30 ? pitch.name.slice(0, 30) + "…" : pitch.name}
              </TabsTrigger>
              <TabsTrigger value="journalists" className="gap-2 flex-1">
                <Users className="w-4 h-4" />
                Suggested Journalists
              </TabsTrigger>
            </TabsList>

            <TabsContent value="output" className="mt-4">
              {generatedOutput ? (
                <div className="bg-card rounded-lg border border-border">
                  {/* Output Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">AI Generated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={handleCopyOutput}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </Button>
                    </div>
                  </div>

                  {/* Output Content */}
                  <ScrollArea className="max-h-[500px]">
                    <div className="p-5">
                      <div className="prose prose-sm max-w-none text-foreground">
                        {generatedOutput.split("\n\n").map((paragraph, i) => (
                          <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Regenerate */}
                  <div className="p-4 border-t border-border bg-muted/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Not quite right? Adjust your settings and try again.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-7 h-7 text-muted-foreground/50" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    Ready to generate
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Enter your content, configure your preferences, then hit Generate to create your{" "}
                    {format === "media-pitch" ? "media pitch" : "press release"}.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="journalists" className="mt-4">
              <div className="bg-card rounded-lg border border-border divide-y divide-border">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Suggested Journalists
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Based on your content and topic, these journalists are the best fit.
                  </p>
                </div>
                {suggestedJournalists.map((j, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {j.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{j.name}</p>
                      <p className="text-xs text-muted-foreground">{j.outlet}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        j.match >= 90
                          ? "bg-primary/10 text-primary border-primary/20"
                          : j.match >= 80
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}
                    >
                      {j.match}% match
                    </Badge>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                      <Send className="w-3 h-3" />
                      Pitch
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

function generateMockContent(
  content: string,
  format: PitchFormat,
  tone: PitchTone,
  length: PitchLength
): string {
  const firstLine = content.split(".")[0] || content.slice(0, 60);

  if (format === "press-release") {
    const base = `FOR IMMEDIATE RELEASE\n\n${firstLine}\n\nNEW YORK — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — Based on your input, we have crafted the following press release that captures the key messages and context you provided.\n\nThe announcement comes at a pivotal time for the industry, as stakeholders across sectors are closely watching developments in this space. Industry analysts note that this represents a significant shift in market dynamics.\n\n"This is a transformative moment," said a company spokesperson. "We are committed to delivering value to all stakeholders and look forward to the road ahead."`;

    if (length === "long") {
      return (
        base +
        '\n\nBackground:\nThe organization has been at the forefront of innovation since its founding, consistently pushing boundaries and setting new standards for excellence in the industry.\n\nAdditional context and supporting information reinforce the significance of this development. Market research indicates strong demand and growing interest from key demographics.\n\nMedia Contact:\nPress Office\npress@company.com\n+1 (555) 123-4567'
      );
    }
    return base;
  }

  const pitchBase = `Subject: ${firstLine}\n\nHi [Journalist Name],\n\nI'm reaching out because I believe this story would resonate with your audience. ${content}\n\nHere's why this matters now:\n\n• The timing aligns with current industry trends and public interest\n• There are compelling data points and expert voices available\n• This angle hasn't been widely covered yet`;

  if (length === "long") {
    return (
      pitchBase +
      "\n\nI'd love to arrange an exclusive interview or provide additional materials. Would you be available for a brief call this week?\n\nI've attached a fact sheet and high-resolution images for your reference. Happy to tailor the angle to fit your editorial calendar.\n\nBest regards,\n[Your Name]\n[Your Title]\n[Contact Information]"
    );
  }

  return (
    pitchBase +
    "\n\nWould you be interested in covering this? Happy to provide more details or arrange an interview.\n\nBest,\n[Your Name]"
  );
}
