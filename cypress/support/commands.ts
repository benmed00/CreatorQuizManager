// This file contains Cypress custom commands
// See: https://docs.cypress.io/api/cypress-api/custom-commands.html

// Import types
/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// Add custom commands to Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      isAuthenticated(): Chainable<void>;
      isSignedOut(): Chainable<void>;
      verifyTransformedUser(user: any): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[placeholder="your@email.com"]').type(email);
  cy.get('input[placeholder="••••••••"]').type(password);
  cy.contains('button', 'Sign In').click();
});

// Check if user is authenticated
Cypress.Commands.add('isAuthenticated', () => {
  cy.window().its('getCurrentUser').invoke('call', window).should('not.be.null');
});

// Check if user is signed out
Cypress.Commands.add('isSignedOut', () => {
  cy.window().its('getCurrentUser').invoke('call', window).should('be.null');
});

// Verify a transformed user has expected properties
Cypress.Commands.add('verifyTransformedUser', (user: any) => {
  expect(user).to.have.property('id');
  expect(user).to.have.property('uid');
  expect(user).to.have.property('email');
  expect(user).to.have.property('displayName');
});

export {};