---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## 🐛 Bug Description

A clear and concise description of what the bug is.

## 🔄 Reproduction Steps

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## ✅ Expected Behavior

A clear and concise description of what you expected to happen.

## ❌ Actual Behavior

A clear and concise description of what actually happened.

## 💻 Code Sample

Please provide a minimal code sample that demonstrates the issue:

```javascript
import { describe, test, expect, run } from '@allystudio/test'

// Your reproduction code here
describe('Bug Example', () => {
  test('reproduces the issue', (ctx) => {
    // Minimal code that shows the problem
  })
}, 'selector')

run().then(console.log)
```

## 🌐 Environment

**Library Version:**
- @allystudio/test version: [e.g. 0.9.0-beta.1]

**Browser (if applicable):**
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 119.0.6045.105]

**Node.js (if applicable):**
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 9.8.1]

**Operating System:**
- OS: [e.g. macOS, Windows, Linux]
- Version: [e.g. macOS 14.1, Windows 11, Ubuntu 22.04]

**Testing Environment:**
- Test runner: [e.g. Vitest, Jest, Browser, Chrome Extension]
- Framework: [e.g. React, Vue, Vanilla JS]

## 📄 Error Messages

If applicable, paste the full error message and stack trace:

```
Error message here...
```

## 📸 Screenshots

If applicable, add screenshots to help explain your problem.

## 🔍 Additional Context

Add any other context about the problem here:

- Does this happen consistently or intermittently?
- Did this work in a previous version?
- Are there any workarounds you've found?
- Related issues or discussions?

## ✅ Checklist

Before submitting, please ensure:

- [ ] I have searched existing issues to avoid duplicates
- [ ] I have provided a minimal reproduction case
- [ ] I have included all relevant environment information
- [ ] I have checked the [documentation](README.md) and [API reference](API.md)
- [ ] The issue is related to @allystudio/test (not a browser or framework issue)

## 🏷️ Priority

How critical is this issue for your use case?

- [ ] **Critical** - Blocks my work completely
- [ ] **High** - Significantly impacts my workflow
- [ ] **Medium** - Minor inconvenience but has workaround
- [ ] **Low** - Nice to have fix

---

**Thank you for taking the time to report this issue! 🙏**
