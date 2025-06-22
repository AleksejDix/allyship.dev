import { describe, test, runTests, clear, configure } from './dist/index.js'

// Configure with minimal reporter for clean output
configure({ reporter: 'minimal' })

// Clear any previous tests
clear()

describe('Normal Suite 1', () => {
  test('normal test 1', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')

  test('normal test 2', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')
})

describe.only('Focused Suite', () => {
  test('focused suite test 1', ({ element }) => {
    console.log('✅ This SHOULD run (focused suite)')
  }, 'body')

  test('focused suite test 2', ({ element }) => {
    console.log('✅ This SHOULD run (focused suite)')
  }, 'body')
})

describe('Normal Suite 2', () => {
  test('normal test 3', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')
})

console.log('🧪 Testing describe.only functionality...')
const results1 = await runTests()

console.log('\n📊 Results:')
console.log(`Total suites: ${results1.length}`)
console.log(`Suite names: ${results1.map(r => r.name).join(', ')}`)
console.log(`Total tests run: ${results1.reduce((sum, r) => sum + r.tests.length, 0)}`)

// Clear and test test.only
clear()

describe('Suite with focused tests', () => {
  test('normal test', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')

  test.only('focused test 1', ({ element }) => {
    console.log('✅ This SHOULD run (focused test)')
  }, 'body')

  test('another normal test', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')

  test.only('focused test 2', ({ element }) => {
    console.log('✅ This SHOULD run (focused test)')
  }, 'body')
})

describe('Another suite', () => {
  test('normal test in other suite', ({ element }) => {
    console.log('This should NOT run')
  }, 'body')
})

console.log('\n🧪 Testing test.only functionality...')
const results2 = await runTests()

console.log('\n📊 Results:')
console.log(`Total suites: ${results2.length}`)
console.log(`Suite names: ${results2.map(r => r.name).join(', ')}`)
console.log(`Total tests run: ${results2.reduce((sum, r) => sum + r.tests.length, 0)}`)
console.log(`Passed tests: ${results2.reduce((sum, r) => sum + r.passed, 0)}`)
console.log(`Skipped tests: ${results2.reduce((sum, r) => sum + r.skipped, 0)}`)

// Clear and test mixed scenario
clear()

describe.only('Focused suite with mixed tests', () => {
  test('normal test in focused suite', ({ element }) => {
    console.log('✅ This SHOULD run (in focused suite)')
  }, 'body')

  test.only('focused test in focused suite', ({ element }) => {
    console.log('✅ This SHOULD run (focused test in focused suite)')
  }, 'body')
})

describe('Normal suite with focused test', () => {
  test.only('focused test in normal suite', ({ element }) => {
    console.log('This should NOT run (focused test but suite not focused)')
  }, 'body')
})

console.log('\n🧪 Testing mixed focus scenario...')
const results3 = await runTests()

console.log('\n📊 Results:')
console.log(`Total suites: ${results3.length}`)
console.log(`Suite names: ${results3.map(r => r.name).join(', ')}`)
console.log(`Total tests run: ${results3.reduce((sum, r) => sum + r.tests.length, 0)}`)

console.log('\n✅ Focus functionality test complete!')
