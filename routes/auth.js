const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;
  if (!username || !password || !email || !role) {
    return res.status(400).send('Please provide all required fields: username, password, email, and role');
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    role, 
  });

  try {
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('role');

  console.log('User:', user);
  console.log('Role:', user.role);
  console.log('Permissions:', user.role.permissions);

  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).send('Invalid Credentials');
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/roles', authenticate, authorize('view_reports'), async (req, res) => {
  const { name, username, permissions } = req.body;

  if (!name || !username || !permissions || !Array.isArray(permissions)) {
    return res.status(400).send('Name, username, and permissions are required, and permissions must be an array');
  }

  const role = new Role({ name, username, permissions });

  try {
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    console.error('Error saving role:', err);
    return res.status(500).send(`Error saving role: ${err.message}`);
  }
});

module.exports = router;
