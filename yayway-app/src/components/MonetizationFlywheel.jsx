// src/components/MonetizationFlywheel.jsx

function MonetizationFlywheel() {
  // Main container for the flowchart
  const flywheelContainerStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    padding: "2rem",
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center the items horizontally
  };

  // Base style for a flowchart node (the ovals)
  const nodeStyle = {
    border: "2px solid",
    padding: "0.75rem 1.25rem",
    borderRadius: "9999px", // Creates the pill shape
    textAlign: "center",
    fontWeight: "600",
    width: "fit-content",
    maxWidth: "90%",
  };

  // Style for the down-arrow
  const arrowStyle = {
    fontSize: "1.5rem",
    margin: "1rem 0",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    width: "100%",
    maxWidth: "600px",
  };

  return (
    <div style={flywheelContainerStyle}>
      {/* Node 1 */}
      <div
        style={{
          ...nodeStyle,
          borderColor: "#7C4DFF",
          color: "#7C4DFF",
          backgroundColor: "rgba(124, 77, 255, 0.1)",
        }}
      >
        User Acquisition (Viral Clips & Influencer Marketing)
      </div>

      <div style={{ ...arrowStyle, color: "#7C4DFF" }}>▼</div>

      {/* Node 2 */}
      <div
        style={{
          ...nodeStyle,
          borderColor: "#F472B6",
          color: "#F472B6",
          backgroundColor: "rgba(244, 114, 182, 0.1)",
        }}
      >
        Engagement (Freemium Model, Points System & Gamification)
      </div>

      <div style={{ ...arrowStyle, color: "#F472B6" }}>▼</div>

      {/* Grid of 3 Monetization Methods */}
      <div style={gridStyle}>
        <div
          style={{
            ...nodeStyle,
            borderColor: "#6B7281",
            color: "#4B5563",
            backgroundColor: "#F3F4F6",
          }}
        >
          Subscriptions
        </div>
        <div
          style={{
            ...nodeStyle,
            borderColor: "#6B7281",
            color: "#4B5563",
            backgroundColor: "#F3F4F6",
          }}
        >
          Advertising
        </div>
        <div
          style={{
            ...nodeStyle,
            borderColor: "#6B7281",
            color: "#4B5563",
            backgroundColor: "#F3F4F6",
          }}
        >
          In-App Purchases
        </div>
      </div>

      <div style={{ ...arrowStyle, color: "#6B7281" }}>▼</div>

      {/* Node 3 */}
      <div
        style={{
          ...nodeStyle,
          borderColor: "#FFC107",
          color: "#B45309",
          backgroundColor: "rgba(255, 193, 7, 0.1)",
        }}
      >
        Creator Empowerment (Virtual Gifts & Revenue Sharing)
      </div>

      {/* The return loop */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>↩️</p>
        <p style={{ fontWeight: "600", color: "#4B5563", marginTop: "0.5rem" }}>
          Creators promote the platform, restarting the cycle.
        </p>
      </div>
    </div>
  );
}

export default MonetizationFlywheel;
