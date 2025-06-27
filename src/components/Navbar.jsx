import React from "react";
import { Link, useParams, useLocation } from "react-router-dom"; // [CHANGE] Added useLocation and corrected imports
import "./navbar.css";

const Navbar = () => {
  const { reponame } = useParams() || {}; // [CHANGE] Safely use useParams with fallback
  const location = useLocation(); // [CHANGE] Added useLocation to get current pathname

  // [CHANGE] Updated getTitle function to use location.pathname and handle username
  const getTitle = () => {
    // Fallback to "username"
    const path = location.pathname;

    if (path === "/profile") {
      return "Profile";
    } else if (path.startsWith("/profile/") && reponame) {
      return `${reponame}`;
    } else if (path === "/create") {
      return "New Repository";
    } else {
      return "Dashboard";
    }
  };

  return (
    <nav>
      <Link to="/">
        <div className="logo-container">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>{getTitle()}</h3>
        </div>
      </Link>
      <div className="nav-right">
        <input className = "searchBox" type="text" placeholder=" Type | / | to search " />
        <Link to="/create"><button className="icon-btn createRepo">+</button></Link> 
        <button className="icon-btn issues">
          <div className="outercircle">
            <div className="innercircle">
              <div className="dot"></div> {/* Added for the small center dot */}
            </div>
          </div>
        </button>
        <Link to = "/profile"><button className="icon-btn profile"></button></Link>
       
      </div>
    </nav>
  );
};

export default Navbar;