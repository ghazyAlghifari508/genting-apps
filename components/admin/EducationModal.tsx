'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, Loader2, X, BookOpen } from 'lucide-react'
import { createEducationContent, updateEducationContent } from '@/services/adminService'
import { motion } from 'framer-motion'
import type { Category, Phase } from '@/types/education'

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
}

interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: EducationContent | null
}

const phases = [
  { value: 'kehamilan', label: 'Kehamilan' },
  { value: 'bayi_0_3', label: 'Bayi 0-3 Bulan' },
  { value: 'bayi_3_12', label: 'Bayi 3-12 Bulan' },
  { value: 'anak_1_2', label: 'Anak 1-2 Tahun' },
]

const categories = [
  { value: 'nutrisi', label: 'Nutrisi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'stimulasi', label: 'Stimulasi' },
  { value: 'perkembangan', label: 'Perkembangan' },
  { value: 'aktivitas', label: 'Aktivitas' },
  { value: 'imunisasi', label: 'Imunisasi' },
]

function getPhaseFromDay(day: number): Phase {
  if (day <= 270) return 'kehamilan'
  if (day <= 365) return 'bayi_0_3'
  if (day <= 635) return 'bayi_3_12'
  return 'anak_1_2'
}

export function EducationModal({ isOpen, onClose, onSuccess, initialData }: EducationModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{
    day: number
    phase: Phase
    month: number
    title: string
    description: string
    content: string
    tips: string
    category: Category
    thumbnail_url: string
  }>({
    day: 1,
    phase: 'kehamilan',
    month: 1,
    title: '',
    description: '',
    content: '',
    tips: '',
    category: 'nutrisi',
    thumbnail_url: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        day: initialData.day,
        phase: initialData.phase,
        month: initialData.month,
        title: initialData.title,
        description: initialData.description || '',
        content: initialData.content || '',
        tips: Array.isArray(initialData.tips) ? initialData.tips.join('\n') : initialData.tips || '',
        category: initialData.category,
        thumbnail_url: initialData.thumbnail_url || '',
      })
    } else {
      setForm({
        day: 1,
        phase: 'kehamilan',
        month: 1,
        title: '',
        description: '',
        content: '',
        tips: '',
        category: 'nutrisi',
        thumbnail_url: '',
      })
    }
  }, [initialData, isOpen])

  const handleDayChange = (day: number) => {
    const phase = getPhaseFromDay(day)
    const month = Math.ceil(day / 30)
    setForm((prev) => ({ ...prev, day, phase, month }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.description.trim() || !form.content.trim()) {
      setError('Judul, deskripsi, dan konten wajib diisi.')
      return
    }

    try {
      setSaving(true)
      const tipsArray = form.tips
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const payload = {
        day: form.day,
        phase: form.phase,
        month: form.month,
        title: form.title,
        description: form.description,
        content: form.content,
        tips: tipsArray,
        category: form.category,
        thumbnail_url: form.thumbnail_url || undefined,
      }

      if (initialData?.id) {
        await updateEducationContent(initialData.id, payload)
      } else {
        await createEducationContent(payload)
      }
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan artikel.')
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-doccure-teal/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-doccure-teal" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white transition-colors">
                {initialData ? 'Edit Edukasi' : 'Tambah Edukasi'}
              </h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Kategori: {form.category}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 scrollbar-hide" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-grapefruit/10 text-grapefruit text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-grapefruit animate-pulse" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Penjadwalan & Klasifikasi</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Hari ke-</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={form.day}
                      onChange={(e) => handleDayChange(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-bold transition-colors"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Bulan ke-</label>
                    <input
                      type="number"
                      min={1}
                      max={34}
                      value={form.month}
                      onChange={(e) => setForm((prev) => ({ ...prev, month: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-bold text-center transition-colors"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Fase</label>
                    <div className="w-full px-4 py-2.5 rounded-xl bg-doccure-teal/10 text-doccure-teal text-xs font-black text-center border border-doccure-teal/20">
                      {phases.find(p => p.value === form.phase)?.label}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Kategori</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-bold transition-colors"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Fase (Manual Overide)</label>
                    <select
                      value={form.phase}
                      onChange={(e) => setForm((prev) => ({ ...prev, phase: e.target.value as Phase }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 appearance-none cursor-pointer font-bold transition-colors"
                    >
                      {phases.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Judul Artikel *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Judul yang menarik..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-bold placeholder:font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Thumbnail URL</label>
                  <input
                    type="url"
                    value={form.thumbnail_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 transition-all font-medium transition-colors"
                  />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Konten & Detail</h3>
                
                <div>
                  <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Deskripsi Singkat *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Ringkasan isi artikel..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider">Konten Utama *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Isi lengkap artikel..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-y font-medium leading-relaxed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1.5 text-slate-500 uppercase tracking-wider text-doccure-teal">Tips Sehat (Satu per baris)</label>
                  <textarea
                    value={form.tips}
                    onChange={(e) => setForm((prev) => ({ ...prev, tips: e.target.value }))}
                    placeholder={"Minum air cukup\nHindari MSG..."}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-doccure-teal/20 bg-doccure-teal/5 dark:bg-doccure-teal/10 text-sm focus:outline-none focus:ring-2 focus:ring-doccure-teal/30 resize-none font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="flex gap-4 pt-10 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl text-slate-600 font-black tracking-tight"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-[2] h-12 rounded-xl bg-doccure-teal hover:bg-[#0f605c] text-white font-black shadow-lg shadow-doccure-teal/30 tracking-tight"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {initialData ? 'Update Artikel' : 'Publikasikan Artikel'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
