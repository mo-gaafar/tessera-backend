const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/userModel");
//const { forgotPassword } = require('../controller/userController');
const { sendUserEmail, forgetPasswordOption } = require("../utils/sendEmail");
const userController = require("../controller/Auth/userController");

jest.mock("jsonwebtoken");
jest.mock("../models/userModel");

describe("forgotpassword", () => {
	const req = { body: { email: "tessera.help@gmail.com" } };
	const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

	afterEach(() => {
		jest.clearAllMocks();
	});

	test(" user with given email exists", async () => {
		const user = { _id: "testuserid" };
		const token = "testtoken";
		userModel.findOne.mockResolvedValue(user);
		jwt.sign.mockReturnValue(token);

		await userController.forgotPassword(req, res);

		expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId: user._id },
			process.env.SECRETJWT,
			{ expiresIn: "1d" }
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			success: true,
			message: "please check your mail inbox and reset password",
		});
	});

	test(" user with given email does not exist", async () => {
		userModel.findOne.mockResolvedValue(null);

		await userController.forgotPassword(req, res);

		expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			success: true,
			message: "this email doesnt exist",
		});
	});

	test(" error response if an error occurs", async () => {
		const error = new Error("test error");
		userModel.findOne.mockRejectedValue(error);

		await userController.forgotPassword(req, res);

		expect(userModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			success: false,
			message: error.message,
		});
	});
});
