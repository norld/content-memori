import { Check } from "lucide-react"

export default function Toast() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-neutral-900 border border-white/10 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-xs font-medium">Idea saved successfully</span>
      </div>
    </div>
  )
}
