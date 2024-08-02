const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5500;
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(logger);
app.use(express.static('public'));

// Template engine
app.set('view engine', 'ejs');

// Data
const users = require('./data/users');
const posts = require('./data/posts');
const comments = require('./data/comments');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = users.find(u => u.id === parseInt(id));
    if (user) {
        Object.assign(user, updates);
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        res.json(deletedUser);
    } else {
        res.status(404).send('User not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});