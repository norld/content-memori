"use client"

import { formatRelativeTime } from "@/lib/time"

interface IdeaCardProps {
  idea: any
  onOpen: (idea: any) => void
}

export default function IdeaCard({ idea, onOpen }: IdeaCardProps) {
  const timeAgo = idea.updated_at
    ? formatRelativeTime(idea.updated_at)
    : formatRelativeTime(idea.created_at || new Date().toISOString())

  return (
    <div
      onClick={() => onOpen(idea)}
      className="glass-panel rounded-xl p-5 hover:border-rose-500/30 hover:bg-neutral-800/30 transition-all group cursor-pointer relative overflow-hidden bg-neutral-900/60 backdrop-blur-lg border border-white/5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${idea.type_color}`}></span>
        <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{idea.type}</span>
      </div>
      <div>
        <h3 className="text-base font-medium text-neutral-100 mb-2 leading-tight">{idea.title}</h3>
        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4">{idea?.description || '-'}</p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5 transition-all">
        <span className="text-[10px] text-neutral-500">{timeAgo}</span>
        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-neutral-400">
          {idea.category}
        </div>
      </div>
    </div>
  )
}
