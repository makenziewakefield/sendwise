const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server"); // Adjust the path to your server file
const { exec } = require("child_process");

describe("Transfer API Tests", () => {
  before(function (done) {
    this.timeout(10000); // Increase timeout to 10 seconds
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
          expect(res.body.length).to.be.at.least(1); // Adjust based on your seed data

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
        .get("/api/v1/transfers/1") // Assuming user with ID 1 exists
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.at.least(1); // Adjust based on your seed data

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
          amount: 1000.0,
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
          expect(res.body).to.have.property("error", "User not found");
          done();
        });
    });
  });

  describe("GET /api/v1/transfers/:userId/history", () => {
    it("should retrieve transfer history for a specific user", (done) => {
      request(app)
        .get("/api/v1/transfers/1/history")
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

  describe("DELETE /api/v1/transfers/:id", () => {
    it("should delete a transfer by ID", (done) => {
      const transferIdToDelete = 1; // Use a valid transfer ID for the test
      request(app)
        .delete(`/api/v1/transfers/${transferIdToDelete}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body).to.have.property("message"); // Check for the message property
          expect(res.body.message).to.equal("Transfer deleted successfully"); // Check the message
          expect(res.body).to.have.property("transfer"); // Check for deleted transfer
          done();
        });
    });

    it("should return 404 for non-existent transfer", (done) => {
      request(app)
        .delete("/api/v1/transfers/9999999") // Assuming this ID does not exist
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error"); // Check for the error property
          expect(res.body.error).to.equal("Transfer not found"); // Check the error message
          done();
        });
    });
  });
});
