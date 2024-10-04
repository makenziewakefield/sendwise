describe("Send Money Page", () => {
  beforeEach(() => {
    // Mock the authentication token to bypass login
    localStorage.setItem("token", "mockedToken");
    cy.intercept("GET", "/api/contacts", {
      statusCode: 200,
      body: [
        { id: 2, name: "Bob Smith" },
        { id: 3, name: "Carol Williams" },
      ],
    }).as("getContacts");

    // Visit the Send Money page
    cy.visit("/send-money");
  });

  it("should display the send money form correctly", () => {
    cy.get("h2").should("contain", "Send Money");
    cy.get("select#recipient").should("be.visible");
    cy.get("input#amount").should("be.visible");
    cy.get("select#method").should("be.visible");
    cy.get("textarea#description").should("be.visible");
    cy.get("button.send-btn").should("contain", "Send").should("be.visible");
  });

  it("should allow selecting an existing contact and filling out the form", () => {
    cy.wait("@getContacts"); // Ensure contacts are loaded

    // Select recipient
    cy.get("select#recipient").select("Bob Smith");
    cy.get("input#amount").type("100");
    cy.get("select#method").select("Bank");
    cy.get("textarea#description").type("Payment for services");

    // Submit the form
    cy.intercept("POST", "/api/transfers", {
      statusCode: 200,
      body: { message: "Money sent successfully!" },
    }).as("postTransfer");

    cy.get("button.send-btn").click();
    cy.wait("@postTransfer").its("response.statusCode").should("eq", 200);

    // Assert that a success message was shown (e.g., alert or redirect)
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Money sent successfully!");
    });
  });

  it("should allow adding a new contact successfully", () => {
    cy.wait("@getContacts");

    // Add new contact flow
    cy.get("select#recipient").select("add-new");
    cy.get("input#new-contact").type("dave");
    cy.get("button").contains("Verify Contact").click();

    // Mocking contact verification API
    cy.intercept("GET", "/api/users?username=dave", {
      statusCode: 200,
      body: { first_name: "Dave", last_name: "Brown", username: "dave" },
    }).as("verifyContact");

    cy.wait("@verifyContact");

    // Confirming the contact addition
    cy.get(".confirmation").should(
      "contain",
      "Is this the contact you want to add?"
    );
    cy.get(".confirmation").should("contain", "Dave Brown");
    cy.get("button").contains("Confirm and Add").click();

    // Mock the adding new contact API
    cy.intercept("POST", "/api/contacts", {
      statusCode: 200,
      body: { id: 4, name: "Dave Brown" },
    }).as("addNewContact");

    cy.wait("@addNewContact").its("response.statusCode").should("eq", 200);

    // Now, fill out the rest of the form
    cy.get("input#amount").type("200");
    cy.get("select#method").select("Cash");
    cy.get("textarea#description").type("Payment for consultation");

    // Mock the transfer API
    cy.intercept("POST", "/api/transfers", {
      statusCode: 200,
      body: { message: "Money sent successfully!" },
    }).as("postTransferAfterAdding");

    cy.get("button.send-btn").click();
    cy.wait("@postTransferAfterAdding")
      .its("response.statusCode")
      .should("eq", 200);

    // Success message assertion
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Money sent successfully!");
    });
  });

  it("should show an error when trying to add a non-existent contact", () => {
    cy.wait("@getContacts");

    // Attempt to add a non-existent contact
    cy.get("select#recipient").select("add-new");
    cy.get("input#new-contact").type("nonexistentuser");
    cy.get("button").contains("Verify Contact").click();

    // Mocking failed contact verification
    cy.intercept("GET", "/api/users?username=nonexistentuser", {
      statusCode: 404,
      body: { msg: "User not found" },
    }).as("verifyContactFailed");

    cy.wait("@verifyContactFailed");

    // Assert that an error message is displayed
    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "User not found. Please enter a valid username.");
  });
});
