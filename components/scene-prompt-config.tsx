"use client"

import { useState, useEffect } from "react"
import { Settings, X, Save, Plus } from "lucide-react"

interface ScenePattern {
  name: string
  description: string
}

interface ScenePromptConfigProps {
  onClose: () => void
}

const DEFAULT_PATTERNS = [
  { name: "Front Camera", description: "Ngomong di depan kamera" },
  { name: "Screen/Coding", description: "Scene coding atau showcase website/tools" },
  { name: "Animasi", description: "Scene animasi atau visual" },
  { name: "B-Roll", description: "Scene pendukung atau cutaway" },
  { name: "Thinking/Relax", description: "Scene mikir, tidur, atau santai" },
]

export function ScenePromptConfig({ onClose }: ScenePromptConfigProps) {
  const [customPrompt, setCustomPrompt] = useState("")
  const [patterns, setPatterns] = useState<ScenePattern[]>(DEFAULT_PATTERNS)
  const [saved, setSaved] = useState(false)

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

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('sceneBreakdownPrompt', customPrompt)
    localStorage.setItem('sceneBreakdownPatterns', JSON.stringify(patterns))

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddPattern = () => {
    setPatterns([...patterns, { name: '', description: '' }])
  }

  const handleUpdatePattern = (index: number, field: keyof ScenePattern, value: string) => {
    const updated = [...patterns]
    updated[index] = { ...updated[index], [field]: value }
    setPatterns(updated)
  }

  const handleDeletePattern = (index: number) => {
    setPatterns(patterns.filter((_, i) => i !== index))
  }

  const handleResetDefaults = () => {
    setPatterns(DEFAULT_PATTERNS)
    setCustomPrompt("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-neutral-900">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-neutral-200">Pengaturan Scene Breakdown</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-2 rounded-md hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Instruksi Kustom untuk AI
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-white/20 resize-none"
              rows={4}
              placeholder="Contoh: Saya biasanya membuat konten dengan pola: mulai depan kamera, lalu screen coding, kadang animasi, dan scene mikir di tengah..."
            />
            <p className="text-neutral-500 text-xs mt-2">
              Instruksi ini akan digunakan AI saat membuat scene breakdown
            </p>
          </div>

          {/* Scene Patterns */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-white">
                Pola Scene Kamu
              </label>
              <button
                onClick={handleAddPattern}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Tambah
              </button>
            </div>

            <div className="space-y-2">
              {patterns.map((pattern, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                  <input
                    type="text"
                    value={pattern.name}
                    onChange={(e) => handleUpdatePattern(index, 'name', e.target.value)}
                    className="col-span-4 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-white/20"
                    placeholder="Nama scene"
                  />
                  <input
                    type="text"
                    value={pattern.description}
                    onChange={(e) => handleUpdatePattern(index, 'description', e.target.value)}
                    className="col-span-7 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-white/20"
                    placeholder="Deskripsi"
                  />
                  <button
                    onClick={() => handleDeletePattern(index)}
                    className="col-span-1 text-neutral-500 hover:text-red-400 transition-colors text-xs p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-neutral-500 text-xs mt-2">
              Definisikan pola scene yang sering kamu gunakan agar AI bisa menyesuaikan
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
            <p className="text-sm text-red-400">
              💡 <strong>Tips:</strong> Semakin detail pola scene yang kamu definisikan, semakin akurat AI dalam membuat scene breakdown sesuai style kontenmu.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
          >
            Reset ke Default
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white text-xs transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium rounded-lg border border-red-600/20 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Tersimpan!' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
