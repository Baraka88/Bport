
'use client';

import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_QUOTES, MOTIVATIONAL_VIDEOS, type MotivationQuote, type MotivationVideo } from '@/app/data/motivation';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, PlayCircle, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MotivationPage() {
  const [dailyQuote, setDailyQuote] = useState<MotivationQuote | null>(null);
  const [dailyVideo, setDailyVideo] = useState<MotivationVideo | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    // Generate a daily seed based on the current date (YYYYMMDD)
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seed = parseInt(dateString);

    const quoteIndex = seed % MOTIVATIONAL_QUOTES.length;
    const videoIndex = quoteIndex % MOTIVATIONAL_VIDEOS.length;

    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
    setDailyVideo(MOTIVATIONAL_VIDEOS[videoIndex]);
  }, []);

  useEffect(() => {
    if (!dailyVideo) {
      setIframeSrc(null);
      return;
    }

    setIframeSrc(
      `https://www.youtube-nocookie.com/embed/${dailyVideo.embedId}?rel=0&modestbranding=1&playsinline=1&controls=1`
    );
  }, [dailyVideo]);

  if (!dailyQuote || !dailyVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen space-y-24">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" /> Daily Fuel
        </div>
        <h1 className="text-4xl md:text-7xl font-black font-headline">Stay <span className="text-primary">Driven</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Success is built on daily habits. Here is your inspiration for today.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
        {/* Quote Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden group">
            <CardContent className="p-12 relative">
              <Quote className="h-16 w-16 text-primary/20 absolute top-8 left-8 -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="space-y-8 relative z-10">
                <p className="text-3xl md:text-4xl font-black font-headline leading-tight italic">
                  "{dailyQuote.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-xl font-bold text-primary">{dailyQuote.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-accent p-8 rounded-[2.5rem] shadow-xl text-accent-foreground space-y-4">
            <h3 className="text-xl font-black font-headline flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Why Motivation?
            </h3>
            <p className="font-medium opacity-90 leading-relaxed">
              In full-stack development, logic solves the code, but passion solves the problem. Keep your mindset sharp.
            </p>
          </div>
        </div>

        {/* Video Section */}
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black font-headline flex items-center gap-3">
              <PlayCircle className="h-8 w-8 text-primary" />
              Featured Video
            </h2>
            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-card bg-black">
              {iframeSrc ? (
                <iframe
                  className="w-full h-full"
                  src={iframeSrc}
                  title={dailyVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black text-white text-sm font-semibold">
                  Loading video...
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 bg-card/30 rounded-2xl border">
              <div>
                <span className="font-bold text-lg block">{dailyVideo.title}</span>
                <span className="text-xs text-muted-foreground">Today's Pick</span>
              </div>
              <div className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
                Embedded Playback
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center opacity-30">
        <p className="text-sm font-bold uppercase tracking-[0.2em]">New content every 24 hours</p>
      </div>
    </div>
  );
}
