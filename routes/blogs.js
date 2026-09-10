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

// 2. GET ALL BLOG POSTS (Optional, but great for your dashboard later!)
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;