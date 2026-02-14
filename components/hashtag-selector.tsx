"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Search, X } from "lucide-react"

interface HashtagSelectorProps {
  hashtags: string[]
  reasoning: string
  onConfirm: (selected: string[]) => void
  onBack: () => void
  isLoading: boolean
}

export function HashtagSelector({
  hashtags,
  reasoning,
  onConfirm,
  onBack,
  isLoading,
}: HashtagSelectorProps) {
  const [selected, setSelected] = useState<string[]>(hashtags)
  const [customTag, setCustomTag] = useState("")

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function addCustomTag() {
    const clean = customTag.replace(/^#/, "").trim().toLowerCase()
    if (clean && !selected.includes(clean)) {
      setSelected((prev) => [...prev, clean])
    }
    setCustomTag("")
  }

  function removeTag(tag: string) {
    setSelected((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col gap-5">
      {reasoning && (
        <p className="text-sm italic text-muted-foreground">{reasoning}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-foreground">
          Wybrane hashtagi ({selected.length})
        </Label>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selected.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground line-through"
              }`}
            >
              #{tag}
              {selected.includes(tag) && (
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(tag)
                  }}
                />
              )}
            </button>
          ))}
          {selected
            .filter((t) => !hashtags.includes(t))
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
              >
                #{tag}
                <X className="h-3 w-3" />
              </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customTag" className="text-sm font-medium text-foreground">
          Dodaj własny hashtag
        </Label>
        <div className="flex gap-2">
          <Input
            id="customTag"
            placeholder="np. nailart"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
            className="border-border bg-card text-foreground placeholder:text-muted-foreground"
          />
          <Button type="button" variant="outline" onClick={addCustomTag}>
            Dodaj
          </Button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>
        <Button
          type="button"
          disabled={isLoading || selected.length === 0}
          onClick={() => onConfirm(selected)}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Szukam Reelsów...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Szukaj Reelsów ({selected.length} hashtagów)
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
