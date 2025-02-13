import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/posts');
      setPosts(res.data.posts);
      console.log(res.data.posts)
    } catch (error) {
      console.error(error);  
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 md:p-20">
      {
        posts.length > 0 && posts.map(post => (
          <Card key={post._id} {...post} /> 
        ))
      }
    </div>
  );
}  
export default Home;

