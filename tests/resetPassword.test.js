
// Import the necessary modules and functions
const { resetPassword } = require('../controller/userController');
const jwt = require('jsonwebtoken');
var { passwordEncryption } = require('../utils/passwords');
const userModel = require('../models/userModel');
const mailer = require('../utils/sendEmail')
const { sendUserEmail, forgetPasswordOption } = require("../utils/sendEmail")
 
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
    await resetPassword(req, res);

    // EXPECTATIONS
    expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.SECRETJWT);
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
      msg: "User password has been reset",
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
    await resetPassword(req, res);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.SECRETJWT);
    expect(userModel.findById).not.toHaveBeenCalled();
    expect(passwordEncryption).not.toHaveBeenCalled();
    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: "Invalid token",
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
    await resetPassword(req, res);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.SECRETJWT);
    expect(userModel.findById).toHaveBeenCalledWith("test_user_id");
    expect(passwordEncryption).not.toHaveBeenCalled();
    expect(userModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: "this link is expired",
    });
  });
})

/*
// Mock user data
const user = {
  _id: '60a5d1568a95c9145cb5a5fb',
  password: 'ncagzuekqewfmkwv',
  token: '',

  firstName: 'OMAR',
  lastName: 'MAGDY',
  email: 'mercol58@ymail.com',
   
  emailConfirmation: 'mercol58@ymail.com',
  password: 'encryptedPassword',
  isVerified: true
};

// Mock the request and response objects
const req = {
  params: {
    token: 'mockToken'
  },
  body: {
    password: 'newPassword'
  }
};

const res = {
  status: jest.fn(() => res),
  send: jest.fn()
};

// Mock the necessary functions
jwt.verify = jest.fn(() => ({ userId: user._id }));
// it will return the string "encryptedPassword"
passwordEncryption = jest.fn(() => 'encryptedPassword');
userModel.findById = jest.fn(() => user);
userModel.findByIdAndUpdate = jest.fn(() => user);

describe('resetPassword function', () => {
  it('should reset user password', async () => {
    await resetPassword(req, res);
    // Verify that jwt.verify is called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.SECRETJWT);
    const expectedUpdateQuery = {
        $set: { password: 'encryptedPassword', token: '' },
      };
      const expectedOptions = { new: true };

    // Verify that userModel.findById is called with the correct argument
    expect(userModel.findById).toHaveBeenCalledWith(user._id);


    // Verify that passwordEncryption is called with the correct argument
    //expect(passwordEncryption).toHaveBeenCalledWith(user.password);

    // Verify that userModel.findByIdAndUpdate is called with the correct arguments
    //userModel.findByIdAndUpdate = jest.fn().mockReturnValue(user);

    // Act
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: passwordEncryption(), token: "" } },
      { new: true }
    );

    // Assert
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: user._id },
      expectedUpdateQuery,
      expectedOptions
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'User password has been reset'
    });
  
  });
});








    expect( userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: user._id },
      { $set: { password: passwordEncryption() , token: '' } },
      { new: true }
    );

    // Verify that the response is sent with the correct status and message
    

  it('should return an error message if the link is expired', async () => {
    userModel.findById = jest.fn(() => undefined);

    await resetPassword(req, res);

    // Verify that the response is sent with the correct status and message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'this link is expired'
    });
  });

  it('should return an error message if there is an error', async () => {
    const error = new Error('Test error');
    userModel.findById = jest.fn(() => {
      throw error;
    });

    await resetPassword(req, res);

    // Verify that the response is sent with the correct status and message
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: error.message
    });
  });
//}); 
*/
/*
// Import the necessary modules and functions
const { resetPassword } = require('../controller/userController');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Mock user data
const user = {
  _id: '123456',
  email: 'test@test.com',
  password: 'password',
  token: 'resetToken'
};

// Mock the request and response objects
const req = {
  params: {
    token: 'mockToken'
  },
  body: {
    password: 'newPassword'
  }
};

const res = {
  status: jest.fn(() => res),
  send: jest.fn()
};

// Mock the necessary functions
jwt.verify = jest.fn(() => ({ userId: user._id }));
userModel.findById = jest.fn(() => user);
userModel.findByIdAndUpdate = jest.fn(() => user);
passwordEncryption = jest.fn(() => 'encryptedPassword');

describe('resetPassword function', () => {
  it('should reset the user password', async () => {
    await resetPassword(req, res);

    expect(jwt.verify).toHaveBeenCalledWith(req.params.token, process.env.SECRETJWT);
    expect(userModel.findById).toHaveBeenCalledWith(user._id);
    
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: user._id },
      { $set: { password: encryptedPassword, token: '' } },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'User password has been reset'
    });
  });
}); 
*/
/*process.env.SECRETJWT = 'x9dIxDWjkatOs4AxIV06iF0v1RAlh8tPbNy';

const userModel = require('../models/userModel');
const { resetPassword } = require('../controller/userController');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset the user password and return success message', async () => {
    const mockUser = {
      _id: '123',
      password: 'oldPassword',
    };
    userModel.findById.mockResolvedValueOnce(mockUser);

    const mockToken = jwt.sign({ userId: '123' }, process.env.SECRETJWT);

    const req = {
      params: { token: mockToken },
      body: { password: 'newPassword' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await resetPassword(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: mockUser._id },
      { $set: { password: expect.any(String), token: '' } },
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'User password has been reset',
    });
  });

  it('should return an error message if the token is invalid', async () => {
    const req = {
      params: { token: 'invalidToken' },
      body: { password: 'newPassword' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'this link is expired',
    });
  });

  it('should return an error message if there is an error during the password reset process', async () => {
    const mockUser = {
      _id: '123',
      password: 'oldPassword',
    };
    userModel.findById.mockResolvedValueOnce(mockUser);

    const mockToken = jwt.sign({ userId: '123' }, process.env.SECRETJWT);

    const req = {
      params: { token: mockToken },
      body: { password: 'newPassword' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    userModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('DB error'));

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      msg: 'DB error',
    });
  });
});
 */
/*const { resetPassword } = require('./resetPassword');
const userModel = require('../models/userModel');

// Mock the user model
jest.mock('../models/userModel', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

describe('resetPassword function', () => {
  it('should reset the user password', async () => {
    const req = {
      params: {
        token: 'testToken',
      },
      body: {
        password: 'newPassword',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const user = {
      _id: 'testId',
    };
    const encryptedPassword = 'encryptedPassword';
    const userSearchById = {
      _id: 'testId',
      password: encryptedPassword,
    };
    const decoded = {
      userId: 'testId',
    };

    // Mock the userModel.findById function to return the user
    userModel.findById.mockResolvedValueOnce(user);

    // Mock the passwordEncryption function to return the encrypted password
    jest.mock('./passwordEncryption', () => ({
      passwordEncryption: jest.fn().mockResolvedValueOnce(encryptedPassword),
    }));

    // Mock the jwt.verify function to return the decoded token
    jest.mock('jsonwebtoken', () => ({
      verify: jest.fn().mockReturnValueOnce(decoded),
    }));

    // Mock the userModel.findByIdAndUpdate function to return the updated user
    userModel.findByIdAndUpdate.mockResolvedValueOnce(userSearchById);

    // Call the resetPassword function
    await resetPassword(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'User password has been reset',
    });

    // Verify the userModel.findById function was called with the correct parameters
    expect(userModel.findById).toHaveBeenCalledWith(decoded.userId);

    // Verify the passwordEncryption function was called with the correct parameters
    expect(passwordEncryption).toHaveBeenCalledWith(req.body.password);

    // Verify the userModel.findByIdAndUpdate function was called with the correct parameters
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: user._id },
      { $set: { password: encryptedPassword, token: '' } },
      { new: true }
    );
  });

  it('should return an error if the link is expired', async () => {
    const req = {
      params: {
        token: 'testToken',
      },
      body: {
        password: 'newPassword',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the userModel.findById function to return null
    userModel.findById.mockResolvedValueOnce(null);

    // Mock the jwt.verify function to throw an error
    jest.mock('jsonwebtoken', () => ({
      verify: jest.fn().mockImplementationOnce(() => {
        throw new Error('Expired token');
      }),
    }));

    // Call the resetPassword function
    await resetPassword(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      msg: 'this link is expired',
    });
  });

  it('should return an error if there is an error', async () => {
    const req = {
      params: {
        token: 'testToken',
      },
      body: {
        password: 'newPassword',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Mock the userModel.findById function to throw an error
*/