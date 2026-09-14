const router = require('express').Router();
const Blog = require('../models/Blog');

// 1. CREATE A NEW BLOG POST
router.post('/create', async (req, res) => {
  try {
    const { title, content, username } = req.body;

    const newPost = new Blog({
      title,
      content,
      username
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Blog post created successfully!",
      post: savedPost
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET ALL BLOG POSTS
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find();

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET ONE BLOG POST BY ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: "Blog post not found!"
      });
    }

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;