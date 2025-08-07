import { NextRequest, NextResponse } from 'next/server'
import { kasmWebClient } from '@/lib/kasmWeb'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Тестування підключення до KasmWeb...')
    
    // Тест 1: Отримання образів
    console.log('📦 Отримання образів...')
    const images = await kasmWebClient.getImages()
    console.log('✅ Образи:', images.length, 'знайдено')
    
    // Тест 2: Отримання серверів
    console.log('🖥️ Отримання серверів...')
    const servers = await kasmWebClient.getServers()
    console.log('✅ Сервери:', servers.length, 'знайдено')
    
    // Тест 3: Отримання сесій
    console.log('🔄 Отримання сесій...')
    const sessions = await kasmWebClient.getSessions()
    console.log('✅ Сесії:', sessions.length, 'знайдено')
    
    // Тест 4: Перевірка конфігурації
    console.log('⚙️ Перевірка конфігурації...')
    const config = {
      serverUrl: kasmWebClient['baseUrl'],
      apiKey: kasmWebClient['apiKey'] ? '✅ Налаштований' : '❌ Відсутній',
      apiSecret: kasmWebClient['apiSecret'] ? '✅ Налаштований' : '❌ Відсутній'
    }
    
    return NextResponse.json({
      success: true,
      message: 'Підключення до KasmWeb успішне',
      data: {
        images: {
          count: images.length,
          sample: images.slice(0, 3).map(img => ({
            id: img.image_id,
            name: img.name,
            description: img.description
          }))
        },
        servers: {
          count: servers.length,
          sample: servers.slice(0, 3).map(srv => ({
            id: srv.server_id,
            name: srv.name,
            status: srv.status
          }))
        },
        sessions: {
          count: sessions.length,
          sample: sessions.slice(0, 3).map(sess => ({
            id: sess.session_id,
            name: sess.name,
            status: sess.status,
            imageId: sess.image_id
          }))
        },
        config
      }
    })
    
  } catch (error) {
    console.error('❌ Помилка підключення до KasmWeb:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка',
      details: {
        message: error instanceof Error ? error.message : 'Невідома помилка',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
} 