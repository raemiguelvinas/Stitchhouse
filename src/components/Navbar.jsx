import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";


// Pages in the right-side pill nav (no Home — that's the logo on the left)
const LINKS = [
  { to: "/learning", label: "Learn" },
  { to: "/grid",     label: "Grid"  },
  { to: "/saved",    label: "Saved" },
];

function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      {/* Left: home logo button */}
      <Link to="/" className="navbar-logo" aria-label="Home">
        <motion.div
          className="navbar-logo-pill"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          {/* Placeholder — swap src for your logo.png when ready */}
          <span className="navbar-logo-placeholder">🏠</span>
        </motion.div>
      </Link>

      {/* Right: pill nav links */}
      <div className="navbar-links">
        {LINKS.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <motion.div
              key={to}
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <Link
                to={to}
                className={`navbar-pill${active ? " navbar-pill--active" : ""}`}
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;