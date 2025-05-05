/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to stub a function
     * @example cy.stub().returns(value)
     */
    stub(): any;
    
    /**
     * Custom event listener for window events
     */
    on(event: string, callback: Function): Chainable<Element>;
  }
}

// Make the global test variables available
declare const describe: (description: string, callback: () => void) => void;
declare const it: (description: string, callback: () => void) => void;
declare const beforeEach: (callback: () => void) => void;
declare const expect: (actual: any) => any;