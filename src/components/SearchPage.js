import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../logo.svg';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
        const apiRoute="https://ytlinks-backend-production.up.railway.app";
        

    try {
      const response = await axios.get(`${apiRoute}/api/youtube_search?keyword=${encodeURIComponent(keyword)}`);
         setVideos(response.data);
    } catch (err) {
      setError('Failed to fetch YouTube search results. Please try again.');
      console.error('Error fetching YouTube search results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    // Extract video ID from URL
    const url = new URL(video.url);
    const videoId = url.searchParams.get('v');
    
    // Store video data in sessionStorage for detail page
    sessionStorage.setItem('selectedVideo', JSON.stringify(video));
    
    // Navigate to detail page
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="search-container">
      <img src={logo} alt="Logo" className="app-logo" />
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search YouTube videos..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>
      
      {loading && (
  <div className="skeleton-container">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="skeleton-card"></div>
    ))}
  </div>
)}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && videos.length > 0 && (
        <div className="results-container">
          {videos.map((video, index) => (
            <div 
              key={index} 
              className="video-card" 
              onClick={() => handleVideoClick(video)}
            >
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta-info">
                <div className="video-meta-item">
                  <FontAwesomeIcon icon={faUser} className="meta-icon" />
                  <span>{video.channel}</span>
                </div>
                <div className="video-meta-item">
                  <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                  <span>{video.uploadDate}</span>
                </div>
                <div className="video-meta-item">
                  <FontAwesomeIcon icon={faEye} className="meta-icon" />
                  <span>{video.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;