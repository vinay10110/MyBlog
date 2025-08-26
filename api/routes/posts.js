const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const router = express.Router();

const secret = process.env.secret;

// Create post
router.post('/', async (req, res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const { id } = jwt.decode(toker);
  jwt.verify(toker, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content, fileData } = req.body;
   
    const newPostMessage = new Post({ title, summary, content, fileData, author: id });
    try {
      await newPostMessage.save();
      res.status(201).json(newPostMessage);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

// Update post
router.put('/', async (req, res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const person = jwt.decode(toker);
  jwt.verify(toker, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content, fileData } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(person.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    const updatedPost = await Post.findByIdAndUpdate(id, {
      title,
      summary,
      content,
      fileData
    }); 
    res.json(updatedPost);
  });
});

// Delete post
router.delete('/', async (req, res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  const person = jwt.decode(toker);
  jwt.verify(toker, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(person.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.deleteOne();
    res.json({ message: "deleted successfully" });
  });
});

// Get all posts
router.get('/', async (req, res) => { 
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

module.exports = router;
