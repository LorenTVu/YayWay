// src/components/StatCard.jsx

function StatCard({ title, value, description, projection }) {
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
  };

  const descriptionStyle = {
    color: "#4B5563",
    marginBottom: "1rem",
    flexGrow: "1", // This makes the description take up available space
  };

  const valueStyle = {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      <p style={valueStyle}>{value}</p>
      <p style={{ fontWeight: "600", color: "#6B7281" }}>{projection}</p>
    </div>
  );
}

export default StatCard;
