import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ChatSession } from '@/lib/chat-storage'

const CHATS_DIR = path.join(process.cwd(), 'chats')

// 确保聊天记录目录存在
if (!fs.existsSync(CHATS_DIR)) {
  fs.mkdirSync(CHATS_DIR, { recursive: true })
}

export async function GET() {
  try {
    if (!fs.existsSync(CHATS_DIR)) {
      return NextResponse.json([])
    }

    const files = fs.readdirSync(CHATS_DIR)
    const sessions = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          const filePath = path.join(CHATS_DIR, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          const session = JSON.parse(content)
          return {
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt)
          }
        } catch (error) {
          console.error(`Error reading file ${file}:`, error)
          return null
        }
      })
      .filter(session => session !== null)
    
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Failed to load chat sessions:", error)
    return NextResponse.json([])  // 出错时返回空数组
  }
}

export async function POST(request: Request) {
  try {
    const session = await request.json()
    const filePath = path.join(CHATS_DIR, `${session.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save chat session:", error)
    return NextResponse.json({ error: "Failed to save chat session" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const filePath = path.join(CHATS_DIR, `${id}.json`)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete chat session:", error)
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 })
  }
} 