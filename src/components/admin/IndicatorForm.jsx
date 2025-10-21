import { useState } from 'react'
import { useDynamicDefinitions } from '../../hooks/useDynamicDefinitions'
import { useUnits } from '../../hooks/useUnits'
import DynamicInputBuilder from './DynamicInputBuilder'
import FormulaBuilder from './FormulaBuilder'
import UnitManagerModal from './UnitManagerModal'
import { formulaEngine } from '../../utils/formulaEngine'

function IndicatorForm({ indicator, groupId, onSave, onCancel }) {
  const { definitions } = useDynamicDefinitions()
  const { units } = useUnits()
  const [showUnitManager, setShowUnitManager] = useState(false)

  const [formData, setFormData] = useState({
    name: indicator?.name || '',
    definition: indicator?.definition || '',
    unit: indicator?.unit || '%',
    inputs: indicator?.inputs || [
      { id: 'input1', name: 'المدخل الأول', unit: '' },
      { id: 'input2', name: 'المدخل الثاني', unit: '' }
    ],
    formulaString: indicator?.formulaString || '(input1 / input2) * 100',
    selectedGroupId: groupId || (definitions.length > 0 ? definitions[0].groupId : null)
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'اسم المؤشر مطلوب'
    if (!formData.definition.trim()) newErrors.definition = 'تعريف المؤشر مطلوب'
    if (!formData.unit.trim()) newErrors.unit = 'وحدة القياس مطلوبة'
    if (!formData.selectedGroupId) newErrors.group = 'يجب اختيار مجموعة'
    if (formData.inputs.length === 0) newErrors.inputs = 'يجب إضافة مدخل واحد على الأقل'
    if (!formData.formulaString.trim()) newErrors.formula = 'الصيغة الحسابية مطلوبة'
    
    // Validate formula
    const validation = formulaEngine.validateFormula(formData.formulaString, formData.inputs.length)
    if (!validation.valid) {
      newErrors.formula = validation.errors.join(', ')
    }

    // Check if all inputs have names
    const emptyInputs = formData.inputs.some(input => !input.name.trim())
    if (emptyInputs) {
      newErrors.inputs = 'جميع المدخلات يجب أن تحتوي على اسم'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Create formula function from string
    const formulaFunction = (...args) => {
      return formulaEngine.evaluate(formData.formulaString, args)
    }

    const indicatorData = {
      name: formData.name,
      definition: formData.definition,
      unit: formData.unit,
      inputs: formData.inputs,
      formulaString: formData.formulaString,
      formula: formulaFunction
    }

    onSave(formData.selectedGroupId, indicatorData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {indicator ? 'تعديل المؤشر' : 'إضافة مؤشر جديد'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Group Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              المجموعة *
            </label>
            <select
              value={formData.selectedGroupId || ''}
              onChange={(e) => setFormData({ ...formData, selectedGroupId: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            >
              <option value="">اختر المجموعة</option>
              {definitions.map((group) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupIcon} {group.groupName}
                </option>
              ))}
            </select>
            {errors.group && <p className="text-red-600 text-sm mt-1">{errors.group}</p>}
          </div>

          {/* Indicator Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              اسم المؤشر *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              placeholder="مثال: نسبة تحقيق الإيرادات المفوترة"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Indicator Definition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تعريف المؤشر *
            </label>
            <textarea
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              placeholder="وصف تفصيلي للمؤشر"
              rows={2}
            />
            {errors.definition && <p className="text-red-600 text-sm mt-1">{errors.definition}</p>}
          </div>

          {/* Unit */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                وحدة القياس *
              </label>
              <button
                type="button"
                onClick={() => setShowUnitManager(true)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>إدارة الوحدات</span>
              </button>
            </div>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            >
              <option value="">اختر وحدة القياس</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.nameAr} ({unit.name})
                </option>
              ))}
            </select>
            {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit}</p>}
          </div>

          {/* Dynamic Inputs */}
          <DynamicInputBuilder
            inputs={formData.inputs}
            onChange={(inputs) => setFormData({ ...formData, inputs })}
          />
          {errors.inputs && <p className="text-red-600 text-sm mt-1">{errors.inputs}</p>}

          {/* Formula Builder */}
          <FormulaBuilder
            formula={formData.formulaString}
            inputCount={formData.inputs.length}
            onChange={(formula) => setFormData({ ...formData, formulaString: formula })}
          />
          {errors.formula && <p className="text-red-600 text-sm mt-1">{errors.formula}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t -mx-6 px-6 py-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition font-semibold"
            >
              {indicator ? 'حفظ التعديلات' : 'إضافة المؤشر'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      {/* Unit Manager Modal */}
      {showUnitManager && (
        <UnitManagerModal onClose={() => setShowUnitManager(false)} />
      )}
    </div>
  )
}

export default IndicatorForm
