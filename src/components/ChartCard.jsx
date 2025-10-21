import { Line, Bar, Pie, Bubble, PolarArea, Radar, Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

function ChartCard({ kpi, groupColor, groupId }) {
  // Determine chart type based on KPI characteristics
  const getChartType = () => {
    // For percentage indicators, cycle through 7 chart types in order
    if (kpi.unit === '%') {
      const chartTypes = ['bar', 'bubble', 'pie', 'line', 'polar', 'radar', 'scatter']
      const index = (kpi.id - 1) % 7  // Cycle through 0-6
      return chartTypes[index]
    }
    // For non-percentage indicators, use appropriate defaults
    if (kpi.unit.includes('مشروع') || kpi.unit.includes('وظيفة') || kpi.unit.includes('رخصة')) return 'bar'
    if (kpi.unit.includes('ريال')) return 'line'
    if (kpi.unit.includes('يوم')) return 'line'
    return 'line'
  }

  let chartType = getChartType()

  // Check if chart has any valid data (early check for type switching)
  const hasValidData = () => {
    if (kpi.multiDataset && kpi.datasets) {
      return kpi.datasets.some(dataset => 
        dataset.values.some(value => value !== null && value !== undefined)
      )
    }
    return kpi.values.some(value => value !== null && value !== undefined)
  }

  const hasData = hasValidData()

  // If pie/polar chart has no data, switch to line chart
  if (!hasData && (chartType === 'pie' || chartType === 'polar')) {
    chartType = 'line'
  }

  // Generate color variations - vibrant mix for pie/polar charts
  const generateColors = () => {
    // Use a vibrant color palette for better visual distinction
    const colorPalette = [
      '#FF6384', // Pink/Red
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#FF6384', // Pink (repeat with variation)
      '#C9CBCF', // Gray
      '#4BC0C0', // Teal (variation)
      '#FF9F40', // Orange (variation)
      '#36A2EB', // Blue (variation)
      '#FFCE56', // Yellow (variation)
    ]
    return colorPalette
  }

  // Generate bubble/scatter data
  const generateBubbleData = (values = kpi.values) => {
    return values
      .map((value, index) => ({
        x: kpi.months[index],  // Use month name instead of index
        y: value,
        r: value !== null && value !== undefined ? Math.max(5, value / 5) : 0  // Bubble radius based on value
      }))
      .filter(point => point.y !== null && point.y !== undefined)  // Filter out null values
  }

  // Chart data configuration based on type
  const getChartData = () => {
    // Handle multi-dataset KPIs (e.g., customer satisfaction with راضي/غير راضي)
    if (kpi.multiDataset && kpi.datasets) {
      const colors = ['#10b981', '#ef4444']  // Green for satisfied, Red for unsatisfied
      
      if (chartType === 'pie' || chartType === 'polar') {
        // For pie/polar, combine all datasets into one with category labels
        const allData = []
        const allLabels = []
        const allColors = []
        
        kpi.datasets.forEach((dataset, dsIndex) => {
          dataset.values.forEach((value, monthIndex) => {
            if (value !== null && value !== undefined) {
              allData.push(value)
              allLabels.push(`${kpi.months[monthIndex]} - ${dataset.label}`)
              allColors.push(colors[dsIndex])
            }
          })
        })
        
        return {
          labels: allLabels,
          datasets: [{
            label: kpi.name,
            data: allData,
            backgroundColor: allColors,
            borderColor: '#fff',
            borderWidth: 2,
          }],
        }
      }
      
      // For other chart types, create separate datasets
      return {
        labels: kpi.months,
        datasets: kpi.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.values,
          backgroundColor: chartType === 'bar' ? colors[index] : `${colors[index]}30`,
          borderColor: colors[index],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: colors[index],
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: chartType === 'line' ? 4 : 0,
          pointHoverRadius: chartType === 'line' ? 6 : 0,
        })),
      }
    }
    
    // Single dataset KPIs (original logic)
    // Pie and Polar charts use multiple colors
    if (chartType === 'pie' || chartType === 'polar') {
      // Filter out null values and their corresponding labels
      const validData = kpi.values
        .map((value, index) => ({ value, label: kpi.months[index], index }))
        .filter(item => item.value !== null && item.value !== undefined)
      
      return {
        labels: validData.map(item => item.label),
        datasets: [{
          label: kpi.name,
          data: validData.map(item => item.value),
          backgroundColor: validData.map(item => generateColors()[item.index]),
          borderColor: '#fff',
          borderWidth: 2,
        }],
      }
    }
    
    // Bubble and Scatter charts use x,y coordinates
    if (chartType === 'bubble' || chartType === 'scatter') {
      return {
        labels: kpi.months,
        datasets: [{
          label: kpi.name,
          data: generateBubbleData(),
          backgroundColor: `${groupColor}80`,
          borderColor: groupColor,
          borderWidth: 2,
        }],
      }
    }
    
    // Radar chart
    if (chartType === 'radar') {
      return {
        labels: kpi.months,
        datasets: [{
          label: kpi.name,
          data: kpi.values,
          backgroundColor: `${groupColor}30`,
          borderColor: groupColor,
          borderWidth: 2,
          pointBackgroundColor: groupColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: groupColor,
        }],
      }
    }
    
    // Bar and Line charts (default)
    return {
      labels: kpi.months,
      datasets: [{
        label: kpi.name,
        data: kpi.values,
        borderColor: groupColor,
        backgroundColor: chartType === 'bar' ? groupColor : `${groupColor}30`,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: groupColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: chartType === 'line' ? 4 : 0,
        pointHoverRadius: chartType === 'line' ? 6 : 0,
      }],
    }
  }

  const chartData = getChartData()

  // Chart options configuration based on type
  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: ['pie', 'polar', 'radar'].includes(chartType),
          position: 'bottom',
          rtl: true,
          labels: {
            font: { family: 'Cairo', size: 11 },
            padding: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          rtl: true,
          textDirection: 'rtl',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, family: 'Cairo' },
          bodyFont: { size: 13, family: 'Cairo' },
          callbacks: {
            label: function(context) {
              let value;
              let label = context.label || '';
              
              // Bubble and Scatter charts
              if (chartType === 'bubble' || chartType === 'scatter') {
                value = context.parsed.y;
                return `${label}: ${value} ${kpi.unit}`
              }
              
              // Pie and Polar charts
              if (chartType === 'pie' || chartType === 'polar') {
                value = context.raw || context.parsed;
                return `${label}: ${value} ${kpi.unit}`
              }
              
              // Radar chart
              if (chartType === 'radar') {
                value = context.raw || context.parsed;
                return `${label}: ${value} ${kpi.unit}`
              }
              
              // Line and Bar charts
              value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
              return `${value} ${kpi.unit}`
            }
          }
        },
      },
    }

    // Add scales for charts that need them
    if (['bar', 'line', 'bubble', 'scatter'].includes(chartType)) {
      baseOptions.scales = {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: kpi.unit,
            font: { family: 'Cairo', size: 12 },
            color: '#666'
          },
          ticks: {
            font: { family: 'Cairo' },
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
        },
        x: {
          type: 'category',
          ticks: {
            font: { family: 'Cairo', size: 10 },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
          grid: { 
            display: false,
            drawBorder: true
          },
        },
      }
    }

    // Radar chart specific options
    if (chartType === 'radar') {
      baseOptions.scales = {
        r: {
          beginAtZero: true,
          ticks: {
            font: { family: 'Cairo' },
          },
        }
      }
    }

    return baseOptions
  }

  const options = getChartOptions()

  // Calculate statistics - handle null values
  const getLastNonNullValue = (values, fromIndex = values.length - 1) => {
    for (let i = fromIndex; i >= 0; i--) {
      if (values[i] !== null && values[i] !== undefined) {
        return { value: values[i], index: i }
      }
    }
    return { value: 0, index: -1 }
  }

  const getFirstNonNullValue = (values) => {
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== null && values[i] !== undefined) {
        return { value: values[i], index: i }
      }
    }
    return { value: 0, index: -1 }
  }

  // For multi-dataset KPIs, use the first dataset for statistics
  const valuesForStats = kpi.multiDataset && kpi.datasets ? kpi.datasets[0].values : kpi.values
  
  // Get first and last non-null values to calculate overall progress
  const firstValue = getFirstNonNullValue(valuesForStats)
  const lastValue = getLastNonNullValue(valuesForStats)
  
  const currentValue = lastValue.value
  const initialValue = firstValue.value
  
  // Calculate overall progress from first to last value
  const change = initialValue !== 0 ? ((currentValue - initialValue) / initialValue * 100).toFixed(1) : 0
  
  // For time-based metrics (days), lower is better, so invert the positive/negative indicator
  const isLowerBetter = kpi.unit.includes('يوم')
  const isPositive = isLowerBetter ? change <= 0 : change >= 0

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{kpi.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{kpi.definition}</p>
        
        {/* Current Value & Change */}
        <div className="flex items-center justify-between">
          <div>
            {kpi.multiDataset && kpi.datasets ? (
              // Show all dataset values for multi-dataset KPIs
              <div className="space-y-1">
                {kpi.datasets.map((dataset, index) => {
                  const dsValue = getLastNonNullValue(dataset.values).value
                  const colors = ['#10b981', '#ef4444']
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 ml-2">القيمة الحالية:</span>
                      <span className="text-2xl font-bold" style={{ color: colors[index] }}>
                        {dsValue.toLocaleString('ar-SA')}
                      </span>
                      <span className="text-gray-600 text-sm">{kpi.unit} {dataset.label}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Single value display
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">القيمة الحالية:</span>
                <span className="text-3xl font-bold" style={{ color: groupColor }}>
                  {currentValue.toLocaleString('ar-SA')}
                </span>
                <span className="text-gray-600 mr-2">{kpi.unit}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">معدل التقدم:</span>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span className="mr-1">{Math.abs(change)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          {chartType === 'bar' && <Bar data={chartData} options={options} />}
          {chartType === 'bubble' && <Bubble data={chartData} options={options} />}
          {chartType === 'pie' && <Pie data={chartData} options={options} />}
          {chartType === 'line' && <Line data={chartData} options={options} />}
          {chartType === 'polar' && <PolarArea data={chartData} options={options} />}
          {chartType === 'radar' && <Radar data={chartData} options={options} />}
          {chartType === 'scatter' && <Scatter data={chartData} options={options} />}
        </div>
      </div>
    </div>
  )
}

export default ChartCard