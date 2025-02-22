---
title: "Guideline 1.4 – Distinguishable"
description: "Make it easier for users to see and hear content including separating foreground from background"
category: "Perceivable"
tags: ["color", "contrast", "audio", "visual", "text"]
---

# Guideline 1.4 – Distinguishable

## Overview

This guideline ensures that content is easy to see and hear, including separating foreground from background. This is crucial for users with visual or auditory disabilities, as well as those using the content in different environments or with different devices.

## Success Criteria

### [1.4.1 Use of Color (Level A)](./1.4.1-use-of-color.md)

- Color is not used as the only visual means of conveying information
- Include text or icons to supplement color-based information
- Ensure patterns or underlines for links

### [1.4.2 Audio Control (Level A)](./1.4.2-audio-control.md)

- Provide mechanism to pause, stop, or control audio volume
- Audio must not play automatically for more than 3 seconds
- Allow independent volume control

### [1.4.3 Contrast (Minimum) (Level AA)](./1.4.3-contrast-minimum.md)

- Text has sufficient contrast ratio with its background
- Large text can have slightly lower contrast
- Ensure contrast for images of text

### [1.4.4 Resize Text (Level AA)](./1.4.4-resize-text.md)

- Text can be resized up to 200% without loss of functionality
- No horizontal scrolling required
- Content remains readable and usable

### [1.4.5 Images of Text (Level AA)](./1.4.5-images-of-text.md)

- Use actual text instead of images of text
- Allow customization of text presentation
- Exceptions for logos and essential images

## Why This Matters

Distinguishable content is essential because it:

- Makes content accessible to users with low vision
- Helps users with color blindness understand information
- Supports users in different environmental conditions
- Ensures content is usable on various devices
- Accommodates user preferences and needs

## Implementation Approaches

1. **Color Usage**

   - Never rely solely on color
   - Provide multiple visual indicators
   - Use patterns and icons
   - Include text labels

2. **Audio Control**

   - Provide clear audio controls
   - Respect system volume settings
   - Allow independent control
   - Avoid autoplay

3. **Visual Contrast**

   - Test contrast ratios
   - Use sufficient color contrast
   - Consider different text sizes
   - Account for hover states

4. **Text Presentation**
   - Use real text where possible
   - Support text resizing
   - Maintain readability
   - Allow customization

## Common Patterns

### Color and Icons

```tsx
// ❌ Avoid
<div className="status-indicator">
  <div className={status === "error" ? "text-red-500" : "text-green-500"}>
    Status
  </div>
</div>

// ✅ Do
<div
  className="status-indicator"
  role="status"
>
  <div className={cn(
    "flex items-center gap-2",
    status === "error"
      ? "text-red-500"
      : "text-green-500"
  )}>
    <StatusIcon aria-hidden="true" />
    <span>
      {status === "error" ? "Error" : "Success"}
    </span>
  </div>
</div>
```

### Audio Player

```tsx
function AudioPlayer() {
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  return (
    <div role="region" aria-label="Audio player">
      <audio ref={audioRef} src="/audio.mp3" preload="metadata" />

      <div className="audio-controls">
        <button
          onClick={() => audioRef.current?.play()}
          aria-label="Play audio"
        >
          <PlayIcon aria-hidden="true" />
        </button>

        <button
          onClick={() => audioRef.current?.pause()}
          aria-label="Pause audio"
        >
          <PauseIcon aria-hidden="true" />
        </button>

        <div className="volume-control">
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const value = Number(e.target.value)
              setVolume(value)
              if (audioRef.current) {
                audioRef.current.volume = value
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

### Text Contrast

```tsx
// ❌ Avoid
<div className="bg-gray-200">
  <p className="text-gray-500">
    Low contrast text
  </p>
</div>

// ✅ Do
<div className="bg-white">
  <p className="text-gray-900">
    High contrast text
  </p>
  <span className="sr-only">
    (Contrast ratio 21:1)
  </span>
</div>
```

## Testing Checklist

1. **Color Testing**

   - View in grayscale
   - Check color blindness simulation
   - Verify multiple indicators
   - Test interactive states

2. **Audio Testing**

   - Check volume controls
   - Test autoplay behavior
   - Verify independent control
   - Validate pause functionality

3. **Contrast Testing**

   - Measure contrast ratios
   - Test different text sizes
   - Check interactive states
   - Verify in different conditions

4. **Text Testing**
   - Test text resizing
   - Check reflow behavior
   - Verify readability
   - Validate customization

## Resources

- [W3C WAI - Making Content Distinguishable](https://www.w3.org/WAI/WCAG21/Understanding/distinguishable)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Oracle - Color Blindness Simulator](https://colororacle.org/)
- [MDN - CSS and JavaScript accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript)
