const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
jest.mock("../models/eventModel");
jest.mock("../models/userModel");
const generator = require("generate-password");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const { GenerateToken, verifyToken } = require("../utils/Tokens");

const {
  mobileSignUp,
  mobileSignIn,
} = require("../controller/Auth/mobileSocialsController");
const {
  googleLogin,
  facebookLogin,
} = require("../controller/Auth/userSocialController"); //importing methods from conroller
jest.mock("../controller/Auth/mobileSocialsController");
jest.mock("../controller/Auth/userController");
// const { facebookLogin, googleLogin } = require("../userSocialController");
describe("googleLogin function", () => {
  const req = {
    body: {
      firstname: "Thomasss",
      lastname: "Haleemmm",
      email: "thomas202@gmail.com",
      id: "435654483238743487967827532984547458756365",
    },
  };
  //   const res = {
  //     status: jest.fn(() => res),
  //     json: jest.fn(() => res),
  //   };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should sign in the user if user exists", async () => {
    // create a user
    const user = new userModel({
      firstname: "Thomasss",
      lastname: "Haleemmm",
      email: "thomas202@gmail.com",
      _id: "435654483238743487967827532984547458756365",
    });
    await user.save();

    const req = {
      body: {
        firstname: "Thomasss",
        lastname: "Haleemmm",
        email: "thomas202@gmail.com",
        id: "435654483238743487967827532984547458756365",
      },
    };
    // const res = {
    //   status: jest.fn(() => res),
    //   json: jest.fn(() => res),
    // };
    const res = {
      status: jest.fn().mockReturnValue(200),
      json: jest.fn(),
    };
    // jest
    //   .spyOn(userModel, "findOne")
    //   .mockImplementation(() => Promise.resolve(null));

    //
    // //checks if user exist first and if so, user shall be directed to landing page
    // let myUser = await User.findOne({
    //   // facebookId: userFacebook_Id,
    //   email: req.body.email,
    // });

    // create a mock request object with user info
    // const req = mockRequest({
    //   body: {
    //     firstname: "Thomasss",
    //     lastname: "Haleemmm",
    //     email: "thomas202@gmail.com",
    //     id: "435654483238743487967827532984547458756365",
    //   },
    // });

    // create a mock response object
    //  const res = mockResponse();

    // call the function that contains the code to be tested
    await mobileSignIn(user, res);

    // await facebookLogin(req, res);
    // expect response status to be 200
    //expect(res.status).toBe(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   success: false,
    //   message: "Failed to login or signup user",
    // });
    // // expect token to be defined in the response body
    // expect(res.body.token).toBeDefined();
  });
});
