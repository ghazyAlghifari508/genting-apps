'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Calendar, List, Search, Settings, ChevronLeft, ChevronRight,
  Baby, Heart, Star, Filter, Loader2, Sparkles, BookCheck, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EducationProgressBar } from '@/components/education/EducationProgressBar';
import { PhaseFilter } from '@/components/education/PhaseFilter';
import { EducationSearchBar } from '@/components/education/EducationSearchBar';
import { TimelineView } from '@/components/education/TimelineView';

import { EducationCard } from '@/components/education/EducationCard';
import { EducationCalendarView } from '@/components/education/EducationCalendarView';



import { 
  Phase, UserStatus, EducationContent, UserProfile,
  PHASES, getPhaseFromDay, getPhaseLabelFromDay
} from '@/types/education';
import { 
  getAllEducationContent, 
  getContentByDay, 
  getUserProfile,
  upsertUserProfile,
  getUserProgress,
  toggleFavoriteStatus,
  getProgressStats
} from '@/lib/supabase/education-queries';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type ViewMode = 'timeline' | 'grid' | 'calendar';

export default function Education() {
  const router = useRouter();
  const supabase = createClient();
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Data states
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [contents, setContents] = useState<EducationContent[]>([]);
  const [readDays, setReadDays] = useState<Set<number>>(new Set());
  const [favoriteDays, setFavoriteDays] = useState<Set<number>>(new Set());
  const [stats, setStats] = useState({ total_read: 0, total_favorite: 0, progress_percentage: 0 });

  // View states
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRead, setShowRead] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Initialize: Get User & Data
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      try {
        const [profile, allContent, progress] = await Promise.all([
          getUserProfile(user.id),
          getAllEducationContent(),
          getUserProgress(user.id)
        ]);

        setUserData(profile);
        setContents(allContent);
        
        const read = new Set<number>();
        const fav = new Set<number>();
        progress.forEach(p => {
          if (p.is_read) read.add(p.day);
          if (p.is_favorite) fav.add(p.day);
        });
        setReadDays(read);
        setFavoriteDays(fav);

        const progressStats = await getProgressStats(user.id);
        if (progressStats) setStats(progressStats);
      } catch (error: any) {
        console.error("Error loading education data:", error?.message || error);
        // Show detailed error if available
        if (error?.details) console.error("Error details:", error.details);
        if (error?.hint) console.error("Error hint:", error.hint);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Filter content
  const filteredContents = useMemo(() => {
    let result = [...contents];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // Filter by phase
    if (selectedPhase !== 'all') {
      result = result.filter(c => c.phase === selectedPhase);
    }
    
    // Filter by favorites
    if (showFavorites) {
      result = result.filter(c => favoriteDays.has(c.day));
    }
    
    // Filter by read status
    if (showRead) {
      result = result.filter(c => readDays.has(c.day));
    }
    
    return result;
  }, [contents, searchQuery, selectedPhase, showFavorites, showRead, favoriteDays, readDays]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContents.slice(start, start + itemsPerPage);
  }, [filteredContents, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPhase, showFavorites, showRead]);

  // Today's recommendation
  const todayContent = useMemo(() => {
    if (!userData) return null;
    return contents.find(c => c.day === (userData?.current_day || 1)) || null;
  }, [userData, contents]);

  // Handlers


  const handleCardClick = (day: number) => {
    router.push(`/education/${day}`);
  };

  const handleFavorite = async (day: number) => {
    if (!userId) return;
    const isCurrentlyFavorite = favoriteDays.has(day);
    try {
      await toggleFavoriteStatus(userId, day, !isCurrentlyFavorite);
      setFavoriteDays(prev => {
        const next = new Set(prev);
        if (isCurrentlyFavorite) next.delete(day);
        else next.add(day);
        return next;
      });
      // Refresh stats
      const progressStats = await getProgressStats(userId);
      if (progressStats) setStats(progressStats);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleResetOnboarding = async () => {
    router.push('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-cerulean animate-spin mb-4" />
        <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest text-xs">Memuat Dashboard Edukasi...</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Top Header - Personalized */}
      <section className="bg-white border-b border-slate-100 pt-6 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-cerulean text-white font-black px-3 py-1 rounded-lg text-[10px] tracking-widest uppercase">
                  {getPhaseLabelFromDay(userData?.current_day || 1)}
                </Badge>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari ke-{userData?.current_day || 1}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Edukasi 1000 Hari <Sparkles className="w-8 h-8 text-amber-400" />
              </h1>
              <p className="text-slate-500 font-medium mt-1 leading-relaxed max-w-xl">
                Panduan lengkap nutrisi, kesehatan, dan tumbuh kembang untuk Bunda dan si kecil tercinta.
              </p>
            </div>
            

          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Area */}
          <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            {/* Progress Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cerulean/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-cerulean/10" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-secondary shadow-lg shadow-slate-200 ring-4 ring-slate-50">
                   <BookCheck className="w-6 h-6 text-sea-green" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">Statistik</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Progress Belajar</p>
                </div>
              </div>

              <EducationProgressBar 
                readCount={stats.total_read}
                streakDays={3}
                totalDays={1000}
              />
            </div>

            {/* Filter Group - Sticky */}
            <div className="lg:sticky lg:top-28 transition-all duration-300">
              <PhaseFilter
                selectedPhase={selectedPhase}
                onPhaseChange={setSelectedPhase}
                showFavorites={showFavorites}
                onFavoritesChange={setShowFavorites}
                showRead={showRead}
                onReadChange={setShowRead}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-10 order-1 lg:order-2">
            
            {/* Search Bar */}
            <EducationSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari panduan MPASI, nutrisi, atau aktivitas..."
            />

            {/* Today's Highlight */}
            {!searchQuery && selectedPhase === 'all' && todayContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cerulean to-sea-green rounded-[3rem] blur-2xl opacity-10" />
                <Card className="border-none rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-slate-200/40 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cerulean/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="flex flex-col md:flex-row relative z-10">
                    <div className="md:w-[30%] bg-slate-900 flex flex-col items-center justify-center p-10 md:p-14 text-center relative overflow-hidden rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cerulean/20 to-transparent" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-sea-green text-slate-900 font-extrabold mb-8 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-sea-green/20">
                          Pilihan Hari Ini
                        </div>

                          <div className="space-y-0">
                            <p className="text-white/30 font-black tracking-[0.4em] text-[10px] uppercase mb-2">HARI</p>
                            <h3 className="text-7xl md:text-8xl font-black text-white leading-none tracking-tighter">
                              {userData?.current_day || 1}
                            </h3>
                          </div>
                      </div>
                    </div>
                    <div className="md:w-[70%] p-10 md:p-16 flex flex-col justify-center gap-8">
                      <div className="space-y-5">
                        <div className="inline-flex bg-slate-100 text-slate-500 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                          Rekomendasi Personal
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                          {todayContent.title}
                        </h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                          {todayContent.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {todayContent.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="bg-white text-slate-400 font-bold uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-xl border-slate-100 italic shadow-sm">
                            #{tag.replace('#', '')}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        size="lg"
                        onClick={() => handleCardClick(todayContent.day)}
                        className="h-16 px-12 rounded-[1.25rem] bg-cerulean hover:bg-cerulean/90 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-cerulean/25 w-full md:w-fit"
                      >
                        Baca Panduan Lengkap
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* View Selection & Content */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-3xl border border-slate-100">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full sm:w-auto">
                  <TabsList className="bg-slate-50 p-1 rounded-2xl h-14 w-full sm:w-auto">
                    <TabsTrigger value="grid" className="gap-2 px-6 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
                      <List className="w-4 h-4" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2 px-6 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
                      <BookOpen className="w-4 h-4" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="gap-2 px-6 h-full rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
                      <Calendar className="w-4 h-4" />
                      Kalender
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
                  Ditemukan {filteredContents.length} Artikel
                </p>
              </div>

              <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                  {viewMode === 'grid' ? (
                    <motion.div 
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-10"
                    >
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {paginatedContents.length > 0 ? (
                          paginatedContents.map((content) => (
                            <EducationCard
                              key={content.id}
                              content={content}
                              isRead={readDays.has(content.day)}
                              isFavorite={favoriteDays.has(content.day)}
                              onClick={() => handleCardClick(content.day)}
                              onFavorite={() => handleFavorite(content.day)}
                            />
                          ))
                        ) : (
                          <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                              <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">Tidak ada konten ditemukan</h3>
                            <p className="text-slate-400 font-medium mt-2">Coba gunakan kata kunci lain atau ubah filter Anda</p>
                            <Button 
                              variant="ghost" 
                              className="mt-6 text-cerulean font-bold"
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedPhase('all');
                                setShowFavorites(false);
                                setShowRead(false);
                              }}
                            >
                              Reset Semua Filter
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Pagination UI */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-10 pb-6">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
                          >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                          </Button>
                          
                          <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum: number;
                              if (totalPages <= 5) pageNum = i + 1;
                              else if (currentPage <= 3) pageNum = i + 1;
                              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                              else pageNum = currentPage - 2 + i;

                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "ghost"}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={cn(
                                    "w-12 h-12 rounded-2xl font-black transition-all",
                                    currentPage === pageNum 
                                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                      : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
                          >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ) : viewMode === 'timeline' ? (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-10"
                    >
                      <TimelineView
                        contents={paginatedContents}
                        readDays={readDays}
                        favoriteDays={favoriteDays}
                        onCardClick={handleCardClick}
                        onFavorite={handleFavorite}
                        currentDay={userData?.current_day || 1}
                      />
                      
                      {/* Pagination UI for Timeline */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-10 pb-6">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
                          >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                          </Button>
                          
                          <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum: number;
                              if (totalPages <= 5) pageNum = i + 1;
                              else if (currentPage <= 3) pageNum = i + 1;
                              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                              else pageNum = currentPage - 2 + i;

                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "ghost"}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={cn(
                                    "w-12 h-12 rounded-2xl font-black transition-all",
                                    currentPage === pageNum 
                                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                      : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-12 h-12 rounded-2xl border-slate-100 shadow-sm"
                          >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                     <motion.div
                      key="calendar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                       <EducationCalendarView 
                          contents={contents}
                          readDays={readDays}
                          favoriteDays={favoriteDays}
                          onCardClick={handleCardClick}
                          currentDay={userData?.current_day || 1}
                       />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
