import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GroupManager from '../components/admin/GroupManager'
import IndicatorManager from '../components/admin/IndicatorManager'
import UnitManager from '../components/admin/UnitManager'
import UserManager from '../components/admin/UserManager'
import AuditLogViewer from '../components/admin/AuditLogViewer'
import { clearSession, getSession } from '../utils/authUtils'
import { useAuditLog } from '../hooks/useAuditLog'

function AdminPage() {
  const navigate = useNavigate()
  const { addLog } = useAuditLog()
  const session = getSession()
  const [activeTab, setActiveTab] = useState('groups')

  const handleLogout = () => {
    addLog('LOGOUT', { username: session?.username })
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-[#005353] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">لوحة التحكم الإدارية</h1>
              <p className="text-gray-100 mt-1">إدارة المجموعات والمؤشرات</p>
            </div>
            <div className="flex gap-3 items-center">
              {session && (
                <div className="text-white text-sm">
                  <span className="opacity-75">مرحباً،</span> <span className="font-semibold">{session.username}</span>
                </div>
              )}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#005353] rounded-lg hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>العودة للرئيسية</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'groups'
                  ? 'border-[#005353] text-[#005353]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📁</span>
                <span>إدارة المجموعات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('indicators')}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'indicators'
                  ? 'border-[#005353] text-[#005353]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <span>إدارة المؤشرات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'units'
                  ? 'border-[#005353] text-[#005353]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📏</span>
                <span>إدارة الوحدات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-[#005353] text-[#005353]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <span>إدارة المستخدمين</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'audit'
                  ? 'border-[#005353] text-[#005353]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span>سجل التدقيق</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {activeTab === 'groups' && <GroupManager />}
        {activeTab === 'indicators' && <IndicatorManager />}
        {activeTab === 'units' && <UnitManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 أمانة الحدود الشمالية - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  )
}

export default AdminPage
