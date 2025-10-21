// Simple password hashing utility (client-side)
// Note: In production, use bcrypt on the server side
export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const verifyPassword = async (password, hashedPassword) => {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

// Generate random token
export const generateToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// JWT-like token (simplified for client-side)
export const createSession = (user) => {
  const token = generateToken()
  const session = {
    token,
    userId: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }
  
  localStorage.setItem('authSession', JSON.stringify(session))
  return session
}

export const getSession = () => {
  const sessionData = localStorage.getItem('authSession')
  if (!sessionData) return null
  
  try {
    const session = JSON.parse(sessionData)
    
    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      clearSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error parsing session:', error)
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem('authSession')
}

export const isAuthenticated = () => {
  return getSession() !== null
}

export const hasPermission = (permission) => {
  const session = getSession()
  if (!session) return false
  if (session.role === 'admin') return true
  return session.permissions[permission] || false
}

export const canAccessIndicator = (indicatorId) => {
  const session = getSession()
  if (!session) return false
  if (session.role === 'admin') return true
  
  // Empty array means access to all
  if (session.permissions.allowedIndicators.length === 0) {
    return session.permissions.canViewReports || session.permissions.canEnterData
  }
  
  return session.permissions.allowedIndicators.includes(indicatorId)
}
