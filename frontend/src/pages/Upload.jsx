import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await api.post('/works/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Work published successfully!");
      navigate('/');
    } catch (error) {
      alert("Upload failed. Make sure you are logged in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Share Your Creation</h2>
      <form onSubmit={handleUpload}>
        <input 
          type="text" placeholder="Title" 
          value={title} onChange={(e) => setTitle(e.target.value)} required 
        />
        <textarea 
          placeholder="Describe your process..." 
          value={description} onChange={(e) => setDescription(e.target.value)} 
        />
        <input 
          type="file" accept="image/*" 
          onChange={(e) => setFile(e.target.files[0])} required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Publish Work"}
        </button>
      </form>
    </div>
  );
}

export default Upload;