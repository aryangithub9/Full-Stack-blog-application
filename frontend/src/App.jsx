import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import { UserContextProvider } from './UserContext';
import PostDetails from './components/PostDetails';
import EditPost from './components/EditPost';
import Footer from './components/Footer';

function App() {
  const user1 = localStorage.getItem('userInfo');
       console.log(user1?user1:'no user');
  return (
    <UserContextProvider>
      <Header />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
      <Footer />
    </UserContextProvider>
  );
}

export default App;
