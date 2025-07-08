#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read source files
const domMonitorPath = path.join(__dirname, '..', 'src', 'dom-monitor.ts');
const typesPath = path.join(__dirname, '..', 'src', 'types.ts');
const utilsPath = path.join(__dirname, '..', 'src', 'utils.ts');
const testPath = path.join(__dirname, '..', 'tests', 'dom-monitor.test.ts');

const domMonitorContent = fs.readFileSync(domMonitorPath, 'utf8');
const typesContent = fs.readFileSync(typesPath, 'utf8');
const utilsContent = fs.readFileSync(utilsPath, 'utf8');
const testContent = fs.readFileSync(testPath, 'utf8');

console.log('🔍 DOM Monitor Coverage Analysis');
console.log('================================\n');

// Analyze functions in dom-monitor.ts
const functions = [
  'createDOMMonitor',
  'monitorDOM',
  'start',
  'stop',
  'isActive',
  'getMetrics',
  'shouldIgnoreEl',
  'updatePerformanceMetrics',
  'processFrame',
  'scheduleFrame',
  'createChange',
  'processMutations'
];

const features = [
  'ELEMENT_ADDED',
  'ELEMENT_REMOVED',
  'ATTRIBUTE_CHANGED',
  'CONTENT_CHANGED',
  'ACCESSIBILITY_CHANGE',
  'PERFORMANCE_IMPACT',
  'ignoreClassChanges',
  'ignoreStyleChanges',
  'elementFilter',
  'attributeFilter',
  'maxChanges',
  'observeText',
  'trackPerformance',
  'trackAccessibility',
  'debug'
];

console.log('📊 FUNCTION COVERAGE:');
console.log('---------------------');

functions.forEach(func => {
  const isInTests = testContent.includes(func);
  const status = isInTests ? '✅' : '❌';
  console.log(`${status} ${func}`);
});

console.log('\n📋 FEATURE COVERAGE:');
console.log('--------------------');

features.forEach(feature => {
  const isInTests = testContent.includes(feature);
  const status = isInTests ? '✅' : '❌';
  console.log(`${status} ${feature}`);
});

// Count lines of code
const domMonitorLines = domMonitorContent.split('\n').length;
const typesLines = typesContent.split('\n').length;
const utilsLines = utilsContent.split('\n').length;
const testLines = testContent.split('\n').length;

console.log('\n📈 CODE METRICS:');
console.log('----------------');
console.log(`Source Code: ${domMonitorLines + typesLines + utilsLines} lines`);
console.log(`Test Code: ${testLines} lines`);
console.log(`Test/Source Ratio: ${(testLines / (domMonitorLines + typesLines + utilsLines)).toFixed(2)}x`);

// Test coverage estimation
const testedFunctions = functions.filter(func => testContent.includes(func)).length;
const testedFeatures = features.filter(feature => testContent.includes(feature)).length;

console.log('\n🎯 COVERAGE ESTIMATES:');
console.log('---------------------');
console.log(`Functions: ${testedFunctions}/${functions.length} (${Math.round(testedFunctions/functions.length * 100)}%)`);
console.log(`Features: ${testedFeatures}/${features.length} (${Math.round(testedFeatures/features.length * 100)}%)`);

const overallCoverage = Math.round((testedFunctions + testedFeatures) / (functions.length + features.length) * 100);
console.log(`Overall Estimated Coverage: ${overallCoverage}%`);

// Quality assessment
console.log('\n🏆 QUALITY ASSESSMENT:');
console.log('----------------------');
if (overallCoverage >= 90) {
  console.log('🥇 EXCELLENT - Production ready!');
} else if (overallCoverage >= 75) {
  console.log('🥈 GOOD - Solid coverage, minor gaps');
} else if (overallCoverage >= 60) {
  console.log('🥉 FAIR - Needs improvement');
} else {
  console.log('❌ POOR - Significant gaps');
}

console.log('\n✨ Analysis complete!');
