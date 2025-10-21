import { Link } from 'react-router-dom'
import { useEnhancedData } from '../context/EnhancedDataContext'

function CategoriesPage() {
  const { kpiGroups } = useEnhancedData()

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">فئات مؤشرات الأداء</h2>
        <p className="text-gray-600">اختر فئة لعرض المؤشرات التفصيلية</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiGroups.map((group) => (
          <Link
            key={group.id}
            to={`/group/${group.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              {/* Card Header with Color */}
              <div 
                className="h-32 flex items-center justify-center text-6xl"
                style={{ backgroundColor: group.color }}
              >
                <span className="filter drop-shadow-lg">{group.icon}</span>
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {group.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {group.kpis.length} مؤشر
                  </span>
                  <span className="text-primary font-semibold group-hover:translate-x-2 transition-transform">
                    عرض التفاصيل ←
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage