// TokenExpiryChecker.js

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkTokenExpiry } from "../redux/user/userSlice";

const TokenExpiryChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the checkTokenExpiry action on mount
    dispatch(checkTokenExpiry());

    // Set up a periodic check, e.g., every 5 minutes
    const intervalId = setInterval(() => {
      dispatch(checkTokenExpiry());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [dispatch]);

  return <>{children}</>;
};

export default TokenExpiryChecker;
