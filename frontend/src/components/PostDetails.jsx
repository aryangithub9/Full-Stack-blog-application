import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

function PostDetails() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const { UserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/posts/${id}`);
        setPost(res.data.post);
        
        // Check if current user is the author
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser && res.data.post.author) {
          setIsAuthor(storedUser.id === res.data.post.author._id);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/posts/${id}`);
        alert("Post deleted successfully!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    }
  };

  if (!post) {
    return <div className="text-center font-semibold text-2xl">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
      <img
        src={`http://localhost:8000/${post.cover}`}
        alt={post.title}
        className="w-full h-64 object-contain rounded-lg mb-4"
      />
      <p className="text-gray-700 mb-4">{post.summary}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
      <p className="text-gray-950 mt-4 font-semibold text-center">
        Created By: {post.author?.username} ({post.author?.email})
      </p>
      <p className="text-gray-950 font-semibold text-center">
        Created At: {new Date(post.createdAt).toLocaleString()}
      </p>

     
      {isAuthor && (
        <div className="text-center mt-6 flex justify-center gap-4">
          <Link
            to={`/edit/${post._id}`}
            className="bg-slate-700 text-white py-2 px-4 rounded-sm hover:bg-slate-900 transition"
          >
            Edit Blog
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-sm hover:bg-red-800 transition"
          >
            Delete Blog
          </button>
        </div>
      )}
    </div>
  );
}

export default PostDetails;