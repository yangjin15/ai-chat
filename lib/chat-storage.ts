import { Message } from "./utils"

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return "今天 " + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return "昨天 " + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export async function saveChatSession(session: ChatSession) {
  try {
    await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    })
  } catch (error) {
    console.error("Failed to save chat session:", error)
  }
}

export async function loadChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await fetch('/api/chats')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // 确保返回的是数组
    const sessions = Array.isArray(data) ? data : []
    
    return sessions.map((session: any) => ({
      id: session.id || String(Date.now()),
      title: formatDate(new Date(session.createdAt || Date.now())),
      messages: Array.isArray(session.messages) ? session.messages : [],
      createdAt: new Date(session.createdAt || Date.now()),
      updatedAt: new Date(session.updatedAt || Date.now())
    })).sort((a: ChatSession, b: ChatSession) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Failed to load chat sessions:", error)
    return []
  }
}

export async function deleteChatSession(id: string) {
  try {
    await fetch('/api/chats', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
  } catch (error) {
    console.error("Failed to delete chat session:", error)
  }
}

export function createNewSession(): ChatSession {
  const now = new Date()
  return {
    id: now.getTime().toString(),
    title: formatDate(now),
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
} 