/**
 * Navigation Tests
 * 
 * These tests verify the navigation between different pages
 * and check the visibility of UI elements.
 */

describe('Navigation', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should navigate to the landing page', () => {
    cy.visit('/');
    cy.contains('h1', 'QuizGenius').should('be.visible');
    cy.contains('a', 'Get Started').should('be.visible');
  });

  it('should navigate to the login page', () => {
    cy.visit('/');
    cy.contains('a', 'Login').click();
    cy.url().should('include', '/login');
    cy.contains('h1', 'Welcome back').should('be.visible');
  });

  it('should navigate to the register page', () => {
    cy.visit('/');
    cy.contains('a', 'Sign up').click();
    cy.url().should('include', '/register');
    cy.contains('h1', 'Create an account').should('be.visible');
  });

  it('should display 404 page for invalid routes', () => {
    cy.visit('/this-page-does-not-exist');
    cy.contains('h1', '404').should('be.visible');
    cy.contains('Page not found').should('be.visible');
    cy.contains('a', 'Go back home').should('be.visible');
  });

  it('should navigate back home from 404 page', () => {
    cy.visit('/this-page-does-not-exist');
    cy.contains('a', 'Go back home').click();
    cy.url().should('equal', Cypress.config().baseUrl + '/');
  });
});