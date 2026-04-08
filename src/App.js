import React, { useState, useEffect, useRef, useCallback } from "react";
import PlaylistInput from "./PlaylistInput";
import ChannelList from "./ChannelList";
import Player from "./Player";
import { parseM3U } from "./utils/m3uParser";
import "./layout.css";

function App() {
  const [channels, setChannels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  const handleAddPlaylist = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    const parsedChannels = parseM3U(text).filter((ch) => ch.url);
    setChannels(parsedChannels);
  };

  const selectChannelByIndex = useCallback((index) => {
    if (index >= 0 && index < channels.length) {
      setCurrentIndex(index);
      setCurrentChannel(channels[index]);
    }
  }, [channels]);

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < channels.length) {
      setCurrentChannel(channels[currentIndex]);
    }
  }, [currentIndex, channels]);

  const handleFullScreenToggle = async () => {
    if (!document.fullscreenElement && fullscreenRef.current) {
      try {
        await fullscreenRef.current.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen request failed:", err);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        setSidebarOpen((prev) => !prev);
      }

      if (channels.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % channels.length;
        selectChannelByIndex(nextIndex);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? channels.length - 1 : currentIndex - 1;
        selectChannelByIndex(prevIndex);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [channels.length, currentIndex, channels, selectChannelByIndex]);

  const handleFullscreenClick = () => {
    if (isFullscreen) {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div>
      <div className="header">
        <span>📺 M3U IPTV Player</span>
        <span className="header-now-playing">
          {currentChannel ? `🎬 Now Playing: ${currentChannel.name}` : ""}
        </span>
      </div>

      <div ref={fullscreenRef} className={`fullscreen-wrapper ${isFullscreen ? "active" : ""}`}>
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <PlaylistInput onAdd={handleAddPlaylist} />
          <ChannelList channels={channels} onSelect={selectChannelByIndex} />
        </div>

        <div className="main-content">
          {currentChannel ? (
            <div className="player-container" onClick={isFullscreen ? handleFullscreenClick : undefined}>
              <div className="fullscreen-controls">
                <button
                  className="fullscreen-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullScreenToggle();
                  }}
                >
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
              </div>
              <Player src={currentChannel.url} />
            </div>
          ) : (
            <p>Select click on left arrow key to enter URL.</p>
          )}
        </div>
      </div>

      <div className="footer">© 2026 Bojja tekhub</div>
    </div>
  );
}

export default App;
