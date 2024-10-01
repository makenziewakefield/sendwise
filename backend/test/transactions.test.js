const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server");
const { exec } = require("child_process");

describe("Transaction API Tests", () => {
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
          expect(res.body).to.have.property("id");
          expect(res.body.amount_in).to.equal("100.00");
          expect(res.body.amount_out).to.equal("0.00");
          expect(res.body.description).to.equal("Salary");
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
          expect(res.body).to.have.property("id");
          expect(res.body.amount_in).to.equal("0.00");
          expect(res.body.amount_out).to.equal("50.00");
          expect(res.body.description).to.equal("Dinner at restaurant");
          done();
        });
    });
  });

  describe("GET /api/v1/transactions/user/:userId", () => {
    it("should retrieve all transactions for a specific user", (done) => {
      request(app)
        .get("/api/v1/transactions/user/1") // Assuming user with ID 1 exists
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
        .get("/api/v1/transactions/1") // Adjust the ID according to your DB state
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
    it("should delete a transaction", (done) => {
      request(app)
        .delete("/api/v1/transactions/102")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal("Transaction deleted successfully");
          done();
        });
    });
  });

  describe("GET /api/v1/transactions/:id", () => {
    it("should return 404 for a non-existent transaction", (done) => {
      request(app)
        .get("/api/v1/transactions/999999") // Assuming this ID does not exist
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("error", "Transaction not found");
          done();
        });
    });
  });
});
