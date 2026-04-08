
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ChatMainPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  const startNewChat = async () => {
    if (!db || !user) return;
    const docRef = await addDoc(collection(db, 'chats'), {
      userId: user.uid,
      title: 'New Conversation',
      createdAt: serverTimestamp(),
    });
    router.push(`/chat/${docRef.id}`);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
        <MessageSquarePlus className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black font-headline">Welcome to ChatBRJ</h1>
        <p className="text-muted-foreground max-w-sm">
          Select a conversation from the sidebar or start a new AI-powered discussion about Baraka's services.
        </p>
      </div>
      <Button onClick={startNewChat} size="lg" className="rounded-2xl h-14 px-8 font-bold shadow-xl shadow-primary/20">
        Start a New Chat
      </Button>
    </div>
  );
}
