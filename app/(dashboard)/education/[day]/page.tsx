'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Share2, BookCheck, Clock, 
  ChevronRight, ChevronLeft, Sparkles, Lightbulb,
  CheckCircle2, Loader2, Bookmark, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getContentByDay, 
  toggleReadStatus, 
  toggleFavoriteStatus,
  getUserProgress
} from '@/lib/supabase/education-queries';
import { EducationContent, getPhaseInfo, getPhaseLabelFromDay } from '@/types/education';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function EducationDetail() {
  const router = useRouter();
  const params = useParams();
  const day = parseInt(params.day as string);
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<EducationContent | null>(null);
  const [isRead, setIsRead] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      try {
        const [data, progress] = await Promise.all([
          getContentByDay(day),
          getUserProgress(user.id)
        ]);

        if (data) {
          setContent(data);
          const currentProgress = progress.find(p => p.day === day);
          if (currentProgress) {
            setIsRead(currentProgress.is_read);
            setIsFavorite(currentProgress.is_favorite);
          }
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [day]);

  const handleToggleRead = async () => {
    if (!userId) return;
    try {
      await toggleReadStatus(userId, day, !isRead);
      setIsRead(!isRead);
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!userId) return;
    try {
      await toggleFavoriteStatus(userId, day, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  if (loading) {
    return <LoadingScreen message="Menyiapkan Materi Edukasi..." />;
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <BookCheck className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Materi Tidak Ditemukan</h2>
        <p className="text-slate-500 font-medium mb-8">Maaf, materi untuk hari ke-{day} belum tersedia atau sedang dalam pengembangan.</p>
        <Button onClick={() => router.push('/education')} variant="default" className="bg-slate-900 h-14 px-8 rounded-2xl font-bold">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo(content.phase);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Floating Navbar (Custom) */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/education')}
              className="h-12 w-12 rounded-2xl hover:bg-slate-100 transition-all active:scale-90"
            >
              <ArrowLeft className="w-6 h-6 text-slate-900" />
            </Button>
            <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EDUKASI HARI KE-{day}</p>
              <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[200px] lg:max-w-md">{content.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={cn(
                "h-12 w-12 rounded-2xl transition-all active:scale-90",
                isFavorite ? "text-amber-500 bg-amber-50 shadow-inner" : "text-slate-400 hover:bg-slate-100"
              )}
            >
              <Bookmark className={cn("w-6 h-6", isFavorite && "fill-amber-500")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl text-slate-400 hover:bg-slate-100 active:scale-90"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Section */}
          <header className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3">
              <Badge className={cn("px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase text-white shadow-lg", phaseInfo.color)}>
                {phaseInfo.label}
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase border-slate-200 text-slate-400">
                {content.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm border-y border-slate-50 py-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cerulean" />
                <span>5 Menit Baca</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sea-green" />
                <span>Interaktif</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className={cn("w-5 h-5", isRead ? "text-sea-green" : "text-slate-300")} />
                <span>{isRead ? "Selesai dibaca" : "Belum dibaca"}</span>
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <article className="prose prose-slate prose-lg max-w-none animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <div className="space-y-10 text-slate-700 font-medium leading-relaxed text-lg lg:text-xl">
              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 border-l-8 border-l-cerulean italic text-slate-800 font-black text-2xl leading-snug">
                "{content.description}"
              </div>
              
              <div className="whitespace-pre-wrap leading-loose">
                {content.content}
              </div>

              {/* Tips Section */}
              {content.tips && (
                <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] shadow-xl shadow-amber-100/30 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Lightbulb className="w-32 h-32 text-amber-500" />
                  </div>
                  <CardContent className="p-10 space-y-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Tips Penting Hari Ini</h3>
                    </div>
                    <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap">
                      {content.tips}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </article>

          {/* Bottom Footer Actions */}
          <footer className="pt-12 border-t border-slate-100 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {content.tags.map(tag => (
                  <Badge key={tag} className="bg-slate-100 text-slate-400 border-none px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <Button
                onClick={handleToggleRead}
                size="lg"
                className={cn(
                  "h-16 px-10 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl",
                  isRead 
                    ? "bg-sea-green text-white shadow-sea-green/20" 
                    : "bg-slate-900 text-white shadow-slate-200"
                )}
              >
                {isRead ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" /> SELSAI DIBACA
                  </span>
                ) : (
                  "TANDAI SELESAI"
                )}
              </Button>
            </div>

            {/* Navigation between days */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="ghost"
                disabled={day <= 1}
                onClick={() => router.push(`/education/${day - 1}`)}
                className="h-24 rounded-3xl border border-slate-100 flex flex-col items-start gap-1 px-8 hover:bg-slate-50 transition-all font-black text-slate-400 disabled:opacity-30"
              >
                <div className="flex items-center gap-1 uppercase tracking-widest text-[10px]">
                  <ChevronLeft className="w-3 h-3" /> Kembali
                </div>
                <div className="text-slate-900 group-hover:text-cerulean truncate w-full text-left">HARI KE-{day - 1}</div>
              </Button>
              
              <Button
                variant="ghost"
                disabled={day >= 1000}
                onClick={() => router.push(`/education/${day + 1}`)}
                className="h-24 rounded-3xl border border-slate-100 flex flex-col items-end gap-1 px-8 hover:bg-slate-50 transition-all font-black text-slate-400 disabled:opacity-30"
              >
                <div className="flex items-center gap-1 uppercase tracking-widest text-[10px]">
                  Lanjut <ChevronRight className="w-3 h-3" />
                </div>
                <div className="text-slate-900 group-hover:text-cerulean truncate w-full text-right">HARI KE-{day + 1}</div>
              </Button>
            </div>
          </footer>
        </div>
      </main>

      {/* Modern CSS for better readability */}
      <style jsx global>{`
        .prose p {
          margin-bottom: 2em;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
