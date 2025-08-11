import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { videoId } = useParams();
  const apiRoute = "https://fearless-wisdom-production.up.railway.app";

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`${apiRoute}/api/video/${videoId}`);
        setVideoDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load video details');
        setLoading(false);
        console.error('Error loading video:', err);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!videoDetails) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <iframe
          src={videoDetails.embedUrl}
          title={videoDetails.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-info">
        <h1>{videoDetails.title}</h1>
        <h2>{videoDetails.channelName}</h2>
        <p className="description">{videoDetails.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;