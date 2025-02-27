# Accessibility Tools

This directory contains various accessibility tools that can be used to check and improve the accessibility of web pages.

## Readability Tool

The readability tool analyzes text content on a page and provides readability scores based on the Flesch-Kincaid Grade Level scale. This helps ensure that content is accessible to users with different reading abilities.

### How It Works

1. The tool identifies paragraphs and other text content on the page
2. It sends the text to an API endpoint that uses AI to analyze readability
3. Results are displayed as score indicators next to each paragraph
4. Scores are color-coded:
   - Green (1-6): Basic level, easy to read
   - Yellow (7-12): Average level, requires basic education
   - Red (13+): Advanced level, requires higher education

### Usage

#### Standalone Button

```tsx
import { ReadabilityButton } from '@/components/tools/readability-button'

export default function MyPage() {
  return (
    <div>
      <ReadabilityButton />
      <article>
        <p>Your content here...</p>
      </article>
    </div>
  )
}
```

#### In Toolbar

The readability tool is already integrated into the accessibility toolbar.

### API Endpoint

The tool uses the `/api/readability` endpoint which accepts POST requests with the following payload:

```json
{
  "text": "The text to analyze",
  "systemPrompt": "Optional system prompt to customize the analysis"
}
```

The endpoint returns a JSON response with:

```json
{
  "score": 8.5,
  "explanation": "Brief explanation of the score",
  "details": ["List of complex words, terms, and sentences"]
}
```

### Example

See a working example at `/examples/readability`.

## Other Tools

The tools directory includes various other accessibility tools:

- Heading structure checker
- Landmarks validator
- ARIA roles validator
- Focus order tracker
- Keyboard accessibility checker
- Form labels checker
- Color contrast checker
- Image alt text checker
- Link labels checker
- Language checker
- External links checker
