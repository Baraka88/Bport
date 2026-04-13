export const runtime = "edge";
'use client';

export const runtime = 'edge';

import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function ChatConversationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">AI Assistant Review Hosted Externally</h1>
        <p className="text-muted-foreground text-lg">
          The internal conversation flow has been removed from this site. Please use the external review link to access the AI assistant experience.
        </p>
      </div>

      <Button className="rounded-xl px-8 py-4 text-lg font-bold" asChild>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          Open External AI Review
        </a>
      </Button>
    </div>
  );
}
