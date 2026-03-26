import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { loadProjects, saveProjects, setActiveProject } from "./Grid";
import PageTitle from "../components/PageTitle";

// TODO: replace with real letter blocks when SVG is ready
const SAVED_LETTER_BLOCKS = [
  <g key="placeholder">
    <path d="M0 26.5L18 16L61 21V97L0 105V26.5Z" fill="#FFC8FE"/>
<path d="M35.342 56.212C39.866 57.72 43.428 59.28 46.028 60.892C48.68 62.452 50.552 64.22 51.644 66.196C52.736 68.12 53.282 70.486 53.282 73.294C53.282 77.038 52.294 80.314 50.318 83.122C48.394 85.93 45.664 88.114 42.128 89.674C38.592 91.234 34.432 92.014 29.648 92.014C26.736 92.014 24.058 91.806 21.614 91.39C19.222 91.026 17.116 90.584 15.296 90.064C13.528 89.544 12.072 89.05 10.928 88.582C10.46 88.374 10.226 88.01 10.226 87.49L10.538 74.386C10.538 73.866 10.798 73.606 11.318 73.606L13.736 73.528C14.204 73.528 14.516 73.762 14.672 74.23L16.31 78.832C16.726 80.028 17.298 81.068 18.026 81.952C18.754 82.836 19.638 83.564 20.678 84.136C21.718 84.656 22.914 85.046 24.266 85.306C25.618 85.566 27.126 85.696 28.79 85.696C32.378 85.696 35.186 84.942 37.214 83.434C39.242 81.926 40.256 79.872 40.256 77.272C40.256 75.66 39.918 74.334 39.242 73.294C38.618 72.202 37.474 71.188 35.81 70.252C34.146 69.316 31.858 68.328 28.946 67.288C24.11 65.572 20.288 63.882 17.48 62.218C14.724 60.502 12.748 58.578 11.552 56.446C10.408 54.314 9.836 51.766 9.836 48.802C9.836 45.37 10.824 42.38 12.8 39.832C14.776 37.232 17.506 35.204 20.99 33.748C24.526 32.292 28.634 31.564 33.314 31.564C35.654 31.564 37.812 31.746 39.788 32.11C41.764 32.474 43.532 32.942 45.092 33.514C46.704 34.034 48.004 34.606 48.992 35.23C49.46 35.49 49.668 35.88 49.616 36.4L49.382 48.802C49.278 49.27 48.992 49.53 48.524 49.582L46.106 49.66C45.638 49.712 45.3 49.478 45.092 48.958L43.22 43.888C42.7 42.536 42.024 41.418 41.192 40.534C40.412 39.65 39.398 39 38.15 38.584C36.902 38.116 35.29 37.882 33.314 37.882C30.038 37.882 27.49 38.61 25.67 40.066C23.902 41.522 23.018 43.524 23.018 46.072C23.018 47.632 23.382 48.984 24.11 50.128C24.89 51.22 26.164 52.234 27.932 53.17C29.752 54.106 32.222 55.12 35.342 56.212Z" fill="#D75050"/>
  </g>,

  <g key="placeholder">
    <path d="M131 131.5L104 55L76.5 60.5L48.5 123.5L131 131.5Z" fill="#FECF9A"/>
<path d="M60.6106 116.481C60.1409 116.422 59.9354 116.158 59.9942 115.688L60.1879 114.139C60.2467 113.669 60.4962 113.39 60.9365 113.302L63.9307 112.818C64.7644 112.636 65.419 112.36 65.8946 111.99C66.3702 111.62 66.787 111.147 67.1452 110.572L92.2097 68.0553C92.4035 67.6502 92.7381 67.4535 93.2137 67.4653L98.4271 66.9723C98.9086 66.9371 99.1669 67.1602 99.2021 67.6416L99.6863 71.7807L114.075 116.368C114.315 117.114 114.644 117.727 115.061 118.209C115.478 118.69 115.98 119.063 116.567 119.327L119.2 120.587C119.599 120.827 119.769 121.183 119.711 121.652L119.526 123.132C119.467 123.601 119.203 123.807 118.733 123.748L93.3001 120.568C92.8773 120.515 92.6954 120.254 92.7541 119.784L92.9479 118.235C92.9949 117.859 93.2414 117.603 93.6876 117.468L97.8267 116.984C99.2827 116.785 100.166 116.394 100.477 115.813C100.789 115.232 100.756 114.345 100.381 113.153L89.0304 75.7432L96.2253 72.5643L74.9037 109.753C74.1698 111.045 73.932 111.993 74.1903 112.598C74.4955 113.208 75.2177 113.728 76.3566 114.157L80.795 115.856C81.2471 116.056 81.4437 116.391 81.385 116.86L81.2 118.34C81.1413 118.81 80.8771 119.015 80.4074 118.956L60.6106 116.481ZM77.4756 96.623C81.9493 97.4686 86.5345 98.185 91.2312 98.7722C95.9808 99.3184 100.601 99.753 105.093 100.076L104.397 105.642C99.8995 105.366 95.2791 104.931 90.5353 104.338C85.8386 103.751 81.2504 103.058 76.7709 102.259L77.4756 96.623Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M189.5 25.5L118 41.5V70.5L166.5 118L189.5 25.5Z" fill="#C1EAFF"/>
<path d="M157.223 99.5719C156.8 99.621 156.447 99.4476 156.162 99.0517L129.152 55.368C128.736 54.6539 128.273 54.1595 127.765 53.8849C127.251 53.5633 126.654 53.3467 125.974 53.2349L123.598 53.0818C123.158 52.9898 122.911 52.7087 122.857 52.2385L122.685 50.7575C122.63 50.2873 122.838 50.0249 123.308 49.9704L148.769 47.0171C149.192 46.968 149.431 47.1786 149.485 47.6487L149.665 49.2003C149.714 49.6235 149.509 49.9094 149.05 50.0579L144.97 51.2459C143.587 51.6446 142.79 52.1659 142.579 52.8099C142.409 53.4014 142.646 54.2078 143.288 55.2292L163.636 89.5362L157.331 94.3416L169.337 52.4221C169.79 50.9877 169.799 50.0337 169.363 49.5601C168.921 49.0395 168.104 48.7769 166.913 48.7722L162.027 48.5527C161.593 48.5077 161.348 48.2501 161.294 47.78L161.122 46.2989C161.068 45.8287 161.275 45.5664 161.746 45.5118L181.564 43.213C181.987 43.1639 182.226 43.3745 182.28 43.8446L182.46 45.3962C182.509 45.8194 182.307 46.1288 181.853 46.3244L179.504 47.0257C178.68 47.3119 178.08 47.6912 177.706 48.1634C177.327 48.5886 177.031 49.1232 176.82 49.7672L162.157 98.3563C162.018 98.8013 161.714 99.0511 161.243 99.1056L157.223 99.5719Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M200 120V45.5L259 49L262 113L200 120Z" fill="#FFD2D2"/>
<path d="M214.372 110V56.8211H226.371V102.19C226.371 103.042 226.537 103.634 226.868 103.965C227.199 104.249 227.72 104.391 228.43 104.391H244.476C245.328 104.391 245.991 104.249 246.464 103.965C246.985 103.681 247.458 103.255 247.884 102.687L252.286 96.0841C252.475 95.7054 252.83 95.5871 253.351 95.7291L255.481 96.2971C255.907 96.4391 256.096 96.7467 256.049 97.2201L254.345 108.083C254.25 108.746 254.085 109.266 253.848 109.645C253.659 109.976 253.28 110.166 252.712 110.213C252.191 110.26 251.316 110.26 250.085 110.213L245.754 110H214.372ZM245.754 92.1791C245.328 92.1791 244.997 91.9661 244.76 91.5401L243.411 87.9901C243.08 87.2327 242.654 86.7357 242.133 86.4991C241.66 86.2151 241.068 86.0731 240.358 86.0731H226.371V80.3931H240.216C241.068 80.3931 241.731 80.2511 242.204 79.9671C242.677 79.6357 243.056 79.1624 243.34 78.5471L244.76 75.4231C244.997 74.9971 245.352 74.7841 245.825 74.7841H247.742C248.215 74.7841 248.452 75.0207 248.452 75.4941V91.5401C248.452 91.9661 248.215 92.1791 247.742 92.1791H245.754ZM251.789 70.8081C251.363 70.9027 251.008 70.7607 250.724 70.3821L247.529 64.3471C247.103 63.6371 246.63 63.1401 246.109 62.8561C245.636 62.5721 245.068 62.4301 244.405 62.4301H226.371V56.8211H246.038L251.86 56.2531C252.617 56.2057 253.138 56.2531 253.422 56.3951C253.753 56.4897 253.966 56.7974 254.061 57.3181C254.203 57.8387 254.274 58.7381 254.274 60.0161L254.558 69.6721C254.558 70.1454 254.321 70.4294 253.848 70.5241L251.789 70.8081ZM207.627 110C207.154 110 206.917 109.763 206.917 109.29V107.728C206.917 107.302 207.154 107.018 207.627 106.876L212.597 105.527C213.402 105.243 213.899 104.959 214.088 104.675C214.277 104.391 214.372 103.894 214.372 103.184V95.3031H226.371V110H207.627ZM206.917 57.5311C206.917 57.0577 207.154 56.8211 207.627 56.8211H226.371V71.5181H214.372V63.6371C214.372 62.9271 214.277 62.4301 214.088 62.1461C213.899 61.8147 213.402 61.5307 212.597 61.2941L207.627 59.9451C207.154 59.8031 206.917 59.5191 206.917 59.0931V57.5311Z" fill="#D75050"/>

  </g>,

  <g key="placeholder">
    <path d="M276 95V23.5H318.5L346.5 41L336.5 95H276Z" fill="#FFE478"/>
<path d="M289.372 87.0001V33.8211H301.371V79.1901C301.371 80.0421 301.537 80.6337 301.868 80.9651C302.199 81.2491 302.72 81.3911 303.43 81.3911H307.761C311.169 81.3911 314.08 80.5627 316.494 78.9061C318.908 77.2021 320.754 74.7881 322.032 71.6641C323.357 68.4927 324.02 64.7297 324.02 60.3751C324.02 56.0204 323.357 52.2811 322.032 49.1571C320.754 46.0331 318.908 43.6427 316.494 41.9861C314.08 40.2821 311.169 39.4301 307.761 39.4301H301.371V33.8211H307.761C313.962 33.8211 319.239 34.8624 323.594 36.9451C327.996 39.0277 331.333 42.0571 333.605 46.0331C335.877 49.9617 337.013 54.7424 337.013 60.3751C337.013 66.0077 335.853 70.8121 333.534 74.7881C331.262 78.7641 327.949 81.7934 323.594 83.8761C319.239 85.9587 313.962 87.0001 307.761 87.0001H289.372ZM281.917 34.5311C281.917 34.0577 282.154 33.8211 282.627 33.8211H301.371V48.5181H289.372V40.6371C289.372 39.9271 289.277 39.4301 289.088 39.1461C288.899 38.8147 288.402 38.5307 287.597 38.2941L282.627 36.9451C282.154 36.8031 281.917 36.5191 281.917 36.0931V34.5311ZM282.627 87.0001C282.154 87.0001 281.917 86.7634 281.917 86.2901V84.7281C281.917 84.3021 282.154 84.0181 282.627 83.8761L287.597 82.5271C288.402 82.2431 288.899 81.9591 289.088 81.6751C289.277 81.3911 289.372 80.8941 289.372 80.1841V72.3031H301.371V87.0001H282.627Z" fill="#D75050"/>

  </g>,
];

// ─── Format saved date ────────────────────────────────────────────────────────
function formatSavedDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} at ${time}`;
}
 
// ─── Mini pixel preview ───────────────────────────────────────────────────────
function MiniPreview({ gridData = {}, rows = 0, cols = 0 }) {
  const hasData = rows > 0 && cols > 0 && Object.keys(gridData).length > 0;
  if (!hasData) return <span className="preview-empty">🧶</span>;
 
  // gridData keys are strings (from JSON), so look up with string keys
  const getColor = (r, c) => gridData[String(r)]?.[String(c)]?.color || "#fff";
 
  return (
    <div
      className="mini-preview"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <div
            key={`${r}-${c}`}
            className="mini-preview__cell"
            style={{ background: getColor(r, c) }}
          />
        ))
      )}
    </div>
  );
}
 
// ─── Animated button ──────────────────────────────────────────────────────────
function ABtn({ onClick, children, className = "btn-secondary" }) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
 
// ─── Delete confirm ───────────────────────────────────────────────────────────
function DeleteModal({ onClose, onConfirm }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-box modal-box--small"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-icon">🗑️</div>
        <h3 className="modal-title">Delete this pattern?</h3>
        <p className="modal-hint">This can't be undone.</p>
        <div className="modal-actions">
          <ABtn onClick={onClose}>Cancel</ABtn>
          <ABtn onClick={onConfirm} className="btn-danger">Delete</ABtn>
        </div>
      </motion.div>
    </motion.div>
  );
}
 
// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onLoad, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 22, scale: 0.97, rotate: 0 }}
      animate={{
        opacity: 1,
        y: hovered ? -8 : 0,
        scale: hovered ? 1.08 : 1,
        rotate: hovered ? 2 : 0,
        boxShadow: hovered
          ? "0 24px 52px rgba(0,0,0,0.22)"
          : "0 4px 14px rgba(0,0,0,0.08)",
      }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ type: "spring", stiffness: 300, damping: 12, mass: 0.8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 1.04, rotate: 1 }}
    >
      {/* Square preview fills most of the card */}
      <div className="project-card__preview" onClick={() => onLoad(project)}>
        <MiniPreview gridData={project.gridData} rows={project.rows} cols={project.cols} />
      </div>
 
      {/* Slim footer strip */}
      <div className="project-card__footer" onClick={() => onLoad(project)}>
        <div className="project-card__info">
          <strong className="project-card__name">{project.name}</strong>
          <span className="project-card__meta">{project.rows} × {project.cols}</span>
          {project.lastSavedAt && (
            <span className="project-card__saved">
              {formatSavedDate(project.lastSavedAt)}
            </span>
          )}
        </div>
        <div className="project-card__actions">
          <ABtn
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            className="btn-danger btn-sm"
          >✕</ABtn>
        </div>
      </div>
    </motion.div>
  );
}
 
// ─── Saved page ───────────────────────────────────────────────────────────────
function Saved() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(loadProjects);
  const [deleteId, setDeleteId] = useState(null);
 
  // Open a saved project in the grid editor
  const handleLoad = useCallback((project) => {
    setActiveProject(project);
    navigate("/grid");
  }, [navigate]);
 
  // Navigate to grid with ?new=1 so Grid page opens the new project modal
  const handleNew = () => {
    setActiveProject(null);
    navigate("/grid?new=1");
  };
 
  const handleDelete = useCallback((id) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
    setDeleteId(null);
  }, [projects]);
 
  return (
    <motion.div
      className="home page-bg"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="home-content">
        <motion.div
          className="saved-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <PageTitle viewBox="40 -10 260 250" maxWidth={380}>
                      {SAVED_LETTER_BLOCKS}
                    </PageTitle>
        </motion.div>
 
        {/* Prominent New Pattern button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 8 }}
        >
          <motion.button
            className="learn-tab learn-tab--active saved-new-btn"
            onClick={handleNew}
            whileHover={{ scale: 1.05, y: -3, boxShadow: "0 8px 28px rgba(215,80,80,0.35)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            + New Pattern
          </motion.button>
        </motion.div>
 
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ fontSize: 56, display: "inline-block", marginBottom: 12 }}
            >
              🧶
            </motion.div>
            <p className="saved-empty-text">
              No saved patterns yet... head to the Grid page to create your first one!
            </p>
          </motion.div>
        ) : (
          <>
            <motion.p className="saved-count"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              {projects.length} pattern{projects.length !== 1 ? "s" : ""}
            </motion.p>
            <div className="projects-grid">
              <AnimatePresence>
                {projects.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i}
                    onLoad={handleLoad}
                    onDelete={id => setDeleteId(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
 
      <AnimatePresence>
        {deleteId && (
          <DeleteModal
            onClose={() => setDeleteId(null)}
            onConfirm={() => handleDelete(deleteId)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
 
export default Saved;