describe('Quiz Creation', () => {
  beforeEach(() => {
    // Stub the auth state to simulate a logged-in user
    cy.window().then(win => {
      // Mock user data in localStorage or through appropriate means
      win.localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      }));
    });
    
    // Go to quiz creation page
    cy.visit('/create-quiz');
  });
  
  it('should display quiz creation options', () => {
    // Should have both AI and manual creation options
    cy.contains('AI-Powered Quiz Generation').should('be.visible');
    cy.contains('Manual Quiz Creation').should('be.visible');
  });
  
  it('should validate AI generation form', () => {
    // Select AI generation
    cy.contains('AI-Powered Quiz Generation').click();
    
    // Try to submit with empty form
    cy.get('[data-testid="generate-quiz-button"]').click();
    
    // Should show validation errors
    cy.contains('Topic is required').should('be.visible');
    cy.contains('Number of questions is required').should('be.visible');
    
    // Fill in some fields but not all
    cy.get('[data-testid="quiz-topic-input"]').type('JavaScript');
    cy.get('[data-testid="generate-quiz-button"]').click();
    
    // Should still show some validation errors
    cy.contains('Number of questions is required').should('be.visible');
  });
  
  it('should validate manual quiz creation form', () => {
    // Select manual creation
    cy.contains('Manual Quiz Creation').click();
    
    // Try to submit with empty form
    cy.get('[data-testid="save-quiz-button"]').click();
    
    // Should show validation errors
    cy.contains('Title is required').should('be.visible');
    cy.contains('At least one question is required').should('be.visible');
    
    // Fill in title but no questions
    cy.get('[data-testid="quiz-title-input"]').type('Test Quiz');
    cy.get('[data-testid="save-quiz-button"]').click();
    
    // Should still show question validation error
    cy.contains('At least one question is required').should('be.visible');
  });
  
  it('should allow adding questions in manual mode', () => {
    // Select manual creation
    cy.contains('Manual Quiz Creation').click();
    
    // Fill in basic quiz details
    cy.get('[data-testid="quiz-title-input"]').type('Test Quiz');
    cy.get('[data-testid="quiz-description-input"]').type('This is a test quiz');
    
    // Add a question
    cy.get('[data-testid="add-question-button"]').click();
    
    // Should now have a question form
    cy.get('[data-testid="question-form"]').should('be.visible');
    
    // Fill in question details
    cy.get('[data-testid="question-text-input"]').type('What is the capital of France?');
    
    // Add options
    cy.get('[data-testid="add-option-button"]').click();
    cy.get('[data-testid="add-option-button"]').click();
    cy.get('[data-testid="add-option-button"]').click();
    cy.get('[data-testid="add-option-button"]').click();
    
    // Should have 4 options
    cy.get('[data-testid="answer-option-input"]').should('have.length', 4);
    
    // Fill in options
    cy.get('[data-testid="answer-option-input"]').eq(0).type('Paris');
    cy.get('[data-testid="answer-option-input"]').eq(1).type('London');
    cy.get('[data-testid="answer-option-input"]').eq(2).type('Berlin');
    cy.get('[data-testid="answer-option-input"]').eq(3).type('Madrid');
    
    // Mark first option as correct
    cy.get('[data-testid="mark-correct-button"]').first().click();
    
    // Add question
    cy.get('[data-testid="add-question-button"]').click();
    
    // Should now have 2 questions
    cy.get('[data-testid="question-item"]').should('have.length', 2);
  });
  
  it('should preview quiz before saving', () => {
    // Select manual creation and create a basic quiz
    cy.contains('Manual Quiz Creation').click();
    
    // Fill in basic quiz details
    cy.get('[data-testid="quiz-title-input"]').type('Preview Test Quiz');
    cy.get('[data-testid="quiz-description-input"]').type('This is a preview test');
    
    // Add a question
    cy.get('[data-testid="add-question-button"]').click();
    cy.get('[data-testid="question-text-input"]').type('Sample question?');
    
    // Add options
    cy.get('[data-testid="add-option-button"]').click();
    cy.get('[data-testid="add-option-button"]').click();
    
    // Fill in options
    cy.get('[data-testid="answer-option-input"]').eq(0).type('Option A');
    cy.get('[data-testid="answer-option-input"]').eq(1).type('Option B');
    
    // Mark first option as correct
    cy.get('[data-testid="mark-correct-button"]').first().click();
    
    // Click preview button
    cy.get('[data-testid="preview-quiz-button"]').click();
    
    // Preview should be visible
    cy.get('[data-testid="quiz-preview"]').should('be.visible');
    cy.get('[data-testid="quiz-preview-title"]').should('contain', 'Preview Test Quiz');
    cy.get('[data-testid="quiz-preview-question"]').should('contain', 'Sample question?');
    cy.get('[data-testid="quiz-preview-option"]').should('have.length', 2);
    
    // Close preview
    cy.get('[data-testid="close-preview-button"]').click();
    
    // Back to edit form
    cy.get('[data-testid="quiz-title-input"]').should('be.visible');
  });
});