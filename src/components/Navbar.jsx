import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/learning", label: "Learn" },
    { to: "/grid", label: "Grid" },
    { to: "/saved", label: "Saved" },
  ];

  return (
    <div className="navbar">
      {links.map(({ to, label }) => (
        <motion.div
          key={to}
          whileHover={{ y: -2, scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ display: "inline-block" }}
        >
          <Link
            to={to}
            className={location.pathname === to ? "nav-active" : ""}
          >
            {label}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default Navbar;