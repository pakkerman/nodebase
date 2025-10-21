# Test Suite

This directory contains comprehensive unit tests for the Nodebase application.

## Structure

- `setup/` - Test configuration and setup files
- `components/` - Component tests
- `app/` - Page and layout tests
- `config/` - Configuration tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Testing Stack

- **Vitest** - Fast unit test framework
- **React Testing Library** - React component testing utilities
- **Happy DOM** - Lightweight DOM implementation
- **@testing-library/jest-dom** - Custom matchers for DOM elements

## Writing Tests

Follow these guidelines when writing tests:

1. Use descriptive test names that explain what is being tested
2. Follow the Arrange-Act-Assert pattern
3. Mock external dependencies appropriately
4. Test both happy paths and edge cases
5. Ensure tests are isolated and don't depend on each other
6. Use `beforeEach` for common setup
7. Clean up after tests with `afterEach`

## Test Coverage

The test suite covers:

- Component rendering and behavior
- User interactions
- Authentication flows
- Routing and navigation
- Configuration validation
- Edge cases and error handling