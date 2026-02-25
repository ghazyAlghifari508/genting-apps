/**
 * Utilitas untuk perhitungan tanggal kehamilan dan format tanggal global.
 */

export function calculatePregnancyWeek(startDate: string | Date): number {
  const start = new Date(startDate)
  const today = new Date()
  const diffInMs = today.getTime() - start.getTime()
  return Math.max(0, Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000)))
}

export function calculateTrimester(week: number): number {
  if (week <= 12) return 1
  if (week <= 27) return 2
  return 3
}

export function formatDateIndo(dateString: string | Date | undefined | null): string {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return '-'
  }
}

export const GET_BABY_SIZE = (week: number) => {
  if (week <= 4) return { name: 'Biji Poppy', color: 'sea-green', desc: 'Si kecil masih sangat mungil!' }
  if (week <= 8) return { name: 'Buah Raspberry', color: 'doccure-teal', desc: 'Jantung si kecil mulai berdetak.' }
  if (week <= 12) return { name: 'Buah Lemon', color: 'yellow-400', desc: 'Si kecil sudah mulai bergerak.' }
  if (week <= 16) return { name: 'Buah Alpukat', color: 'green-500', desc: 'Si kecil sudah bisa menghisap jempol.' }
  if (week <= 20) return { name: 'Bawang Bombay', color: 'amber-600', desc: 'Indera si kecil mulai berkembang.' }
  if (week <= 24) return { name: 'Buah Mangga', color: 'orange-500', desc: 'Si kecil sudah bisa mendengar suara Bunda.' }
  if (week <= 28) return { name: 'Kembang Kol', color: 'green-300', desc: 'Si kecil mulai membuka matanya.' }
  if (week <= 32) return { name: 'Nanas', color: 'yellow-500', desc: 'Si kecil sedang bersiap untuk lahir.' }
  if (week <= 36) return { name: 'Melon', color: 'green-400', desc: 'Paru-paru si kecil hampir matang.' }
  return { name: 'Semangka', color: 'amber-600', desc: 'Si kecil sudah siap menyapa dunia!' }
}
