import React, { useState } from "react";
import MoodSelector from "./components/MoodSelector";
import GenreSelector from "./components/GenreSelector";
import { generatePlaylist, savePlaylist } from "./services/playlistService";
import SpotifyIntegration from "./spotify-api";

function App() {
  const [mood, setMood] = useState(null);
  const [genres, setGenres] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const generatedPlaylist = await generatePlaylist(mood, genres);
    setPlaylist(generatedPlaylist);
    setIsLoading(false);
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
      <SpotifyIntegration playlists={playlist ? [playlist] : []} />
    </div>
  );
}

const CLIENT_ID = "ef913ac181c545858684acbc79de38f2";
const REDIRECT_URI = "http://localhost:5173/";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=playlist-read-private`;

<a href={AUTH_URL} className="primary-button">
  Login with Spotify
</a>;

export default App;
