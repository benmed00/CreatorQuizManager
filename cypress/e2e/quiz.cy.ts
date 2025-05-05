describe('Quiz Taking', () => {
  beforeEach(() => {
    // Stub the auth state to simulate a logged-in user
    cy.window().then(win => {
      // Mock user data in localStorage or through appropriate means
      // This is just an example - adjust based on your application
      win.localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      }));
    });
    
    // Go to quizzes page
    cy.visit('/quizzes');
  });
  
  it('should display available quizzes', () => {
    // Check that we have a list of quizzes
    cy.get('[data-testid="quiz-card"]').should('have.length.at.least', 1);
    
    // Each quiz should have title, category, and start button
    cy.get('[data-testid="quiz-card"]').first().within(() => {
      cy.get('[data-testid="quiz-title"]').should('be.visible');
      cy.get('[data-testid="quiz-category"]').should('be.visible');
      cy.get('[data-testid="start-quiz-button"]').should('be.visible');
    });
  });
  
  it('should filter quizzes by category', () => {
    // There should be category filters
    cy.get('[data-testid="category-filter"]').should('be.visible');
    
    // Get number of initial quizzes
    cy.get('[data-testid="quiz-card"]').its('length').as('initialCount');
    
    // Click on a specific category
    cy.get('[data-testid="category-filter"]').first().click();
    
    // Get filtered count and compare
    cy.get('[data-testid="quiz-card"]').its('length').as('filteredCount');
    
    // Filtered count should be different (or same if all quizzes are in first category)
    cy.get('@initialCount').then(initialCount => {
      cy.get('@filteredCount').should('be.lte', initialCount);
    });
    
    // Reset filter
    cy.get('[data-testid="category-filter-all"]').click();
    cy.get('[data-testid="quiz-card"]').its('length').should('eq', cy.get('@initialCount'));
  });
  
  it('should start a quiz when clicking start button', () => {
    // Click start on the first quiz
    cy.get('[data-testid="start-quiz-button"]').first().click();
    
    // Should be redirected to the quiz page
    cy.url().should('include', '/quiz/');
    
    // Quiz UI elements should be visible
    cy.get('[data-testid="quiz-question"]').should('be.visible');
    cy.get('[data-testid="answer-options"]').should('be.visible');
    cy.get('[data-testid="quiz-timer"]').should('be.visible');
    cy.get('[data-testid="quiz-progress"]').should('be.visible');
  });
  
  it('should show next question when answering', () => {
    // Start the quiz
    cy.get('[data-testid="start-quiz-button"]').first().click();
    
    // Get the first question text
    cy.get('[data-testid="quiz-question"]').invoke('text').as('firstQuestion');
    
    // Select an answer
    cy.get('[data-testid="answer-option"]').first().click();
    
    // Click next
    cy.get('[data-testid="next-button"]').click();
    
    // Verify we're on a new question
    cy.get('[data-testid="quiz-question"]').invoke('text').should('not.equal', cy.get('@firstQuestion'));
    
    // Progress should be updated
    cy.get('[data-testid="quiz-progress"]').should('contain', '2');
  });
  
  it('should complete quiz and show results', function() {
    // Start the quiz
    cy.get('[data-testid="start-quiz-button"]').first().click();
    
    // Answer all questions by selecting the first option for each
    // We'll use a recursive function since we don't know how many questions there are
    const answerAllQuestions = () => {
      // Select an answer
      cy.get('[data-testid="answer-option"]').first().click();
      
      // Click next
      cy.get('[data-testid="next-button"]').click();
      
      // Check if we're at the results page, if not, answer another question
      cy.url().then(url => {
        if (!url.includes('/results')) {
          // Only continue if there are answer options (we're still in the quiz)
          cy.get('body').then($body => {
            if ($body.find('[data-testid="answer-option"]').length > 0) {
              answerAllQuestions();
            }
          });
        }
      });
    };
    
    answerAllQuestions();
    
    // We should now be on the results page
    cy.url().should('include', '/results');
    
    // Results page should display score and actions
    cy.get('[data-testid="quiz-score"]').should('be.visible');
    cy.get('[data-testid="share-results-button"]').should('be.visible');
    cy.get('[data-testid="view-answers-button"]').should('be.visible');
    cy.get('[data-testid="download-pdf-button"]').should('be.visible');
  });
});