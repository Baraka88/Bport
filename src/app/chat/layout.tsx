
'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Trash2, Edit3, Loader2, ChevronLeft, ChevronRight, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId as string;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (user && db) {
      const checkProfile = async () => {
        const docSnap = await getDoc(doc(db, 'chat_users', user.uid));
        setHasProfile(docSnap.exists());
      };
      checkProfile();
    } else if (!isUserLoading && !user) {
      setHasProfile(false);
    }
  }, [user, db, isUserLoading]);

  const chatsQuery = useMemoFirebase(() => {
    if (!db || !user || !hasProfile) return null;
    return query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user, hasProfile]);

  const { data: chats, isLoading } = useCollection(chatsQuery);

  const createNewChat = () => {
    if (!db || !user || !hasProfile) return;
    const chatsRef = collection(db, 'chats');
    addDocumentNonBlocking(chatsRef, {
      userId: user.uid,
      title: 'New Discussion',
      createdAt: serverTimestamp(),
    }).then((docRef) => {
      if (docRef) router.push(`/chat/${docRef.id}`);
    });
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, 'chats', id));
    if (chatId === id) router.push('/chat');
  };

  const saveTitle = (id: string) => {
    if (!db || !editTitle.trim()) {
      setEditingId(null);
      return;
    }
    updateDocumentNonBlocking(doc(db, 'chats', id), { title: editTitle });
    setEditingId(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden border-t">
      <aside className={cn(
        "bg-secondary/20 border-r flex flex-col transition-all duration-300 relative",
        isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none"
      )}>
        <div className="p-4 flex flex-col h-full space-y-4">
          <Button 
            onClick={createNewChat} 
            disabled={!hasProfile || isLoading}
            className="w-full justify-start h-12 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> New Conversation
          </Button>

          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-1">
              {(isLoading || isUserLoading) ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : chats?.map((chat) => (
                <Link 
                  key={chat.id} 
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center group px-3 py-3 rounded-xl transition-all",
                    chatId === chat.id ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-primary/5"
                  )}
                >
                  <MessageSquare className="h-4 w-4 mr-3 shrink-0" />
                  {editingId === chat.id ? (
                    <Input 
                      className="h-7 p-1 text-sm rounded-md"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveTitle(chat.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle(chat.id)}
                    />
                  ) : (
                    <span className="flex-1 truncate text-sm">{chat.title}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingId(chat.id); setEditTitle(chat.title); }} className="p-1 hover:text-primary"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => deleteChat(chat.id, e)} className="p-1 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </Link>
              ))}
              {!isLoading && !chats?.length && hasProfile && (
                <p className="text-center text-xs text-muted-foreground pt-10 px-4">No chat history yet. Start your first session!</p>
              )}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t space-y-2">
            <Link 
              href="/"
              className="flex items-center px-3 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all font-bold text-sm"
            >
              <Home className="h-4 w-4 mr-3" /> Back Home
            </Link>
            <Link 
              href="/comments"
              className="flex items-center px-3 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-all font-bold text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-3" /> Community Wall
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-4 z-20 p-1.5 rounded-full bg-background border shadow-sm transition-all hover:bg-secondary",
            isSidebarOpen ? "left-[-14px]" : "left-4"
          )}
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {children}
      </main>
    </div>
  );
}
