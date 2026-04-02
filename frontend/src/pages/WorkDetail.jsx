import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUserId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    api
      .get(`/works/${id}`)
      .then((res) => {
        setWork(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching work:', err);
        setLoading(false);
      });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/works/${id}/comments`, {
        text: commentText,
      });

      setWork({
        ...work,
        comments: [...work.comments, response.data],
      });

      setCommentText('');
    } catch (err) {
      alert('Please login to leave a comment!');
      console.error('Comment error:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this work? This cannot be undone.')) {
      try {
        await api.delete(`/works/${id}`);
        alert('Work deleted.');
        navigate('/');
      } catch (err) {
        alert('Error deleting work: ' + (err.response?.data?.detail || 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div className="state-message">Loading...</div>;
  }
  if (!work) {
    return <div className="state-message">Work not found!</div>;
  }

  return (
    <div className="work-detail">
      <div className="work-detail__media">
        <img src={`http://127.0.0.1:8000/${work.image_path}`} alt={work.title} width="150px" height="400px"/>
      </div>

      <div className="work-detail__head">
        <h1>{work.title}</h1>
        {Number(work.user_id) === currentUserId && (
          <button type="button" className="btn btn--ghost" onClick={handleDelete}>
            Delete Post
          </button>
        )}
      </div>

      <p className="work-detail__meta">
        Created by <strong>{work.author_username || `User #${work.user_id}`}</strong>
      </p>

      <hr className="work-detail__divider" />

      <p className="work-detail__body">{work.description || 'No description provided.'}</p>

      <section style={{ marginTop: '2.5rem' }}>
        <h2 className="work-detail__section-title">
          Feedback ({work.comments ? work.comments.length : 0})
        </h2>

        {localStorage.getItem('token') ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Share your thoughts on this creative work..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button type="submit" className="btn btn--primary">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="notice">
            Please <Link to="/login">login</Link> to join the discussion.
          </p>
        )}

        <div className="comment-list">
          {work.comments && work.comments.length > 0 ? (
            work.comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <p>{comment.text}</p>
                <small>
                  Posted by {comment.author_username || `User #${comment.user_id}`} •{' '}
                  {new Date(comment.created_at).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p className="state-message" style={{ marginTop: '1rem' }}>
              No comments yet. Be the first to share your experience!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default WorkDetail;
