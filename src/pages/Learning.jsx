import { motion } from "motion/react";
import bg from "../images/home-bg.png";

function Learning() {
  return (
    <motion.div
      className="home"
      style={{ backgroundImage: `url(${bg})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="home-content">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          This is the learning page!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
        >
          Currently under construction...
        </motion.p>
      </div>
    </motion.div>
  );
}

export default Learning;