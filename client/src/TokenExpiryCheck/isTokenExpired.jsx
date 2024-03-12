import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom"; // Use appropriate routing library

// Function to check if the token is expired
// Function to retrieve the token from cookies
const getTokenFromCookies = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");

    if (name === "access_token") {
      // Replace 'yourTokenCookieName' with the actual name of your token cookie
      return value;
    }
  }

  return null;
}; // Return

const isTokenExpired = () => {
  const token = getTokenFromCookies();
  console.log("token", token);

  if (!token) {
    return true; // Token doesn't exist
  }

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.exp) {
      return true; // Token is invalid or doesn't contain expiration information
    }

    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    return decodedToken.exp < currentTime;
  } catch (error) {
    // Token decoding failed (expired or invalid)
    return true;
  }
};

const TokenExpirationChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired()) {
      navigate("/login"); // Adjust the route based on your routes
    }
  }, [navigate]);

  return children;
};

export default TokenExpirationChecker;
