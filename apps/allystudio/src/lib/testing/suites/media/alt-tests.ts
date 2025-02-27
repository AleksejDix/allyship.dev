import { getAccessibleName } from "../../act-test-runner"
import { describe, suite, test } from "../../act-test-suite"

export const altTests = suite(
  "Image Alt Text",
  "img:not([role='presentation']):not([role='none']), img[role='img']",
  () => {
    test(
      "Image must have alt text",
      (element: HTMLElement) => {
        const hasAlt = element.hasAttribute("alt")
        return {
          passed: hasAlt,
          message: hasAlt
            ? "Image has alt attribute"
            : "Image is missing alt attribute"
        }
      },
      {
        description: "All meaningful images must have an alt attribute",
        severity: "Critical"
      }
    )

    describe("Alt Text Quality", () => {
      test(
        "Alt text is not redundant",
        (element: HTMLElement) => {
          const alt = element.getAttribute("alt")?.toLowerCase().trim()
          if (!alt) return { passed: true, message: "No alt text to check" }

          const redundantPhrases = [
            "image of",
            "picture of",
            "photo of",
            "photograph of",
            "graphic of",
            "image showing",
            "picture showing"
          ]

          const hasRedundantPhrase = redundantPhrases.some((phrase) =>
            alt.startsWith(phrase)
          )

          return {
            passed: !hasRedundantPhrase,
            message: hasRedundantPhrase
              ? `Alt text starts with redundant phrase "${alt}" - remove phrases like "image of" or "picture of"`
              : "Alt text does not contain redundant phrases"
          }
        },
        {
          description:
            "Alt text should not include redundant phrases like 'image of' or 'picture of'",
          severity: "Medium"
        }
      )

      test(
        "Alt text length is appropriate",
        (element: HTMLElement) => {
          const alt = element.getAttribute("alt")
          if (!alt) return { passed: true, message: "No alt text to check" }

          const words = alt.trim().split(/\s+/).length

          // Check if alt text is too long (more than 150 characters)
          if (alt.length > 150) {
            return {
              passed: false,
              message: `Alt text is too long (${alt.length} characters) - consider using longdesc or aria-describedby for detailed descriptions`
            }
          }

          // Check if alt text is too wordy (more than 15 words)
          if (words > 15) {
            return {
              passed: false,
              message: `Alt text is too wordy (${words} words) - should be concise`
            }
          }

          return {
            passed: true,
            message: "Alt text length is appropriate"
          }
        },
        {
          description: "Alt text should be concise but meaningful",
          severity: "Medium"
        }
      )

      test(
        "Alt text is not filename",
        (element: HTMLElement) => {
          const alt = element.getAttribute("alt")?.toLowerCase().trim()
          if (!alt) return { passed: true, message: "No alt text to check" }

          // Check for common filename patterns
          const isFilename =
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(alt) || // Has image extension
            /^img_?\d+/i.test(alt) || // Starts with img followed by numbers
            /^dsc_?\d+/i.test(alt) || // Starts with dsc followed by numbers
            /^image_?\d+/i.test(alt) || // Starts with image followed by numbers
            /^\d{8}_\d+/i.test(alt) // Date-like pattern

          return {
            passed: !isFilename,
            message: isFilename
              ? `Alt text "${alt}" appears to be a filename - provide meaningful description instead`
              : "Alt text is not a filename"
          }
        },
        {
          description: "Alt text should not be a filename",
          severity: "High"
        }
      )

      test(
        "Decorative images are properly marked",
        (element: HTMLElement) => {
          const alt = element.getAttribute("alt")
          const isExplicitlyDecorative =
            element.getAttribute("role") === "presentation" ||
            element.getAttribute("role") === "none"

          // If image is marked as decorative, it should have empty alt
          if (isExplicitlyDecorative && alt !== "") {
            return {
              passed: false,
              message:
                "Decorative image (role='presentation/none') should have empty alt text"
            }
          }

          // If image has empty alt, it should be marked as decorative
          if (alt === "" && !isExplicitlyDecorative) {
            return {
              passed: false,
              message:
                'Image with empty alt should be marked as decorative with role="presentation" or role="none"'
            }
          }

          return {
            passed: true,
            message: isExplicitlyDecorative
              ? "Decorative image is properly marked"
              : "Image is marked as meaningful with alt text"
          }
        },
        {
          description:
            "Decorative images should be properly marked with role='presentation' or role='none' and empty alt text",
          severity: "High"
        }
      )
    })
  }
)
