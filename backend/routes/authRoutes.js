const express = require('express');
const router = express.Router();
const {
  registerInit,
  registerVerify,
  loginInit,
  loginVerify,
  getUser
} = require('../controllers/authController');

router.post('/register-init', registerInit);
router.post('/register-verify', registerVerify);
router.post('/login-init', loginInit);
router.post('/login-verify', loginVerify);
router.post('/get-user', getUser);

module.exports = router;
