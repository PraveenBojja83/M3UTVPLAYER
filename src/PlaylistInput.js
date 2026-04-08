import React, { useState } from "react";

function PlaylistInput({ onAdd }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAdd(url);
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <label>Playlist URL:</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter M3U or JSON link"
        style={{ width: "60%", margin: "10px" }}
      />
      <button type="submit">Add Playlist</button>
    </form>
  );
}

export default PlaylistInput;