import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

import DashSideBar from "./../components/DashSideBar";
import DashProfile from "./../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComment";
import DashboardComp from "../components/DashboardComp";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:min-w-56">
        <DashSideBar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPost />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
};

export default Dashboard;
