<template>
  <div class="container">
    <header>
      <h1>Slack Security Dashboard</h1>
      <p v-if="scanResult">{{ scanResult.teamName }}</p>
    </header>

    <main>
      <button @click="runScan" :disabled="isScanning" class="scan-btn">
        {{ isScanning ? 'Scanning...' : 'Run Security Scan' }}
      </button>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="scanResult" class="results">
        <section class="summary">
          <h2>Summary</h2>
          <div class="severity-grid">
            <div class="severity-item critical">
              <span class="count">{{ scanResult.summary.critical }}</span>
              <span class="label">Critical</span>
            </div>
            <div class="severity-item high">
              <span class="count">{{ scanResult.summary.high }}</span>
              <span class="label">High</span>
            </div>
            <div class="severity-item medium">
              <span class="count">{{ scanResult.summary.medium }}</span>
              <span class="label">Medium</span>
            </div>
            <div class="severity-item low">
              <span class="count">{{ scanResult.summary.low }}</span>
              <span class="label">Low</span>
            </div>
            <div class="severity-item info">
              <span class="count">{{ scanResult.summary.info }}</span>
              <span class="label">Info</span>
            </div>
          </div>
        </section>

        <section class="compliance">
          <h2>Compliance Scores</h2>
          <div class="compliance-grid">
            <div v-for="score in scanResult.compliance" :key="score.framework" class="compliance-item">
              <h3>{{ score.framework }}</h3>
              <div class="score">{{ score.score }}%</div>
              <div class="details">
                <span class="passed">{{ score.passed }} passed</span>
                <span class="failed">{{ score.failed }} failed</span>
              </div>
            </div>
          </div>
        </section>

        <section class="findings">
          <h2>Findings</h2>
          <div v-for="finding in scanResult.findings" :key="finding.id" class="finding" :class="finding.severity">
            <div class="finding-header">
              <h3>{{ finding.title }}</h3>
              <span class="severity-badge">{{ finding.severity }}</span>
            </div>
            <p class="description">{{ finding.description }}</p>
            <div class="remediation">
              <strong>Remediation:</strong> {{ finding.remediation }}
            </div>
            <div class="compliance-tags">
              <span v-for="comp in finding.compliance" :key="comp.framework" class="tag">
                {{ comp.framework }} - {{ comp.control }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const isScanning = ref(false)
const scanResult = ref<any>(null)
const error = ref<string | null>(null)

const runScan = async () => {
  isScanning.value = true
  error.value = null

  try {
    console.log('Fetching scan results...')
    const response = await fetch('/api/scan')

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Scan failed:', errorData)
      throw new Error(errorData.message || `Scan failed with status ${response.status}`)
    }

    scanResult.value = await response.json()
    console.log('Scan completed:', scanResult.value)
  } catch (err) {
    console.error('Scan error:', err)
    error.value = err instanceof Error ? err.message : 'Scan failed'
  } finally {
    isScanning.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

.scan-btn {
  background: #4A154B;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
}

.scan-btn:hover:not(:disabled) {
  background: #611f69;
}

.scan-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  padding: 1rem;
  border-radius: 4px;
  color: #c00;
  margin-bottom: 1rem;
}

.summary, .compliance, .findings {
  margin-bottom: 2rem;
}

.severity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.severity-item {
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.severity-item.critical { background: #fee; border: 2px solid #c00; }
.severity-item.high { background: #fed; border: 2px solid #f80; }
.severity-item.medium { background: #ffc; border: 2px solid #fc0; }
.severity-item.low { background: #eff; border: 2px solid #0cf; }
.severity-item.info { background: #eef; border: 2px solid #00f; }

.severity-item .count {
  display: block;
  font-size: 2rem;
  font-weight: bold;
}

.severity-item .label {
  display: block;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.compliance-item {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.compliance-item .score {
  font-size: 2rem;
  font-weight: bold;
  color: #4A154B;
}

.finding {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.finding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 600;
}

.finding.critical .severity-badge { background: #c00; color: white; }
.finding.high .severity-badge { background: #f80; color: white; }
.finding.medium .severity-badge { background: #fc0; color: black; }
.finding.low .severity-badge { background: #0cf; color: black; }
.finding.info .severity-badge { background: #00f; color: white; }

.remediation {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.compliance-tags {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #eee;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
