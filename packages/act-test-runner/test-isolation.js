/**
 * Test isolation functionality
 */
import { createTestRunner } from './src/core/runner.js';
// Create test DOM
document.body.innerHTML = `
  <div id="test-container">
    <p id="test-element">Original content</p>
  </div>
`;
const runner = createTestRunner({
    isolation: {
        enabled: true,
        restoreDOM: true,
        clearStyles: true,
        isolateGlobals: ['testGlobal']
    }
});
// Test isolation
runner.describe('Isolation Tests', () => {
    runner.test('should restore DOM after modification', ({ element }) => {
        // Modify the DOM
        element.textContent = 'Modified content';
        element.style.color = 'red';
        // Add a new element
        const newDiv = document.createElement('div');
        newDiv.id = 'added-by-test';
        newDiv.textContent = 'Added by test';
        document.body.appendChild(newDiv);
        console.log('During test:', element.textContent);
        console.log('Added element exists:', !!document.getElementById('added-by-test'));
    });
    runner.test('should have clean DOM state', ({ element }) => {
        // This test should see the original DOM state
        console.log('After isolation:', element.textContent);
        console.log('Added element exists:', !!document.getElementById('added-by-test'));
        if (element.textContent !== 'Original content') {
            throw new Error(`Expected "Original content", got "${element.textContent}"`);
        }
        if (document.getElementById('added-by-test')) {
            throw new Error('Added element should not exist after isolation');
        }
    });
    runner.test('should isolate global variables', () => {
        // Set a global variable
        ;
        window.testGlobal = 'modified by test';
        console.log('Set global during test:', window.testGlobal);
    });
    runner.test('should restore global variables', () => {
        // Global should be restored
        console.log('Global after isolation:', window.testGlobal);
        if (window.testGlobal !== undefined) {
            throw new Error('Global variable should be restored/cleared after isolation');
        }
    });
}, '#test-element');
async function runIsolationTest() {
    console.log('🧪 Testing isolation functionality...');
    // Store original state
    const originalContent = document.getElementById('test-element')?.textContent;
    console.log('Original content:', originalContent);
    // Run tests
    const results = await runner.runTests();
    // Check final state
    const finalContent = document.getElementById('test-element')?.textContent;
    console.log('Final content:', finalContent);
    console.log('Final added element exists:', !!document.getElementById('added-by-test'));
    // Report results
    results.forEach(suite => {
        console.log(`\n📋 Suite: ${suite.name}`);
        console.log(`   ✅ Passed: ${suite.passed}`);
        console.log(`   ❌ Failed: ${suite.failed}`);
        console.log(`   ⏭️  Skipped: ${suite.skipped}`);
        suite.tests.forEach(test => {
            const icon = test.outcome === 'pass' ? '✅' : test.outcome === 'fail' ? '❌' : '⏭️';
            console.log(`   ${icon} ${test.name}: ${test.message}`);
            if (test.error) {
                console.log(`      Error: ${test.error.message}`);
            }
        });
    });
    // Test isolation API
    console.log('\n🔧 Testing isolation API...');
    const config = runner.getIsolationConfig();
    console.log('Current isolation config:', config);
    runner.setIsolationConfig({ enabled: false });
    console.log('Disabled isolation:', runner.getIsolationConfig()?.enabled);
    runner.setIsolationConfig({ enabled: true });
    console.log('Re-enabled isolation:', runner.getIsolationConfig()?.enabled);
    // Test manual snapshot/restore
    console.log('\n📸 Testing manual snapshot/restore...');
    const snapshot = runner.createSnapshot();
    console.log('Created snapshot:', !!snapshot);
    // Modify DOM
    document.body.style.backgroundColor = 'yellow';
    console.log('Modified background color');
    // Restore
    if (snapshot) {
        runner.restoreSnapshot(snapshot);
        console.log('Restored snapshot');
        console.log('Background color after restore:', document.body.style.backgroundColor || 'default');
    }
    console.log('\n🎉 Isolation test completed!');
}
// Run the test
runIsolationTest().catch(console.error);
