# Event System Migration

## Background

AllyStudio used to use specific event types for each test type:

- `HEADING_ANALYSIS_COMPLETE`
- `LINK_ANALYSIS_COMPLETE`
- `ALT_ANALYSIS_COMPLETE`
- `INTERACTIVE_ANALYSIS_COMPLETE`

This created a lot of duplicate code and made it harder to add new test types.

## Migration to Generic Events

We've migrated to generic events that work with all test types:

- `TEST_ANALYSIS_REQUEST` - Used to request that a test be run
- `TEST_ANALYSIS_COMPLETE` - Used to indicate that a test has finished

This simplifies the codebase, makes it easier to add new test types, and reduces the amount of duplicate code.

## Key Changes

1. **Updated TestConfig**

   - Removed specific event references
   - Made `layerName` a required property

2. **Simplified Event Types**

   - Removed specific event types and interfaces
   - Kept the issue type definitions for reference

3. **Updated Event Publishing**

   - `createTestRunner` now only publishes generic events
   - `publishTestComplete` only publishes the generic event

4. **Updated UI Components**

   - `werkzeug.tsx` now only uses generic events
   - Added fallback completion logic for reliability
   - Improved error handling and logging

5. **Content Script Integration**
   - Updated `plasmo-storage.tsx` to use generic events
   - Simplified test completion tracking

## Key Files Modified

- `apps/allystudio/src/lib/testing/test-config.ts`
- `apps/allystudio/src/lib/testing/create-test-runner.ts`
- `apps/allystudio/src/lib/testing/utils/event-utils.ts`
- `apps/allystudio/src/lib/events/types.ts`
- `apps/allystudio/src/components/werkzeug.tsx`
- `apps/allystudio/src/contents/plasmo-storage.tsx`

## Safety Features

Several safety features were added during this migration:

1. **Fallback Completion Events**

   - If the content script doesn't respond, a fallback completion event is published
   - Added a 3 second timeout to prevent UI from getting stuck

2. **Tab Status Checking**

   - Added checks to ensure the tab is ready to receive messages
   - Provides early feedback if communication might fail

3. **Error Handling**
   - Every potential error is caught and logged
   - Ensures a completion event is always published, even on error

## Future Improvements

1. **Issue Type Consolidation**

   - Consider creating a unified issue type instead of separate types for each test
   - Would further simplify the codebase and make it easier to process issues generically

2. **Automatic Test Discovery**

   - Could use a registry approach to auto-register new tests
   - Would further reduce the need for changes when adding new tests

3. **Event Documentation**
   - Create comprehensive documentation of the event system
   - Would make it easier for new developers to understand the system
