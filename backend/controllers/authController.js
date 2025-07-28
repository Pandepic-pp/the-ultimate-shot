const { generateOTP, sendOTP } = require('../otpUtils');
const Otp = require('../models/otp');
const User = require('../models/user');

exports.registerInit = async (req, res) => {
  const { fullName, phone, email } = req.body;

  if (!fullName || !phone || !email) {
    return res.status(400).send('All fields are required');
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email });
  await new Otp({ email, otp }).save();
  await sendOTP(email, otp);

  res.status(200).send('OTP sent to email');
};

exports.registerVerify = async (req, res) => {
  const { email, otp, phone, fullName } = req.body;

  const validOtp = await Otp.findOne({ email });
  if (!validOtp || validOtp.otp !== otp) {
    return res.status(400).send('Invalid or expired OTP.');
  }

  await new User({ fullName, phone, email }).save();
  await Otp.deleteMany({ email });

  res.status(200).send('Registration successful!');
};

exports.loginInit = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not registered.');

  const otp = generateOTP();
  await Otp.deleteMany({ email });
  await new Otp({ email, otp }).save();
  await sendOTP(email, otp);

  res.status(200).send('OTP sent to your email.');
};

exports.loginVerify = async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp) {
    return res.status(400).send('Invalid or expired OTP');
  }

  await Otp.deleteMany({ email });
  res.status(200).send('OTP verified successfully!');
};

exports.getUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');

  res.status(200).json(user);
};
