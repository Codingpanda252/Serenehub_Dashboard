import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import "./Feed.css";

const CLIENT_ID = "e2b8838f9e75428194e409feaa5c8468";
const CLIENT_SECRET = "cd572f0f694046088e25b5a6d5a5e4d3";

export default function Feed({ play }) {
  const [moodStatus, setMoodStatus] = useState("");
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [suggestedPlaylists, setSuggestedPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMoodStatus(getRandomMood());
  }, []);

  const fetchRecommendationsWithRetry = async () => {
    setLoading(true);
    setSuggestedSongs([]);
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        "https://api.spotify.com/v1/search",
        {
          params: {
            q: `genre:${getGenreForMood(moodStatus)}`,
            type: "track",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuggestedSongs(response.data.tracks.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Spotify recommendations:", error);
      setLoading(false);
    }
  };

  const fetchArtistsWithRetry = async () => {
    setLoading(true);
    setSuggestedArtists([]);
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        "https://api.spotify.com/v1/search",
        {
          params: {
            q: `genre:${getGenreForMood(moodStatus)}`,
            type: "artist",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuggestedArtists(response.data.artists.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Spotify artists:", error);
      setLoading(false);
    }
  };

  const fetchPlaylistsWithRetry = async () => {
    setLoading(true);
    setSuggestedPlaylists([]);
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        "https://api.spotify.com/v1/search",
        {
          params: {
            q: `genre:${getGenreForMood(moodStatus)}`,
            type: "playlist",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuggestedPlaylists(response.data.playlists.items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Spotify playlists:", error);
      setLoading(false);
    }
  };

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting Spotify access token:", error);
      throw error;
    }
  };

  const getRandomMood = () => {
    const moods = ["Over The Top", "Stressed", "Bit Down", "Mood Swings"];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const getGenreForMood = (mood) => {
    switch (mood) {
      case "Over The Top":
        return "pop";
      case "Stressed":
        return "punk";
      case "Bit Down":
        return "blues";
      case "Mood Swings":
        return "jazz";
      default:
        return "pop";
    }
  };

  return (
    <div className="screen-container">
      <h2>Feed</h2>
      <p className={`mood-status ${getMoodColor(moodStatus)}`}>
        Mood Status: {moodStatus}
      </p>
      <div className="button-container">
        <button className="suggest-button" onClick={fetchRecommendationsWithRetry}>
          Suggest Songs
        </button>
        <button className="suggest-button" onClick={fetchArtistsWithRetry}>
          Suggest Artists
        </button>
        <button className="suggest-button" onClick={fetchPlaylistsWithRetry}>
          Suggest Playlists
        </button>
      </div>
      <div className="suggestions-container">
        {loading && <p>Loading...</p>}
        <div className="suggestion-group">
          {suggestedSongs.length > 0 && (
            <>
              <h3>Suggested Songs</h3>
              <div className="suggestion-row">
                {suggestedSongs.map((song, index) => (
                  <div className="suggestion" key={index}>
                    <img
                      src={song.album.images[0]?.url || "/placeholder-image.jpg"}
                      alt={song.name}
                      className="suggestion-image"
                    />
                    <div className="play-icon-container" onClick={() => play(song)}>
                      <FaPlayCircle className="play-icon" />
                    </div>
                    <p>{song.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="suggestion-group">
          {suggestedArtists.length > 0 && (
            <>
              <h3>Suggested Artists</h3>
              <div className="suggestion-row">
                {suggestedArtists.map((artist, index) => (
                  <div className="suggestion" key={index}>
                    <img
                      src={artist.images[0]?.url || "/placeholder-image.jpg"}
                      alt={artist.name}
                      className="suggestion-image"
                    />
                    <div className="play-icon-container" onClick={() => play(artist)}>
                      <FaPlayCircle className="play-icon" />
                    </div>
                    <p>{artist.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="suggestion-group">
          {suggestedPlaylists.length > 0 && (
            <>
              <h3>Suggested Playlists</h3>
              <div className="suggestion-row">
                {suggestedPlaylists.map((playlist, index) => (
                  <div className="suggestion" key={index}>
                    <img
                      src={playlist.images[0]?.url || "/placeholder-image.jpg"}
                      alt={playlist.name}
                      className="suggestion-image"
                    />
                    <div className="play-icon-container" onClick={() => play(playlist)}>
                      <FaPlayCircle className="play-icon" />
                    </div>
                    <p>{playlist.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getMoodColor(mood) {
  switch (mood) {
    case "Over The Top":
      return "over-the-top"; 
    case "Stressed":
      return "stressed"; 
    case "Bit Down":
      return "bit-down"; 
    case "Mood Swings":
      return "mood-swings"; 
    default:
      return "";
  }
}
