
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, User, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getChatResponse } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';

export default function ChatConversationPage() {
  const { chatId } = useParams();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // 1. Mandatory Profile Check
  useEffect(() => {
    if (!isUserLoading && !user) router.push('/auth');
    if (user && db) {
      getDoc(doc(db, 'chat_users', user.uid)).then(snap => {
        if (!snap.exists()) router.push('/chat');
        else setHasProfile(true);
      });
    }
  }, [user, isUserLoading, db, router]);

  const chatRef = useMemoFirebase(() => {
    if (!db || !chatId) return null;
    return doc(db, 'chats', chatId as string);
  }, [db, chatId]);

  const { data: chatData, isLoading: chatLoading } = useDoc(chatRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !chatId || !user || !hasProfile) return null;
    return query(
      collection(db, 'chat_messages'),
      where('chatId', '==', chatId),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );
  }, [db, chatId, user, hasProfile]);

  const { data: messages } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !input.trim() || !chatId) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    const messagesRef = collection(db, 'chat_messages');

    // Add user message
    addDoc(messagesRef, {
      chatId: chatId as string,
      userId: user.uid,
      role: 'user',
      text: userText,
      createdAt: serverTimestamp(),
    });

    try {
      const history = (messages || []).map(m => ({
        role: m.role as 'user' | 'ai',
        text: m.text,
      })).slice(-10);

      const response = await getChatResponse({ message: userText, history });

      // Add AI response
      addDoc(messagesRef, {
        chatId: chatId as string,
        userId: user.uid,
        role: 'ai',
        text: response.text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const deleteMessage = async (msgId: string) => {
    if (!db) return;
    deleteDoc(doc(db, 'chat_messages', msgId));
  };

  if (chatLoading || hasProfile === null) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!chatData) return <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground"><AlertCircle className="h-10 w-10" /><p>Conversation access denied.</p></div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <header className="px-6 py-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold truncate max-w-[250px]">{chatData.title}</h2>
        </div>
      </header>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages?.map((msg) => (
            <div key={msg.id} className={cn(
              "flex group",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "flex max-w-[85%] sm:max-w-[75%] gap-3",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed relative whitespace-pre-wrap",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-secondary/50 rounded-tl-none border border-border"
                  )}>
                    {msg.text}
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="absolute top-0 -right-8 p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-card/50">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk with Baraka's AI agent..."
            className="rounded-xl h-12 bg-background/50"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shadow-lg" disabled={isTyping || !input.trim()}>
            {isTyping ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
