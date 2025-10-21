import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import CategoriesPage from './pages/CategoriesPage'
import GroupDetailsPage from './pages/GroupDetailsPage'
import DataEntryPage from './pages/DataEntryPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AdminGroupsPage from './pages/admin/AdminGroupsPage'
import AdminIndicatorsPage from './pages/admin/AdminIndicatorsPage'
import AdminUnitsPage from './pages/admin/AdminUnitsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminAuditPage from './pages/admin/AdminAuditPage'

function App() {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Routes - No Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main App Routes - With Layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<CategoriesPage />} />
        <Route path="/group/:groupId" element={<GroupDetailsPage />} />
        <Route path="/data-entry" element={<DataEntryPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/groups" element={<AdminGroupsPage />} />
        <Route path="/admin/indicators" element={<AdminIndicatorsPage />} />
        <Route path="/admin/units" element={<AdminUnitsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/audit" element={<AdminAuditPage />} />
        
        {/* Redirect old admin route */}
        <Route path="/admin" element={<Navigate to="/admin/groups" replace />} />
      </Route>
    </Routes>
  )
}

export default App