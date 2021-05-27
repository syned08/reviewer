import './header.css';

export default function Header({ children }) {
  return (
    <header className="header">
      <nav className="nav container">
        <div className="left">
          <a href="#/home" className="logo">
            Рецензент
          </a>
        </div>
        <div className="right">
          <div className="optional-links">{children}</div>
          <div>
            <a
              href="http://t.me/reviewer_practice_bot"
              target="_blank"
              rel="noreferrer"
            >
              <img src="telegram.ico" alt="telegram" className="telegram" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
