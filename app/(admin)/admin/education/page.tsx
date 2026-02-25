'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchEducationContents, deleteEducationContent } from '@/services/adminService'
import { EducationModal } from '@/components/admin/EducationModal'
import type { Category, Phase } from '@/types/education'

import { AdminTopHeader } from '@/components/admin/AdminTopHeader'

interface EducationContent {
  id: string
  day: number
  phase: Phase
  month: number
  title: string
  description: string
  content: string
  tips: string[] | string
  category: Category
  thumbnail_url?: string
  created_at: string
}

const phaseLabels: Record<string, string> = {
  kehamilan: 'Kehamilan',
  bayi_0_3: 'Bayi 0-3 Bulan',
  bayi_3_12: 'Bayi 3-12 Bulan',
  anak_1_2: 'Anak 1-2 Tahun',
}

const categoryLabels: Record<string, string> = {
  nutrisi: 'Nutrisi',
  kesehatan: 'Kesehatan',
  stimulasi: 'Stimulasi',
  perkembangan: 'Perkembangan',
  aktivitas: 'Aktivitas',
  imunisasi: 'Imunisasi',
}

const categoryColors: Record<string, string> = {
  nutrisi: 'bg-doccure-teal/10 text-doccure-teal',
  kesehatan: 'bg-cerulean/10 text-cerulean',
  stimulasi: 'bg-grapefruit/10 text-grapefruit',
  perkembangan: 'bg-purple-100 text-purple-600',
  aktivitas: 'bg-apricot/10 text-doccure-yellow-600',
  imunisasi: 'bg-sky-100 text-sky-600',
}

export default function EducationManagementPage() {
  const [contents, setContents] = useState<EducationContent[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null)

  const loadData = useCallback(async () => {
    try {
      const data = await fetchEducationContents({
        search: searchQuery || undefined,
        category: categoryFilter || undefined,
        phase: phaseFilter || undefined,
      })
      setContents(data as EducationContent[])
    } catch (error) {
      console.error('Error loading education:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, categoryFilter, phaseFilter])

  useEffect(() => {
    loadData()
  }, [categoryFilter, phaseFilter, loadData])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      loadData()
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, loadData])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await deleteEducationContent(deleteId)
      setContents((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting education:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleCreate = () => {
    setSelectedContent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (content: EducationContent) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  if (loading && contents.length === 0) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-10 w-full sm:max-w-md rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col p-4 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100/50 dark:border-white/5 shadow-sm h-[320px] transition-colors">
              <Skeleton className="w-full h-40 rounded-2xl mb-4" />
              <Skeleton className="h-4 w-20 mb-3 rounded-full" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-4" />
              <div className="mt-auto flex justify-between items-center">
                 <Skeleton className="h-8 w-8 rounded-full" />
                 <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <AdminTopHeader title="Manage Edukasi" showSearch={false} />

      {/* Top Header Row with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-sm text-slate-500">{contents.length} artikel edukasi aktif</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="rounded-full bg-doccure-teal hover:bg-[#0f605c] text-white px-6 h-12 font-bold shadow-lg shadow-doccure-teal/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Tambah Edukasi</span>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-all transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-bold text-slate-600 dark:text-slate-300 min-w-[140px] shadow-sm transition-colors"
            >
              <option value="">Semua Kategori</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-bold text-slate-600 dark:text-slate-300 min-w-[140px] shadow-sm transition-colors"
            >
              <option value="">Semua Fase</option>
              {Object.entries(phaseLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content List */}
        {contents.length === 0 ? (
          <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white dark:bg-slate-800 text-center mt-6 transition-colors">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-800 text-lg">Belum ada artikel edukasi</p>
            <p className="text-sm text-slate-500 font-medium mt-1">Klik &quot;Tambah Edukasi&quot; untuk mulai mengedukasi Bunda-bunda.</p>
          </Card>
        ) : (
          <div className="space-y-3 mt-6">
            {contents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="p-4 rounded-2xl border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all group transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-doccure-teal/5 flex flex-col items-center justify-center shrink-0 border border-doccure-teal/10 group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black text-doccure-teal uppercase opacity-60">Hari</span>
                        <span className="text-lg font-black text-doccure-teal -mt-1">{content.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate text-base transition-colors">{content.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${categoryColors[content.category] || 'bg-slate-100 text-slate-600'}`}>
                            {categoryLabels[content.category] || content.category}
                          </span>
                          <div className="h-1 w-1 rounded-full bg-slate-200" />
                          <span className="text-xs text-slate-500 font-medium">
                            {phaseLabels[content.phase] || content.phase}
                          </span>
                          <div className="h-1 w-1 rounded-full bg-slate-200" />
                          <span className="text-xs text-slate-400 font-medium italic">
                            Bulan {content.month}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(content)}
                        className="rounded-xl h-10 w-10 text-slate-400 hover:bg-doccure-teal/10 hover:text-doccure-teal transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(content.id)}
                        className="rounded-xl h-10 w-10 text-slate-400 hover:bg-grapefruit/10 hover:text-grapefruit transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {isModalOpen && (
            <EducationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={loadData}
              initialData={selectedContent}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white dark:bg-slate-800 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl transition-colors"
            >
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2 transition-colors">Hapus Artikel?</h3>
              <p className="text-sm border-l-2 pl-3 border-doccure-teal/50 text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed transition-colors">
                Artikel yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus edukasi ini?
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
                  Batal
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-grapefruit hover:bg-red-600 text-white font-bold shadow-lg shadow-grapefruit/20"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                  Hapus
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
