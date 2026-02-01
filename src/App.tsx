import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import About from "./components/About";
import ParticleNetwork from "./components/ParticleNetwork";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <ParticleNetwork
        isDark={isDarkMode}
        particleCount={200}
        maxDistance={200}
      />
      <Header onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

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
