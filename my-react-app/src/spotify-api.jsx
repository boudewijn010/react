import PropTypes from "prop-types";

const SpotifyIntegration = ({ playlists }) => {
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

SpotifyIntegration.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default SpotifyIntegration;
