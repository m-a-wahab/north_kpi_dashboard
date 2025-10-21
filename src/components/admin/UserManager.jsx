import { useState } from 'react'
import { useUsers } from '../../hooks/useUsers'
import { useAuditLog } from '../../hooks/useAuditLog'
import UserForm from './UserForm'

function UserManager() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, resetToDefault } = useUsers()
  const { addLog } = useAuditLog()
  
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filterRole, setFilterRole] = useState('all')

  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData)
        addLog('USER_UPDATED', { 
          userId: editingUser.id, 
          username: userData.username,
          role: userData.role,
          isActive: userData.isActive
        })
      } else {
        const newUser = await addUser(userData)
        addLog('USER_CREATED', { 
          userId: newUser.id, 
          username: userData.username,
          role: userData.role
        })
      }
      setShowForm(false)
      setEditingUser(null)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId)
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        deleteUser(userId)
        addLog('USER_DELETED', { 
          userId, 
          username: user?.username,
          role: user?.role
        })
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const handleToggleStatus = (userId) => {
    const user = users.find(u => u.id === userId)
    toggleUserStatus(userId)
    addLog('USER_STATUS_CHANGED', { 
      userId, 
      username: user?.username,
      newStatus: !user?.isActive ? 'active' : 'inactive'
    })
  }

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من استعادة المستخدمين الافتراضيين؟ سيتم حذف جميع المستخدمين الحاليين.')) {
      resetToDefault()
      addLog('USERS_RESET', { userCount: users.length })
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'مسؤول', color: 'bg-red-100 text-red-800' },
      editor: { label: 'محرر', color: 'bg-blue-100 text-blue-800' },
      viewer: { label: 'مشاهد', color: 'bg-green-100 text-green-800' }
    }
    return badges[role] || badges.viewer
  }

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole)

  return (
    <div>
      {/* Header Actions */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
          <p className="text-gray-600 mt-1">
            إجمالي المستخدمين: <span className="font-bold">{users.length}</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
          >
            <option value="all">جميع الأدوار</option>
            <option value="admin">المسؤولون</option>
            <option value="editor">المحررون</option>
            <option value="viewer">المشاهدون</option>
          </select>

          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>إضافة مستخدم</span>
          </button>

        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الدور</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الصلاحيات</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role)
                const permissionCount = Object.values(user.permissions).filter(v => v === true).length
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-800">{user.fullName}</div>
                        <div className="text-sm text-gray-600">@{user.username}</div>
                        {user.email && (
                          <div className="text-xs text-gray-500">{user.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {user.role === 'admin' ? (
                          <span className="font-medium text-gray-800">جميع الصلاحيات</span>
                        ) : (
                          <>
                            <div>{permissionCount} صلاحية نشطة</div>
                            {user.permissions.allowedIndicators.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {user.permissions.allowedIndicators.length} مؤشر محدد
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {user.isActive ? 'نشط' : 'معطل'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <p className="text-gray-600 text-lg">لا يوجد مستخدمون</p>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}

export default UserManager
