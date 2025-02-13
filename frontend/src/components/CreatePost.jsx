import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const navigate = useNavigate();

  async function createNewPost(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('files', files);

    try {
      const response = await axios.post('http://localhost:8000/posts/create', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Post Created Successfully');
        navigate('/');
      } else {
        alert('Failed to Create Post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the post');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={createNewPost}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create a New Post</h2>

        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Post Title Here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          onChange={(e) => setSummary(e.target.value)}
          type="text"
          placeholder="Summary"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          onChange={(e) => setFiles(e.target.files[0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          className="bg-white rounded-md border border-gray-300 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
