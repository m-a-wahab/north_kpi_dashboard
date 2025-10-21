import { useState } from 'react'

function DataEntryModal({ kpi, groupId, onClose, onSave }) {
  const [values, setValues] = useState(
    kpi.multiDataset 
      ? kpi.datasets.map(ds => [...ds.values])
      : [...kpi.values]
  )

  const handleValueChange = (index, value, datasetIndex = null) => {
    if (kpi.multiDataset) {
      const newValues = [...values]
      newValues[datasetIndex][index] = value === '' ? null : parseFloat(value)
      setValues(newValues)
    } else {
      const newValues = [...values]
      newValues[index] = value === '' ? null : parseFloat(value)
      setValues(newValues)
    }
  }

  const handleSave = () => {
    if (kpi.multiDataset) {
      // Save each dataset separately
      values.forEach((datasetValues, datasetIndex) => {
        onSave(groupId, kpi.id, datasetIndex, datasetValues)
      })
    } else {
      onSave(groupId, kpi.id, values)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005353] to-[#007373] text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">{kpi.name}</h2>
            <p className="text-sm text-white/80">{kpi.definition}</p>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-lg transition"
            title="إغلاق"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {kpi.multiDataset ? (
            // Multi-dataset KPI (e.g., customer satisfaction)
            <div className="space-y-8">
              {kpi.datasets.map((dataset, datasetIndex) => (
                <div key={datasetIndex}>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#005353]">
                    {dataset.label}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {kpi.months.map((month, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {month}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={values[datasetIndex][index] === null ? '' : values[datasetIndex][index]}
                            onChange={(e) => handleValueChange(index, e.target.value, datasetIndex)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-right"
                            placeholder="القيمة"
                          />
                          <span className="absolute left-3 top-2.5 text-xs text-gray-500">{kpi.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Single dataset KPI
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {kpi.months.map((month, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {month}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={values[index] === null ? '' : values[index]}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-right"
                      placeholder="القيمة"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-gray-500">{kpi.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#005353] text-white rounded-lg hover:bg-[#007373] transition font-semibold"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataEntryModal
