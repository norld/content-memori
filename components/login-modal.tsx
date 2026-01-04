"use client"

import { useState } from "react"
import { Mail, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    const { error } = await signIn(email)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
      <div className="relative w-full max-w-sm glass-panel bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl bg-neutral-900/60 backdrop-blur-lg">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <Mail className="w-6 h-6 text-rose-500" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              {sent ? "Check your email" : "Welcome to Memorigw"}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {sent
                ? "We sent you a magic link to sign in"
                : "Enter your email to receive a magic link"}
            </p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-neutral-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50"
                disabled={loading}
              />
              {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-neutral-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{email}</p>
                  <p className="text-[10px] text-neutral-500">Magic link sent!</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-neutral-600 text-center">
              Click the link in your email to sign in. The link will expire in 24 hours.
            </p>
            <button
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
              className="w-full text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
