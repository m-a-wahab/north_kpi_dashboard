import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 px-6" dir="rtl">
          <div className="flex justify-between items-center text-sm">
            <p>© 2025 أمانة منطقة الحدود الشمالية - جميع الحقوق محفوظة</p>
            <p className="text-xs text-gray-300">الإصدار 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MainLayout
