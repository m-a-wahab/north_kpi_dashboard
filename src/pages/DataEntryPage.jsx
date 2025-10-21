import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEnhancedData } from '../context/EnhancedDataContext'
import DataEntryInputs from '../components/DataEntryInputs'

function DataEntryPage() {
  const {
    currentYear,
    setCurrentYear,
    availableYears,
    addYear,
    kpiDefinitions,
    months,
    updateInputValue,
    getInputValue,
    calculateKpiValue
  } = useEnhancedData()

  const [expandedGroups, setExpandedGroups] = useState({})
  const [expandedKpis, setExpandedKpis] = useState({})
  const [newYear, setNewYear] = useState('')

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const toggleKpi = (groupId, kpiId) => {
    const key = `${groupId}-${kpiId}`
    setExpandedKpis(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleAddYear = () => {
    if (newYear && !availableYears.includes(newYear)) {
      addYear(newYear)
      setNewYear('')
    }
  }

  const handleInputChange = (groupId, kpiId, inputId, monthIndex, value) => {
    updateInputValue(currentYear, groupId, kpiId, inputId, monthIndex, value)
  }

  return (
    <div>

      {/* Year Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              السنة الحالية
            </label>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              إضافة سنة جديدة
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="مثال: 2025"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              />
              <button
                onClick={handleAddYear}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Groups and KPIs */}
      <div className="space-y-4">
        {kpiDefinitions.map((group) => (
          <div key={group.groupId} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.groupId)}
              className="w-full px-6 py-4 flex items-center justify-between text-white hover:opacity-90 transition"
              style={{ 
                background: `linear-gradient(135deg, ${group.groupColor || '#005353'} 0%, ${group.groupColor ? group.groupColor + 'dd' : '#007373'} 100%)`
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{group.groupIcon}</span>
                <div className="text-right">
                  <h3 className="text-lg font-bold">{group.groupName}</h3>
                  <p className="text-sm text-white/80">{group.kpis?.length || 0} مؤشر</p>
                </div>
              </div>
              <svg
                className={`w-6 h-6 transition-transform ${expandedGroups[group.groupId] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Group Content */}
            {expandedGroups[group.groupId] && (
              <div className="p-6 space-y-4">
                {group.kpis?.map((kpi) => {
                  const kpiKey = `${group.groupId}-${kpi.id}`
                  const isExpanded = expandedKpis[kpiKey]

                  return (
                    <div key={kpi.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* KPI Header */}
                      <button
                        onClick={() => toggleKpi(group.groupId, kpi.id)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3 text-right">
                          <span className="text-xl">📊</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{kpi.name}</h4>
                            {kpi.formula && (
                              <p className="text-xs text-gray-500 mt-1">
                                القيمة الحالية: {calculateKpiValue(currentYear, group.groupId, kpi.id, 0)?.toFixed(2) || 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* KPI Content */}
                      {isExpanded && (
                        <div className="p-4 bg-white">
                          {kpi.inputs && kpi.inputs.length > 0 ? (
                            <DataEntryInputs
                              inputs={kpi.inputs}
                              months={months}
                              currentYear={currentYear}
                              groupId={group.groupId}
                              kpiId={kpi.id}
                              onInputChange={handleInputChange}
                              getInputValue={getInputValue}
                              calculateKpiValue={calculateKpiValue}
                            />
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <p>لا توجد حقول إدخال لهذا المؤشر</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {kpiDefinitions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مؤشرات</h3>
          <p className="text-gray-600 mb-6">يرجى إضافة مجموعات ومؤشرات من لوحة التحكم</p>
          <Link
            to="/admin/indicators"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>إضافة مؤشرات</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default DataEntryPage
