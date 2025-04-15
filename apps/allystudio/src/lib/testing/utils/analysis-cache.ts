// Language analysis results caching module

import { simpleHash } from './text-utils';

// Structure for storing cached language analysis results
export interface LanguageAnalysisCache {
  timestamp: number;
  declaredLang: string;
  textHash: string;
  result: {
    matches: boolean;
    detectedLanguage: string;
    confidence: number;
    details?: string;
  };
}

// Cache expiration period in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Maximum number of entries in the cache
const MAX_CACHE_ENTRIES = 50;

// Key for storing cache in localStorage
const CACHE_KEY = 'ai_language_analysis_cache';

/**
 * Caches the result of language analysis
 * @param declaredLang Declared language
 * @param text Analyzed text
 * @param result Analysis result
 */
export function cacheLanguageAnalysis(declaredLang: string, text: string, result: any): void {
  try {
    // Get existing cache or create a new one
    const cacheString = localStorage.getItem(CACHE_KEY);
    const cache: LanguageAnalysisCache[] = cacheString ? JSON.parse(cacheString) : [];
    
    // Create text hash to use as a key
    const textHash = simpleHash(text);
    
    // Check if there's already an entry with this hash
    const existingEntryIndex = cache.findIndex(item => 
      item.textHash === textHash && item.declaredLang === declaredLang
    );
    
    // Create a cache entry
    const cacheEntry: LanguageAnalysisCache = {
      timestamp: Date.now(),
      declaredLang,
      textHash,
      result
    };
    
    // If entry exists, update it
    if (existingEntryIndex >= 0) {
      cache[existingEntryIndex] = cacheEntry;
    } else {
      // Otherwise add a new entry
      cache.push(cacheEntry);
    }
    
    // If cache has grown too large, remove oldest entries
    if (cache.length > MAX_CACHE_ENTRIES) {
      // Sort by time (oldest to newest)
      cache.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest entries
      while (cache.length > MAX_CACHE_ENTRIES) {
        cache.shift();
      }
    }
    
    // Save the updated cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    
    console.log(`[CACHE] ✅ Language analysis result cached (hash: ${textHash})`);
  } catch (error) {
    // In case of an error (e.g., localStorage overflow), just log it
    console.error('[ERROR] ⚠️ localStorage unavailable, result caching not possible:', error);
  }
}

/**
 * Gets cached language analysis result
 * @param declaredLang Declared language
 * @param text Analyzed text
 * @returns Cached result or null if cache not found or expired
 */
export function getCachedLanguageAnalysis(declaredLang: string, text: string): any | null {
  try {
    // Get text hash
    const textHash = simpleHash(text);
    
    // Get cache from localStorage
    const cacheString = localStorage.getItem(CACHE_KEY);
    if (!cacheString) {
      console.log('[CACHE] 📭 Language analysis cache not found');
      return null;
    }
    
    // Parse cache
    const cache: LanguageAnalysisCache[] = JSON.parse(cacheString);
    
    // Find entry with matching hash and language
    const cachedEntry = cache.find(item => 
      item.textHash === textHash && item.declaredLang === declaredLang
    );
    
    // If entry not found, return null
    if (!cachedEntry) {
      console.log('[CACHE] 🔍 Cached result for this text not found');
      return null;
    }
    
    // Check if cache is expired
    const now = Date.now();
    if (now - cachedEntry.timestamp > CACHE_EXPIRATION) {
      console.log(`[CACHE] ⏰ Found expired cache (${Math.floor((now - cachedEntry.timestamp) / 3600000)} hours)`);
      return null;
    }
    
    // Return cached result
    console.log(`[CACHE] 📋 Found current language analysis cache (hash: ${textHash})`);
    return cachedEntry.result;
  } catch (error) {
    // In case of error, just return null
    console.error('[ERROR] ❌ Error getting cache:', error);
    return null;
  }
}

/**
 * Clears language analysis cache
 */
export function clearLanguageAnalysisCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('[CACHE] 🧹 Language analysis cache cleared');
  } catch (error) {
    console.error('[ERROR] ❌ Error clearing cache:', error);
  }
} 