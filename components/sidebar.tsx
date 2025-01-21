"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react"
import { ChatSession, loadChatSessions, deleteChatSession, createNewSession } from "@/lib/chat-storage"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSessionSelect?: (session: ChatSession) => void
  currentSessionId?: string
}

export function Sidebar({ className, onSessionSelect, currentSessionId, ...props }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    const loadSessions = async () => {
      const loadedSessions = await loadChatSessions()
      setSessions(loadedSessions)
    }
    loadSessions()
  }, [])

  const handleNewChat = () => {
    const newSession = createNewSession()
    setSessions(prev => [newSession, ...prev])
    onSessionSelect?.(newSession)
  }

  const handleDeleteSession = async (id: string) => {
    await deleteChatSession(id)
    setSessions(prev => prev.filter(session => session.id !== id))
  }

  return (
    <div className={cn("flex flex-col bg-muted/50", className)} {...props}>
      <div className="p-4">
        <Button 
          className="w-full justify-start gap-2" 
          variant="outline"
          onClick={handleNewChat}
        >
          <PlusCircle className="h-4 w-4" />
          新建聊天
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group flex items-center gap-2 px-4 py-3 hover:bg-muted cursor-pointer",
              currentSessionId === session.id && "bg-muted"
            )}
            onClick={() => onSessionSelect?.(session)}
          >
            <div className="flex flex-1 items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1 text-left">
                {session.title || session.messages[0]?.content.slice(0, 30) || "新对话"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteSession(session.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 