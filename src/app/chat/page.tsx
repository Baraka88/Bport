
'use client';
export const runtime = "edge";
import React, { useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Bot, Sparkles, MessageSquarePlus } from 'lucide-react';

export default function ChatMainPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 px-4">
      <div className="relative">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
          <Bot className="h-12 w-12 text-primary" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-bounce" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">ChatBRJ AI Ready</h1>
        <p className="text-muted-foreground max-w-md text-lg font-medium">
          Welcome to the professional AI agent of Baraka Junior. Choose a topic from the sidebar or start a fresh session to explore my technical expertise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full pt-4">
        <div className="p-6 bg-secondary/30 rounded-2xl border border-primary/5 text-left space-y-2">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> System Analysis
          </h3>
          <p className="text-sm text-muted-foreground">Ask about how I architect scalable systems and database structures.</p>
        </div>
        <div className="p-6 bg-secondary/30 rounded-2xl border border-primary/5 text-left space-y-2">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" /> Full Stack Dev
          </h3>
          <p className="text-sm text-muted-foreground">Inquire about my experience with Node.js, PHP, React, and Vue.js.</p>
        </div>
      </div>
    </div>
  );
}
