export const fetchRecommendedTracks = async (token, seedTrack) => {
  const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack}&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching recommended tracks: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
