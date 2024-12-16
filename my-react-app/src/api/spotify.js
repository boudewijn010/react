const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function getSpotifyToken() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to fetch Spotify token:", errorData);
    throw new Error("Failed to fetch Spotify token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchSpotifyData(endpoint) {
  const token = await getSpotifyToken();
  const response = await fetch(`${SPOTIFY_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(`Spotify API Error: ${response.status}`);
    throw new Error(`Spotify API Error: ${response.status}`);
  }

  return response.json();
}
