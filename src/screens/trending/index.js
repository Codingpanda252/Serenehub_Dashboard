import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./Trending.css";

const Trending = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
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

        // Extract artists from the response and remove duplicates
        const trendingArtists = [
          ...new Map(
            responseTrending.data?.albums?.items
              ?.flatMap((album) => album.artists)
              ?.map((artist) => [artist.id, artist])
          ).values(),
        ];

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

            return {
              ...artist,
              imageUrl: artistDetails.data.images[0]?.url,
              popularity: artistDetails.data.popularity,
              genres: artistDetails.data.genres,
              topTracks: topTracks.data.tracks,
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

  const handlePlayButtonClick = (track) => {
    navigate("/player", { state: { track } });
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setTopTracks(artist.topTracks);
  };

  return (
    <div className="trending-container">
      <h1 className="page-title">Trending Artists</h1>
      {error && <div>Error: {error}</div>}
      <div className="artist-scroll-container">
        <div className="artist-container">
          {artists.map((artist, index) => (
            <div
              key={index}
              className="artist-item"
              onClick={() => handleArtistClick(artist)}
            >
              <img
                className="artist-image"
                src={artist.imageUrl}
                alt={artist.name}
              />
              <div className="artist-overlay">
                <div className="artist-details">
                  <h2 className="artist-name">{artist.name}</h2>
                  <p className="artist-popularity">
                    Popularity: {artist.popularity}
                  </p>
                  <p className="artist-genres">
                    Genres: {artist.genres.join(", ")}
                  </p>
                </div>
                {artist.topTracks && artist.topTracks.length > 0 && (
                  <button
                    className="play-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayButtonClick(artist.topTracks[0]);
                    }}
                  >
                    <IconContext.Provider
                      value={{ size: "20px", color: "#E99D72" }}
                    >
                      <AiFillPlayCircle />
                    </IconContext.Provider>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedArtist && (
        <div
          className="top-tracks-overlay"
          onClick={() => setSelectedArtist(null)}
        >
          <div className="top-tracks-container">
            <h2 className="overlay-title">
              Top Tracks of {selectedArtist.name}
            </h2>
            <div className="top-tracks">
              {topTracks.map((track, index) => (
                <div
                  key={index}
                  className="track-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayButtonClick(track);
                  }}
                >
                  <p>{track.name}</p>
                  <button className="play-button">
                    <IconContext.Provider
                      value={{ size: "20px", color: "#E99D72" }}
                    >
                      <AiFillPlayCircle />
                    </IconContext.Provider>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trending;
