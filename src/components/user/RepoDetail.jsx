import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./repodetail.css";
import { useAuth } from "../../authContext";

const RepoDetail = () => {
    console.log("Rendering RepoDetail");
  const { reponame } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    console.log("useEffect triggered, reponame:", reponame);
    const fetchRepoDetails = async () => {
      const userId = localStorage.getItem("userId");
    //   console.log("useParams:", useParams()); // Log all params
      console.log("userId:", userId, "reponame:", reponame); // Debug log
      if (!userId) {
        setError("User ID is missing");
        setLoading(false);
        return;
      }
      if (!reponame) {
        setError("Repository name is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `http://localhost:3002/repo/${userId}/${reponame}`; // [CHANGE] Ensure case-sensitive reponame
        console.log("Fetching URL:", url); // Debug log
        const response = await axios.get(url);
        console.log("Repo details response:", response.data);
        const repoData = response.data;
        setRepo(repoData);
        setFiles(repoData.files || []);
      } catch (err) {
        console.error("Error fetching repo details: ", err);
        setError("Failed to load repository details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [reponame, navigate]);

  const renderFiles = (fileList) => {
    return fileList.map((file, index) => (
      <li key={index} className="file-item">
        {file.type === "directory" ? (
          <span className="directory-name">{file.name}/</span>
        ) : (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="file-link"
          >
            {file.name}
          </a>
        )}
      </li>
    ));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!repo) return <div className="not-found">Repository not found</div>;

  return (
    <>
      <Navbar />
      <div className="repo-detail-container">
        <h1 className="repo-detail-title">{repo.name}</h1>
        <div className="repo-detail-content">
          
          
         
          {files.length > 0 ? (
            <ul className="file-list">
              {renderFiles(files)}
            </ul>
          ) : (
            <p className="no-files">No files available in this repository.</p>
          )}
        </div>
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
       
      </div>
    </>
  );
};

export default RepoDetail;