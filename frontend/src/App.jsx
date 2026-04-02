// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import WorkDetail from './pages/WorkDetail';

function App() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="layout">
      <nav className="layout__nav">
        <div className="layout__brand">
          <Link to="/">Crafty Portal</Link>
        </div>

        <div className="layout__links">
          <Link to="/">Home</Link>

          {token ? (
            <>
              <Link to="/upload" className="layout__cta">
                + New Post
              </Link>
              <button type="button" className="btn btn--ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn--outline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="layout__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/works/:id" element={<WorkDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
