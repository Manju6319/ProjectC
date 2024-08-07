import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png'


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem('uid', auth.currentUser.uid);
      navigate('/home');
    } catch (error) {
      console.log(error.code);
      if (error.code === 'auth/invalid-credential') {
        setError('Email or Password is incorrect.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div><img src={logo} alt="Company Logo" className="h-15 w-30 mr-3" /></div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          User Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm md:text-base font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm md:text-base font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Login
          </button>
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>


        </div>
      </div>
    </div>


  );
}

export default Login;
