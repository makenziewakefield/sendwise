describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should render the login form correctly", () => {
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("contain", "Login")
      .should("be.visible");
  });

  it("should allow the user to type in the email and password", () => {
    cy.get('input[placeholder="Email"]')
      .type("alice@example.com")
      .should("have.value", "alice@example.com");
    cy.get('input[placeholder="Password"]')
      .type("1234")
      .should("have.value", "1234");
  });

  it("should submit the login form and handle success", () => {
    cy.intercept("POST", "http://localhost:8080/api/v1/auth/login", {
      statusCode: 200,
      body: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", // This is a valid mock JWT
      },
    }).as("loginRequest");

    cy.get('input[placeholder="Email"]').type("alice@example.com");
    cy.get('input[placeholder="Password"]').type("1234");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should display an error message on login failure", () => {
    cy.intercept("POST", "http://localhost:8080/api/v1/auth/login", {
      statusCode: 401,
      body: {
        msg: "Invalid credentials",
      },
    }).as("loginRequestFailed");

    cy.get('input[placeholder="Email"]').type("wrongalice@example.com");
    cy.get('input[placeholder="Password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequestFailed").its("response.statusCode").should("eq", 401);

    // Check for error message in the specific error element
    cy.get('[data-cy="error-message"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });
});
