import { useState } from 'react';
import MoodSelector from './components/MoodSelector';
import GenreSelector from './components/GenreSelector';
import { generatePlaylist, savePlaylist } from './services/playlistService';

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
      alert('Selecteer eerst een stemming!');
      return;
    }
    setIsLoading(true);
    const generatedPlaylist = await generatePlaylist(mood, genres);
    setPlaylist(generatedPlaylist);
    setIsLoading(false);
  };

  const handleSavePlaylist = async () => {
    if (!playlist) {
      alert('Genereer eerst een afspeellijst!');
      return;
    }
    setIsLoading(true);
    const result = await savePlaylist(playlist);
    setIsLoading(false);
    if (result.success) {
      alert('Afspeellijst opgeslagen!');
    } else {
      alert('Er is iets misgegaan bij het opslaan van de afspeellijst.');
    }
  };

  return (
    <div className="app">
      <MoodSelector onMoodSelect={handleMoodSelect} />
      <GenreSelector onGenreSelect={handleGenreSelect} />
      <button onClick={handleGeneratePlaylist} disabled={isLoading}>
        {isLoading ? 'Afspeellijst genereren...' : 'Genereer Afspeellijst'}
      </button>
      {playlist && (
        <div className="playlist">
          <h2>Gegenereerde Afspeellijst</h2>
          <ul>
            {playlist[0].tracks.map(track => (
              <li key={track.id}>{track.name} - {track.artist} ({track.genre})</li>
            ))}
          </ul>
          <button onClick={handleSavePlaylist} disabled={isLoading}>
            {isLoading ? 'Opslaan...' : 'Afspeellijst Opslaan'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;