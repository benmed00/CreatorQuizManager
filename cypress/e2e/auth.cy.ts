describe('Authentication', () => {
  beforeEach(() => {
    // Reset any previous login state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should display the login page', () => {
    cy.visit('/login');
    cy.contains('Welcome Back!').should('be.visible');
    cy.contains('Sign in to your account').should('be.visible');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should validate form inputs', () => {
    cy.visit('/login');
    
    // Try to submit without any data
    cy.contains('button', 'Sign In').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Try with invalid email
    cy.get('input[placeholder="your@email.com"]').type('invalidemail');
    cy.contains('button', 'Sign In').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Try with valid email but no password
    cy.get('input[placeholder="your@email.com"]').clear().type('test@example.com');
    cy.contains('button', 'Sign In').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should navigate to registration page', () => {
    cy.visit('/login');
    cy.contains('Sign up now').click();
    cy.url().should('include', '/register');
    cy.contains('Create Your Account').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    cy.visit('/login');
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });

  // Test register page
  it('should display the register page', () => {
    cy.visit('/register');
    cy.contains('Create Your Account').should('be.visible');
    cy.contains('Join our community').should('be.visible');
    cy.get('input[placeholder="John Doe"]').should('be.visible');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('have.length', 2);
    cy.contains('button', 'Create Account').should('be.visible');
  });

  it('should validate registration form inputs', () => {
    cy.visit('/register');
    
    // Try to submit without any data
    cy.contains('button', 'Create Account').click();
    cy.contains('Name must be at least 2 characters').should('be.visible');
    
    // Test name validation
    cy.get('input[placeholder="John Doe"]').type('A');
    cy.contains('button', 'Create Account').click();
    cy.contains('Name must be at least 2 characters').should('be.visible');
    
    // Test email validation
    cy.get('input[placeholder="John Doe"]').clear().type('Test User');
    cy.get('input[placeholder="your@email.com"]').type('invalid');
    cy.contains('button', 'Create Account').click();
    cy.contains('Please enter a valid email address').should('be.visible');
    
    // Test password validation
    cy.get('input[placeholder="your@email.com"]').clear().type('test@example.com');
    cy.get('input[placeholder="••••••••"]').first().type('pass');
    cy.contains('button', 'Create Account').click();
    cy.contains('Password must be at least 6 characters').should('be.visible');
    
    // Test password matching
    cy.get('input[placeholder="••••••••"]').first().clear().type('password123');
    cy.get('input[placeholder="••••••••"]').last().type('password456');
    cy.contains('button', 'Create Account').click();
    cy.contains("Passwords don't match").should('be.visible');
  });
});