// Dummy service - in real implementation, this would integrate with Spotify API
const moodGenreMapping = {
    'happy': ['pop', 'electronic'],
    'energetic': ['rock', 'hip-hop'],
    'relaxed': ['classical', 'jazz'],
    'romantic': ['pop', 'indie'],
    'melancholic': ['indie', 'rock'],
    'workout': ['electronic', 'hip-hop']
  };
  
  export const generatePlaylist = async (mood, genres) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Filter genres based on mood
    const recommendedGenres = genres.length > 0 
      ? genres 
      : moodGenreMapping[mood] || [];
  
    // Dummy playlist generation
    const playlist = [
      {
        id: '1',
        title: 'Mood Mix',
        tracks: [
          { 
            id: 't1', 
            name: 'Happy Vibes', 
            artist: 'Mood Makers',
            genre: recommendedGenres[0] || 'pop'
          },
          { 
            id: 't2', 
            name: 'Energy Boost', 
            artist: 'Power Band',
            genre: recommendedGenres[1] || 'rock'
          }
        ]
      }
    ];
  
    return playlist;
  };
  
  export const savePlaylist = async (playlist) => {
    // In a real app, this would save to backend/MongoDB
    console.log('Saving playlist:', playlist);
    return { success: true, playlistId: 'saved-playlist-id' };
  };