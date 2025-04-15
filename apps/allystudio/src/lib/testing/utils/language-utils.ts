// Language code utilities module

// Extended list of BCP 47 language codes
// Format: { code: { name: "Language name", country: "Country name" } }
export const BCP47_LANGUAGE_CODES: Record<string, { name: string; country: string }> = {
  "af-ZA": { name: "Afrikaans", country: "South Africa" },
  "am-ET": { name: "Amharic", country: "Ethiopia" },
  "ar-SA": { name: "Arabic", country: "Saudi Arabia" },
  "az-AZ": { name: "Azerbaijani", country: "Azerbaijan" },
  "be-BY": { name: "Belarusian", country: "Belarus" },
  "bg-BG": { name: "Bulgarian", country: "Bulgaria" },
  "bn-IN": { name: "Bengali", country: "India" },
  "bs-BA": { name: "Bosnian", country: "Bosnia and Herzegovina" },
  "ca-ES": { name: "Catalan", country: "Spain" },
  "cs-CZ": { name: "Czech", country: "Czech Republic" },
  "cy-GB": { name: "Welsh", country: "United Kingdom" },
  "da-DK": { name: "Danish", country: "Denmark" },
  "de-AT": { name: "German", country: "Austria" },
  "de-CH": { name: "German", country: "Switzerland" },
  "de-DE": { name: "German", country: "Germany" },
  "el-GR": { name: "Greek", country: "Greece" },
  "en-AU": { name: "English", country: "Australia" },
  "en-CA": { name: "English", country: "Canada" },
  "en-GB": { name: "English", country: "United Kingdom" },
  "en-IE": { name: "English", country: "Ireland" },
  "en-IN": { name: "English", country: "India" },
  "en-NZ": { name: "English", country: "New Zealand" },
  "en-US": { name: "English", country: "United States" },
  "en-ZA": { name: "English", country: "South Africa" },
  "es-AR": { name: "Spanish", country: "Argentina" },
  "es-CL": { name: "Spanish", country: "Chile" },
  "es-CO": { name: "Spanish", country: "Colombia" },
  "es-ES": { name: "Spanish", country: "Spain" },
  "es-MX": { name: "Spanish", country: "Mexico" },
  "es-PE": { name: "Spanish", country: "Peru" },
  "et-EE": { name: "Estonian", country: "Estonia" },
  "fa-IR": { name: "Persian", country: "Iran" },
  "fi-FI": { name: "Finnish", country: "Finland" },
  "fil-PH": { name: "Filipino", country: "Philippines" },
  "fr-BE": { name: "French", country: "Belgium" },
  "fr-CA": { name: "French", country: "Canada" },
  "fr-CH": { name: "French", country: "Switzerland" },
  "fr-FR": { name: "French", country: "France" },
  "ga-IE": { name: "Irish", country: "Ireland" },
  "gl-ES": { name: "Galician", country: "Spain" },
  "gu-IN": { name: "Gujarati", country: "India" },
  "he-IL": { name: "Hebrew", country: "Israel" },
  "hi-IN": { name: "Hindi", country: "India" },
  "hr-HR": { name: "Croatian", country: "Croatia" },
  "hu-HU": { name: "Hungarian", country: "Hungary" },
  "id-ID": { name: "Indonesian", country: "Indonesia" },
  "is-IS": { name: "Icelandic", country: "Iceland" },
  "it-CH": { name: "Italian", country: "Switzerland" },
  "it-IT": { name: "Italian", country: "Italy" },
  "ja-JP": { name: "Japanese", country: "Japan" },
  "jv-ID": { name: "Javanese", country: "Indonesia" },
  "km-KH": { name: "Khmer", country: "Cambodia" },
  "kn-IN": { name: "Kannada", country: "India" },
  "ko-KR": { name: "Korean", country: "South Korea" },
  "lo-LA": { name: "Lao", country: "Laos" },
  "lt-LT": { name: "Lithuanian", country: "Lithuania" },
  "lv-LV": { name: "Latvian", country: "Latvia" },
  "ml-IN": { name: "Malayalam", country: "India" },
  "mr-IN": { name: "Marathi", country: "India" },
  "ms-MY": { name: "Malay", country: "Malaysia" },
  "ms-ID": { name: "Malay", country: "Indonesia" },
  "ms-SG": { name: "Malay", country: "Singapore" },
  "ms-BN": { name: "Malay", country: "Brunei" },
  "nb-NO": { name: "Norwegian Bokmål", country: "Norway" },
  "ne-NP": { name: "Nepali", country: "Nepal" },
  "nl-BE": { name: "Dutch", country: "Belgium" },
  "nl-NL": { name: "Dutch", country: "Netherlands" },
  "no-NO": { name: "Norwegian", country: "Norway" },
  "pa-IN": { name: "Punjabi", country: "India" },
  "pl-PL": { name: "Polish", country: "Poland" },
  "pt-BR": { name: "Portuguese", country: "Brazil" },
  "pt-PT": { name: "Portuguese", country: "Portugal" },
  "ro-RO": { name: "Romanian", country: "Romania" },
  "ru-RU": { name: "Russian", country: "Russia" },
  "si-LK": { name: "Sinhala", country: "Sri Lanka" },
  "sk-SK": { name: "Slovak", country: "Slovakia" },
  "sl-SI": { name: "Slovenian", country: "Slovenia" },
  "sq-AL": { name: "Albanian", country: "Albania" },
  "sr-RS": { name: "Serbian", country: "Serbia" },
  "sv-FI": { name: "Swedish", country: "Finland" },
  "sv-SE": { name: "Swedish", country: "Sweden" },
  "sw-KE": { name: "Swahili", country: "Kenya" },
  "ta-IN": { name: "Tamil", country: "India" },
  "te-IN": { name: "Telugu", country: "India" },
  "th-TH": { name: "Thai", country: "Thailand" },
  "tr-TR": { name: "Turkish", country: "Turkey" },
  "uk-UA": { name: "Ukrainian", country: "Ukraine" },
  "ur-PK": { name: "Urdu", country: "Pakistan" },
  "vi-VN": { name: "Vietnamese", country: "Vietnam" },
  "zh-CN": { name: "Chinese", country: "China" },
  "zh-HK": { name: "Chinese", country: "Hong Kong" },
  "zh-SG": { name: "Chinese", country: "Singapore" },
  "zh-TW": { name: "Chinese", country: "Taiwan" },
  "zu-ZA": { name: "Zulu", country: "South Africa" },
  
  // Also adding simple language codes without region
  "af": { name: "Afrikaans", country: "" },
  "ar": { name: "Arabic", country: "" },
  "bg": { name: "Bulgarian", country: "" },
  "ca": { name: "Catalan", country: "" },
  "cs": { name: "Czech", country: "" },
  "da": { name: "Danish", country: "" },
  "de": { name: "German", country: "" },
  "el": { name: "Greek", country: "" },
  "en": { name: "English", country: "" },
  "es": { name: "Spanish", country: "" },
  "et": { name: "Estonian", country: "" },
  "fa": { name: "Persian", country: "" },
  "fi": { name: "Finnish", country: "" },
  "fr": { name: "French", country: "" },
  "he": { name: "Hebrew", country: "" },
  "hi": { name: "Hindi", country: "" },
  "hr": { name: "Croatian", country: "" },
  "hu": { name: "Hungarian", country: "" },
  "id": { name: "Indonesian", country: "" },
  "it": { name: "Italian", country: "" },
  "ja": { name: "Japanese", country: "" },
  "ko": { name: "Korean", country: "" },
  "lt": { name: "Lithuanian", country: "" },
  "lv": { name: "Latvian", country: "" },
  "ms": { name: "Malay", country: "" },
  "nl": { name: "Dutch", country: "" },
  "no": { name: "Norwegian", country: "" },
  "pl": { name: "Polish", country: "" },
  "pt": { name: "Portuguese", country: "" },
  "ro": { name: "Romanian", country: "" },
  "ru": { name: "Russian", country: "" },
  "sk": { name: "Slovak", country: "" },
  "sl": { name: "Slovenian", country: "" },
  "sr": { name: "Serbian", country: "" },
  "sv": { name: "Swedish", country: "" },
  "th": { name: "Thai", country: "" },
  "tr": { name: "Turkish", country: "" },
  "uk": { name: "Ukrainian", country: "" },
  "vi": { name: "Vietnamese", country: "" },
  "zh": { name: "Chinese", country: "" },
};

// Commonly encountered incorrect language codes and their corrected versions
export const INCORRECT_LANGUAGE_CODES: Record<string, string> = {
  // Basic errors in language codes
  "ua": "uk", // Ukrainian
  "jp": "ja", // Japanese
  "cn": "zh", // Chinese
  "ch": "zh", // Chinese
  "gr": "el", // Greek
  "kr": "ko", // Korean
  "cz": "cs", // Czech
  "ge": "de", // German
  "ir": "fa", // Persian
  "sa": "ar", // Arabic (Saudi Arabia → Arabic)
  "ml": "ms", // Malay (confused with Malayalam)
  "rm": "ro", // Romanian
  "sb": "sr", // Serbian
  "sp": "es", // Spanish
  "sw": "sv", // Swedish (confused with Swahili)
  
  // Deprecated codes
  "iw": "he", // Hebrew (deprecated code)
  "ji": "yi", // Yiddish (deprecated code)
  "in": "id", // Indonesian (deprecated code)
  "mo": "ro", // Moldavian (now considered a dialect of Romanian)
  "sh": "sr", // Serbo-Croatian (deprecated code)
  
  // Incorrect country code combinations
  "en-uk": "en-gb", // English (United Kingdom)
  "pt-bz": "pt-br", // Portuguese (Brazil)
  "no-no": "nb", // Norwegian
  
  // Erroneous duplication of language and country
  "uk-ua": "uk", // Ukrainian (Ukraine)
  "en-en": "en", // English
  "ru-ru": "ru", // Russian
  "es-es": "es", // Spanish
  "fr-fr": "fr", // French
  "de-de": "de", // German
  
  // Errors in separators (underscore instead of hyphen)
  "en_us": "en-us", // English (USA)
  "fr_ca": "fr-ca", // French (Canada)
  "pt_pt": "pt-pt", // Portuguese (Portugal)
  "es_mx": "es-mx", // Spanish (Mexico)
  "zh_cn": "zh-cn", // Chinese (China)
  "de_at": "de-at", // German (Austria)
  
  // Other common errors
  "rt": "tr", // Turkish
  "br": "pt", // Portuguese (confused with Brazil country code)
  "rs": "sr", // Serbian (confused with Serbia country code)
  "gb": "en-gb", // English (confused country code with language code)
  "us": "en-us", // English (confused country code with language code)
  "ca": "en-ca", // English Canada (confused country code with language code)
  "mx": "es-mx", // Spanish Mexico (confused country code with language code)
  
  // Kurdish languages - specification
  "ku": "kmr" // Kurdish (recommended to specify: kmr - Kurmanji or ckb - Sorani)
};

// IMPORTANT: This function is commented out because we simplified language code checking.
// Now we use direct code checking in the dictionary without normalization.
// The function is kept in the code for backward compatibility and possible future use.
// 
// /**
//  * Normalizes a language code, correcting common errors
//  * @param langCode Original language code
//  * @returns Normalized language code
//  */
// export function normalizeLanguageCode(langCode: string): string {
//   if (!langCode) return "";
//   
//   // Convert code to lowercase
//   let normalizedCode = langCode.toLowerCase().trim();
//   
//   // Check format with underscore and replace with hyphen
//   if (normalizedCode.includes("_")) {
//     normalizedCode = normalizedCode.replace(/_/g, "-");
//     console.log(`[LANG] 🔄 Language code format corrected: ${langCode} → ${normalizedCode} (replaced _ with -)`);
//   }
//   
//   // Check if the code is one of the incorrect ones
//   const baseCode = normalizedCode.split("-")[0];
//   if (INCORRECT_LANGUAGE_CODES[normalizedCode]) {
//     const correctedCode = INCORRECT_LANGUAGE_CODES[normalizedCode];
//     console.log(`[LANG] 🔄 Incorrect language code corrected: ${normalizedCode} → ${correctedCode}`);
//     return correctedCode;
//   } else if (INCORRECT_LANGUAGE_CODES[baseCode]) {
//     // Check if the base code is incorrect
//     const correctedBaseCode = INCORRECT_LANGUAGE_CODES[baseCode];
//     const regionPart = normalizedCode.includes("-") ? normalizedCode.split("-")[1] : "";
//     
//     // If there is a region part, keep it, otherwise return only the corrected base code
//     const result = regionPart ? `${correctedBaseCode}-${regionPart}` : correctedBaseCode;
//     console.log(`[LANG] 🔄 Incorrect base language code corrected: ${normalizedCode} → ${result}`);
//     return result;
//   }
//   
//   // Check redundant formats like "en-en", "ru-ru"
//   const [lang, region] = normalizedCode.split("-");
//   if (lang && region && lang === region) {
//     console.log(`[LANG] 🔄 Removed redundant duplication in language code: ${normalizedCode} → ${lang}`);
//     return lang;
//   }
//   
//   return normalizedCode;
// }

/**
 * Gets information about a language by its code
 * @param langCode Language code
 * @returns Object with language information or undefined if language not found
 */
export function getLanguageInfo(langCode: string): { name: string; country: string } | undefined {
  if (!langCode) return undefined;
  
  // Convert to lowercase for comparison (without normalization)
  const lowerCaseCode = langCode.toLowerCase().trim();
  
  // 1. Direct check - is the code in the BCP47 dictionary
  for (const code in BCP47_LANGUAGE_CODES) {
    if (code.toLowerCase() === lowerCaseCode) {
      return BCP47_LANGUAGE_CODES[code];
    }
  }
  
  // 2. Check base code (without region)
  const baseCode = lowerCaseCode.split('-')[0];
  for (const code in BCP47_LANGUAGE_CODES) {
    if (code.split('-')[0].toLowerCase() === baseCode && !code.includes('-')) {
      return BCP47_LANGUAGE_CODES[code];
    }
  }
  
  // 3. Check for known incorrect codes (for debugging and logs)
  let suggestedCode = null;
  if (INCORRECT_LANGUAGE_CODES[lowerCaseCode]) {
    suggestedCode = INCORRECT_LANGUAGE_CODES[lowerCaseCode];
    console.log(`[LANG] ⚠️ Detected incorrect language code: "${langCode}". Recommended code: "${suggestedCode}"`);
  } else if (INCORRECT_LANGUAGE_CODES[baseCode]) {
    const correctedBase = INCORRECT_LANGUAGE_CODES[baseCode];
    const regionPart = lowerCaseCode.includes("-") ? lowerCaseCode.split("-")[1] : "";
    suggestedCode = regionPart ? `${correctedBase}-${regionPart}` : correctedBase;
    console.log(`[LANG] ⚠️ Detected incorrect base language code: "${langCode}". Recommended code: "${suggestedCode}"`);
  }
  
  // 4. If we found a recommended code, return information about it
  if (suggestedCode) {
    for (const code in BCP47_LANGUAGE_CODES) {
      if (code.toLowerCase() === suggestedCode.toLowerCase()) {
        return BCP47_LANGUAGE_CODES[code];
      }
    }
  }
  
  return undefined;
}

/**
 * Gets a string representation of a language by BCP 47 code
 * @param langCode BCP 47 language code
 * @returns String with language name and country (if known)
 */
export function getLanguageDisplayName(langCode: string): string {
  const info = getLanguageInfo(langCode);
  
  if (!info) {
    return `Unknown language (${langCode})`;
  }
  
  if (info.country) {
    return `${info.name} (${info.country})`;
  }
  
  return info.name;
}

/**
 * Compares the primary language subtags in lang and xml:lang attributes
 * According to WCAG requirements, primary language subtags must match
 * @param langCode Value of lang attribute
 * @param xmlLangCode Value of xml:lang attribute
 * @returns Object with comparison result
 */
export function compareLanguageSubtags(langCode: string, xmlLangCode: string): { 
  matches: boolean; 
  primaryLang: string; 
  primaryXmlLang: string; 
} {
  if (!langCode || !xmlLangCode || xmlLangCode === '') {
    // If one of the attributes is missing or xml:lang is empty, check is not applicable
    return { matches: true, primaryLang: '', primaryXmlLang: '' };
  }

  // Normalize language codes to lowercase
  const normalizedLang = langCode.toLowerCase().trim();
  const normalizedXmlLang = xmlLangCode.toLowerCase().trim();
  
  // Extract primary language subtags (everything before the first hyphen or the entire code if no hyphen)
  const primaryLang = normalizedLang.split('-')[0];
  const primaryXmlLang = normalizedXmlLang.split('-')[0];
  
  // Check if primary language subtags match
  const matches = primaryLang === primaryXmlLang;
  
  console.log(`[LANG] 🔍 Comparing primary language subtags: "${primaryLang}" (lang) and "${primaryXmlLang}" (xml:lang) - ${matches ? '✅ match' : '❌ do not match'}`);
  
  return { matches, primaryLang, primaryXmlLang };
} 