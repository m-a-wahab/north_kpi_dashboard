import { createContext, useContext, useState, useEffect } from 'react'
import { kpiGroups as initialData } from '../data/mockData'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // Initialize state from localStorage or use mock data
  const [kpiGroups, setKpiGroups] = useState(() => {
    const savedData = localStorage.getItem('kpiData')
    return savedData ? JSON.parse(savedData) : initialData
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('kpiData', JSON.stringify(kpiGroups))
  }, [kpiGroups])

  // Update a specific KPI's values
  const updateKpiValues = (groupId, kpiId, newValues) => {
    setKpiGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId
          ? {
              ...group,
              kpis: group.kpis.map(kpi =>
                kpi.id === kpiId
                  ? { ...kpi, values: newValues }
                  : kpi
              )
            }
          : group
      )
    )
  }

  // Update multi-dataset KPI
  const updateMultiDatasetKpi = (groupId, kpiId, datasetIndex, newValues) => {
    setKpiGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              kpis: group.kpis.map(kpi =>
                kpi.id === kpiId && kpi.multiDataset
                  ? {
                      ...kpi,
                      datasets: kpi.datasets.map((dataset, idx) =>
                        idx === datasetIndex
                          ? { ...dataset, values: newValues }
                          : dataset
                      )
                    }
                  : kpi
              )
            }
          : group
      )
    )
  }

  // Reset to initial data
  const resetData = () => {
    setKpiGroups(initialData)
    localStorage.removeItem('kpiData')
  }

  // Export data as JSON
  const exportData = () => {
    const dataStr = JSON.stringify(kpiGroups, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kpi-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import data from JSON file
  const importData = (jsonData) => {
    try {
      const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      setKpiGroups(parsedData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    kpiGroups,
    updateKpiValues,
    updateMultiDatasetKpi,
    resetData,
    exportData,
    importData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
