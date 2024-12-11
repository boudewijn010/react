import { useState, useEffect } from "react";
import MoodSelector from "./components/MoodSelector";
import GenreSelector from "./components/GenreSelector";
import { generatePlaylist, savePlaylist } from "./services/playlistService";
import SpotifyIntegration from "./spotify-api";
import SpotifyWebApi from "spotify-web-api-js";
import { fetchSpotifyData } from "./api/spotify";

const spotifyApi = new SpotifyWebApi();

function App() {
  const [mood, setMood] = useState(null);
  const [genres, setGenres] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [token, setToken] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState(null);

  const CLIENT_ID = "ef913ac181c545858684acbc79de38f2";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=playlist-read-private`;

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
    }
  }, []);

  const fetchPlaylists = async () => {
    try {
      console.log("Fetching Spotify playlists...");
      const response = await spotifyApi.getUserPlaylists();
      if (response.items) {
        console.log("Fetched playlists:", response.items);
        setSpotifyPlaylists(response.items);
      } else {
        console.error("No playlists found in API response.");
      }
    } catch (error) {
      if (error.status === 401) {
        alert("Token is expired or invalid. Please login again.");
        window.localStorage.removeItem("token");
        setToken(null);
      } else {
        console.error("Error fetching playlists:", error);
      }
    }
  };

  const fetchFeaturedPlaylists = async () => {
    try {
      const playlists = await fetchSpotifyData("browse/featured-playlists");
      setFeaturedPlaylists(playlists);
    } catch (error) {
      if (error.status === 401) {
        alert("Token is expired or invalid. Please login again.");
        window.localStorage.removeItem("token");
        setToken(null);
      } else {
        console.error("Error fetching Spotify data:", error);
      }
    }
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleGenreSelect = (selectedGenres) => {
    setGenres(selectedGenres);
  };

  const handleGeneratePlaylist = async () => {
    if (!mood) {
      alert("Selecteer eerst een stemming!");
      return;
    }
    setIsLoading(true);
    try {
      const generatedPlaylist = await generatePlaylist(mood, genres);
      setPlaylist(generatedPlaylist);
    } catch (error) {
      console.error("Error generating playlist:", error);
      alert("Er is iets misgegaan bij het genereren van de afspeellijst.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlaylist = async () => {
    if (!playlist) {
      alert("Genereer eerst een afspeellijst!");
      return;
    }
    setIsLoading(true);
    const result = await savePlaylist(playlist);
    setIsLoading(false);
    if (result.success) {
      alert("Afspeellijst opgeslagen!");
    } else {
      alert("Er is iets misgegaan bij het opslaan van de afspeellijst.");
    }
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
          <GenreSelector onGenreSelect={handleGenreSelect} />
          <button onClick={handleGeneratePlaylist} disabled={isLoading}>
            {isLoading ? "Afspeellijst genereren..." : "Genereer Afspeellijst"}
          </button>
          {playlist && (
            <div className="playlist">
              <h2>Gegenereerde Afspeellijst</h2>
              <ul>
                {playlist.tracks.map((track) => (
                  <li key={track.id}>
                    {track.name} - {track.artist} ({track.genre})
                  </li>
                ))}
              </ul>
              <button onClick={handleSavePlaylist} disabled={isLoading}>
                {isLoading ? "Opslaan..." : "Afspeellijst Opslaan"}
              </button>
            </div>
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
        </>
      )}
      {console.log("Playlists data:", spotifyPlaylists)}
    </div>
  );
}

export default App;
