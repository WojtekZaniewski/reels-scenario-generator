"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, Sparkles } from "lucide-react"
import type { Reel } from "@/types/reel"

interface ReelsListProps {
  reels: Reel[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onGenerate: () => void
  onBack: () => void
  isLoading: boolean
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

function scoreColor(score: number): string {
  if (score >= 80) return "bg-green-500 text-white"
  if (score >= 60) return "bg-yellow-500 text-white"
  if (score >= 30) return "bg-orange-400 text-white"
  return "bg-muted text-muted-foreground"
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Viralowy!"
  if (score >= 60) return "Wysoki"
  if (score >= 30) return "Średni"
  return "Niski"
}

export function ReelsList({
  reels,
  selectedIds,
  onToggleSelect,
  onGenerate,
  onBack,
  isLoading,
}: ReelsListProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Zaznacz Reelsy, które posłużą jako inspiracja do scenariusza (max 5).
      </p>

      <div className="flex flex-col gap-3">
        {reels.map((reel) => (
          <div
            key={reel.id}
            onClick={() => onToggleSelect(reel.id)}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              selectedIds.includes(reel.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <Checkbox
              checked={selectedIds.includes(reel.id)}
              onCheckedChange={() => onToggleSelect(reel.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor(reel.viralScore)}`}
                >
                  {reel.viralScore}/100 — {scoreLabel(reel.viralScore)}
                </span>
                {reel.ownerUsername && (
                  <span className="text-xs text-muted-foreground">
                    @{reel.ownerUsername}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-foreground line-clamp-2">
                {reel.caption || "(brak opisu)"}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>Wyświetlenia: {formatNumber(reel.metrics.views)}</span>
                <span>Polubienia: {formatNumber(reel.metrics.likes)}</span>
                <span>Komentarze: {formatNumber(reel.metrics.comments)}</span>
                <span>Engagement: {reel.metrics.engagementRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reels.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          Brak wyników. Spróbuj innych hashtagów.
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>
        <Button
          type="button"
          disabled={isLoading || selectedIds.length === 0}
          onClick={onGenerate}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generuję scenariusz...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generuj scenariusz ({selectedIds.length} Reelsów)
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
