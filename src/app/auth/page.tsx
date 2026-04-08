
'use client';

import React, { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({ title: 'Welcome Back!', description: 'Redirecting to your dashboard...' });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCred.user, { displayName: formData.username });
        
        // Create User Profile in Firestore
        await setDoc(doc(db, 'chat_users', userCred.user.uid), {
          username: formData.username,
          email: formData.email,
          role: 'user',
          joinDate: new Date().toISOString(),
          createdAt: serverTimestamp()
        });
        
        toast({ title: 'Account Created', description: 'Welcome to the BRJDEV community!' });
      }
      router.push('/chat');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Auth Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
        <CardHeader className="bg-primary text-primary-foreground p-10 text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-4" />
          <CardTitle className="text-3xl font-black font-headline">
            {isLogin ? 'Member Login' : 'Join the Community'}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 font-medium">
            {isLogin ? 'Access your chats and services' : 'Create an account to build together'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    required 
                    className="pl-10 h-12 rounded-xl" 
                    placeholder="baraka_dev"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  required 
                  className="pl-10 h-12 rounded-xl" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  required 
                  className="pl-10 h-12 rounded-xl" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black shadow-xl" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
