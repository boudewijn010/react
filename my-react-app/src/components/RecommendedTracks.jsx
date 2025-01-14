import PropTypes from "prop-types";

const RecommendedTracks = ({ recommendedTracks }) => {
  return (
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
  );
};

RecommendedTracks.propTypes = {
  recommendedTracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      albumCover: PropTypes.string,
      name: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecommendedTracks;
