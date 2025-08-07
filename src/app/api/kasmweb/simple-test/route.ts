import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Простий тест підключення до KasmWeb...')
    
    const serverUrl = 'https://172.232.39.97'
    const apiKey = 'dcV08sbYEhM1'
    const apiSecret = 'dl3vOjcoAsvFE65GYIBjOwieFrnRMvz7'
    
    console.log('🔧 Тестуємо підключення до:', serverUrl)
    console.log('🔑 API Key:', apiKey)
    console.log('🔐 API Secret:', apiSecret ? '✅ Налаштований' : '❌ Відсутній')
    
    // Тест 1: Базове підключення
    console.log('📡 Тестуємо базове підключення...')
    const testUrls = [
      `${serverUrl}/api/public/images`,
      `${serverUrl}/api/v1/images`,
      `${serverUrl}/api/images`,
      `${serverUrl}/rest/images`,
      `${serverUrl}/api/public/sessions`,
      `${serverUrl}/api/v1/sessions`,
      `${serverUrl}/api/sessions`,
      `${serverUrl}/rest/sessions`
    ]
    
    const results = []
    
    for (const url of testUrls) {
      try {
        console.log(`🔍 Тестуємо: ${url}`)
        
        // Спробуємо різні заголовки авторизації
        const authHeaders = [
          {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Secret': apiSecret
          },
          {
            'X-API-Key': apiKey,
            'X-API-Secret': apiSecret
          },
          {
            'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
          }
        ]
        
        for (const headers of authHeaders) {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              // @ts-ignore - ігноруємо SSL помилки для самопідписаних сертифікатів
              rejectUnauthorized: false,
              // @ts-ignore
              strictSSL: false
            })
            
            const status = response.status
            const contentType = response.headers.get('content-type') || ''
            
            let body = ''
            try {
              body = await response.text()
            } catch (e) {
              body = 'Не вдалося прочитати відповідь'
            }
            
            results.push({
              url,
              headers: Object.keys(headers),
              status,
              contentType,
              body: body.substring(0, 200) + (body.length > 200 ? '...' : ''),
              success: response.ok
            })
            
            if (response.ok) {
              console.log(`✅ Успіх: ${url} (${status})`)
              break
            } else {
              console.log(`❌ Помилка: ${url} (${status})`)
            }
            
          } catch (error) {
            console.log(`❌ Помилка мережі: ${url}`, error)
            results.push({
              url,
              headers: Object.keys(headers),
              status: 'ERROR',
              contentType: '',
              body: error instanceof Error ? error.message : 'Невідома помилка',
              success: false
            })
          }
        }
        
      } catch (error) {
        console.log(`❌ Загальна помилка для: ${url}`, error)
      }
    }
    
    // Підсумок
    const successfulRequests = results.filter(r => r.success)
    const failedRequests = results.filter(r => !r.success)
    
    return NextResponse.json({
      success: successfulRequests.length > 0,
      message: successfulRequests.length > 0 
        ? `Знайдено ${successfulRequests.length} працюючих endpoints`
        : 'Не знайдено працюючих endpoints',
      summary: {
        total: results.length,
        successful: successfulRequests.length,
        failed: failedRequests.length
      },
      successfulRequests: successfulRequests.slice(0, 3), // Показуємо перші 3
      failedRequests: failedRequests.slice(0, 3), // Показуємо перші 3
      allResults: results
    })
    
  } catch (error) {
    console.error('❌ Помилка тестування:', error)
    
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