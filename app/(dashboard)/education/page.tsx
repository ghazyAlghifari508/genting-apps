'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Calendar, List, Search, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { 
  Phase, EducationContent, UserProfile,
  getPhaseLabelFromDay
} from '@/types/education';
import { 
  getAllEducationContent, 
  getUserProfile,
  getUserProgress,
  toggleFavoriteStatus,
  getProgressStats
} from '@/lib/supabase/education-queries';

import { SectionHeader } from '@/components/shared/section-header';
import { TodayHighlight } from '@/components/education/TodayHighlight';
import { SidebarStats } from '@/components/education/SidebarStats';
import { PaginationUI } from '@/components/shared/pagination-ui';
import { PhaseFilter } from '@/components/education/PhaseFilter';
import { EducationSearchBar } from '@/components/education/EducationSearchBar';
import { TimelineView } from '@/components/education/TimelineView';
import { EducationCard } from '@/components/education/EducationCard';
import { EducationCalendarView } from '@/components/education/EducationCalendarView';

type ViewMode = 'timeline' | 'grid' | 'calendar';

export default function Education() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [contents, setContents] = useState<EducationContent[]>([]);
  const [readDays, setReadDays] = useState<Set<number>>(new Set());
  const [favoriteDays, setFavoriteDays] = useState<Set<number>>(new Set());
  const [stats, setStats] = useState({ total_read: 0, total_favorite: 0, progress_percentage: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'all'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRead, setShowRead] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      try {
        console.log("Fetching education data for user:", user.id);
        const [profile, allContent, progress] = await Promise.all([
          getUserProfile(user.id),
          getAllEducationContent(),
          getUserProgress(user.id)
        ]);

        console.log("Loaded profile:", profile);
        console.log("Loaded content count:", allContent?.length || 0);

        setUserData(profile);
        // Ensure tags and tips are arrays even if DB returns null
        const sanitizedContent = (allContent || []).map(c => ({
          ...c,
          tags: c.tags || [],
          tips: c.tips || []
        }));
        setContents(sanitizedContent);
        
        const read = new Set<number>();
        const fav = new Set<number>();
        (progress || []).forEach(p => {
          if (p.is_read) read.add(p.day);
          if (p.is_favorite) fav.add(p.day);
        });
        setReadDays(read);
        setFavoriteDays(fav);

        const progressStats = await getProgressStats(user.id);
        if (progressStats) setStats(progressStats);
      } catch (error: any) {
        console.error("Error loading education data:", error?.message || error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const filteredContents = useMemo(() => {
    let result = [...contents];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedPhase !== 'all') {
      result = result.filter(c => c.phase === selectedPhase);
    }
    if (showFavorites) {
      result = result.filter(c => favoriteDays.has(c.day));
    }
    if (showRead) {
      result = result.filter(c => readDays.has(c.day));
    }
    return result;
  }, [contents, searchQuery, selectedPhase, showFavorites, showRead, favoriteDays, readDays]);

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContents.slice(start, start + itemsPerPage);
  }, [filteredContents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPhase, showFavorites, showRead]);

  const todayContent = useMemo(() => {
    if (!userData) return null;
    return contents.find(c => c.day === (userData?.current_day || 1)) || null;
  }, [userData, contents]);

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
      const progressStats = await getProgressStats(userId);
      if (progressStats) setStats(progressStats);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return <LoadingScreen message="Memuat Dashboard Edukasi..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      <section className="bg-white border-b border-slate-100 pt-6 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader 
            title="Edukasi 1000 Hari"
            subtitle="Panduan lengkap nutrisi, kesehatan, dan tumbuh kembang untuk Bunda dan si kecil tercinta."
            badge={getPhaseLabelFromDay(userData?.current_day || 1)}
            icon={<Sparkles className="w-8 h-8 text-amber-400" />}
          >
             <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari ke-{userData?.current_day || 1}</span>
              </div>
          </SectionHeader>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            <SidebarStats 
              readCount={stats.total_read}
              totalDays={1000}
            />
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

          <div className="lg:col-span-9 space-y-10 order-1 lg:order-2">
            <EducationSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari panduan MPASI, nutrisi, atau aktivitas..."
            />

            {!searchQuery && selectedPhase === 'all' && todayContent && (
              <TodayHighlight 
                content={todayContent}
                currentDay={userData?.current_day || 1}
                onReadMore={handleCardClick}
              />
            )}

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
                          </div>
                        )}
                      </div>
                      <PaginationUI 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
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
                      <PaginationUI 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
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
