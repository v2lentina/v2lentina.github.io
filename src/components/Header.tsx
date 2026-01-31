import { IoSunnyOutline } from "react-icons/io5";

// Expected properties by header component: onToggleDarkMode (function)
interface HeaderProps {
  onToggleDarkMode: () => void;
}

export default function Header({ onToggleDarkMode }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Valentina Gretz</div>
        <button
          className="theme-toggle"
          onClick={onToggleDarkMode}
          aria-label="Toggle dark mode"
        >
          <IoSunnyOutline className="icon" />
        </button>
      </div>
    </header>
  );
}
