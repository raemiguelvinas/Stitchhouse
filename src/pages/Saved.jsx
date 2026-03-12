import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import bg from "../images/home-bg.png";
import { loadProjects, saveProjects, setActiveProject } from "./Grid";

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
        <div className="modal-icon">!</div>
        <h3 className="modal-title">Are you sure you want to delete this pattern?</h3>
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
      className="home"
      style={{ backgroundImage: `url(${bg})` }}
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
          <h1>Saved Patterns</h1>
          <ABtn onClick={handleNew} className="btn-primary">+ New Pattern</ABtn>
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
              You don't have any saved patterns yet... head to the Grid page to create your first one!
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