import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  const handleLogIn = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8000/login',
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const { user } = res.data;
        setUserInfo(user);
        localStorage.setItem("userInfo", JSON.stringify(user));
        alert('Login Successful!');
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm" onSubmit={handleLogIn}>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>

        {/* Register link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <span 
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
