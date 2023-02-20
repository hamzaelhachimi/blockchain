const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user');
const Blockchain = require('./blockchain');
const ejs = require('ejs');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use the bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for registration and login pages
app.get('/register', (req, res) => {
  res.render('registration', { errorMessage: null });
});
app.get('/', (req, res) => {
  res.render('index', { errorMessage: null });
});

app.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

const blockchain = new Blockchain();

app.use(bodyParser.json());

// Register a new user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  if (blockchain.findUserByEmail(email)) {
    return res.status(400).send({ error: 'User already exists' });
  }

  // Hash the password
  const passwordHash = bcrypt.hashSync(password, 10);

  // Create a new user and add it to the blockchain
  const user = new User(name, email, passwordHash);
  blockchain.addUser(user);

  // Generate a JWT token for the user
  const token = jwt.sign({ email }, 'secret');

  res.send({ user: user.toJSON(), token });
});

// Log in an existing user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = blockchain.findUserByEmail(email);
  if (!user) {
    return res.status(401).send({ error: 'Invalid email or password' });
  }

  // Check if the password is correct
  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).send({ error: 'Invalid email or password' });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ email }, 'secret');

  // Save the token to the user object
  user.generateToken();

  res.send({ user: user.toJSON(), token });
});

// Verify a user's JWT token
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    // Find the user by email
    const user = blockchain.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    // Save the user object to the request for later use
    req.user = user;
    next();
  });
}

// Get the current user's data
app.get('/user', authenticate, (req, res) => {
  res.send(req.user.toJSON());
});


  const port = 3000;

  
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});