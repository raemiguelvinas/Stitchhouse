import { motion } from "motion/react";
import bg from "../images/home-bg.png";

function Home() {
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
        <motion.p
          className="large-subtitle"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        >
          Welcome to
        </motion.p>
        <motion.p
          className="large-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
        >
          Stitchhouse
        </motion.p>
        <motion.p
          className="home-body"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          Status Note <br />
          Currently, the grid editor, tools, custom colours, grid saving, and the ability to save multiple projects are all functional.<br />

          The landing page, learning page, the generated text instructions for the grid editor, grid progress tracking, and most of the design are placeholders or incomplete for now.
          <br />
          We are interested in getting feedback on how the website ‘feels’ to use, especially with the grid editor. Please suggest any quality of life changes you would like to see based on your testing.
          <br /> <br />
          Testing Guide <br />
          - Click on ‘Grid’ and create a new pattern<br />
          - Try using the grid editor, and save your pattern<br />
          - Create more patterns of different sizes and designs, view them in ‘Saved’

        </motion.p>
      </div>
    </motion.div>
  );
}

export default Home;