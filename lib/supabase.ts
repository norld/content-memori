import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Idea = {
  id?: number
  type: string
  type_color: string
  title: string
  description: string
  category: string
  edited: string
  user_id: string
  created_at?: string
  updated_at?: string
  scene_breakdown?: string
  scene_breakdown_generated_at?: string
}

export const ideasTable = 'ideas'
