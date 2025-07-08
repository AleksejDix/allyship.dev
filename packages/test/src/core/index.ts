/**
 * Core test runner module
 * Minimal execution engine without plugins or reporting
 */

export * from "./types.js"
export * from "./expectation.js"
// Export selector utilities from shared package
export {
  generateSelector,
  generateXPath,
  findElementByXPath,
} from "@allystudio/accessibility-utils"
export * from "./runner.js"
