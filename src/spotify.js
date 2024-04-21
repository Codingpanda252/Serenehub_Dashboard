import axios from "axios";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "e2b8838f9e75428194e409feaa5c8468";
const redirectUri = "http://localhost:3000"; // Replace with your actual redirect URI
const scopes = ["user-library-read", "playlist-read-private"];

export const loginEndpoint = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;


const apiClient = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const setClientToken = (token) => {
  apiClient.interceptors.request.use(async function (config) {
    config.headers.Authorization = "Bearer " + token;
    return config;
  });
};

export const getTrendingPlaylists = async () => {
  try {
    const response = await apiClient.get("browse/categories/toplists/playlists");
    return response.data.items;
  } catch (error) {
    throw new Error("Error fetching trending playlists: " + error.message);
  }
};

export const getTrendingArtists = async () => {
  try {
    const response = await apiClient.get("browse/new-releases");
    return response.data.albums.items.map((album) => album.artists[0]);
  } catch (error) {
    throw new Error("Error fetching trending artists: " + error.message);
  }
};

export default apiClient;
