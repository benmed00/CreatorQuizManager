# Testing Guide for QuizGenius

This document provides instructions on how to run and write tests for the QuizGenius application using Cypress.

## Getting Started with Cypress Testing

### Running Tests

We've created a convenient shell script to run Cypress tests. You can use the following commands:

```bash
# Open Cypress Test Runner UI
./cypress-test.sh open

# Run all tests in headless mode
./cypress-test.sh all

# Run only end-to-end tests
./cypress-test.sh e2e

# Run only component tests
./cypress-test.sh component

# Run only authentication-related tests
./cypress-test.sh auth

# Run a specific test file (e.g., auth-transformation)
./cypress-test.sh test auth-transformation
```

Alternatively, you can use npx directly:

```bash
# Open Cypress Test Runner UI
npx cypress open

# Run all tests in headless mode
npx cypress run

# Run only end-to-end tests
npx cypress run --e2e

# Run only component tests
npx cypress run --component
```

### Test Structure

Our tests are organized as follows:

- **End-to-End Tests**: Located in `cypress/e2e/`
  - `auth.cy.ts`: Tests for login, registration, and authentication flows
  - `auth-transformation.cy.ts`: Tests specifically for authentication user transformation logic
  - `navigation.cy.ts`: Tests for navigation across the application
  - `quiz.cy.ts`: Tests for taking quizzes
  - `quiz-creation.cy.ts`: Tests for creating quizzes

### Writing New Tests

When writing new tests, follow these guidelines:

1. **File Organization**: Place your tests in the appropriate directory based on the test type (e2e or component).
2. **Naming Convention**: Use descriptive names for test files and test cases.
3. **Data Attributes**: Use `data-testid` attributes in your components to make them easily selectable in tests.
4. **Isolation**: Make sure tests can run independently of each other.
5. **Mocking**: Use mocking for external dependencies like Firebase authentication.

### Example Test Pattern

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code here
    cy.visit('/route-to-test');
  });

  it('should do something specific', () => {
    // Arrange
    cy.get('[data-testid="some-element"]').as('element');
    
    // Act
    cy.get('@element').click();
    
    // Assert
    cy.get('[data-testid="result-element"]').should('contain', 'Expected Text');
  });
});
```

### Testing Best Practices

1. **Write Atomic Tests**: Each test should focus on one specific functionality.
2. **Resilient Selectors**: Use `data-testid` attributes instead of relying on CSS classes or DOM structure.
3. **Realistic Actions**: Simulate realistic user behavior (clicks, form submissions, etc.).
4. **Avoid Hardcoded Waits**: Use Cypress's automatic waiting features instead of hardcoded timeouts.
5. **Handle Asynchronous Operations**: Cypress handles most async behavior automatically, but be aware of edge cases.

## Authentication Testing

### Mocking Authentication

For tests that require authentication, we use a simple localStorage mock:

```typescript
// Simulate a logged-in user
cy.window().then(win => {
  win.localStorage.setItem('quiz-app-user', JSON.stringify({
    id: 'test-user-id',
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User'
  }));
});
```

### User Transformation Testing

The `auth-transformation.cy.ts` tests specifically verify the integrity of our Firebase user transformation logic:

1. **Transformation Correctness**: Verifies that Firebase user objects are correctly transformed to our application's User model with all required properties.

2. **Edge Case Handling**: Tests how the transformation handles incomplete user data (e.g., missing displayName).

3. **Persistence**: Verifies that user authentication state persists correctly across page refreshes.

4. **End-to-End Authentication**: Validates the complete authentication flow with test credentials.

Example test for verifying user transformation:

```typescript
it('should correctly transform Firebase user when logging in', () => {
  // Mock user data for injection
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  // Visit the login page
  cy.visit('/login');

  // Stub the signIn function to return our mock user
  cy.window().then(win => {
    cy.stub(win, 'signIn').resolves({ user: mockUser });
    
    // Verify the transformed user has the correct properties
    cy.stub(win, 'setUser').callsFake((user) => {
      expect(user).to.have.property('id', mockUser.uid);
      expect(user).to.have.property('email', mockUser.email);
      expect(user).to.have.property('displayName', mockUser.displayName);
    });
  });
  
  // Trigger the login flow
  cy.get('input[placeholder="your@email.com"]').type('test@example.com');
  cy.get('input[placeholder="••••••••"]').type('password123');
  cy.contains('button', 'Sign In').click();
});
```

## Test Coverage

Our goal is to achieve comprehensive test coverage for all critical user flows:

- **Authentication**: Login, registration, password reset
- **Navigation**: Routing, responsive layout, menu functionality
- **Quiz Taking**: Answering questions, timer functionality, results display
- **Quiz Creation**: Creating quizzes manually or using AI generation
- **Dashboard**: Viewing statistics and user data

## Troubleshooting

If you encounter issues when running tests:

1. Check that the application is running (`npm run dev`)
2. Verify the baseUrl is correctly set in `cypress.config.ts`
3. Check for any console errors in the Cypress runner
4. Try clearing Cypress cache: `npx cypress cache clear`