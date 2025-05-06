describe("Authentication", () => {
  const testUser = {
    email: "judetejada@gmail.com",
    password: "judetejada",
  };

  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("should display login form", () => {
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("should show error for invalid credentials", () => {
    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Check for error toast
    cy.contains("Invalid email or password").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should("include", "/dashboard");
  });

  it("should allow viewing the password", () => {
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[aria-label="Show password"]').click();
    cy.get('input[type="text"]').should("have.value", testUser.password);
  });
});
