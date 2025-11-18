import React, { useState, useEffect } from "react";

const API_ENDPOINT =
  "https://pu4jh5g2fqmimsh6uykanud6iu0cjrdu.lambda-url.us-east-1.on.aws/";

const MigrationDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINT);

        if (!response.ok) {
          const errorDetails = await response
            .json()
            .catch(() => ({ error: `HTTP Status ${response.status}` }));
          throw new Error(
            `Failed to fetch: ${errorDetails.error || "Unknown error"}`,
          );
        }

        const result = await response.json();
        setData(result.rows);
      } catch (err) {
        setError(err.message);
        console.error("Migration Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading migration data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", border: "1px solid red" }}>
        Error loading data: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "20px", color: "orange" }}>
        Data structure is invalid or empty.
      </div>
    );
  }

  const filteredRowObject = { ...data };
  const KEYS_TO_REMOVE = ["Visa type", "May", "Jun"];
  KEYS_TO_REMOVE.forEach((key) => {
    delete filteredRowObject[key];
  });
  const entries = Object.entries(filteredRowObject);

  return (
    <div style={{ padding: "5px", overflow: "auto" }}>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {entries.map(([key, value]) => (
          <li
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              fontSize: "1em",
              borderBottom: "1px dotted #e0e0e0",
            }}
          >
            <span style={{ fontWeight: "600", color: "#333" }}>{key}:</span>
            <span style={{ color: "#007bff" }}>
              {value === "-" ? "0" : value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MigrationDashboard;
