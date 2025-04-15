// Text utilities module

/**
 * Extracts representative text from the document for language analysis
 * Takes samples from the beginning, middle, and end of the page, and considers
 * the importance of headings and main content
 */
export function extractRepresentativeText(): string {
  try {
    console.log('[TEXT] 📄 Starting text extraction for language analysis...');
    
    // Create an object to store collected text by sections
    const textSections: {
      headings: string[];
      mainContent: string[];
      navigationText: string[];
      otherText: string[];
    } = {
      headings: [],
      mainContent: [],
      navigationText: [],
      otherText: []
    };
    
    // 1. Collect headings - they are usually most indicative of the page language
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    for (const heading of headings) {
      const text = heading.textContent?.trim() || '';
      if (text.length > 5) {
        textSections.headings.push(text);
      }
    }
    
    // 2. Collect main content with high priority
    const mainContentSelectors = [
      'main p', 'article p', '.content p', '#content p',
      'section p', '.main-content p', '.post-content p',
      '.article-content p', '.entry-content p'
    ];
    
    const mainContentQuery = mainContentSelectors.join(', ');
    const mainContentElements = Array.from(document.querySelectorAll(mainContentQuery));
    
    for (const element of mainContentElements) {
      const text = element.textContent?.trim() || '';
      if (text.length > 10) {
        textSections.mainContent.push(text);
      }
    }
    
    // 3. Collect navigation text - usually standard phrases in the site's language
    const navElements = Array.from(document.querySelectorAll('nav a, header a, footer a, .menu a, .navigation a'));
    for (const element of navElements) {
      const text = element.textContent?.trim() || '';
      if (text.length > 2 && text.length < 30) {
        textSections.navigationText.push(text);
      }
    }
    
    // 4. Collect other visible text
    const otherTextElements = Array.from(document.querySelectorAll(
      'p, li, span, div, button, label, figcaption'
    )).filter(el => {
      // Filter out empty and hidden elements
      const text = el.textContent?.trim();
      if (!text || text.length < 5) return false;
      
      // Check visibility
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    
    for (const element of otherTextElements) {
      const text = element.textContent?.trim() || '';
      // Check if this text is not duplicated in other sections
      const isUnique = !textSections.headings.includes(text) && 
                      !textSections.mainContent.includes(text) && 
                      !textSections.navigationText.includes(text);
      
      if (isUnique && text.length > 5) {
        textSections.otherText.push(text);
      }
    }
    
    // Log collected data
    console.log(`[TEXT] 📊 Collected ${textSections.headings.length} headings, ${textSections.mainContent.length} main content blocks, ${textSections.navigationText.length} navigation elements, ${textSections.otherText.length} other text blocks`);
    
    // Prioritize texts for analysis
    let combinedText = '';
    
    // First add headings (maximum 5)
    if (textSections.headings.length > 0) {
      combinedText += textSections.headings.slice(0, 5).join('\n') + '\n\n';
    }
    
    // Then add main content (maximum 1500 characters)
    if (textSections.mainContent.length > 0) {
      let mainContentText = '';
      for (const text of textSections.mainContent) {
        if (mainContentText.length + text.length < 1500) {
          mainContentText += text + '\n';
        } else {
          break;
        }
      }
      combinedText += mainContentText + '\n';
    }
    
    // Add a selection of navigation elements (no more than 300 characters)
    if (textSections.navigationText.length > 0) {
      let navText = '';
      // Take elements with stride to cover different parts of navigation
      const stride = Math.max(1, Math.floor(textSections.navigationText.length / 5));
      for (let i = 0; i < textSections.navigationText.length; i += stride) {
        const text = textSections.navigationText[i];
        if (navText.length + text.length < 300) {
          navText += text + ', ';
        } else {
          break;
        }
      }
      combinedText += "Navigation elements: " + navText + '\n\n';
    }
    
    // Add a selection of other texts (no more than 500 characters)
    if (textSections.otherText.length > 0) {
      let otherText = '';
      // Select elements evenly from beginning, middle, and end
      const samplingPoints = [0, Math.floor(textSections.otherText.length / 2), textSections.otherText.length - 1];
      
      for (const idx of samplingPoints) {
        if (idx < textSections.otherText.length && otherText.length < 500) {
          otherText += textSections.otherText[idx] + '\n';
        }
      }
      
      combinedText += otherText;
    }
    
    // Final check for text size
    const finalText = combinedText.trim();
    
    // If the text is too long, truncate it
    const maxLength = 2000;
    const result = finalText.length > maxLength ? finalText.substring(0, maxLength) : finalText;
    
    console.log(`[TEXT] ✅ Extracted ${result.length} characters of representative text`);
    
    return result;
  } catch (error) {
    // In case of error, return an empty string
    console.error(`[ERROR] ❌ Error while extracting text: ${String(error)}`);
    return '';
  }
}

/**
 * Gets all text nodes in the current DOM
 */
export function getTextNodesFromDOM(): Text[] {
  // Function for recursive DOM traversal
  function getTextNodes(node: Node): Text[] {
    let textNodes: Text[] = [];
    
    // If this is a text node with non-empty content, add it
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text && text.length > 0) {
        textNodes.push(node as Text);
      }
      return textNodes;
    }
    
    // Skip scripts, styles, etc.
    if (
      node.nodeName === 'SCRIPT' || 
      node.nodeName === 'STYLE' || 
      node.nodeName === 'NOSCRIPT' ||
      node.nodeName === 'IFRAME' ||
      node.nodeName === 'SVG'
    ) {
      return textNodes;
    }
    
    // If the node has child elements, traverse them
    for (let i = 0; i < node.childNodes.length; i++) {
      textNodes = textNodes.concat(getTextNodes(node.childNodes[i]));
    }
    
    return textNodes;
  }
  
  // Start from the document body
  return getTextNodes(document.body);
}

/**
 * Extracts JSON from OpenAI response that may contain Markdown formatting
 */
export function extractJSONFromMarkdown(text: string): string {
  try {
    // Check if the text contains a markdown code block with JSON
    const jsonBlockRegex = /```(?:json)?\s*\n([\s\S]*?)\n```/;
    const match = text.match(jsonBlockRegex);
    
    if (match && match[1]) {
      // Return the content of the code block without Markdown formatting
      console.log('[JSON] 🔧 Extracted JSON from Markdown code block');
      return match[1].trim();
    }
    
    // If there's no code block, return the original text
    console.log('[JSON] ℹ️ Markdown block not found, using original text');
    return text;
  } catch (error) {
    // In case of error, return the original text
    console.error(`[ERROR] ⚠️ Error extracting JSON from Markdown: ${error}`);
    return text;
  }
}

/**
 * Simple hash function for text
 */
export function simpleHash(str: string): string {
  // Take the first and last 50 characters to reduce collision probability
  // with small changes in the text
  const start = str.substring(0, 50);
  const end = str.length > 100 ? str.substring(str.length - 50) : '';
  const sampleToHash = start + str.length + end;
  
  // Simple hash function for string
  let hash = 0;
  for (let i = 0; i < sampleToHash.length; i++) {
    const char = sampleToHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Return string representation of the hash as a number
  return hash.toString(16);
} 