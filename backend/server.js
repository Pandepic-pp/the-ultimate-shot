const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const { generateOTP, sendOTP } = require('./otpUtils');
const Otp = require('./models/otp');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

// MongoDB connect
(async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MongoDB URI is not defined in the .env file');
    process.exit(1); // Exit the process with failure
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
})();


// register route
app.post('/register-init', async (req, res) => {
  const { fullName, phone, email } = req.body;

  if (!fullName || !phone || !email) {
    return res.status(400).send('All fields are required');
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    return res.status(400).send('User already exists with this email or phone. Please log in.');
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email });
  await new Otp({ email, otp }).save();
  await sendOTP(email, otp);

  res.status(200).send('OTP sent to email. Please verify to complete registration.');
});

app.post('/register-verify', async (req, res) => {
  const { email, otp } = req.body;

  const validOtp = await Otp.findOne({ email });

  if (!validOtp || validOtp.otp !== otp) {
    return res.status(400).send('Invalid or expired OTP.');
  }

  // Optional: Retrieve phone & name from session or external storage in real-world apps
  // For demo, just send phone & fullName again
  const { phone, fullName } = req.body;

  if (!phone || !fullName) {
    return res.status(400).send('Phone and fullName are required again for verification.');
  }

  await new User({ fullName, phone, email }).save();
  await Otp.deleteMany({ email });

  res.status(200).send('Registration successful!');
});

// 👉 Route to send OTP
app.post('/login-init', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send('User not registered. Please register first.');
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email });
  await new Otp({ email, otp }).save();
  await sendOTP(email, otp);

  res.status(200).send('OTP sent to your email.');
});


// 👉 Route to verify OTP
app.post('/login-verify', async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) return res.status(400).send('OTP not found or expired');

  if (otpRecord.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  await Otp.deleteMany({ email }); // optional: invalidate OTP after use

  res.status(200).send('OTP verified successfully!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
