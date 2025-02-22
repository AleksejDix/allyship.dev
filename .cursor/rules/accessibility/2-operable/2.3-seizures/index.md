---
title: "Guideline 2.3 – Seizures and Physical Reactions"
description: "Do not design content in a way that is known to cause seizures or physical reactions"
category: "Operable"
tags: ["seizures", "flashing", "animation", "safety"]
---

# Guideline 2.3 – Seizures and Physical Reactions

## Overview

This guideline ensures that content does not cause seizures or adverse physical reactions. This is crucial for users with photosensitive epilepsy and other conditions that can be triggered by flashing content, rapid transitions, or certain motion patterns.

## Success Criteria

### [2.3.1 Three Flashes or Below Threshold (Level A)](./2.3.1-three-flashes.md)

- Web pages must not contain anything that flashes more than three times per second
- If flashing occurs, it must be below the general flash and red flash thresholds
- Content must be tested for potentially harmful flash patterns

## Why This Matters

Safe content design is essential because:

- Flashing content can trigger seizures
- Motion can cause vestibular disorders
- Rapid changes can cause disorientation
- Physical reactions can be severe
- Recovery time can be significant

## Implementation Approaches

1. **Flash Prevention**

   - Avoid rapid flashing
   - Test flash frequencies
   - Measure relative luminance
   - Calculate flash thresholds

2. **Animation Safety**

   - Use reduced motion
   - Provide animation controls
   - Limit animation speed
   - Allow animation disabling

3. **Content Warnings**

   - Warn about potential triggers
   - Provide skip options
   - Include content descriptions
   - Offer alternative versions

4. **Testing Methods**
   - Use flash analysis tools
   - Measure animation rates
   - Test across devices
   - Validate safety thresholds

## Common Patterns

### Safe Animation Controls

```tsx
function AnimatedContent() {
  const [isEnabled, setIsEnabled] = useState(false)
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  // Respect system preferences
  const shouldAnimate = isEnabled && !prefersReducedMotion

  return (
    <div role="region" aria-label="Animated content">
      <div className="animation-warning">
        <strong>Warning:</strong> This content contains animations
      </div>

      <div className="animation-controls">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          aria-pressed={isEnabled}
        >
          {isEnabled ? "Disable" : "Enable"} Animations
        </button>
      </div>

      <div className={cn("content", shouldAnimate && "animate-safely")}>
        {/* Content with safe animations */}
      </div>
    </div>
  )
}
```

### Reduced Motion Support

```tsx
// In your global styles or CSS module
const styles = {
  // Base animation that respects user preferences
  "@media (prefers-reduced-motion: no-preference)": {
    ".safe-animation": {
      transition: "transform 0.3s ease-in-out",
    },
  },

  // Remove animations for users who prefer reduced motion
  "@media (prefers-reduced-motion: reduce)": {
    ".safe-animation": {
      transition: "none",
    },
  },
}

// Usage in components
function SafeTransition() {
  return (
    <div className="safe-animation">{/* Content with safe transitions */}</div>
  )
}
```

## Testing Checklist

1. **Flash Analysis**

   - Test flash frequencies
   - Measure luminance changes
   - Check color transitions
   - Validate against thresholds

2. **Motion Testing**

   - Check animation speeds
   - Test transition rates
   - Verify motion paths
   - Validate parallax effects

3. **Device Testing**

   - Test across screen sizes
   - Check different refresh rates
   - Verify on mobile devices
   - Test in various conditions

4. **Preference Testing**
   - Check reduced motion support
   - Test animation controls
   - Verify warning systems
   - Validate skip mechanisms

## Resources

- [W3C - Understanding Seizures and Physical Reactions](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html)
- [PEAT Tool - Photosensitive Epilepsy Analysis Tool](https://trace.umd.edu/peat/)
- [WebAIM - Seizure Disorders](https://webaim.org/articles/seizure/)
- [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
