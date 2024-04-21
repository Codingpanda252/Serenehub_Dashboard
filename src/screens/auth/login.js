import React, { useState, useEffect } from "react";
import { loginEndpoint } from "../../spotify";
import "./login.css";

const Login = () => {
  const [error, setError] = useState(null);

  const handleLogin = () => {
    window.location.href = loginEndpoint;
  };

  const handleSignup = () => {
    window.location.href = "https://www.spotify.com/signup/";
  };

  const handleRetry = () => {
    setError(null);
    handleLogin();
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const checkForError = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    checkForError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
    <div className="login-page">
      <h1 className="auth-heading">SereneHub</h1>
      <p className="tagline">Your Journey to Emotional Wellness Starts Here</p>
      <h2 className="auth-connect">Connect your Spotify Account to get started</h2>
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

export default Login;
