const { expect } = require("chai");
const sinon = require("sinon");
const {
  authenticateUser,
  registerUser,
} = require("../controllers/authController");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Auth Controller", function () {
  let req, res, next;

  // Setup before each test
  beforeEach(() => {
    req = { body: { email: "test@example.com", password: "password123" } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    next = sinon.stub();
  });

  // Cleanup after each test
  afterEach(() => {
    sinon.restore();
  });

  /**
   * Test case for successfully registering a user.
   * - Mocks the findOne, hash, save, and sign methods.
   * - Asserts that the response status is 201 and the JSON response contains the token.
   */
  it("should register a user successfully", async () => {
    const findOneStub = sinon.stub(User, "findOne").resolves(null);
    const hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");
    const saveStub = sinon.stub(User.prototype, "save").resolves();
    const jwtSignStub = sinon.stub(jwt, "sign").returns("fakeToken");

    req.body = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    await registerUser(req, res, next);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ token: "fakeToken" })).to.be.true;

    findOneStub.restore();
    hashStub.restore();
    saveStub.restore();
    jwtSignStub.restore();
  });

  /**
   * Test case for attempting to register a user with an already existing email.
   * - Mocks the findOne method to return an existing email.
   * - Asserts that the response status is 400 and the JSON response contains an error message.
   */
  it("should not register a user if email already exists", async () => {
    sinon.stub(User, "findOne").resolves({ email: "test@example.com" });

    req.body = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    await registerUser(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: "Email already exists" })).to.be.true;
  });

  /**
   * Test case for successfully authenticating a user.
   * - Mocks the findOne method to return a user with a hashed password.
   * - Mocks the compare method to validate the password.
   * - Asserts that the response status is 200 and the JSON response contains the token.
   */
  it("should authenticate a user successfully", async () => {
    sinon
      .stub(User, "findOne")
      .resolves({ email: "test@example.com", password: "hashedPassword" });
    sinon.stub(bcrypt, "compare").resolves(true);
    const jwtSignStub = sinon.stub(jwt, "sign").returns("fakeToken");

    await authenticateUser(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ token: "fakeToken" })).to.be.true;

    jwtSignStub.restore();
  });

  /**
   * Test case for attempting to authenticate a user with an invalid email.
   * - Mocks the findOne method to return null.
   * - Asserts that the response status is 401 and the JSON response contains an error message.
   */
  it("should not authenticate a user with invalid email", async () => {
    sinon.stub(User, "findOne").resolves(null);

    await authenticateUser(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Invalid email or password" })).to.be
      .true;
  });

  /**
   * Test case for attempting to authenticate a user with an invalid password.
   * - Mocks the findOne method to return a user with a hashed password.
   * - Mocks the compare method to fail password validation.
   * - Asserts that the response status is 401 and the JSON response contains an error message.
   */
  it("should not authenticate a user with invalid password", async () => {
    sinon
      .stub(User, "findOne")
      .resolves({ email: "test@example.com", password: "hashedPassword" });
    sinon.stub(bcrypt, "compare").resolves(false);

    await authenticateUser(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Invalid email or password" })).to.be
      .true;
  });
});
