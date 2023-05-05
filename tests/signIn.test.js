
const userModel = require("../models/userModel");
// consnt userController = require('./controller/Auth/userController');
const { signIn } = require("../controller/Auth/userController");
// const { comparePassword } = require('/./utils/passwords');
const { comparePassword } = require("../utils/passwords")
// const { verifyToken } = require("../utils/Tokens");


// const { comparePassword } = require("../utils/passwords")
// const { comparePassword } = require('./utils/Tokens');
// const { retrieveToken, verifyToken, authorized } = require("../utils/Tokens");

const bcrypt = require('bcrypt');

// const comparePassword = require('./utils/Tokens');
// const { GenerateToken } = require('./utils/Tokens');

jest.mock('../models/userModel');
jest.mock('../utils/passwords');
jest.mock('../utils/Tokens');




describe('signIn', () => {
    it('returns an error if email or password are not provided', () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    signIn(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email and password are required',
    });
    });

    it('returns an error if user email not found', async () => {
        const req = {
          body: {
            email: 'test@test.com',
            password: 'password',
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        jest.spyOn(userModel, 'findOne').mockImplementation(() => Promise.resolve(null));
        
    
        await signIn(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Invalid Email or Password',
        });
      }); 


      it('returns an error if user is not verified', async () => {
        const req = {
          body: {
            email: 'test@test.com',
            password: 'password',
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        jest.spyOn(userModel, 'findOne').mockImplementation(() => Promise.resolve({
          isVerified: false,
        }));
    
        await signIn(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Please verify your email address',
        });
    }); 


  } 


)









