---
title: "Guideline 3.1 – Readable"
description: "Make text content readable and understandable"
category: "Understandable"
tags: ["readability", "language", "content", "understanding"]
reflection:
  {
    validationPrompts:
      [
        "Is the language properly declared and identified?",
        "Are language changes clearly marked?",
        "Is content understandable for the target audience?",
        "Are technical terms and abbreviations properly explained?",
        "Is the reading level appropriate for the audience?",
      ],
    successCriteria:
      [
        "All pages have valid language declarations",
        "Language changes are programmatically determined",
        "Content follows plain language principles",
        "Technical terms have clear explanations",
        "Reading level matches target audience",
      ],
    impactAssessment:
      [
        "How does this affect screen reader pronunciation?",
        "What is the impact on translation tools?",
        "How does this support cognitive accessibility?",
        "What is the effect on international users?",
        "How does this impact content maintainability?",
      ],
  }
ai_instruction:
  {
    manager_agent:
      {
        role: "Coordinates, prioritizes, and aggregates readability validation tasks",
        process:
          [
            "Analyze document for readability requirements",
            "Identify and prioritize validation categories",
            "Distribute tasks to specialized Detection Agents",
            "Track agent performance and validation accuracy",
            "Aggregate findings into structured report",
            "Monitor historical trends and improvements",
          ],
        responsibilities:
          [
            "Task Distribution and Coordination",
            "Result Aggregation and Prioritization",
            "Detection Agent Management",
            "Validation Coverage Verification",
            "Agent Performance Tracking",
            "Issue Prioritization and Ranking",
            "Historical Trend Analysis",
            "Agent Registration Management",
          ],
        historical_tracking:
          {
            issue_trends:
              {
                tracking_period: "rolling_90_days",
                metrics:
                  [
                    "Issue frequency by type",
                    "Resolution time by severity",
                    "Recurring issues by site",
                    "False positive/negative rates",
                    "Agent confidence trends",
                  ],
                analysis:
                  [
                    "Identify common failure patterns",
                    "Track improvement over time",
                    "Monitor agent accuracy trends",
                    "Assess validation coverage",
                  ],
              },
            site_performance:
              {
                metrics:
                  [
                    "Total issues over time",
                    "Resolution rate",
                    "Regression frequency",
                    "Validation coverage",
                  ],
                tracking:
                  {
                    frequency: "weekly",
                    retention: "1_year",
                    aggregation: "by_guideline",
                  },
              },
          },
        agent_registration:
          {
            requirements:
              [
                "Define validation scope and capabilities",
                "Specify supported WCAG criteria",
                "Implement standardized output format",
                "Provide accuracy metrics",
              ],
            validation:
              {
                required_fields:
                  [
                    "agent_id",
                    "guideline_support",
                    "validation_capabilities",
                    "output_format_version",
                  ],
                performance_metrics:
                  [
                    "accuracy_score",
                    "confidence_threshold",
                    "false_positive_rate",
                    "processing_speed",
                  ],
              },
            dynamic_loading:
              {
                supported_types:
                  ["language", "readability", "structure", "semantics"],
                loading_strategy: "on_demand",
                version_management: "semantic_versioning",
              },
          },
        task_priority:
          {
            critical:
              [
                "Missing language declarations",
                "Invalid language codes",
                "Inaccessible content structure",
              ],
            high:
              [
                "Unmarked language changes",
                "Incorrect language inheritance",
                "Poor content readability",
              ],
            medium:
              [
                "Inconsistent language usage",
                "Suboptimal language codes",
                "Minor formatting issues",
              ],
            low: ["Style inconsistencies", "Optional enhancements"],
          },
        detection_agents:
          [
            {
              id: "document_language_validator",
              name: "Document Language Validator",
              guideline: "3.1.1",
              scope: "document-level",
              validation_rules:
                [
                  {
                    id: "html_lang_presence",
                    check: "Verify <html> element has lang attribute",
                    severity: "Critical",
                  },
                  {
                    id: "lang_code_format",
                    check: "Validate BCP 47 language code format",
                    severity: "High",
                  },
                  {
                    id: "lang_code_case",
                    check: "Ensure language code is lowercase",
                    severity: "Medium",
                  },
                ],
              output_format:
                {
                  findings: "Array<LanguageIssue>",
                  coverage:
                    { elements_checked: "number", issues_found: "number" },
                },
            },
            {
              id: "content_language_validator",
              name: "Content Language Validator",
              guideline: "3.1.2",
              scope: "inline-content",
              validation_rules:
                [
                  {
                    id: "inline_lang_changes",
                    check: "Detect content in different languages",
                    severity: "High",
                  },
                  {
                    id: "lang_attribute_presence",
                    check: "Verify lang attribute on language changes",
                    severity: "High",
                  },
                  {
                    id: "lang_inheritance",
                    check: "Validate language inheritance in DOM",
                    severity: "Medium",
                  },
                ],
              output_format:
                {
                  findings: "Array<LanguageIssue>",
                  coverage:
                    { elements_checked: "number", issues_found: "number" },
                },
            },
          ],
        output_format:
          {
            summary:
              {
                total_issues: "number",
                critical_issues: "number",
                high_priority_issues: "number",
                medium_priority_issues: "number",
                low_priority_issues: "number",
                validation_coverage:
                  {
                    total_elements: "number",
                    elements_checked: "number",
                    coverage_percentage: "number",
                  },
                agent_performance:
                  {
                    total_validations: "number",
                    false_positives: "number",
                    false_negatives: "number",
                    average_confidence: "number",
                    confidence_trend: "increasing | decreasing | stable",
                    historical_accuracy:
                      {
                        last_30_days: "number",
                        last_90_days: "number",
                        trend: "improving | stable | declining",
                      },
                  },
                historical_trends:
                  {
                    issue_frequency:
                      {
                        by_type: "Record<string, number>",
                        by_severity: "Record<string, number>",
                        by_guideline: "Record<string, number>",
                      },
                    resolution_metrics:
                      {
                        average_time: "number",
                        by_severity: "Record<string, number>",
                        trend: "improving | stable | declining",
                      },
                  },
              },
            findings:
              {
                type: "Array<ValidationFinding>",
                format:
                  {
                    issue_id: "string",
                    rule_id: "string",
                    agent_id: "string",
                    step_id: "string",
                    location:
                      {
                        xpath: "string",
                        selector: "string",
                        element_type: "string",
                        attribute: "string",
                        context: "string",
                      },
                    severity: "Critical | High | Medium | Low",
                    confidence: "number",
                    evidence:
                      {
                        found_value: "string",
                        expected_value: "string",
                        snippet: "string",
                      },
                    impact:
                      {
                        user_groups: "string[]",
                        assistive_tech: "string[]",
                        functionality: "string[]",
                      },
                    fix_suggestion:
                      {
                        description: "string",
                        code_example: "string",
                        related_resources: "string[]",
                      },
                    history:
                      {
                        first_detected: "string",
                        last_detected: "string",
                        occurrence_count: "number",
                        resolution_attempts: "number",
                      },
                  },
              },
          },
      },
  }
---

# Guideline 3.1 – Readable

## Overview

This guideline ensures that text content is readable and understandable for all users. It addresses language identification, uncommon word usage, abbreviations, and reading level requirements to make content accessible to users with different language abilities and cognitive needs.

## Success Criteria

### [3.1.1 Language of Page (Level A)](./3.1.1-language-of-page.md)

- Default human language of each page must be programmatically determined
- Language must be specified using valid language codes
- Language must be set on the HTML element
- Language must reflect the primary language of the page content

## Why This Matters

Clear and understandable content is essential because:

- Screen readers need language information to use correct pronunciation
- Translation tools need to identify the source language
- Users with cognitive disabilities need clear, simple content
- Multi-language users need to identify content in their preferred language

## Implementation Approaches

1. **Language Declaration**

   - Use valid HTML lang attributes
   - Specify language at document level
   - Mark language changes within content
   - Use ISO language codes

2. **Content Clarity**

   - Use clear, simple language
   - Define uncommon terms
   - Explain abbreviations
   - Provide summaries for complex content

3. **Multi-language Support**

   - Mark language changes appropriately
   - Provide translations when needed
   - Use language switchers effectively
   - Support right-to-left languages

4. **Reading Level**
   - Write for target audience
   - Provide simplified versions
   - Use clear headings and structure
   - Break down complex information

## Common Patterns

### Language Declaration

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page Title</title>
  </head>
  <body>
    <!-- English content -->
    <p>Main content in English.</p>

    <!-- Content in another language -->
    <p lang="es">Contenido en español.</p>
  </body>
</html>
```

### Next.js Language Configuration

```tsx
// layout.tsx
export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Testing Checklist

1. **Language Declaration**

   - Verify HTML lang attribute
   - Check language code validity
   - Test screen reader pronunciation
   - Validate language changes

2. **Content Structure**

   - Review heading hierarchy
   - Check content organization
   - Test readability
   - Verify translations

3. **Technical Implementation**

   - Validate HTML markup
   - Test language switching
   - Check meta tags
   - Verify character encoding

4. **User Experience**
   - Test with screen readers
   - Check translation tools
   - Verify language detection
   - Test RTL support

## Resources

- [W3C - Understanding Readable](https://www.w3.org/WAI/WCAG21/Understanding/readable)
- [MDN - HTML Language Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
- [ISO Language Codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)
- [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
