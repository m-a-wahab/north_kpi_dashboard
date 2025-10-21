import { Link, useLocation } from 'react-router-dom'
import { getSession } from '../../utils/authUtils'
import whiteLogo from '../../assets/white_logo.png'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const session = getSession()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      title: 'الرئيسية',
      items: [
        { path: '/dashboard', label: 'لوحة المؤشرات', icon: '🏠' }
      ]
    },
    {
      title: 'المؤشرات والبيانات',
      items: [
        { path: '/data-entry', label: 'إدخال البيانات', icon: '⌨️' }
      ]
    }
  ]

  // Admin menu items (only for admins)
  const adminMenuItems = {
    title: 'لوحة التحكم',
    items: [
      { path: '/admin/groups', label: 'إدارة المجموعات', icon: '📁' },
      { path: '/admin/indicators', label: 'إدارة المؤشرات', icon: '📊' },
      { path: '/admin/units', label: 'إدارة الوحدات', icon: '📏' },
      { path: '/admin/users', label: 'إدارة المستخدمين', icon: '👥' },
      { path: '/admin/audit', label: 'سجل التدقيق', icon: '📋' }
    ]
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto w-72 overflow-y-auto`}
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#005353] to-[#003d3d] text-white p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="w-3/4 mx-auto mb-4">
                <img src={whiteLogo} alt="وكالة الاستثمار والاستدامة المالية" className="w-full h-auto" />
              </div>
              <h2 className="text-base font-bold leading-tight text-center">وكالة الاستثمار والاستدامة المالية</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-[#005353] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Admin Section - Only show if user is admin */}
          {session?.role === 'admin' && (
            <div className="mb-6 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-3">
                {adminMenuItems.title}
              </h3>
              <ul className="space-y-1">
                {adminMenuItems.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-[#005353] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
