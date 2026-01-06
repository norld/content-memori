"use client"

import { useState } from "react"
import { Search, LogOut, LogIn, X } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { LogoWithText } from "@/components/logo"
import { CoinBadge } from "@/components/coin-badge"

interface HeaderProps {
  user: SupabaseUser | null
  onLogout: () => void
  onLogin: () => void
  searchQuery: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  coins?: number
}

export default function Header({ user, onLogout, onLogin, searchQuery, onSearchChange, coins }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const getUserInitials = () => {
    if (user?.email) {
      const parts = user.email.split("@")[0].split(".")
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return user.email.substring(0, 2).toUpperCase()
    }
    return "JD"
  }

  return (
    <header className="glass-header relative z-40 w-full h-16 flex items-center justify-between px-6 lg:px-12 bg-neutral-900/80 backdrop-blur-lg border-b border-white/5">
      <div className="flex items-center gap-8">
        <LogoWithText />
        <nav className="hidden md:flex items-center gap-1">
          <a
            href="#"
            className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 rounded-md border border-white/5 shadow-sm"
          >
            Dashboard
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-64 bg-neutral-900/50 border border-white/5 text-neutral-300 text-xs rounded-full pl-9 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange({ target: { value: '' } } as any)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Coins Badge */}
        {user && coins !== undefined && <CoinBadge coins={coins} />}

        {/* Profile Dropdown or Login Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border border-white/10 flex items-center justify-center text-xs font-medium text-white shadow-inner hover:ring-2 hover:ring-rose-500/20 transition-all"
            >
              {getUserInitials()}
            </button>

            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl p-1 z-50 animate-scale-in origin-top-right bg-neutral-900/60 backdrop-blur-lg border border-white/5">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs font-medium text-white">{user.email}</p>
                </div>
                {/* <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" /> Profile
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" /> Settings
                </a> */}
                <button
                  onClick={() => {
                    onLogout()
                    setShowProfileDropdown(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-lg shadow-rose-900/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
