"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { useDraftStore } from "@/lib/store"

interface CaptureSectionProps {
  onSave: (idea: any) => Promise<boolean>
}

export default function CaptureSection({ onSave }: CaptureSectionProps) {
  const { idea, type, setIdea, setType, clearDraft } = useDraftStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!idea.trim()) {
      return
    }

    setIsSaving(true)

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    // Split into lines: first line is title, rest is content
    const lines = idea.trim().split("\n")
    const title = lines[0]
    const description = lines.slice(1).join("\n").trim() || "No additional content"

    const success = await onSave({
      type,
      type_color: type === "Twitter" ? "bg-blue-500" : type === "Youtube" ? "bg-rose-500" : "bg-green-500",
      title,
      description,
      category: type,
      edited: "No",
    })

    // Only clear the form if save was successful
    if (success) {
      clearDraft()
    }

    setIsSaving(false)
  }

  return (
    <section className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="text-center space-y-1 py-12">
        <h1 className="text-3xl font-semibold text-white tracking-tight">Capture your next big thing</h1>
        <p className="text-neutral-500 text-sm">{"Don't let the thought escape. Write it down now."}</p>
      </div>

      <div className="glass-panel rounded-2xl p-1 shadow-2xl shadow-black/20 group focus-within:ring-1 focus-within:ring-rose-500/30 transition-all duration-300 bg-neutral-900/60 backdrop-blur-lg border border-white/5">
        <div className="bg-neutral-900/40 rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent text-xs font-medium text-neutral-400 focus:outline-none hover:text-rose-400 transition-colors cursor-pointer"
            >
              <option>Social Media Post</option>
            </select>
          </div>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-neutral-200 placeholder-neutral-600 text-base resize-none min-h-[120px]"
            placeholder="Title on first line, then your content..."
          />

          <div className="flex justify-end items-center mt-4 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`${isSaving ? "bg-green-600" : "bg-rose-600 hover:bg-rose-500"} text-white text-xs font-medium px-5 py-2 rounded-lg shadow-lg shadow-rose-900/20 transition-all transform active:scale-95 flex items-center gap-2 min-w-[100px] justify-center`}
            >
              <span>{isSaving ? "Saving..." : "Save Idea"}</span>
              {!isSaving && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
