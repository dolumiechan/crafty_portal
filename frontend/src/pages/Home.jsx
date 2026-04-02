import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/works/')
      .then((response) => setWorks(response.data))
      .catch((error) => console.error('Error fetching works:', error));
  }, []);

  return (
    <div className="page-home">
      <h1 className="page-home__title">Crafty Portal</h1>
      <div className="work-grid">
        {works.map((work) => (
          <article
            key={work.id}
            className="work-card"
            onClick={() => navigate(`/works/${work.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/works/${work.id}`);
              }
            }}
          >
            {work.image_path && (
              <img
                src={`http://127.0.0.1:8000/${work.image_path}`}
                alt=""
                className="work-card__img"
              />
            )}
            <h3>{work.title}</h3>
            <p>{work.description}</p>
            <p>Posted by: {work.author_username}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home;
