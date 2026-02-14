"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Search, X } from "lucide-react"

interface AccountSelectorProps {
  accounts: string[]
  reasoning: string
  onConfirm: (selected: string[]) => void
  onBack: () => void
  isLoading: boolean
}

export function AccountSelector({
  accounts,
  reasoning,
  onConfirm,
  onBack,
  isLoading,
}: AccountSelectorProps) {
  const [selected, setSelected] = useState<string[]>(accounts)
  const [customAccount, setCustomAccount] = useState("")

  function toggleAccount(account: string) {
    setSelected((prev) =>
      prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account]
    )
  }

  function addCustomAccount() {
    const clean = customAccount.replace(/^@/, "").trim().toLowerCase()
    if (clean && !selected.includes(clean)) {
      setSelected((prev) => [...prev, clean])
    }
    setCustomAccount("")
  }

  function removeAccount(account: string) {
    setSelected((prev) => prev.filter((a) => a !== account))
  }

  return (
    <div className="flex flex-col gap-5">
      {reasoning && (
        <p className="text-sm italic text-muted-foreground">{reasoning}</p>
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-foreground">
          Wybrane konta ({selected.length})
        </Label>
        <div className="flex flex-wrap gap-2">
          {accounts.map((account) => (
            <button
              key={account}
              type="button"
              onClick={() => toggleAccount(account)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selected.includes(account)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground line-through"
              }`}
            >
              @{account}
              {selected.includes(account) && (
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAccount(account)
                  }}
                />
              )}
            </button>
          ))}
          {selected
            .filter((a) => !accounts.includes(a))
            .map((account) => (
              <button
                key={account}
                type="button"
                onClick={() => removeAccount(account)}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
              >
                @{account}
                <X className="h-3 w-3" />
              </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customAccount" className="text-sm font-medium text-foreground">
          Dodaj własne konto
        </Label>
        <div className="flex gap-2">
          <Input
            id="customAccount"
            placeholder="np. drbeauty_pl"
            value={customAccount}
            onChange={(e) => setCustomAccount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAccount())}
            className="border-border bg-card text-foreground placeholder:text-muted-foreground"
          />
          <Button type="button" variant="outline" onClick={addCustomAccount}>
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
              Pobieram Reelsy...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Pobierz Reelsy ({selected.length} kont)
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
