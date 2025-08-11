import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const { videoId } = useParams();
  const apiRoute = "https://ytlinks-backend-production.up.railway.app";
  

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`${apiRoute}/api/video/${videoId}`);
        setVideoDetails(response.data);
        setLoading(false);

        // Set up video source after getting details
        if (videoRef.current) {
          videoRef.current.src = `${apiRoute}/api/stream/${videoId}`;
          videoRef.current.load();
        }
      } catch (err) {
        setError('Failed to load video details');
        setLoading(false);
        console.error('Error loading video:', err);
      }
    };

    fetchVideoDetails();
  }, [videoId, apiRoute]);

  const handleTimeUpdate = () => {
    // You can add time-based features here
    console.log('Current time:', videoRef.current?.currentTime);
  };

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
        <video
          ref={videoRef}
          controls
          autoPlay
          className="video-player"
          onTimeUpdate={handleTimeUpdate}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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