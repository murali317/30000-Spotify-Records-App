import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import SpotifyTable from './components/SpotifyTable';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage.tsx'; 

type Track = Record<string, string>;

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Papa.parse('/spotify_tracks.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setTracks(results.data as Track[]);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Spotify Tracks Table Management</h1>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div className="w-full max-w-6xl bg-white rounded shadow p-6">
          <SpotifyTable tracks={tracks} setTracks={setTracks} />
        </div>
      )}
    </div>
  );
}

export default App;