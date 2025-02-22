---
title: "Guideline 1.2 – Time-based Media"
description: "Provide alternatives for time-based media"
category: "Perceivable"
tags: ["media", "video", "audio", "captions", "transcripts"]
---

# Guideline 1.2 – Time-based Media

## Overview

This guideline ensures that time-based media (audio and video) is accessible to all users, regardless of their ability to see or hear the content. It requires providing alternatives such as captions, audio descriptions, and transcripts that make the content accessible to users with different needs.

## Success Criteria

### [1.2.1 Audio-only and Video-only (Level A)](./1.2.1-audio-video-only.md)

- Provide text transcript for audio-only content
- Provide text transcript or audio description for video-only content

### [1.2.2 Captions (Level A)](./1.2.2-captions-prerecorded.md)

- Provide captions for all prerecorded audio content in synchronized media
- Include all dialogue and important sound effects
- Synchronize captions with the audio

### [1.2.3 Audio Description or Media Alternative (Level A)](./1.2.3-audio-description.md)

- Provide audio descriptions or media alternative for video content
- Describe important visual information not available in the audio track

## Why This Matters

Time-based media alternatives are essential because they:

- Enable deaf users to understand audio content through captions
- Allow blind users to understand video content through audio descriptions
- Support users in noisy environments who can't hear audio
- Help users in quiet environments who can't play audio
- Assist non-native speakers with content comprehension
- Improve content indexing and searchability

## Implementation Approaches

1. **Captions**

   - Use WebVTT format for captions
   - Synchronize with audio content
   - Include speaker identification
   - Note important sound effects

2. **Transcripts**

   - Provide complete text alternatives
   - Include descriptions of visual content
   - Make transcripts easily discoverable
   - Support multiple formats (HTML, PDF)

3. **Audio Descriptions**

   - Describe important visual information
   - Time descriptions between dialogue
   - Provide extended descriptions if needed
   - Consider separate audio tracks

4. **Media Players**
   - Support caption display
   - Allow toggling audio descriptions
   - Provide transcript access
   - Include accessible controls

## Common Patterns

### Video with Captions and Transcript

```tsx
function AccessibleVideo() {
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <div role="region" aria-label="Video content with accessibility features">
      <video controls>
        <source src="/video.mp4" type="video/mp4" />
        <track
          kind="captions"
          src="/captions.vtt"
          srcLang="en"
          label="English captions"
          default
        />
        <track
          kind="descriptions"
          src="/descriptions.vtt"
          srcLang="en"
          label="Audio descriptions"
        />
      </video>

      <div className="media-controls">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          aria-expanded={showTranscript}
        >
          {showTranscript ? "Hide" : "Show"} Transcript
        </button>
      </div>

      {showTranscript && (
        <div className="transcript" role="doc-subtitle">
          <h2>Video Transcript</h2>
          <div className="transcript-content">{/* Transcript content */}</div>
        </div>
      )}
    </div>
  )
}
```

### Audio Player with Transcript

```tsx
function AccessibleAudio() {
  return (
    <div className="audio-content">
      <audio controls src="/podcast.mp3" aria-describedby="transcript" />

      <div id="transcript" className="transcript-section" role="doc-subtitle">
        <h2>Audio Transcript</h2>
        <div className="transcript-content">
          <p>Host: Welcome to our podcast...</p>
          <p>Guest: Thank you for having me...</p>
        </div>
        <a href="/transcript.pdf" download className="transcript-download">
          Download transcript (PDF)
        </a>
      </div>
    </div>
  )
}
```

## Testing Checklist

1. **Caption Testing**

   - Verify caption accuracy
   - Check caption timing
   - Ensure proper formatting
   - Test caption controls

2. **Audio Description Testing**

   - Check description timing
   - Verify important visual information is described
   - Test description controls
   - Ensure descriptions don't overlap dialogue

3. **Transcript Testing**

   - Verify transcript completeness
   - Check transcript accuracy
   - Test transcript discoverability
   - Validate transcript downloads

4. **Player Testing**
   - Test keyboard accessibility
   - Verify control labeling
   - Check feature toggling
   - Test across devices

## Resources

- [W3C WAI Media Tutorials](https://www.w3.org/WAI/tutorials/media/)
- [WebVTT Caption Format](https://w3c.github.io/webvtt/)
- [WebAIM - Captions, Transcripts, and Audio Descriptions](https://webaim.org/techniques/captions/)
- [Deque University - Media Accessibility](https://dequeuniversity.com/rules/axe/4.0/video-caption)
