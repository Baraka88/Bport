"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, ArrowRight } from "lucide-react"
import React from "react"
import { useToast } from "@/hooks/use-toast"

export default function ChatAccessPage() {
  const [accessCode, setAccessCode] = React.useState("")
  const { toast } = useToast()

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (accessCode === "chatBRJ") {
      toast({
        title: "Access Granted",
        description: "Connecting to secure chat session...",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Access Code",
        description: "Please check your code and try again.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-32 flex items-center justify-center">
      <Card className="max-w-md w-full rounded-3xl shadow-2xl border-none">
        <CardHeader className="text-center space-y-4 pt-12 pb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-bold">Secure Access</CardTitle>
            <p className="text-muted-foreground">Authorized users only</p>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2 text-center">
              <Label htmlFor="code" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Access Code</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl h-14 pl-12 text-xl tracking-widest text-center"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl py-7 text-lg font-bold shadow-lg flex items-center justify-center gap-2 group">
              Verify and Enter Chat
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Don't have a code? <a href="/contact" className="text-primary font-bold hover:underline">Request Access</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}