"use client"

import { useState } from "react"
import { LayoutGrid, List, Plus } from "lucide-react"
import IdeaCard from "./idea-card"
import IdeaListItem from "./idea-list-item"
import type { Idea } from "@/lib/supabase"

interface ContentGridProps {
  ideas: Idea[]
  onOpenDetail: (idea: Idea) => void
  loading?: boolean
}

export default function ContentGrid({ ideas, onOpenDetail, loading = false }: ContentGridProps) {
  const [viewMode, setViewMode] = useState("grid")

  if (loading) {
    return (
      <section className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-neutral-300">Recent Drafts</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-500 text-sm">Loading ideas...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-neutral-300">Recent Drafts</h2>
        <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-neutral-500 hover:text-white"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-neutral-500 hover:text-white"}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800 rounded-xl">
          <Plus className="w-12 h-12 text-neutral-700 mb-3" />
          <p className="text-sm text-neutral-500">No ideas yet. Capture your first idea above!</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-2">
          {ideas.map((idea) => (
            <IdeaListItem key={idea.id} idea={idea} onOpen={onOpenDetail} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onOpen={onOpenDetail} />
          ))}

          {/* New Idea Placeholder */}
          <div className="border border-dashed border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-neutral-800/30 hover:border-rose-500/30 transition-all cursor-pointer group min-h-[160px]">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white text-neutral-500 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-300">New Idea</span>
          </div>
        </div>
      )}
    </section>
  )
}
