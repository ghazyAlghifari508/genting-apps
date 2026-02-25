'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, Loader2, Star, X } from 'lucide-react'
import { createRoadmapActivity, updateRoadmapActivity } from '@/services/adminService'
import { motion } from 'framer-motion'

interface RoadmapActivity {
  id: string
  activity_name: string
  category: 'exercise' | 'nutrition'
  description: string
  difficulty_level: number
  icon_name: string | null
  xp_reward: number
  min_trimester: number
  max_trimester: number
  duration_minutes: number
  frequency_per_week: number
  benefits: string[]
  instructions: string[]
  tips: string | null
  warnings: string | null
}

interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: RoadmapActivity | null
}

export function RoadmapModal({ isOpen, onClose, onSuccess, initialData }: RoadmapModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{
    activity_name: string
    category: RoadmapActivity['category']
    description: string
    difficulty_level: number
    icon_name: string
    xp_reward: number
    min_trimester: number
    max_trimester: number
    duration_minutes: number
    frequency_per_week: number
    benefits: string
    instructions: string
    tips: string
    warnings: string
  }>({
    activity_name: '',
    category: 'exercise',
    description: '',
    difficulty_level: 1,
    icon_name: '',
    xp_reward: 50,
    min_trimester: 1,
    max_trimester: 3,
    duration_minutes: 15,
    frequency_per_week: 3,
    benefits: '',
    instructions: '',
    tips: '',
    warnings: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        activity_name: initialData.activity_name,
        category: initialData.category,
        description: initialData.description || '',
        difficulty_level: initialData.difficulty_level,
        icon_name: initialData.icon_name || '',
        xp_reward: initialData.xp_reward || 0,
        min_trimester: initialData.min_trimester || 1,
        max_trimester: initialData.max_trimester || 3,
        duration_minutes: initialData.duration_minutes || 0,
        frequency_per_week: initialData.frequency_per_week || 0,
        benefits: Array.isArray(initialData.benefits) ? initialData.benefits.join('\n') : '',
        instructions: Array.isArray(initialData.instructions) ? initialData.instructions.join('\n') : '',
        tips: initialData.tips || '',
        warnings: initialData.warnings || '',
      })
    } else {
      setForm({
        activity_name: '',
        category: 'exercise',
        description: '',
        difficulty_level: 1,
        icon_name: '',
        xp_reward: 50,
        min_trimester: 1,
        max_trimester: 3,
        duration_minutes: 15,
        frequency_per_week: 3,
        benefits: '',
        instructions: '',
        tips: '',
        warnings: '',
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.activity_name.trim()) {
      setError('Nama aktivitas wajib diisi.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        activity_name: form.activity_name,
        category: form.category,
        description: form.description,
        difficulty_level: form.difficulty_level,
        icon_name: form.icon_name || null,
        xp_reward: form.xp_reward,
        min_trimester: form.min_trimester,
        max_trimester: form.max_trimester,
        duration_minutes: form.duration_minutes,
        frequency_per_week: form.frequency_per_week,
        benefits: form.benefits.split('\n').filter(b => b.trim()),
        instructions: form.instructions.split('\n').filter(i => i.trim()),
        tips: form.tips || null,
        warnings: form.warnings || null,
      }

      if (initialData?.id) {
        await updateRoadmapActivity(initialData.id, payload)
      } else {
        await createRoadmapActivity(payload)
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan aktivitas.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transition-colors"
      >
        <div className="p-6 border-b dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800 transition-colors">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white transition-colors">
              {initialData ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
            </h2>
            <p className="text-xs text-muted-foreground dark:text-slate-400 font-medium transition-colors">Bunda, silakan lengkapi detail aktivitas roadmap di bawah ini.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 scrollbar-hide" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-doccure-teal uppercase tracking-wider">Informasi Dasar</h3>
                
                {error && (
                  <div className="p-3 rounded-xl bg-grapefruit/10 text-grapefruit text-sm font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Nama Aktivitas *</label>
                  <input
                    type="text"
                    value={form.activity_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, activity_name: e.target.value }))}
                    placeholder="Contoh: Morning Yoga, Sarapan Sehat..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-medium transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Kategori</label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, category: e.target.value as RoadmapActivity['category'] }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-medium transition-colors"
                    >
                      <option value="exercise">Olahraga</option>
                      <option value="nutrition">Nutrisi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">XP Reward</label>
                    <input
                      type="number"
                      value={form.xp_reward}
                      onChange={(e) => setForm((prev) => ({ ...prev, xp_reward: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Tingkat Kesulitan</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, difficulty_level: level }))}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${level <= form.difficulty_level ? 'text-apricot fill-apricot' : 'text-slate-200'}`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2 font-bold uppercase tracking-tight">Level {form.difficulty_level}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Min. Trimester</label>
                    <select
                      value={form.min_trimester}
                      onChange={(e) => setForm((prev) => ({ ...prev, min_trimester: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-colors"
                    >
                      <option value={1}>Trimester 1</option>
                      <option value={2}>Trimester 2</option>
                      <option value={3}>Trimester 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Max. Trimester</label>
                    <select
                      value={form.max_trimester}
                      onChange={(e) => setForm((prev) => ({ ...prev, max_trimester: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-colors"
                    >
                      <option value={1}>Trimester 1</option>
                      <option value={2}>Trimester 2</option>
                      <option value={3}>Trimester 3</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Durasi (Menit)</label>
                    <input
                      type="number"
                      value={form.duration_minutes}
                      onChange={(e) => setForm((prev) => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-all transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Frekuensi / Minggu</label>
                    <input
                      type="number"
                      value={form.frequency_per_week}
                      onChange={(e) => setForm((prev) => ({ ...prev, frequency_per_week: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-all transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Icon Name (Lucide)</label>
                  <input
                    type="text"
                    value={form.icon_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, icon_name: e.target.value }))}
                    placeholder="Contoh: dumbbell, apple, heart, soup..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 font-medium transition-colors"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">* Gunakan nama icon Lucide React (lowercase)</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-doccure-teal uppercase tracking-wider">Konten & Detail</h3>
                
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Deskripsi Singkat</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi singkat aktivitas..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Manfaat (Satu per baris)</label>
                  <textarea
                    value={form.benefits}
                    onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))}
                    placeholder="Meningkatkan energi&#10;Melancarkan pencernaan..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase">Langkah Instruksi (Satu per baris)</label>
                  <textarea
                    value={form.instructions}
                    onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Siapkan alat yoga&#10;Lakukan pemanasan 5 menit..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase text-apricot">Tips Bunda</label>
                  <textarea
                    value={form.tips}
                    onChange={(e) => setForm((prev) => ({ ...prev, tips: e.target.value }))}
                    placeholder="Gunakan pakaian yang nyaman..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium border-apricot/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-grapefruit uppercase">Peringatan / Warning</label>
                  <textarea
                    value={form.warnings}
                    onChange={(e) => setForm((prev) => ({ ...prev, warnings: e.target.value }))}
                    placeholder="Hentikan jika merasa pusing..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium border-grapefruit/20 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl text-slate-600 font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-[2] h-12 rounded-xl bg-doccure-teal hover:bg-[#0f605c] text-white font-black shadow-lg shadow-doccure-teal/30"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {initialData ? 'Update Aktivitas' : 'Simpan Aktivitas'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
