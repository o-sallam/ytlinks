import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchPage from './components/SearchPage';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/video/:videoId" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
