"use client"

import type { Idea } from "@/lib/supabase"
import { formatRelativeTime } from "@/lib/time"

interface IdeaListItemProps {
  idea: Idea
  onOpen: (idea: Idea) => void
  index: number
}

export default function IdeaListItem({ idea, onOpen, index }: IdeaListItemProps) {
  const timeAgo = idea.updated_at
    ? formatRelativeTime(idea.updated_at)
    : formatRelativeTime(idea.created_at || new Date().toISOString())

  return (
    <div
      onClick={() => onOpen(idea)}
      className="glass-panel rounded-lg px-4 py-3 hover:border-rose-500/30 hover:bg-neutral-800/30 transition-all group cursor-pointer bg-neutral-900/60 backdrop-blur-lg border border-white/5 flex items-center gap-4"
      style={{
        animation: `slideUp 0.3s ease-out forwards`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Type Indicator */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className={`w-1.5 h-1.5 rounded-full ${idea.type_color} flex-shrink-0`}></span>
        <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider truncate">
          {idea.type}
        </span>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-neutral-100 truncate">{idea.title}</h3>
      </div>

      {/* Category */}
      <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-neutral-400 flex-shrink-0">
        {idea.category}
      </div>

      {/* Time */}
      <span className="text-[10px] text-neutral-500 whitespace-nowrap flex-shrink-0">
        {timeAgo}
      </span>
    </div>
  )
}
