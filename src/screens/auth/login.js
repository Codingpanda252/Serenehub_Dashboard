import React, { useState } from "react";
import { loginEndpoint } from "../../spotify";
import "./login.css";

export default function Login() {
  const [error, setError] = useState(null);

  const handleLogin = () => {
    window.location.href = loginEndpoint;
  };

  const handleSignup = () => {
    // Redirect users to Spotify signup page
    window.location.href = "https://www.spotify.com/signup/";
  };

  const handleRetry = () => {
    setError(null);
    handleLogin();
  };

  // Handle errors by displaying error message
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Check if the page was redirected from Spotify with an error
  const checkForError = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      handleError(error);
    }
  };

  // Check for errors on component mount
  useState(() => {
    checkForError();
  }, []);

  return (
    <div className="login-page">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
        alt="logo-spotify"
        className="logo"
      />
      <div className="action-buttons">
        <div className="login-btn" onClick={handleLogin}>
          LOG IN
        </div>
        <div className="signup-btn" onClick={handleSignup}>
          SIGN UP
        </div>
      </div>
      {error && (
        <div className="error-container">
          <p className="error-message">
            An error occurred: {error}
          </p>
          <button className="retry-btn" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
