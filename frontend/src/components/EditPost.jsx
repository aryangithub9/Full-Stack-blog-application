import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`http://localhost:8000/posts/${id}`);
        if (response.data.post) {
          const { title, summary, content } = response.data.post;
          setTitle(title);
          setSummary(summary);
          setContent(content);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [id]);

  async function updatePost(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("id", id);
    
    if (files) {
      data.append("files", files);
    }
  
    try {
      const response = await axios.put("http://localhost:8000/posts/update", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        console.log(response.data);
        navigate(`/post/${id}`);
      } else {
        alert("Update failed");
        console.error("Update failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={updatePost}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Edit A Post
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Post Title Here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
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
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
