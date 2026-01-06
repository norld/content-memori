"use client"

import { useState, useEffect } from "react"
import { Camera, Plus, X, Settings, SparkleIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Scene, parseSceneBreakdown, formatSceneBreakdownAsJSON } from "@/lib/types/scene"
import { SceneCard } from "@/components/scene-card"
import { SceneBreakdownHistory } from "@/components/scene-breakdown-history"
import { ScenePromptConfig } from "@/components/scene-prompt-config"

interface SceneBreakdownModalProps {
  ideaId: number
  initialContent: string
  script: string
  onClose: () => void
}

export function SceneBreakdownModal({
  ideaId,
  initialContent,
  script,
  onClose,
}: SceneBreakdownModalProps) {
  const { session } = useAuth()
  const [content, setContent] = useState(initialContent)
  const [scenes, setScenes] = useState<Scene[]>(parseSceneBreakdown(initialContent))
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [patterns, setPatterns] = useState<Array<{ name: string; description: string }>>([])

  useEffect(() => {
    // Load saved config from localStorage
    const savedPrompt = localStorage.getItem('sceneBreakdownPrompt')
    const savedPatterns = localStorage.getItem('sceneBreakdownPatterns')

    if (savedPrompt) {
      setCustomPrompt(savedPrompt)
    }

    if (savedPatterns) {
      try {
        setPatterns(JSON.parse(savedPatterns))
      } catch (e) {
        console.error('Failed to parse saved patterns')
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!session || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-scene-breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ideaId,
          script,
          language: 'indonesian',
          customPrompt,
          patterns,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      setContent(data.content)
      const parsedScenes = parseSceneBreakdown(data.content)
      setScenes(parsedScenes)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!session) return

    const jsonContent = formatSceneBreakdownAsJSON(scenes)
    setContent(jsonContent)

    try {
      await fetch('/api/update-scene-breakdown', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ideaId,
          content: jsonContent,
        }),
      })

      setIsEditing(false)
    } catch (err) {
      console.error('Save error:', err)
      setError('Gagal menyimpan perubahan')
    }
  }

  const handleAddScene = () => {
    const newScene: Scene = {
      scene: scenes.length + 1,
      location: '',
      camera: '',
      action: '',
    }
    setScenes([...scenes, newScene])
  }

  const handleUpdateScene = (index: number, field: keyof Scene, value: string | number) => {
    const updatedScenes = [...scenes]
    updatedScenes[index] = { ...updatedScenes[index], [field]: value }
    setScenes(updatedScenes)
  }

  const handleDeleteScene = (sceneNumber: number) => {
    const updatedScenes = scenes
      .filter(s => s.scene !== sceneNumber)
      .map((s, i) => ({ ...s, scene: i + 1 }))
    setScenes(updatedScenes)
  }

  const handleRestoreVersion = (restoredContent: string) => {
    // Update state with restored content
    setContent(restoredContent)
    setScenes(parseSceneBreakdown(restoredContent))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-neutral-900">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-neutral-200">Scene Breakdown</span>
            {scenes.length > 0 && (
              <span className="text-xs text-neutral-500">({scenes.length} scene{scenes.length !== 1 ? 's' : ''})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(true)}
              className="text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/5"
              title="Pengaturan"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-red-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-neutral-300 font-medium">Membuat scene breakdown...</p>
              <p className="text-neutral-500 text-sm mt-2">AI sedang menganalisis script Anda</p>
            </div>
          )}

          {error && !isGenerating && (
            <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {!content && !isGenerating && !isEditing && (
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-6">Belum ada scene breakdown. Pilih cara membuat:</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-medium rounded-lg border border-red-600/20 transition-colors">
                  <SparkleIcon className="w-4 h-4" />
                  Buat dengan AI
                </button>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-neutral-200 font-medium rounded-lg border border-white/10 transition-colors">
                  <Plus className="w-4 h-4" />
                  Buat Manual
                </button>
              </div>
              <p className="text-neutral-500 text-sm mt-4">AI: Otomatis dari script • Manual: Tambah scene sendiri</p>
            </div>
          )}

          {isEditing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Buat Scene Breakdown Manual</h3>
                <button onClick={() => setIsEditing(false)} className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Selesai
                </button>
              </div>

              <div className="space-y-3">
                {scenes.map((sceneItem, index) => (
                  <div key={sceneItem.scene} className="bg-white/5 rounded-lg border border-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-400">Scene {sceneItem.scene}</span>
                      <button onClick={() => handleDeleteScene(sceneItem.scene)} className="text-neutral-500 hover:text-red-400 transition-colors text-xs">
                        Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Lokasi</label>
                        <input type="text" value={sceneItem.location} onChange={(e) => handleUpdateScene(index, 'location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-white/20" placeholder="Contoh: Ruang tamu" />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Kamera</label>
                        <input type="text" value={sceneItem.camera} onChange={(e) => handleUpdateScene(index, 'camera', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-white/20" placeholder="Contoh: Wide shot" />
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Aksi</label>
                        <textarea value={sceneItem.action} onChange={(e) => handleUpdateScene(index, 'action', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-white/20 resize-none" rows={2} placeholder="Contoh: Tokoh utama masuk dari pintu" />
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={handleAddScene} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-neutral-300 text-sm font-medium rounded-lg border border-dashed border-white/20 transition-colors">
                  <Plus className="w-4 h-4" />
                  Tambah Scene
                </button>

                <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-medium rounded-lg border border-red-600/20 transition-colors">
                  Simpan Scene Breakdown
                </button>
              </div>
            </div>
          )}

          {content && !isEditing && !isGenerating && (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditing(true)} className="text-xs text-neutral-400 hover:text-white transition-colors">
                    Edit
                  </button>
                  <button onClick={handleGenerate} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Regenerate
                  </button>
                </div>

                <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium rounded-lg border border-white/10 transition-colors">
                  {showHistory ? 'Sembunyi' : 'Riwayat'}
                </button>
              </div>

              <div className="space-y-3">
                {scenes.map((sceneItem) => (
                  <SceneCard key={sceneItem.scene} scene={sceneItem} />
                ))}
              </div>

              {scenes.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  Tidak ada scene. Klik "Edit" untuk menambah atau "Regenerate" untuk buat dengan AI.
                </div>
              )}
            </>
          )}

          {showHistory && content && !isEditing && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <SceneBreakdownHistory ideaId={ideaId} onRestore={handleRestoreVersion} />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={onClose} className="w-full py-2 text-neutral-400 hover:text-white text-xs transition-colors">
            Tutup
          </button>
        </div>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <ScenePromptConfig onClose={() => {
          setShowConfig(false)
          // Reload config after saving
          const savedPrompt = localStorage.getItem('sceneBreakdownPrompt')
          const savedPatterns = localStorage.getItem('sceneBreakdownPatterns')

          if (savedPrompt) {
            setCustomPrompt(savedPrompt)
          }

          if (savedPatterns) {
            try {
              setPatterns(JSON.parse(savedPatterns))
            } catch (e) {
              console.error('Failed to parse saved patterns')
            }
          }
        }} />
      )}
    </div>
  )
}
