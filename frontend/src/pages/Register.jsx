import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      alert("Registration successful! Now please login.");
      navigate('/login');
    } catch (error) {
      alert("Error: " + JSON.stringify(error.response?.data?.detail));
    }
  };

  return (
    <div className="auth-container">
      <h2>Join Crafty Portal</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Public Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;