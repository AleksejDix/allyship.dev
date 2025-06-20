-- Create unified scan results materialized view
-- This combines both axe-core and AllyStudio scans into a single view
CREATE MATERIALIZED VIEW unified_scan_results AS
WITH scan_metrics AS (
  SELECT
    s.id as scan_id,
    s.page_id,
    s.status,
    s.scan_type,
    s.scope,
    s.created_at,
    s.completed_at,
    p.url as page_url,
    w.name as website_name,
    sp.name as space_name,
    sp.owner_id,

    -- Test execution metrics
    COALESCE(
      (SELECT COUNT(*) FROM test_executions te WHERE te.scan_id = s.id),
      0
    ) as total_tests,

    COALESCE(
      (SELECT COUNT(*) FROM test_executions te WHERE te.scan_id = s.id AND te.status = 'completed'),
      0
    ) as completed_tests,

    COALESCE(
      (SELECT COUNT(*) FROM test_executions te WHERE te.scan_id = s.id AND te.status = 'failed'),
      0
    ) as failed_tests,

    -- Test results metrics
    COALESCE(
      (SELECT COUNT(*) FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id),
      0
    ) as total_rules_tested,

    COALESCE(
      (SELECT COUNT(*) FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id AND tr.outcome = 'passed'),
      0
    ) as rules_passed,

    COALESCE(
      (SELECT COUNT(*) FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id AND tr.outcome = 'failed'),
      0
    ) as rules_failed,

    -- Element results metrics
    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id),
      0
    ) as total_elements_tested,

    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id AND ter.outcome = 'passed'),
      0
    ) as elements_passed,

    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id AND ter.outcome = 'failed'),
      0
    ) as elements_failed,

    -- WCAG criteria coverage
    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id AND ar.wcag_criteria IS NOT NULL),
      0
    ) as wcag_criteria_tested,

    -- Risk assessment based on failed elements
    CASE
      WHEN COALESCE(
        (SELECT COUNT(*) FROM test_element_results ter
         JOIN test_results tr ON ter.test_result_id = tr.id
         JOIN test_executions te ON tr.test_execution_id = te.id
         WHERE te.scan_id = s.id AND ter.outcome = 'failed'),
        0
      ) = 0 THEN 'low'
      WHEN COALESCE(
        (SELECT COUNT(*) FROM test_element_results ter
         JOIN test_results tr ON ter.test_result_id = tr.id
         JOIN test_executions te ON tr.test_execution_id = te.id
         WHERE te.scan_id = s.id AND ter.outcome = 'failed'),
        0
      ) <= 5 THEN 'medium'
      WHEN COALESCE(
        (SELECT COUNT(*) FROM test_element_results ter
         JOIN test_results tr ON ter.test_result_id = tr.id
         JOIN test_executions te ON tr.test_execution_id = te.id
         WHERE te.scan_id = s.id AND ter.outcome = 'failed'),
        0
      ) <= 20 THEN 'high'
      ELSE 'critical'
    END as risk_level,

    -- Compliance score calculation
    CASE
      WHEN COALESCE(
        (SELECT COUNT(*) FROM test_results tr
         JOIN test_executions te ON tr.test_execution_id = te.id
         WHERE te.scan_id = s.id),
        0
      ) = 0 THEN 0
      ELSE ROUND(
        (COALESCE(
          (SELECT COUNT(*) FROM test_results tr
           JOIN test_executions te ON tr.test_execution_id = te.id
           WHERE te.scan_id = s.id AND tr.outcome = 'passed'),
          0
        )::numeric / COALESCE(
          (SELECT COUNT(*) FROM test_results tr
           JOIN test_executions te ON tr.test_execution_id = te.id
           WHERE te.scan_id = s.id),
          1
        )::numeric) * 100, 1
      )
    END as compliance_score

  FROM "Scan" s
  JOIN "Page" p ON s.page_id = p.id
  JOIN "Website" w ON p.website_id = w.id
  JOIN "Space" sp ON w.space_id = sp.id
  WHERE s.status = 'completed'
),

coverage_analysis AS (
  SELECT
    sm.*,
    CASE
      WHEN sm.scan_type = 'axe_core' AND sm.scope = 'full_page' THEN 'comprehensive'
      WHEN sm.scan_type = 'axe_core' AND sm.scope != 'full_page' THEN 'automated_only'
      WHEN sm.scan_type = 'allystudio' THEN 'focused_only'
      WHEN sm.scan_type = 'hybrid' THEN 'comprehensive'
      ELSE 'not_scanned'
    END as coverage_type
  FROM scan_metrics sm
)

SELECT
  ca.*,
  -- Add summary flags for easy filtering
  (ca.rules_failed = 0) as all_rules_passed,
  (ca.elements_failed = 0) as all_elements_passed,
  (ca.compliance_score >= 95) as high_compliance,
  (ca.compliance_score >= 80) as acceptable_compliance,

  -- Time-based metrics
  EXTRACT(EPOCH FROM (ca.completed_at - ca.created_at)) as scan_duration_seconds,

  -- Categorize by scan recency
  CASE
    WHEN ca.completed_at >= NOW() - INTERVAL '1 day' THEN 'recent'
    WHEN ca.completed_at >= NOW() - INTERVAL '7 days' THEN 'this_week'
    WHEN ca.completed_at >= NOW() - INTERVAL '30 days' THEN 'this_month'
    ELSE 'older'
  END as scan_recency

FROM coverage_analysis ca;

-- Create WCAG audit report materialized view
-- This provides comprehensive WCAG compliance reporting
CREATE MATERIALIZED VIEW wcag_audit_report AS
WITH wcag_compliance AS (
  SELECT
    s.id as scan_id,
    s.page_id,
    s.scan_type,
    s.scope,
    s.created_at,
    s.completed_at,
    p.url as page_url,
    w.name as website_name,
    sp.name as space_name,
    sp.owner_id,

    -- WCAG Level A criteria
    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'A'),
      0
    ) as level_a_criteria_tested,

    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'A'
       AND tr.outcome = 'failed'),
      0
    ) as level_a_criteria_failed,

    -- WCAG Level AA criteria
    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'AA'),
      0
    ) as level_aa_criteria_tested,

    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'AA'
       AND tr.outcome = 'failed'),
      0
    ) as level_aa_criteria_failed,

    -- WCAG Level AAA criteria
    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'AAA'),
      0
    ) as level_aaa_criteria_tested,

    COALESCE(
      (SELECT COUNT(DISTINCT ar.wcag_criteria)
       FROM test_results tr
       JOIN test_executions te ON tr.test_execution_id = te.id
       JOIN act_rules ar ON tr.act_rule_id = ar.id
       WHERE te.scan_id = s.id
       AND ar.wcag_criteria IS NOT NULL
       AND ar.wcag_level = 'AAA'
       AND tr.outcome = 'failed'),
      0
    ) as level_aaa_criteria_failed,

    -- Total issues by severity
    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id
       AND ter.outcome = 'failed'
       AND ter.impact = 'critical'),
      0
    ) as critical_issues,

    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id
       AND ter.outcome = 'failed'
       AND ter.impact = 'serious'),
      0
    ) as serious_issues,

    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id
       AND ter.outcome = 'failed'
       AND ter.impact = 'moderate'),
      0
    ) as moderate_issues,

    COALESCE(
      (SELECT COUNT(*) FROM test_element_results ter
       JOIN test_results tr ON ter.test_result_id = tr.id
       JOIN test_executions te ON tr.test_execution_id = te.id
       WHERE te.scan_id = s.id
       AND ter.outcome = 'failed'
       AND ter.impact = 'minor'),
      0
    ) as minor_issues

  FROM "Scan" s
  JOIN "Page" p ON s.page_id = p.id
  JOIN "Website" w ON p.website_id = w.id
  JOIN "Space" sp ON w.space_id = sp.id
  WHERE s.status = 'completed'
)

SELECT
  wc.*,

  -- WCAG compliance calculations
  (wc.level_a_criteria_failed = 0) as wcag_a_compliant,
  (wc.level_a_criteria_failed = 0 AND wc.level_aa_criteria_failed = 0) as wcag_aa_compliant,
  (wc.level_a_criteria_failed = 0 AND wc.level_aa_criteria_failed = 0 AND wc.level_aaa_criteria_failed = 0) as wcag_aaa_compliant,

  -- Coverage type analysis
  CASE
    WHEN wc.scan_type = 'axe_core' AND wc.scope = 'full_page' THEN 'comprehensive'
    WHEN wc.scan_type = 'axe_core' AND wc.scope != 'full_page' THEN 'automated_only'
    WHEN wc.scan_type = 'allystudio' THEN 'focused_only'
    WHEN wc.scan_type = 'hybrid' THEN 'comprehensive'
    ELSE 'not_scanned'
  END as coverage_type,

  -- Risk assessment
  CASE
    WHEN (wc.critical_issues + wc.serious_issues) = 0 THEN 'low'
    WHEN (wc.critical_issues + wc.serious_issues) <= 3 THEN 'medium'
    WHEN (wc.critical_issues + wc.serious_issues) <= 10 THEN 'high'
    ELSE 'critical'
  END as risk_level,

  -- Total issues count
  (wc.critical_issues + wc.serious_issues + wc.moderate_issues + wc.minor_issues) as total_issues,

  -- Compliance score based on WCAG criteria
  CASE
    WHEN (wc.level_a_criteria_tested + wc.level_aa_criteria_tested + wc.level_aaa_criteria_tested) = 0 THEN 0
    ELSE ROUND(
      ((wc.level_a_criteria_tested + wc.level_aa_criteria_tested + wc.level_aaa_criteria_tested -
        wc.level_a_criteria_failed - wc.level_aa_criteria_failed - wc.level_aaa_criteria_failed)::numeric /
       (wc.level_a_criteria_tested + wc.level_aa_criteria_tested + wc.level_aaa_criteria_tested)::numeric) * 100, 1
    )
  END as wcag_compliance_score

FROM wcag_compliance wc;

-- Create indexes for performance
CREATE INDEX idx_unified_scan_results_page_id ON unified_scan_results(page_id);
CREATE INDEX idx_unified_scan_results_owner_id ON unified_scan_results(owner_id);
CREATE INDEX idx_unified_scan_results_scan_type ON unified_scan_results(scan_type);
CREATE INDEX idx_unified_scan_results_coverage_type ON unified_scan_results(coverage_type);
CREATE INDEX idx_unified_scan_results_compliance_score ON unified_scan_results(compliance_score);
CREATE INDEX idx_unified_scan_results_risk_level ON unified_scan_results(risk_level);

CREATE INDEX idx_wcag_audit_report_page_id ON wcag_audit_report(page_id);
CREATE INDEX idx_wcag_audit_report_owner_id ON wcag_audit_report(owner_id);
CREATE INDEX idx_wcag_audit_report_wcag_aa_compliant ON wcag_audit_report(wcag_aa_compliant);
CREATE INDEX idx_wcag_audit_report_coverage_type ON wcag_audit_report(coverage_type);
CREATE INDEX idx_wcag_audit_report_risk_level ON wcag_audit_report(risk_level);

-- Enable Row Level Security
ALTER MATERIALIZED VIEW unified_scan_results OWNER TO postgres;
ALTER MATERIALIZED VIEW wcag_audit_report OWNER TO postgres;

-- Grant permissions
GRANT SELECT ON unified_scan_results TO authenticated, service_role;
GRANT SELECT ON wcag_audit_report TO authenticated, service_role;

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_scan_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW unified_scan_results;
  REFRESH MATERIALIZED VIEW wcag_audit_report;
END;
$$;

-- Grant execute permission on refresh function
GRANT EXECUTE ON FUNCTION refresh_scan_views() TO service_role;
