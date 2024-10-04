// cypress/e2e/signup.cy.js

describe("Signup Page", () => {
  beforeEach(() => {
    cy.visit("/signup"); // Adjust the route to where your signup page is located
  });

  it("should render the signup form correctly", () => {
    cy.get('input[placeholder="First Name"]').should("be.visible");
    cy.get('input[placeholder="Last Name"]').should("be.visible");
    cy.get('input[placeholder="Username"]').should("be.visible");
    cy.get('input[placeholder="Email"]').should("be.visible");
    cy.get('input[placeholder="Password"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("contain", "Sign Up")
      .should("be.visible");
  });

  it("should allow the user to type in the form fields", () => {
    cy.get('input[placeholder="First Name"]')
      .type("John")
      .should("have.value", "John");
    cy.get('input[placeholder="Last Name"]')
      .type("Doe")
      .should("have.value", "Doe");
    cy.get('input[placeholder="Username"]')
      .type("johndoe")
      .should("have.value", "johndoe");
    cy.get('input[placeholder="Email"]')
      .type("john@example.com")
      .should("have.value", "john@example.com");
    cy.get('input[placeholder="Password"]')
      .type("password")
      .should("have.value", "password");
  });

  it("should submit the signup form and handle success", () => {
    cy.intercept("POST", "http://localhost:8080/api/v1/auth/register", {
      statusCode: 200,
      body: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", // Mocked token
      },
    }).as("signupRequest");

    cy.get('input[placeholder="First Name"]').type("John");
    cy.get('input[placeholder="Last Name"]').type("Doe");
    cy.get('input[placeholder="Username"]').type("johndoe");
    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.get('button[type="submit"]').click();

    cy.wait("@signupRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should display an error message on signup failure", () => {
    cy.intercept("POST", "http://localhost:8080/api/v1/auth/register", {
      statusCode: 400,
      body: {
        msg: "User already exists",
      },
    }).as("signupRequestFailed");

    cy.get('input[placeholder="First Name"]').type("John");
    cy.get('input[placeholder="Last Name"]').type("Doe");
    cy.get('input[placeholder="Username"]').type("johndoe");
    cy.get('input[placeholder="Email"]').type("john@example.com");
    cy.get('input[placeholder="Password"]').type("password");
    cy.get('button[type="submit"]').click();

    cy.wait("@signupRequestFailed")
      .its("response.statusCode")
      .should("eq", 400);

    // Check for error message in the specific error element
    cy.get('[data-cy="error-message"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain", "User already exists");
  });
});
