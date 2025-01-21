"use client"

import { Message } from "@/lib/utils"
import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatMessagesProps {
  messages: Message[]
  streamingMessage?: Message
}

export function ChatMessages({ messages, streamingMessage }: ChatMessagesProps) {
  const allMessages = streamingMessage 
    ? [...messages, streamingMessage]
    : messages

  return (
    <div className="space-y-12 py-8 px-4">
      {allMessages.map((message) => (
        <div 
          key={message.id} 
          className={`flex gap-8 ${
            message.role === "user" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 p-1 ring-1 ring-primary/10">
            {message.role === "user" ? (
              <User className="h-full w-full" />
            ) : (
              <Bot className="h-full w-full" />
            )}
          </div>
          <div className={`flex-1 space-y-2 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}>
            <div className={`prose prose-neutral dark:prose-invert max-w-[80%] ${
              message.role === "user" ? "ml-auto" : "mr-auto"
            }`}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 