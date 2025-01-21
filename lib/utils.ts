import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MODELS = [
  { id: "deepseek-chat", name: "DeepSeek-V3", version: "v3", apiModel: "deepseek-chat" },
  { id: "deepseek-coder", name: "DeepSeek-R1", version: "r1", apiModel: "deepseek-reasoner" },
] as const

export type Model = typeof MODELS[number]

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: Date
  model: Model["id"]
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  model: Model["id"]
  createdAt: Date
  updatedAt: Date
} 