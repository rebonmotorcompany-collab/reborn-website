'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'

interface CaptchaProps {
  moduleKey?: string
}

export default function Captcha({ moduleKey = 'general' }: CaptchaProps) {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [token, setToken] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCaptcha = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/security-check?t=${moduleKey}`, {
        cache: 'no-store'
      })
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        setError(`Server returned HTML or invalid JSON (Status: ${res.status})`)
        setLoading(false)
        return
      }

      if (!res.ok) {
        if (res.status === 403 || res.status === 429) {
          setError(data.error || 'Too many attempts. Locked out.')
          setEnabled(false) // Disable interaction while locked
        } else {
          setError(data.details ? `Server Error: ${data.details}` : 'Failed to load CAPTCHA')
        }
        setLoading(false)
        return
      }

      if (data.enabled === false) {
        setEnabled(false)
        setLoading(false)
        return
      }

      setToken(data.token)
      setImage(data.image)
      setEnabled(true)
    } catch (err) {
      console.error(err)
      setError('Failed to load CAPTCHA')
    } finally {
      setLoading(false)
    }
  }, [moduleKey])

  useEffect(() => {
    fetchCaptcha()
  }, [fetchCaptcha])

  if (!enabled && !error) {
    return null // Render nothing if disabled in settings
  }

  return (
    <div className="flex flex-col space-y-3 mt-4 mb-4">
      <label htmlFor="captchaCode" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Security Verification
      </label>
      
      {error ? (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-[150px] h-[50px] flex items-center justify-center">
              {loading ? (
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img src={image} alt="CAPTCHA" className="w-full h-full object-cover" />
              )}
            </div>
            
            <button
              type="button"
              onClick={fetchCaptcha}
              disabled={loading}
              className="p-2 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
              title="Refresh CAPTCHA"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <input type="hidden" name="captchaToken" value={token} />
          
          <input
            type="text"
            id="captchaCode"
            name="captchaCode"
            placeholder="Enter the code shown above"
            required
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white sm:text-sm transition-colors"
          />
        </>
      )}
    </div>
  )
}
