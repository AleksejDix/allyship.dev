module.exports = {
  // ... other config
  extends: [
    // ... your extends config
  ],
  ignorePatterns: ["node_modules/*", ".next/*", "dist/*", "public/*"],
  overrides: [
    {
      files: ["components/ui/**/*.{ts,tsx,js,jsx}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        // Add any other rules you want to disable for UI components
      },
    },
  ],
  // ... rest of config
}
