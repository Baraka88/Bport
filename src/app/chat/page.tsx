"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Mail, Lock, User, Loader2, Send, Sparkles } from "lucide-react"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile 
} from "firebase/auth"
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
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
    if (!db) return null
    return query(collection(db, "chat_messages"), orderBy("timestamp", "desc"), limit(50))
  }, [db])

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
      
      await addDoc(collection(db, "chat_users"), {
        id: userCredential.user.uid,
        username: username,
        email: email,
        joinDate: serverTimestamp()
      })

      toast({ title: "Registration Successful", description: "You can now participate in the chat." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Failed", description: error.message })
    } finally {
      setIsPending(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || !user) return

    const userMsgContent = message
    setMessage("")

    try {
      // 1. Add user message to Firestore
      await addDoc(collection(db, "chat_messages"), {
        chatUserId: user.uid,
        senderName: user.displayName || "Anonymous",
        messageContent: userMsgContent,
        timestamp: serverTimestamp()
      })

      // 2. Trigger AI Bot Response
      const aiResponse = await askChatBot(userMsgContent)

      // 3. Add AI message to Firestore
      await addDoc(collection(db, "chat_messages"), {
        chatUserId: "system-ai",
        senderName: "ChatBRJ AI",
        messageContent: aiResponse,
        timestamp: serverTimestamp()
      })

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to process message." })
    }
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
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Register</TabsTrigger>
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
    <div className="container mx-auto px-4 py-12 flex flex-col h-[85vh]">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl relative">
            {user.displayName?.charAt(0) || "U"}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div>
            <h2 className="font-bold text-xl">{user.displayName}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Connected to ChatBRJ AI</span>
              <Sparkles className="h-3 w-3 text-accent animate-pulse" />
            </div>
          </div>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => signOut(auth)}>Sign Out</Button>
      </div>

      <Card className="flex-1 rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card/50 backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
          {messages && messages.map((msg) => {
            const isMe = msg.chatUserId === user.uid;
            const isAI = msg.chatUserId === "system-ai";
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : isAI
                      ? "bg-accent/10 border border-accent/20 text-foreground rounded-tl-none"
                      : "bg-secondary text-secondary-foreground rounded-tl-none"
                }`}>
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 opacity-70">
                      {isAI && <Sparkles className="h-3 w-3 text-accent" />}
                      <p className="text-[10px] font-black uppercase tracking-widest">{msg.senderName}</p>
                    </div>
                  )}
                  <p className="leading-relaxed text-sm">{msg.messageContent}</p>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1.5 px-2 font-medium">
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )
          })}
        </div>

        <div className="p-6 border-t bg-card/80">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <Input 
              placeholder="Ask ChatBRJ AI anything..." 
              className="flex-1 rounded-2xl h-14 px-6 border-none bg-secondary/50 focus-visible:ring-primary shadow-inner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-primary shadow-lg hover:scale-105 transition-transform active:scale-95">
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
