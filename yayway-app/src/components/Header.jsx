// src/components/Header.jsx

function Header() {
  const headerStyle = {
    background: "linear-gradient(135deg, #7c4dff 0%, #f472b6 100%)",
    color: "white",
    textAlign: "center",
    padding: "5rem 1.5rem",
  };

  return (
    <header style={headerStyle}>
      <h1
        style={{ fontSize: "3.75rem", fontWeight: "900", marginBottom: "1rem" }}
      >
        YayWay
      </h1>
      <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
        The Future of Social Karaoke is Here.
      </p>
      <p
        style={{
          maxWidth: "56rem",
          margin: "1rem auto 0",
          fontSize: "1.125rem",
        }}
      >
        A next-generation platform for live, synchronized karaoke rooms, turning
        passive scrolling into active, shared musical experiences.
      </p>
    </header>
  );
}

export default Header;
