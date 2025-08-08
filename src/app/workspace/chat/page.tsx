'use client'

import React from 'react'
import ChatManager from '@/components/chat/ChatManager'
import { FadeIn, SlideUp } from '@/components/ui/Animations'

export default function ChatPage() {
    return (
    <FadeIn>
      <SlideUp>
                <ChatManager />
      </SlideUp>
    </FadeIn>
  )
} 