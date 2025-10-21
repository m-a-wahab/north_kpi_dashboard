import { useParams, Link } from 'react-router-dom'
import ChartCard from '../components/ChartCard'
import { useEnhancedData } from '../context/EnhancedDataContext'

function GroupDetailsPage() {
  const { groupId } = useParams()
  const { kpiGroups } = useEnhancedData()
  const group = kpiGroups.find(g => g.id === parseInt(groupId))

  if (!group) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">لم يتم العثور على المجموعة</h2>
          <Link to="/" className="text-primary hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <span className="text-2xl ml-2">→</span>
          <span>العودة إلى الفئات</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{group.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-gray-600 mt-1">{group.description}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">عدد المؤشرات</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{group.kpis.length}</p>
            </div>
            <div className="text-4xl" style={{ color: group.color }}>📊</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">فترة البيانات</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">12</p>
            </div>
            <div className="text-4xl" style={{ color: group.color }}>📅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الحالة</p>
              <p className="text-xl font-bold text-green-600 mt-1">محدث</p>
            </div>
            <div className="text-4xl" style={{ color: group.color }}>✅</div>
          </div>
        </div>
      </div>

      {/* KPI Charts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">المؤشرات التفصيلية</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {group.kpis.map((kpi) => (
          <ChartCard key={kpi.id} kpi={kpi} groupColor={group.color} groupId={group.id} />
        ))}
      </div>
    </div>
  )
}

export default GroupDetailsPage