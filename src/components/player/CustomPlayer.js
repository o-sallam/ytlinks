import React, { useEffect, useRef, useState } from 'react';
import './css/style.css';

const CustomPlayer = ({ videoId, videoTitle }) => {
  const [playerState, setPlayerState] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState('Ready to Play');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const progressContainerRef = useRef(null);
  const timeTooltipRef = useRef(null);
  
  // Initialize YouTube Player
  useEffect(() => {
    // Load the YouTube IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Create YouTube player once API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player('videoFrame', {
        videoId: videoId,
        playerVars: {
          'modestbranding': 1,
          'rel': 0,
          'showinfo': 0,
          'controls': 0,
          'disablekb': 1,
          'fs': 0,
          'iv_load_policy': 3,
          'cc_load_policy': 0,
          'autoplay': 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
      
      playerRef.current = player;
    };
    
    // Cleanup function
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // Clean up YouTube API
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videoId]);
  
  // Player event handlers
  const onPlayerReady = (event) => {
    let tries = 0;
    function checkDuration() {
      const dur = event.target.getDuration();
      if (dur && dur > 0) {
        setDuration(dur);
      } else if (tries < 10) {
        tries++;
        setTimeout(checkDuration, 200);
      }
    }
    checkDuration();
  };
  
  const onPlayerStateChange = (event) => {
    setPlayerState(event.data);

    // Update UI based on player state
    switch (event.data) {
      case window.YT?.PlayerState?.PLAYING:
        setStatus('Playing');
        setIsPlaying(true);
        startProgressTracking();
        break;
      case window.YT?.PlayerState?.PAUSED:
        setStatus('Paused');
        setIsPlaying(false);
        stopProgressTracking();
        break;
      case window.YT?.PlayerState?.ENDED:
        setStatus('Ended');
        setIsPlaying(false);
        stopProgressTracking();
        break;
      default:
        setStatus('Ready to Play');
        setIsPlaying(false);
    }
  };
  
  // Progress tracking functions
  const startProgressTracking = () => {
    // Clear any existing interval
    stopProgressTracking();
    
    // Start a new interval
    progressIntervalRef.current = setInterval(updateProgress, 500);
  };
  
  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };
  
  const updateProgress = () => {
    if (!playerRef.current || playerState !== window.YT?.PlayerState?.PLAYING) return;
    
    const current = playerRef.current.getCurrentTime();
    const videoDuration = playerRef.current.getDuration();
    const percent = (current / videoDuration) * 100;
    
    setCurrentTime(current);
    setProgressPercent(percent);
  };
  
  // User interaction handlers
  const togglePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };
  
  const seekToPosition = (event) => {
    if (!playerRef.current) return;
    
    const container = progressContainerRef.current;
    const rect = container.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    
    // Seek to the position
    const seekTime = clickPosition * duration;
    playerRef.current.seekTo(seekTime, true);
    
    // Update UI immediately for better responsiveness
    setProgressPercent(clickPosition * 100);
  };
  
  const showTimePreview = (event) => {
    if (!playerRef.current || !duration) return;
    
    const container = progressContainerRef.current;
    const tooltip = timeTooltipRef.current;
    const rect = container.getBoundingClientRect();
    const hoverPosition = (event.clientX - rect.left) / rect.width;
    
    // Calculate time at hover position
    const previewTime = hoverPosition * duration;
    
    // Update tooltip
    tooltip.textContent = formatTime(previewTime);
    tooltip.style.left = `${hoverPosition * 100}%`;
    tooltip.style.display = 'block';
  };
  
  const hideTimePreview = () => {
    if (timeTooltipRef.current) {
      timeTooltipRef.current.style.display = 'none';
    }
  };
  
  // Helper function to format time
  const formatTime = (seconds) => {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="custom-player-container">
      <div className="video-wrapper">
        <iframe
          id="videoFrame"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&autoplay=0`}
          title={videoTitle || 'YouTube video player'}
          frameBorder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>
      
      <div className="video-tracker">
        <div className="tracker-controls-row">
          <button
            className="integrated-play-button"
            onClick={togglePlayPause}
          >
            <span id="playIcon" style={{ display: isPlaying ? 'none' : 'inline' }}>▶</span>
            <span id="pauseIcon" style={{ display: isPlaying ? 'inline' : 'none' }}>⏸</span>
          </button>
          <div
            className="progress-bar-container"
            ref={progressContainerRef}
            onMouseMove={showTimePreview}
            onMouseLeave={hideTimePreview}
            onClick={seekToPosition}
          >
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercent}%` }}
            ></div>
            <div 
              className="progress-handle" 
              style={{ left: `${progressPercent}%` }}
            ></div>
            <div className="time-tooltip" ref={timeTooltipRef}>00:00</div>
          </div>
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div className="tracker-info">
          <div className="status-section">
            <span 
              className={`status-indicator ${isPlaying ? 'playing' : window.YT && window.YT.PlayerState && playerState === window.YT.PlayerState.ENDED ? 'ended' : window.YT && window.YT.PlayerState && playerState === window.YT.PlayerState.PAUSED ? 'paused' : ''}`}
            ></span>
            <span id="statusText">{status}</span>
          </div>
          <div className="video-title">{videoTitle || 'Loading video title...'}</div>
          <div className="percentage-display">{Math.round(progressPercent)}%</div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;