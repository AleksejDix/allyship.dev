# URL Monitoring Feature

The connector integrates with the browser extension to monitor and highlight the current URL.

## Current URL Detection

- Uses the `useCurrentUrl` hook from `url-provider.tsx` to get the current URL
- Extracts the domain and path for comparison with known records
- Normalizes URLs automatically to ensure consistent matching

## Status Highlighting

- Color highlights indicate known domains/paths (using theme-aware colors)
- Visual badges show "Known" or "Unknown" status
- All colors adapt to current theme (light/dark mode)
- Icons reinforce status indicators for better accessibility

## Status States

- **Loading**: Initial state while checking URL against database
- **Connected**: Current URL matches a known website and page
- **Disconnected**: Current URL does not match known records
- **Partial Match**: Website is known but page is not (or vice versa)

## Smart Behavior

- Auto-selects the current website and page when navigating
- Always keeps form input synchronized with current browser tab data
- Visual indicators show when form inputs match current URL
- Temporary notification appears when form is auto-filled

## Implementation Logic

- Compares normalized URLs for domain matching
- Matches paths exactly for page recognition
- Updates highlighting in real-time as the user browses
- Synchronizes form inputs whenever the tab URL changes

## Quick Add Feature

The "Quick Add" button provides one-click creation of websites and pages:

1. If current website exists but page doesn't:

   - Creates only the missing page
   - Shows optimistic UI update immediately

2. If neither website nor page exists:

   - Creates both website and page in sequence
   - Shows optimistic UI updates for both

3. If both website and page exist:
   - Button is disabled with "Page exists" label

## URL Normalization

All URLs are normalized before storage or comparison:

- **Domains**: Removed protocol, www, and trailing slashes

  - `https://www.example.com/` → `example.com`

- **Paths**: Standardized to start with a slash

  - `/path/to/page` and `path/to/page` → `/path/to/page`

- **Queries and Fragments**: Removed from stored URLs
  - `/path?query=value#section` → `/path`
