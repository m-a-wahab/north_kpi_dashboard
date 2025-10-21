import { useState } from 'react'
import { useDynamicDefinitions } from '../../hooks/useDynamicDefinitions'
import { useAuditLog } from '../../hooks/useAuditLog'
import GroupForm from './GroupForm'

function GroupManager() {
  const { definitions, addGroup, updateGroup, deleteGroup, exportDefinitions, resetToDefault } = useDynamicDefinitions()
  const { addLog } = useAuditLog()

  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)

  const handleAddGroup = () => {
    setEditingGroup(null)
    setShowForm(true)
  }

  const handleEditGroup = (group) => {
    setEditingGroup(group)
    setShowForm(true)
  }

  const handleSaveGroup = (groupData) => {
    if (editingGroup) {
      updateGroup(editingGroup.groupId, groupData)
      addLog('GROUP_UPDATED', { groupId: editingGroup.groupId, groupName: groupData.groupName })
    } else {
      const newGroup = addGroup(groupData)
      addLog('GROUP_CREATED', { groupId: newGroup.groupId, groupName: groupData.groupName })
    }
    setShowForm(false)
    setEditingGroup(null)
  }

  const handleDeleteGroup = (groupId) => {
    const group = definitions.find(g => g.groupId === groupId)
    if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟ سيتم حذف جميع المؤشرات المرتبطة بها.')) {
      deleteGroup(groupId)
      addLog('GROUP_DELETED', { groupId, groupName: group?.groupName, indicatorCount: group?.kpis?.length || 0 })
    }
  }

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟ سيتم فقدان جميع التعديلات.')) {
      resetToDefault()
      addLog('DEFINITIONS_RESET', { type: 'groups_and_indicators' })
    }
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة المجموعات</h2>
          <p className="text-gray-600 mt-1">إضافة وتعديل وحذف مجموعات المؤشرات</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportDefinitions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>تصدير</span>
          </button>
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>إضافة مجموعة</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {definitions.map((group) => (
          <div
            key={group.groupId}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{group.groupIcon}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{group.groupName}</h3>
                  <p className="text-sm text-gray-600">{group.groupDescription}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>اللون:</span>
                <div
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: group.groupColor }}
                />
                <span className="font-mono text-xs">{group.groupColor}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span>عدد المؤشرات: </span>
                <span className="font-bold">{group.kpis?.length || 0}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditGroup(group)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDeleteGroup(group.groupId)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Group Form Modal */}
      {showForm && (
        <GroupForm
          group={editingGroup}
          onSave={handleSaveGroup}
          onCancel={() => {
            setShowForm(false)
            setEditingGroup(null)
          }}
        />
      )}
    </div>
  )
}

export default GroupManager
