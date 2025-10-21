import { useState, useEffect } from 'react'
import { hashPassword } from '../utils/authUtils'

const STORAGE_KEY = 'kpiUsers'

// Default admin user (password will be hashed on first use)
const defaultUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // Will be hashed
    fullName: 'المسؤول الرئيسي',
    email: 'admin@example.com',
    role: 'admin', // admin, editor, viewer
    permissions: {
      canManageGroups: true,
      canManageIndicators: true,
      canManageUsers: true,
      canManageUnits: true,
      canViewReports: true,
      canEnterData: true,
      allowedIndicators: [] // Empty means all indicators
    },
    createdAt: new Date().toISOString(),
    isActive: true
  }
]

export function useUsers() {
  // Load users from localStorage or use defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading users:', error)
        return defaultUsers
      }
    }
    return defaultUsers
  })

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }, [users])

  // Get all users
  const getUsers = () => users

  // Get user by id
  const getUserById = (userId) => users.find(u => u.id === userId)

  // Get user by username
  const getUserByUsername = (username) => users.find(u => u.username === username)

  // Add new user
  const addUser = async (userData) => {
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error('اسم المستخدم موجود بالفعل')
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: userData.username,
      password: hashedPassword,
      fullName: userData.fullName,
      email: userData.email || '',
      role: userData.role || 'viewer',
      permissions: userData.permissions || {
        canManageGroups: false,
        canManageIndicators: false,
        canManageUsers: false,
        canManageUnits: false,
        canViewReports: true,
        canEnterData: false,
        allowedIndicators: []
      },
      createdAt: new Date().toISOString(),
      isActive: true
    }
    setUsers([...users, newUser])
    return newUser
  }

  // Update user
  const updateUser = async (userId, updates) => {
    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await hashPassword(updates.password)
    }
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ))
  }

  // Delete user
  const deleteUser = (userId) => {
    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'admin' && u.id !== userId)
    if (admins.length === 0) {
      throw new Error('لا يمكن حذف آخر مسؤول في النظام')
    }
    setUsers(users.filter(u => u.id !== userId))
  }

  // Toggle user active status
  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ))
  }

  // Authenticate user
  const authenticate = (username, password) => {
    const user = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.isActive
    )
    return user || null
  }

  // Check if user has permission
  const hasPermission = (userId, permission) => {
    const user = getUserById(userId)
    if (!user || !user.isActive) return false
    if (user.role === 'admin') return true
    return user.permissions[permission] || false
  }

  // Check if user can access indicator
  const canAccessIndicator = (userId, indicatorId) => {
    const user = getUserById(userId)
    if (!user || !user.isActive) return false
    if (user.role === 'admin') return true
    
    // If allowedIndicators is empty, user can access all
    if (user.permissions.allowedIndicators.length === 0) {
      return user.permissions.canViewReports || user.permissions.canEnterData
    }
    
    return user.permissions.allowedIndicators.includes(indicatorId)
  }

  // Reset to default
  const resetToDefault = () => {
    setUsers(defaultUsers)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    users,
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    authenticate,
    hasPermission,
    canAccessIndicator,
    resetToDefault
  }
}
