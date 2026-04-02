import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import logoImg from "../images/sh-logo.png"; // ← swap filename if yours differs

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
  <motion.img
    src={logoImg}
    alt="Home"
    className="navbar-logo-img"
    whileHover={{ scale: 1.08, y: -2 }}
    whileTap={{ scale: 0.93 }}
    transition={{ type: "spring", stiffness: 420, damping: 18 }}
  />
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