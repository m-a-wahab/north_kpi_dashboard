import { useState } from 'react'
import { useUnits } from '../../hooks/useUnits'

function DynamicInputBuilder({ inputs, onChange }) {
  const { units } = useUnits()
  const addInput = () => {
    onChange([...inputs, { id: `input${inputs.length + 1}`, name: '', unit: '' }])
  }

  const removeInput = (index) => {
    onChange(inputs.filter((_, i) => i !== index))
  }

  const updateInput = (index, field, value) => {
    const updated = inputs.map((input, i) => 
      i === index ? { ...input, [field]: value } : input
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">
          المدخلات (Inputs) *
        </label>
        <button
          type="button"
          onClick={addInput}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>إضافة مدخل</span>
        </button>
      </div>

      {inputs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">لا توجد مدخلات. اضغط "إضافة مدخل" لإضافة مدخل جديد</p>
        </div>
      )}

      {inputs.map((input, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#005353] text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  اسم المدخل (input{index + 1})
                </label>
                <input
                  type="text"
                  value={input.name}
                  onChange={(e) => updateInput(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-sm"
                  placeholder={`مثال: جملة الإيرادات المحققة خلال يناير 2025`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  وحدة القياس
                </label>
                <select
                  value={input.unit}
                  onChange={(e) => updateInput(index, 'unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-sm"
                >
                  <option value="">اختر الوحدة</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.nameAr} ({unit.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeInput(index)}
              className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="حذف المدخل"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>ملاحظة:</strong> سيتم استخدام هذه المدخلات في الصيغة الحسابية. 
          المدخل الأول = input1، الثاني = input2، وهكذا...
        </p>
      </div>
    </div>
  )
}

export default DynamicInputBuilder
