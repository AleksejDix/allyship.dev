import { AltTextAnalyzer } from '@/components/accessibility/alt-text-analyzer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alt Text Analyzer - Allyship',
  description:
    'Analyze your image alt text for WCAG compliance and proper accessibility',
}

export default function AltTextAnalyzerPage() {
  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Alt Text Analyzer
          </h1>
          <p className="text-gray-600">
            Analyze your image alt text to ensure it properly describes image
            content and complies with WCAG accessibility guidelines.
          </p>
        </div>

        <AltTextAnalyzer />

        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">About Alt Text</h2>
            <p className="text-gray-700">
              Alternative text (alt text) provides a textual alternative to
              non-text content such as images. It's essential for accessibility
              as it allows people who use screen readers or have images disabled
              to understand the content and function of images on a web page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">WCAG Requirements</h2>
            <p className="text-gray-700 mb-3">
              According to WCAG 2.1 Success Criterion 1.1.1: Non-text Content,
              all non-text content needs a text alternative that serves an
              equivalent purpose. Good alt text should:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Be concise but descriptive</li>
              <li>Convey the purpose and content of the image</li>
              <li>Not include phrases like "image of" or "picture of"</li>
              <li>For decorative images, use empty alt text (alt="")</li>
              <li>
                For complex images like charts, provide detailed descriptions
              </li>
              <li>
                For functional images (like buttons), describe their function
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How to Use This Tool</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              <li>Enter the URL of the image you want to analyze</li>
              <li>Add the alt text you're using or considering</li>
              <li>Click "Analyze Alt Text" to get an AI-powered assessment</li>
              <li>
                Review the analysis results and suggestions for improvement
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
