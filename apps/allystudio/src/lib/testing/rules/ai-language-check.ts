import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"

import {
  getLanguageDisplayName,
  compareLanguageSubtags,
  getLanguageInfo,
  INCORRECT_LANGUAGE_CODES
} from '../utils/language-utils';

import {
  extractRepresentativeText,
} from '../utils/text-utils';

// Import LanguageAnalysisCache type using type-only import
import {
  cacheLanguageAnalysis,
  getCachedLanguageAnalysis
} from '../utils/analysis-cache';
import type { LanguageAnalysisCache } from '../utils/analysis-cache';

import { getUniqueSelector } from "@/lib/utils/selector-utils";

/**
 * Gets information about current time, URL and cache status
 * @returns Object with additional information for the report
 */
function getTimeAndCacheInfo(): {
  analysisTime: string;
  url: string;
  cacheStatus: string;
  formattedString: string;
} {
  try {
    // Get current date and time in local format
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();
    
    // Get current URL
    const currentUrl = window.location.href;
    
    // Get cache information from localStorage
    const cacheString = localStorage.getItem('ai_language_analysis_cache');
    const cache = cacheString ? JSON.parse(cacheString) : [];
    
    let cacheStatus = "Cache: empty";
    let formattedString = `📊 Analysis performed: ${formattedDate}, ${formattedTime}\n📌 URL: ${currentUrl}\n⏱️ Cache: empty`;
    
    // Check if there are entries in the cache
    if (cache.length === 0) {
      return {
        analysisTime: `${formattedDate}, ${formattedTime}`,
        url: currentUrl,
        cacheStatus: "empty",
        formattedString
      };
    }
    
    // Find the newest cache entry
    const latestCacheEntry = cache.reduce(
      (latest: LanguageAnalysisCache, current: LanguageAnalysisCache) => 
        (current.timestamp > latest.timestamp) ? current : latest, 
      cache[0]
    );
    
    // Calculate remaining time until cache expiration
    const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
    const elapsedTime = now.getTime() - latestCacheEntry.timestamp;
    const remainingTime = Math.max(0, CACHE_EXPIRATION - elapsedTime);
    
    // Format remaining time in minutes and seconds
    const remainingMinutes = Math.floor(remainingTime / 60000);
    const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
    
    cacheStatus = `${remainingMinutes} min ${remainingSeconds} sec until cleared`;
    formattedString = `📊 Analysis performed: ${formattedDate}, ${formattedTime}\n📌 URL: ${currentUrl}\n⏱️ Cache: ${cacheStatus}`;
    
    return {
      analysisTime: `${formattedDate}, ${formattedTime}`,
      url: currentUrl,
      cacheStatus,
      formattedString
    };
  } catch (error) {
    console.error('Error getting time and cache information:', error);
    const now = new Date();
    return {
      analysisTime: now.toLocaleString(),
      url: window.location.href,
      cacheStatus: "unknown",
      formattedString: `📊 Analysis performed: ${now.toLocaleString()}\n📌 URL: ${window.location.href}`
    };
  }
}

/**
 * Analyzes text language using OpenAI API
 * @param text Text for analysis
 * @param declaredLang Declared language
 * @returns Analysis result
 */
async function analyzeLanguageWithOpenAI(
  text: string,
  declaredLang: string
): Promise<{
  matches: boolean;
  detectedLanguage: string;
  confidence: number;
  details?: string;
}> {
  try {
    // Check if there's a result in the cache
    const cachedResult = getCachedLanguageAnalysis(declaredLang, text);
    if (cachedResult) {
      console.log('📦 Using cached language analysis result');
      return cachedResult;
    }
    
    // Get language information
    const langInfo = getLanguageInfo(declaredLang);
    
    // Display language name
    const declaredName = langInfo?.name || 'Unknown';
    
    // Take a sample of text no more than 2000 characters
    const textSample = text.substring(0, 2000);
    
    console.log(`🔍 Sending request to OpenAI for text language analysis...`);
    console.log(`📊 Declared language: "${declaredLang}" (${declaredName})`);
    console.log(`📋 Text sample (${textSample.length} characters): "${textSample.substring(0, 100)}..."`);
    
    // Get API key from environment variables
    const apiKey = process.env.PLASMO_PUBLIC_OPENAI_API_KEY;
    const isDevMode = process.env.PLASMO_PUBLIC_DEV_MODE === 'true';
    
    // Check for API key presence
    if (!apiKey) {
      console.log(`❌ Error: API key not found in environment variables`);
      
      // In development mode, return test data
      if (isDevMode) {
        console.log(`ℹ️ Development mode: returning test data`);
        return {
          matches: true,
          detectedLanguage: declaredLang,
          confidence: 0.95,
          details: "Test data in development mode (API key not found)"
        };
      }
      
      throw new Error("OpenAI API key not found");
    }
    
    console.log(`✅ API key found (${apiKey.substring(0, 7)}...)`);
    
    // Special cases for company names and organizations
    const isCompanyName = /\b(GmbH|Ltd|Inc|LLC|AG|Co\.|Corp\.?|Group|Oy|AB|SA|SRL|BV|Pvt)\b/i.test(textSample);
    
    // Determine adaptive threshold based on language
    const isIdeographicLang = /^(ja|zh|ko|th|my|km)/.test(declaredLang.toLowerCase());
    const minTextLength = isIdeographicLang ? 1 : 3; // Minimum threshold for analysis, GPT-4o can handle
    
    // If text contains company name and short, we consider the language matches the declared
    if (isCompanyName && textSample.length < 50) {
      console.log(`ℹ️ Company name or organization detected: "${textSample}"`);
      return {
        matches: true,
        detectedLanguage: declaredLang,
        confidence: 0.8,
        details: "Company name or organization (legal name remains in original form)"
      };
    }
    
    // If text is too short for analysis
    if (textSample.length < minTextLength) {
      console.log(`⚠️ Text too short for analysis (${textSample.length} characters, minimum for this language: ${minTextLength})`);
      return {
        matches: true, // We assume the language matches
        detectedLanguage: declaredLang,
        confidence: 0.5,
        details: "Text too short for reliable language analysis"
      };
    }
    
    // Create prompt for OpenAI with improved instructions
    const prompt = `Check if the text meets the WCAG 3.1.1 "Language of the page".

Input data:
- Declared language (lang): "${declaredLang}" (${declaredName})
- Text:
"""
${textSample}
"""

Task:
1. Determine the main language of the text according to BCP 47 standard (including region if unambiguous).
2. Compare it with the declared language according to the following rules:
   a. If base codes (part before the first hyphen) match (e.g., "en" in "en-US"), 
      consider languages as matching even if regional codes differ.
   b. Consider "ms" as "ms-MY", "en" as "en-GB", etc.
   c. Regional code refinement (e.g., "ms-MY" instead of just "ms") - this is additional
      precision, NOT an error. Never recommend "lowering" the granularity of the language code.

3. Check code and region according to standards:
   - Code must conform to BCP 47.
   - If region is specified, it must conform to ISO 3166-1.
   - Values "und", "zxx", "x-default" = error.
   - Incorrect or fictional regional codes (e.g., "XX", "00", "ZZ", "xx-XX") = error.
   - Syntactically correct but semantically meaningless constructions (e.g., "en-Latn-Cyrl") = error.

4. Interpreting language matches:
   - Set "matchesWithDeclared": true if base language code matches, EVEN IF region differs.
   - For example, "en" and "en-US" should have "matchesWithDeclared": true
   - "ms" and "ms-MY" should have "matchesWithDeclared": true
   - "fr" and "es" should have "matchesWithDeclared": false

5. For page elements (WCAG 3.1.2) apply the same rules.

6. Mark incorrect language codes as errors even without contradiction with content.

7. When incorrect base language code is found, recommend changing
   - If incorrect base language code is found (e.g., "fr" instead of "en"), recommend changing
     base code to the detected one.
   - If the same base code is found but without region (e.g., "ms" found but "ms-MY" specified),
     NEVER recommend removing the regional code. This is correct usage.
   - If incorrect or fictional regional code is found (e.g., "en-XX"),
     recommend using a valid regional code or removing it.

8. If mixed languages are present, specify their codes and percentage.

Answer in JSON format, for example:
{
  "detectedLanguage": "fr",
  "detectedLanguageName": "French",
  "confidence": 0.97,
  "matchesWithDeclared": true,
  "regionMatches": false,
  "wcagCompliance": "passed",
  "severity": null,
  "explanation": "Detected base language 'fr', which matches the declared code 'fr-FR'. The difference in regional code is not an error, the declared code is even preferable because it contains more information.",
  "mixedLanguages": [{"code": "en", "percent": 5}],
  "suggestions": []
}`;


    const model = "gpt-4o-mini"; // Using gpt-4o-mini for quick and accurate results

    console.log(`📡 Sending request to OpenAI (model: ${model}, max tokens: 800)`);
    
    // Request parameters
    const requestDetails = {
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert-linguist specializing in determining languages for web accessibility according to WCAG 3.1.1/3.1.2. You analyze the text of a web page and compare it with the declared language in the lang attribute."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for more accurate answers
      max_tokens: 800,
      response_format: { type: "json_object" } // Requesting JSON response
    };
    
    // Sending request to API
    console.log(`📤 Sending request to OpenAI API...`);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestDetails)
    });
    
    // Checking response status
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API error: ${response.status} ${response.statusText}`);
      console.log(`❌ Error details: ${errorText}`);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Processing response
    const apiResponse = await response.json();
    
    console.log(`✅ Received response from OpenAI (id: ${apiResponse.id})`);
    console.log(`📊 Model: ${apiResponse.model}, usage: ${JSON.stringify(apiResponse.usage)}`);
    
    const content = apiResponse.choices[0].message.content;
    console.log(`📋 Response: ${content.substring(0, 200)}...`);
    
    // Parsing JSON from response
    let result;
    try {
      result = JSON.parse(content);
      console.log(`✅ JSON successfully parsed`);
      
      // Logging more detailed data
      if (result.mixedLanguages && result.mixedLanguages.length > 0) {
        console.log(`🌐 Mixed languages detected: ${JSON.stringify(result.mixedLanguages)}`);
      }
      
      if (result.regionMatches === false) {
        console.log(`⚠️ Regional language variant does not match the declared`);
      }
    } catch (parseError) {
      console.log(`⚠️ JSON parsing error: ${String(parseError)}`);
      // If JSON parsing failed, try using regular expressions
      const langMatch = content.match(/detectedLanguage["\s:]+([a-z]{2}(-[A-Z]{2})?)/i);
      const confidenceMatch = content.match(/confidence["\s:]+([0-9.]+)/i);
      const matchesMatch = content.match(/matchesWithDeclared["\s:]+(\w+)/i);
      
      const extractedLang = langMatch ? langMatch[1] : "unknown";
      const extractedConfidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;
      const extractedMatches = matchesMatch ? matchesMatch[1].toLowerCase() === "true" : false;
      
      console.log(`🔄 Extracting data from text: language=${extractedLang}, confidence=${extractedConfidence}, match=${extractedMatches}`);
      
      result = {
        detectedLanguage: extractedLang,
        detectedLanguageName: "Unknown",
        confidence: extractedConfidence,
        matchesWithDeclared: extractedMatches,
        explanation: "Unable to get full explanation due to parsing error",
        suggestions: "Check text language manually"
      };
    }
    
    // Collecting details for output
    let details = "";
    
    // Adding main explanation
    if (result.explanation) {
      details += result.explanation;
    }
    
    // Adding information about mixed languages, if any are detected
    if (result.mixedLanguages && result.mixedLanguages.length > 0) {
      details += details ? " " : "";
      
      // Formatting mixed languages information for human-readable output
      const mixedLanguagesInfo = result.mixedLanguages.map((lang: { code: string; percent: number }) => {
        const langName = getLanguageDisplayName(lang.code);
        return `${langName} (${lang.percent}%)`;
      }).join(', ');
      
      details += `Mixed languages detected: ${mixedLanguagesInfo}.`;
    }
    
    // Adding suggestions, if any are present
    if (result.suggestions && !result.matchesWithDeclared) {
      details += details ? " " : "";
      details += result.suggestions;
    }
    
    // Determining if the language matches the declared
    // Considering match based on base language code (e.g., en-US and en-GB are considered matches based on base language)
    const declaredBaseCode = declaredLang.split('-')[0].toLowerCase();
    const detectedBaseCode = result.detectedLanguage.split('-')[0].toLowerCase();
    
    // Determining match based on base code
    const baseCodesMatch = declaredBaseCode === detectedBaseCode;
    
    // Determining match based on full code (including region)
    const fullCodesMatch = declaredLang.toLowerCase() === result.detectedLanguage.toLowerCase();
    
    // Extracting regional part of the declared and detected languages
    const declaredRegion = declaredLang.includes('-') ? declaredLang.split('-')[1].toLowerCase() : '';
    const detectedRegion = result.detectedLanguage.includes('-') ? result.detectedLanguage.split('-')[1].toLowerCase() : '';
    
    // Determining if regional codes differ
    const regionsAreDifferent = declaredRegion && detectedRegion && (declaredRegion !== detectedRegion);
    
    // Considering AI's opinion on match
    const aiThinksMatches = !!result.matchesWithDeclared;
    
    // CHANGED: Now AI's opinion has absolute priority
    // If API returned information about match, we use it
    const matches = result.hasOwnProperty('matchesWithDeclared') ? aiThinksMatches : baseCodesMatch;
    
    // Logging additional information for debugging
    console.log(`🔍 Detailed analysis of language match:
    - Declared language: ${declaredLang} (base: ${declaredBaseCode}, region: ${declaredRegion || 'none'})
    - Detected language: ${result.detectedLanguage} (base: ${detectedBaseCode}, region: ${detectedRegion || 'none'})
    - Match based on base code: ${baseCodesMatch ? 'yes' : 'no'}
    - Match based on full code: ${fullCodesMatch ? 'yes' : 'no'}
    - AI's opinion on match: ${aiThinksMatches ? 'match' : 'no match'}
    - Final decision: ${matches ? 'languages match' : 'languages do not match'}`);
    
    // Formatting final result
    const analysisResult = {
      matches: matches,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence,
      details: details
    };
    
    console.log(`📊 Analysis result: match=${matches}, detected=${result.detectedLanguage}, confidence=${result.confidence}`);
    
    // Adding caching at the end of the function before returning result
    // Caching result
    cacheLanguageAnalysis(declaredLang, text, analysisResult);
    
    return analysisResult;
  } catch (err: unknown) {
    // Handling errors
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(`❌ Error in language analysis: ${errorMessage}`);
    
    // In debug mode, simply consider languages as matching
    if (typeof window !== "undefined" && window.__ALLYSTUDIO__?.debug) {
      console.log(`⚠️ Debug mode active, considering languages as matching`);
      return {
        matches: true,
        detectedLanguage: declaredLang,
        confidence: 1.0,
        details: "Result in debug mode (simplified)"
      };
    }
    
    // In case of error, return information about the error
    return {
      matches: false,
      detectedLanguage: "unknown",
      confidence: 0,
      details: `Error in language analysis: ${errorMessage}`
    };
  }
}

/**
 * For <html> element, a special approach is needed, as the content will be too large
 * We'll add a new function to create a preview HTML element
 */
function createHtmlElementPreview(element: HTMLHtmlElement, langAttribute: string): string {
  try {
    // Create minimal HTML tag representation
    const langDisplay = langAttribute ? ` lang="${langAttribute}"` : '';
    return `<html${langDisplay}> ... </html>`;
  } catch (error) {
    console.error('Error creating HTML element preview:', error);
    return '<html> ... </html>';
  }
}

/**
 * ACT Rule: AI Language Check (WCAG 3.1.1)
 * Checks if the declared language of the page matches the actual content language
 * using artificial intelligence.
 */
const aiLanguageCheckRule = createACTRule(
  "ai-language-check",
  "AI Language Check",
  "Checking if the declared language of the page matches the actual content language using AI",
  {
    accessibility_requirements: getWCAGReference("3.1.1"),
    categories: [ACTRuleCategory.LANGUAGE],
    input_aspects: ["DOM Tree", "Rendered Page"],
    execute: async () => {
      // Adding indicator for test start
      console.log('▶️ Starting language check according to WCAG 3.1.1 (Language of the page)');
      
      // Checking document type
      const docType = document.doctype;
      const contentType = document.contentType;
      
      // Checking if this is XHTML (not applicable for XHTML 1.1)
      const isXHTML11 = docType && 
                       docType.publicId && 
                       docType.publicId.includes("-//W3C//DTD XHTML 1.1//");
      
      if (isXHTML11 || contentType !== "text/html") {
        console.log(`ℹ️ Rule not applicable: document type ${docType?.name || 'unknown'}, content type ${contentType}`);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "inapplicable",
          message: `This rule is applicable only to documents with content type text/html. Current content type: ${contentType}`,
          wcagCriteria: ["3.1.1"],
          metaInfo: getTimeAndCacheInfo()
        });
        
        return;
      }
      
      // Getting HTML element
      const htmlElement = document.documentElement;
      
      // Checking if this is really an HTML element, not SVG or Math
      if (htmlElement.tagName.toLowerCase() !== "html") {
        console.log(`ℹ️ Rule not applicable: root element ${htmlElement.tagName}, not HTML`);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "inapplicable",
          message: `This rule is applicable only to HTML elements. Current root element: ${htmlElement.tagName}`,
          wcagCriteria: ["3.1.1"],
          metaInfo: getTimeAndCacheInfo()
        });
        
        return;
      }
      
      // Checking lang attribute
      const langAttribute = htmlElement.getAttribute("lang");
      
      // Checking xml:lang attribute
      const xmlLangAttribute = htmlElement.getAttribute("xml:lang");
      
      console.log(`📝 Attributes: lang="${langAttribute || 'missing'}", xml:lang="${xmlLangAttribute || 'missing'}"`);
      
      // If xml:lang is missing or empty, this rule is not applicable for compatibility check
      if (!xmlLangAttribute || xmlLangAttribute === '') {
        console.log(`ℹ️ Compatibility check of lang and xml:lang not applicable: xml:lang attribute missing or empty`);
        // Continue checking only lang attribute
      } else {
        // Checking compatibility of lang and xml:lang, if both are present
        const comparison = compareLanguageSubtags(langAttribute || '', xmlLangAttribute);
        
        if (!comparison.matches) {
          // If main language subtags do not match, add an error
          actRuleRunner.addResult({
            rule: {
              id: "ai-language-check",
              name: "AI Language Check"
            },
            outcome: "failed",
            element: {
              selector: "html",
              html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute || "")
            },
            message: `Main language subtags in lang and xml:lang attributes do not match: lang="${langAttribute || 'missing'}" and xml:lang="${xmlLangAttribute}"`,
            impact: "serious",
            remediation: `Ensure that main language subtags in lang and xml:lang attributes match. 
              Correct one of the attributes, for example: <html lang="${comparison.primaryLang}-XX" xml:lang="${comparison.primaryLang}-XX">`,
            wcagCriteria: ["3.1.1"],
            helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
            metaInfo: getTimeAndCacheInfo()
          });
          
          // Returning, as this is a critical error
          return;
        } else {
          console.log("✅ lang and xml:lang attributes have compatible main language subtags");
          
          // Marking test success
          if (langAttribute && xmlLangAttribute) {
            actRuleRunner.addResult({
              rule: {
                id: "ai-language-check-xml",
                name: "Checking compatibility of lang and xml:lang"
              },
              outcome: "passed",
              element: {
                selector: "html",
                html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute)
              },
              message: `Main language subtags in lang and xml:lang attributes match: lang="${langAttribute}" and xml:lang="${xmlLangAttribute}"`,
              wcagCriteria: ["3.1.1"],
              metaInfo: getTimeAndCacheInfo()
            });
          }
        }
      }
      
      // If lang attribute is missing, register an error and end the work
      if (!langAttribute) {
        console.log('❌ HTML element does not have lang attribute');
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "failed",
          element: {
            selector: "html",
            html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, "")
          },
          message: "HTML element does not have lang attribute",
          impact: "serious",
          remediation:
            "Add lang attribute to HTML element with corresponding language code of the main content of the page (e.g., <html lang=\"ru\"> for Russian language)",
          wcagCriteria: ["3.1.1"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
          metaInfo: getTimeAndCacheInfo()
        });
        return;
      }
      
      console.log(`✅ Found lang attribute: "${langAttribute}"`);
      
      // Displaying language information
      const initialLangInfo = getLanguageInfo(langAttribute);
      if (initialLangInfo) {
        console.log(`📋 Declared language: ${initialLangInfo.name}${initialLangInfo.country ? ` (${initialLangInfo.country})` : ''}`);
      } else {
        console.log(`⚠️ Unknown language code: "${langAttribute}"`);
      }
      
      // Directly checking lang attribute
      const lowerCaseLang = langAttribute.toLowerCase().trim();
      const baseCode = lowerCaseLang.split('-')[0];
      const langInfo = getLanguageInfo(langAttribute);
      
      // Checking code language standardization
      if (!langInfo) {
        console.log(`⚠️ Unknown/non-standard language code: "${langAttribute}"`);
        
        // Checking if this code or its base code is in the list of known errors
        const baseCode = lowerCaseLang.split('-')[0];
        let suggestedCode = '';
        let suggestedName = '';
        
        if (INCORRECT_LANGUAGE_CODES[lowerCaseLang]) {
          suggestedCode = INCORRECT_LANGUAGE_CODES[lowerCaseLang];
          const suggestedInfo = getLanguageInfo(suggestedCode);
          suggestedName = suggestedInfo ? 
            `${suggestedInfo.name}${suggestedInfo.country ? ` (${suggestedInfo.country})` : ''}` : 
            suggestedCode;
          
          console.log(`🔎 Incorrect language code detected. Possibly meant: "${suggestedCode}" (${suggestedName})`);
        } else if (INCORRECT_LANGUAGE_CODES[baseCode]) {
          const correctedBase = INCORRECT_LANGUAGE_CODES[baseCode];
          const regionPart = lowerCaseLang.includes('-') ? `-${lowerCaseLang.split('-')[1]}` : '';
          suggestedCode = correctedBase + regionPart;
          
          const suggestedInfo = getLanguageInfo(suggestedCode);
          suggestedName = suggestedInfo ? 
            `${suggestedInfo.name}${suggestedInfo.country ? ` (${suggestedInfo.country})` : ''}` : 
            suggestedCode;
          
          console.log(`🔎 Incorrect base language code detected. Possibly meant: "${suggestedCode}" (${suggestedName})`);
        } else if (lowerCaseLang.includes('_')) {
          // Checking for use of underscore instead of hyphen
          suggestedCode = lowerCaseLang.replace(/_/g, '-');
          const suggestedInfo = getLanguageInfo(suggestedCode);
          if (suggestedInfo) {
            suggestedName = `${suggestedInfo.name}${suggestedInfo.country ? ` (${suggestedInfo.country})` : ''}`;
            console.log(`🔎 Incorrect language code format (using "_" instead of "-"). Correct format: "${suggestedCode}" (${suggestedName})`);
          }
        } else {
          // Checking if there might be a problem in the regional code
          const [lang, region] = lowerCaseLang.split('-');
          if (lang && region && lang === region) { 
            suggestedCode = lang;
            const suggestedInfo = getLanguageInfo(suggestedCode);
            suggestedName = suggestedInfo ? suggestedInfo.name : suggestedCode;
            console.log(`🔎 Excessive duplication in language code detected. Recommended: "${suggestedCode}" (${suggestedName})`);
          }
        }
        
        // Forming error message and recommendation
        let message = `Using incorrect or non-standard language code: "${langAttribute}"`;
        let remediation = `Code "${langAttribute}" does not conform to BCP47/ISO 639-1 standard.`;
        
        if (suggestedCode) {
          remediation += ` Recommended to use "${suggestedCode}" (${suggestedName})`;
        } else {
          remediation += ` Use standard language code, e.g., "en" for English, "ru" for Russian, etc.`;
        }
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "failed",
          element: {
            selector: "html",
            html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute),
            attributes: { lang: langAttribute }
          },
          message,
          impact: "moderate",
          remediation,
          wcagCriteria: ["3.1.1"],
          helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
          metaInfo: getTimeAndCacheInfo()
        });
      } else {
        console.log(`✅ Language code conforms to standards: "${langAttribute}" (${langInfo.name}${langInfo.country ? ` (${langInfo.country})` : ''})`);
      }
      
      // Continuing with checking language match with content
      // Using base language code for checking with OpenAI
      const actualLang = langInfo ? langAttribute : (baseCode ? baseCode : langAttribute);
      
      // Extracting sample text for analysis
      console.log(`📄 Extracting sample text for analysis...`);
      const sampleText = extractRepresentativeText();
      
      // Determining adaptive threshold based on language
      const isIdeographicLang = /^(ja|zh|ko|th|my|km)/.test(actualLang.toLowerCase());
      const minTextLength = isIdeographicLang ? 15 : 30; // Reducing threshold for the whole page
      
      // If not enough text for analysis, mark as not applicable
      if (!sampleText || sampleText.length < minTextLength) {
        console.log(`⚠️ Not enough text for analysis: ${sampleText?.length || 0} characters (minimum for this language: ${minTextLength})`);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "inapplicable",
          element: {
            selector: "html",
            html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute),
            attributes: { lang: langAttribute }
          },
          message: "Not enough text for language analysis of content",
          wcagCriteria: ["3.1.1"],
          metaInfo: getTimeAndCacheInfo()
        });
        return;
      }
      
      console.log(`✅ Extracted ${sampleText.length} characters of text`);
      
      // Analyzing language using AI, using normalized code
      console.log(`🔍 Starting language analysis using OpenAI...`);
      const analysis = await analyzeLanguageWithOpenAI(sampleText, actualLang);
      
        // Getting information about the actual language for display
      const detectedLangInfo = getLanguageInfo(analysis.detectedLanguage);
      const declaredLangInfo = getLanguageInfo(actualLang);
      
      // Forming human-readable language names
      const detectedDisplay = detectedLangInfo 
        ? `${detectedLangInfo.name}${detectedLangInfo.country ? ` (${detectedLangInfo.country})` : ''}` 
        : `Unknown language (${analysis.detectedLanguage})`;
        
      const declaredDisplay = declaredLangInfo 
        ? `${declaredLangInfo.name}${declaredLangInfo.country ? ` (${declaredLangInfo.country})` : ''}` 
        : `Unknown language (${actualLang})`;
      
      // Determining if we need to check only base language code or full code
      const declaredBaseLang = actualLang.split('-')[0].toLowerCase();
      const detectedBaseLang = analysis.detectedLanguage.split('-')[0].toLowerCase();
      
      // Considering languages as matching if base codes are the same
      // This corresponds to new instructions for AI
      const baseCodeMatches = declaredBaseLang === detectedBaseLang;
      
      // For backward compatibility, checking and AI's response
      if (!analysis.matches && !baseCodeMatches) {
        // Languages definitely do not match - process as error
        console.log(`❌ Language mismatch: declared "${declaredDisplay}" (${actualLang}), detected "${detectedDisplay}" (${analysis.detectedLanguage})`);
        
        // Creating detailed message about result for side panel
        let resultMessage = `Declared language "${declaredDisplay}" does not match actual content language "${detectedDisplay}" (confidence: ${analysis.confidence.toFixed(2)})`;
        
        // Adding information about mixed languages, if any are present in details
        if (analysis.details && analysis.details.includes("mixed languages")) {
          resultMessage += `. Mixed language content detected. Use lang attribute for elements with different language.`;
        }
        
        // Adding other details from analysis, but only if they don't contain region mentions
        if (analysis.details && 
            !resultMessage.includes(analysis.details) && 
            !analysis.details.includes("regional") &&
            !analysis.details.includes("region")) {
          resultMessage += ` ${analysis.details}`;
        }
        
        // Forming recommendation for correction
        // Note: We never recommend "lowering" code accuracy (e.g., from "ms-MY" to "ms")
        let remediation = "";
        
        // If base codes differ, recommend changing base code
        if (declaredBaseLang !== detectedBaseLang) {
          // If detected language has a regional code, suggest using full code
          if (analysis.detectedLanguage.includes('-')) {
            remediation = `Change lang attribute from "${langAttribute}" to "${analysis.detectedLanguage}" (${detectedDisplay})`;
          } else {
            // Otherwise, consider current regional code if it exists
            const currentRegion = actualLang.includes('-') ? `-${actualLang.split('-')[1]}` : '';
            const suggestedLang = currentRegion ? `${analysis.detectedLanguage}${currentRegion}` : analysis.detectedLanguage;
            const suggestedDisplay = detectedLangInfo 
              ? `${detectedLangInfo.name}${currentRegion && declaredLangInfo?.country ? ` (${declaredLangInfo.country})` : ''}` 
              : `${analysis.detectedLanguage}${currentRegion}`;
              
            remediation = `Change lang attribute from "${langAttribute}" to "${suggestedLang}" (${suggestedDisplay})`;
          }
        } else {
          // If base codes match but AI still considers languages different,
          // recommend checking content
          remediation = `Check content of the page. Despite correct language code "${langAttribute}", 
            AI considers content as corresponding to language "${analysis.detectedLanguage}" (${detectedDisplay}).`;
        }
        
        // Adding alternative correction - changing content
        remediation += ` Or update content of the page to ${declaredDisplay}.`;
        
        // Adding log information for debugging
        console.log(`📊 Final information about language: declared "${declaredDisplay}" (${langAttribute}), detected "${detectedDisplay}" (${analysis.detectedLanguage}), match=${analysis.matches}`);
        
        const targetElement = getTargetElementForHighlight(htmlElement, resultMessage);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-check",
            name: "AI Language Check"
          },
          outcome: "failed",
          element: {
            selector: targetElement.selector,
            html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute),
            attributes: { lang: langAttribute }
          },
          message: resultMessage,
          impact: "serious",
          remediation: remediation,
          wcagCriteria: ["3.1.1"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
          metaInfo: getTimeAndCacheInfo()
        });
        return;
      }
      
      // If base codes match or AI considers languages matching,
      // consider the check passed
      
      // Forming message based on whether regional codes match
      const regionMessage = declaredBaseLang === detectedBaseLang && 
                           actualLang !== analysis.detectedLanguage.toLowerCase() ? 
        `. Difference in regional codes (${actualLang} vs ${analysis.detectedLanguage}), but this does not affect WCAG 3.1.1.` : '';
      
      console.log(`✅ Languages match: "${declaredDisplay}" matches detected "${detectedDisplay}"`);
      
      // Creating compact message about result
      let resultMessage = `Declared language "${declaredDisplay}" matches actual content language "${detectedDisplay}" (confidence: ${analysis.confidence.toFixed(2)})${regionMessage}`;
      
      // Adding information about mixed languages in compact format
      if (analysis.details && analysis.details.includes("mixed languages")) {
        resultMessage += `. Mixed language content detected.`;
      }
      
      // Adding significant details, excluding information about region
      if (analysis.details && 
          !resultMessage.includes(analysis.details) && 
          !analysis.details.includes("regional") &&
          !analysis.details.includes("region")) {
        resultMessage += ` ${analysis.details}`;
      }
      
      // Adding log information for debugging
      console.log(`📊 Final information about language: declared "${declaredDisplay}" (${langAttribute}), detected "${detectedDisplay}" (${analysis.detectedLanguage}), match=${analysis.matches}`);
      
      const targetElement = getTargetElementForHighlight(htmlElement, resultMessage);
      
      actRuleRunner.addResult({
        rule: {
          id: "ai-language-check",
          name: "AI Language Check"
        },
        outcome: "passed",
        element: {
          selector: targetElement.selector,
          html: createHtmlElementPreview(htmlElement as HTMLHtmlElement, langAttribute)
        },
        message: resultMessage,
        wcagCriteria: ["3.1.1"],
        metaInfo: getTimeAndCacheInfo()
      });
    }
  }
);

/**
 * Helper function to create informative HTML display of element with language
 * @param element HTML element
 * @returns Shortened HTML with accent on lang attribute and text
 */
function createLanguageElementPreview(element: Element): string {
  const tagName = element.tagName.toLowerCase();
  const langAttribute = element.getAttribute("lang") || "";
  const content = element.textContent?.trim() || "";
  
  // Shortening content if it's too long
  const shortContent = content.length > 40 ? content.substring(0, 40) + "..." : content;
  
  // Forming shortened HTML with accent on lang attribute and text
  return `<${tagName} lang="${langAttribute}">${shortContent}</${tagName}>`;
}

/**
 * ACT Rule: AI Language Parts Check (WCAG 3.1.2)
 * Checks if the language of parts matches their declared lang attributes
 * using artificial intelligence.
 */
const aiLanguagePartsCheckRule = createACTRule(
  "ai-language-parts-check",
  "AI Language Parts Check",
  "Checking if the language of parts matches their declared lang attributes using AI",
  {
    accessibility_requirements: getWCAGReference("3.1.2"),
    categories: [ACTRuleCategory.LANGUAGE],
    input_aspects: ["DOM Tree", "Rendered Page"],
    execute: async () => {
      // Adding indicator for test start
      console.log('▶️ Starting language check according to WCAG 3.1.2 (Language of parts)');
      
      // Checking document type (same as for 3.1.1)
      const docType = document.doctype;
      const contentType = document.contentType;
      
      if (contentType !== "text/html") {
        console.log(`ℹ️ Rule not applicable: content type ${contentType}`);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-parts-check",
            name: "AI Language Parts Check"
          },
          outcome: "inapplicable",
          message: `This rule is applicable only to documents with content type text/html. Current content type: ${contentType}`,
          wcagCriteria: ["3.1.2"],
          metaInfo: getTimeAndCacheInfo()
        });
        
        return;
      }
      
      // Getting HTML element to determine base language of the page
      const htmlElement = document.documentElement;
      const pageLangAttribute = htmlElement.getAttribute("lang") || "";
      const pageBaseLang = pageLangAttribute.toLowerCase().trim().split('-')[0];
      const pageLangInfo = getLanguageInfo(pageLangAttribute);
      const pageLangDisplay = pageLangInfo 
        ? `${pageLangInfo.name}${pageLangInfo.country ? ` (${pageLangInfo.country})` : ''}` 
        : `Unknown language (${pageLangAttribute})`;
      
      console.log(`📝 Base language of the page: "${pageLangAttribute || 'not specified'}"`);
      
      // Finding all elements with lang attribute
      const elementsWithLang = Array.from(document.querySelectorAll('[lang]:not(html)'));
      
      console.log(`🔎 Found ${elementsWithLang.length} elements with lang attribute`);
      
      // If there are no elements with lang attributes, rule is not applicable
      if (elementsWithLang.length === 0) {
        console.log(`ℹ️ Rule not applicable: no elements with lang attribute found`);
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-parts-check",
            name: "AI Language Parts Check"
          },
          outcome: "inapplicable",
          message: "No elements with lang attribute on the page, except <html>",
          wcagCriteria: ["3.1.2"],
          metaInfo: getTimeAndCacheInfo()
        });
        
        return;
      }
      
      // Analyzing each element with lang attribute
      let passedCount = 0;
      let failedCount = 0;
      
      for (let i = 0; i < elementsWithLang.length; i++) {
        const element = elementsWithLang[i];
        const langAttribute = element.getAttribute("lang") || "";
        const lowerCaseLang = langAttribute.toLowerCase().trim();
        const elementLangInfo = getLanguageInfo(langAttribute);
        const langDisplay = elementLangInfo 
          ? `${elementLangInfo.name}${elementLangInfo.country ? ` (${elementLangInfo.country})` : ''}` 
          : `Unknown language (${langAttribute})`;
        
        console.log(`🔍 Analysis of element [${i + 1}/${elementsWithLang.length}]: ${getElementSelector(element)}, lang="${langAttribute}" (${langDisplay})`);
        
        // Checking if the actual language differs from the standard
        if (!elementLangInfo) {
          console.log(`⚠️ Incorrect/non-standard language code: "${langAttribute}"`);
          
          // Checking for known errors for recommendation
          const baseCode = lowerCaseLang.split('-')[0];
          let suggestedCode = '';
          let suggestedName = '';
          
          // Searching for corrected version 
          if (INCORRECT_LANGUAGE_CODES[lowerCaseLang]) {
            suggestedCode = INCORRECT_LANGUAGE_CODES[lowerCaseLang];
            const suggestedInfo = getLanguageInfo(suggestedCode);
            suggestedName = suggestedInfo 
              ? `${suggestedInfo.name}${suggestedInfo.country ? ` (${suggestedInfo.country})` : ''}` 
              : suggestedCode;
          } else if (INCORRECT_LANGUAGE_CODES[baseCode]) {
            const correctedBase = INCORRECT_LANGUAGE_CODES[baseCode];
            const regionPart = lowerCaseLang.includes('-') ? `-${lowerCaseLang.split('-')[1]}` : '';
            suggestedCode = correctedBase + regionPart;
            const suggestedInfo = getLanguageInfo(suggestedCode);
            suggestedName = suggestedInfo 
              ? `${suggestedInfo.name}${suggestedInfo.country ? ` (${suggestedInfo.country})` : ''}` 
              : suggestedCode;
          }
          
          // Forming error message
          let message = `Element uses incorrect or non-standard language code: "${langAttribute}"`;
          let remediation = `Code "${langAttribute}" does not conform to BCP47/ISO 639-1 standard.`;
          
          if (suggestedCode) {
            remediation += ` Recommended to use "${suggestedCode}" (${suggestedName})`;
          } else {
            remediation += ` Use standard language code, e.g., "en" for English, "ru" for Russian, etc.`;
          }
          
          const targetElement = getTargetElementForHighlight(element, message);
          
        actRuleRunner.addResult({
          rule: {
              id: "ai-language-parts-check",
              name: "AI Language Parts Check"
          },
          outcome: "failed",
            element: {
              selector: targetElement.selector,
              html: createLanguageElementPreview(element),
              attributes: { lang: langAttribute }
            },
            message,
          impact: "moderate",
            remediation,
          wcagCriteria: ["3.1.2"],
            helpUrl:
              "https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html",
            metaInfo: getTimeAndCacheInfo()
          });
          
          failedCount++;
          continue;
        }
        
        // Checking if the element's language matches the page's language
        const elementBaseLang = lowerCaseLang.split('-')[0];
        if (elementBaseLang === pageBaseLang) {
          console.log(`ℹ️ Language of element matches page's language. lang attribute may be redundant.`);
          
          // ... existing code ...
        }
        
        // Extracting text from element
        const elementText = element.textContent?.trim() || "";
        
        // Determining adaptive threshold based on language
        const isIdeographicLang = /^(ja|zh|ko|th|my|km)/.test(lowerCaseLang.toLowerCase());
        const minTextLength = isIdeographicLang ? 1 : 3; // Minimum threshold for elements
        
        // If not enough text for analysis, mark as not applicable
        if (elementText.length < minTextLength) {
          console.log(`ℹ️ Not enough text for analysis: ${elementText.length} characters (minimum for ${langDisplay}: ${minTextLength})`);
        
          actRuleRunner.addResult({
            rule: {
              id: "ai-language-parts-check",
              name: "AI Language Parts Check"
            },
            outcome: "inapplicable",
            element: {
              selector: getElementSelector(element),
              html: createLanguageElementPreview(element)
            },
            message: `Not enough text for language analysis of element (${elementText.length} characters)`,
          wcagCriteria: ["3.1.2"],
            metaInfo: getTimeAndCacheInfo()
          });
          
          continue;
        }
        
        console.log(`📋 Text of element (${elementText.length} characters): "${elementText.substring(0, 50)}${elementText.length > 50 ? '...' : ''}"`);
        
        // Analyzing language of element using AI
        console.log(`🔍 Starting language analysis of element using OpenAI...`);
        const analysis = await analyzeLanguageWithOpenAI(elementText, lowerCaseLang);
        
        // Getting information about languages
        const detectedLangInfo = getLanguageInfo(analysis.detectedLanguage);
        const declaredLangInfo = getLanguageInfo(lowerCaseLang);
        
        // Forming human-readable language names
        const detectedDisplay = detectedLangInfo 
          ? `${detectedLangInfo.name}${detectedLangInfo.country ? ` (${detectedLangInfo.country})` : ''}` 
          : `Unknown language (${analysis.detectedLanguage})`;
          
        const declaredDisplay = declaredLangInfo 
          ? `${declaredLangInfo.name}${declaredLangInfo.country ? ` (${declaredLangInfo.country})` : ''}` 
          : `Unknown language (${lowerCaseLang})`;
        
        // Determining base language codes for comparison
        const declaredBaseLang = lowerCaseLang.split('-')[0].toLowerCase();
        const detectedBaseLang = analysis.detectedLanguage.split('-')[0].toLowerCase();
        
        // Considering languages as matching if base codes are the same
        const baseCodeMatches = declaredBaseLang === detectedBaseLang;
        
        // For backward compatibility, checking and AI's response
        if (!analysis.matches && !baseCodeMatches) {
          // Languages definitely do not match - process as error
          console.log(`❌ Language mismatch of element: declared "${declaredDisplay}", detected "${detectedDisplay}"`);
          
          // Creating compact message about result for side panel
          let resultMessage = `Language of element "${declaredDisplay}" does not match actual language "${detectedDisplay}" (confidence: ${analysis.confidence.toFixed(2)})`;
          
          // Adding information about mixed languages in brief form
          if (analysis.details && analysis.details.includes("mixed languages")) {
            resultMessage += `. Mixed language content detected.`;
          }
          
          // Adding other significant details if any are present
          if (analysis.details && 
              !resultMessage.includes(analysis.details) && 
              !analysis.details.includes("regional") &&
              !analysis.details.includes("region")) {
            resultMessage += ` ${analysis.details}`;
          }
          
          // Forming recommendation for correction
          // We never recommend lowering code accuracy (e.g., from "ms-MY" to "ms")
          let remediation = "";
          
          // If base codes differ, recommend changing base code
          if (declaredBaseLang !== detectedBaseLang) {
            // If detected language has a regional code, suggest using full code
            if (analysis.detectedLanguage.includes('-')) {
              remediation = `Change lang attribute from "${langAttribute}" to "${analysis.detectedLanguage}" (${detectedDisplay})`;
            } else {
              // Otherwise, consider current regional code if it exists
              const currentRegion = lowerCaseLang.includes('-') ? `-${lowerCaseLang.split('-')[1]}` : '';
              const suggestedLang = currentRegion ? `${analysis.detectedLanguage}${currentRegion}` : analysis.detectedLanguage;
              const suggestedDisplay = detectedLangInfo 
                ? `${detectedLangInfo.name}${currentRegion && declaredLangInfo?.country ? ` (${declaredLangInfo.country})` : ''}` 
                : `${analysis.detectedLanguage}${currentRegion}`;
                
              remediation = `Change lang attribute from "${langAttribute}" to "${suggestedLang}" (${suggestedDisplay})`;
            }
          } else {
            // If base codes match but AI still considers languages different,
            // recommend checking content
            remediation = `Check content of the element. Despite correct base language code "${langAttribute}", 
              AI considers content as corresponding to language "${analysis.detectedLanguage}" (${detectedDisplay}).`;
          }
          
          // Adding alternative correction - changing content
          remediation += ` Or update content of the element in accordance with declared language "${declaredDisplay}"`;
          
          const targetElement = getTargetElementForHighlight(element, resultMessage);
          
          actRuleRunner.addResult({
            rule: {
              id: "ai-language-parts-check",
              name: "AI Language Parts Check"
            },
            outcome: "failed",
            element: {
              selector: targetElement.selector,
              html: createLanguageElementPreview(element),
              attributes: { lang: langAttribute }
            },
            message: resultMessage,
            impact: "moderate",
            remediation,
            wcagCriteria: ["3.1.2"],
            helpUrl:
              "https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html",
            metaInfo: getTimeAndCacheInfo()
          });
          
          failedCount++;
        } else {
          // If base codes match or AI considers languages matching,
          // consider the check passed
          
          // Forming message based on whether regional codes match
          const regionMessage = declaredBaseLang === detectedBaseLang && 
                                lowerCaseLang !== analysis.detectedLanguage.toLowerCase() ? 
            `. Difference in regional codes (${lowerCaseLang} vs ${analysis.detectedLanguage}), but this does not affect WCAG 3.1.2.` : '';
          
          console.log(`✅ Languages of element match: "${declaredDisplay}" matches detected "${detectedDisplay}"`);
          
          // Creating compact message about result
          let resultMessage = `Language of element "${declaredDisplay}" matches actual content language "${detectedDisplay}" (confidence: ${analysis.confidence.toFixed(2)})${regionMessage}`;
          
          // Adding information about mixed languages if any are present
          if (analysis.details && analysis.details.includes("mixed languages")) {
            resultMessage += `. Mixed language content detected.`;
          }
          
          // Adding other significant details if any are present
          if (analysis.details && 
              !resultMessage.includes(analysis.details) && 
              !analysis.details.includes("regional") &&
              !analysis.details.includes("region")) {
            resultMessage += ` ${analysis.details}`;
          }
          
          // Getting time and cache information
          const metaInfo = getTimeAndCacheInfo();
          
          const targetElement = getTargetElementForHighlight(element, resultMessage);
          
          actRuleRunner.addResult({
            rule: {
              id: "ai-language-parts-check",
              name: "AI Language Parts Check"
            },
            outcome: "passed",
            element: {
              selector: targetElement.selector,
              html: createLanguageElementPreview(element),
              attributes: { lang: langAttribute }
            },
            message: resultMessage,
            wcagCriteria: ["3.1.2"],
            metaInfo: metaInfo
          });
          
          passedCount++;
        }
      }
      
      // Logging test results
      console.log(`🔤 Test results: ${passedCount} elements passed, ${failedCount} elements failed`, 'DEBUG');
      
      // Adding result "inapplicable" if no elements found for checking
      if (passedCount === 0 && failedCount === 0) {
        // Forming list of found hidden elements for display
        const hiddenElementsInfo = elementsWithLang
          .filter(el => isElementHidden(el))
          .map(el => {
            const selector = getElementSelector(el);
            const langAttr = el.getAttribute("lang") || "";
            return `${selector} (lang="${langAttr}")`;
          })
          .join(", ");

        const message = hiddenElementsInfo 
          ? `No visible elements found with lang attribute different from the main language of the page. Hidden elements detected: ${hiddenElementsInfo}`
          : "No visible elements found with lang attribute different from the main language of the page";

        actRuleRunner.addResult({
          rule: {
            id: "ai-language-parts-check",
            name: "AI Language Parts Check"
          },
          outcome: "inapplicable",
          message: message,
          element: {
            selector: "html",
            html: createHtmlElementPreview(document.documentElement as HTMLHtmlElement, pageLangAttribute)
          },
          remediation: "Rule not applicable, as there are no visible elements with lang attribute different from the main language of the page. If there is text on other languages on the page, please ensure it is marked with the corresponding lang attribute.",
          wcagCriteria: ["3.1.2"],
          metaInfo: getTimeAndCacheInfo()
        });
        return;
      }
      
      // If there were elements that passed the check
      if (passedCount > 0) {
        // ... existing code ...
      }
    }
  }
);

/**
 * Checks if an element is hidden or not visible to the user
 * @param element Element to check
 * @returns true, if element is hidden
 */
function isElementHidden(element: Element): boolean {
  try {
    // Checking element styles
    const style = window.getComputedStyle(element);
    
    // Element is hidden if:
    return style.display === 'none' || // display: none
          style.visibility === 'hidden' || // visibility: hidden
          style.opacity === '0' || // opacity: 0
          element.hasAttribute('hidden') || // hidden attribute
          element.getAttribute('aria-hidden') === 'true'; // aria-hidden="true"
  } catch (error) {
    console.error('Error checking element visibility:', error);
    return false; // In case of error, consider element visible
  }
}

/**
 * Gets selector for an element
 * @param element HTML element
 * @returns CSS selector for the element
 */
function getElementSelector(element: Element): string {
  try {
    // Using universal function getUniqueSelector from selector-utils.ts
    // which generates optimal selectors for highlighting
    return getUniqueSelector(element);
  } catch (error) {
    console.error('Error creating selector:', error);
    
    // Fallback option, if main function fails
    const tag = element.tagName.toLowerCase();
    
    // For html element, simply return tag
    if (tag === 'html') {
      return 'html';
    }
    
    // For other elements, try creating a simple selector
    let selector = tag;
    
    // Adding id if there is one
    if (element.id) {
      selector += `#${element.id}`;
      return selector;
    }
    
    // Adding class if there is one
    if (element.classList.length > 0) {
      selector += `.${element.classList[0]}`;
    }
    
    // Adding nth-child for specificity
    if (element.parentElement) {
      const siblings = Array.from(element.parentElement.children).filter(
        (child) => child.tagName === element.tagName
      );
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
      }
    }
    
    return selector;
  }
}

/**
 * ACT Rule: AI Language Region Check
 * Checks if the language regional codes in the lang attribute are correct
 */
const aiLanguageRegionCheckRule = createACTRule(
  "ai-language-region-check",
  "Checking language regional codes",
  "Checking if language regional codes in the lang attribute conform to ISO 3166-1 standard",
  {
    accessibility_requirements: getWCAGReference("3.1.1"),
    categories: [ACTRuleCategory.LANGUAGE],
    input_aspects: ["DOM Tree"],
    execute: async () => {
      // Checking document type
      const docType = document.doctype;
      const contentType = document.contentType;
      
      if (contentType !== "text/html") {
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-region-check",
            name: "Checking language regional codes"
          },
          outcome: "inapplicable",
          message: `This rule is applicable only to documents with content type text/html. Current content type: ${contentType}`,
          wcagCriteria: ["3.1.1"],
          metaInfo: getTimeAndCacheInfo()
        });
        return;
      }
      
      // Getting all elements with lang attribute, including html
      const allElementsWithLang = Array.from(document.querySelectorAll('[lang]'));
      
      // Elements with problematic regional codes
      let elementsWithInvalidRegion = 0;
      
      // Checking each element with lang attribute
      for (const element of allElementsWithLang) {
        const langAttribute = element.getAttribute("lang") || "";
        const lowerCaseLang = langAttribute.toLowerCase().trim();
        
        // If language code contains hyphen (i.e., there is a regional part)
        if (lowerCaseLang.includes('-')) {
          const [baseCode, regionCode] = lowerCaseLang.split('-');
          
          // Checking for incorrect regional codes
          const isInvalidRegion = /^(xx|yy|zz|00)$/i.test(regionCode);
          
          if (isInvalidRegion) {
            elementsWithInvalidRegion++;
            const elementSelector = getElementSelector(element);
            const isHtmlElement = element.tagName.toLowerCase() === 'html';
            
            // Forming HTML preview depending on element type
            const elementPreview = isHtmlElement 
              ? createHtmlElementPreview(element as HTMLHtmlElement, langAttribute) 
              : createLanguageElementPreview(element);
            
            // Forming error message
            const message = `Regional code "${regionCode}" in lang="${lowerCaseLang}" does not conform to ISO 3166-1 standard.`;
            
            actRuleRunner.addResult({
              rule: {
                id: "ai-language-region-check",
                name: "Checking language regional codes"
              },
              outcome: "failed",
              element: {
                selector: elementSelector,
                html: elementPreview,
                attributes: { lang: langAttribute }
              },
              message: message,
              impact: "moderate",
              remediation: `Replace lang="${langAttribute}" with lang="${baseCode}" or specify a correct code, e.g., lang="${baseCode}-US", "${baseCode}-GB", "${baseCode}-RU", etc.`,
              wcagCriteria: ["3.1.1"],
              helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
              metaInfo: getTimeAndCacheInfo()
            });
          }
        }
      }
      
      // If no elements found with incorrect regional codes
      if (elementsWithInvalidRegion === 0) {
        // Getting html element for report
        const htmlElement = document.documentElement as HTMLHtmlElement;
        const pageLangAttribute = htmlElement.getAttribute("lang") || "";
        
        actRuleRunner.addResult({
          rule: {
            id: "ai-language-region-check",
            name: "Language Regional Codes Check"
          },
          outcome: "passed",
          element: {
            selector: "html",
            html: createHtmlElementPreview(htmlElement, pageLangAttribute)
          },
          message: "All language regional codes on the page conform to ISO 3166-1 standard",
          wcagCriteria: ["3.1.1"],
          metaInfo: getTimeAndCacheInfo()
        });
      }
    }
  }
);

/**
 * Checks the target element in the result message and creates a special highlightable element
 * for the <html> tag to avoid highlighting the entire page
 * @param element Element to check
 * @param message Result message
 * @returns Object with selector and element for highlighting
 */
function getTargetElementForHighlight(element: Element, message: string): { 
  selector: string; 
  element: Element; 
  fallbackHtml?: string 
} {
  // For <html> element, simply return selector "html"
  if (element.tagName.toLowerCase() === 'html') {
    return {
      selector: 'html',
      element: element,
      fallbackHtml: createHtmlElementPreview(element as HTMLHtmlElement, element.getAttribute('lang') || '')
    };
  }
  
  // For other elements, use regular selector definition
  return {
    selector: getElementSelector(element),
    element: element
  };
}

// Updating registration function, adding new rule
export function registerAILanguageRules(): void {
  console.log("[ai-language-check] Registering AI language check rules");
  console.log('🔌 Initializing AI Language Check module');
  
  // Register rules
  registerACTRule(aiLanguageCheckRule);
  registerACTRule(aiLanguagePartsCheckRule);
  registerACTRule(aiLanguageRegionCheckRule); // Adding new rule
  
  // Explicitly print categories for debugging
  console.log(`[ai-language-check] Rule categories: ${aiLanguageCheckRule.metadata?.categories?.join(', ') || 'not specified'}`);
  
  console.log("[ai-language-check] AI language check rules registered");
  console.log('✅ AI Language Check module successfully registered');
}

// Export rules for testing
export { aiLanguageCheckRule, aiLanguagePartsCheckRule, aiLanguageRegionCheckRule };
