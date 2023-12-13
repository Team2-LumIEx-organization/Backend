const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const app = require("../index");
const User = require("../model/User");
const { loginValidation } = require("../validation/auth");
const bcrypt = require("bcrypt");

chai.use(chaiHttp);
const expect = chai.expect;

describe("POST /login", () => {
  it("should return a token when valid credentials are provided", async () => {
    const testUser = new User({
      email: "test@example.com",
      password: await bcrypt.hash("testpassword", 10),
      type: "user",
      name: "Test User",
    });

    await testUser.save();

    const credentials = {
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await chai.request(app).post("/login").send(credentials);

    expect(response).to.have.status(200);

    expect(response).to.have.header("token");

    const decodedToken = jwt.verify(response.header.token, "TOKEN_SECRET");

    expect(decodedToken).to.have.property("_id");
    expect(decodedToken.email).to.equal("test@example.com");
    expect(decodedToken.type).to.equal("user");
    expect(decodedToken.name).to.equal("Test User");
  });

  it("should return an error when invalid credentials are provided", async () => {
    const invalidCredentials = {
      email: "test@example.com",
      password: "invalidpassword",
    };

    const response = await chai
      .request(app)
      .post("/login")
      .send(invalidCredentials);

    expect(response).to.have.status(400);

    expect(response.text).to.equal("Email or password is wrong!");
  });
});
