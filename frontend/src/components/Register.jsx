import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible, AiOutlineMail, AiOutlineUser, AiOutlineLock } from 'react-icons/ai';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message , setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        { email, username, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setMessage('Registration Successful');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Register  failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h1 className=' text-2xl md:text-3xl font-medium text-black text-center mb-4'>Online journal for sharing ideas.</h1>
        <h2 className="text-xl md:text-3xl font-medium font-serif text-center text-gray-800">Register</h2>
        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          </div>
          {/* Username Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
          </div>
          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Register
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-lg font-semibold ${message.includes('Successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <span
            className="text-black hover:underline hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
