import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
import bcrypt from 'bcrypt';
import Connectdb from './connectdb.js';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'
import Post from './models/Post.js';
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());
Connectdb();


app.post('/register',async (req,res)=>{
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
})

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
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
        token,
        user: {
            email: user.email,
            username: user.username,
            id: user._id
        }
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


app.post('/posts/create',uploadMiddleware.single('files'), async(req, res) => {
  const {originalname,path}= req.file;
  const parts=originalname.split('.');
  const ext=parts[parts.length-1];
  const newpath=path+'.'+ext;
  fs.renameSync(path,newpath);
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async(err, info) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    const {title,summary,content}=req.body;
    const post = new Post({title,summary,content,cover:newpath,author:info.userId});
    await post.save();
    return res.status(201).json({post});
  });
  
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort in descending order based on creation date
      .populate('author', ['username', 'email','_id']); // Populate author field with specific properties
    return res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', ['username', 'email', '_id']);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.put(
  "/posts/update",
  uploadMiddleware.single("files"),
  async (req, res) => {
    try {
      let newpath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const ext = originalname.split(".").pop();
        newpath = `${path}.${ext}`;
        fs.renameSync(path, newpath);
      }

      const { token } = req.cookies;
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }

        const { title, summary, content, id } = req.body;
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== info.userId) {
          return res
            .status(403)
            .json({ message: "You are not authorized to update this post" });
        }

        await post.updateOne({
          title,
          summary,
          content,
          cover: newpath || post.cover, // Keep old cover if no new file is uploaded
        });

        return res
          .status(200)
          .json({ message: "Post updated successfully", post });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});