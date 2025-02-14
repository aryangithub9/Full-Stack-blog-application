import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts`);
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);  
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 md:p-20">
    {
      posts.length > 0 && posts.map(post => (
        <Card key={post._id} {...post} /> 
      ))
    }
  </div>
</div>

  )
}  
export default Home;

