'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, getDocs, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Search,
  CheckCircle,
  FileDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [search, setSearch] = useState('');

  // 1. Verify Admin Role
  useEffect(() => {
    if (!isUserLoading && !user) router.push('/auth');
    if (user && db) {
      const checkAdmin = async () => {
        const docRef = doc(db, 'chat_users', user.uid);
        const snap = await getDocs(query(collection(db, 'chat_users'), where('email', '==', user.email)));
        if (!snap.empty && (snap.docs[0].data().role === 'admin' || snap.docs[0].data().role === 'admin ')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast({ variant: 'destructive', title: 'Access Denied', description: 'Admin privileges required.' });
          router.push('/');
        }
      };
      checkAdmin();
    }
  }, [user, isUserLoading, db, router, toast]);

  // 2. Collections
  const usersQuery = useMemoFirebase(() => db ? query(collection(db, 'chat_users'), orderBy('joinDate', 'desc')) : null, [db]);
  const chatsQuery = useMemoFirebase(() => db ? query(collection(db, 'chats'), orderBy('createdAt', 'desc')) : null, [db]);
  const hireQuery = useMemoFirebase(() => db ? query(collection(db, 'inquiries_hire_me'), orderBy('createdAt', 'desc')) : null, [db]);

  const { data: allUsers } = useCollection(usersQuery);
  const { data: allChats } = useCollection(chatsQuery);
  const { data: allInquiries } = useCollection(hireQuery);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h])).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const deleteItem = async (col: string, id: string) => {
    if (!db) return;
    if (confirm('Delete this record forever?')) {
      await deleteDoc(doc(db, col, id));
      toast({ title: 'Deleted', description: 'Record removed successfully.' });
    }
  };

  if (isUserLoading || isAdmin === null) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline flex items-center gap-3">
            <ShieldAlert className="text-primary h-10 w-10" /> Admin Control
          </h1>
          <p className="text-muted-foreground">Monitor platform activity and manage community interactions.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-xl" onClick={() => exportToCSV(allInquiries || [], 'hire_requests.csv')}>
            <FileDown className="mr-2 h-4 w-4" /> Export Inquiries
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1 h-14 rounded-2xl">
          <TabsTrigger value="users" className="rounded-xl px-6 font-bold h-12"><Users className="mr-2 h-4 w-4" /> Users</TabsTrigger>
          <TabsTrigger value="chats" className="rounded-xl px-6 font-bold h-12"><MessageSquare className="mr-2 h-4 w-4" /> All Chats</TabsTrigger>
          <TabsTrigger value="inquiries" className="rounded-xl px-6 font-bold h-12"><CheckCircle className="mr-2 h-4 w-4" /> Hire Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-10 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allUsers?.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())).map(u => (
              <Card key={u.id} className="rounded-2xl border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-secondary/30 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold truncate">{u.username}</CardTitle>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' || u.role === 'admin ' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {u.role}
                    </span>
                  </div>
                  <CardDescription className="truncate">{u.email}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground font-medium">Joined: {u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'Unknown'}</span>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteItem('chat_users', u.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <div className="grid gap-4">
            {allChats?.map(chat => (
              <div key={chat.id} className="flex items-center justify-between p-4 bg-card border rounded-2xl hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{chat.title}</h4>
                    <p className="text-xs text-muted-foreground">User ID: {chat.userId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" asChild>
                    <a href={`/chat/${chat.id}`} target="_blank">View <ExternalLink className="ml-2 h-3 w-3" /></a>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl text-destructive" onClick={() => deleteItem('chats', chat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inquiries">
          <div className="space-y-4">
            {allInquiries?.map(inq => (
              <Card key={inq.id} className="rounded-2xl border-none shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black">{inq.clientName}</h3>
                      <p className="text-sm text-primary font-bold">{inq.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase bg-secondary px-2 py-1 rounded-full">
                        {inq.urgency} Priority
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground bg-secondary/20 p-4 rounded-xl mb-4 italic">"{inq.message}"</p>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex gap-4">
                      <span><strong>Budget:</strong> {inq.budget}</span>
                      <span><strong>Timeline:</strong> {inq.timeline}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteItem('inquiries_hire_me', inq.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}