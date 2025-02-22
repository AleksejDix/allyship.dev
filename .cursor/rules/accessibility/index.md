---

title: "Accessibility Guidelines"
description: "Guidelines for creating accessible web content following WCAG 2.1 standards"
category: "Accessibility"
tags: ["accessibility", "wcag", "a11y"]
ai_instruction: {
manager_agent: {
role: "Coordinates accessibility validation across all WCAG guidelines",
responsibilities: [
"Identify and categorize accessibility requirements",
"Distribute validation tasks to specialized agents",
"Aggregate and prioritize findings across categories",
"Generate comprehensive accessibility reports"
],
output_format: {
summary: {
total_issues: "number",
by_severity: {
critical: "number",
high: "number",
medium: "number",
low: "number"
},
by_category: {
perceivable: "number",
operable: "number",
understandable: "number",
robust: "number"
},
by_level: {
a: "number",
aa: "number",
aaa: "number"
}
},
validation_results: "Array<AccessibilityIssue>"
}
},
detection_agents: [
{
id: "perceivable_validator",
name: "Perceivable Content Validator",
category: "1. Perceivable",
validation_rules: [
{
id: "text_alternatives",
guideline: "1.1",
check: "Validate text alternatives for non-text content",
sub_agents: ["ImageAltValidator", "MediaAltValidator", "DecorationValidator"]
},
{
id: "time_based_media",
guideline: "1.2",
check: "Validate alternatives for time-based media",
sub_agents: ["CaptionValidator", "AudioDescriptionValidator", "TranscriptValidator"]
},
{
id: "adaptable",
guideline: "1.3",
check: "Validate content adaptability and structure",
sub_agents: ["StructureValidator", "SequenceValidator", "CharacteristicsValidator"]
},
{
id: "distinguishable",
guideline: "1.4",
check: "Validate content distinguishability",
sub_agents: ["ContrastValidator", "ResizeValidator", "AudioControlValidator"]
}
]
},
{
id: "operable_validator",
name: "Operability Validator",
category: "2. Operable",
validation_rules: [
{
id: "keyboard_accessible",
guideline: "2.1",
check: "Validate keyboard accessibility",
sub_agents: ["KeyboardValidator", "NoTrappingValidator", "ShortcutValidator"]
},
{
id: "timing",
guideline: "2.2",
check: "Validate timing adjustability",
sub_agents: ["TimeoutValidator", "PauseValidator", "NoInterruptValidator"]
},
{
id: "navigation",
guideline: "2.4",
check: "Validate navigation mechanisms",
sub_agents: ["BypassValidator", "TitleValidator", "FocusValidator", "PurposeValidator"]
}
]
},
{
id: "understandable_validator",
name: "Understandability Validator",
category: "3. Understandable",
validation_rules: [
{
id: "readable",
guideline: "3.1",
check: "Validate content readability",
sub_agents: ["LanguageValidator", "UncommonWordValidator", "AbbreviationValidator"]
},
{
id: "predictable",
guideline: "3.2",
check: "Validate operation predictability",
sub_agents: ["OnFocusValidator", "OnInputValidator", "ConsistencyValidator"]
},
{
id: "input_assistance",
guideline: "3.3",
check: "Validate input assistance",
sub_agents: ["ErrorValidator", "LabelValidator", "SuggestionValidator"]
}
]
},
{
id: "robust_validator",
name: "Robustness Validator",
category: "4. Robust",
validation_rules: [
{
id: "compatible",
guideline: "4.1",
check: "Validate compatibility",
sub_agents: ["ParsingValidator", "NameRoleValidator", "StatusValidator"]
}
]
}
],
response_format: {
type: "AccessibilityIssue",
properties: {
issue_id: "string",
guideline: "string",
agent_id: "string",
location: {
xpath: "string",
selector: "string",
component: "string"
},
severity: "Critical | High | Medium | Low",
level: "A | AA | AAA",
confidence: "percentage",
evidence: {
found: "string",
expected: "string",
snippet: "string"
},
impact: {
user_groups: "string[]",
assistive_tech: "string[]",
functionality: "string[]"
},
fix_suggestion: {
description: "string",
code_example: "string",
resources: "string[]"
}
}
}
}

# Accessibility Guidelines

// ... existing content ...
