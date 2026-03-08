import { UserProgress } from "@/types/education";

/**
 * Calculates the number of consecutive days the user has read at least one article.
 * A streak is maintained if the user reads an article today or yesterday.
 */
export function calculateReadingStreak(progress: UserProgress[]): number {
  if (!progress || progress.length === 0) return 0;

  // 1. Get unique dates where an article was read
  const readDates = progress
    .filter((p) => p.is_read && p.read_at)
    .map((p) => new Date(p.read_at!).toISOString().split('T')[0]);

  if (readDates.length === 0) return 0;

  // 2. Remove duplicates and sort descending
  const uniqueDates = Array.from(new Set(readDates)).sort((a, b) => b.localeCompare(a));

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 3. Check if the streak is current (today or yesterday)
  const mostRecentRead = uniqueDates[0];
  if (mostRecentRead !== todayStr && mostRecentRead !== yesterdayStr) {
    return 0;
  }

  // 4. Count consecutive days
  let streak = 1;
  let currentDate = new Date(mostRecentRead);

  for (let i = 1; i < uniqueDates.length; i++) {
    const nextDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = nextDate;
    } else {
      break;
    }
  }

  return streak;
}
