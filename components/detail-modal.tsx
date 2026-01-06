"use client"

import { useState } from "react"
import { X, Trash2, Sparkles, LucideCamera } from "lucide-react"
import type { Idea } from "@/lib/supabase"
import { formatRelativeTime } from "@/lib/time"
import { SceneBreakdownModal } from "@/components/scene-breakdown-modal"

interface DetailModalProps {
  idea: Idea
  onClose: () => void
  onDelete: () => void
  onUpdate: (idea: Idea) => void
}

export default function DetailModal({ idea, onClose, onDelete, onUpdate }: DetailModalProps) {
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description)
  const [type, setType] = useState(idea.type)
  const [showSceneBreakdownModal, setShowSceneBreakdownModal] = useState(false)

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this idea?")) {
      onDelete()
    }
  }

  const handleSave = () => {
    onUpdate({
      ...idea,
      title,
      description,
      type,
    })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div onClick={onClose} className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"></div>

        {/* Modal Content */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[500px] bg-neutral-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-neutral-900">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-medium text-neutral-500">Edit Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="text-neutral-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-md hover:bg-neutral-200 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col">
            <div className="flex-1 flex flex-col">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Type</label>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${idea.type_color}`}></span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-transparent text-sm text-neutral-200 font-medium focus:outline-none cursor-pointer"
                  >
                    <option>Twitter Thread</option>
                    <option>YouTube Video</option>
                    <option>Newsletter</option>
                    <option>Social Media Post</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl font-semibold text-white placeholder-neutral-700 focus:outline-none"
                  placeholder="Idea Title"
                />
              </div>

              <div className="flex-1 min-h-0 mt-6">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-full bg-transparent text-sm text-neutral-300 leading-relaxed placeholder-neutral-700 focus:outline-none resize-none"
                  placeholder="Start writing details..."
                />
              </div>
            </div>
          </div>

          {/* Footer with Mini Button */}
          <div className="p-4 border-t border-white/5 space-y-3">
            {/* Mini AI Generate Button */}
            <button
              onClick={() => setShowSceneBreakdownModal(true)}
              disabled={!description}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/20"
            >
              <LucideCamera className="w-3.5 h-3.5" />
              {idea.scene_breakdown ? 'Lihat / Edit Scene Breakdown' : 'Buat Scene Breakdown'}
            </button>

            <div className="flex items-center justify-between text-[10px] text-neutral-600">
              <span>Created {formatRelativeTime(idea.created_at || new Date().toISOString())}</span>
              <span>{idea.updated_at ? `Updated ${formatRelativeTime(idea.updated_at)}` : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Breakdown Modal */}
      {showSceneBreakdownModal && (
        <SceneBreakdownModal
          ideaId={idea.id!}
          initialContent={idea.scene_breakdown || ''}
          script={description}
          onClose={() => setShowSceneBreakdownModal(false)}
        />
      )}
    </>
  )
}
