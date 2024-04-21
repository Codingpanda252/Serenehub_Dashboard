import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import "./Feed.css";

const CLIENT_ID = "e2b8838f9e75428194e409feaa5c8468";
const CLIENT_SECRET = "cd572f0f694046088e25b5a6d5a5e4d3";
const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export default function Feed({ play }) {
  const [moodStatus, setMoodStatus] = useState("");
  const [suggestedSongs, setSuggestedSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMoodStatus(getRandomMood());
  }, []);

  const fetchRecommendationsWithRetry = async () => {
    setLoading(true);
    let retries = 0;

    const fetchWithRetry = async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
          "https://api.spotify.com/v1/recommendations",
          {
            params: {
              seed_genres: moodStatus === "Over the Top" ? "pop" : "chill",
              limit: 5,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSuggestedSongs(response.data.tracks);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429 && retries < MAX_RETRIES) {
          const delay = Math.pow(2, retries) * BASE_DELAY;
          setTimeout(() => {
            fetchWithRetry();
          }, delay);
          retries++;
        } else {
          console.error("Error fetching Spotify recommendations:", error);
          setLoading(false);
        }
      }
    };

    fetchWithRetry();
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
    const moods = ["Over the Top", "Bit Down", "Stressed", "Mood Swings"];
    return moods[Math.floor(Math.random() * moods.length)];
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
      </div>
      <div className="suggestions-container">
        {loading && <p>Loading...</p>}
        {suggestedSongs.map((song, index) => (
          <div className="suggestion" key={index}>
            <img
              src={song.album.images[0]?.url || "/placeholder-image.jpg"}
              alt={song.name}
              className="suggestion-image"
            />
            <div
              className="play-icon-container"
              onClick={() => play(song)}
            >
              <FaPlayCircle className="play-icon" />
            </div>
            <p>{song.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMoodColor(mood) {
  switch (mood) {
    case "Over the Top":
      return "over-the-top";
    case "Bit Down":
      return "bit-down";
    case "Stressed":
      return "stressed";
    case "Mood Swings":
      return "mood-swings";
    default:
      return "";
  }
}
