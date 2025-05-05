/**
 * Quiz Tests
 * 
 * These tests verify the quiz functionality including:
 * 1. Viewing quizzes
 * 2. Taking a quiz
 * 3. Viewing results
 */

describe('Quiz Functionality', () => {
  beforeEach(() => {
    // Login before each test
    cy.window().then((win: any) => {
      // Mock authentication
      const user = {
        id: 'test-user-id',
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      };
      win.localStorage.setItem('quiz-app-user', JSON.stringify(user));
    });
  });

  it('should display available quizzes', () => {
    cy.visit('/quizzes');
    cy.contains('h1', 'Available Quizzes').should('be.visible');
    // There should be at least one quiz card
    cy.get('[data-testid="quiz-card"]').should('exist');
  });

  it('should navigate to quiz details', () => {
    cy.visit('/quizzes');
    // Click on the first quiz
    cy.get('[data-testid="quiz-card"]').first().click();
    // Should show quiz details
    cy.contains('Start Quiz').should('be.visible');
    cy.contains('Back to Quizzes').should('be.visible');
  });

  it('should start a quiz', () => {
    // Find a quiz and start it
    cy.visit('/quizzes');
    cy.get('[data-testid="quiz-card"]').first().click();
    cy.contains('Start Quiz').click();
    
    // Should be on the quiz page
    cy.url().should('include', '/quiz/');
    
    // Should see quiz elements
    cy.contains('Question').should('be.visible');
    cy.get('[data-testid="answer-option"]').should('have.length.at.least', 2);
  });

  it('should submit answers and see results', () => {
    // Start a quiz
    cy.visit('/quizzes');
    cy.get('[data-testid="quiz-card"]').first().click();
    cy.contains('Start Quiz').click();
    
    // Answer questions
    // This is simplified - actual flow would have multiple questions
    cy.get('[data-testid="answer-option"]').first().click();
    cy.contains('button', 'Next').click();
    
    // If we're on the last question, submit
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="submit-quiz"]').length > 0) {
        cy.get('[data-testid="submit-quiz"]').click();
      }
    });
    
    // Should eventually get to results
    cy.url().should('include', '/results').or('include', '/quiz/');
    cy.contains('Score').should('exist');
  });
});