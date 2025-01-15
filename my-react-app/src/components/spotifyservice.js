export const fetchRecommendedTracks = async (token, seedTracks) => {
  const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=10`;
  console.log("Fetching recommended tracks from URL:", url); // Add logging
  console.log("Seed tracks:", seedTracks); // Log seed tracks

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // Try to parse error response
      console.error("Error data:", errorData);
      throw new Error(`Error fetching recommended tracks: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
