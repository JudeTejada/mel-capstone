describe("Tickets Page", () => {
  const testUser = {
    email: "judetejada@gmail.com",
    password: "judetejada",
  };

  beforeEach(() => {

    // Login before each test
    cy.visit("/auth/login");
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Wait for login to complete and redirect to dashboard
    cy.url().should("include", "/dashboard");

    // Then navigate to tickets page
    cy.visit("/tickets", {
      // Don't fail on status code since we're handling errors
      failOnStatusCode: false,
      // Add reasonable timeout
      timeout: 10000,
    });

    // Wait for tickets page to load and API call to complete
    cy.url().should("include", "/tickets");
    
  });

  it("should display the tickets page", () => {
    // Basic UI elements should be visible
    cy.get("h1").contains("All Tickets").should("be.visible");
  });

  it("should display ticket list", () => {
    // Check if tickets are loaded and displayed
    cy.get('[data-testid="ticket-list"]').should("exist");
    cy.get('[data-testid="ticket-item"]').should("have.length.at.least", 1);
  });

  it("should allow filtering tickets", () => {
    // Test ticket filtering functionality
    cy.get('[data-testid="ticket-filter"]').should("exist");
    cy.get('[data-testid="ticket-filter"]').type("Test ticket");
    cy.get('[data-testid="ticket-item"]').should("have.length", 1);
  });

  it("should navigate to ticket details", () => {
    // Test navigation to individual ticket
    cy.get('[data-testid="ticket-item"]').first().click();
    cy.url().should("include", "/tickets/test-ticket-1");
  });
});
