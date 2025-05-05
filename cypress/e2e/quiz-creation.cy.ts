/**
 * Quiz Creation Tests
 * 
 * These tests verify the quiz creation functionality including:
 * 1. Manual quiz creation form
 * 2. AI-assisted quiz generation
 * 3. Saving created quizzes
 */

describe('Quiz Creation', () => {
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

    // Visit the create quiz page
    cy.visit('/create-quiz');
  });

  it('should display the create quiz page', () => {
    cy.contains('h1', 'Create Quiz').should('be.visible');
    cy.contains('button', 'Manual Creation').should('be.visible');
    cy.contains('button', 'AI Generation').should('be.visible');
  });

  it('should display manual creation form', () => {
    cy.contains('button', 'Manual Creation').click();
    
    // Form should be displayed
    cy.get('input[placeholder="Quiz Title"]').should('be.visible');
    cy.get('textarea[placeholder="Quiz Description"]').should('be.visible');
    cy.contains('button', 'Add Question').should('be.visible');
  });

  it('should add questions in manual mode', () => {
    cy.contains('button', 'Manual Creation').click();
    
    // Fill basic quiz info
    cy.get('input[placeholder="Quiz Title"]').type('Test Quiz');
    cy.get('textarea[placeholder="Quiz Description"]').type('This is a test quiz created by Cypress');
    
    // Add a question
    cy.contains('button', 'Add Question').click();
    
    // Question form should appear
    cy.get('input[placeholder="Question Text"]').should('be.visible');
    cy.get('input[placeholder="Option 1"]').should('be.visible');
    cy.get('input[placeholder="Option 2"]').should('be.visible');
    
    // Fill question
    cy.get('input[placeholder="Question Text"]').type('What is Cypress?');
    cy.get('input[placeholder="Option 1"]').type('A testing framework');
    cy.get('input[placeholder="Option 2"]').type('A tree species');
    cy.get('input[placeholder="Option 3"]').type('A programming language');
    cy.get('input[placeholder="Option 4"]').type('A database system');
    
    // Select correct answer
    cy.get('[data-testid="correct-option-0"]').click();
    
    // Save question
    cy.contains('button', 'Save Question').click();
    
    // Question should be added to the list
    cy.contains('Question 1: What is Cypress?').should('be.visible');
  });

  it('should display AI generation form', () => {
    cy.contains('button', 'AI Generation').click();
    
    // AI form should be displayed
    cy.get('input[placeholder="Topic"]').should('be.visible');
    cy.get('select').should('be.visible'); // Difficulty dropdown
    cy.get('input[type="number"]').should('be.visible'); // Question count
    cy.contains('button', 'Generate Quiz').should('be.visible');
  });

  it('should navigate back to dashboard', () => {
    // Should have a way to go back
    cy.contains('a', 'Back to Dashboard').click();
    cy.url().should('include', '/dashboard');
  });
});