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
jest.mock("../models/userModel", () => ({
  create: jest.fn(),
}));

describe("facebookSignUp function", () => {
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
  test("should sign up the user if user doesn't exists", async () => {
    const req = {
      body: {
        firstname: "Thomasoo",
        lastname: "Haleemmmoo",
        email: "thomas2044@gmail.com",
        id: "4356544832387434879678275329845475748756365",
      },
    };
    var newPassword = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
    });

    const newUser = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      isVerified: true,
      email: req.body.email,
      password: newPassword,
      userType: "facebook",
    };

    // const userFacebook_Id = req.body.id;
    newUser.facebookId = req.body.id;

    //const user = await userModel.create(newUser);
    userModel.create.mockResolvedValue(newUser);

    // console.log("noah amourr: ", user);
    await mobileSignUp(req.body, "facebook", res);

    //expect(res.status).toBe(200);

    // expect(res.json).toHaveBeenCalledWith({
    //   success: false,
    //   message: "Failed to login or signup user",
    // });
    // // Assertions
    // // expect(user).toBeDefined();
    // expect(user.firstName).toEqual(newUser.firstname);
    // //generate token for the signed in user
    // const token = await GenerateToken(user._id);
  });
});
