import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
