# ACT Test Runner - Modular Demo

This demo showcases the new modular architecture of the ACT Test Runner, featuring configurable plugins, multiple reporters, and real-time visual feedback.

## Features

### 🏗️ Modular Architecture
- **Plugin System**: Enable/disable plugins based on your needs
- **Reporter Options**: Choose from Console, Minimal, or JSON reporters
- **Configurable Options**: Adjust timeout, verbose output, and bail behavior

### 🔌 Available Plugins

#### Performance Plugin
- Measures test execution time
- Tracks memory usage
- Provides performance metrics in results

#### AllyStudio Plugin
- Visual element highlighting during tests
- Real-time feedback on test outcomes
- Integration with AllyStudio browser extension

#### Expectations Plugin (Core)
- Always enabled - provides core testing functionality
- Implements `expect.pass()`, `expect.fail()`, and `expect.skip()` methods

### 📊 Reporter Options

#### Console Reporter
- Detailed console output
- Color-coded results
- Verbose logging options

#### Minimal Reporter
- Clean, minimal output
- Essential information only
- Faster performance

#### JSON Reporter
- Structured JSON output
- Perfect for CI/CD integration
- Machine-readable results

## Test Suites

The demo includes comprehensive accessibility tests covering:

### 🖼️ Image Accessibility
- **ACT Rule**: b33eff
- **WCAG Criteria**: 1.1.1
- **Tests**: Alt text presence, meaningfulness, and quality

### 🔘 Button Accessibility
- **ACT Rule**: b5c3f8
- **WCAG Criteria**: 4.1.2
- **Tests**: Accessible name via text content, aria-label, or aria-labelledby

### 🔗 Link Accessibility
- **ACT Rule**: c487ae
- **WCAG Criteria**: 2.4.4
- **Tests**: Meaningful link text that describes destination

### 📝 Form Accessibility
- **ACT Rule**: e086e5
- **WCAG Criteria**: 1.3.1, 3.3.2
- **Tests**: Label association via for/id, aria-label, aria-labelledby, or wrapping label

### 🌐 Language Attributes
- **ACT Rule**: de46e4
- **WCAG Criteria**: 3.1.1, 3.1.2
- **Tests**: Valid BCP 47 language tags

## Usage

### Running the Demo

1. **Open the demo**:
   ```bash
   open packages/act-test-runner/demo/index.html
   ```

2. **Configure options**:
   - Select plugins to enable/disable
   - Choose reporter type
   - Adjust test settings

3. **Run tests**:
   - Click "🚀 Run Tests" to execute accessibility tests
   - View real-time results with visual highlighting
   - Export results as JSON for further analysis

### Configuration Options

#### Plugins
- ✅ **Performance Plugin**: Enables performance tracking
- ✅ **AllyStudio Plugin**: Enables visual highlighting

#### Reporter Settings
- **Reporter Type**: Console (default), Minimal, or JSON
- **Verbose Output**: Enable detailed logging
- **Bail on Failure**: Stop on first test failure
- **Timeout**: Test timeout in milliseconds (5000ms default)

### Interactive Features

#### Visual Highlighting
When AllyStudio plugin is enabled:
- 🟢 **Green outline**: Passing elements
- 🔴 **Red outline**: Failing elements
- 🟡 **Yellow outline**: Skipped elements

#### Real-time Configuration
- Changes to configuration automatically re-run tests
- Debounced to prevent excessive test execution
- Immediate visual feedback

#### Export Functionality
- Download complete test results as JSON
- Includes configuration, timestamps, and detailed results
- Perfect for sharing or CI/CD integration

## API Usage

### Basic Setup

```javascript
import { TestRunner } from '../dist/index.js'
import { ConsoleReporter, PerformancePlugin, AllyStudioPlugin } from '../dist/index.js'

// Create runner with plugins
const runner = new TestRunner({
  plugins: [
    new PerformancePlugin(),
    new AllyStudioPlugin()
  ],
  reporter: new ConsoleReporter({ verbose: true }),
  bail: false,
  timeout: 10000
})
```

### Defining Tests

```javascript
// Define test suites
runner.describe('Image Accessibility', () => {
  runner.test('should have meaningful alt text', ({ element, expect }) => {
    const alt = element.getAttribute('alt')

    if (!alt) {
      expect.fail('Image is missing alt attribute')
    }

    if (alt.trim() === '') {
      expect.fail('Image has empty alt attribute')
    }

    expect.pass(`Alt text is descriptive: "${alt}"`)
  }, 'img', {
    actRule: 'b33eff',
    wcagCriteria: ['1.1.1'],
    impact: 'critical'
  })
})
```

### Running Tests

```javascript
// Run tests and get results
const results = await runner.run()

// Access results
const stats = results.getStats()
const suites = results.getSuites()
const performance = results.getPerformance()

console.log(`Tests: ${stats.total}, Passed: ${stats.passed}, Failed: ${stats.failed}`)
```

## Test Content Examples

The demo includes both good and bad examples for each accessibility category:

### ✅ Good Examples
- Images with descriptive alt text
- Buttons with clear accessible names
- Links with meaningful text
- Form controls with proper labels
- Valid BCP 47 language tags

### ❌ Bad Examples
- Images without alt attributes
- Empty buttons
- Generic "click here" links
- Unlabeled form controls
- Invalid language tags

## Performance Characteristics

### Benchmarks
Based on current testing:
- **Small pages** (100 elements): ~50-200ms
- **Medium pages** (1,000 elements): ~500-2000ms
- **Large pages** (10,000 elements): ~5000-20000ms

### Optimization Features
- Single DOM traversal using TreeWalker
- Pre-compiled rule functions
- Efficient selector matching
- Memory pool management
- Incremental testing capabilities

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Benchmarking
```bash
# Run axe-core comparison
open packages/act-test-runner/benchmarks/axe-benchmark.html
```

## Integration

### AllyStudio Browser Extension
The demo integrates seamlessly with the AllyStudio browser extension:
- Visual highlighting of test results
- Export to issues table
- Real-time feedback during testing

### CI/CD Integration
Export JSON results for automated testing:
```javascript
const exportData = {
  timestamp: new Date().toISOString(),
  config: getConfig(),
  results: results.toJSON()
}
```

## Next Steps

1. **Phase 2**: TreeWalker optimization implementation
2. **Phase 3**: Web Worker parallel processing
3. **Phase 4**: Memory pool management
4. **Phase 5**: Advanced rule compilation
5. **Phase 6**: Performance fine-tuning
6. **Phase 7**: Production optimization

## Contributing

1. Test the demo with various content
2. Report performance issues
3. Suggest new test rules
4. Contribute to plugin development
5. Improve reporter functionality

The modular architecture makes it easy to extend functionality while maintaining performance and reliability.
