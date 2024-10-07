const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server");
const { exec } = require("child_process");

describe("Transfer API Tests", () => {
  before(function (done) {
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

  describe("GET /api/v1/transfers/history", () => {
    it("should retrieve all transfer histories for admin", (done) => {
      request(app)
        .get("/api/v1/transfers/history")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(1);

          const transfer = res.body[0];
          expect(transfer).to.have.property("id");
          expect(transfer).to.have.property("sender_id");
          expect(transfer).to.have.property("recipient_id");
          expect(transfer).to.have.property("amount");
          expect(transfer).to.have.property("description");
          expect(transfer).to.have.property("method");
          expect(transfer).to.have.property("date");

          done();
        });
    });
  });

  describe("GET /api/v1/transfers/:userId", () => {
    it("should retrieve all transfers for a specific user", (done) => {
      request(app)
        .get("/api/v1/transfers/1")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(1);

          const transfer = res.body[0];
          expect(transfer).to.have.property("id");
          expect(transfer).to.have.property("sender_id");
          expect(transfer).to.have.property("recipient_id");
          expect(transfer).to.have.property("amount");
          expect(transfer).to.have.property("description");
          expect(transfer).to.have.property("method");

          done();
        });
    });
  });

  describe("POST /api/v1/transfers", () => {
    it("should create a new transfer", (done) => {
      request(app)
        .post("/api/v1/transfers")
        .send({
          senderId: 1,
          recipientId: 2,
          amount: 50.0,
          method: "Bank",
          description: "Payment for services",
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property("id");
          expect(res.body.sender_id).to.equal(1);
          expect(res.body.recipient_id).to.equal(2);
          expect(res.body.amount).to.equal(50.0);
          expect(res.body.description).to.equal("Payment for services");
          done();
        });
    });

    it("should return 400 for insufficient funds", (done) => {
      request(app)
        .post("/api/v1/transfers")
        .send({
          senderId: 1,
          recipientId: 2,
          amount: 1000000.0,
          description: "Payment for services",
          method: "Bank",
        })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error", "Insufficient funds");
          done();
        });
    });

    it("should return 404 for non-existent sender", (done) => {
      request(app)
        .post("/api/v1/transfers")
        .send({
          senderId: 9999,
          recipientId: 2,
          amount: 50.0,
          description: "Payment for services",
          method: "Bank",
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error", "Sender not found");
          done();
        });
    });

    it("should return 404 if recipient does not exist", (done) => {
      request(app)
        .post("/api/v1/transfers")
        .send({
          senderId: 1,
          recipientId: 9999,
          amount: 50,
          method: "Bank",
          description: "Payment for services",
        })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error", "Recipient not found");
          done();
        });
    });

    it("should update sender's balance after transfer", async () => {
      // Get initial sender balance
      let senderBalance = await getBalance(1);

      // Perform transfer
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

      // Get updated sender balance
      senderBalance = await getBalance(1);
      expect(senderBalance).to.be.below(5000); // Initial balance was 5000
    });

    it("should update recipient's balance after transfer", async () => {
      // Get initial recipient balance
      let initialBalance = await getBalance(2);
      console.log("Initial balance for recipient:", initialBalance);

      // Perform transfer
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

      // Get updated recipient balance
      let recipientBalance = await getBalance(2);
      expect(recipientBalance).to.equal(initialBalance + 50); // Initial balance was 6000
    });
  });

  describe("DELETE /api/v1/transfers/:id", () => {
    it("should delete a transfer by ID", (done) => {
      const transferIdToDelete = 1;
      request(app)
        .delete(`/api/v1/transfers/${transferIdToDelete}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transfer deleted successfully");
          expect(res.body).to.have.property("transfer");
          done();
        });
    });

    it("should return 404 for non-existent transfer", (done) => {
      request(app)
        .delete("/api/v1/transfers/9999999")
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("Transfer not found");
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
  return response.body.balance;
}