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
  status?: ScriptStatus
}

export type ScriptStatus = 'scripted' | 'recorded' | 'edited' | 'uploaded'

export const SCRIPT_STATUSES: Record<ScriptStatus, { label: string; color: string }> = {
  scripted: { label: 'Scripted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  recorded: { label: 'Recorded', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  edited: { label: 'Edited', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  uploaded: { label: 'Uploaded', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}

export const ideasTable = 'ideas'
