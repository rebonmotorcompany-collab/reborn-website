import { prisma } from './db'
import crypto from 'crypto'

export class CaptchaService {
  // Generate random string
  static generateCode(length: number = 5, caseSensitive: boolean = true): string {
    let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing characters like I, 1, O, 0
    if (caseSensitive) {
      chars += 'abcdefghjkmnpqrstuvwxyz'
    }
    
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Generate lightweight SVG distortion
  static generateCaptchaImage(code: string): string {
    const width = 150
    const height = 50
    const fonts = ['Arial', 'Verdana', 'Courier New', 'Georgia', 'Impact']
    const colors = ['#1f2937', '#374151', '#4b5563', '#991b1b', '#065f46', '#1e3a8a']
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
    
    // Solid background to ensure contrast on dark mode
    svg += `<rect width="100%" height="100%" fill="#f8fafc" />`
    
    // Background noise dots
    for (let i = 0; i < 50; i++) {
      const cx = Math.random() * width
      const cy = Math.random() * height
      const r = Math.random() * 2
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#cbd5e1" opacity="0.5" />`
    }
    
    // Background noise lines
    for (let i = 0; i < 5; i++) {
      const x1 = Math.random() * width
      const y1 = Math.random() * height
      const x2 = Math.random() * width
      const y2 = Math.random() * height
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="1" opacity="0.6" />`
    }

    // Text characters with random rotation, position, and font
    const charWidth = width / (code.length + 1)
    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      const font = fonts[Math.floor(Math.random() * fonts.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const fontSize = 24 + Math.random() * 8
      const rotation = -20 + Math.random() * 40
      
      const x = charWidth * (i + 1) - 10 + (Math.random() * 10 - 5)
      const y = height / 2 + fontSize / 3 + (Math.random() * 10 - 5)
      
      svg += `<text x="${x}" y="${y}" font-family="${font}" font-size="${fontSize}" fill="${color}" font-weight="bold" transform="rotate(${rotation} ${x} ${y})">${char}</text>`
    }

    // Foreground noise lines to make OCR harder
    for (let i = 0; i < 3; i++) {
      const x1 = Math.random() * width
      const y1 = Math.random() * height
      const x2 = Math.random() * width
      const y2 = Math.random() * height
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors[Math.floor(Math.random() * colors.length)]}" stroke-width="2" opacity="0.4" />`
    }

    svg += '</svg>'
    
    // Return base64 encoded data URI
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }

  static async getSettings() {
    const settings = await prisma.setting.findMany({
      where: { key: { startsWith: 'captcha_' } }
    })
    
    const config: Record<string, any> = {
      enabled: true,
      loginOnly: false,
      length: 5,
      expirationMinutes: 5,
      maxRetries: 5,
      caseSensitive: true
    }

    settings.forEach(s => {
      if (s.key === 'captcha_enabled') config.enabled = s.value === 'true'
      if (s.key === 'captcha_login_only') config.loginOnly = s.value === 'true'
      if (s.key === 'captcha_length') config.length = parseInt(s.value || '5', 10)
      if (s.key === 'captcha_expiration_minutes') config.expirationMinutes = parseInt(s.value || '5', 10)
      if (s.key === 'captcha_max_retries') config.maxRetries = parseInt(s.value || '5', 10)
      if (s.key === 'captcha_case_sensitive') config.caseSensitive = s.value === 'true'
    })

    return config
  }

  static async createSession(ipAddress?: string) {
    const settings = await this.getSettings()
    
    if (!settings.enabled) {
      return null;
    }

    // Check lockout
    if (ipAddress) {
      const lockout = await prisma.captchaLockout.findUnique({ where: { identifier: ipAddress } })
      if (lockout && lockout.lockedUntil && lockout.lockedUntil > new Date()) {
        throw new Error(`Too many failed attempts. Try again later.`)
      }
    }

    const code = this.generateCode(settings.length, settings.caseSensitive)
    const image = this.generateCaptchaImage(code)
    
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + settings.expirationMinutes)

    const session = await prisma.captchaSession.create({
      data: {
        code, 
        expiresAt,
        ipAddress: ipAddress || 'unknown',
      }
    })

    return {
      token: session.id,
      image
    }
  }

  static async validate(token: string, userInput: string, moduleKey: string = 'general', ipAddress?: string): Promise<{ success: boolean; message?: string }> {
    const settings = await this.getSettings()
    
    if (!settings.enabled) {
      return { success: true }
    }

    if (settings.loginOnly && moduleKey !== 'login') {
      return { success: true }
    }
    
    if (!token || !userInput) {
      return { success: false, message: 'CAPTCHA is required' }
    }

    // Check Lockout
    let lockout = null;
    if (ipAddress) {
      lockout = await prisma.captchaLockout.findUnique({ where: { identifier: ipAddress } })
      if (lockout && lockout.lockedUntil && lockout.lockedUntil > new Date()) {
        return { success: false, message: 'Too many failed attempts. Try again later.' }
      }
    }

    const session = await prisma.captchaSession.findUnique({ where: { id: token } })

    if (!session) {
      return { success: false, message: 'Invalid CAPTCHA session' }
    }

    if (session.isUsed) {
      return { success: false, message: 'CAPTCHA already used' }
    }

    if (session.expiresAt < new Date()) {
      return { success: false, message: 'CAPTCHA expired' }
    }

    // Mark as used immediately
    await prisma.captchaSession.update({
      where: { id: token },
      data: { isUsed: true }
    })

    // Compare
    const actualCode = settings.caseSensitive ? session.code : session.code.toLowerCase()
    const providedCode = settings.caseSensitive ? userInput : userInput.toLowerCase()

    if (actualCode !== providedCode) {
      // Handle failure
      if (ipAddress) {
        if (!lockout) {
          lockout = await prisma.captchaLockout.create({ data: { identifier: ipAddress, attempts: 1 } })
        } else {
          const newAttempts = lockout.attempts + 1
          const updateData: any = { attempts: newAttempts }
          
          if (newAttempts >= settings.maxRetries) {
            const lockedUntil = new Date()
            lockedUntil.setMinutes(lockedUntil.getMinutes() + 15) // Lock for 15 mins
            updateData.lockedUntil = lockedUntil
            updateData.attempts = 0 // reset after locking
          }
          
          await prisma.captchaLockout.update({
            where: { id: lockout.id },
            data: updateData
          })
        }
      }

      await prisma.activityLog.create({
        data: {
          action: 'OTHER',
          entity: 'Captcha',
          description: `CAPTCHA validation failed for module: ${moduleKey}`,
          ipAddress: ipAddress || 'unknown'
        }
      })

      return { success: false, message: 'Incorrect CAPTCHA code' }
    }

    // Success - reset lockouts
    if (ipAddress && lockout) {
      await prisma.captchaLockout.update({
        where: { id: lockout.id },
        data: { attempts: 0, lockedUntil: null }
      })
    }

    await prisma.activityLog.create({
      data: {
        action: 'OTHER',
        entity: 'Captcha',
        description: `CAPTCHA validation succeeded for module: ${moduleKey}`,
        ipAddress: ipAddress || 'unknown'
      }
    })

    return { success: true }
  }
}
