import type { Plugin } from './types.js'
import type { createRunner } from '../core/runner.js'
import type { TestResult } from '../core/types.js'

/**
 * ACT Rule metadata
 */
export interface ACTRuleMetadata {
  actRule: string
  wcagCriteria: string[]
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  tags: string[]
  description?: string
  helpUrl?: string
}

/**
 * Enhanced test result with ACT metadata
 */
export interface ACTTestResult extends TestResult {
  meta?: ACTRuleMetadata
}

/**
 * Plugin that enriches test results with ACT rule metadata
 */
export class ACTMetadataPlugin implements Plugin {
  name = 'act-metadata'
  private metadataMap = new Map<string, ACTRuleMetadata>()

  /**
   * Register ACT rule metadata for a test
   */
  registerRule(testName: string, metadata: ACTRuleMetadata): void {
    this.metadataMap.set(testName, metadata)
  }

  /**
   * Register multiple ACT rules at once
   */
  registerRules(rules: Record<string, ACTRuleMetadata>): void {
    for (const [testName, metadata] of Object.entries(rules)) {
      this.registerRule(testName, metadata)
    }
  }

  install(runner: ReturnType<typeof createRunner>): void {
    // Listen for test completion events to enrich results
    runner.on(event => {
      if (event.type === 'test-complete') {
        const results = event.data.results

        // Enrich each test result with ACT metadata
        for (const suiteResult of results) {
          for (const testResult of suiteResult.tests) {
            const metadata = this.metadataMap.get(testResult.name)
            if (metadata) {
              (testResult as ACTTestResult).meta = metadata
            }
          }
        }
      }
    })
  }

  uninstall(_runner: ReturnType<typeof createRunner>): void {
    this.metadataMap.clear()
  }
}

/**
 * Complete ACT Rules Catalog
 * Data-driven approach: [rule_id, wcag_criteria, impact, tags, description]
 */
const ACT_CATALOG: Record<string, [string, string[], string, string[], string]> = {
  // ARIA Rules
  'role attribute has valid value': ['674b10', ['4.1.2'], 'serious', ['aria', 'role'], 'Role attribute must have valid value'],
  'aria state or property has valid value': ['6a7281', ['4.1.2'], 'serious', ['aria', 'state'], 'ARIA state or property must have valid value'],
  'aria attribute is defined in wai-aria': ['5f99a7', ['4.1.2'], 'serious', ['aria'], 'ARIA attribute must be defined in WAI-ARIA'],
  'aria required context role': ['bc4a75', ['1.3.1'], 'serious', ['aria', 'context'], 'ARIA element must have required context role'],
  'aria required id references exist': ['59796f', ['1.3.1', '4.1.2'], 'serious', ['aria', 'id'], 'ARIA required ID references must exist'],
  'aria required owned elements': ['bc659a', ['1.3.1'], 'serious', ['aria', 'owned'], 'ARIA element must own required elements'],
  'aria state or property is permitted': ['5c01ea', ['4.1.2'], 'serious', ['aria', 'state'], 'ARIA state or property must be permitted'],

  // Language Rules
  'element with lang attribute has valid language tag': ['de46e4', ['3.1.2'], 'moderate', ['language'], 'Element with lang attribute must have valid language tag'],
  'html page lang attribute has valid language tag': ['bf051a', ['3.1.1'], 'serious', ['language', 'html'], 'HTML page lang attribute must have valid language tag'],
  'html page has lang attribute': ['b5c3f8', ['3.1.1'], 'serious', ['language', 'html'], 'HTML page must have lang attribute'],
  'html element language subtag matches language': ['674b10', ['3.1.1'], 'moderate', ['language'], 'HTML element language subtag must match language'],
  'html page language subtag matches default language': ['ucwvc8', ['3.1.1'], 'moderate', ['language'], 'HTML page language subtag must match default language'],

  // Accessible Name Rules
  'menuitem has non-empty accessible name': ['m6b1q3', ['4.1.2'], 'serious', ['menuitem', 'accessible-name'], 'Menuitem must have non-empty accessible name'],
  'button has non-empty accessible name': ['97a4e1', ['4.1.2'], 'serious', ['button', 'accessible-name'], 'Button must have non-empty accessible name'],
  'should have accessible name': ['97a4e1', ['4.1.2'], 'serious', ['button', 'accessible-name'], 'Button must have accessible name'],
  'form field has non-empty accessible name': ['e086e5', ['4.1.2'], 'serious', ['form', 'accessible-name'], 'Form field must have non-empty accessible name'],
  'should have associated label': ['e086e5', ['1.3.1', '3.3.2'], 'serious', ['form', 'label'], 'Form control must have associated label'],
  'image button has non-empty accessible name': ['59796f', ['4.1.2'], 'serious', ['image', 'button'], 'Image button must have non-empty accessible name'],
  'image has non-empty accessible name': ['23a2a8', ['1.1.1'], 'serious', ['image', 'accessible-name'], 'Image must have non-empty accessible name'],
  'should have meaningful alt text': ['23a2a8', ['1.1.1'], 'serious', ['image', 'alt-text'], 'Image must have meaningful alt text'],
  'link has non-empty accessible name': ['c487ae', ['2.4.4', '4.1.2'], 'serious', ['link', 'accessible-name'], 'Link must have non-empty accessible name'],
  'should have meaningful link text': ['c487ae', ['2.4.4'], 'serious', ['link', 'text'], 'Link must have meaningful text'],
  'svg element with explicit role has non-empty accessible name': ['7d6734', ['4.1.2'], 'serious', ['svg', 'role'], 'SVG element with explicit role must have non-empty accessible name'],
  'object element rendering non-text content has non-empty accessible name': ['8fc3b6', ['1.1.1'], 'serious', ['object'], 'Object element rendering non-text content must have non-empty accessible name'],
  'heading has non-empty accessible name': ['b49b2e', ['1.3.1'], 'serious', ['heading'], 'Heading must have non-empty accessible name'],
  'iframe element has non-empty accessible name': ['4b1c6c', ['4.1.2'], 'serious', ['iframe'], 'Iframe element must have non-empty accessible name'],
  'summary element has non-empty accessible name': ['4e8ab6', ['4.1.2'], 'serious', ['summary'], 'Summary element must have non-empty accessible name'],

  // Focus and Keyboard Rules
  'iframe with interactive elements is not excluded from tab-order': ['akn7bn', ['2.1.1'], 'serious', ['iframe', 'tab-order'], 'Iframe with interactive elements must not be excluded from tab-order'],
  'element with aria-hidden has no content in sequential focus navigation': ['6cfa84', ['4.1.3'], 'serious', ['aria-hidden', 'focus'], 'Element with aria-hidden must have no content in sequential focus navigation'],
  'scrollable content can be reached with sequential focus navigation': ['0ssw9k', ['2.1.1'], 'serious', ['scrollable', 'focus'], 'Scrollable content must be reachable with sequential focus navigation'],
  'element in sequential focus order has visible focus': ['oj04fd', ['2.4.7'], 'serious', ['focus', 'visible'], 'Element in sequential focus order must have visible focus'],
  'focusable element has no keyboard trap': ['80f0bf', ['2.1.2'], 'serious', ['keyboard', 'trap'], 'Focusable element must have no keyboard trap'],
  'focusable element has no keyboard trap via non-standard navigation': ['a1b64e', ['2.1.2'], 'serious', ['keyboard', 'trap'], 'Focusable element must have no keyboard trap via non-standard navigation'],
  'focusable element has no keyboard trap via standard navigation': ['ebe86a', ['2.1.2'], 'serious', ['keyboard', 'trap'], 'Focusable element must have no keyboard trap via standard navigation'],
  'no keyboard shortcut uses only printable characters': ['ffbc54', ['2.1.4'], 'moderate', ['keyboard', 'shortcut'], 'No keyboard shortcut must use only printable characters'],

  // Spacing Rules
  'important letter spacing in style attributes is wide enough': ['24afc2', ['1.4.12'], 'moderate', ['spacing', 'letter'], 'Important letter spacing in style attributes must be wide enough'],
  'important word spacing in style attributes is wide enough': ['9e45ec', ['1.4.12'], 'moderate', ['spacing', 'word'], 'Important word spacing in style attributes must be wide enough'],
  'important line height in style attributes is wide enough': ['78fd32', ['1.4.12'], 'moderate', ['spacing', 'line-height'], 'Important line height in style attributes must be wide enough'],

  // Form Rules
  'autocomplete attribute has valid value': ['73f2c2', ['1.3.5'], 'moderate', ['form', 'autocomplete'], 'Autocomplete attribute must have valid value'],
  'form field label is descriptive': ['cc0f0a', ['3.3.2'], 'moderate', ['form', 'label'], 'Form field label must be descriptive'],
  'error message describes invalid form field value': ['36b590', ['3.3.3'], 'serious', ['form', 'error'], 'Error message must describe invalid form field value'],
  'element with role attribute has required states and properties': ['4e8ab6', ['4.1.2'], 'serious', ['role', 'state'], 'Element with role attribute must have required states and properties'],

  // Language Validation
  'should have valid language tag': ['bf051a', ['3.1.1'], 'moderate', ['language', 'bcp47'], 'Language attribute must use valid BCP 47 language tag'],

  // Page Structure
  'html page has non-empty title': ['2779a5', ['2.4.2'], 'serious', ['title', 'page'], 'HTML page must have non-empty title'],
  'html page title is descriptive': ['c4a8a4', ['2.4.2'], 'moderate', ['title'], 'HTML page title must be descriptive'],
  'heading is descriptive': ['b49b2e', ['2.4.6'], 'moderate', ['heading'], 'Heading must be descriptive'],

  // Visual and Contrast
  'text has minimum contrast': ['afw4f7', ['1.4.3'], 'serious', ['contrast', 'text'], 'Text must have minimum contrast'],
  'text has enhanced contrast': ['09o5cg', ['1.4.6'], 'moderate', ['contrast', 'text'], 'Text must have enhanced contrast'],

  // Media Rules
  'audio element content has text alternative': ['2eb176', ['1.2.1'], 'serious', ['audio', 'text'], 'Audio element content must have text alternative'],
  'video element auditory content has captions': ['eac66b', ['1.2.2'], 'serious', ['video', 'captions'], 'Video element auditory content must have captions'],
  'video element visual content has audio description': ['1ea59c', ['1.2.5'], 'moderate', ['video', 'audio-description'], 'Video element visual content must have audio description']
}

/**
 * Complete ACT Rules - Generated from catalog
 */
export const ACT_RULES: Record<string, ACTRuleMetadata> = Object.fromEntries(
  Object.entries(ACT_CATALOG).map(([name, [actRule, wcagCriteria, impact, tags, description]]) => [
    name,
    {
      actRule,
      wcagCriteria,
      impact: impact as ACTRuleMetadata['impact'],
      tags,
      description,
      helpUrl: `https://act-rules.github.io/rules/${actRule}`
    }
  ])
)
