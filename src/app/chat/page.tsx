
'use client';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function ChatMainPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 px-4">
      <div className="relative">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center">
          <Bot className="h-12 w-12 text-primary" />
        </div>
      </div>

      <div className="space-y-3 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">AI Assistant Review</h1>
        <p className="text-muted-foreground text-lg font-medium">
          The conversational AI experience has been moved to an external hosted review. Use the button below to access the latest AI assistant preview once it is live.
        </p>
      </div>

      <Button className="rounded-xl px-8 py-4 text-lg font-bold" asChild>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          Visit External Review
        </a>
      </Button>

      <p className="text-sm text-muted-foreground max-w-md">
        This page no longer uses the internal Firebase chat flow. The AI experience is now hosted externally to avoid runtime errors.
      </p>
    </div>
  );
}
