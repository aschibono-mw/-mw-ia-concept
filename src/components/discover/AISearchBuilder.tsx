import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronUp, ChevronDown, Code, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const sampleBooleanQuery = `("brand monitoring" OR "brand tracking" OR "brand mention") AND (social OR news OR online) AND NOT (spam OR advertisement)`;

interface AISearchBuilderProps {
  initialExpanded?: boolean;
}

export const AISearchBuilder = ({ initialExpanded = false }: AISearchBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showBoolean, setShowBoolean] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [booleanQuery, setBooleanQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialExpanded && isExpanded) {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [initialExpanded, isExpanded]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    // Simulate AI response with boolean generation
    const generatedBoolean = generateMockBoolean(inputValue.trim());
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I've created a search for "${inputValue.trim()}". This will track mentions across news, social media, and online sources. Would you like me to add any exclusions or refine the search further?`
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setBooleanQuery(generatedBoolean);
    setInputValue('');
  };

  const generateMockBoolean = (input: string): string => {
    const keywords = input.split(/\s+/).filter(word => word.length > 2);
    if (keywords.length === 0) return `"${input}"`;
    
    if (keywords.length === 1) {
      return `("${keywords[0]}" OR "${keywords[0]}s" OR "${keywords[0]} news") AND (article OR post OR mention) AND NOT (spam OR "not relevant")`;
    }
    
    const orTerms = keywords.map(k => `"${k}"`).join(' OR ');
    return `(${orTerms}) AND (news OR social OR online OR article) AND NOT (spam OR advertisement OR "not relevant")`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setBooleanQuery('');
    setShowBoolean(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border mb-6">
      {/* Header */}
      <button 
        className="w-full flex items-center justify-between text-left p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-card-foreground">Build a new search</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          {/* View Boolean Toggle */}
          <div className="flex items-center justify-between py-3">
            <p className="text-sm text-muted-foreground">
              Describe what you want to monitor. Use keywords, phrases, or full sentences.
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
            <div className="mb-4 rounded-md border border-border bg-muted/30 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Boolean Query</span>
                {booleanQuery && (
                  <button 
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                    onClick={() => navigator.clipboard.writeText(booleanQuery)}
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="p-3 max-h-32 overflow-y-auto">
                {booleanQuery ? (
                  <code className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap break-all">
                    {booleanQuery}
                  </code>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Your boolean query will appear here as you build your search.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="mb-4 space-y-3 max-h-64 overflow-y-auto rounded-md border border-border p-3 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Conversation</span>
                <button 
                  onClick={clearChat}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">AI Assistant</span>
                      </div>
                    )}
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea 
                ref={textareaRef}
                placeholder="e.g., &quot;track mentions of our CEO in tech news&quot; or just &quot;brand crisis&quot;"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-32 resize-none bg-white border-border pr-10"
                rows={2}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                ⏎ to send
              </div>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Helper chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Try:</span>
            {['brand mentions', 'competitor tracking', 'executive coverage', 'industry news'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="text-xs px-2 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
