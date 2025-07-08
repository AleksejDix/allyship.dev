---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: ['enhancement', 'needs-discussion']
assignees: ''
---

## 💡 Feature Description

A clear and concise description of the feature you'd like to see added.

## 🎯 Problem Statement

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## 🚀 Proposed Solution

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

## 🔄 Use Case

**Describe your specific use case**
Help us understand how this feature would be used:

- What accessibility testing scenario does this address?
- How would this improve the developer experience?
- What testing patterns would this enable?

## 💻 API Design (Optional)

**How do you envision this feature working?**

```javascript
// Example of how you'd like to use this feature
import { describe, test, newFeature } from '@allystudio/test'

describe('Example Usage', () => {
  test('uses new feature', (ctx) => {
    // How would the API work?
    newFeature(ctx.element, options)
  })
}, 'selector')
```

## 🔀 Alternatives Considered

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

## 📊 Impact Assessment

**Bundle Size Consideration**
- [ ] This feature is essential and worth the bundle size impact
- [ ] This feature should be optional/plugin-based to minimize core bundle
- [ ] This feature can be implemented with minimal size impact
- [ ] I haven't considered bundle size impact

**Complexity Assessment**
- [ ] This feature aligns with the minimalist philosophy
- [ ] This feature adds necessary complexity for significant value
- [ ] This feature might be over-engineering
- [ ] I'm not sure about complexity implications

## 🌐 Browser/Environment Support

**Where should this feature work?**
- [ ] Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] Node.js environments (headless testing)
- [ ] Chrome extensions
- [ ] All of the above

## 🔗 Related Issues

**Are there any related issues or discussions?**
- Link to related issues: #
- Related discussions:
- External references:

## 📚 Research

**Have you researched existing solutions?**
- [ ] I've checked if this exists in other testing libraries
- [ ] I've looked for existing workarounds
- [ ] I've considered if this belongs in a plugin vs core
- [ ] I've reviewed the project's minimalist principles

**Existing implementations:**
- Library X does this by: [description]
- Workaround I'm currently using: [description]

## 🏷️ Priority

**How important is this feature for your use case?**

- [ ] **Critical** - Blocks adoption of the library
- [ ] **High** - Significantly improves developer experience
- [ ] **Medium** - Nice improvement but has workarounds
- [ ] **Low** - Minor enhancement

## 🎨 Plugin vs Core

**Should this be a plugin or core feature?**

- [ ] **Core Feature** - Essential for all users
- [ ] **Built-in Plugin** - Useful for most users, included by default
- [ ] **Optional Plugin** - Specialized use case, separate package
- [ ] **Not Sure** - Need guidance on architecture

## ✅ Checklist

Before submitting, please ensure:

- [ ] I have searched existing issues and discussions
- [ ] I have considered the minimalist philosophy of this library
- [ ] I have thought about bundle size implications
- [ ] I have provided a clear use case and justification
- [ ] I have considered if this belongs in core vs plugin
- [ ] I have checked if similar functionality exists elsewhere

## 🔮 Future Considerations

**How might this feature evolve?**
- Could this feature lead to scope creep?
- Are there related features that might be requested?
- How does this fit with the long-term vision?

---

**Thank you for helping improve @allystudio/test! 🚀**

*Remember: The best feature is often the one that doesn't need to be added. We prioritize simplicity and focus over feature completeness.*
