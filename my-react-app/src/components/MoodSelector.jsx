import { useState } from "react";
import PropTypes from "prop-types";

const moods = [
  { id: "happy", label: "Blij", icon: "😄" },
  { id: "energetic", label: "Energiek", icon: "🏃" },
  { id: "relaxed", label: "Ontspannen", icon: "😌" },
  { id: "romantic", label: "Romantisch", icon: "❤️" },
  { id: "melancholic", label: "Melancholisch", icon: "😔" },
  { id: "workout", label: "Work-out", icon: "💪" },
];

const MoodSelector = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="mood-selector">
      <h2>Hoe voel je je vandaag?</h2>
      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`mood-button ${
              selectedMood === mood.id ? "selected" : ""
            }`}
            onClick={() => handleMoodClick(mood.id)}
          >
            <span className="mood-icon">{mood.icon}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
MoodSelector.propTypes = {
  onMoodSelect: PropTypes.func.isRequired,
};

export default MoodSelector;
