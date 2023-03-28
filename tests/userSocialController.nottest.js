const request=require('supertest');
const server=require('../app');
describe("POST /api/auth/google/app" ,()=>{

    describe("Receives request body with user information to be signed in or signed up ", ()=>{
        //status code is 201
        test("should respond with 201 status code", async ()=> {
            const response = await request(server).post('/api/auth/google/app').send({
                
                    firstname:"abdoo",
                    lastname:"matioo",
                    email:"halaaaaaaamatio@gmail.com",
                    id:"43564655485632778647496327824375301294538454758756365"
                
                
                
            })
                
            expect(response.statusCode).toBe(200)
        })  
    })

});

describe("POST /api/auth/facebook/app" ,()=>{

    describe("Receives request body with user information to be signed in or signed up ", ()=>{
        //status code is 201
        test("should respond with 201 status code", async ()=> {
            const response = await request(server).post('/api/auth/facebook/app').send({
                
                    firstname:"homosss",
                    lastname:"mamdouhhh",
                    email:"homossssmamdouhhh@gmail.com",
                    id:"435646554332273283647496782294548538454758756365"
                
                
                
            })
                
            expect(response.statusCode).toBe(200)
        })  
    })

});