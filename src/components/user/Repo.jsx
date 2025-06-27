import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./repo.css";
import { useAuth } from "../../authContext";
import {  RepoIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";

const Repo = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetailsAndRepos = async () => {
      const userId = localStorage.getItem("userId");
      console.log("Fetching user details and repos for userId:", userId);

      if (userId) {
        try {
          const userResponse = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          console.log("User details response:", userResponse.data);
          const fetchedUserDetails = userResponse.data;
          setUserDetails(fetchedUserDetails);
          const username = fetchedUserDetails.username;
          console.log("Storing username in Repo.jsx:", username);
          localStorage.setItem("username", username);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }

        try {
          const repoResponse = await axios.get(`http://localhost:3002/repo/user/${userId}`);
          console.log("Repo response:", repoResponse.data);
          const fetchedRepos = repoResponse.data.repositories || [];
          setRepos(fetchedRepos);
          setSearchResults(fetchedRepos);
        } catch (err) {
          console.error("Error fetching repos: ", err);
        }
      } else {
        console.log("No userId found in localStorage");
      }
    };
    fetchUserDetailsAndRepos();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repos); // Show all repos when search is empty
    } else {
      const filteredRepo = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo); // Filter repos based on search query
    }
  }, [searchQuery, repos]);
  const handleRepoClick = (repoName) => {
    // Replace spaces with hyphens and encode for URL safety
    // const safeRepoName = repoName.toLowerCase().replace(/ /g, "-");
    navigate(`/profile/${repoName}`);
  };

  return (
    <>
      <div className="repo-container">
        
        <div className="repo-list-section">
         <div className="search-nav">
          <div id="search-2">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
          </div>
          <div className="search-new">
                      <Link to = "/create"><button className="new-repo-button">
                  <RepoIcon size={16} style={{ marginRight: "8px" }} /> New
                </button> </Link>
                    </div>
          </div>
          
          <div className="repo-list">
            {searchResults.length > 0 ? (
              searchResults.map((repo) => (
                <div key={repo._id} className="repo-card">
                  <h3 className="repo-name" onClick={() => handleRepoClick(repo.name)} >{repo.name || "Unnamed Repo"}</h3>
                  
                  <p className="repo-description">
                    {repo.description || " "}
                  </p>
                  <p className="repo-updated">
                    Updated: {new Date(repo.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-repos">No repositories found.</p>
            )}
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Repo;