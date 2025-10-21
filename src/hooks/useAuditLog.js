import { useState, useEffect } from 'react'
import { getSession } from '../utils/authUtils'

const STORAGE_KEY = 'auditLogs'

export function useAuditLog() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading audit logs:', error)
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  const addLog = (action, details = {}) => {
    const session = getSession()
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userId: session?.userId || null,
      username: session?.username || 'غير معروف',
      action,
      details,
      ipAddress: 'N/A', // In production, get from server
      userAgent: navigator.userAgent
    }
    
    setLogs(prevLogs => [log, ...prevLogs].slice(0, 1000)) // Keep last 1000 logs
    return log
  }

  const getLogs = (filters = {}) => {
    let filtered = [...logs]
    
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId)
    }
    
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action)
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate))
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate))
    }
    
    return filtered
  }

  const clearLogs = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع السجلات؟')) {
      setLogs([])
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    logs,
    addLog,
    getLogs,
    clearLogs,
    exportLogs
  }
}
