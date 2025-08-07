import { NextRequest, NextResponse } from 'next/server'
import { kasmWebClient } from '@/lib/kasmWeb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'sessions':
        const sessions = await kasmWebClient.getSessions()
        return NextResponse.json({ success: true, data: sessions })

      case 'images':
        const images = await kasmWebClient.getImages()
        return NextResponse.json({ success: true, data: images })

      case 'servers':
        const servers = await kasmWebClient.getServers()
        return NextResponse.json({ success: true, data: servers })

      default:
        return NextResponse.json(
          { success: false, error: 'Невідома дія' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('KasmWeb API error:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'create_session':
        const { imageId, name, options } = data
        const session = await kasmWebClient.createSession(imageId, name, options)
        return NextResponse.json({ success: true, data: session })

      case 'stop_session':
        const { sessionId: stopSessionId } = data
        await kasmWebClient.stopSession(stopSessionId)
        return NextResponse.json({ success: true })

      case 'delete_session':
        const { sessionId: deleteSessionId } = data
        await kasmWebClient.deleteSession(deleteSessionId)
        return NextResponse.json({ success: true })

      case 'get_session_url':
        const { sessionId: urlSessionId } = data
        const url = await kasmWebClient.getSessionUrl(urlSessionId)
        return NextResponse.json({ success: true, data: { url } })

      default:
        return NextResponse.json(
          { success: false, error: 'Невідома дія' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('KasmWeb API error:', error)
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    )
  }
} 