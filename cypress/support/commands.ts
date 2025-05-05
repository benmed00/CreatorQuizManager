// This file contains Cypress custom commands
// See: https://docs.cypress.io/api/cypress-api/custom-commands.html

// Import types
/// <reference types="cypress" />
/// <reference path="./index.d.ts" />

// This example command is here to verify our custom types
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[placeholder="your@email.com"]').type(email);
  cy.get('input[placeholder="••••••••"]').type(password);
  cy.contains('button', 'Sign In').click();
});

// Command to check if user is authenticated
Cypress.Commands.add('isAuthenticated', () => {
  cy.window().its('getCurrentUser').invoke('call', window).should('not.be.null');
});

// Command to check if user is signed out
Cypress.Commands.add('isSignedOut', () => {
  cy.window().its('getCurrentUser').invoke('call', window).should('be.null');
});

// Command to verify a transformed user has expected properties
Cypress.Commands.add('verifyTransformedUser', (user) => {
  expect(user).to.have.property('id');
  expect(user).to.have.property('uid');
  expect(user).to.have.property('email');
  expect(user).to.have.property('displayName');
});

export {};