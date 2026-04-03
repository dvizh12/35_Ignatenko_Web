import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-container">
        <div className="logo">API Panel</div>
        <div className="nav-links">
          <NavLink to="/posts" className="nav-btn">Posts</NavLink>
          <NavLink to="/todos" className="nav-btn">Todos</NavLink>
          <NavLink to="/comments" className="nav-btn">Comments</NavLink>
        </div>
      </div>
    </header>
  );
}
