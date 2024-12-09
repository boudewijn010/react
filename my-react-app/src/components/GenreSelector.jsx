import { useState } from 'react';
import PropTypes from 'prop-types';

const genres = [
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'hip-hop', label: 'Hip Hop' },
  { id: 'electronic', label: 'Electronic' },
  { id: 'classical', label: 'Klassiek' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'indie', label: 'Indie' },
  { id: 'latin', label: 'Latin' }
];

const GenreSelector = ({ onGenreSelect }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreToggle = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(genre => genre !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(newSelectedGenres);
    onGenreSelect(newSelectedGenres);
  };

  return (
    <div className="genre-selector">
      <h2>Selecteer Genres</h2>
      <div className="genre-grid">
        {genres.map((genre) => (
          <button 
            key={genre.id}
            className={`genre-button ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
            onClick={() => handleGenreToggle(genre.id)}
          >
            {genre.label}
          </button>
        ))}
      </div>
    </div>
  );
};
GenreSelector.propTypes = {
  onGenreSelect: PropTypes.func.isRequired,
};

export default GenreSelector;