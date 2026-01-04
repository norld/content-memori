import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DraftStore {
  idea: string
  type: string
  setIdea: (idea: string) => void
  setType: (type: string) => void
  clearDraft: () => void
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      idea: '',
      type: 'Social Media Post',
      setIdea: (idea) => set({ idea }),
      setType: (type) => set({ type }),
      clearDraft: () => set({ idea: '', type: 'Social Media Post' }),
    }),
    {
      name: 'memori-draft-storage',
    }
  )
)
