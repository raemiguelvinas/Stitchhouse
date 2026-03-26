import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageTitle from "../components/PageTitle";

const LEARNING_LETTER_BLOCKS = [
  <g key="placeholder">
    <path d="M0 96V29L42 24.5L48 62L65 76L59 96H0Z" fill="#C5F3FF"/>
<path d="M13.796 91V32.578H26.978V82.42C26.978 83.356 27.16 84.006 27.524 84.37C27.888 84.682 28.46 84.838 29.24 84.838H44.528C45.464 84.838 46.192 84.682 46.712 84.37C47.284 84.006 47.778 83.512 48.194 82.888L52.64 75.712C52.952 75.296 53.368 75.166 53.888 75.322L56.15 75.946C56.618 76.102 56.826 76.44 56.774 76.96L54.98 88.894C54.876 89.622 54.694 90.194 54.434 90.61C54.226 90.974 53.81 91.182 53.186 91.234C52.562 91.286 51.574 91.286 50.222 91.234L45.776 91H13.796ZM6.386 91C5.866 91 5.606 90.74 5.606 90.22V88.504C5.606 88.036 5.866 87.724 6.386 87.568L11.846 86.086C12.73 85.774 13.276 85.462 13.484 85.15C13.692 84.838 13.796 84.292 13.796 83.512V74.854H26.978V91H6.386ZM5.606 33.358C5.606 32.838 5.866 32.578 6.386 32.578H34.544C35.064 32.578 35.324 32.838 35.324 33.358V34.996C35.324 35.464 35.09 35.802 34.622 36.01L28.772 37.57C28.096 37.778 27.628 38.038 27.368 38.35C27.108 38.662 26.978 39.286 26.978 40.222V48.724H13.796V40.066C13.796 39.286 13.692 38.74 13.484 38.428C13.276 38.064 12.73 37.752 11.846 37.492L6.386 36.01C5.866 35.854 5.606 35.542 5.606 35.074V33.358Z" fill="#D75050"/>
  </g>,

  <g key="placeholder">
    <path d="M61.1637 127.316L72.5664 53.6941L130.336 66.1832L123.505 129.888L61.1637 127.316Z" fill="#FFD2D2"/>
<path d="M75.4943 117.529L82.092 64.7611L93.9983 66.2498L88.3696 111.268C88.2639 112.114 88.3548 112.721 88.6425 113.091C88.936 113.414 89.4351 113.62 90.1396 113.708L106.062 115.698C106.907 115.804 107.582 115.745 108.087 115.522C108.639 115.305 109.162 114.941 109.655 114.43L114.842 108.425C115.077 108.072 115.444 107.999 115.943 108.204L117.986 109.032C118.391 109.226 118.541 109.555 118.435 110.019L115.396 120.586C115.22 121.232 114.991 121.728 114.709 122.075C114.48 122.38 114.081 122.521 113.512 122.497C112.989 122.48 112.12 122.371 110.905 122.171L106.634 121.423L75.4943 117.529ZM108.845 103.739C108.422 103.687 108.12 103.434 107.938 102.982L107.04 99.292C106.805 98.4994 106.444 97.9534 105.957 97.654C105.522 97.3135 104.953 97.0992 104.248 97.0111L90.3691 95.2757L91.0738 89.6396L104.812 91.3573C105.657 91.463 106.332 91.4043 106.837 91.1813C107.348 90.9112 107.783 90.4885 108.141 89.9132L109.937 86.9895C110.225 86.5961 110.604 86.4288 111.073 86.4876L112.976 86.7254C113.445 86.7841 113.651 87.0483 113.592 87.518L111.601 103.44C111.548 103.863 111.287 104.045 110.817 103.986L108.845 103.739ZM117.485 83.2822C117.05 83.3233 116.716 83.1383 116.481 82.7274L114.059 76.3426C113.725 75.5852 113.317 75.0333 112.835 74.6869C112.401 74.3464 111.855 74.135 111.197 74.0528L93.3024 71.8154L93.9983 66.2498L113.513 68.6898L119.361 68.8485C120.118 68.8955 120.629 69.007 120.893 69.1832C121.21 69.3182 121.383 69.6499 121.413 70.1783C121.489 70.7126 121.448 71.6138 121.289 72.8819L120.373 82.4985C120.314 82.9682 120.044 83.2206 119.563 83.2559L117.485 83.2822ZM68.8014 116.692C68.3317 116.634 68.1263 116.369 68.185 115.9L68.3788 114.35C68.4316 113.927 68.7017 113.675 69.189 113.593L74.288 112.871C75.1217 112.689 75.65 112.468 75.8732 112.21C76.0963 111.952 76.2519 111.47 76.3399 110.766L77.3177 102.946L89.224 104.434L87.4006 119.018L68.8014 116.692ZM74.6065 64.5407C74.6653 64.071 74.9295 63.8655 75.3991 63.9242L93.9983 66.2498L92.1749 80.8332L80.2686 79.3445L81.2464 71.5244C81.3345 70.8199 81.3022 70.315 81.1496 70.0097C81.0028 69.6574 80.5449 69.314 79.7758 68.9793L75.0116 67.0241C74.5595 66.8245 74.3599 66.5133 74.4128 66.0906L74.6065 64.5407Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M208.836 103.445L167.035 33.9186L141.198 44.8248L126.409 112.162L208.836 103.445Z" fill="#F0FFB4"/>
<path d="M135.865 102.803C135.395 102.858 135.133 102.65 135.078 102.18L134.898 100.628C134.844 100.158 135.02 99.8279 135.426 99.6378L138.22 98.456C138.987 98.0812 139.557 97.6577 139.931 97.1854C140.305 96.7132 140.598 96.1551 140.809 95.5111L155.055 48.2569C155.147 47.8174 155.425 47.5468 155.89 47.4453L160.837 45.7278C161.296 45.5792 161.6 45.7346 161.749 46.1939L163.203 50.0994L187.772 89.9921C188.183 90.6592 188.648 91.1771 189.167 91.5457C189.686 91.9143 190.262 92.1572 190.896 92.2744L193.752 92.8722C194.197 93.0112 194.447 93.3158 194.502 93.786L194.673 95.267C194.728 95.7372 194.52 95.9996 194.05 96.0541L168.59 99.0074C168.167 99.0565 167.928 98.8459 167.873 98.3757L167.693 96.8242C167.65 96.448 167.828 96.1414 168.23 95.9042L172.135 94.4505C173.502 93.9108 174.268 93.3216 174.432 92.6831C174.596 92.0446 174.354 91.1911 173.706 90.1227L153.793 56.4801L160.027 51.6828L148.151 92.8726C147.745 94.3016 147.739 95.2791 148.134 95.8051C148.575 96.3257 149.4 96.6589 150.608 96.8046L155.323 97.4013C155.81 97.4878 156.08 97.7662 156.135 98.2363L156.307 99.7174C156.361 100.188 156.153 100.45 155.683 100.504L135.865 102.803ZM147.53 79.5071C152.076 79.2657 156.7 78.8722 161.402 78.3268C166.145 77.729 170.737 77.0534 175.176 76.3002L175.823 81.8719C171.389 82.6721 166.797 83.3476 162.048 83.8985C157.346 84.4439 152.725 84.8608 148.184 85.1493L147.53 79.5071Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M209.807 122.176L208.315 53.1557L215.388 41.6779L261.343 49.6209L269.072 89.5165L282.021 116.368L209.807 122.176Z" fill="#E0C7FF"/>
<path d="M232.871 87.564V81.884H238.764C241.699 81.884 243.971 81.032 245.58 79.328C247.189 77.5767 247.994 75.0917 247.994 71.873C247.994 68.749 247.213 66.406 245.651 64.844C244.089 63.2347 241.793 62.43 238.764 62.43H232.871V56.821H238.764C245.722 56.821 250.976 58.099 254.526 60.655C258.076 63.1637 259.851 66.903 259.851 71.873C259.851 76.8903 258.029 80.7717 254.384 83.517C250.787 86.215 245.58 87.564 238.764 87.564H232.871ZM220.872 110V56.821H232.871V110H220.872ZM254.455 110C253.745 110 253.177 109.953 252.751 109.858C252.325 109.716 251.923 109.408 251.544 108.935C251.165 108.462 250.621 107.704 249.911 106.663L239.9 91.469C239.143 90.2857 238.48 89.4337 237.912 88.913C237.344 88.345 236.823 87.99 236.35 87.848C235.877 87.6587 235.356 87.564 234.788 87.564L239.829 85.221C241.77 85.3157 243.474 85.6707 244.941 86.286C246.408 86.854 247.781 87.706 249.059 88.842C250.384 89.9307 251.733 91.3743 253.106 93.173L261.058 103.255C261.626 103.918 262.17 104.438 262.691 104.817C263.212 105.148 263.78 105.432 264.395 105.669L267.59 106.805C268.016 106.994 268.229 107.326 268.229 107.799V109.29C268.229 109.763 267.992 110 267.519 110H254.455ZM214.127 110C213.654 110 213.417 109.763 213.417 109.29V107.728C213.417 107.302 213.654 107.018 214.127 106.876L219.097 105.527C219.902 105.243 220.399 104.959 220.588 104.675C220.777 104.391 220.872 103.894 220.872 103.184V95.303H232.871V103.042C232.871 103.894 232.989 104.462 233.226 104.746C233.463 105.03 233.889 105.267 234.504 105.456L239.829 106.876C240.255 107.065 240.468 107.373 240.468 107.799V109.29C240.468 109.763 240.231 110 239.758 110H214.127ZM213.417 57.531C213.417 57.0577 213.654 56.821 214.127 56.821H232.871V71.518H220.872V63.637C220.872 62.927 220.777 62.43 220.588 62.146C220.399 61.8147 219.902 61.5307 219.097 61.294L214.127 59.945C213.654 59.803 213.417 59.519 213.417 59.093V57.531Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M280 93V30.5L350 26.5V97H341.5L325.5 87.5L320 93H280Z" fill="#FFC8FE"/>
<path d="M341.028 38.365C340.365 38.5543 339.916 38.791 339.679 39.075C339.442 39.359 339.324 39.927 339.324 40.779V86.645C339.324 87.1183 339.087 87.355 338.614 87.355H334.922C334.449 87.355 334.046 87.1657 333.715 86.787L297.505 42.98L303.114 37.371V80.184C303.114 80.894 303.209 81.391 303.398 81.675C303.635 81.959 304.132 82.243 304.889 82.527L309.788 83.805C310.214 84.0417 310.427 84.373 310.427 84.799V86.29C310.427 86.7633 310.19 87 309.717 87H289.127C288.654 87 288.417 86.7633 288.417 86.29V84.728C288.417 84.302 288.654 84.018 289.127 83.876L294.381 82.456C294.996 82.2667 295.422 82.03 295.659 81.746C295.943 81.462 296.085 80.894 296.085 80.042V41.063C296.085 40.211 295.919 39.5957 295.588 39.217C295.257 38.791 294.76 38.4833 294.097 38.294L289.056 36.945C288.63 36.7557 288.417 36.448 288.417 36.022V34.531C288.417 34.0577 288.654 33.821 289.127 33.821H304.037C304.51 33.821 304.889 33.9867 305.173 34.318L337.478 73.439L332.224 81.817V40.637C332.224 39.927 332.106 39.43 331.869 39.146C331.68 38.8147 331.183 38.5307 330.378 38.294L325.621 37.016C325.195 36.7793 324.982 36.448 324.982 36.022V34.531C324.982 34.0577 325.219 33.821 325.692 33.821H346.282C346.708 33.821 346.921 34.0577 346.921 34.531V36.093C346.921 36.519 346.708 36.803 346.282 36.945L341.028 38.365Z" fill="#D75050"/>

  </g>,

];

// ─── Content ──────────────────────────────────────────────────────────────────
const STITCHES = [
  {
    title: "Slip Knot",
    description: "The slip knot is the very first step in starting any crochet project. It creates the adjustable loop that goes onto your hook and sets the foundation for all the stitches in your project.",
    videoId: "BwdhZTg5f3Y",
    tag: "Beginner",
    tagColor: "#FFD2D2",
  },
  {
    title: "Single Crochet",
    description: "Single crochet is one of the most basic and commonly used stitches. It creates a tight, dense fabric and is perfect for beginners learning control and consistency. Creating nice, neat, and uniform single crochets is the first key step into mastery.",
    videoId: "vNO4Gk_tgVo",
    tag: "Beginner",
    tagColor: "#FFD2D2",
  },
  {
    title: "Double Crochet",
    description: "Double crochet is a taller stitch that works up faster than single crochet. It creates a softer, more flexible fabric, making it great for scarves, blankets, and more.",
    videoId: "Sglsx2xTCU0",
    tag: "Intermediate",
    tagColor: "#FFD2D2",
  },
  {
    title: "Treble Crochet",
    description: "Treble crochet, also known as the triple crochet, is an even taller stitch that gives your work a light, airy feel. It's perfect for patterns that need more height and drape.",
    videoId: "-E1mhih75Ro",
    tag: "Intermediate",
    tagColor: "#FFD2D2",
  },
];

const TECHNIQUES = [
  {
    title: "Grip & Tension",
    description: "Your grip and yarn tension play an important role in how your project turns out. Holding your hook comfortably and keeping consistent tension helps your stitches stay even, and your projects look neat. It takes practice, so don't worry if it feels awkward at first.",
    videoId: "Bejf_9l50VM",
    tag: "Essential",
    tagColor: "#FFD2D2",
  },
  {
    title: "Frogging (Practice)",
    description: "Frogging is a term for undoing your stitches to start again. It is a normal and important part of learning crochet. It helps you fix mistakes, improve your technique, and build confidence. Don't be afraid to start over — it means you're learning.",
    videoId: "LgRVAIcjmY8",
    tag: "Mindset",
    tagColor: "#FFD2D2",
  },
];

// ─── Single lesson card ───────────────────────────────────────────────────────
function LessonCard({ item, index }) {
  const reversed = index % 2 === 1; // alternate sides

  const textBlock = (
    <motion.div
      className="lesson-text"
      initial={{ opacity: 0, x: reversed ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <span className="lesson-tag" style={{ background: item.tagColor }}>
        {item.tag}
      </span>
      <h2 className="lesson-title">{item.title}</h2>
      <p className="lesson-desc">{item.description}</p>
    </motion.div>
  );

  const videoBlock = (
    <motion.div
      className="lesson-video-wrap"
      initial={{ opacity: 0, x: reversed ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="lesson-video">
        <iframe
          src={`https://www.youtube.com/embed/${item.videoId}`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className={`lesson-card ${reversed ? "lesson-card--reversed" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
    >
      {reversed ? <>{videoBlock}{textBlock}</> : <>{textBlock}{videoBlock}</>}
    </motion.div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────
function Tab({ label, active, onClick }) {
  return (
    <motion.button
      className={`learn-tab${active ? " learn-tab--active" : ""}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      {label}
    </motion.button>
  );
}

// ─── Learning page ────────────────────────────────────────────────────────────
function Learning() {
  const [tab, setTab] = useState("stitches");
  const items = tab === "stitches" ? STITCHES : TECHNIQUES;

  return (
    <motion.div
      className="home page-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="learn-page">
        {/* Header */}
        <motion.div
          className="learn-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle viewBox="40 0 260 150" maxWidth={380}>
            {LEARNING_LETTER_BLOCKS}
          </PageTitle>

          {/* Tab switcher */}
          <div className="learn-tabs">
            <Tab label="Stitches"   active={tab === "stitches"}   onClick={() => setTab("stitches")} />
            <Tab label="Techniques" active={tab === "techniques"} onClick={() => setTab("techniques")} />
          </div>
        </motion.div>

        {/* Divider */}
        <div className="home-divider" style={{ maxWidth: 600, margin: "0 auto 40px" }}>
          <span className="home-divider-line" />
          <span className="home-divider-star">★</span>
          <span className="home-divider-line" />
        </div>

        {/* Lesson list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="lesson-list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item, i) => (
              <LessonCard key={item.title} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Learning;