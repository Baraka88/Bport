"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Mail, Lock, User, Loader2, Send, Sparkles, Trash2, RotateCcw, MessageCircle } from "lucide-react"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile 
} from "firebase/auth"
import { collection, addDoc, doc, setDoc, serverTimestamp, query, orderBy, limit, getDocs, writeBatch } from "firebase/firestore"
import { askChatBot } from "@/app/actions/portfolio-actions"

export default function ChatPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const [message, setMessage] = React.useState("")

  const messagesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "chats", user.uid, "messages"), 
      orderBy("timestamp", "desc"), 
      limit(100)
    )
  }, [db, user])

  const { data: messages } = useCollection(messagesQuery)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({ title: "Welcome back!", description: "Connected to ChatBRJ session." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message })
    } finally {
      setIsPending(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: username })
      
      if (db) {
        const batch = writeBatch(db)
        
        // Use the 'users' collection with role logic as requested
        const userDocRef = doc(db, "users", userCredential.user.uid)
        batch.set(userDocRef, {
          uid: userCredential.user.uid,
          username: username,
          email: email,
          role: "user",
          joinDate: serverTimestamp()
        })

        // Initialize user's chat document to satisfy security rules
        const chatDocRef = doc(db, "chats", userCredential.user.uid)
        batch.set(chatDocRef, {
          userId: userCredential.user.uid,
          createdAt: serverTimestamp()
        })

        await batch.commit()
      }
      toast({ title: "Registration Successful", description: "You can now participate in the chat." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Failed", description: error.message })
    } finally {
      setIsPending(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || !user || !db) return

    const userMsgContent = message
    setMessage("")

    try {
      // Ensure parent chat document exists (idempotent)
      await setDoc(doc(db, "chats", user.uid), {
        userId: user.uid,
        lastMessageAt: serverTimestamp()
      }, { merge: true })

      await addDoc(collection(db, "chats", user.uid, "messages"), {
        senderName: user.displayName || "You",
        messageContent: userMsgContent,
        timestamp: serverTimestamp(),
        isAI: false
      })

      const aiResponse = await askChatBot(userMsgContent)

      await addDoc(collection(db, "chats", user.uid, "messages"), {
        senderName: "ChatBRJ AI",
        messageContent: aiResponse,
        timestamp: serverTimestamp(),
        isAI: true
      })

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to process message." })
    }
  }

  async function handleDeleteConversation() {
    if (!user || !db) return
    if (!confirm("Are you sure you want to delete your entire chat history? This cannot be undone.")) return

    setIsPending(true)
    try {
      const q = query(collection(db, "chats", user.uid, "messages"))
      const snapshot = await getDocs(q)
      
      const batch = writeBatch(db)
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      toast({ title: "History Deleted", description: "Your conversation has been cleared." })
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed", description: "Failed to clear history." })
    } finally {
      setIsPending(false)
    }
  }

  function handleNewChat() {
    setMessage("")
    toast({ title: "Ready", description: "Start a fresh topic below!" })
  }

  if (isUserLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none">
          <CardHeader className="text-center space-y-4 pt-12 pb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-headline font-bold">ChatBRJ AI Access</CardTitle>
              <CardDescription>Join our professional developer community</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 bg-secondary">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10 rounded-xl h-12" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 rounded-xl h-12" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-xl py-6 font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-name" 
                        placeholder="DeveloperName" 
                        className="pl-10 rounded-xl h-12" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10 rounded-xl h-12" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="Min 6 characters" 
                        className="pl-10 rounded-xl h-12" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-xl py-6 font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl relative shadow-lg">
            {user.displayName?.charAt(0) || "U"}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div>
            <h2 className="font-bold text-xl">{user.displayName}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Secure Channel Active</span>
              <Sparkles className="h-3 w-3 text-accent animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="secondary" className="rounded-full gap-2 flex-1 md:flex-none" onClick={handleNewChat}>
            <RotateCcw className="h-4 w-4" /> New Chat
          </Button>
          <Button variant="outline" className="rounded-full gap-2 flex-1 md:flex-none text-red-500 border-red-500/20 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={handleDeleteConversation}>
            <Trash2 className="h-4 w-4" /> Clear History
          </Button>
          <Button variant="ghost" className="rounded-full flex-1 md:flex-none" onClick={() => signOut(auth)}>Sign Out</Button>
        </div>
      </div>

      <Card className="flex-1 rounded-[2rem] border-none shadow-2xl flex flex-col overflow-hidden bg-card/50 backdrop-blur-xl border border-white/10">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col-reverse">
          {messages && messages.map((msg) => {
            const isMe = !msg.isAI;
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[90%] md:max-w-[75%] p-4 md:p-5 rounded-2xl shadow-sm ${
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50"
                }`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                      <Sparkles className="h-3 w-3 text-accent" />
                      <p className="text-[10px] font-black uppercase tracking-widest">ChatBRJ AI</p>
                    </div>
                  )}
                  <p className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">{msg.messageContent}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 px-2 font-medium opacity-60">
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )
          })}
          
          {messages?.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-40">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <MessageCircle className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">Secure Inbox</p>
                <p className="text-sm max-w-xs">Messages are now stored in your personal encrypted vault.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-8 border-t bg-background/50 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex gap-4 max-w-5xl mx-auto">
            <Input 
              placeholder="Start a secure conversation..." 
              className="flex-1 rounded-2xl h-14 px-6 border-none bg-secondary/80 focus-visible:ring-primary shadow-inner text-base"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isPending}
            />
            <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-primary shadow-xl hover:scale-105 transition-transform active:scale-95" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Send className="h-6 w-6" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}