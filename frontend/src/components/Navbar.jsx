import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("sb_token");

  const handleLogout = () => {
    localStorage.removeItem("sb_token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="brand" onClick={() => navigate("/")}>ServiceBook</div>
      <div className="nav-links">
        <Link to="/">Services</Link>
        {token ? (
          <>
            <Link to="/profile">Dashboard</Link>
            <button className="button secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
