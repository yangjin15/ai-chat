"use client"

import * as React from "react"
import { MODELS, Model } from "@/lib/utils"
import { Button } from "./ui/button"

interface ModelSelectorProps {
  value: Model["id"]
  onChange: (value: Model["id"]) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex gap-2">
      {MODELS.map((model) => (
        <Button
          key={model.id}
          variant={value === model.id ? "default" : "outline"}
          onClick={() => onChange(model.id)}
          className="flex-1"
        >
          {model.name}
          <span className="ml-2 text-xs opacity-50">{model.version}</span>
        </Button>
      ))}
    </div>
  )
} 