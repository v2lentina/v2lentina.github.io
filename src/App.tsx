import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import About from "./components/About";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div
      className={`app ${isDarkMode ? "dark" : "light"}`}
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(
            1000px at ${mousePos.x}px ${mousePos.y}px,
            rgba(147, 197, 253, 0.3),
            rgba(147, 197, 253, 0.08) 40%,
            rgba(30, 58, 138, 0.02) 100%
          ),
          linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)
        `,
      }}
    >
      <Header
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="container">
        <About />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Valentina. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
