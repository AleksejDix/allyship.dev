# 🚀 ACT Test Runner - Benchmarks

This directory contains performance benchmarking tools for the ACT Test Runner package.

## 📁 Files Overview

### 🎯 **Baseline Measurement**
- **`baseline.html`** - Interactive baseline measurement runner
- **`baseline.js`** - Baseline measurement class and utilities
- Run this first to establish current performance metrics

### 📊 **Benchmark Suite**
- **`benchmark-runner.html`** - Comprehensive benchmark runner with axe-core comparison
- **`performance-tracker.js`** - Performance measurement utilities
- Full benchmark suite with visual reporting

### 🧪 **Stress Test Files**
- **`stress-test-1k.html`** - 1,000 elements for testing
- **`stress-test-10k.html`** - 10,000 elements for testing
- **`stress-test-100k.html`** - 100,000 elements for testing
- Various accessibility issues for comprehensive testing

## 🚀 Quick Start

### 1. **Run Baseline Measurement**
```bash
# Open in browser
open benchmarks/baseline.html
```
Click "🚀 Run Baseline Measurement" to establish current performance metrics.

### 2. **Run Full Benchmark Suite**
```bash
# Open in browser
open benchmarks/benchmark-runner.html
```
Use the buttons to run different benchmark scenarios.

### 3. **Compare with axe-core**
In `benchmark-runner.html`, click "Compare with axe-core" to see performance differences.

## 📈 Benchmark Types

### **Element Counts**
- **1K Elements** - Quick performance check
- **10K Elements** - Medium-scale testing
- **100K Elements** - Stress testing

### **Test Categories**
- **Images** - Alt text validation
- **Buttons** - Accessible name checking
- **Links** - Meaningful text validation
- **Language Tags** - BCP 47 compliance
- **Forms** - Label association

## 🔍 Performance Metrics

### **Measured Values**
- **Duration** - Execution time in milliseconds
- **Memory Usage** - Heap memory consumption
- **Elements/sec** - Processing speed
- **Issues Found** - Accessibility violations detected

### **Comparison Metrics**
- **Speed Improvement** - Compared to baseline/axe-core
- **Memory Efficiency** - Memory usage optimization
- **Accuracy** - Issue detection accuracy

## 💾 Data Export

### **Baseline Data**
- Automatically saved to localStorage
- JSON export available for historical tracking
- Comparison with previous baselines

### **Benchmark Results**
- Full benchmark data export
- Performance comparison reports
- Environment metadata included

## 🎯 Usage Examples

### **Basic Baseline**
```javascript
const baseline = new BaselineMeasurement();
const report = await baseline.runBaseline();
console.log(report.summary);
```

### **Performance Tracking**
```javascript
const tracker = new PerformanceTracker();
tracker.startTest('my-test');
// ... run test ...
const result = tracker.endTest('my-test');
```

### **Comparison Analysis**
```javascript
const comparison = BaselineMeasurement.compareBaselines(current, previous);
console.log(`Improvement: ${comparison.summary.overallImprovement}%`);
```

## 🔧 Browser Requirements

### **Recommended**
- **Chrome/Chromium** - Full memory profiling support
- **Firefox** - Basic performance measurement
- **Safari** - Basic performance measurement

### **Features**
- **Performance API** - High-resolution timing
- **Memory API** - Chrome DevTools memory profiling
- **ES Modules** - Modern JavaScript support

## 📊 Interpreting Results

### **Good Performance**
- **>10,000 elements/sec** - Fast processing
- **<100ms for 1K elements** - Responsive
- **<10MB memory usage** - Efficient

### **Performance Targets**
- **25x faster than axe-core** - Ultimate goal
- **Single DOM pass** - Architecture efficiency
- **Minimal memory footprint** - Scalability

## 🚀 Next Steps

1. **Run baseline** to establish current metrics
2. **Implement optimizations** based on results
3. **Re-run benchmarks** to measure improvements
4. **Compare with axe-core** to track progress toward 25x goal

---

*Part of the ACT Test Runner performance optimization project*
