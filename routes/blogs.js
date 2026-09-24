const router = require('express').Router();
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');

// 1. CREATE A NEW BLOG POST - PRIVATE
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Blog({
      title,
      content,
      username: req.user.username,
      userId: req.user.userId
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Blog post created successfully!",
      post: savedPost
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 2. GET ALL BLOG POSTS - PRIVATE
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Blog.find({
      userId: req.user.userId
    });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 3. GET ONE BLOG POST BY ID - PRIVATE
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

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

// 4. UPDATE A BLOG POST - PRIVATE
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedPost = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      req.body,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        error: "Blog post not found!"
      });
    }

    res.status(200).json({
      message: "Blog post updated successfully!",
      post: updatedPost
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 5. DELETE A BLOG POST - PRIVATE
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPost = await Blog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!deletedPost) {
      return res.status(404).json({
        error: "Blog post not found!"
      });
    }

    res.status(200).json({
      message: "Blog post deleted successfully!",
      post: deletedPost
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;