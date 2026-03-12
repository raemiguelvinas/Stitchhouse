import { useRef, useState, useEffect, useCallback, useMemo, Component } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dotting, useDotting, BrushTool } from "dotting";
import bg from "../images/home-bg.png";

// ─── Shared storage helpers ───────────────────────────────────────────────────
export const PROJECTS_KEY = "stitchhouse-projects";
export const ACTIVE_KEY   = "stitchhouse-active";

export function loadProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]"); }
  catch { return []; }
}
export function saveProjects(list) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
}
export function getActiveProject() {
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || "null"); }
  catch { return null; }
}
export function setActiveProject(p) {
  localStorage.setItem(ACTIVE_KEY, p ? JSON.stringify(p) : "null");
}

// ─── Error boundary ───────────────────────────────────────────────────────────
class DottingBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false, msg: "" }; }
  static getDerivedStateFromError(err) { return { crashed: true, msg: String(err) }; }
  render() {
    if (this.state.crashed) {
      return (
        <div className="editor-error">
          <p><strong>Canvas error — please reload the page.</strong></p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>{this.state.msg}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Animated button ──────────────────────────────────────────────────────────
function ABtn({ onClick, children, className = "btn-secondary", disabled = false }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={disabled ? {} : { scale: 1.07, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      {children}
    </motion.button>
  );
}

// ─── New Project Modal ────────────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const valid = name.trim().length > 0;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-box"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="modal-title">New Pattern</h2>

        <div className="modal-field">
          <label>Pattern Name</label>
          <input
            className="modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && valid && onCreate({ name: name.trim(), rows: +rows, cols: +cols })}
            placeholder="e.g. Summer Tote, Holiday Blanket…"
            autoFocus
          />
        </div>

        <div className="modal-row">
          <div className="modal-field">
            <label>Rows</label>
            <input className="modal-input" type="number" min={5} max={60}
              value={rows} onChange={e => setRows(e.target.value)} />
          </div>
          <div className="modal-field">
            <label>Columns</label>
            <input className="modal-input" type="number" min={5} max={60}
              value={cols} onChange={e => setCols(e.target.value)} />
          </div>
        </div>

        <p className="modal-hint">Tip: 20 × 20 is a great size for beginners!</p>

        <div className="modal-actions">
          <ABtn onClick={onClose}>Cancel</ABtn>
          <ABtn
            onClick={() => valid && onCreate({ name: name.trim(), rows: +rows, cols: +cols })}
            className={valid ? "btn-primary" : "btn-disabled"}
            disabled={!valid}
          >
            Create Pattern
          </ABtn>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
const MAX_COLORS = 24;
const DEFAULT_PALETTE = [
  "#000000", "#ffffff", "#ff4d4d", "#ff9900",
  "#ffff00", "#4dff88", "#4d79ff", "#cc44ff",
  "#8B4513", "#D2691E", "#F5DEB3", "#556B2F",
];

function EditorCanvas({ project, onSave }) {
  const ref = useRef(null);
  const { undo, redo } = useDotting(ref);

  const [color, setColor] = useState("#000000");
  const [tool, setTool]   = useState(BrushTool.DOT);
  const [saved, setSaved] = useState(false);
  const [palette, setPalette] = useState(() => {
    try {
      const stored = localStorage.getItem("stitchhouse-palette");
      return stored ? JSON.parse(stored) : DEFAULT_PALETTE;
    } catch { return DEFAULT_PALETTE; }
  });
  const [pickerValue, setPickerValue] = useState("#ff0000");

  // Persist palette changes
  useEffect(() => {
    localStorage.setItem("stitchhouse-palette", JSON.stringify(palette));
  }, [palette]);

  const addColor = (c) => {
    if (palette.includes(c)) { setColor(c); return; }
    if (palette.length >= MAX_COLORS) return;
    setPalette(prev => [...prev, c]);
    setColor(c);
  };

  const removeColor = (c) => {
    setPalette(prev => prev.filter(x => x !== c));
    if (color === c) setColor(palette[0] ?? "#000000");
  };

  // initLayers: bake saved colors directly into the grid at construction time.
  const initLayers = useMemo(() => {
    const data = project.gridData || {};
    return [{
      id: "layer1",
      data: Array.from({ length: project.rows }, (_, r) =>
        Array.from({ length: project.cols }, (_, c) => ({
          rowIndex: r,
          columnIndex: c,
          color: data[r]?.[c]?.color || "",
        }))
      ),
    }];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(() => {
    if (!ref.current) return;
    try {
      const layers = ref.current.getLayersAsArray();
      const gridData = {};
      const layer = layers[0];
      if (layer?.data) {
        layer.data.forEach((row) => {
          row.forEach(({ rowIndex, columnIndex, color: c }) => {
            if (!c) return;
            if (!gridData[rowIndex]) gridData[rowIndex] = {};
            gridData[rowIndex][columnIndex] = { color: c };
          });
        });
      }
      onSave(gridData);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      console.error("[save] error:", e);
    }
  }, [onSave]);

  return (
    <div className="editor">
      <div className="sidebar">
        <h3>Tools</h3>
        <ABtn onClick={() => setTool(BrushTool.DOT)}
          className={tool === BrushTool.DOT ? "btn-active" : "btn-secondary"}>
          Brush
        </ABtn>
        <ABtn onClick={() => setTool(BrushTool.ERASER)}
          className={tool === BrushTool.ERASER ? "btn-active" : "btn-secondary"}>
          Eraser
        </ABtn>
        <ABtn onClick={() => setTool(BrushTool.PAINT_BUCKET)}
          className={tool === BrushTool.PAINT_BUCKET ? "btn-active" : "btn-secondary"}>
          Fill
        </ABtn>
        <ABtn onClick={undo}>↩ Undo</ABtn>
        <ABtn onClick={redo}>↪ Redo</ABtn>

        <h3>Colors</h3>

        {/* Add color row */}
        <div className="color-add-row">
          <div className="color-current" style={{ background: color }} />
          <label className="color-picker-label" title="Pick a color">
            <input
              type="color"
              value={pickerValue}
              onChange={e => setPickerValue(e.target.value)}
              onBlur={e => addColor(e.target.value)}
              className="color-custom-input"
            />
            <span className="color-picker-btn">+ Add</span>
          </label>
          {palette.length >= MAX_COLORS && (
            <span className="color-limit-hint">Max {MAX_COLORS}</span>
          )}
        </div>

        {/* User palette */}
        <div className="palette palette--wide">
          {palette.map(c => (
            <motion.button
              key={c}
              className="palette-swatch"
              style={{
                background: c,
                boxShadow: color === c ? "0 0 0 3px #646cff" : "0 0 0 1px #aaa",
              }}
              onClick={() => setColor(c)}
              onContextMenu={e => { e.preventDefault(); removeColor(c); }}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              title={c + " (right-click to remove)"}
            />
          ))}
        </div>

        <motion.button
          onClick={handleSave}
          className="btn-save"
          whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 24px rgba(100,108,255,0.45)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 18 }}
          style={{ marginTop: 16 }}
        >
          {saved ? "✓ Saved!" : "Save"}
        </motion.button>
      </div>

      <div className="grid-container">
        <Dotting
          ref={ref}
          brushTool={tool}
          brushColor={color}
          backgroundColor="#ffffff"
          width={700}
          height={500}
          isGridFixed={true}
          initLayers={initLayers}
        />
      </div>
    </div>
  );
}

// ─── Grid page ────────────────────────────────────────────────────────────────
function Grid() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const [active, setActiveState]  = useState(getActiveProject);
  const [showModal, setShowModal] = useState(false);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  // If we were sent here from Saved with ?new=1, open the modal immediately
  useEffect(() => {
    if (location.search.includes("new=1")) {
      setShowModal(true);
    }
  }, [location.search]);

  const handleCreate = ({ name, rows, cols }) => {
    const project = {
      id: Date.now().toString(),
      name, rows, cols,
      gridData: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = loadProjects();
    saveProjects([project, ...all]);
    setActiveProject(project);
    setActiveState(project);
    setShowModal(false);
  };

  const handleSave = useCallback((gridData) => {
    const current = activeRef.current;
    if (!current) return;
    const updated = { ...current, gridData, updatedAt: new Date().toISOString() };
    const all = loadProjects();
    const idx = all.findIndex(p => p.id === updated.id);
    if (idx >= 0) all[idx] = updated; else all.unshift(updated);
    saveProjects(all);
    setActiveProject(updated);
    // Don't call setActiveState — would cause EditorCanvas's parent to re-render
    // and pass a new project prop which reinitialises gridRef
  }, []);

  const handleClose = () => {
    setActiveProject(null);
    setActiveState(null);
  };

  return (
    <motion.div
      className="grid-page"
      style={{ backgroundImage: `url(${bg})` }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid-content">
        {!active ? (
          <motion.div
            className="no-project-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="no-project-title">No pattern open</p>
            <p className="no-project-sub">
              Create a new pattern or load one from your saved projects.
            </p>
            <div className="no-project-actions">
              <ABtn onClick={() => setShowModal(true)} className="btn-primary btn-large">
                + New Pattern
              </ABtn>
              <ABtn onClick={() => navigate("/saved")} className="btn-secondary btn-large">
                Browse Saved
              </ABtn>
            </div>
          </motion.div>
        ) : (
          <motion.div
            style={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", alignItems: "center" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="project-header">
              <span className="project-name">{active.name}</span>
              <span className="project-dims">{active.rows} × {active.cols}</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <ABtn onClick={() => setShowModal(true)} className="btn-secondary">+ New</ABtn>
                <ABtn onClick={handleClose} className="btn-secondary">Close</ABtn>
              </div>
            </div>

            <DottingBoundary>
              <EditorCanvas
                key={active.id}
                project={active}
                onSave={handleSave}
              />
            </DottingBoundary>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <NewProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Grid;