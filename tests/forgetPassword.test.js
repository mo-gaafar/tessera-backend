const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { forgotpassword } = require('../controller/userController');
const { sendUserEmail, forgetPasswordOption } = require("../utils/sendEmail")

jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('forgotpassword', () => {
  const req = { body: { email: 'tessera.help@gmail.com' } };
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should send a success response if user with given email exists', async () => {
    const user = { _id: 'testuserid' };
    const token = 'testtoken';
    userModel.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue(token);

    await forgotpassword(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id }, process.env.SECRETJWT, { expiresIn: '1d' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ success: true, msg: 'please check your mail inbox and reset password' });
  });

  test('should send a success response if user with given email does not exist', async () => {
    userModel.findOne.mockResolvedValue(null);

    await forgotpassword(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ success: true, msg: 'this email doesnt exist' });
  });

  test('should send a error response if an error occurs', async () => {
    const error = new Error('test error');
    userModel.findOne.mockRejectedValue(error);

    await forgotpassword(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ success: false, msg: error.message });
  });
});