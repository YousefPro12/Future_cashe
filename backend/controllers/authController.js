const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, OtpCode } = require('../models');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email, password, fullname, referral_code } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      password_hash,
      fullname,
      account_status: 'active',
      referral_code: uuidv4().substring(0, 8)
    });

    // Check if user was referred
    if (referral_code) {
      const referrer = await User.findOne({ where: { referral_code } });
      if (referrer) {
        // Update user with referrer
        await user.update({ referred_by: referrer.id });
        // Handle referral relationship (will be done in separate service)
      }
    }

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);

    await OtpCode.create({
      user_id: user.id,
      code: otp,
      purpose: 'email_verify',
      expires_at: expiryTime
    });

    // Send OTP to user email (to be implemented with email service)
    // TODO: Integrate email service

    // Return success without sensitive information
    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      userId: user.id,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Log in a user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check account status
    if (user.account_status !== 'active') {
      return res.status(401).json({ message: 'Account is not active' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Update user's IP and user agent
    const userIp = req.ip;
    const userAgent = req.headers['user-agent'];

    // Save auth session (will be implemented)
    // TODO: Save auth session with IP and user agent

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        points_balance: user.points_balance,
        referral_code: user.referral_code
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Verify email with OTP
 * @route POST /api/auth/verify-email
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find OTP
    const otpRecord = await OtpCode.findOne({
      where: {
        user_id: user.id,
        code: otp,
        purpose: 'email_verify',
        used: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark OTP as used
    await otpRecord.update({ used: true });

    // Activate the user if not already
    if (user.account_status !== 'active') {
      await user.update({ account_status: 'active' });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ message: 'If your email exists, you will receive a reset link' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1); // OTP valid for 1 hour

    await OtpCode.create({
      user_id: user.id,
      code: otp,
      purpose: 'password_reset',
      expires_at: expiryTime
    });

    // Send OTP to user email (to be implemented)
    // TODO: Integrate email service

    res.status(200).json({ message: 'If your email exists, you will receive a reset link' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

/**
 * Reset password with OTP
 * @route POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find OTP
    const otpRecord = await OtpCode.findOne({
      where: {
        user_id: user.id,
        code: otp,
        purpose: 'password_reset',
        used: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ password_hash });

    // Mark OTP as used
    await otpRecord.update({ used: true });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

/**
 * Get current user info
 * @route GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error while getting user info' });
  }
}; 