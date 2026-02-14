"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Brief } from "@/types/brief"
import { TONE_OPTIONS } from "@/lib/constants"

interface ScenarioFormProps {
  brief: Brief
  onChange: (brief: Brief) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ScenarioForm({ brief, onChange, onSubmit, isLoading }: ScenarioFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="treatment" className="text-sm font-medium text-foreground">
          Zabieg / usługa
        </Label>
        <Input
          id="treatment"
          placeholder="np. Botox, mezoterapia, manicure hybrydowy..."
          value={brief.treatment}
          onChange={(e) => onChange({ ...brief, treatment: e.target.value })}
          className="border-border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="targetAudience" className="text-sm font-medium text-foreground">
          Grupa docelowa
        </Label>
        <Input
          id="targetAudience"
          placeholder="np. Kobieta 30-45 lat, zainteresowana anti-aging..."
          value={brief.targetAudience}
          onChange={(e) => onChange({ ...brief, targetAudience: e.target.value })}
          className="border-border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tone" className="text-sm font-medium text-foreground">
          Ton komunikacji
        </Label>
        <select
          id="tone"
          value={brief.tone}
          onChange={(e) => onChange({ ...brief, tone: e.target.value })}
          className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {TONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground">
          Dodatkowe informacje
        </Label>
        <Textarea
          id="notes"
          placeholder="Kontekst, styl komunikacji, specjalne wymagania klientki..."
          value={brief.notes || ""}
          onChange={(e) => onChange({ ...brief, notes: e.target.value })}
          rows={3}
          className="resize-none border-border bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !brief.treatment || !brief.targetAudience}
        className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generuję hashtagi...
          </>
        ) : (
          "Dalej — sugeruj hashtagi"
        )}
      </Button>
    </form>
  )
}
