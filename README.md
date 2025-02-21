# Web Accessibility Audit Toolset

A Chrome extension built with Plasmo that accelerates web accessibility audits by providing Photoshop-style tools for DOM analysis.

## Core Purpose

Enable web accessibility auditors to complete thorough audits in under 1 hour by providing:

- Quick DOM analysis tools
- Automated accessibility checks
- Efficient reporting mechanisms
- Visual inspection aids

## Core Requirements

- Chrome Extension using Plasmo framework
- State management with XState 5 (actor model)
- Accessibility-focused DOM analysis tools for the active tab
- Photoshop-style tool selection system for rapid switching between audit tools

## Development Plan

Building in small, incremental steps with Git commits for each change:

1. Basic extension setup
2. Tool selection system with focus on audit workflow
3. Core accessibility audit tools:
   - ARIA attribute inspector
   - Color contrast analyzer
   - Heading structure validator
   - Focus order checker
4. State management with XState

## Tech Stack

- Plasmo (@Web @https://docs.plasmo.com/)
- XState 5 (@Web @https://stately.ai/docs/quick-start)
- TypeScript
- React
- shadcn/ui components (from existing @ui implementation)
  - Using pre-built components like:
    - Dropdown menu
    - Tooltips
    - Toggle groups
    - Command palette
    - And more...

## Project Status

Initial planning phase - preparing for incremental development with focus on building efficient accessibility audit tools.
