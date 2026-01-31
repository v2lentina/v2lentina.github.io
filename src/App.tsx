import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import About from "./components/About";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
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
