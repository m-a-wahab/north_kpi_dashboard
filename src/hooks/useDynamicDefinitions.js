import { useState, useEffect } from 'react'
import { kpiDefinitions as staticDefinitions } from '../data/kpiDefinitions'

const STORAGE_KEY = 'dynamicKpiDefinitions'

export function useDynamicDefinitions() {
  // Load definitions from localStorage or use static as default
  const [definitions, setDefinitions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading definitions:', error)
        return staticDefinitions
      }
    }
    return staticDefinitions
  })

  // Save to localStorage whenever definitions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(definitions))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('kpiDefinitionsUpdated'))
  }, [definitions])

  // Get all groups
  const getGroups = () => definitions

  // Get group by ID
  const getGroup = (groupId) => definitions.find(g => g.groupId === groupId)

  // Add new group
  const addGroup = (group) => {
    const newGroup = {
      groupId: definitions.length > 0 ? Math.max(...definitions.map(g => g.groupId)) + 1 : 1,
      ...group,
      kpis: []
    }
    setDefinitions([...definitions, newGroup])
    return newGroup
  }

  // Update group
  const updateGroup = (groupId, updates) => {
    setDefinitions(definitions.map(g => 
      g.groupId === groupId ? { ...g, ...updates } : g
    ))
  }

  // Delete group
  const deleteGroup = (groupId) => {
    setDefinitions(definitions.filter(g => g.groupId !== groupId))
  }

  // Get indicators for a group
  const getIndicators = (groupId) => {
    const group = getGroup(groupId)
    return group ? group.kpis : []
  }

  // Add indicator to group
  const addIndicator = (groupId, indicator) => {
    // Generate globally unique ID across all groups
    const allIndicatorIds = definitions.flatMap(g => (g.kpis || []).map(k => k.id))
    const newId = allIndicatorIds.length > 0 ? Math.max(...allIndicatorIds) + 1 : 1
    
    setDefinitions(definitions.map(g => {
      if (g.groupId === groupId) {
        return {
          ...g,
          kpis: [...g.kpis, { ...indicator, id: newId }]
        }
      }
      return g
    }))
  }

  // Update indicator
  const updateIndicator = (groupId, indicatorId, updates) => {
    setDefinitions(definitions.map(g => {
      if (g.groupId === groupId) {
        return {
          ...g,
          kpis: g.kpis.map(k => k.id === indicatorId ? { ...k, ...updates } : k)
        }
      }
      return g
    }))
  }

  // Delete indicator
  const deleteIndicator = (groupId, indicatorId) => {
    setDefinitions(definitions.map(g => {
      if (g.groupId === groupId) {
        return {
          ...g,
          kpis: g.kpis.filter(k => k.id !== indicatorId)
        }
      }
      return g
    }))
  }

  // Reset to static definitions
  const resetToDefault = () => {
    setDefinitions(staticDefinitions)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Export definitions as JSON
  const exportDefinitions = () => {
    const dataStr = JSON.stringify(definitions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kpi-definitions-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import definitions from JSON
  const importDefinitions = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData)
      setDefinitions(parsed)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Fix duplicate indicator IDs across groups
  const fixDuplicateIds = () => {
    let nextId = 1
    const fixed = definitions.map(group => ({
      ...group,
      kpis: (group.kpis || []).map(kpi => ({
        ...kpi,
        id: nextId++
      }))
    }))
    setDefinitions(fixed)
    return { success: true, message: `تم إعادة ترقيم ${nextId - 1} مؤشر` }
  }

  return {
    definitions,
    getGroups,
    getGroup,
    addGroup,
    updateGroup,
    deleteGroup,
    getIndicators,
    addIndicator,
    updateIndicator,
    deleteIndicator,
    resetToDefault,
    exportDefinitions,
    importDefinitions,
    fixDuplicateIds
  }
}
