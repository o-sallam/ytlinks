import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomPlayer from './player/CustomPlayer';

const VideoDetail = () => {
  const [video, setVideo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Retrieve video data from sessionStorage
    const storedVideo = sessionStorage.getItem('selectedVideo');
    if (storedVideo) {
      setVideo(JSON.parse(storedVideo));
    }
  }, [id]);

  if (!video) {
    return (
      <div className="video-detail-container">
        <Link to="/" className="back-button">Back to Search</Link>
        <div className="error">Video information not found. Please go back and try again.</div>
      </div>
    );
  }

  // Extract video ID from URL
  const getVideoId = (url) => {
    try {
      const videoUrl = new URL(url);
      return videoUrl.searchParams.get('v');
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  };

  const videoId = getVideoId(video.url);

  return (
    <div className="video-detail-container">
      <Link to="/" className="back-button">Back to Search</Link>
      
      <h1 className="video-detail-title">{video.title}</h1>
      
      {videoId ? (
        <CustomPlayer videoId={videoId} videoTitle={video.title} />
      ) : (
        <div className="error">Could not extract video ID from URL.</div>
      )}
      
      <div className="video-detail-info">
        <p><strong>Channel:</strong> {video.channel}</p>
        <p><strong>Views:</strong> {video.views}</p>
        <p><strong>Upload Date:</strong> {video.uploadDate}</p>
        
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="video-detail-link"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
};

export default VideoDetail;