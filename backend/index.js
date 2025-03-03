import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Connectdb from './connectdb.js';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import Post from './models/Post.js';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
  },
});


const uploadMiddleware = multer({ storage });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
Connectdb();

app.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true }).json('ok');
});

app.post('/posts/create', uploadMiddleware.single('files'), async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      const { title, summary, content } = req.body;
      const imageUrl = req.file.path; // Cloudinary URL

      const post = new Post({
        title,
        summary,
        content,
        cover: imageUrl,
        author: info.userId,
      });

      await post.save();
      return res.status(201).json({ post });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', ['username', 'email', '_id']);
    return res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', ['username', 'email', '_id']);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/posts/update', uploadMiddleware.single('files'), async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      const { title, summary, content, id } = req.body;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newImageUrl = req.file ? req.file.path : post.cover;
      await post.updateOne({ title, summary, content, cover: newImageUrl });
      return res.status(200).json({ message: 'Post updated successfully', post });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});