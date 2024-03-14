import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

const OnlyResetePrivateRoute = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["recovery_token"]);
  const token = cookies["recovery_token"];
  console.log(cookies["recovery_token"]);
  return token ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default OnlyResetePrivateRoute;
