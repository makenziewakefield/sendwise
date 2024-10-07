const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server");
const { exec } = require("child_process");

describe("Transaction API Tests", () => {
  beforeEach(function (done) {
    this.timeout(10000);
    exec("npm run db:reset", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return done(error);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      done();
    });
  });
  
  describe("GET /api/v1/transactions", () => {
    it("should retrieve all transactions", (done) => {
      request(app)
        .get("/api/v1/transactions")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(1);

          const transaction = res.body[0];
          expect(transaction).to.have.property("id");
          expect(transaction).to.have.property("user_id");
          expect(transaction).to.have.property("category_id");
          expect(transaction).to.have.property("amount_in");
          expect(transaction).to.have.property("amount_out");
          expect(transaction).to.have.property("description");
          expect(transaction).to.have.property("date");

          done();
        });
    });

    it("should return transactions sorted by date in descending order", (done) => {
      request(app)
        .get("/api/v1/transactions")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(2);

          const firstDate = new Date(res.body[0].date);
          const secondDate = new Date(res.body[1].date);

          expect(firstDate.getTime()).to.be.at.least(secondDate.getTime());

          done();
        });
    });
  });
  
  describe("POST /api/v1/transactions", () => {
    it("should create an incoming transaction", (done) => {
      request(app)
        .post("/api/v1/transactions")
        .send({
          userId: 1,
          amount: 100.0,
          category: 1,
          description: "Salary",
          isIncoming: true,
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          // Check the response structure
          expect(res.body).to.have.property("transaction");
          expect(res.body).to.have.property("updatedBalance");

          // Check the properties of the transaction object
          const { transaction } = res.body;
          expect(transaction).to.have.property("id");
          expect(transaction.amount_in).to.equal("100.00");
          expect(transaction.amount_out).to.equal("0.00");
          expect(transaction.description).to.equal("Salary");

          // Check the updated balance
          expect(res.body.updatedBalance).to.be.a("number");

          done();
        });
    });

    it("should create an outgoing transaction", (done) => {
      request(app)
        .post("/api/v1/transactions")
        .send({
          userId: 1,
          amount: 50.0,
          category: 1,
          description: "Dinner at restaurant",
          isIncoming: false,
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          // Check the response structure
          expect(res.body).to.have.property("transaction");
          expect(res.body).to.have.property("updatedBalance");

          // Check the properties of the transaction object
          const { transaction } = res.body;
          expect(transaction).to.have.property("id");
          expect(transaction.amount_in).to.equal("0.00");
          expect(transaction.amount_out).to.equal("50.00");
          expect(transaction.description).to.equal("Dinner at restaurant");

          // Check the updated balance
          expect(res.body.updatedBalance).to.be.a("number");

          done();
        });
    });

    it("should reduce the user's balance after an expense", async () => {
      // Get the initial balance for user with ID 1
      let initialBalance = await getBalance(1);
      console.log("Initial user's balance:", initialBalance);

      // Perform an outgoing transaction (expense)
      await request(app)
        .post("/api/v1/transactions")
        .send({
          userId: 1,
          amount: 100.0,
          category: 2,
          description: "Grocery shopping",
          isIncoming: false,
        })
        .expect(201);

      // Get the updated balance after the transaction
      let updatedBalance = await getBalance(1);
      console.log("Updated balance:", updatedBalance);

      // Ensure the balance is reduced by the transaction amount
      expect(updatedBalance).to.equal(4900);
    });

    it("should update the sender's balance after a transfer", async () => {
      // Get the initial balance for user with ID 1 (sender)
      let initialSenderBalance = await getBalance(1);
      console.log("Initial sender balance:", initialSenderBalance);

      // Perform a transfer
      await request(app)
        .post("/api/v1/transfers")
        .send({
          senderId: 1,
          recipientId: 2,
          amount: 50.0,
          method: "Bank",
          description: "Payment for services",
        })
        .expect(201);

      // Get the updated balance for the sender after the transfer
      let updatedSenderBalance = await getBalance(1);
      console.log("Updated sender balance:", updatedSenderBalance);

      // Ensure the sender's balance is reduced by the transfer amount
      expect(updatedSenderBalance).to.equal(4950);

      // Get the initial balance for user with ID 2 (recipient)
      let initialRecipientBalance = await getBalance(2);
      console.log("Initial recipient balance:", initialRecipientBalance);

      // Get the updated balance for the recipient after the transfer
      let updatedRecipientBalance = await getBalance(2);
      console.log("Updated recipient balance:", updatedRecipientBalance);

      // Ensure the recipient's balance is increased by the transfer amount
      expect(updatedRecipientBalance).to.equal(6050);
    });

    it("should increase the user's balance after an incoming transaction", async () => {
      // Get the initial balance for user with ID 1
      let initialBalance = await getBalance(1);
      console.log("Initial balance:", initialBalance);

      // Perform an incoming transaction
      await request(app)
        .post("/api/v1/transactions")
        .send({
          userId: 1,
          amount: 100.0,
          category: 1,
          description: "Salary",
          isIncoming: true,
        })
        .expect(201);

      // Get the updated balance after the transaction
      let updatedBalance = await getBalance(1);
      console.log("Updated balance:", updatedBalance);

      // Ensure the balance is increased by the transaction amount
      expect(updatedBalance).to.be.above(initialBalance);
    });
  });

  describe("GET /api/v1/transactions/user/:userId", () => {
    it("should retrieve all transactions for a specific user", (done) => {
      request(app)
        .get("/api/v1/transactions/user/1")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(1);

          const transaction = res.body[0];
          expect(transaction).to.have.property("id");
          expect(transaction).to.have.property("user_id");
          expect(transaction.user_id).to.equal(1);
          expect(transaction).to.have.property("category_id");
          expect(transaction).to.have.property("amount_in");
          expect(transaction).to.have.property("amount_out");
          expect(transaction).to.have.property("description");
          expect(transaction).to.have.property("date");

          done();
        });
    });
  });
  
  describe("GET /api/v1/transactions/:id", () => {
    it("should retrieve a transaction by ID", (done) => {
      request(app)
        .get("/api/v1/transactions/1")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("id");
          expect(res.body).to.have.property("user_id");
          expect(res.body).to.have.property("amount_in");
          expect(res.body).to.have.property("amount_out");
          done();
        });
    });
  });

  describe("DELETE /api/v1/transactions/:id", () => {
    it("should delete a transaction by ID", (done) => {
      const transactionIdToDelete = 1;
      request(app)
        .delete(`/api/v1/transactions/${transactionIdToDelete}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction deleted successfully");
          expect(res.body).to.have.property("transaction");
          done();
        });
    });
  });

  describe("GET /api/v1/transactions/:id", () => {
    it("should return 404 for a non-existent transaction", (done) => {
      request(app)
        .get("/api/v1/transactions/999999")
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error", "Transaction not found");
          done();
        });
    });
  });
});

// Helper function to get user balance
async function getBalance(userId) {
  const response = await request(app)
    .get(`/api/v1/users/${userId}/balance`)
    .expect(200);
  return parseFloat(response.body.balance);
}