import { AirtableService, TABLES, FIELD_NAMES } from './airtable'

export interface ChatMessage {
  id: string
  workspaceId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  messageType: 'text' | 'file' | 'image' | 'system'
  timestamp: Date
  isEdited: boolean
  replyTo?: string
  reactions: ChatReaction[]
  attachments?: ChatAttachment[]
}

export interface ChatReaction {
  emoji: string
  userId: string
  userName: string
  timestamp: Date
}

export interface ChatAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface ChatWorkspace {
  id: string
  name: string
  description: string
  members: string[]
  createdAt: Date
  lastActivity: Date
  isActive: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  workspaces: ChatWorkspace[]
  currentWorkspace: string | null
  isLoading: boolean
  error: string | null
}

class ChatService {
  private static instance: ChatService
  private currentUserId: string | null = null
  private listeners: ((state: ChatState) => void)[] = []
  private messageCache: Map<string, ChatMessage[]> = new Map()
  private workspaceCache: ChatWorkspace[] = []

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService()
    }
    return ChatService.instance
  }

  // Ініціалізація сервісу
  initialize(userId: string): void {
    this.currentUserId = userId
    this.loadWorkspaces()
  }

  // Підписка на зміни
  subscribe(listener: (state: ChatState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Сповіщення слухачів
  private notifyListeners() {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }

  // Отримання поточного стану
  getState(): ChatState {
    return {
      messages: this.messageCache.get(this.currentWorkspace || '') || [],
      workspaces: this.workspaceCache,
      currentWorkspace: this.currentWorkspace,
      isLoading: false,
      error: null
    }
  }

  private currentWorkspace: string | null = null

  // Завантаження робочих просторів
  async loadWorkspaces(): Promise<ChatWorkspace[]> {
    try {
      // Отримуємо робочі простори з Airtable
      const workspaceRecords = await AirtableService.getAllRecords('Chat Workspaces')
      
      this.workspaceCache = workspaceRecords.map(record => ({
        id: record.id,
        name: record.fields.Name || '',
        description: record.fields.Description || '',
        members: record.fields.Members || [],
        createdAt: new Date(record.createdTime),
        lastActivity: record.fields['Last Activity'] ? new Date(record.fields['Last Activity']) : new Date(record.createdTime),
        isActive: record.fields.Status === 'active'
      }))

      this.notifyListeners()
      return this.workspaceCache

    } catch (error) {
      console.error('Error loading workspaces:', error)
      throw error
    }
  }

  // Створення нового робочого простору
  async createWorkspace(data: {
    name: string
    description: string
    members: string[]
  }): Promise<ChatWorkspace> {
    try {
      if (!this.currentUserId) {
        throw new Error('User not initialized')
      }

      const workspaceRecord = await AirtableService.createRecord('Chat Workspaces', {
        Name: data.name,
        Description: data.description,
        Members: [...data.members, this.currentUserId],
        'Created By': this.currentUserId,
        Status: 'active',
        'Last Activity': new Date().toISOString()
      })

      const workspace: ChatWorkspace = {
        id: workspaceRecord.id,
        name: data.name,
        description: data.description,
        members: [...data.members, this.currentUserId],
        createdAt: new Date(workspaceRecord.createdTime),
        lastActivity: new Date(),
        isActive: true
      }

      this.workspaceCache.push(workspace)
      this.notifyListeners()

      return workspace

    } catch (error) {
      console.error('Error creating workspace:', error)
      throw error
    }
  }

  // Переключення на робочий простір
  async switchWorkspace(workspaceId: string): Promise<void> {
    this.currentWorkspace = workspaceId
    await this.loadMessages(workspaceId)
    this.notifyListeners()
  }

  // Завантаження повідомлень
  async loadMessages(workspaceId: string): Promise<ChatMessage[]> {
    try {
      // Перевіряємо кеш
      if (this.messageCache.has(workspaceId)) {
        return this.messageCache.get(workspaceId)!
      }

      // Отримуємо повідомлення з Airtable
      const messageRecords = await AirtableService.findRecords(
        'Chat Messages',
        `{Workspace ID} = '${workspaceId}'`
      )

      const messages: ChatMessage[] = messageRecords.map(record => ({
        id: record.id,
        workspaceId: record.fields['Workspace ID'] || '',
        senderId: record.fields['Sender ID'] || '',
        senderName: record.fields['Sender Name'] || '',
        senderAvatar: record.fields['Sender Avatar'] || '',
        content: record.fields.Content || '',
        messageType: record.fields['Message Type'] || 'text',
        timestamp: new Date(record.createdTime),
        isEdited: record.fields['Is Edited'] || false,
        replyTo: record.fields['Reply To'] || undefined,
        reactions: record.fields.Reactions || [],
        attachments: record.fields.Attachments || []
      }))

      // Сортуємо за часом
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      // Кешуємо повідомлення
      this.messageCache.set(workspaceId, messages)
      this.notifyListeners()

      return messages

    } catch (error) {
      console.error('Error loading messages:', error)
      throw error
    }
  }

  // Відправка повідомлення
  async sendMessage(data: {
    workspaceId: string
    content: string
    messageType?: ChatMessage['messageType']
    replyTo?: string
    attachments?: ChatAttachment[]
  }): Promise<ChatMessage> {
    try {
      if (!this.currentUserId) {
        throw new Error('User not initialized')
      }

      // Отримуємо інформацію про відправника
      const userRecord = await AirtableService.getRecord('Team Members', this.currentUserId)
      if (!userRecord) {
        throw new Error('User not found')
      }

      const messageRecord = await AirtableService.createRecord('Chat Messages', {
        'Workspace ID': data.workspaceId,
        'Sender ID': this.currentUserId,
        'Sender Name': userRecord.fields.Name || '',
        'Sender Avatar': userRecord.fields.Avatar || '',
        Content: data.content,
        'Message Type': data.messageType || 'text',
        'Reply To': data.replyTo || '',
        Attachments: data.attachments || [],
        Reactions: [],
        'Is Edited': false
      })

      const message: ChatMessage = {
        id: messageRecord.id,
        workspaceId: data.workspaceId,
        senderId: this.currentUserId,
        senderName: userRecord.fields.Name || '',
        senderAvatar: userRecord.fields.Avatar || '',
        content: data.content,
        messageType: data.messageType || 'text',
        timestamp: new Date(messageRecord.createdTime),
        isEdited: false,
        replyTo: data.replyTo,
        reactions: [],
        attachments: data.attachments
      }

      // Додаємо повідомлення до кешу
      const workspaceMessages = this.messageCache.get(data.workspaceId) || []
      workspaceMessages.push(message)
      this.messageCache.set(data.workspaceId, workspaceMessages)

      // Оновлюємо останню активність робочого простору
      await this.updateWorkspaceActivity(data.workspaceId)

      this.notifyListeners()
      return message

    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Редагування повідомлення
  async editMessage(messageId: string, newContent: string): Promise<ChatMessage> {
    try {
      if (!this.currentUserId) {
        throw new Error('User not initialized')
      }

      // Отримуємо повідомлення
      const messageRecord = await AirtableService.getRecord('Chat Messages', messageId)
      if (!messageRecord) {
        throw new Error('Message not found')
      }

      // Перевіряємо права на редагування
      if (messageRecord.fields['Sender ID'] !== this.currentUserId) {
        throw new Error('Cannot edit message from another user')
      }

      // Оновлюємо повідомлення
      const updatedRecord = await AirtableService.updateRecord('Chat Messages', messageId, {
        Content: newContent,
        'Is Edited': true,
        'Edited At': new Date().toISOString()
      })

      const message: ChatMessage = {
        id: updatedRecord.id,
        workspaceId: updatedRecord.fields['Workspace ID'] || '',
        senderId: updatedRecord.fields['Sender ID'] || '',
        senderName: updatedRecord.fields['Sender Name'] || '',
        senderAvatar: updatedRecord.fields['Sender Avatar'] || '',
        content: newContent,
        messageType: updatedRecord.fields['Message Type'] || 'text',
        timestamp: new Date(updatedRecord.createdTime),
        isEdited: true,
        replyTo: updatedRecord.fields['Reply To'] || undefined,
        reactions: updatedRecord.fields.Reactions || [],
        attachments: updatedRecord.fields.Attachments || []
      }

      // Оновлюємо кеш
      this.updateMessageInCache(message)
      this.notifyListeners()

      return message

    } catch (error) {
      console.error('Error editing message:', error)
      throw error
    }
  }

  // Видалення повідомлення
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      if (!this.currentUserId) {
        throw new Error('User not initialized')
      }

      // Отримуємо повідомлення
      const messageRecord = await AirtableService.getRecord('Chat Messages', messageId)
      if (!messageRecord) {
        throw new Error('Message not found')
      }

      // Перевіряємо права на видалення
      if (messageRecord.fields['Sender ID'] !== this.currentUserId) {
        throw new Error('Cannot delete message from another user')
      }

      // Видаляємо повідомлення
      await AirtableService.deleteRecord('Chat Messages', messageId)

      // Видаляємо з кешу
      this.removeMessageFromCache(messageId)
      this.notifyListeners()

      return true

    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  // Додавання реакції
  async addReaction(messageId: string, emoji: string): Promise<void> {
    try {
      if (!this.currentUserId) {
        throw new Error('User not initialized')
      }

      // Отримуємо повідомлення
      const messageRecord = await AirtableService.getRecord('Chat Messages', messageId)
      if (!messageRecord) {
        throw new Error('Message not found')
      }

      // Отримуємо інформацію про користувача
      const userRecord = await AirtableService.getRecord('Team Members', this.currentUserId)
      if (!userRecord) {
        throw new Error('User not found')
      }

      const currentReactions = messageRecord.fields.Reactions || []
      const newReaction: ChatReaction = {
        emoji,
        userId: this.currentUserId,
        userName: userRecord.fields.Name || '',
        timestamp: new Date()
      }

      // Перевіряємо, чи реакція вже існує
      const existingReactionIndex = currentReactions.findIndex(
        (r: any) => r.userId === this.currentUserId && r.emoji === emoji
      )

      let updatedReactions
      if (existingReactionIndex >= 0) {
        // Видаляємо існуючу реакцію
        updatedReactions = currentReactions.filter((_: any, index: number) => index !== existingReactionIndex)
      } else {
        // Додаємо нову реакцію
        updatedReactions = [...currentReactions, newReaction]
      }

      // Оновлюємо повідомлення
      await AirtableService.updateRecord('Chat Messages', messageId, {
        Reactions: updatedReactions
      })

      // Оновлюємо кеш
      this.updateMessageReactionsInCache(messageId, updatedReactions)
      this.notifyListeners()

    } catch (error) {
      console.error('Error adding reaction:', error)
      throw error
    }
  }

  // Отримання повідомлень в реальному часі (симуляція)
  async subscribeToMessages(workspaceId: string, callback: (message: ChatMessage) => void): Promise<() => void> {
    // В реальному проекті тут було б WebSocket підключення
    // Поки що симулюємо оновлення кожні 5 секунд
    const interval = setInterval(async () => {
      try {
        const messages = await this.loadMessages(workspaceId)
        const lastMessage = messages[messages.length - 1]
        if (lastMessage && lastMessage.senderId !== this.currentUserId) {
          callback(lastMessage)
        }
      } catch (error) {
        console.error('Error in message subscription:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }

  // Оновлення активності робочого простору
  private async updateWorkspaceActivity(workspaceId: string): Promise<void> {
    try {
      await AirtableService.updateRecord('Chat Workspaces', workspaceId, {
        'Last Activity': new Date().toISOString()
      })

      // Оновлюємо кеш
      const workspace = this.workspaceCache.find(w => w.id === workspaceId)
      if (workspace) {
        workspace.lastActivity = new Date()
        this.notifyListeners()
      }

    } catch (error) {
      console.error('Error updating workspace activity:', error)
    }
  }

  // Оновлення повідомлення в кеші
  private updateMessageInCache(message: ChatMessage): void {
    const workspaceMessages = this.messageCache.get(message.workspaceId)
    if (workspaceMessages) {
      const index = workspaceMessages.findIndex(m => m.id === message.id)
      if (index >= 0) {
        workspaceMessages[index] = message
      }
    }
  }

  // Видалення повідомлення з кешу
  private removeMessageFromCache(messageId: string): void {
    for (const [workspaceId, messages] of this.messageCache.entries()) {
      const index = messages.findIndex(m => m.id === messageId)
      if (index >= 0) {
        messages.splice(index, 1)
        break
      }
    }
  }

  // Оновлення реакцій повідомлення в кеші
  private updateMessageReactionsInCache(messageId: string, reactions: ChatReaction[]): void {
    for (const messages of this.messageCache.values()) {
      const message = messages.find(m => m.id === messageId)
      if (message) {
        message.reactions = reactions
        break
      }
    }
  }

  // Очищення кешу
  clearCache(): void {
    this.messageCache.clear()
    this.workspaceCache = []
    this.notifyListeners()
  }
}

export default ChatService.getInstance() 