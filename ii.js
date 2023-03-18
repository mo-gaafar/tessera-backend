// Generate a unique token using crypto module
const crypto = require('crypto');
const token = crypto.randomBytes(20).toString('hex');

// Store user data and token in MongoDB
const user = new User({
  email: req.body.email,
  password: req.body.password,
  token: token,
  isVerified: false
});
await user.save();

// Send email with verification link
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password'
  }
});
const mailOptions = {
  from: 'your_email@gmail.com',
  to: req.body.email,
  subject: 'Please verify your email address',
  html: `<p>Please click <a href="http://localhost:3000/verify/${token}">here</a> to verify your email address.</p>`
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

// Verify user's email address
app.get('/verify/:token', async (req, res) => {
  const user = await User.findOne({ token: req.params.token });
  if (!user) {
    return res.status(400).send('Invalid token.');
  }
  user.isVerified = true;
  user.token = undefined;
  await user.save();
  res.redirect('/login');
});
