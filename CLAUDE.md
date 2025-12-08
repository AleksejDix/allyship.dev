# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AllyStudio Chrome Extension

AllyStudio is a Plasmo-based Chrome extension for real-time accessibility testing. This guide focuses specifically on extension development.

## Development Commands

```bash
cd apps/allystudio

# Development (with hot reload)
yarn dev              # Chrome development (recommended)
yarn dev:firefox      # Firefox MV2 development
yarn dev:safari       # Safari MV3 development

# Testing
yarn test             # Run all tests
yarn test:browser     # Browser-based tests (uses Playwright)
yarn test:watch       # Watch mode for rapid development
yarn test:ui          # Vitest UI for debugging tests

# Building & Packaging
yarn build            # Production build
yarn package          # Create extension package for distribution
yarn preview          # Build and show installation instructions
```

## Architecture Overview

### Extension Contexts
```
Background Service Worker (src/background/)
├── Root XState machine for global state
├── Storage initialization
├── Tab event handling
└── Authentication management

Side Panel (src/sidepanel/)
├── Main UI (Werkzeug component)
├── Test suite display
├── Real-time results
└── Performance metrics

Content Scripts (src/contents/)
├── test-runner.ts       # Executes accessibility tests
├── modern-dom-monitor.ts # 120 FPS DOM monitoring
├── element-inspector.ts  # Interactive inspection
├── focus-order.ts       # Focus order visualization
└── vision-simulator.ts  # Color blindness simulation
```

### XState Machines

The extension uses XState 5 for state management:

1. **Root Machine** (`background/machines/root.ts`)
   - Global extension state
   - Tab management
   - Authentication state

2. **Test Machine** (`background/machines/test.ts`)
   - Test execution state
   - Result collection
   - Error handling

3. **Page Machine** (`components/page/page-machine.ts`)
   - Page data synchronization
   - Supabase integration

4. **Space Machine** (`components/space/space-machine.ts`)
   - Workspace management
   - Project organization

### Testing Architecture

Tests are organized by **ACT rules** (Accessibility Conformance Testing):

```typescript
// Pattern for ACT rule implementation
export function defineACTRule_bf051a(runner: Runner) {
  runner.describe("ACT bf051a: Document has non-empty title", () => {
    runner.test("title exists and has content", ({ element }) => {
      // Test implementation
    }, "title")
  })
}
```

**Test Files Location**: `src/contents/tests/`
- Each ACT rule has its own file (e.g., `act-bf051a.ts`)
- Registry in `src/contents/tests/registry.ts` maps tests to WCAG criteria
- Tests include metadata: WCAG level, guideline, impact

### Communication Patterns

#### Event Bus System
High-performance event system for cross-context communication:

```typescript
// Send test request from side panel
eventBus.emit({
  type: "TEST_ANALYSIS_REQUEST",
  payload: { suiteKey: "critical" }
})

// Receive results in side panel
eventBus.on("TEST_ANALYSIS_COMPLETE", (data) => {
  // Handle results
})
```

#### Key Event Types
- `TEST_ANALYSIS_REQUEST` - Initiate tests
- `TEST_ANALYSIS_COMPLETE` - Test results
- `HIGHLIGHT` - Element highlighting
- `DOM_CHANGE` - DOM mutations
- `AUTH_STATE_CHANGE` - Auth updates

### Key Components

1. **Werkzeug** (`src/components/werkzeug.tsx`)
   - Main testing interface
   - Test suite management
   - Real-time result display
   - Auto-rerun on URL changes

2. **Layer System** (`src/components/layers/`)
   - Visual element highlighting
   - Scroll/resize synchronization
   - 120 FPS performance target

3. **Event Bus** (`src/lib/events/event-bus.ts`)
   - Priority event handling
   - Type-specific subscriptions
   - Cross-context messaging

## Development Workflow

1. **Start Development**
   ```bash
   yarn dev
   ```
   - Extension loads from `build/chrome-mv3-dev`
   - Hot reload on file changes
   - Side panel opens on extension icon click

2. **Testing Changes**
   - Content scripts inject automatically
   - Use Chrome DevTools for debugging
   - Console logs appear in respective contexts

3. **Adding New ACT Rules**
   - Create file in `src/contents/tests/act-[ruleId].ts`
   - Implement using `defineACTRule_[ruleId]` pattern
   - Register in `src/contents/tests/registry.ts`
   - Add WCAG metadata

## Debugging

### Chrome
1. Navigate to `chrome://extensions/`
2. Enable Developer mode
3. Click "service worker" for background script debugging
4. Right-click side panel → Inspect for UI debugging
5. Page console for content script logs

### Performance Monitoring
- DOM monitor tracks FPS and mutation count
- Test execution times logged
- Element count per test tracked

### Common Issues
- **Hot reload not working**: Check Plasmo dev server is running
- **Content script not injecting**: Refresh the target page
- **Side panel blank**: Check for errors in side panel console

## Important Files

- `src/contents/tests/registry.ts` - All ACT rules registration
- `src/background/index.ts` - Extension initialization
- `src/components/werkzeug.tsx` - Main UI component
- `src/lib/events/event-bus.ts` - Event system
- `manifest.json` - Extension permissions (auto-generated by Plasmo)

## Testing Guidelines

1. **Unit Tests**: Test individual ACT rules
2. **Browser Tests**: Test full extension flow
3. **Performance**: Tests should complete < 1000ms
4. **Coverage**: Each WCAG criterion needs tests

## Code Patterns

### Adding a New Content Script
```typescript
// In src/contents/[name].ts
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle"
}

// Your content script logic
```

### Creating a New XState Machine
```typescript
export const machineName = setup({
  types: {
    context: {} as MachineContext,
    events: {} as MachineEvent,
  },
  actors: { /* async operations */ },
  actions: { /* state mutations */ },
  guards: { /* conditions */ }
}).createMachine({
  id: "machineName",
  initial: "idle",
  context: {},
  states: {}
})
```

### Event Bus Usage
```typescript
// Emit event
eventBus.emit({ type: "EVENT_TYPE", payload: data })

// Listen for events
const unsubscribe = eventBus.on("EVENT_TYPE", (event) => {
  // Handle event
})

// Clean up
unsubscribe()
```