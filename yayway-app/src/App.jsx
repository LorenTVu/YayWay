// src/App.jsx

import Header from "./components/Header.jsx";
import StatCard from "./components/StatCard.jsx";
import MarketGrowthChart from "./components/MarketGrowthChart.jsx";
import ProblemCard from "./components/ProblemCard.jsx";
import CompetitiveEdgeTable from "./components/CompetitiveEdgeTable.jsx";
import MonetizationFlywheel from "./components/MonetizationFlywheel.jsx";
import DiscoveryChart from "./components/DiscoveryChart.jsx";
import CreatorSupportChart from "./components/CreatorSupportChart.jsx";

function App() {
  const mainStyle = {
    padding: "3rem 1rem",
    backgroundColor: "#F0F2F5",
  };

  const sectionStyle = {
    maxWidth: "72rem",
    margin: "0 auto 3rem auto",
    textAlign: "center",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  };

  const separatorStyle = {
    border: 0,
    height: "1px",
    backgroundColor: "#D1D5DB",
    margin: "4rem auto",
  };

  return (
    <div>
      <Header />
      <main style={mainStyle}>
        {/* --- Market Opportunity Section --- */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700" }}>
            A Colossal Market Opportunity
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              color: "#4B5563",
            }}
          >
            YayWay is positioned at the intersection of three massive,
            high-growth markets.
          </p>
          <div style={gridStyle}>
            <StatCard
              title="Global Karaoke Market"
              value="$10B+"
              description="The foundational behavior is already a multi-billion dollar industry, rapidly shifting from venues to mobile devices."
              projection="Projected Market Size by 2032"
            />
            <StatCard
              title="Music App Ecosystem"
              value="$66B+"
              description="Fueled by the global shift to streaming and social features, this market provides the digital landscape for YayWay to thrive."
              projection="Projected Market Size by 2033"
            />
            <StatCard
              title="The Creator Economy"
              value="$480B+"
              description="The explosive growth vector. YayWay empowers music creators with tools for performance, content creation, and direct monetization."
              projection="Projected Market Size by 2027"
            />
          </div>
          <MarketGrowthChart />
        </section>

        <hr style={separatorStyle} />

        {/* --- The Problem Section --- */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700" }}>
            The Problem: A Disconnected Experience
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              color: "#4B5563",
            }}
          >
            Singing online is popular, but today's platforms fail to deliver a
            true social karaoke experience.
          </p>
          <div style={gridStyle}>
            <ProblemCard
              emoji="😵"
              title="Chaotic Generalist Platforms"
              text="Livestreams on TikTok or Instagram lack focus, features, and creator protection. They are content feeds, not social venues for music."
            />
            <ProblemCard
              emoji="🎙️"
              title="Asynchronous & Solitary Apps"
              text="Apps like Smule focus on solo recording sessions. They miss the live, interactive, and communal energy of real karaoke."
            />
            <ProblemCard
              emoji="💔"
              title="Underserved & Unprotected Creators"
              text="Talented singers lack clear paths to monetization and building a dedicated audience. Their passion isn't rewarded fairly."
            />
          </div>
        </section>

        <hr style={separatorStyle} />

        {/* --- Competitive Edge Section --- */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700" }}>
            YayWay's Competitive Edge
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              color: "#4B5563",
            }}
          >
            YayWay isn't just another singing app. It's the only platform that
            combines the best of social, creator, and discovery features.
          </p>
          <CompetitiveEdgeTable />
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6B7281",
              marginTop: "1rem",
            }}
          >
            Key: ✅ Core Feature, 🟡 Limited Feature, ❌ Not a Feature
          </p>
        </section>

        <hr style={separatorStyle} />

        {/* --- Monetization Flywheel Section (NEW) --- */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700" }}>
            The Monetization Flywheel
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              color: "#4B5563",
            }}
          >
            Our hybrid model creates a self-reinforcing virtuous cycle, driving
            both user engagement and diversified revenue.
          </p>
          <MonetizationFlywheel />
        </section>

        <hr style={separatorStyle} />

        {/* --- Underserved User Section (NEW) --- */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700" }}>
            The Underserved User: Gen Z & Millennials
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              color: "#4B5563",
            }}
          >
            YayWay is built for the behaviors and preferences of today's digital
            natives.
          </p>
          <div style={gridStyle}>
            <DiscoveryChart />
            <CreatorSupportChart />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
