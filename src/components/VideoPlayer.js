import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const videoRef = useRef(null);
  const { videoId } = useParams();
  const apiRoute = process.env.REACT_APP_API_ROUTE || "https://ytlinks-backend-production.up.railway.app";
  console.log('VideoPlayer mounted', { videoId, apiRoute });

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`${apiRoute}/api/video/${videoId}`);
        setVideoDetails(response.data);
        setLoading(false);
        const src = `${apiRoute}/api/stream/${videoId}`;
        setVideoSrc(src);
        console.log('Video src set:', src);
      } catch (err) {
        setError('Failed to load video details');
        setLoading(false);
        console.error('Error loading video:', err);
        console.log('Debug info', { videoId, apiRoute });
      }
    };
    fetchVideoDetails();
  }, [videoId, apiRoute]);

  const handleTimeUpdate = () => {
    // You can add time-based features here
    console.log('Current time:', videoRef.current?.currentTime);
  };

  console.log('Rendering VideoPlayer', { loading, error, videoDetails, videoId, apiRoute });
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
          muted
          className="video-player"
          onTimeUpdate={handleTimeUpdate}
          onError={e => {
            console.error('Video error event:', e, videoRef.current?.error);
            setError('فشل تحميل الفيديو. تأكد من أن السيرفر يعمل وأن الرابط صحيح.');
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully!');
          }}
        >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
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