/**
 * ACT Test Runner - Modular Architecture
 *
 * A fast, modular accessibility test runner with:
 * - Core: Minimal execution engine
 * - Plugins: Optional features (performance, AllyStudio, etc.)
 * - Reporters: Flexible output formatting
 */

// Main API (simple interface)
export * from './api.js'

// Core modules (for advanced usage)
export * from './core/index.js'

// Plugins (optional features)
export * from './plugins/index.js'

// Reporters (output formatting)
export * from './reporters/index.js'
