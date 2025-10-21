import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { useAuditLog } from '../hooks/useAuditLog'
import { createSession, verifyPassword } from '../utils/authUtils'
import logo from '../assets/logo.png'

function LoginPage() {
  const navigate = useNavigate()
  const { users } = useUsers()
  const { addLog } = useAuditLog()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Find user
      const user = users.find(u => u.username === formData.username)
      
      if (!user) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
        addLog('LOGIN_FAILED', { username: formData.username, reason: 'User not found' })
        setLoading(false)
        return
      }

      // Check if user is active
      if (!user.isActive) {
        setError('حسابك معطل. يرجى الاتصال بالمسؤول')
        addLog('LOGIN_FAILED', { username: formData.username, reason: 'Account disabled' })
        setLoading(false)
        return
      }

      // Verify password (in production, this should be hashed)
      const isValid = await verifyPassword(formData.password, user.password)
      
      if (!isValid) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
        addLog('LOGIN_FAILED', { username: formData.username, reason: 'Invalid password' })
        setLoading(false)
        return
      }

      // Create session
      createSession(user)
      
      // Log successful login
      addLog('LOGIN_SUCCESS', { username: user.username, role: user.role })

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError('حدث خطأ أثناء تسجيل الدخول')
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#005353] to-[#003333] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#005353] text-white p-8 text-center">
          <div className="mb-4">
            <div className="bg-white rounded-full p-6 mx-auto inline-block w-40 h-40 flex items-center justify-center">
              <img src={logo} alt="أمانة منطقة الحدود الشمالية" className="w-32 h-auto" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">لوحة مؤشرات الأداء</h1>
          <p className="text-gray-200">أمانة الحدود الشمالية</p>
          <p className="text-gray-300 text-sm mt-1">وكالة الاستثمار والاستدامة المالية</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">تسجيل الدخول</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                  placeholder="أدخل اسم المستخدم"
                  required
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#005353] hover:text-[#003333] font-medium"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-xs text-gray-600">© 2025 أمانة الحدود الشمالية - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
