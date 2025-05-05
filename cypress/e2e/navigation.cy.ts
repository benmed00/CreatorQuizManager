describe('Navigation', () => {
  beforeEach(() => {
    // Start at the home page
    cy.visit('/');
  });

  it('should navigate to all main routes from navbar', () => {
    // Check Home is active
    cy.get('nav').contains('Home').should('have.class', 'text-primary');
    
    // Check each navigation item exists and links to the correct route
    cy.get('nav').contains('Quizzes').click();
    cy.url().should('include', '/quizzes');
    
    cy.get('nav').contains('Create').click();
    cy.url().should('include', '/create-quiz');
    
    cy.get('nav').contains('Dashboard').click();
    cy.url().should('include', '/dashboard');
    
    cy.get('nav').contains('Leaderboard').click();
    cy.url().should('include', '/leaderboard');
  });

  it('should navigate to authentication pages when not logged in', () => {
    cy.contains('Sign In').should('be.visible').click();
    cy.url().should('include', '/login');
    
    cy.visit('/');
    cy.contains('Register').should('be.visible').click();
    cy.url().should('include', '/register');
  });

  it('should display 404 page for non-existent routes', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    cy.contains('Page Not Found').should('be.visible');
    cy.contains('The page you are looking for doesn\'t exist').should('be.visible');
    
    // Should have a button to go back home
    cy.contains('Go Home').should('be.visible');
    cy.contains('Go Home').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should toggle between light and dark mode', () => {
    // Check if theme toggle exists
    cy.get('button[aria-label="Toggle theme"]').should('exist').as('themeToggle');
    
    // Click theme toggle
    cy.get('@themeToggle').click();
    
    // Check that body class changes for dark mode - specific implementation may vary
    // This is an example; you might need to adjust based on how your theme is implemented
    cy.get('html').should('have.attr', 'class').and('include', 'dark');
    
    // Toggle back
    cy.get('@themeToggle').click();
    cy.get('html').should('have.attr', 'class').and('not.include', 'dark');
  });

  it('should show responsive menu on mobile viewports', () => {
    // Use a mobile viewport
    cy.viewport('iphone-x');
    
    // Mobile menu button should be visible
    cy.get('button[aria-label="Menu"]').as('menuButton').should('be.visible');
    
    // Navigation links should be hidden
    cy.get('nav').find('a').should('not.be.visible');
    
    // Click menu button to open mobile menu
    cy.get('@menuButton').click();
    
    // Navigation links should now be visible
    cy.contains('Home').should('be.visible');
    cy.contains('Quizzes').should('be.visible');
    cy.contains('Create').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Leaderboard').should('be.visible');
    
    // Close menu
    cy.get('@menuButton').click();
  });
});