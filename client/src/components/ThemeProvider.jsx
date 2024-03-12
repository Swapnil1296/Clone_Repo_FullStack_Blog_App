import React from "react";
import { useSelector } from "react-redux";

export const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-whit text-gray-700 dark:text-gray-200 dark:bg-[rgb(29,28,29)] min-h-screen">
        {children}
      </div>
    </div>
  );
};
