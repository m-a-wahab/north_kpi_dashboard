import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '../../utils/authUtils'
import { useAuditLog } from '../../hooks/useAuditLog'

function Header({ onMenuToggle }) {
  const navigate = useNavigate()
  const { addLog } = useAuditLog()
  const session = getSession()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      addLog('LOGOUT', { username: session?.username })
      clearSession()
      navigate('/login')
    }
  }

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-30" dir="rtl">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Right Side - Menu Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white">لوحة مؤشرات الأداء</h1>
            <p className="text-xs text-gray-100">Performance Indicators Dashboard</p>
          </div>
        </div>

        {/* Left Side - User Actions */}
        <div className="flex items-center gap-3">
          {/* Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Settings Dropdown Menu */}
            {showSettingsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSettingsMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20" dir="rtl">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileModal(true)
                        setShowSettingsMenu(false)
                      }}
                      className="w-full px-4 py-3 text-right hover:bg-gray-50 transition flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">الملف الشخصي</p>
                        <p className="text-xs text-gray-500">عرض معلومات الحساب</p>
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false)
                        handleLogout()
                      }}
                      className="w-full px-4 py-3 text-right hover:bg-red-50 transition flex items-center gap-3 text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <div className="text-right">
                        <p className="text-sm font-semibold">تسجيل الخروج</p>
                        <p className="text-xs text-red-500">الخروج من النظام</p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Info */}
          {session && (
            <div className="flex items-center gap-2 pr-3 border-r border-white/30">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{session.username}</p>
                <p className="text-xs text-gray-100">
                  {session.role === 'admin' ? 'مسؤول' : session.role === 'editor' ? 'محرر' : 'مشاهد'}
                </p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#005353] font-bold">
                {session.username.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()} dir="rtl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#005353] to-[#007373] text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">الملف الشخصي</h2>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#005353] to-[#007373] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {session?.username.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500 font-semibold">اسم المستخدم</label>
                  <p className="text-lg font-bold text-gray-800 mt-1">{session?.username}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500 font-semibold">الصلاحية</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      session?.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : session?.role === 'editor' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {session?.role === 'admin' ? 'مسؤول' : session?.role === 'editor' ? 'محرر' : 'مشاهد'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs text-gray-500 font-semibold">معرف المستخدم</label>
                  <p className="text-lg font-bold text-gray-800 mt-1">#{session?.id}</p>
                </div>

                {session?.role === 'admin' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">صلاحيات المسؤول</p>
                        <p className="text-xs text-blue-600 mt-1">لديك صلاحيات كاملة لإدارة النظام</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false)
                    handleLogout()
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
