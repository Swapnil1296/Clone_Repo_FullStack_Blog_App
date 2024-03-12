import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// this fucntion is used to scroll the page on the top if the user navigates to some other page
// by clicking the link tag.

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
