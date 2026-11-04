const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../data/inMemoryStore');
const { sendUserRegistrationEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'utsavmitra_super_secret_jwt_key_2026_festive';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user', phone, city, organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = store.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const validRole = ['user', 'organizer'].includes(role) ? role : 'user';

    const newUser = store.createUser({
      name,
      email,
      password: hashedPassword,
      role: validRole,
      phone: phone || '+91 98765 43210',
      city: city || 'Jaipur',
      organization: organization || (role === 'organizer' ? `${name}'s Events` : '')
    });

    store.logAction(newUser, 'USER_REGISTERED', 'USER', newUser._id, `Registered as ${newUser.role}`, req);

    // Send automated SendGrid welcome & account verification email
    sendUserRegistrationEmail({ user: newUser }).catch(err => {
      console.warn('[Registration Email Dispatch Warning]:', err.message);
    });

    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Verification email dispatched.',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = store.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by the administrator.' });
    }

    // Update last login
    store.updateUser(user._id, { lastLogin: new Date().toISOString() });
    store.logAction(user, 'USER_LOGIN', 'USER', user._id, `Logged in successfully as ${user.role}`, req);

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    return res.status(200).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, organization, avatar } = req.body;
    const updated = store.updateUser(req.user._id, {
      name: name || req.user.name,
      phone: phone || req.user.phone,
      city: city || req.user.city,
      organization: organization !== undefined ? organization : req.user.organization,
      avatar: avatar || req.user.avatar
    });

    store.logAction(req.user, 'PROFILE_UPDATED', 'USER', req.user._id, 'Updated profile details', req);

    const { password: _, ...userWithoutPassword } = updated;
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// Demo quick-switcher: Allows switching role / logging into any persona in 1 click
exports.quickSwitchPersona = async (req, res) => {
  try {
    const { role } = req.body;
    const users = store.getUsers();
    let targetUser = users.find(u => u.role === role);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: `No demo account found for role ${role}` });
    }

    const token = generateToken(targetUser);
    const { password: _, ...userWithoutPassword } = targetUser;

    return res.status(200).json({
      success: true,
      message: `Switched into ${role.toUpperCase()} mode as ${targetUser.name}`,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to switch demo persona.' });
  }
};

// Resend verification / welcome email for any registered email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = store.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered user found with this email address.' });
    }

    await sendUserRegistrationEmail({ user });

    return res.status(200).json({
      success: true,
      message: `Verification and welcome email dispatched to ${user.email}! Check your inbox and spam folder.`
    });
  } catch (error) {
    console.error('resendVerificationEmail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to dispatch verification email.' });
  }
};

