
'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, MessageSquarePlus, ShieldCheck, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ChatMainPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user && db) {
      const checkProfile = async () => {
        try {
          const docRef = doc(db, 'chat_users', user.uid);
          const docSnap = await getDoc(docRef);
          setHasProfile(docSnap.exists());
        } catch (e) {
          // If we can't read the profile, assume we need to create one
          setHasProfile(false);
        }
      };
      checkProfile();
    }
  }, [user, isUserLoading, db, router]);

  const handleAccessFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !username.trim()) return;

    setIsSubmitting(true);
    const now = new Date();
    const joinDate = now.toISOString();

    try {
      const profileData = {
        username: username,
        email: user.email || 'anonymous',
        joinDate: joinDate,
        role: 'user',
        createdAt: serverTimestamp(),
      };

      // 1. Save to Firestore
      await setDoc(doc(db, 'chat_users', user.uid), profileData);

      // 2. Notify Baraka via Formspree with detailed timestamp
      await fetch('https://formspree.io/f/mlgoveej', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'NEW CHATBRJ ACCESS REGISTRATION',
          fullName: username,
          email: user.email,
          uid: user.uid,
          submissionDay: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          submissionTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          fullTimestamp: joinDate
        }),
      });

      toast({ title: 'Access Granted', description: 'Welcome to ChatBRJ AI.' });
      setHasProfile(true);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || hasProfile === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
          <CardHeader className="bg-primary text-primary-foreground p-10 text-center">
            <UserCheck className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl font-black font-headline tracking-tighter">Identity Form</CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">
              Please provide your name to unlock ChatBRJ AI conversations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleAccessFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Full Name</Label>
                <Input 
                  required 
                  className="h-12 rounded-xl" 
                  placeholder="Enter your name..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Progress value={username ? 100 : 10} className="h-2" />
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1 font-bold uppercase">
                  <ShieldCheck className="h-3 w-3" /> Encrypted Submission to Baraka Junior
                </p>
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black shadow-xl" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Unlock ChatBRJ'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
        <MessageSquarePlus className="h-12 w-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black font-headline tracking-tighter">ChatBRJ AI Active</h1>
        <p className="text-muted-foreground max-w-sm text-lg font-medium">
          Select an existing conversation or start a new discussion from the sidebar.
        </p>
      </div>
    </div>
  );
}
