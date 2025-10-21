import { useState } from 'react'
import { useDynamicDefinitions } from '../../hooks/useDynamicDefinitions'

function UserForm({ user, onSave, onCancel }) {
  const { definitions } = useDynamicDefinitions()
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: user ? '' : '', // Empty for edit, required for new
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'viewer',
    isActive: user?.isActive !== undefined ? user.isActive : true,
    permissions: user?.permissions || {
      canManageGroups: false,
      canManageIndicators: false,
      canManageUsers: false,
      canManageUnits: false,
      canViewReports: true,
      canEnterData: false,
      allowedIndicators: []
    }
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const roles = [
    { value: 'admin', label: 'مسؤول', description: 'صلاحيات كاملة على النظام' },
    { value: 'editor', label: 'محرر', description: 'يمكنه إدارة البيانات والمؤشرات' },
    { value: 'viewer', label: 'مشاهد', description: 'يمكنه عرض التقارير فقط' }
  ]

  const handleRoleChange = (role) => {
    let permissions = { ...formData.permissions }
    
    if (role === 'admin') {
      permissions = {
        canManageGroups: true,
        canManageIndicators: true,
        canManageUsers: true,
        canManageUnits: true,
        canViewReports: true,
        canEnterData: true,
        allowedIndicators: []
      }
    } else if (role === 'editor') {
      permissions = {
        canManageGroups: false,
        canManageIndicators: true,
        canManageUsers: false,
        canManageUnits: false,
        canViewReports: true,
        canEnterData: true,
        allowedIndicators: []
      }
    } else if (role === 'viewer') {
      permissions = {
        canManageGroups: false,
        canManageIndicators: false,
        canManageUsers: false,
        canManageUnits: false,
        canViewReports: true,
        canEnterData: false,
        allowedIndicators: []
      }
    }
    
    setFormData({ ...formData, role, permissions })
  }

  const handlePermissionToggle = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission]
      }
    })
  }

  const handleIndicatorToggle = (indicatorId) => {
    const allowedIndicators = [...formData.permissions.allowedIndicators]
    const index = allowedIndicators.indexOf(indicatorId)
    
    if (index > -1) {
      allowedIndicators.splice(index, 1)
    } else {
      allowedIndicators.push(indicatorId)
    }
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        allowedIndicators
      }
    })
  }

  const handleGroupToggle = (groupId) => {
    const group = definitions.find(g => g.groupId === groupId)
    if (!group || !group.kpis) return

    const groupIndicatorIds = group.kpis.map(kpi => kpi.id)
    const allowedIndicators = [...formData.permissions.allowedIndicators]
    
    // Check if all indicators in this group are already selected
    const allSelected = groupIndicatorIds.every(id => allowedIndicators.includes(id))
    
    if (allSelected) {
      // Remove all indicators from this group
      const filtered = allowedIndicators.filter(id => !groupIndicatorIds.includes(id))
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          allowedIndicators: filtered
        }
      })
    } else {
      // Add all indicators from this group
      const combined = [...new Set([...allowedIndicators, ...groupIndicatorIds])]
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          allowedIndicators: combined
        }
      })
    }
  }

  const handleSelectAllIndicators = () => {
    // Get all indicator IDs from all groups
    const allIndicatorIds = definitions.flatMap(group => 
      (group.kpis || []).map(kpi => kpi.id)
    )
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        allowedIndicators: allIndicatorIds
      }
    })
  }

  const handleClearAllIndicators = () => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        allowedIndicators: []
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = 'اسم المستخدم مطلوب'
    if (!user && !formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة'
    if (formData.password && formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const userData = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
      permissions: formData.permissions
    }

    // Only include password if it's provided
    if (formData.password) {
      userData.password = formData.password
    }

    onSave(userData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">المعلومات الأساسية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم المستخدم *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                  placeholder="username"
                  disabled={!!user} // Can't change username when editing
                />
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {user ? 'كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)' : 'كلمة المرور *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                  placeholder="أحمد محمد"
                />
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Active Status */}
            {user && (
              <div className="mt-4">
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <div>
                    <span className="font-medium">المستخدم نشط</span>
                    <p className="text-sm text-gray-600">إذا كان غير نشط، لن يتمكن من تسجيل الدخول</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">الدور الوظيفي</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleChange(role.value)}
                  className={`p-4 rounded-lg border-2 transition text-right ${
                    formData.role === role.value
                      ? 'border-[#005353] bg-[#005353] text-white'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{role.label}</div>
                  <div className={`text-sm ${formData.role === role.value ? 'text-gray-100' : 'text-gray-600'}`}>
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Permissions */}
          {formData.role !== 'admin' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">الصلاحيات المخصصة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canManageGroups}
                    onChange={() => handlePermissionToggle('canManageGroups')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">إدارة المجموعات</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canManageIndicators}
                    onChange={() => handlePermissionToggle('canManageIndicators')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">إدارة المؤشرات</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canManageUsers}
                    onChange={() => handlePermissionToggle('canManageUsers')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">إدارة المستخدمين</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canManageUnits}
                    onChange={() => handlePermissionToggle('canManageUnits')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">إدارة الوحدات</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canViewReports}
                    onChange={() => handlePermissionToggle('canViewReports')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">عرض التقارير</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.permissions.canEnterData}
                    onChange={() => handlePermissionToggle('canEnterData')}
                    className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                  />
                  <span className="font-medium">إدخال البيانات</span>
                </label>
              </div>
            </div>
          )}

          {/* Indicator Access */}
          {formData.role !== 'admin' && (formData.permissions.canViewReports || formData.permissions.canEnterData) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">الوصول إلى المؤشرات</h3>
              <p className="text-sm text-gray-600 mb-3">
                {formData.permissions.allowedIndicators.length === 0 
                  ? 'المستخدم لديه وصول لجميع المؤشرات' 
                  : `المستخدم لديه وصول لـ ${formData.permissions.allowedIndicators.length} مؤشر`}
              </p>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {definitions.map((group) => {
                  const groupIndicatorIds = group.kpis?.map(kpi => kpi.id) || []
                  const allGroupSelected = groupIndicatorIds.length > 0 && 
                    groupIndicatorIds.every(id => formData.permissions.allowedIndicators.includes(id))
                  const someGroupSelected = groupIndicatorIds.some(id => formData.permissions.allowedIndicators.includes(id))
                  
                  return (
                    <div key={group.groupId} className="bg-white rounded-lg p-3 border border-gray-200">
                      {/* Group Header with Checkbox */}
                      <label className="font-semibold text-gray-800 mb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={allGroupSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someGroupSelected && !allGroupSelected
                          }}
                          onChange={() => handleGroupToggle(group.groupId)}
                          className="w-5 h-5 text-[#005353] rounded focus:ring-[#005353]"
                        />
                        <span>{group.groupIcon}</span>
                        <span>{group.groupName}</span>
                        <span className="text-xs text-gray-500">
                          ({group.kpis?.length || 0} مؤشر)
                        </span>
                      </label>
                      
                      {/* Individual Indicators */}
                      <div className="space-y-1 mr-8">
                        {group.kpis?.map((kpi) => (
                          <label key={kpi.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissions.allowedIndicators.includes(kpi.id)}
                              onChange={() => handleIndicatorToggle(kpi.id)}
                              className="w-4 h-4 text-[#005353] rounded focus:ring-[#005353]"
                            />
                            <span className="text-sm">{kpi.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllIndicators}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>تحديد جميع المؤشرات</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAllIndicators}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>إلغاء تحديد الكل</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition font-semibold"
            >
              {user ? 'حفظ التعديلات' : 'إضافة المستخدم'}
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

export default UserForm
