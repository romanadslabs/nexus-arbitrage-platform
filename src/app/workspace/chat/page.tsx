'use client'

import React from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ChatManager from '@/components/chat/ChatManager'

export default function ChatPage() {
    return (
        <ProtectedRoute>
            <ModernLayout>
                <ChatManager />
            </ModernLayout>
        </ProtectedRoute>
    )
} 