// cypress/support/commands.js

// Login command
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/auth/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for the redirect to dashboard after successful login
  cy.url().should("include", "/dashboard");
});
