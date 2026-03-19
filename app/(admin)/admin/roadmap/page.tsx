'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Route,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Dumbbell,
  Apple,
  Star
} from 'lucide-react'
import { deleteRoadmapActivity } from '@/services/adminService'
import { useAdminContext } from '@/components/providers/Providers'
import { RoadmapModal } from '@/components/admin/RoadmapModal'
import { Skeleton } from '@/components/ui/skeleton'
import { RoadmapActivity } from '@/types/roadmap'

import { AdminTopHeader } from '@/components/admin/AdminTopHeader'

const categoryConfig: Record<string, { label: string; icon: typeof Dumbbell; color: string }> = {
  exercise: { label: 'Olahraga', icon: Dumbbell, color: 'bg-doccure-teal/10 text-doccure-teal' },
  nutrition: { label: 'Nutrisi', icon: Apple, color: 'bg-emerald-50 text-emerald-600' },
  sleep: { label: 'Tidur', icon: Dumbbell, color: 'bg-indigo-50 text-indigo-600' },
  mental: { label: 'Mental', icon: Dumbbell, color: 'bg-fuchsia-50 text-fuchsia-600' },
  checkup: { label: 'Pemeriksaan', icon: Dumbbell, color: 'bg-amber-50 text-amber-600' },
  bonding: { label: 'Bonding', icon: Dumbbell, color: 'bg-pink-50 text-pink-600' },
}

export default function RoadmapManagementPage() {
  const adminContext = useAdminContext()
  const [activities, setActivities] = useState<RoadmapActivity[]>((adminContext?.roadmapActivities || []) as RoadmapActivity[])
  const loading = adminContext?.loading
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<RoadmapActivity | null>(null)

  // Sync with context if it changes and we are not filtering/searching
  useEffect(() => {
    if (!searchQuery && !categoryFilter && adminContext?.roadmapActivities) {
      setActivities(adminContext.roadmapActivities as RoadmapActivity[])
    }
  }, [adminContext?.roadmapActivities, searchQuery, categoryFilter])

  const loadData = useCallback(async () => {
    // If we have data in context and it's the first load (no filters), just use it
    if (!searchQuery && !categoryFilter && adminContext?.roadmapActivities?.length) {
      setActivities(adminContext.roadmapActivities as RoadmapActivity[])
      return
    }

    try {
      const { fetchRoadmapActivities } = await import('@/services/adminService')
      const data = await fetchRoadmapActivities({
        search: searchQuery || undefined,
        category: categoryFilter || undefined,
      })
      setActivities(data as RoadmapActivity[])
    } catch (error) {
      console.error('Error loading roadmap:', error)
    }
  }, [searchQuery, categoryFilter, adminContext?.roadmapActivities])

  useEffect(() => {
    loadData()
  }, [categoryFilter, loadData])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await deleteRoadmapActivity(deleteId)
      await adminContext?.loadAdminData(true)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting roadmap:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleSuccess = async () => {
    await adminContext?.loadAdminData(true)
    setIsModalOpen(false)
  }

  const handleCreate = () => {
    setSelectedActivity(null)
    setIsModalOpen(true)
  }

  const handleEdit = (activity: RoadmapActivity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  if (loading && activities.length === 0) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full flex-1 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white  border border-slate-100/50  shadow-sm items-center justify-between transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      <AdminTopHeader title="Manage Roadmap" />

      {/* Top Header Row with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-sm text-slate-500">{activities.length} aktivitas roadmap tersedia</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="rounded-full bg-doccure-teal hover:bg-[#0f605c] text-white px-6 h-12 font-bold shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Tambah Aktivitas</span>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200  bg-white  text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-all transition-colors"
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200  bg-white  text-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-bold text-slate-600  shadow-sm transition-colors"
            >
              <option value="">Semua Kategori</option>
              <option value="exercise">Olahraga</option>
              <option value="nutrition">Nutrisi</option>
              <option value="sleep">Tidur</option>
              <option value="mental">Mental</option>
              <option value="checkup">Pemeriksaan</option>
              <option value="bonding">Bonding</option>
            </select>
          </div>
        </div>

        {/* Activity List */}
        {activities.length === 0 ? (
          <Card className="p-12 rounded-2xl border-0 shadow-sm bg-white  text-center mt-6 transition-colors">
            <Route className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-800 text-lg">Belum ada aktivitas roadmap</p>
            <p className="text-sm text-slate-500 font-medium mt-1">Klik &quot;Tambah Aktivitas&quot; untuk membuat aktivitas baru.</p>
          </Card>
        ) : (
          <div className="space-y-3 mt-6">
            {activities.map((activity, index) => {
              const config = categoryConfig[activity.category] || {
                label: activity.category,
                icon: Route,
                color: 'bg-slate-100 text-slate-600',
              }
              const IconComponent = config.icon
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4 rounded-2xl border-0 shadow-sm bg-white  hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${config.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-slate-900 truncate text-base">{activity.activity_name}</p>
                          <span className="text-[10px] font-black text-slate-400  uppercase tracking-widest bg-slate-50  px-2 py-0.5 rounded-md transition-colors">
                            Trimester {activity.min_trimester}-{activity.max_trimester}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">
                          {activity.description || 'Tidak ada deskripsi'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:w-auto gap-4 pl-14 sm:pl-0">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                          {config.label}
                        </span>
                        <div className="flex items-center hidden sm:flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i <= (activity.difficulty_level || 1) ? 'text-doccure-yellow fill-doccure-yellow' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(activity)}
                          className="rounded-xl h-10 w-10 text-slate-400 hover:bg-doccure-teal/10 hover:text-doccure-teal transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(activity.id)}
                          className="rounded-xl h-10 w-10 text-slate-400 hover:bg-grapefruit/10 hover:text-grapefruit transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {isModalOpen && (
            <RoadmapModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
              initialData={selectedActivity}
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
              className="relative bg-white  rounded-[2rem] p-6 w-full max-w-sm shadow-2xl transition-colors"
            >
              <h3 className="text-lg font-black text-slate-800  mb-2 transition-colors">Hapus Aktivitas?</h3>
              <p className="text-sm border-l-2 pl-3 border-doccure-teal/50 text-slate-600  mb-6 font-medium leading-relaxed transition-colors">
                Aktivitas yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus roadmap ini?
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
