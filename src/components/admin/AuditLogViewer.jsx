import { useState } from 'react'
import { useAuditLog } from '../../hooks/useAuditLog'

function AuditLogViewer() {
  const { logs, getLogs, clearLogs, exportLogs } = useAuditLog()
  
  const [filters, setFilters] = useState({
    action: '',
    username: '',
    startDate: '',
    endDate: ''
  })

  const actionTypes = {
    // Authentication
    LOGIN_SUCCESS: { label: 'تسجيل دخول ناجح', color: 'bg-green-100 text-green-800' },
    LOGIN_FAILED: { label: 'فشل تسجيل الدخول', color: 'bg-red-100 text-red-800' },
    LOGOUT: { label: 'تسجيل خروج', color: 'bg-gray-100 text-gray-800' },
    
    // User Management
    USER_CREATED: { label: 'إنشاء مستخدم', color: 'bg-blue-100 text-blue-800' },
    USER_UPDATED: { label: 'تحديث مستخدم', color: 'bg-yellow-100 text-yellow-800' },
    USER_DELETED: { label: 'حذف مستخدم', color: 'bg-red-100 text-red-800' },
    USER_STATUS_CHANGED: { label: 'تغيير حالة مستخدم', color: 'bg-orange-100 text-orange-800' },
    USERS_RESET: { label: 'استعادة المستخدمين الافتراضيين', color: 'bg-purple-100 text-purple-800' },
    
    // Group Management
    GROUP_CREATED: { label: 'إنشاء مجموعة', color: 'bg-blue-100 text-blue-800' },
    GROUP_UPDATED: { label: 'تحديث مجموعة', color: 'bg-yellow-100 text-yellow-800' },
    GROUP_DELETED: { label: 'حذف مجموعة', color: 'bg-red-100 text-red-800' },
    
    // Indicator Management
    INDICATOR_CREATED: { label: 'إنشاء مؤشر', color: 'bg-blue-100 text-blue-800' },
    INDICATOR_UPDATED: { label: 'تحديث مؤشر', color: 'bg-yellow-100 text-yellow-800' },
    INDICATOR_DELETED: { label: 'حذف مؤشر', color: 'bg-red-100 text-red-800' },
    
    // Unit Management
    UNIT_CREATED: { label: 'إنشاء وحدة قياس', color: 'bg-blue-100 text-blue-800' },
    UNIT_UPDATED: { label: 'تحديث وحدة قياس', color: 'bg-yellow-100 text-yellow-800' },
    UNIT_DELETED: { label: 'حذف وحدة قياس', color: 'bg-red-100 text-red-800' },
    UNITS_RESET: { label: 'استعادة الوحدات الافتراضية', color: 'bg-purple-100 text-purple-800' },
    
    // System
    DEFINITIONS_RESET: { label: 'استعادة الإعدادات الافتراضية', color: 'bg-purple-100 text-purple-800' },
    DATA_ENTRY: { label: 'إدخال بيانات', color: 'bg-indigo-100 text-indigo-800' },
    DATA_EXPORT: { label: 'تصدير بيانات', color: 'bg-teal-100 text-teal-800' },
    DATA_IMPORT: { label: 'استيراد بيانات', color: 'bg-cyan-100 text-cyan-800' }
  }

  const filteredLogs = getLogs(filters)

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">سجل التدقيق</h2>
          <p className="text-gray-600 mt-1">
            إجمالي السجلات: <span className="font-bold">{logs.length}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>تصدير</span>
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>مسح الكل</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الإجراء</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            >
              <option value="">جميع الإجراءات</option>
              {Object.keys(actionTypes).map(action => (
                <option key={action} value={action}>{actionTypes[action].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
              placeholder="ابحث باسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التاريخ والوقت</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراء</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const actionInfo = actionTypes[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-800' }
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{log.username}</div>
                      <div className="text-xs text-gray-500">ID: {log.userId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${actionInfo.color}`}>
                        {actionInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.details && Object.keys(log.details).length > 0 && (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-700">عرض التفاصيل</summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <p className="text-gray-600 text-lg">لا توجد سجلات</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogViewer
