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
        setData(result);
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

  if (!data || !data.columns || !data.rows) {
    return (
      <div style={{ padding: "20px", color: "orange" }}>
        Data structure is invalid or empty.
      </div>
    );
  }

  const renderTable = () => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {data.columns.map((col, index) => (
            <th
              key={index}
              style={{
                padding: "5px",
                backgroundColor: "#f2f2f2",
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => {
          const isTotalRow = row["Visa type"] === "Total to date";
          const rowStyle = isTotalRow
            ? { fontWeight: "bold", backgroundColor: "#fff3e0" }
            : {};

          return (
            <tr key={rowIndex} style={rowStyle}>
              {data.columns.map((colName, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    textAlign: "center",
                  }}
                >
                  {row[colName]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return <div>{renderTable()}</div>;
};

export default MigrationDashboard;
