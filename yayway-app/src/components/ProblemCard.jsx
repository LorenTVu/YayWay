// src/components/ProblemCard.jsx

function ProblemCard({ emoji, title, text }) {
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    padding: "1.5rem",
    textAlign: "center",
  };

  const emojiStyle = {
    fontSize: "4rem", // Larger emoji
    marginBottom: "1rem",
    lineHeight: 1,
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  };

  return (
    <div style={cardStyle}>
      <p style={emojiStyle}>{emoji}</p>
      <h3 style={titleStyle}>{title}</h3>
      <p style={{ color: "#4B5563" }}>{text}</p>
    </div>
  );
}

export default ProblemCard;
