
'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Trash2, Edit3, Loader2, ChevronLeft, ChevronRight, Layout } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const chatsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: chats, isLoading } = useCollection(chatsQuery);

  const createNewChat = async () => {
    if (!db || !user) return;
    const docRef = await addDoc(collection(db, 'chats'), {
      userId: user.uid,
      title: 'New Conversation',
      createdAt: serverTimestamp(),
    });
    router.push(`/chat/${docRef.id}`);
  };

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!db) return;
    await deleteDoc(doc(db, 'chats', id));
    if (params.chatId === id) router.push('/chat');
  };

  const startEditing = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const saveTitle = async (id: string) => {
    if (!db || !editTitle.trim()) return;
    await updateDoc(doc(db, 'chats', id), { title: editTitle });
    setEditingId(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden border-t">
      {/* Sidebar */}
      <aside className={cn(
        "bg-secondary/20 border-r flex flex-col transition-all duration-300 relative",
        isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none"
      )}>
        <div className="p-4 flex flex-col h-full space-y-4">
          <Button 
            onClick={createNewChat} 
            className="w-full justify-start h-12 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/10"
          >
            <Plus className="mr-2 h-4 w-4" /> New Conversation
          </Button>

          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : chats?.map((chat) => (
                <Link 
                  key={chat.id} 
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center group px-3 py-3 rounded-xl transition-all hover:bg-primary/5",
                    params.chatId === chat.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
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
                    <span className="flex-1 truncate font-medium text-sm">{chat.title}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => startEditing(chat.id, chat.title, e)} className="p-1 hover:text-primary"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={(e) => deleteChat(chat.id, e)} className="p-1 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
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
