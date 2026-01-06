"use client"

import { Coins, Zap } from "lucide-react"

interface CoinBadgeProps {
  coins: number
}

export function CoinBadge({ coins }: CoinBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
      <Zap className="w-3.5 h-3.5 text-blue-400" />
      <span className="text-xs font-semibold text-blue-400">
        {coins}
      </span>
    </div>
  )
}
