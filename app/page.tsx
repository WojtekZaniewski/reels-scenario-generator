"use client"

import { useState, useCallback } from "react"
import { ScenarioForm } from "@/components/scenario-form"
import { HashtagSelector } from "@/components/hashtag-selector"
import { ReelsList } from "@/components/reels-list"
import { ScenarioResult } from "@/components/scenario-result"
import type { Brief } from "@/types/brief"
import type { Reel } from "@/types/reel"
import type { ScenarioAIResponse } from "@/lib/ai/types"

type Step = "brief" | "hashtags" | "results" | "scenario"

const STEP_LABELS: Record<Step, string> = {
  brief: "Brief",
  hashtags: "Hashtagi",
  results: "Reelsy",
  scenario: "Scenariusz",
}

const STEPS: Step[] = ["brief", "hashtags", "results", "scenario"]

export default function Page() {
  const [step, setStep] = useState<Step>("brief")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [brief, setBrief] = useState<Brief>({
    treatment: "",
    targetAudience: "",
    tone: "profesjonalny",
  })

  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagReasoning, setHashtagReasoning] = useState("")

  const [reels, setReels] = useState<Reel[]>([])
  const [selectedReelIds, setSelectedReelIds] = useState<string[]>([])

  const [scenario, setScenario] = useState<ScenarioAIResponse | null>(null)
  const [rawScenarioText, setRawScenarioText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const suggestHashtags = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/suggest-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHashtags(data.hashtags)
      setHashtagReasoning(data.reasoning)
      setStep("hashtags")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd podczas generowania hashtagów")
    } finally {
      setLoading(false)
    }
  }, [brief])

  const scrapeReels = useCallback(async (selectedHashtags: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/scrape-reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hashtags: selectedHashtags }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReels(data.reels)
      setSelectedReelIds(data.reels.slice(0, 5).map((r: Reel) => r.id))
      setStep("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd podczas pobierania Reelsów")
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleReelSelect = useCallback((id: string) => {
    setSelectedReelIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
    })
  }, [])

  const generateScenario = useCallback(async () => {
    setLoading(true)
    setIsStreaming(true)
    setScenario(null)
    setRawScenarioText("")
    setError(null)
    setStep("scenario")

    try {
      const selectedReels = reels.filter((r) => selectedReelIds.includes(r.id))

      const res = await fetch("/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, reels: selectedReels }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
          setRawScenarioText(fullText)
        }
      }

      const jsonMatch = fullText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed: ScenarioAIResponse = JSON.parse(jsonMatch[0])
        setScenario(parsed)
      } else {
        setScenario({
          hook: fullText,
          mainContent: [],
          cta: "",
          musicMood: "",
          filmingTips: [],
          estimatedDuration: "",
          patterns: [],
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd podczas generowania scenariusza")
    } finally {
      setLoading(false)
      setIsStreaming(false)
    }
  }, [brief, reels, selectedReelIds])

  const currentStepIndex = STEPS.indexOf(step)

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reel Scenario Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Znajdź viralowe Reelsy z niszy beauty i wygeneruj scenariusz dla klientki.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={i <= currentStepIndex ? "text-foreground font-medium" : ""}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Steps */}
        {step === "brief" && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <ScenarioForm
              brief={brief}
              onChange={setBrief}
              onSubmit={suggestHashtags}
              isLoading={loading}
            />
          </div>
        )}

        {step === "hashtags" && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <HashtagSelector
              hashtags={hashtags}
              reasoning={hashtagReasoning}
              onConfirm={scrapeReels}
              onBack={() => setStep("brief")}
              isLoading={loading}
            />
          </div>
        )}

        {step === "results" && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <ReelsList
              reels={reels}
              selectedIds={selectedReelIds}
              onToggleSelect={toggleReelSelect}
              onGenerate={generateScenario}
              onBack={() => setStep("hashtags")}
              isLoading={loading}
            />
          </div>
        )}

        {step === "scenario" && (
          <ScenarioResult
            scenario={scenario}
            rawText={rawScenarioText}
            isStreaming={isStreaming}
            visible={true}
            onBack={() => setStep("results")}
            onRegenerate={generateScenario}
          />
        )}
      </div>
    </main>
  )
}
