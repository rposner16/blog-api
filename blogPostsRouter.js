
// Setting stuff up
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();

BlogPosts.create('First post', 'Some content', 'Rebecca');
BlogPosts.create('Another post', 'Some more content', 'Rebecca');

// Get request
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

// Post
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const msg = `Missing \`${field}\` in request body.`;
            console.error(msg);
            return res.status(400).send(msg);
        }
    }

    const thePost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(thePost);
});

// Put/update
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const msg = `Missing \`${field}\` in request body.`;
            console.error(msg);
            return res.status(400).send(msg);
        }
    }
    
    if (req.params.id !== req.body.id) {
        const msg = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match.`;
        console.error(msg);
        return res.status(400).send(msg);
    }

    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });
    res.status(204).end();
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;