const userModel = require("../models/userModel");
const { resetPassword } = require("../controller/Auth/userController");
const { passwordEncryption } = require("../utils/passwords");
const { verifyToken } = require("../utils/Tokens");

jest.mock("../models/userModel");
jest.mock("../utils/passwords.js");
jest.mock("../utils/Tokens.js");

describe("resetPassword", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("reset user password using a token", async () => {
		const req = {
			params: {
				token: "some-token",
			},
			body: {
				password: "new-password",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const user = {
			_id: "user-id",
		};
		const encryptedPassword = "encrypted-password";

		userModel.findById.mockResolvedValue(user);
		passwordEncryption.mockResolvedValue(encryptedPassword);
		verifyToken.mockResolvedValue({ user_id: user._id });

		await resetPassword(req, res);

		expect(req.params.token).toBe("some-token");
		expect(userModel.findById).toHaveBeenCalledWith(user._id);
		expect(passwordEncryption).toHaveBeenCalledWith(req.body.password);
		expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
			{ _id: user._id },
			{ $set: { password: encryptedPassword, token: "" } },
			{ new: true }
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			success: true,
			message: "User password has been reset",
		});
	});

	it("an error message with status code 400 if an error occurs", async () => {
		const user = {
			_id: "user-id",
		};
		const req = {
			params: {
				token: "some-token",
			},
			body: {
				password: "new-password",
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};

		userModel.findById.mockRejectedValue(new Error("Failed to find user"));
		verifyToken.mockRejectedValue(new Error("link is expired"));

		await resetPassword(req, res);

		expect(req.params.token).toBe("some-token");
		expect(userModel.findById).not.toHaveBeenCalledWith(user._id);
		expect(verifyToken).toHaveBeenCalledWith("some-token");
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			success: false,
			message: "link is expired",
		});
	});
});
