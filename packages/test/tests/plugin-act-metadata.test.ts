import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/core/runner.js'
import { useACTMetadata, ACT_RULES, type ACTRuleMetadata, type ACTTestResult } from '../src/plugins/use-act-metadata.js'

describe('useACTMetadata Plugin', () => {
  let runner: ReturnType<typeof createRunner>

  beforeEach(() => {
    runner = createRunner()
    document.body.innerHTML = ''
  })

  test('should install successfully with composition API', () => {
    expect(() => {
      runner.use(useACTMetadata())
    }).not.toThrow()
  })

  test('should register ACT rules during plugin creation', async () => {
    const rules = {
      'test-rule': {
        actRule: 'b5c3f8',
        wcagCriteria: ['3.1.1'],
        impact: 'serious' as const,
        tags: ['language', 'html'],
        description: 'HTML page must have lang attribute',
        helpUrl: 'https://act-rules.github.io/rules/b5c3f8'
      }
    }

    runner.use(useACTMetadata(rules))

    document.body.innerHTML = '<div>test</div>'

    runner.describe('ACT Test', () => {
      runner.test('test-rule', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('div')
      }, 'div')
    })

    const results = await runner.run()
    const testResult = results[0]?.tests[0] as ACTTestResult

    expect(testResult?.meta?.actRule).toBe('b5c3f8')
    expect(testResult?.meta?.wcagCriteria).toContain('3.1.1')
  })

  test('should register rules dynamically using helper methods', async () => {
    runner.use(useACTMetadata())

    // Use the helper method added by the plugin
    ;(runner as any).registerACTRule('button accessibility test', {
      actRule: '97a4e1',
      wcagCriteria: ['4.1.2'],
      impact: 'serious',
      tags: ['button', 'accessible-name'],
      description: 'Button must have non-empty accessible name',
      helpUrl: 'https://act-rules.github.io/rules/97a4e1'
    })

    document.body.innerHTML = '<button>Click me</button>'

    runner.describe('ACT Metadata Test', () => {
      runner.test('button accessibility test', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('button')
      }, 'button')
    })

    const results = await runner.run()
    const testResult = results[0]?.tests[0] as ACTTestResult

    expect(testResult?.meta?.actRule).toBe('97a4e1')
    expect(testResult?.meta?.wcagCriteria).toContain('4.1.2')
  })

  test('should register multiple ACT rules at once', () => {
    runner.use(useACTMetadata())

    const rules = {
      'button-test': {
        actRule: '97a4e1',
        wcagCriteria: ['4.1.2'],
        impact: 'serious' as const,
        tags: ['button', 'accessible-name'],
        description: 'Button must have non-empty accessible name'
      },
      'image-test': {
        actRule: '23a2a8',
        wcagCriteria: ['1.1.1'],
        impact: 'serious' as const,
        tags: ['image', 'accessible-name'],
        description: 'Image must have non-empty accessible name'
      }
    }

    expect(() => {
      ;(runner as any).registerACTRules(rules)
    }).not.toThrow()
  })

  test('should enrich test results with ACT metadata', async () => {
    const rules = {
      'button accessibility test': {
        actRule: '97a4e1',
        wcagCriteria: ['4.1.2'],
        impact: 'serious' as const,
        tags: ['button', 'accessible-name'],
        description: 'Button must have non-empty accessible name',
        helpUrl: 'https://act-rules.github.io/rules/97a4e1'
      }
    }

    runner.use(useACTMetadata(rules))

    document.body.innerHTML = '<button>Click me</button>'

    runner.describe('ACT Metadata Test', () => {
      runner.test('button accessibility test', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('button')
      }, 'button')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(1)

    const testResult = results[0]?.tests[0] as ACTTestResult
    expect(testResult?.name).toBe('button accessibility test')
    expect(testResult?.meta?.actRule).toBe('97a4e1')
    expect(testResult?.meta?.wcagCriteria).toContain('4.1.2')
    expect(testResult?.meta?.impact).toBe('serious')
    expect(testResult?.meta?.tags).toContain('button')
    expect(testResult?.meta?.helpUrl).toContain('act-rules.github.io')
  })

  test('should provide access to ACT rules catalog', () => {
    // Test the exported ACT_RULES constant
    expect(typeof ACT_RULES).toBe('object')
    expect(Object.keys(ACT_RULES).length).toBeGreaterThan(0)

    // Check structure of a known rule
    const buttonRule = ACT_RULES['button has non-empty accessible name']
    if (buttonRule) {
      expect(buttonRule.actRule).toBe('97a4e1')
      expect(Array.isArray(buttonRule.wcagCriteria)).toBe(true)
      expect(buttonRule.wcagCriteria).toContain('4.1.2')
      expect(buttonRule.impact).toBe('serious')
      expect(Array.isArray(buttonRule.tags)).toBe(true)
      expect(buttonRule.tags).toContain('button')
      expect(typeof buttonRule.description).toBe('string')
      expect(buttonRule.helpUrl).toContain('act-rules.github.io')
    }
  })

  test('should have comprehensive rule coverage', () => {
    const ruleNames = Object.keys(ACT_RULES)

    // Should have rules for different categories
    const hasAriaRules = ruleNames.some(name => name.includes('aria'))
    const hasImageRules = ruleNames.some(name => name.includes('image'))
    const hasButtonRules = ruleNames.some(name => name.includes('button'))
    const hasFormRules = ruleNames.some(name => name.includes('form'))
    const hasLanguageRules = ruleNames.some(name => name.includes('lang'))

    expect(hasAriaRules).toBe(true)
    expect(hasImageRules).toBe(true)
    expect(hasButtonRules).toBe(true)
    expect(hasFormRules).toBe(true)
    expect(hasLanguageRules).toBe(true)
  })

  test('should have valid rule metadata structure', () => {
    for (const [ruleName, metadata] of Object.entries(ACT_RULES)) {
      expect(typeof ruleName).toBe('string')
      expect(ruleName.length).toBeGreaterThan(0)

      expect(typeof metadata.actRule).toBe('string')
      expect(metadata.actRule.length).toBeGreaterThan(0)

      expect(Array.isArray(metadata.wcagCriteria)).toBe(true)
      expect(metadata.wcagCriteria.length).toBeGreaterThan(0)

      expect(['minor', 'moderate', 'serious', 'critical']).toContain(metadata.impact)

      expect(Array.isArray(metadata.tags)).toBe(true)
      expect(metadata.tags.length).toBeGreaterThan(0)

      if (metadata.description) {
        expect(typeof metadata.description).toBe('string')
      }

      if (metadata.helpUrl) {
        expect(typeof metadata.helpUrl).toBe('string')
        expect(metadata.helpUrl).toContain('act-rules.github.io')
      }
    }
  })

  test('should handle different impact levels', () => {
    const impactLevels = Object.values(ACT_RULES).map(rule => rule.impact)
    const uniqueImpacts = [...new Set(impactLevels)]

    // Should have multiple impact levels
    expect(uniqueImpacts.length).toBeGreaterThan(1)

    // All impacts should be valid
    uniqueImpacts.forEach(impact => {
      expect(['minor', 'moderate', 'serious', 'critical']).toContain(impact)
    })
  })

  test('should map to WCAG success criteria', () => {
    const wcagCriteria = new Set<string>()

    Object.values(ACT_RULES).forEach(rule => {
      rule.wcagCriteria.forEach(criterion => {
        wcagCriteria.add(criterion)
      })
    })

    // Should have multiple WCAG criteria covered
    expect(wcagCriteria.size).toBeGreaterThan(5)

    // Should include common WCAG criteria
    expect(wcagCriteria.has('1.1.1')).toBe(true) // Images of Text
    expect(wcagCriteria.has('4.1.2')).toBe(true) // Name, Role, Value
  })

  test('should work with composition chaining', () => {
    const result = runner.use(useACTMetadata())
    expect(result).toBe(runner) // Should return runner for chaining
  })
})
