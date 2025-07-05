// src/components/CompetitiveEdgeTable.jsx

function CompetitiveEdgeTable() {
  // Styles for the main container
  const containerStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    overflowX: "auto", // Allows table to be scrolled horizontally on small screens
    marginTop: "2rem",
  };

  const tableStyle = {
    width: "100%",
    textAlign: "left",
    borderCollapse: "collapse",
  };

  // Styles for table cells
  const thStyle = {
    padding: "1rem",
    fontWeight: "600",
    backgroundColor: "#F9FAFB",
    borderBottom: "1px solid #E5E7EB",
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #F3F4F6",
  };

  const centerCellStyle = {
    ...tdStyle,
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  // Specific styles for icons
  const checkStyle = { color: "#22C55E" }; // green
  const limitedStyle = { color: "#F59E0B" }; // yellow
  const missingStyle = { color: "#EF4444" }; // red

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Feature</th>
            <th
              style={{
                ...thStyle,
                textAlign: "center",
                backgroundColor: "#7C4DFF",
                color: "white",
              }}
            >
              YayWay
            </th>
            <th style={{ ...thStyle, textAlign: "center" }}>Smule</th>
            <th style={{ ...thStyle, textAlign: "center" }}>WeSing</th>
            <th style={{ ...thStyle, textAlign: "center" }}>TikTok</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, fontWeight: "600" }}>
              Real-Time Multi-User Rooms
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style={missingStyle}>❌</span>
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style={missingStyle}>❌</span>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: "600" }}>
              Creator Monetization (Gifts)
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style="color: #F59E0B;">🟡</span>
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: "600" }}>
              Transparent Revenue Share
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style={missingStyle}>❌</span>
            </td>
            <td style={centerCellStyle}>
              <span style={missingStyle}>❌</span>
            </td>
            <td style={centerCellStyle}>
              <span style={missingStyle}>❌</span>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: "600" }}>
              Short-Form Video Discovery
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={centerCellStyle}>
              <span style="color: #F59E0B;">🟡</span>
            </td>
            <td style={centerCellStyle}>
              <span style="color: #F59E0B;">🟡</span>
            </td>
            <td style={centerCellStyle}>
              <span style={checkStyle}>✅</span>
            </td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: "600", borderBottom: "none" }}>
              Performance Scoring/Gamification
            </td>
            <td style={{ ...centerCellStyle, borderBottom: "none" }}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={{ ...centerCellStyle, borderBottom: "none" }}>
              <span style={missingStyle}>❌</span>
            </td>
            <td style={{ ...centerCellStyle, borderBottom: "none" }}>
              <span style={checkStyle}>✅</span>
            </td>
            <td style={{ ...centerCellStyle, borderBottom: "none" }}>
              <span style={missingStyle}>❌</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CompetitiveEdgeTable;
