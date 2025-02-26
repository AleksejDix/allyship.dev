# Page Components

This directory contains components for managing and displaying pages associated with a website in the Ally Studio application.

## Architecture Overview

The page components follow a state machine architecture using XState. The components are structured to handle different states of the page data lifecycle (loading, success, error) and render appropriate UI for each state.

```mermaid
graph TD
    A[Page Component] --> B[PageProvider]
    B --> C[State Machine]
    C -->|loading| D[Skeleton/PageListSkeleton]
    C -->|error| E[PageError]
    C -->|success.list + no pages| F[PageListEmpty]
    C -->|success.list + has pages| G[PageList]
    C -->|success.selected| H[PageSelected]
    C -->|debug| I[PageDebug]
```

## Component Hierarchy

Each component is responsible for its own visibility based on the current state of the page machine:

```mermaid
graph TD
    A[Page] --> B[PageProvider]
    B --> C[Skeleton]
    B --> D[PageError]
    B --> E[PageList]
    B --> F[PageListEmpty]
    B --> G[PageListSkeleton]
    B --> H[PageSelected]
    B --> I[Children]
    B --> J[PageDebug]
```

## State Machine

The page machine manages the state of pages for a selected website. It handles loading pages, error states, and successful data fetching, as well as page selection.

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> loading: LOAD_PAGES
    loading --> success: done.invoke.loadPages
    loading --> error: error.platform.loadPages
    error --> loading: RETRY

    state success {
        [*] --> list
        list --> selected: SELECT_PAGE
        selected --> list: BACK
    }

    success --> loading: REFRESH
    idle --> loading: WEBSITE_CHANGED
```

## Component Responsibilities

### Page

The root component that sets up the machine and provider. It only renders when a website is selected.

```mermaid
flowchart LR
    A[Website Context] -->|currentWebsite| B[Page]
    B -->|websiteId| C[PageProvider]
```

### PageProvider

Provides the page machine context to all child components.

### PageList

Displays the list of pages when in the success.list state and there are pages to display. Allows selecting a page to view details.

### PageSelected

Displays the details of a selected page when in the success.selected state.

### PageListEmpty

Displays a message when in the success.list state but there are no pages.

### PageError

Displays an error message when in the error state.

### Skeleton & PageListSkeleton

Display loading indicators when in the loading or idle state.

### PageDebug

Displays debugging information about the current state of the page machine.

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Page
    participant PageMachine
    participant Supabase

    User->>Page: Select Website
    Page->>PageMachine: Create with websiteId
    PageMachine->>PageMachine: LOAD_PAGES event
    PageMachine->>Supabase: Query pages for website
    Supabase-->>PageMachine: Return pages data
    PageMachine-->>Page: Update state to success.list
    Page->>User: Render page list

    User->>PageList: Click on a page
    PageList->>PageMachine: SELECT_PAGE event
    PageMachine-->>PageMachine: Update state to success.selected
    PageMachine-->>PageSelected: Render selected page
    PageSelected->>User: Show page details

    User->>PageSelected: Click back button
    PageSelected->>PageMachine: BACK event
    PageMachine-->>PageMachine: Update state to success.list
    PageMachine-->>PageList: Render page list again
```

## State Management

The page machine has the following states:

1. **idle**: Initial state before any pages are loaded
2. **loading**: Actively fetching pages from the database
3. **success**: Pages successfully loaded
   - **list**: Displaying the list of pages
   - **selected**: Displaying a selected page's details
4. **error**: An error occurred while loading pages

Each component checks the current state and only renders when appropriate:

```mermaid
flowchart TD
    A[Page Machine State] -->|loading| B[Skeleton Components]
    A -->|error| C[PageError Component]
    A -->|success.list + pages.length > 0| D[PageList Component]
    A -->|success.list + pages.length === 0| E[PageListEmpty Component]
    A -->|success.selected| F[PageSelected Component]
```

## Usage

```tsx
// In a parent component
import { Page } from "@/components/page/page"

function WebsiteDetails() {
  return (
    <Page debug={process.env.NODE_ENV === "development"}>
      {/* Additional content that will be rendered inside PageSelected */}
    </Page>
  )
}
```

## Events

The page machine responds to the following events:

- **LOAD_PAGES**: Triggers loading of pages for the current website
- **REFRESH**: Refreshes the current list of pages
- **RETRY**: Retries loading pages after an error
- **WEBSITE_CHANGED**: Triggered when the selected website changes
- **SELECT_PAGE**: Selects a page to view its details
- **BACK**: Returns from the selected page to the page list

## Context

The page machine context contains:

- **websiteId**: ID of the current website
- **pages**: Array of page objects
- **selectedPage**: Currently selected page (or null if none selected)
- **error**: Error object if an error occurred
