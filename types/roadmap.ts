export interface RoadmapActivity {
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
  created_at: string
  updated_at: string
}

export type CreateRoadmapActivityInput = Omit<RoadmapActivity, 'id' | 'created_at' | 'updated_at'>
export type UpdateRoadmapActivityInput = Partial<CreateRoadmapActivityInput>
