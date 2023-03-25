const request=require('supertest');
const server=require('../app');




describe("POST /api/auth/signup" ,()=>{

    describe("user gives required signup information (name email and bithdate)", ()=>{
        //status code is 201
        test("should respond with 201 status code", async ()=> {
            const response = await request(server).post('/api/auth/signup').send({
                firstName:"Ahmed",
                lastName:"Osama",
                email:"ahmed_osa1567@gmail.com",
                emailConfirmation:"ahmed_osa1567@gmail.com",
                password:"User4456_2003"
            })
                
            expect(response.statusCode).toBe(201)
        })  
    })
    
    // describe("missing a signup inormation", ()=>{

    //     test("should respond with 400 status code", async ()=> {
    //         const response = await request(server).post('/api/auth/signup').send({
    //             lastName:"Osama",
    //             email:"user52891@gmail.com",
    //             emailConfirmation:"user52891@gmail.com",
    //             password:"Usera1291_2003"
    //         })
    //         expect(response.statusCode).toBe(400)
    //     })
    // })

 });  

 describe("POST /api/auth/login" ,()=>{

    describe("user gives required signup information (name email and bithdate)", ()=>{
        //status code is 201
        test("should respond with 201 status code", async ()=> {
            const response = await request(server).post('/api/auth/login').send({
                email:"user123@gmail.com",
                password:"Usera153_2003"
            })
                
              expect(response.statusCode).toBe(200)
            // expect(response.statusCode).toBe(201)
        })  
    })

    // test('returns a token',async()=>{
    // const response = await request(server).post('/api/auth/login').send({
    //                     email:"user123@gmail.com",
    //                     password:"Usera153_2003"
    //                 });
    //     expect(response.status).toB(200);
    // }    
    // );  

    // test ('returns a 400 error for an invalid email address',async()=>{

    //     const response = await request(server).post('/api/auth/login').send({
    //         email:"user2@gmail.com",
    //         password:"Usera153_2003",
    //     });
    // expect(response.status).toBe(200);


// } );   
    
    
} );

  

            // expect(response.statusCode).toBe(201)
        
    


    
    // describe("missing login inormation", ()=>{

    //     test("invalid email or password", async ()=> {
    //         const response = await request(server).post('api/auth/login').send({
    //          email:"user13@gmail.com",
    //          password:"Usera153_2003"
    //         })
    //         expect(response.statusCode).toBe(400)
    //     })
    // })




