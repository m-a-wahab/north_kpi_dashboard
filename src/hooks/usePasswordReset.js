import { useState, useEffect } from 'react'
import { generateToken } from '../utils/authUtils'

const STORAGE_KEY = 'passwordResetTokens'

export function usePasswordReset() {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading reset tokens:', error)
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  }, [tokens])

  // Generate password reset token
  const generateResetToken = (email) => {
    const token = generateToken()
    const resetToken = {
      token,
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      used: false
    }
    
    setTokens(prevTokens => [...prevTokens, resetToken])
    
    // In production, send email with reset link
    console.log(`Password reset link: /reset-password?token=${token}`)
    
    return {
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      token // Remove this in production
    }
  }

  // Verify reset token
  const verifyResetToken = (token) => {
    const resetToken = tokens.find(t => t.token === token && !t.used)
    
    if (!resetToken) {
      return { valid: false, message: 'الرابط غير صالح' }
    }
    
    if (new Date(resetToken.expiresAt) < new Date()) {
      return { valid: false, message: 'انتهت صلاحية الرابط' }
    }
    
    return { valid: true, email: resetToken.email }
  }

  // Mark token as used
  const useToken = (token) => {
    setTokens(prevTokens =>
      prevTokens.map(t =>
        t.token === token ? { ...t, used: true } : t
      )
    )
  }

  // Clean expired tokens
  const cleanExpiredTokens = () => {
    const now = new Date()
    setTokens(prevTokens =>
      prevTokens.filter(t => new Date(t.expiresAt) > now)
    )
  }

  return {
    generateResetToken,
    verifyResetToken,
    useToken,
    cleanExpiredTokens
  }
}
