import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '桃花镜 - AI头像吸引力诊断',
  description: '基于视觉心理学的AI头像分析工具，帮助你提升社交第一印象',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}