import { useState } from 'react'
import { useDynamicDefinitions } from '../../hooks/useDynamicDefinitions'
import { useAuditLog } from '../../hooks/useAuditLog'
import IndicatorForm from './IndicatorForm'

function IndicatorManager() {
  const {
    definitions,
    addIndicator,
    updateIndicator,
    deleteIndicator
  } = useDynamicDefinitions()
  const { addLog } = useAuditLog()

  const [showForm, setShowForm] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState(null)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all')

  const handleAddIndicator = (groupId = null) => {
    setEditingIndicator(null)
    setEditingGroupId(groupId)
    setShowForm(true)
  }

  const handleEditIndicator = (groupId, indicator) => {
    setEditingIndicator(indicator)
    setEditingGroupId(groupId)
    setShowForm(true)
  }

  const handleSaveIndicator = (groupId, indicatorData) => {
    const group = definitions.find(g => g.groupId === groupId)
    if (editingIndicator) {
      updateIndicator(editingGroupId, editingIndicator.id, indicatorData)
      addLog('INDICATOR_UPDATED', { 
        indicatorId: editingIndicator.id, 
        indicatorName: indicatorData.name,
        groupId: editingGroupId,
        groupName: group?.groupName
      })
    } else {
      addIndicator(groupId, indicatorData)
      addLog('INDICATOR_CREATED', { 
        indicatorName: indicatorData.name,
        groupId,
        groupName: group?.groupName
      })
    }
    setShowForm(false)
    setEditingIndicator(null)
    setEditingGroupId(null)
  }

  const handleDeleteIndicator = (groupId, indicatorId) => {
    const group = definitions.find(g => g.groupId === groupId)
    const indicator = group?.kpis?.find(k => k.id === indicatorId)
    if (window.confirm('هل أنت متأكد من حذف هذا المؤشر؟')) {
      deleteIndicator(groupId, indicatorId)
      addLog('INDICATOR_DELETED', { 
        indicatorId, 
        indicatorName: indicator?.name,
        groupId,
        groupName: group?.groupName
      })
    }
  }

  const filteredGroups = selectedGroupFilter === 'all' 
    ? definitions 
    : definitions.filter(g => g.groupId === parseInt(selectedGroupFilter))

  const totalIndicators = definitions.reduce((sum, g) => sum + (g.kpis?.length || 0), 0)

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة المؤشرات</h2>
          <p className="text-gray-600 mt-1">
            إجمالي المؤشرات: <span className="font-bold">{totalIndicators}</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Group Filter */}
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
          >
            <option value="all">جميع المجموعات</option>
            {definitions.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupIcon} {group.groupName}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleAddIndicator()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>إضافة مؤشر</span>
          </button>
        </div>
      </div>

      {/* Groups and Indicators */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.groupId} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Group Header */}
            <div 
              className="p-4 flex items-center justify-between"
              style={{ backgroundColor: `${group.groupColor}15` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{group.groupIcon}</span>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: group.groupColor }}>
                    {group.groupName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {group.kpis?.length || 0} مؤشر
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddIndicator(group.groupId)}
                className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm border border-gray-300 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>إضافة مؤشر</span>
              </button>
            </div>

            {/* Indicators List */}
            {group.kpis && group.kpis.length > 0 ? (
              <div className="divide-y">
                {group.kpis.map((indicator) => (
                  <div key={indicator.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{indicator.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{indicator.definition}</p>
                        
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            الوحدة: {indicator.unit}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            المدخلات: {indicator.inputs?.length || 0}
                          </span>
                          {indicator.formulaString && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono">
                              {indicator.formulaString}
                            </span>
                          )}
                        </div>

                        {/* Show Inputs */}
                        {indicator.inputs && indicator.inputs.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            <strong>المدخلات:</strong>
                            {indicator.inputs.map((input, idx) => (
                              <span key={idx} className="ml-2">
                                {idx + 1}. {input.name} ({input.unit})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditIndicator(group.groupId, indicator)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteIndicator(group.groupId, indicator.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>لا توجد مؤشرات في هذه المجموعة</p>
                <button
                  onClick={() => handleAddIndicator(group.groupId)}
                  className="mt-3 text-sm text-[#005353] hover:underline"
                >
                  إضافة مؤشر الآن
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicator Form Modal */}
      {showForm && (
        <IndicatorForm
          indicator={editingIndicator}
          groupId={editingGroupId}
          onSave={handleSaveIndicator}
          onCancel={() => {
            setShowForm(false)
            setEditingIndicator(null)
            setEditingGroupId(null)
          }}
        />
      )}
    </div>
  )
}

export default IndicatorManager
