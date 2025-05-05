/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to stub a function
     * @example cy.stub().returns(value)
     */
    stub(): any;
    
    /**
     * Custom event listener for window events
     */
    on(event: string, callback: Function): Chainable<Subject>;
    
    /**
     * Custom command to login with email and password
     */
    login(email: string, password: string): Chainable<Subject>;
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): Chainable<Subject>;
    
    /**
     * Check if user is signed out
     */
    isSignedOut(): Chainable<Subject>;
    
    /**
     * Verify a transformed user has expected properties
     */
    verifyTransformedUser(user: any): Chainable<Subject>;
  }
}

// Make the global test variables available
declare const describe: (description: string, callback: () => void) => void;
declare const it: (description: string, callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const expect: (actual: any) => any;