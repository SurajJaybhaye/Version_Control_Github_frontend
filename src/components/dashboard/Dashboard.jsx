import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import {  RepoIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";
const Dashboard = () => {

    const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    
    }
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/all`
        );
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    
    };
    fetchRepositories();
    fetchSuggestedRepositories();
}, []);

 useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <> 
    <Navbar />

    <section id="dashboard">
        <aside className="sidebar">
          <div className="sidebar-nav">
          <h3>Top Repositories</h3>
          <div>
            <Link to = "/create"><button className="new-repo-button">
        <RepoIcon size={16} style={{ marginRight: "8px" }} /> New
      </button> </Link>
          </div>
           </div>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
         
          {searchResults.map((repo) => {
            return (
              <div className="results" key={repo._id}>
                <h4>{repo.name}</h4>
                
              </div>
            );
          })}
    </aside>
    <main>
          <h2>Your Repositories</h2>
         
        </main>
    <aside  className="sidebar">
          <h3>Upcoming Events</h3>
          <ul className="events-tab">
            <li className="event">
              <p>Tech Conference - Dec 15</p>
            </li>
            <li className="event">
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li className="event">
              <p >React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
      </>
  )
};

export default Dashboard;