const express = require('express');
const app = express();
require('dotenv').config();
const mongoose= require ('mongoose');

const usersRoutes= require('./router/userRouter');

//old database
mongoose.connect( 'mongodb+srv://tessera-dev:Dy2lSeN963pBHSOh@tessera-dev.ehydg.mongodb.net/?retryWrites=true&w=majority', {
//   useFindAndModify:true,
//   useCreateIndex:true,
//   useNewUrlParser:true,
}).then( () => console.log('DB Connected')).catch(err => console.log(err));
// // const PORT=process.env.PORT || 5000;
// //old database
app.use(express.json()); 
app.use("/api",usersRoutes)
//console.log(process.env.emailUser)








// app.post('/api/auth/signup',async (req,res) => {
//     try{
//       const { first_name,last_name,email,email_confirmation,password}= req.body
//       const user= await User.create({first_name,last_name,email,email_confirmation,password});
//       console.log(user);
//       res.send(user)
//     } catch(error){
//         console.log(error)
//     }

// } ); 




// Start the server on port 3000
const PORT = 3000;
app.listen(
    PORT,
    () => console.log(`It's aliveee on http://localhost:${PORT}`)

);