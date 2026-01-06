"use client"

import { Scene } from "@/lib/types/scene"

interface SceneCardProps {
  scene: Scene
  onEdit?: (scene: Scene) => void
  onDelete?: (sceneNumber: number) => void
}

export function SceneCard({ scene, onEdit, onDelete }: SceneCardProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/5 p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-3">
        {/* Scene Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
          <span className="text-xs font-semibold text-red-400">{scene.scene}</span>
        </div>

        {/* Scene Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-neutral-300">{scene.location}</span>
          </div>

          {/* Camera */}
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-neutral-400">{scene.camera}</span>
          </div>

          {/* Action */}
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-neutral-300">{scene.action}</span>
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(scene)}
                className="p-1.5 hover:bg-white/5 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(scene.scene)}
                className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5 text-neutral-500 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
