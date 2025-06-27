import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
import "./HeatMapProfile.css"; // Ensure this CSS file exists

const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }
  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(2025); // Default to current year

  useEffect(() => {
    const fetchRepositoryActivity = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user logged in. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/repo/user/${userId}`);
        console.log("Full API Response:", response); // Debug full response
        console.log("API Response Data:", response.data); // Debug response.data
        let repositories = response.data;

        // Handle different response structures
        if (typeof repositories === "object" && !Array.isArray(repositories)) {
          console.warn("Response is not an array, attempting to extract:", repositories);
          repositories = repositories.repositories || repositories.data || repositories.results || [];
          if (!Array.isArray(repositories)) {
            console.error("No valid array found in response:", repositories);
            repositories = [];
          }
        } else if (!Array.isArray(repositories)) {
          console.error("Unexpected response format, treating as empty:", repositories);
          repositories = [];
        }

        // Aggregate activity by date for the selected year using updatedAt
        const activityMap = {};
        const startDate = new Date(`${selectedYear}-01-01`);
        const endDate = new Date(`${selectedYear}-12-31`);
        repositories.forEach((repo) => {
          if (repo && repo.updatedAt) {
            const date = new Date(repo.updatedAt);
            if (!isNaN(date.getTime())) {
              if (date >= startDate && date <= endDate) {
                const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
                activityMap[dateStr] = (activityMap[dateStr] || 0) + 1; // Count updates
              }
            }
          }
        });

        // Convert to heat map format
        const data = Object.keys(activityMap).map((date) => ({
          date,
          count: activityMap[date],
        }));
        console.log("Activity Data:", data); // Debug the activity data

        setActivityData(data);
        const maxCount = Math.max(...data.map((d) => d.count), 1); // Ensure at least 1 for color scaling
        setPanelColors(getPanelColors(maxCount));
      } catch (err) {
        console.error("Error fetching repository activity:", err);
        setError("Failed to load activity data. Please try again later.");
        // Fallback to simulated data for the selected year
        const simulatedData = generateSimulatedActivity(new Date(`${selectedYear}-01-01`), new Date(`${selectedYear}-12-31`));
        setActivityData(simulatedData);
        const maxCount = Math.max(...simulatedData.map((d) => d.count), 1);
        setPanelColors(getPanelColors(maxCount));
      } finally {
        setLoading(false);
      }
    };

    fetchRepositoryActivity();
  }, [selectedYear]);

  // Simulated activity function (used as fallback)
  const generateSimulatedActivity = (startDate, endDate) => {
    const data = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      let count = dayOfWeek >= 1 && dayOfWeek <= 5 ? Math.floor(Math.random() * 3) : 0; // More activity on Mon-Fri
      if (Math.random() < 0.1) count += Math.floor(Math.random() * 5); // 10% chance of a spike
      if (count > 0) {
        data.push({
          date: currentDate.toISOString().split("T")[0],
          count,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  if (loading) {
    return <div className="heat-map-container">Loading...</div>;
  }

  if (error) {
    return <div className="heat-map-container">Error: {error}</div>;
  }

  return (
    <div className="heat-map-wrapper">
      {/* Sidebar for Year Selection */}
      <div className="year-sidebar">
        <h4>Select Year</h4>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          {/* Add more years as needed */}
        </select>
      </div>

      {/* Heat Map Container */}
      <div className="heat-map-container">
        <h4>Recent Contributions - {selectedYear}</h4>
        <HeatMap
          className="HeatMapProfile"
          style={{ width: "100%", height: "auto", color: "white" }} // Ensure full width
          value={activityData}
          weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]} // Vertical labels for Mon, Wed, Fri only
          startDate={new Date(`${selectedYear}-01-01`)}
          endDate={new Date(`${selectedYear}-12-31`)}
          rectSize={12} // Smaller rects to fit more days horizontally
          space={2} // Reduced space to fit more days
          rectProps={{
            rx: 2,
          }}
          panelColors={panelColors}
          legendCellSize={0} // Remove default bottom color legend
        />
      </div>
    </div>
  );
};

export default HeatMapProfile;