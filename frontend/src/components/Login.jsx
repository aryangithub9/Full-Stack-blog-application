import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { AiFillEye, AiFillEyeInvisible, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message , setMessage] = useState(null);
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);

  const handleLogIn = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const { user } = res.data;
        setUserInfo(user);
        localStorage.setItem("userInfo", JSON.stringify(user));
        setMessage('Login successful')
        setTimeout(() => {
          navigate('/')
          
        }, 500);
        
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className='text-3xl font-medium text-black text-center mb-4'>Online journal for sharing ideas.</h1>
        <h2 className="text-3xl font-medium font-serif text-center text-gray-800">Login</h2>
        <form className="mt-6 space-y-4" onSubmit={handleLogIn}>
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="test1@gmail.com"
              
            />
            <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          </div>
          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="test1"
            />
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-purple-800 hover:bg-purple-700 rounded-sm transition text-xl"
          >
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-lg font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <span 
            className="text-black hover:underline hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;