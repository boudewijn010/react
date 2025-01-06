import React, { useState } from "react";
import PropTypes from "prop-types";

const genres = [
  { id: "pop", label: "Pop", icon: "🎤" },
  { id: "rock", label: "Rock", icon: "🎸" },
  { id: "jazz", label: "Jazz", icon: "🎷" },
  { id: "classical", label: "Classical", icon: "🎻" },
  { id: "hiphop", label: "Hip-Hop", icon: "🎧" },
  { id: "electronic", label: "Electronic", icon: "🎹" },
];

const GenreSelector = ({ onGenreSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    onGenreSelect(genre);
  };

  return (
    <div className="genre-selector">
      <h2>Welk genre wil je luisteren?</h2>
      <div className="genre-grid">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-button ${
              selectedGenre === genre.id ? "selected" : ""
            }`}
            onClick={() => handleGenreClick(genre.id)}
          >
            <span className="genre-icon">{genre.icon}</span>
            <span className="genre-label">{genre.label}</span>
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
