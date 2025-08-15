import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const CustomPlayer = ({ videoId, videoTitle, apiRoute }) => {
  const [videoDetails, setVideoDetails] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!videoId || !apiRoute) return;

      setLoading(true);
      setError(null);

      try {
        // Get video details
        console.log("Fetching video details for:", videoId);
        const detailsResponse = await axios.get(
          `${apiRoute}/api/video/${videoId}`
        );
        setVideoDetails(detailsResponse.data);
        console.log("Video details loaded:", detailsResponse.data);

        // Get stream URL
        console.log("Fetching stream URL for:", videoId);
        const streamResponse = await axios.get(
          `${apiRoute}/api/stream-url/${videoId}`
        );
        setStreamUrl(streamResponse.data.streamUrl);
        console.log("Stream URL loaded:", streamResponse.data);
      } catch (err) {
        console.error("Error loading video data:", err);
        setError("Failed to load video. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, apiRoute]);

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setError(
      "Video playback failed. The video might be unavailable or restricted."
    );
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  if (loading) {
    return (
      <div className="custom-player-container">
        <div className="loading-spinner">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-player-container">
        <div className="error-message">{error}</div>
        {/* Fallback: show YouTube embed */}
        <div className="fallback-player">
          <p>Try watching on YouTube instead:</p>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-player-container">
      {streamUrl && (
        <video
          ref={videoRef}
          className="custom-video-player"
          controls
          preload="metadata"
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          poster={videoDetails?.thumbnail}
          style={{ width: "100%", height: "auto", maxHeight: "500px" }}
        >
          <source src={streamUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {videoDetails && (
        <div className="video-info">
          <h2>{videoDetails.title}</h2>
          <p>
            <strong>Channel:</strong> {videoDetails.channelName}
          </p>
          <p>
            <strong>Duration:</strong> {videoDetails.duration}
          </p>
          <p>
            <strong>Views:</strong> {videoDetails.views}
          </p>
          {videoDetails.description && (
            <div className="video-description">
              <h3>Description:</h3>
              <p>{videoDetails.description.substring(0, 500)}...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomPlayer;
