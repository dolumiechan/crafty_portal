import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    // 1. Get the token
    const response = await api.post('/auth/login', formData);
    const token = response.data.access_token;
    
    // 2. Save token FIRST
    localStorage.setItem('token', token);

    // 3. Get User ID using the token we just got
    const userRes = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    localStorage.setItem('userId', userRes.data.id);

    alert("Logged in successfully!");
    navigate('/');
    window.location.reload(); 
  } catch (error) {
    console.error(error);
    alert("Login failed. Check your credentials.");
  }
};


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default Login;