// Safe formula evaluation engine

export class FormulaEngine {
  constructor() {
    this.allowedOperators = ['+', '-', '*', '/', '(', ')', '%']
    this.allowedFunctions = ['Math.abs', 'Math.round', 'Math.floor', 'Math.ceil', 'Math.min', 'Math.max']
  }

  // Validate formula syntax
  validateFormula(formula, inputCount) {
    const errors = []

    // Check for empty formula
    if (!formula || formula.trim() === '') {
      errors.push('الصيغة فارغة')
      return { valid: false, errors }
    }

    // Check for valid input references
    const inputPattern = /input(\d+)/g
    const matches = [...formula.matchAll(inputPattern)]
    
    for (const match of matches) {
      const inputNum = parseInt(match[1])
      if (inputNum < 1 || inputNum > inputCount) {
        errors.push(`input${inputNum} غير موجود (المدخلات المتاحة: 1-${inputCount})`)
      }
    }

    // Check for balanced parentheses
    let parenCount = 0
    for (const char of formula) {
      if (char === '(') parenCount++
      if (char === ')') parenCount--
      if (parenCount < 0) {
        errors.push('أقواس غير متوازنة')
        break
      }
    }
    if (parenCount !== 0) {
      errors.push('أقواس غير متوازنة')
    }

    // Check for dangerous code
    const dangerousPatterns = [
      /eval/i,
      /function/i,
      /=>/,
      /import/i,
      /require/i,
      /window/i,
      /document/i,
      /localStorage/i,
      /fetch/i,
      /XMLHttpRequest/i
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(formula)) {
        errors.push('الصيغة تحتوي على كود غير مسموح به')
        break
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Evaluate formula with input values
  evaluate(formula, inputs) {
    try {
      // Replace input1, input2, etc. with actual values
      let processedFormula = formula
      
      inputs.forEach((value, index) => {
        const inputName = `input${index + 1}`
        const regex = new RegExp(inputName, 'g')
        processedFormula = processedFormula.replace(regex, value !== null && value !== undefined ? value : 0)
      })

      // Evaluate using Function constructor (safer than eval)
      const result = new Function('Math', `return ${processedFormula}`)(Math)
      
      // Check for invalid results
      if (isNaN(result) || !isFinite(result)) {
        return null
      }

      return result
    } catch (error) {
      console.error('Formula evaluation error:', error)
      return null
    }
  }

  // Get formula description in Arabic
  getFormulaDescription(formula) {
    let description = formula
    
    // Replace operators with Arabic
    description = description.replace(/\+/g, ' + ')
    description = description.replace(/-/g, ' - ')
    description = description.replace(/\*/g, ' × ')
    description = description.replace(/\//g, ' ÷ ')
    
    return description
  }

  // Generate formula from template
  generateFormula(template, inputCount) {
    const templates = {
      'percentage': '(input1 / input2) * 100',
      'growth': '((input1 - input2) / input2) * 100',
      'average': `(${Array.from({length: inputCount}, (_, i) => `input${i+1}`).join(' + ')}) / ${inputCount}`,
      'sum': Array.from({length: inputCount}, (_, i) => `input${i+1}`).join(' + '),
      'difference': 'input1 - input2',
      'ratio': 'input1 / input2',
      'custom': ''
    }

    return templates[template] || templates.custom
  }
}

export const formulaEngine = new FormulaEngine()
