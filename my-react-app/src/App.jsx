import { useState, useEffect } from "react";
import MoodSelector from "./components/MoodSelector";
import GenreSelector from "./components/GenreSelector";
import {
  generatePlaylist,
  savePlaylist,
  getRecommendedTracks,
} from "./services/playlistService";
import SpotifyIntegration from "./spotify-api";
import SpotifyWebApi from "spotify-web-api-js";
import { fetchSpotifyData } from "./api/spotify";

const spotifyApi = new SpotifyWebApi();

function App() {
  const [mood, setMood] = useState(null);
  const [genres, setGenres] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [previousPlaylists, setPreviousPlaylists] = useState([]);
  const [token, setToken] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public`;

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
      fetchFeaturedPlaylists();
      fetchPreviousPlaylists();
      fetchRecommendedTracks();
    } else {
      window.location.href = AUTH_URL; // Redirect to Spotify login
    }
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      if (response.items) {
        setSpotifyPlaylists(response.items);
      } else {
        console.error("No playlists found in API response.");
      }
    } catch (error) {
      if (error.status === 401) {
        alert("Token is expired or invalid. Please login again.");
        window.localStorage.removeItem("token");
        setToken(null);
        window.location.href = AUTH_URL; // Redirect to Spotify login
      } else {
        console.error("Error fetching playlists:", error);
      }
    }
  };

  const fetchFeaturedPlaylists = async () => {
    try {
      const playlists = await fetchSpotifyData("/browse/featured-playlists");
      setFeaturedPlaylists(playlists);
    } catch (error) {
      if (error.status === 401) {
        alert("Token is expired or invalid. Please login again.");
        window.localStorage.removeItem("token");
        setToken(null);
        window.location.href = AUTH_URL; // Redirect to Spotify login
      } else {
        console.error("Error fetching Spotify data:", error);
      }
    }
  };

  const fetchPreviousPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists");
      if (!response.ok) {
        throw new Error("Failed to fetch previous playlists");
      }
      const data = await response.json();
      setPreviousPlaylists(data);
    } catch (error) {
      console.error("Error fetching previous playlists:", error);
    }
  };

  const fetchRecommendedTracks = async () => {
    try {
      const tracks = await getRecommendedTracks();
      console.log("Recommended tracks:", tracks);
      setRecommendedTracks(tracks);
    } catch (error) {
      console.error("Error fetching recommended tracks:", error);
    }
  };

  const handleMoodSelect = (selectedMood) => {
    console.log("Mood selected in App:", selectedMood); // Add logging
    setMood(selectedMood);
  };

  const handleGenreSelect = (selectedGenres) => {
    setGenres(
      Array.isArray(selectedGenres) ? selectedGenres : [selectedGenres]
    );
  };

  const handleGeneratePlaylist = async () => {
    if (!mood) {
      alert("Selecteer eerst een stemming!");
      return;
    }
    setIsLoading(true);
    try {
      const generatedPlaylist = await generatePlaylist(mood, genres);
      console.log("Generated playlist:", generatedPlaylist); // Add logging
      setPlaylist({
        ...generatedPlaylist,
        title: `${mood} - ${genres.join(", ")}`,
      });
    } catch (error) {
      console.error("Error generating playlist:", error);
      alert("Er is iets misgegaan bij het genereren van de afspeellijst.");
      setPlaylist(null); // Ensure playlist is set to null on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlaylist = () => {
    setIsLoading(true);
    // Voeg hier je logica toe om de afspeellijst op te slaan
    savePlaylist(playlist)
      .then(() => {
        setIsLoading(false);
        alert("Afspeellijst opgeslagen!");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error saving playlist:", error);
      });
  };

  return (
    <div className="app">
      {!token ? (
        <a href={AUTH_URL} className="primary-button">
          Login with Spotify
        </a>
      ) : (
        <>
          <MoodSelector onMoodSelect={handleMoodSelect} />
          <GenreSelector
            onGenreSelect={handleGenreSelect}
            onGenerate={handleGeneratePlaylist}
          />
          <button
            onClick={handleGeneratePlaylist}
            disabled={isLoading}
            className="primary-button"
            id="knop"
          >
            {isLoading ? "Afspeellijst genereren..." : "Genereer Afspeellijst"}
          </button>
          {playlist ? (
            <div className="playlist">
              <h2>{playlist.title}</h2> {/* Display playlist title */}
              <ul>
                {playlist.tracks && playlist.tracks.length > 0 ? (
                  playlist.tracks.map((track) => (
                    <li key={track.id} className="track-item">
                      <img
                        src={track.albumCover}
                        alt={track.name}
                        className="track-album-cover"
                        style={{ width: "100px", height: "100px" }}
                      />
                      <div className="track-info">
                        {track.name} - {track.artist} ({track.genre})
                      </div>
                    </li>
                  ))
                ) : (
                  <li>Geen nummers gevonden in de afspeellijst.</li>
                )}
              </ul>
              <button
                onClick={handleSavePlaylist}
                disabled={isLoading}
                className="primary-button"
              >
                {isLoading ? "Opslaan..." : "Afspeellijst Opslaan"}
              </button>
            </div>
          ) : (
            <p>Geen afspeellijst gegenereerd.</p>
          )}
          <SpotifyIntegration playlists={spotifyPlaylists} />
          <div>
            <h1>Spotify Featured Playlists</h1>
            {featuredPlaylists ? (
              <ul>
                {featuredPlaylists.playlists.items.map((playlist) => (
                  <li key={playlist.id}>{playlist.name}</li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div>
            <h1>Recommended Tracks</h1>
            {recommendedTracks.length > 0 ? (
              <ul>
                {recommendedTracks.map((track) => (
                  <li key={track.id} className="track-item">
                    <img
                      src={track.albumCover}
                      alt={track.name}
                      className="track-album-cover"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div className="track-info">
                      {track.name} - {track.artist}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recommended tracks found.</p>
            )}
          </div>
          <div>
            <h1>Previous Playlists</h1>
            {previousPlaylists.length > 0 ? (
              <ul>
                {previousPlaylists.map((playlist) => (
                  <li key={playlist.playlistId}>{playlist.title}</li>
                ))}
              </ul>
            ) : (
              <p>No previous playlists found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
