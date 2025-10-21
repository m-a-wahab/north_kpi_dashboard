function DataEntryInputs({ 
  inputs, 
  months, 
  currentYear, 
  groupId, 
  kpiId, 
  onInputChange, 
  getInputValue,
  calculateKpiValue
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" dir="rtl">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700">
              الشهر
            </th>
            {inputs.map((input, index) => (
              <th key={input.id} className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700">
                {input.name}
                {input.unit && (
                  <span className="text-xs text-gray-500 font-normal block mt-1">({input.unit})</span>
                )}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2 text-right font-semibold text-gray-700 bg-green-50">
              القيمة المحسوبة
            </th>
          </tr>
        </thead>
        <tbody>
          {months.map((month, monthIndex) => {
            const calculatedValue = calculateKpiValue ? calculateKpiValue(groupId, kpiId, monthIndex, currentYear) : null
            
            return (
              <tr key={monthIndex} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 bg-gray-50">
                  {month}
                </td>
                {inputs.map((input) => (
                  <td key={input.id} className="border border-gray-300 px-2 py-2">
                    <input
                      type="number"
                      value={getInputValue(currentYear, groupId, kpiId, input.id, monthIndex) || ''}
                      onChange={(e) => onInputChange(groupId, kpiId, input.id, monthIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#005353] focus:border-transparent"
                      placeholder="0"
                      step="any"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-green-700 bg-green-50">
                  {calculatedValue !== null && calculatedValue !== undefined ? calculatedValue.toFixed(2) : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DataEntryInputs
