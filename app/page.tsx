"use client"

import { useState } from "react"
import { Chat } from "@/components/chat"
import { Sidebar } from "@/components/sidebar"
import { ChatSession, createNewSession, saveChatSession } from "@/lib/chat-storage"

export default function Page() {
  const [currentSession, setCurrentSession] = useState<ChatSession>(createNewSession())

  const handleSessionUpdate = (session: ChatSession) => {
    setCurrentSession(session)
    saveChatSession(session)
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        className="w-[300px] border-r" 
        onSessionSelect={setCurrentSession}
        currentSessionId={currentSession.id}
      />
      <main className="flex-1">
        <Chat 
          session={currentSession}
          onSessionUpdate={handleSessionUpdate}
        />
      </main>
    </div>
  )
}