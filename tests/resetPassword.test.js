// Import the necessary modules and functions
//const { resetPassword } = require("../controller/userController");
const userController = require("../controller/Auth/userController");
const jwt = require("jsonwebtoken");
var { passwordEncryption } = require("../utils/passwords");
const userModel = require("../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("../models/userModel");
jest.mock("../utils/passwords");

describe("resetPassword function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should reset the user password and return success message", async () => {
    const req = {
      params: {
        token: "test_token",
      },
      body: {
        password: "new_password",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const user = {
      _id: "test_user_id",
      email: "test_user_email",
    };
    const decoded = {
      userId: "test_user_id",
    };
    jwt.verify.mockReturnValue(decoded); //assume verify returns decoded
    userModel.findById.mockResolvedValue(user); // assume returns user by id
    passwordEncryption.mockResolvedValue("encrypted_password"); // assume return encrypted password

    // CALLING FUNCTION
    await userController.resetPassword(req, res);

    // EXPECTATIONS
    expect(jwt.verify).toHaveBeenCalledWith(
      req.params.token,
      process.env.SECRETJWT
    );
    expect(userModel.findById).toHaveBeenCalledWith(decoded.userId);
    expect(passwordEncryption).toHaveBeenCalledWith(req.body.password);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: user._id },
      { $set: { password: "encrypted_password", token: "" } },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "User password has been reset",
    });
  });

  it("should return an error message if the token is invalid", async () => {
    // Arrange
    const req = {
      params: {
        token: "invalid_token",
      },
      body: {
        password: "new_password",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    //  mocked implementation of jwt.verify is a function that throws an Error with the message "Invalid token" when it is called
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Act
    await userController.resetPassword(req, res);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      req.params.token,
      process.env.SECRETJWT
    );
    expect(userModel.findById).not.toHaveBeenCalled();
    expect(passwordEncryption).not.toHaveBeenCalled();
    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
  });

  it("should return an error message if the user cannot be found", async () => {
    // Arrange
    const req = {
      params: {
        token: "test_token",
      },
      body: {
        password: "new_password",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jwt.verify.mockReturnValue({ userId: "test_user_id" });
    userModel.findById.mockResolvedValue(null);

    // Act
    await userController.resetPassword(req, res);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      req.params.token,
      process.env.SECRETJWT
    );
    expect(userModel.findById).toHaveBeenCalledWith("test_user_id");
    expect(passwordEncryption).not.toHaveBeenCalled();
    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "this link is expired",
    });
  });
});
