"use client"

import { useState, useEffect } from "react"
import { Mail, CheckCircle, KeyRound } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { signIn, verifyOtp, user } = useAuth()
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  // Close modal when user is authenticated
  useEffect(() => {
    if (user) {
      onClose()
    }
  }, [user, onClose])

  const handleSendCode = async (e: React.FormEvent) => {
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token || token.length < 6) {
      setError("Please enter the 6-digit code")
      return
    }

    setLoading(true)
    const { error } = await verifyOtp(email, token)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Success - modal will close automatically when session updates
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
      <div className="relative w-full max-w-sm glass-panel bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl bg-neutral-900/60 backdrop-blur-lg">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            {sent ? <KeyRound className="w-6 h-6 text-rose-500" /> : <Mail className="w-6 h-6 text-rose-500" />}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              {sent ? "Enter verification code" : "Welcome to Memorigw"}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {sent
                ? "Enter the 6-digit code sent to your email"
                : "Enter your email to receive a verification code"}
            </p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSendCode} className="space-y-4">
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
                autoFocus
              />
              {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-neutral-200 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-neutral-400 uppercase">
                6-Digit Code
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 text-center tracking-widest text-lg"
                disabled={loading}
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] text-neutral-400 text-center">
                Code sent to <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || token.length < 6}
              className="w-full bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setToken("")
                  setError("")
                }}
                className="text-xs text-neutral-500 hover:text-white transition-colors"
              >
                Use different email
              </button>
              <span className="text-neutral-700">•</span>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  await signIn(email)
                  setLoading(false)
                }}
                className="text-xs text-neutral-500 hover:text-white transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Resend code
              </button>
            </div>
          </form>
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
