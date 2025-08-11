// YouTube Player API reference
let player;
let playerState = -1;
let videoLoaded = false;
let videoTitle = "";
let videoDuration = 0;

// Initialize YouTube API
function initYouTubePlayer(videoId) {
  // Load the YouTube IFrame Player API code asynchronously
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Create an <iframe> (and YouTube player) after the API code downloads
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('videoFrame', {
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
  };
}

// The API will call this function when the video player is ready
function onPlayerReady(event) {
  videoLoaded = true;
  videoTitle = player.getVideoData().title;
  videoDuration = player.getDuration();
  
  // Update video title
  document.getElementById('videoTitle').textContent = videoTitle;
  
  // Update total duration
  updateTimeDisplay();
}

// The API calls this function when the player's state changes
function onPlayerStateChange(event) {
  playerState = event.data;
  
  // Update UI based on player state
  updatePlayerUI();
  
  // Start progress tracking if playing
  if (playerState === YT.PlayerState.PLAYING) {
    startProgressTracking();
  } else {
    stopProgressTracking();
  }
}

// Update UI elements based on player state
function updatePlayerUI() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  
  // Reset all classes
  statusIndicator.classList.remove('playing', 'paused', 'ended');
  
  // Update based on state
  switch (playerState) {
    case YT.PlayerState.PLAYING:
      statusIndicator.classList.add('playing');
      statusText.textContent = 'Playing';
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
      break;
    case YT.PlayerState.PAUSED:
      statusIndicator.classList.add('paused');
      statusText.textContent = 'Paused';
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
      break;
    case YT.PlayerState.ENDED:
      statusIndicator.classList.add('ended');
      statusText.textContent = 'Ended';
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
      break;
    default:
      statusText.textContent = 'Ready to Play';
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
  }
}

// Progress tracking
let progressInterval;

function startProgressTracking() {
  // Clear any existing interval
  stopProgressTracking();
  
  // Start a new interval
  progressInterval = setInterval(updateProgress, 500);
}

function stopProgressTracking() {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
}

function updateProgress() {
  if (!videoLoaded || playerState !== YT.PlayerState.PLAYING) return;
  
  const currentTime = player.getCurrentTime();
  const duration = player.getDuration();
  const progressPercent = (currentTime / duration) * 100;
  
  // Update progress bar
  document.getElementById('progressBar').style.width = `${progressPercent}%`;
  
  // Update progress handle position
  const handle = document.getElementById('progressHandle');
  handle.style.left = `${progressPercent}%`;
  
  // Update time display
  updateTimeDisplay();
  
  // Update percentage
  document.getElementById('percentageDisplay').textContent = `${Math.round(progressPercent)}%`;
}

function updateTimeDisplay() {
  if (!videoLoaded) return;
  
  const currentTime = player.getCurrentTime();
  const duration = player.getDuration();
  
  document.getElementById('timeDisplay').textContent = 
    `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// User interactions
function playVideo() {
  if (videoLoaded) {
    player.playVideo();
  }
}

function pauseVideo() {
  if (videoLoaded) {
    player.pauseVideo();
  }
}

function togglePlayPause() {
  if (!videoLoaded) return;
  
  if (playerState === YT.PlayerState.PLAYING) {
    pauseVideo();
  } else {
    playVideo();
  }
}

function seekToPosition(event) {
  if (!videoLoaded) return;
  
  const container = document.getElementById('progressContainer');
  const rect = container.getBoundingClientRect();
  const clickPosition = (event.clientX - rect.left) / rect.width;
  
  // Seek to the position
  const seekTime = clickPosition * player.getDuration();
  player.seekTo(seekTime, true);
  
  // Update UI immediately for better responsiveness
  const progressPercent = clickPosition * 100;
  document.getElementById('progressBar').style.width = `${progressPercent}%`;
  document.getElementById('progressHandle').style.left = `${progressPercent}%`;
}

function showTimePreview(event) {
  if (!videoLoaded) return;
  
  const container = document.getElementById('progressContainer');
  const tooltip = document.getElementById('timeTooltip');
  const rect = container.getBoundingClientRect();
  const hoverPosition = (event.clientX - rect.left) / rect.width;
  
  // Calculate time at hover position
  const previewTime = hoverPosition * player.getDuration();
  
  // Update tooltip
  tooltip.textContent = formatTime(previewTime);
  tooltip.style.left = `${hoverPosition * 100}%`;
  tooltip.style.display = 'block';
}

function hideTimePreview() {
  document.getElementById('timeTooltip').style.display = 'none';
}

// Export functions for React component
export { initYouTubePlayer, playVideo, pauseVideo, togglePlayPause, seekToPosition, showTimePreview, hideTimePreview };