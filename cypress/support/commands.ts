// This file contains Cypress custom commands
// See: https://docs.cypress.io/api/cypress-api/custom-commands.html

// Import types
/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// Login command
function login(email: string, password: string): void {
  cy.visit('/login');
  cy.get('input[placeholder="your@email.com"]').type(email);
  cy.get('input[placeholder="••••••••"]').type(password);
  cy.contains('button', 'Sign In').click();
}

// Check if user is authenticated
function isAuthenticated(): void {
  cy.window().its('getCurrentUser').invoke('call', window).should('not.be.null');
}

// Check if user is signed out
function isSignedOut(): void {
  cy.window().its('getCurrentUser').invoke('call', window).should('be.null');
}

// Verify a transformed user has expected properties
function verifyTransformedUser(user: any): void {
  expect(user).to.have.property('id');
  expect(user).to.have.property('uid');
  expect(user).to.have.property('email');
  expect(user).to.have.property('displayName');
}

// Add the commands using the type-safe approach
Cypress.Commands.addAll({
  login,
  isAuthenticated,
  isSignedOut,
  verifyTransformedUser
});

export {};