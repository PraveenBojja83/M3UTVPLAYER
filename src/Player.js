import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

function Player({ src }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!src) {
      video.src = "";
      return;
    }

    console.log('Loading video source:', src);

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: true,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, playing...');
        video.play().catch(err => console.error('Play error:', err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', event, data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src;
      video.play().catch(err => console.error('Play error:', err));
    } else {
      console.error('HLS not supported');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        controlsList="nofullscreen"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}

export default Player;