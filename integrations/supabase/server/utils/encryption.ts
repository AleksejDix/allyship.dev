/**
 * Encryption utilities for storing sensitive credentials
 *
 * Uses AES-256-GCM for encrypting OAuth tokens and API keys
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16 // For GCM mode
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const KEY_LENGTH = 32

/**
 * Get encryption key from environment variable
 *
 * IMPORTANT: Set ENCRYPTION_KEY in your .env file
 * Generate a key: openssl rand -base64 32
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  // Convert base64 key to buffer
  const keyBuffer = Buffer.from(key, 'base64')

  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error(`ENCRYPTION_KEY must be ${KEY_LENGTH} bytes (base64 encoded)`)
  }

  return keyBuffer
}

/**
 * Encrypt a string value
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: salt.iv.tag.ciphertext (all base64)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty string')
  }

  const key = getEncryptionKey()

  // Generate random IV (initialization vector)
  const iv = crypto.randomBytes(IV_LENGTH)

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  // Encrypt the data
  let encrypted = cipher.update(plaintext, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  // Get the auth tag
  const tag = cipher.getAuthTag()

  // Combine IV + tag + encrypted data (all base64 encoded, separated by '.')
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted}`
}

/**
 * Decrypt an encrypted string
 *
 * @param encryptedData - Encrypted string from encrypt() function
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty string')
  }

  const key = getEncryptionKey()

  // Split the encrypted data
  const parts = encryptedData.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }

  const [ivB64, tagB64, encryptedB64] = parts

  // Convert from base64
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(encryptedB64, 'base64')

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  // Decrypt
  let decrypted = decipher.update(encrypted, undefined, 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Encrypt an entire config object
 * Only encrypts sensitive fields (ending with _token, _key, _secret, _password)
 *
 * @param config - Configuration object with sensitive fields
 * @returns Config object with encrypted sensitive fields
 */
export function encryptConfig(config: Record<string, any>): Record<string, any> {
  const encrypted: Record<string, any> = {}

  for (const [key, value] of Object.entries(config)) {
    // Check if field is sensitive (should be encrypted)
    const isSensitive =
      key.endsWith('_token') ||
      key.endsWith('_key') ||
      key.endsWith('_secret') ||
      key.endsWith('_password') ||
      key === 'access_token' ||
      key === 'refresh_token' ||
      key === 'api_key'

    if (isSensitive && typeof value === 'string') {
      encrypted[key] = encrypt(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively encrypt nested objects
      encrypted[key] = encryptConfig(value)
    } else {
      // Keep non-sensitive fields as-is
      encrypted[key] = value
    }
  }

  return encrypted
}

/**
 * Decrypt an entire config object
 *
 * @param config - Configuration object with encrypted fields
 * @returns Config object with decrypted sensitive fields
 */
export function decryptConfig(config: Record<string, any>): Record<string, any> {
  const decrypted: Record<string, any> = {}

  for (const [key, value] of Object.entries(config)) {
    const isSensitive =
      key.endsWith('_token') ||
      key.endsWith('_key') ||
      key.endsWith('_secret') ||
      key.endsWith('_password') ||
      key === 'access_token' ||
      key === 'refresh_token' ||
      key === 'api_key'

    if (isSensitive && typeof value === 'string') {
      try {
        decrypted[key] = decrypt(value)
      } catch (err) {
        console.error(`Failed to decrypt field '${key}':`, err)
        decrypted[key] = null
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively decrypt nested objects
      decrypted[key] = decryptConfig(value)
    } else {
      decrypted[key] = value
    }
  }

  return decrypted
}

/**
 * Generate a new encryption key (for setup)
 * Run this once and save the output to your .env file as ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
  const key = crypto.randomBytes(KEY_LENGTH)
  return key.toString('base64')
}

// Example usage for testing
// Run this file directly: node --loader tsx server/utils/encryption.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== Encryption Utilities ===\n')

  // Generate a new key
  const newKey = generateEncryptionKey()
  console.log('Generated new encryption key:')
  console.log(newKey)
  console.log('\nAdd this to your .env file as:')
  console.log(`ENCRYPTION_KEY=${newKey}`)

  // Test encryption/decryption
  if (process.env.ENCRYPTION_KEY) {
    console.log('\n=== Testing Encryption ===')
    const testData = 'my-super-secret-token-12345'
    console.log('Original:', testData)

    const encrypted = encrypt(testData)
    console.log('Encrypted:', encrypted)

    const decrypted = decrypt(encrypted)
    console.log('Decrypted:', decrypted)
    console.log('Match:', testData === decrypted ? '✅' : '❌')

    // Test config encryption
    console.log('\n=== Testing Config Encryption ===')
    const config = {
      access_token: 'secret_token_123',
      refresh_token: 'refresh_token_456',
      project_id: 'abc123', // not encrypted
      expires_at: '2025-12-08T10:30:00Z' // not encrypted
    }
    console.log('Original config:', config)

    const encryptedConfig = encryptConfig(config)
    console.log('Encrypted config:', encryptedConfig)

    const decryptedConfig = decryptConfig(encryptedConfig)
    console.log('Decrypted config:', decryptedConfig)
    console.log('Match:', JSON.stringify(config) === JSON.stringify(decryptedConfig) ? '✅' : '❌')
  }
}
