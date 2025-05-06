/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login using email and password
     * @example cy.login('user@email.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}
