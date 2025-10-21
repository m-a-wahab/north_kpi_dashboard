import { createContext, useContext, useState, useEffect } from 'react'
import { kpiDefinitions as staticDefinitions, months } from '../data/kpiDefinitions'
import { kpiGroups as legacyData } from '../data/mockData'
import { formulaEngine } from '../utils/formulaEngine'

const EnhancedDataContext = createContext()

// Load dynamic definitions from localStorage or use static
const loadKpiDefinitions = () => {
  const saved = localStorage.getItem('dynamicKpiDefinitions')
  console.log('Loading KPI definitions from localStorage:', saved ? 'Found' : 'Not found')
  
  if (saved) {
    try {
      const definitions = JSON.parse(saved)
      console.log('Parsed definitions:', definitions)
      
      // Recreate formula functions from formulaString
      const processedDefinitions = definitions.map(group => ({
        ...group,
        kpis: group.kpis.map(kpi => {
          console.log('Processing KPI:', kpi.name, 'Formula string:', kpi.formulaString)
          
          const formula = kpi.formulaString 
            ? (...args) => {
                console.log('Executing formula for', kpi.name, 'with args:', args)
                return formulaEngine.evaluate(kpi.formulaString, args)
              }
            : null
          
          return {
            ...kpi,
            formula
          }
        })
      }))
      
      console.log('Processed definitions:', processedDefinitions)
      return processedDefinitions
    } catch (error) {
      console.error('Error loading dynamic definitions:', error)
      return staticDefinitions
    }
  }
  
  console.log('Using static definitions')
  return staticDefinitions
}

export const useEnhancedData = () => {
  const context = useContext(EnhancedDataContext)
  if (!context) {
    throw new Error('useEnhancedData must be used within EnhancedDataProvider')
  }
  return context
}

export const EnhancedDataProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState('2025')
  const [availableYears, setAvailableYears] = useState(['2024', '2025'])
  const [kpiDefinitions, setKpiDefinitions] = useState(loadKpiDefinitions())
  
  // Input data structure: { year: { groupId: { kpiId: { inputId: { monthIndex: value } } } } }
  const [inputData, setInputData] = useState(() => {
    const saved = localStorage.getItem('kpiInputData')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize with empty structure
    return {
      '2025': {},
      '2024': {}
    }
  })

  // Reload definitions when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setKpiDefinitions(loadKpiDefinitions())
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event for same-tab updates
    window.addEventListener('kpiDefinitionsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('kpiDefinitionsUpdated', handleStorageChange)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('kpiInputData', JSON.stringify(inputData))
  }, [inputData])

  // Calculate KPI value from inputs
  const calculateKpiValue = (groupId, kpiId, monthIndex, year = currentYear) => {
    const definition = kpiDefinitions
      .find(g => g.groupId === groupId)
      ?.kpis.find(k => k.id === kpiId)
    
    if (!definition) {
      return null
    }

    const yearData = inputData[year]
    if (!yearData || !yearData[groupId] || !yearData[groupId][kpiId]) {
      return null
    }

    const kpiInputs = yearData[groupId][kpiId]
    const inputValues = definition.inputs.map(input => {
      const inputMonthData = kpiInputs[input.id]
      return inputMonthData ? inputMonthData[monthIndex] : null
    })

    // Check if all inputs are available
    if (inputValues.some(v => v === null || v === undefined)) {
      return null
    }

    try {
      // Use formula if available, otherwise use default formula (input1 / input2) * 100
      let result
      
      if (definition.formula) {
        result = definition.formula(...inputValues)
      } else if (definition.formulaString) {
        // If formulaString exists but formula function doesn't, evaluate it
        result = formulaEngine.evaluate(definition.formulaString, inputValues)
      } else {
        // Use default formula: (input1 / input2) * 100
        if (inputValues.length >= 2) {
          result = (inputValues[0] / inputValues[1]) * 100
        } else {
          return null
        }
      }
      
      return result
    } catch (error) {
      console.error('Error calculating KPI:', error)
      return null
    }
  }

  // Get all calculated values for a KPI
  const getCalculatedValues = (groupId, kpiId, year = currentYear) => {
    return months.map((_, index) => calculateKpiValue(groupId, kpiId, index, year))
  }

  // Update input value
  const updateInputValue = (year, groupId, kpiId, inputId, monthIndex, value) => {
    console.log('Update input:', { year, groupId, kpiId, inputId, monthIndex, value })
    setInputData(prev => {
      const newData = { ...prev }
      
      // Initialize nested structure if needed
      if (!newData[year]) newData[year] = {}
      if (!newData[year][groupId]) newData[year][groupId] = {}
      if (!newData[year][groupId][kpiId]) newData[year][groupId][kpiId] = {}
      if (!newData[year][groupId][kpiId][inputId]) newData[year][groupId][kpiId][inputId] = {}
      
      // Set the value
      const parsedValue = value === '' || value === null ? null : parseFloat(value)
      newData[year][groupId][kpiId][inputId][monthIndex] = parsedValue
      
      console.log('Updated data structure:', newData[year][groupId][kpiId])
      
      return newData
    })
  }

  // Get input value
  const getInputValue = (year, groupId, kpiId, inputId, monthIndex) => {
    return inputData[year]?.[groupId]?.[kpiId]?.[inputId]?.[monthIndex] ?? null
  }

  // For charts: always use mockData (no calculations)
  const getKpiGroupsForCharts = () => {
    // Return mockData as-is for charts
    return legacyData
  }

  // Add new year
  const addYear = (year) => {
    if (!availableYears.includes(year)) {
      setAvailableYears(prev => [...prev, year].sort())
      setInputData(prev => ({
        ...prev,
        [year]: {}
      }))
    }
  }

  // Export data
  // const exportData = () => {
  //   const dataStr = JSON.stringify({
  //     inputData,
  //     availableYears,
  //     currentYear,
  //     exportDate: new Date().toISOString()
  //   }, null, 2)
  //   const dataBlob = new Blob([dataStr], { type: 'application/json' })
  //   const url = URL.createObjectURL(dataBlob)
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.download = `kpi-input-data-${new Date().toISOString().split('T')[0]}.json`
  //   link.click()
  //   URL.revokeObjectURL(url)
  // }

  // Import data
  // const importData = (jsonData) => {
  //   try {
  //     const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
  //     if (parsed.inputData) setInputData(parsed.inputData)
  //     if (parsed.availableYears) setAvailableYears(parsed.availableYears)
  //     if (parsed.currentYear) setCurrentYear(parsed.currentYear)
  //     return { success: true }
  //   } catch (error) {
  //     return { success: false, error: error.message }
  //   }
  // }

  // Reset data
  // const resetData = () => {
  //   setInputData({ '2025': {}, '2024': {} })
  //   setCurrentYear('2025')
  //   setAvailableYears(['2024', '2025'])
  //   localStorage.removeItem('kpiInputData')
  // }

  const value = {
    currentYear,
    setCurrentYear,
    availableYears,
    addYear,
    inputData,
    updateInputValue,
    getInputValue,
    calculateKpiValue,
    getCalculatedValues,
    kpiGroups: getKpiGroupsForCharts(), // Always use mockData for charts
    kpiDefinitions, // Use dynamic definitions from state
    months,
    // exportData,
    // importData,
    // resetData
  }

  return <EnhancedDataContext.Provider value={value}>{children}</EnhancedDataContext.Provider>
}
