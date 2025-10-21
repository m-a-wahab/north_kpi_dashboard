import { useState, useEffect } from 'react'
import { formulaEngine } from '../../utils/formulaEngine'

function FormulaBuilder({ formula, inputCount, onChange }) {
  const [localFormula, setLocalFormula] = useState(formula || '')
  const [validation, setValidation] = useState({ valid: true, errors: [] })
  const [testInputs, setTestInputs] = useState(Array(inputCount).fill(0))
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    setTestInputs(Array(inputCount).fill(0))
  }, [inputCount])

  useEffect(() => {
    if (localFormula) {
      const result = formulaEngine.validateFormula(localFormula, inputCount)
      setValidation(result)
      if (result.valid) {
        onChange(localFormula)
      }
    }
  }, [localFormula, inputCount])

  const handleTemplateSelect = (template) => {
    const generated = formulaEngine.generateFormula(template, inputCount)
    setLocalFormula(generated)
  }

  const handleTest = () => {
    const result = formulaEngine.evaluate(localFormula, testInputs)
    setTestResult(result)
  }

  const insertSymbol = (symbol) => {
    setLocalFormula(localFormula + symbol)
  }

  const templates = [
    { id: 'percentage', name: 'نسبة مئوية', formula: '(input1 / input2) * 100' },
    { id: 'growth', name: 'معدل النمو', formula: '((input1 - input2) / input2) * 100' },
    { id: 'average', name: 'المتوسط', formula: 'متوسط جميع المدخلات' },
    { id: 'sum', name: 'المجموع', formula: 'مجموع جميع المدخلات' },
    { id: 'difference', name: 'الفرق', formula: 'input1 - input2' },
    { id: 'ratio', name: 'النسبة', formula: 'input1 / input2' },
  ]

  const symbols = [
    { symbol: '+', label: 'جمع' },
    { symbol: '-', label: 'طرح' },
    { symbol: '*', label: 'ضرب' },
    { symbol: '/', label: 'قسمة' },
    { symbol: '(', label: '(' },
    { symbol: ')', label: ')' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          الصيغة الحسابية (Formula) *
        </label>

        {/* Templates */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">قوالب جاهزة:</p>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition border border-gray-300"
                title={template.formula}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Input */}
        <textarea
          value={localFormula}
          onChange={(e) => setLocalFormula(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent font-mono text-sm ${
            validation.valid ? 'border-gray-300' : 'border-red-500'
          }`}
          placeholder="مثال: (input1 / input2) * 100"
          rows={3}
        />

        {/* Symbol Buttons */}
        <div className="mt-2 flex gap-2">
          {symbols.map(({ symbol, label }) => (
            <button
              key={symbol}
              type="button"
              onClick={() => insertSymbol(symbol)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-sm"
              title={label}
            >
              {symbol}
            </button>
          ))}
          {Array.from({ length: inputCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => insertSymbol(`input${i + 1}`)}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded border border-blue-300 text-sm font-semibold"
            >
              input{i + 1}
            </button>
          ))}
        </div>

        {/* Validation Errors */}
        {!validation.valid && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-red-800 mb-1">أخطاء في الصيغة:</p>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Formula Description */}
        {validation.valid && localFormula && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>الصيغة:</strong> {formulaEngine.getFormulaDescription(localFormula)}
            </p>
          </div>
        )}
      </div>

      {/* Test Formula */}
      {validation.valid && localFormula && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">اختبار الصيغة</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {testInputs.map((value, index) => (
              <div key={index}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  input{index + 1}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const updated = [...testInputs]
                    updated[index] = parseFloat(e.target.value) || 0
                    setTestInputs(updated)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005353] focus:border-transparent text-sm"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTest}
            className="px-4 py-2 bg-[#005353] text-white rounded-lg hover:bg-[#004040] transition text-sm"
          >
            احسب النتيجة
          </button>

          {testResult !== null && (
            <div className="mt-3 p-3 bg-white border-2 border-green-500 rounded-lg">
              <p className="text-sm text-gray-600">النتيجة:</p>
              <p className="text-2xl font-bold text-green-600">{testResult.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>كيفية الاستخدام:</strong>
        </p>
        <ul className="text-sm text-blue-700 list-disc list-inside mt-1 space-y-1">
          <li>استخدم input1, input2, ... للإشارة إلى المدخلات</li>
          <li>العمليات المتاحة: + - * / ( )</li>
          <li>مثال للنسبة المئوية: (input1 / input2) * 100</li>
          <li>مثال لمعدل النمو: ((input1 - input2) / input2) * 100</li>
        </ul>
      </div>
    </div>
  )
}

export default FormulaBuilder
