import React, { useState, useEffect } from "react";
import APIKit from "../../spotify";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./favorites.css";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await APIKit.get("me/tracks");
        setLikedSongs(response.data.items);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await APIKit.get("me/playlists");
        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchLikedSongs();
    fetchPlaylists();
  }, []);

  const navigate = useNavigate();

  const playSong = (songId) => {
    navigate("/player", { state: { id: songId } });
  };

  const playPlaylist = (playlistId) => {
    navigate("/player", { state: { id: playlistId } });
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        <h2>Liked Songs</h2>
        <div className="song-list">
          {likedSongs.length > 0 ? (
            likedSongs.map((song) => (
              <div
                key={song.track.id}
                className="song-card"
                onClick={() => playSong(song.track.id)}
              >
                <img
                  src={song.track.album.images[0].url}
                  className="song-image"
                  alt="Song Art"
                />
                <p className="song-title">{song.track.name}</p>
                <p className="song-artist">
                  {song.track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <div className="play-icon">
                  <IconContext.Provider
                    value={{ size: "50px", color: "#E99D72" }}
                  >
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </div>
              </div>
            ))
          ) : (
            <p>No liked songs</p>
          )}
        </div>

        <h2>Frequently Listened</h2>
        <div className="playlist-list">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="playlist-card"
                onClick={() => playPlaylist(playlist.id)}
              >
                <img
                  src={playlist.images[0]?.url}
                  className="playlist-image"
                  alt="Playlist Cover"
                />
                <p className="playlist-title">{playlist.name}</p>
                <p className="playlist-owner">by {playlist.owner.display_name}</p>
                <div className="play-icon">
                  <IconContext.Provider
                    value={{ size: "50px", color: "#E99D72" }}
                  >
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </div>
              </div>
            ))
          ) : (
            <p>No playlists available</p>
          )}
        </div>
      </div>
    </div>
  );
}
