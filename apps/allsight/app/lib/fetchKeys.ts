/**
 * Centralized fetch keys for Nuxt data caching
 *
 * Benefits:
 * - Single source of truth for all data keys
 * - Type-safe key generation
 * - Easy selective data refresh
 * - Prevents key collisions
 */

export const FETCH_KEYS = {
  accounts: {
    /**
     * List of all accounts for the current user
     */
    list: () => 'accounts:list' as const,

    /**
     * Single account by ID
     */
    byId: (id: string) => `accounts:${id}` as const,

    /**
     * Members of an account
     */
    members: (accountId: string) => `accounts:${accountId}:members` as const,

    /**
     * Programs (frameworks) associated with an account
     */
    programs: (accountId: string) => `accounts:${accountId}:programs` as const,

    /**
     * Single program by ID
     */
    programById: (accountId: string, programId: string) =>
      `accounts:${accountId}:programs:${programId}` as const,
  },
} as const

/**
 * Helper to invalidate all account-related data for a specific account
 */
export const invalidateAccount = async (accountId: string) => {
  await Promise.all([
    refreshNuxtData(FETCH_KEYS.accounts.byId(accountId)),
    refreshNuxtData(FETCH_KEYS.accounts.list()),
  ])
}

/**
 * Helper to invalidate account members data
 */
export const invalidateAccountMembers = async (accountId: string) => {
  await refreshNuxtData(FETCH_KEYS.accounts.members(accountId))
}
