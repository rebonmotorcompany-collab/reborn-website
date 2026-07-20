import { NextResponse } from 'next/server'
import { CaptchaService } from '@/lib/captcha'

export async function GET(request: Request) {
  try {
    // Basic IP detection from headers
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Clean IP if it contains multiple
    const ipAddress = ip.split(',')[0].trim()

    const session = await CaptchaService.createSession(ipAddress)

    if (!session) {
      // Captcha is disabled
      return NextResponse.json({ enabled: false })
    }

    return NextResponse.json({
      enabled: true,
      token: session.token,
      image: session.image
    })
  } catch (error: any) {
    if (error.message && error.message.includes('Too many failed attempts')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 } // Use 403 instead of 429 to avoid Hostinger/Cloudflare HTML interception
      )
    }

    console.error('Failed to generate CAPTCHA:', error)
    return NextResponse.json(
      { error: 'Failed to generate CAPTCHA', details: error.message || String(error) },
      { status: 500 }
    )
  }
}
