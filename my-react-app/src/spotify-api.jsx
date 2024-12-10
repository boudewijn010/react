import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const SpotifyIntegration = () => {
  const [playlists, setPlaylists] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let _token = window.localStorage.getItem("token");

    if (!_token && hash) {
      _token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", _token);
      window.location.hash = ""; // Clear hash
    }

    if (_token) {
      setToken(_token);
      spotifyApi.setAccessToken(_token);
      fetchPlaylists();
    }
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      setPlaylists(response.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  return (
    <div className="playlist-section">
      <h2>Your Spotify Playlists</h2>
      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="playlist-card-image"
            />
            <div className="playlist-card-content">
              <h3 className="playlist-card-title">{playlist.name}</h3>
              <p className="playlist-card-description">
                {playlist.description || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyIntegration;
