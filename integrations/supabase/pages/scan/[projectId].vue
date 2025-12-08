<template>
  <div class="scan-results">
    <header>
      <h1>Security Scan: {{ result?.projectName || projectId }}</h1>
      <p v-if="result?.scannedAt" class="timestamp">
        Scanned {{ new Date(result.scannedAt).toLocaleString() }}
      </p>
    </header>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Running security scan...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Scan Failed</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="result" class="results">
      <!-- Summary -->
      <section class="summary">
        <h2>Summary</h2>
        <div class="severity-cards">
          <div class="card critical">
            <span class="count">{{ result.summary.critical }}</span>
            <span class="label">Critical</span>
          </div>
          <div class="card high">
            <span class="count">{{ result.summary.high }}</span>
            <span class="label">High</span>
          </div>
          <div class="card medium">
            <span class="count">{{ result.summary.medium }}</span>
            <span class="label">Medium</span>
          </div>
          <div class="card low">
            <span class="count">{{ result.summary.low }}</span>
            <span class="label">Low</span>
          </div>
          <div class="card info">
            <span class="count">{{ result.summary.info }}</span>
            <span class="label">Info</span>
          </div>
        </div>
      </section>

      <!-- Compliance Scores -->
      <section class="compliance">
        <h2>Compliance Status</h2>
        <div class="framework-scores">
          <div
            v-for="framework in result.compliance"
            :key="framework.framework"
            class="framework"
          >
            <h3>{{ framework.framework }}</h3>
            <div class="score-bar">
              <div
                class="score-fill"
                :style="{ width: framework.score + '%' }"
              ></div>
            </div>
            <p>{{ framework.score }}% ({{ framework.failed }} issues)</p>
          </div>
        </div>
      </section>

      <!-- Findings -->
      <section class="findings">
        <h2>Findings ({{ result.findings.length }})</h2>

        <div
          v-for="finding in result.findings"
          :key="finding.id"
          :class="['finding', finding.severity]"
        >
          <div class="finding-header">
            <span :class="['severity-badge', finding.severity]">
              {{ finding.severity }}
            </span>
            <h3>{{ finding.title }}</h3>
          </div>

          <p class="description">{{ finding.description }}</p>

          <div class="metadata">
            <span class="category">{{ finding.category }}</span>
            <span class="resource">
              {{ finding.resource.type }}: {{ finding.resource.name }}
            </span>
          </div>

          <div class="compliance-tags">
            <span
              v-for="comp in finding.compliance"
              :key="comp.framework"
              class="tag"
            >
              {{ comp.framework }}
            </span>
          </div>

          <details class="remediation">
            <summary>Remediation</summary>
            <p>{{ finding.remediation.description }}</p>
            <pre v-if="finding.remediation.code"><code>{{ finding.remediation.code }}</code></pre>
            <a
              v-if="finding.remediation.documentation"
              :href="finding.remediation.documentation"
              target="_blank"
              rel="noopener"
            >
              Documentation →
            </a>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScanResult } from '~/server/utils/scanner/types'

const route = useRoute()
const projectId = route.params.projectId as string

const loading = ref(true)
const error = ref<string | null>(null)
const result = ref<ScanResult | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(`/api/scan/${projectId}`)
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Scan failed')
    }
    result.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.scan-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.timestamp {
  color: #666;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3ECF8E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #fee;
  color: #c00;
  padding: 2rem;
  border-radius: 8px;
}

/* Summary */
.summary {
  margin-bottom: 3rem;
}

.severity-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.card {
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.card .count {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card .label {
  display: block;
  font-size: 0.9rem;
  text-transform: uppercase;
  opacity: 0.8;
}

.card.critical { background: #fee; color: #c00; }
.card.high { background: #fef3e0; color: #f57c00; }
.card.medium { background: #fff8e1; color: #f9a825; }
.card.low { background: #e8f5e9; color: #2e7d32; }
.card.info { background: #e3f2fd; color: #1976d2; }

/* Compliance */
.compliance {
  margin-bottom: 3rem;
}

.framework-scores {
  display: grid;
  gap: 1rem;
}

.framework h3 {
  margin-bottom: 0.5rem;
}

.score-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.score-fill {
  height: 100%;
  background: #3ECF8E;
  transition: width 0.3s;
}

/* Findings */
.findings {
  margin-top: 3rem;
}

.finding {
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid #666;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.finding.critical { border-left-color: #c00; }
.finding.high { border-left-color: #f57c00; }
.finding.medium { border-left-color: #f9a825; }
.finding.low { border-left-color: #2e7d32; }
.finding.info { border-left-color: #1976d2; }

.finding-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.severity-badge.critical { background: #fee; color: #c00; }
.severity-badge.high { background: #fef3e0; color: #f57c00; }
.severity-badge.medium { background: #fff8e1; color: #f9a825; }
.severity-badge.low { background: #e8f5e9; color: #2e7d32; }
.severity-badge.info { background: #e3f2fd; color: #1976d2; }

.finding h3 {
  margin: 0;
  font-size: 1.1rem;
}

.description {
  margin-bottom: 1rem;
  color: #333;
}

.metadata {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.compliance-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.remediation {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.remediation summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.remediation pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
}

.remediation a {
  color: #3ECF8E;
  text-decoration: none;
}

.remediation a:hover {
  text-decoration: underline;
}
</style>
