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

app.get('/posts', (req, res) => {
    const { userId } = req.query;
    if (userId) {
        const filteredPosts = posts.filter(p => p.userId === parseInt(userId));
        res.json(filteredPosts);
    } else {
        res.json(posts);
    }
});

app.post('/posts', (req, res) => {
    const newPost = { id: posts.length + 1, ...req.body };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.patch('/posts/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const post = posts.find(p => p.id === parseInt(id));
    if (post) {
        Object.assign(post, updates);
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        const deletedPost = posts.splice(index, 1);
        res.json(deletedPost);
    } else {
        res.status(404).send('Post not found');
    }
});

app.get('/comments', (req, res) => {
    const { postId } = req.query;
    if (postId) {
        const filteredComments = comments.filter(c => c.postId === parseInt(postId));
        res.json(filteredComments);
    } else {
        res.json(comments);
    }
});

app.post('/comments', (req, res) => {
    const newComment = { id: comments.length + 1, ...req.body };
    comments.push(newComment);
    res.status(201).json(newComment);
});

app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const comment = comments.find(c => c.id === parseInt(id));
    if (comment) {
        Object.assign(comment, updates);
        res.json(comment);
    } else {
        res.status(404).send('Comment not found');
    }
});

app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        const deletedComment = comments.splice(index, 1);
        res.json(deletedComment);
    } else {
        res.status(404).send('Comment not found');
    }
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});