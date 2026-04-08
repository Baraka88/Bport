
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getChatResponse } from '@/ai/flows/chat-flow';
import { cn } from '@/lib/utils';

export default function ChatConversationPage() {
  const { chatId } = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useMemoFirebase(() => {
    if (!db || !chatId) return null;
    return doc(db, 'chats', chatId as string);
  }, [db, chatId]);

  const { data: chatData, isLoading: chatLoading } = useDoc(chatRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !chatId) return null;
    return query(
      collection(db, 'chats', chatId as string, 'messages'),
      orderBy('createdAt', 'asc')
    );
  }, [db, chatId]);

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

    const messagesRef = collection(db, 'chats', chatId as string, 'messages');

    // 1. Add User Message
    await addDoc(messagesRef, {
      userId: user.uid,
      role: 'user',
      text: userText,
      createdAt: serverTimestamp(),
    });

    try {
      // 2. Prepare History for AI Context
      const history = (messages || []).map(m => ({
        role: m.role as 'user' | 'ai',
        text: m.text,
      })).slice(-10); // Last 10 messages for context

      // 3. Get AI Response
      const response = await getChatResponse({ message: userText, history });

      // 4. Add AI Message
      await addDoc(messagesRef, {
        userId: 'ai',
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
    if (!db || !chatId) return;
    await deleteDoc(doc(db, 'chats', chatId as string, 'messages', msgId));
  };

  if (chatLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!chatData) return <div className="flex-1 flex items-center justify-center">Chat not found</div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold truncate max-w-[200px] sm:max-w-md">{chatData.title}</h2>
        </div>
      </header>

      {/* Messages */}
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
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed relative",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-secondary/50 rounded-tl-none"
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

      {/* Input */}
      <div className="p-6 border-t bg-card/50">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Baraka's services..."
            className="rounded-xl h-12 bg-background/50 border-primary/10 focus:border-primary"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-xl shadow-lg shadow-primary/20" disabled={isTyping || !input.trim()}>
            {isTyping ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
