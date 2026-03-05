import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/learning">Learn</Link>
      <Link to="/grid">Grid</Link>
      <Link to="/saved">Saved</Link>
      
    </div>
  );
}

export default Navbar;