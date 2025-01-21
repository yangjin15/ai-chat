"use client"

import { useState, useEffect } from "react"
import { Message, Model, MODELS } from "@/lib/utils"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { ModelSelector } from "./model-selector"
import { ChatSession, saveChatSession } from "@/lib/chat-storage"

interface ChatProps {
  session: ChatSession
  onSessionUpdate: (session: ChatSession) => void
}

export function Chat({ session, onSessionUpdate }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState<Model["id"]>("deepseek-chat")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")

  useEffect(() => {
    if (session.messages.length > 0) {
      setSelectedModel(session.messages[0].model)
    }
  }, [session.messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      content,
      role: "user",
      createdAt: new Date(),
      model: selectedModel,
    }

    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage],
      updatedAt: new Date(),
    }
    onSessionUpdate(updatedSession)
    setIsLoading(true)
    setStreamingContent("")

    try {
      const selectedModelConfig = MODELS.find(m => m.id === selectedModel)
      if (!selectedModelConfig) throw new Error("Invalid model selected")

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: selectedModelConfig.apiModel,
          messages: [{ role: "user", content }],
          stream: true,
        }),
      })

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let fullContent = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line))

        for (const parsed of parsedLines) {
          if (parsed.choices[0]?.delta?.content) {
            const newContent = parsed.choices[0].delta.content
            fullContent += newContent
            setStreamingContent(fullContent)
          }
        }
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        content: fullContent,
        role: "assistant",
        createdAt: new Date(),
        model: selectedModel,
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date(),
      }
      onSessionUpdate(finalSession)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
      setStreamingContent("")
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <ModelSelector
          value={selectedModel}
          onChange={setSelectedModel}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl">
          {session.messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">欢迎使用 AI Chat</h1>
                <p className="text-muted-foreground">
                  选择一个模型开始对话，或者从左侧选择历史对话
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages 
              messages={session.messages} 
              streamingMessage={
                isLoading ? {
                  id: "streaming",
                  content: streamingContent,
                  role: "assistant",
                  createdAt: new Date(),
                  model: selectedModel,
                } : undefined
              }
            />
          )}
        </div>
      </div>
      <div className="border-t p-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
} 