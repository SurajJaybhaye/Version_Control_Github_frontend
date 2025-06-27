import React, { useEffect, useState } from "react";
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./Heatmap";
import Repo from "./Repo";
import { useAuth } from "../../authContext";


const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
 

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      // console.log(localStorage);

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/userProfile/${userId}`
          );
          // console.log(response);
          setUserDetails(response.data);
          localStorage.setItem("username", fetchUserDetails.username);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  // Define handleTabChange function
  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
    console.log("Switching to tab:", newTab);
  };

  return (
    <>
      <Navbar />
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item
          aria-current={tab === "overview" ? "page" : undefined}
          onClick={() => handleTabChange("overview")}
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: tab === "overview" ? "white" : "whitesmoke",
            fontSize: "larger",
            "&:hover": {
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          aria-current={tab === "repositories" ? "page" : undefined}
          onClick={() => handleTabChange("repositories")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: tab === "repositories" ? "white" : "whitesmoke",
            fontSize: "larger",
            "&:hover": {
              color: "white",
            },
          }}
        >
          Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);

          window.location.href = "/auth";
        }}
        style={{ position: "fixed", bottom: "50px", right: "50px" }}
        id="logout"
      >
        Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image"></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          {tab === "overview" ? (
            <HeatMapProfile />
          ) : tab === "repositories" ? (
            <Repo /> // Render the Repo component for the "repositories" tab
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Profile;
