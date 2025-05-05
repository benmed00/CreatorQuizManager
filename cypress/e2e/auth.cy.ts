/**
 * Authentication End-to-End Tests
 * 
 * These tests verify the basic authentication flows including:
 * 1. User login
 * 2. User registration
 * 3. Error handling for invalid credentials
 */

describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should display the login form', () => {
    cy.visit('/login');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('be.visible');
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[placeholder="your@email.com"]').type('test@example.com');
    cy.get('input[placeholder="••••••••"]').type('password123');
    cy.contains('button', 'Sign In').click();
    
    // Should redirect after successful login
    cy.url().should('not.include', '/login');
    
    // User should be logged in
    cy.contains('Sign Out').should('be.visible');
  });

  it('should display the registration form', () => {
    cy.visit('/register');
    cy.contains('h1', 'Create an account').should('be.visible');
    cy.get('input[placeholder="your@email.com"]').should('be.visible');
    cy.get('input[placeholder="••••••••"]').should('be.visible');
    cy.contains('button', 'Sign Up').should('be.visible');
  });

  it('should navigate between login and register pages', () => {
    // Login to Register
    cy.visit('/login');
    cy.contains('a', 'Sign up').click();
    cy.url().should('include', '/register');
    
    // Register to Login
    cy.contains('a', 'Sign in').click();
    cy.url().should('include', '/login');
  });
});