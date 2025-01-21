import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Chat",
  description: "A ChatGPT-like chat interface using DeepSeek API",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className="dark">
      <body className="bg-background min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
} 