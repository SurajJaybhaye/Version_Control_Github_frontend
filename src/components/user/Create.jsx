import React, { useState, useEffect } from "react";
import { UnderlineNav } from "@primer/react";
import { RepoIcon } from "@primer/octicons-react";
import axios from "axios";
import "./create.css";
import Navbar from "../Navbar";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

const Create = () => {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [issues, setIssues] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          setOwner(response.data.username || userId); // Use username or userId as owner
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("Failed to load user details. Please log in again.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No user logged in. Please log in.");
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Repository name is required and cannot be empty!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No user logged in. Please log in.");
      return;
    }
    setLoading(true);
    const data = {
      owner: userId,
      name: name.trim(),
      description,
      visibility,
      issues: issues.split(",").map((issue) => issue.trim()).filter((issue) => issue), // Filter empty issues
      content,
      
    };

    try {
      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create repository");
      }

      setSuccess(result.message);
      setName("");
      setDescription("");
      setIssues("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }finally {
      setLoading(false); // Reset loading state
    }
  };

  if (loading) {
    return <div className="create-page">Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <ErrorBoundary>
      <div className="create-page">
        
        <div className="create-container">
          <h1>Create a new repository</h1>
          <p className="subtext">
            A repository contains all project files, including the revision history. Already have a
            project repository elsewhere? <a href="#import">Import a repository</a>.
          </p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit} className="repo-form">
            <div className="form-group">
              <label>Owner *</label>
              <div className="owner-select">
                <span>{owner || "Loading user..."}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Repository name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., expert-octo-guide"
                required
              />
              <p className="hint">Great repository names are short and memorable. Need inspiration? How about expert-octo-guide?</p>
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description..."
              />
            </div>
            <div className="form-group">
              <label>Visibility</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                  />{" "}
                  Public
                </label>
                <p className="radio-hint">Anyone on the internet can see this repository. You choose who can commit.</p>
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                  />{" "}
                  Private
                </label>
                <p className="radio-hint">You choose who can see and commit to this repository.</p>
              </div>
            </div>
            <div className="form-group">
              <label>Initial Issues (comma-separated, optional)</label>
              <input
                type="text"
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
                placeholder="e.g., bug1, feature2"
              />
              <p className="hint">Enter issues separated by commas (e.g., bug1, feature2).</p>
            </div>
            <div className="form-group">
              <label>Initial Content (optional)</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add initial content..."
              />
            </div>
            
            <button type="submit" className="create-button" disabled={loading}>
              <RepoIcon size={16} style={{ marginRight: "8px" }} /> Create repository
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
    </>
  );
};

export default Create;