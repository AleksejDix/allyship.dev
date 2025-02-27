import { actRulesRegistry } from "./act-rules-registry"
import type { ACTRule } from "./act-rules-registry"
import type { ACTRuleResult, ACTTestReport } from "./act-types"
import {
  createACTTestReport,
  logACTResults
} from "./utils/act-result-formatter"

/**
 * ACT Rule Runner - executes ACT rules and collects results
 */
export class ACTRuleRunner {
  private results: ACTRuleResult[] = []
  private runningRules: Set<string> = new Set()
  private completedRules: Set<string> = new Set()
  private timeoutIds: Map<string, number> = new Map()

  /**
   * Add a result to the collection
   */
  addResult(result: ACTRuleResult): void {
    this.results.push(result)
  }

  /**
   * Clear all results
   */
  clearResults(): void {
    this.results = []
    this.completedRules.clear()
  }

  /**
   * Get all collected results
   */
  getResults(): ACTRuleResult[] {
    return [...this.results]
  }

  /**
   * Get a report of all results
   */
  getReport(): ACTTestReport {
    return createACTTestReport(this.results)
  }

  /**
   * Log results to console
   */
  logResults(): ACTTestReport {
    const report = this.getReport()
    logACTResults(report)
    return report
  }

  /**
   * Run a specific ACT rule
   */
  async runRule(ruleId: string): Promise<void> {
    const rule = actRulesRegistry.getRule(ruleId)

    if (!rule) {
      console.warn(`ACT rule with ID ${ruleId} not found.`)
      return
    }

    if (this.runningRules.has(ruleId)) {
      console.warn(`ACT rule with ID ${ruleId} is already running.`)
      return
    }

    if (this.completedRules.has(ruleId)) {
      console.warn(`ACT rule with ID ${ruleId} has already been run.`)
      return
    }

    if (!rule.isApplicable()) {
      console.log(`ACT rule with ID ${ruleId} is not applicable to this page.`)
      return
    }

    this.runningRules.add(ruleId)

    // Set a timeout to prevent rules from running indefinitely
    const timeoutId = window.setTimeout(() => {
      if (this.runningRules.has(ruleId)) {
        console.error(`ACT rule with ID ${ruleId} timed out after 30 seconds.`)
        this.runningRules.delete(ruleId)
        this.timeoutIds.delete(ruleId)
      }
    }, 30000)

    this.timeoutIds.set(ruleId, timeoutId)

    try {
      await rule.execute()
      this.completedRules.add(ruleId)
    } catch (error) {
      console.error(`Error running ACT rule with ID ${ruleId}:`, error)
    } finally {
      this.runningRules.delete(ruleId)

      const timeoutId = this.timeoutIds.get(ruleId)
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
        this.timeoutIds.delete(ruleId)
      }
    }
  }

  /**
   * Run multiple ACT rules
   */
  async runRules(ruleIds: string[]): Promise<void> {
    await Promise.all(ruleIds.map((ruleId) => this.runRule(ruleId)))
  }

  /**
   * Run all applicable ACT rules
   */
  async runAllApplicableRules(): Promise<void> {
    const applicableRules = actRulesRegistry.getApplicableRules()
    await Promise.all(
      applicableRules.map((rule) => this.runRule(rule.metadata.id))
    )
  }

  /**
   * Run rules by category
   */
  async runRulesByCategory(category: string): Promise<void> {
    const rules = actRulesRegistry.getRulesByCategory(category)
    await Promise.all(rules.map((rule) => this.runRule(rule.metadata.id)))
  }

  /**
   * Run rules by WCAG criteria
   */
  async runRulesByWCAGCriteria(criteria: string): Promise<void> {
    const rules = actRulesRegistry.getRulesByWCAGCriteria(criteria)
    await Promise.all(rules.map((rule) => this.runRule(rule.metadata.id)))
  }
}

// Create and export a singleton instance
export const actRuleRunner = new ACTRuleRunner()
