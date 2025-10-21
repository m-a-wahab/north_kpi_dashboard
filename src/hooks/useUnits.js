import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kpiUnits'

// Default units
const defaultUnits = [
  { id: 1, name: '%', nameAr: 'نسبة مئوية' },
  { id: 2, name: 'ريال', nameAr: 'ريال سعودي' },
  { id: 3, name: 'عدد', nameAr: 'عدد' },
  { id: 4, name: 'يوم', nameAr: 'يوم' },
  { id: 5, name: 'ساعة', nameAr: 'ساعة' },
  { id: 6, name: 'كم', nameAr: 'كيلومتر' },
  { id: 7, name: 'متر', nameAr: 'متر' },
  { id: 8, name: 'كجم', nameAr: 'كيلوجرام' },
]

export function useUnits() {
  // Load units from localStorage or use defaults
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading units:', error)
        return defaultUnits
      }
    }
    return defaultUnits
  })

  // Save to localStorage whenever units change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units))
  }, [units])

  // Get all units
  const getUnits = () => units

  // Add new unit
  const addUnit = (unitData) => {
    const newUnit = {
      id: units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1,
      name: unitData.name,
      nameAr: unitData.nameAr
    }
    setUnits([...units, newUnit])
    return newUnit
  }

  // Update unit
  const updateUnit = (unitId, updates) => {
    setUnits(units.map(u => 
      u.id === unitId ? { ...u, ...updates } : u
    ))
  }

  // Delete unit
  const deleteUnit = (unitId) => {
    setUnits(units.filter(u => u.id !== unitId))
  }

  // Reset to defaults
  const resetToDefault = () => {
    setUnits(defaultUnits)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    units,
    getUnits,
    addUnit,
    updateUnit,
    deleteUnit,
    resetToDefault
  }
}
