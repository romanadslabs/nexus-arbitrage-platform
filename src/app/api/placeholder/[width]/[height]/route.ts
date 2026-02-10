import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ width: string; height: string }> }
) {
  const params = await props.params
  const width = Number.parseInt(params.width, 10) || 32
  const height = Number.parseInt(params.height, 10) || 32
  const label = `${width}x${height}`
  const fontSize = Math.max(10, Math.floor(Math.min(width, height) / 3))

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#E5E7EB" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6B7280"
        font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}">${label}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=86400'
    }
  })
} 