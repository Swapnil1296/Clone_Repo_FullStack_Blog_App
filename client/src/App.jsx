import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SingUp from "./pages/SingUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivatRoute from "./components/OnlyAdminPrivatRoute";
import CreatePost from "./components/CreatePost";
import FooterComp from "./components/Footer";
import UpdatePost from "./components/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

import SessionExpirationMonitor from "./utils/SessionExpirationMonitor";
import OtpInput from "./pages/OtpInput";
import Reset from "./pages/ResetPass";
import OnlyResetePrivateRoute from "./components/OnlyRestePrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <SessionExpirationMonitor />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SingUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/search" element={<Search />} />
        {/* <Route element={<OnlyResetePrivateRoute />}> */}
        <Route path="/otp-input" element={<OtpInput />} />
        <Route path="/reset" element={<Reset />} />
        {/* </Route> */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivatRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <FooterComp />
    </BrowserRouter>
  );
};

export default App;
