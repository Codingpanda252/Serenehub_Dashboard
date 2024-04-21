import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./Trending.css";

const Trending = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingArtists = async () => {
      try {
        // Fetch access token from Spotify API using client credentials flow
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          null,
          {
            params: {
              grant_type: "client_credentials",
              client_id: "e2b8838f9e75428194e409feaa5c8468",
              client_secret: "cd572f0f694046088e25b5a6d5a5e4d3",
            },
          }
        );

        const accessToken = response.data.access_token;

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        // Fetch trending artists data from Spotify API
        const responseTrending = await axios.get(
          "https://api.spotify.com/v1/browse/new-releases",
          config
        );

        // Extract artists from the response
        const trendingArtists =
          responseTrending.data?.albums?.items?.flatMap(
            (album) => album.artists
          );

        // Fetch additional details for each artist
        const artistsWithDetails = await Promise.all(
          trendingArtists.map(async (artist) => {
            const artistDetails = await axios.get(
              `https://api.spotify.com/v1/artists/${artist.id}`,
              config
            );
            const topTracks = await axios.get(
              `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`,
              config
            );
            const playableTrack = topTracks.data.tracks[0]; // Get the first track as playable example

            return {
              ...artist,
              imageUrl: artistDetails.data.images[0]?.url,
              popularity: artistDetails.data.popularity,
              genres: artistDetails.data.genres,
              playableTrack,
            };
          })
        );

        setArtists(artistsWithDetails);
      } catch (error) {
        setError("Error fetching trending artists: " + error.message);
      }
    };

    fetchTrendingArtists();
  }, []);

  const handlePlayButtonClick = (id) => {
    navigate("/player", { state: { id: id } });
  };

  return (
    <div className="trending-container">
      <h1>Trending Artists</h1>
      {error && <div>Error: {error}</div>}
      <div className="artist-scroll-container">
        <div className="artist-container">
          {artists.map((artist, index) => (
            <div key={index} className="artist-item">
              <div className="artist-details">
                <img
                  className="artist-image"
                  src={artist.imageUrl}
                  alt={artist.name}
                />
                <div className="artist-info">
                  <h2 className="artist-name">{artist.name}</h2>
                  <p className="artist-popularity">
                    Popularity: {artist.popularity}
                  </p>
                  <p className="artist-genres">
                    Genres: {artist.genres.join(", ")}
                  </p>
                </div>
              </div>
              {artist.playableTrack && (
                <button
                  className="play-button"
                  onClick={() => handlePlayButtonClick(artist.playableTrack.id)}
                >
                  <IconContext.Provider
                    value={{ size: "30px", color: "#E99D72" }}
                  >
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
