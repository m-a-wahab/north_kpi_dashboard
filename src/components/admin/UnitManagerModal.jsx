import { useState } from 'react'
import { useUnits } from '../../hooks/useUnits'

function UnitManagerModal({ onClose }) {
  const { units, addUnit, updateUnit, deleteUnit, resetToDefault } = useUnits()
  
  const [editingUnit, setEditingUnit] = useState(null)
  const [formData, setFormData] = useState({ name: '', nameAr: '' })
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    setEditingUnit(null)
    setFormData({ name: '', nameAr: '' })
    setShowForm(true)
  }

  const handleEdit = (unit) => {
    setEditingUnit(unit)
    setFormData({ name: unit.name, nameAr: unit.nameAr })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.nameAr.trim()) {
      alert('يجب إدخال اسم الوحدة بالعربي والإنجليزي')
      return
    }

    if (editingUnit) {
      updateUnit(editingUnit.id, formData)
    } else {
      addUnit(formData)
    }
    
    setShowForm(false)
    setFormData({ name: '', nameAr: '' })
    setEditingUnit(null)
  }

  const handleDelete = (unitId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      deleteUnit(unitId)
    }
  }

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من استعادة الوحدات الافتراضية؟')) {
      resetToDefault()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">إدارة وحدات القياس</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Actions */}
          <div className="mb-4 flex gap-3">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة وحدة</span>
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">
                {editingUnit ? 'تعديل الوحدة' : 'إضافة وحدة جديدة'}
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الاسم بالعربي
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                    placeholder="مثال: نسبة مئوية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    الرمز
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                    placeholder="مثال: %"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition"
                >
                  حفظ
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', nameAr: '' })
                    setEditingUnit(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {/* Units List */}
          <div className="space-y-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <span className="font-semibold text-gray-800">{unit.nameAr}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-mono text-gray-600">{unit.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(unit)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnitManagerModal
