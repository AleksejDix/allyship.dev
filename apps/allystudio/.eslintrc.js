module.exports = {
  extends: ["@workspace/eslint-config/react-library.js"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@workspace/*"],
            message:
              "Do not import from workspace packages in Plasmo extension. Use local components instead."
          }
        ]
      }
    ]
  }
}
