import { useState } from 'react'

function GroupForm({ group, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    groupName: group?.groupName || '',
    groupDescription: group?.groupDescription || '',
    groupIcon: group?.groupIcon || '📊',
    groupColor: group?.groupColor || '#005353'
  })

  const [errors, setErrors] = useState({})

  const commonIcons = ['📊', '💼', '💵', '🤝', '📋', '🏢', '📈', '💰', '🎯', '⚡', '🔧', '📱']

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.groupName.trim()) newErrors.groupName = 'اسم المجموعة مطلوب'
    if (!formData.groupDescription.trim()) newErrors.groupDescription = 'الوصف مطلوب'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {group ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              اسم المجموعة *
            </label>
            <input
              type="text"
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              placeholder="مثال: المجموعة الأولى: خاصة بالإيرادات"
            />
            {errors.groupName && <p className="text-red-600 text-sm mt-1">{errors.groupName}</p>}
          </div>

          {/* Group Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              وصف المجموعة *
            </label>
            <textarea
              value={formData.groupDescription}
              onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              placeholder="وصف مختصر للمجموعة"
              rows={3}
            />
            {errors.groupDescription && <p className="text-red-600 text-sm mt-1">{errors.groupDescription}</p>}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              أيقونة المجموعة
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, groupIcon: icon })}
                  className={`p-3 text-3xl rounded-lg border-2 transition ${
                    formData.groupIcon === icon
                      ? 'border-[#005353] bg-[#005353] bg-opacity-10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.groupIcon}
              onChange={(e) => setFormData({ ...formData, groupIcon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-center text-2xl"
              placeholder="أو أدخل إيموجي مخصص"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              لون المجموعة
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.groupColor}
                onChange={(e) => setFormData({ ...formData, groupColor: e.target.value })}
                className="w-20 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.groupColor}
                onChange={(e) => setFormData({ ...formData, groupColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent font-mono"
                placeholder="#005353"
              />
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: formData.groupColor }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition font-semibold"
            >
              {group ? 'حفظ التعديلات' : 'إضافة المجموعة'}
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
    </div>
  )
}

export default GroupForm
