import { useRef, useState, useEffect, useCallback, useMemo, Component } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dotting, useDotting, BrushTool } from "dotting";
import PageTitle from "../components/PageTitle";

// TODO: replace with real letter blocks when SVG is ready
const GRID_LETTER_BLOCKS = [
  <g key="placeholder">
    <path d="M240.5 121V50.2867L281.5 42L310.5 79.5664L298.5 116.028L240.5 121Z" fill="#C5F3FF"/>
<path d="M251.05 110.547V57.3681H263.049V102.737C263.049 103.589 263.215 104.181 263.546 104.512C263.878 104.796 264.398 104.938 265.108 104.938H269.439C272.847 104.938 275.758 104.11 278.172 102.453C280.586 100.749 282.432 98.3351 283.71 95.2111C285.036 92.0398 285.698 88.2768 285.698 83.9221C285.698 79.5675 285.036 75.8281 283.71 72.7041C282.432 69.5801 280.586 67.1898 278.172 65.5331C275.758 63.8291 272.847 62.9771 269.439 62.9771H263.049V57.3681H269.439C275.64 57.3681 280.918 58.4095 285.272 60.4921C289.674 62.5748 293.011 65.6041 295.283 69.5801C297.555 73.5088 298.691 78.2895 298.691 83.9221C298.691 89.5548 297.532 94.3591 295.212 98.3351C292.94 102.311 289.627 105.34 285.272 107.423C280.918 109.506 275.64 110.547 269.439 110.547H251.05ZM243.595 58.0781C243.595 57.6048 243.832 57.3681 244.305 57.3681H263.049V72.0651H251.05V64.1841C251.05 63.4741 250.956 62.9771 250.766 62.6931C250.577 62.3618 250.08 62.0778 249.275 61.8411L244.305 60.4921C243.832 60.3501 243.595 60.0661 243.595 59.6401V58.0781ZM244.305 110.547C243.832 110.547 243.595 110.31 243.595 109.837V108.275C243.595 107.849 243.832 107.565 244.305 107.423L249.275 106.074C250.08 105.79 250.577 105.506 250.766 105.222C250.956 104.938 251.05 104.441 251.05 103.731V95.8501H263.049V110.547H244.305Z" fill="#D75050"/>
  </g>,

  <g key="placeholder">
    <path d="M215 20L175.5 26.5V97.5L226 92.5L215 20Z" fill="#F0FFB4"/>
<path d="M194.513 86.8298L188.386 34.005L200.305 32.6225L206.433 85.4473L194.513 86.8298ZM187.813 87.607C187.343 87.6616 187.081 87.4537 187.026 86.9836L186.846 85.432C186.797 85.0088 187 84.6994 187.453 84.5038L192.235 82.5912C193.002 82.2163 193.462 81.877 193.618 81.573C193.773 81.2691 193.81 80.7645 193.728 80.0592L192.82 72.2307L204.739 70.8482L205.631 78.5356C205.729 79.382 205.912 79.9325 206.18 80.1874C206.448 80.4422 206.898 80.6282 207.531 80.7454L212.984 81.5424C213.429 81.6814 213.676 81.9624 213.725 82.3856L213.897 83.8667C213.952 84.3368 213.744 84.5992 213.274 84.6537L187.813 87.607ZM181.063 35.5693C181.008 35.0991 181.216 34.8368 181.686 34.7822L207.146 31.8289C207.616 31.7744 207.879 31.9822 207.933 32.4524L208.105 33.9335C208.154 34.3566 207.978 34.6868 207.577 34.9239L202.451 36.948C201.861 37.207 201.466 37.4912 201.263 37.8006C201.061 38.11 201.009 38.6878 201.107 39.5341L201.999 47.2216L190.079 48.6041L189.171 40.7756C189.09 40.0704 188.938 39.5876 188.717 39.3273C188.491 39.02 187.965 38.7951 187.138 38.6528L182.046 37.8854C181.559 37.7989 181.292 37.5441 181.242 37.1209L181.063 35.5693Z" fill="#D75050"/>
  </g>,

  <g key="placeholder">
<path d="M91.5 124.154L102.676 57.6923L111.423 48L153.211 64.1538V103.846L160.5 132L91.5 124.154Z" fill="#E0C7FF"/>
<path d="M121.026 98.5191L121.73 92.883L127.578 93.6141C130.49 93.9782 132.85 93.4146 134.658 91.9235C136.473 90.3853 137.579 88.0194 137.979 84.8256C138.366 81.7257 137.882 79.3039 136.526 77.5602C135.175 75.7695 132.997 74.6862 129.991 74.3104L124.144 73.5793L124.84 68.0136L130.687 68.7447C137.592 69.608 142.646 71.528 145.852 74.5046C149.063 77.4344 150.361 81.365 149.744 86.2966C149.122 91.2752 146.832 94.9005 142.875 97.1724C138.97 99.4032 133.637 100.096 126.873 99.2502L121.026 98.5191ZM106.336 119.293L112.934 66.5249L124.84 68.0136L118.242 120.782L106.336 119.293ZM139.659 123.46C138.955 123.372 138.397 123.254 137.986 123.107C137.581 122.914 137.22 122.558 136.903 122.042C136.586 121.525 136.14 120.706 135.565 119.585L127.516 103.266C126.911 101.998 126.359 101.07 125.86 100.483C125.367 99.849 124.895 99.4321 124.443 99.2325C123.996 98.9859 123.492 98.8274 122.928 98.7569L128.221 97.0574C130.135 97.3921 131.781 97.9558 133.161 98.7484C134.547 99.4941 135.803 100.51 136.93 101.796C138.11 103.04 139.27 104.64 140.408 106.595L147.048 117.586C147.53 118.314 148.005 118.898 148.475 119.338C148.95 119.732 149.479 120.084 150.06 120.395L153.089 121.919C153.489 122.16 153.659 122.515 153.6 122.984L153.415 124.464C153.356 124.934 153.092 125.139 152.622 125.08L139.659 123.46ZM99.643 118.456C99.1733 118.398 98.9678 118.133 99.0265 117.664L99.2203 116.114C99.2732 115.691 99.5433 115.439 100.031 115.356L105.13 114.634C105.963 114.452 106.492 114.232 106.715 113.974C106.938 113.716 107.093 113.234 107.181 112.53L108.159 104.71L120.066 106.198L119.105 113.877C119 114.723 119.047 115.301 119.246 115.612C119.446 115.924 119.839 116.211 120.426 116.475L125.534 118.545C125.933 118.786 126.106 119.118 126.054 119.54L125.869 121.02C125.81 121.489 125.546 121.695 125.076 121.636L99.643 118.456ZM105.448 66.3045C105.507 65.8349 105.771 65.6294 106.241 65.6881L124.84 68.0136L123.016 82.5971L111.11 81.1084L112.088 73.2883C112.176 72.5838 112.144 72.0788 111.991 71.7736C111.844 71.4213 111.386 71.0778 110.617 70.7432L105.853 68.788C105.401 68.5883 105.201 68.2772 105.254 67.8545L105.448 66.3045Z" fill="#D75050"/>
  </g>,

  <g key="placeholder">
    <path d="M0 108L12 31L35 24L74 42L77 112L0 108Z" fill="#FFEEAA"/>
<path d="M41.692 49.4184C38.208 49.4184 35.166 50.3544 32.566 52.2264C29.966 54.0984 27.964 56.7504 26.56 60.1824C25.208 63.5624 24.532 67.6444 24.532 72.4284C24.532 77.2124 25.234 81.3204 26.638 84.7524C28.042 88.1844 30.018 90.8364 32.566 92.7084C35.166 94.5804 38.208 95.5164 41.692 95.5164C43.824 95.5164 45.826 95.3344 47.698 94.9704C49.622 94.6064 51.338 94.0864 52.846 93.4104V81.7884C52.846 80.8524 52.716 80.2544 52.456 79.9944C52.196 79.7344 51.702 79.5264 50.974 79.3704L43.018 77.9664C42.55 77.9144 42.316 77.6284 42.316 77.1084V74.3004C42.316 73.7804 42.576 73.5204 43.096 73.5204H69.85C70.37 73.5204 70.63 73.7804 70.63 74.3004V77.1084C70.63 77.6284 70.396 77.9664 69.928 78.1224L66.964 79.0584C66.08 79.3184 65.508 79.6304 65.248 79.9944C65.04 80.3584 64.936 80.9044 64.936 81.6324V90.8364L65.482 95.4384C65.534 95.9584 65.508 96.3224 65.404 96.5304C65.3 96.6864 65.04 96.8944 64.624 97.1544C61.972 98.8704 58.67 100.222 54.718 101.21C50.766 102.198 46.476 102.692 41.848 102.692C35.608 102.692 30.096 101.418 25.312 98.8704C20.58 96.3224 16.888 92.7864 14.236 88.2624C11.636 83.6864 10.336 78.4084 10.336 72.4284C10.336 66.4484 11.636 61.1964 14.236 56.6724C16.888 52.1484 20.58 48.6124 25.312 46.0644C30.096 43.5164 35.608 42.2424 41.848 42.2424C45.124 42.2424 48.01 42.5284 50.506 43.1004C53.054 43.6204 55.056 44.1404 56.512 44.6604L59.554 45.2064C60.334 45.3624 60.906 45.5704 61.27 45.8304C61.634 46.0384 61.894 46.4544 62.05 47.0784C62.206 47.7024 62.31 48.6904 62.362 50.0424L63.22 63.1464C63.272 63.6144 63.038 63.9004 62.518 64.0044L59.476 64.3944C58.956 64.4984 58.618 64.2904 58.462 63.7704L55.342 56.4384C54.978 55.6064 54.64 54.9824 54.328 54.5664C54.068 54.1504 53.678 53.6824 53.158 53.1624C51.702 51.9144 49.986 50.9784 48.01 50.3544C46.086 49.7304 43.98 49.4184 41.692 49.4184Z" fill="#D75050"/>
  </g>,

  
];


// ─── Storage helpers ──────────────────────────────────────────────────────────
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
 
// ─── Color naming ─────────────────────────────────────────────────────────────
const NAMED_COLORS = [
  ["black","#000000"],["white","#ffffff"],["red","#ff0000"],["lime","#00ff00"],
  ["blue","#0000ff"],["yellow","#ffff00"],["cyan","#00ffff"],["magenta","#ff00ff"],
  ["silver","#c0c0c0"],["gray","#808080"],["maroon","#800000"],["olive","#808000"],
  ["green","#008000"],["purple","#800080"],["teal","#008080"],["navy","#000080"],
  ["orange","#ffa500"],["coral","#ff7f50"],["salmon","#fa8072"],["gold","#ffd700"],
  ["khaki","#f0e68c"],["indigo","#4b0082"],["violet","#ee82ee"],["pink","#ffc0cb"],
  ["hotpink","#ff69b4"],["crimson","#dc143c"],["tomato","#ff6347"],["chocolate","#d2691e"],
  ["sienna","#a0522d"],["brown","#a52a2a"],["tan","#d2b48c"],["wheat","#f5deb3"],
  ["beige","#f5f5dc"],["ivory","#fffff0"],["lavender","#e6e6fa"],["plum","#dda0dd"],
  ["orchid","#da70d6"],["peru","#cd853f"],["goldenrod","#daa520"],["turquoise","#40e0d0"],
  ["skyblue","#87ceeb"],["steelblue","#4682b4"],["royalblue","#4169e1"],["slateblue","#6a5acd"],
  ["limegreen","#32cd32"],["forestgreen","#228b22"],["darkgreen","#006400"],["seagreen","#2e8b57"],
  ["darkorange","#ff8c00"],["orangered","#ff4500"],["firebrick","#b22222"],["darkred","#8b0000"],
];
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function nearestColorName(hex) {
  if (!hex) return "";
  try {
    const [r,g,b] = hexToRgb(hex);
    let best = "", bestDist = Infinity;
    for (const [name, nhex] of NAMED_COLORS) {
      const [nr,ng,nb] = hexToRgb(nhex);
      const d = (r-nr)**2 + (g-ng)**2 + (b-nb)**2;
      if (d < bestDist) { bestDist = d; best = name; }
    }
    return best;
  } catch { return ""; }
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
 
// ─── Hover info bar ───────────────────────────────────────────────────────────
function HoverBar({ hoverInfo, coordLabel, colorLabel }) {
  return (
    <div className="hover-info-bar">
      {hoverInfo ? (
        <>
          <span className="hover-coord">{coordLabel}</span>
          <span className="hover-divider">·</span>
          <span className="hover-color-dot" style={{ background: hoverInfo.color }} />
          <span className="hover-color-name">{colorLabel}</span>
          <span className="hover-color-hex">{hoverInfo.color}</span>
        </>
      ) : (
        <span style={{ opacity: 0.35 }}>Hover over the canvas</span>
      )}
    </div>
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
            placeholder="What will you make?"
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
 
 
// ─── Unsaved changes modal ────────────────────────────────────────────────────
function UnsavedModal({ onDiscard, onSaveAndContinue, onCancel }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="modal-box modal-box--small"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-icon">⚠️</div>
        <h2 className="modal-title">Unsaved Changes</h2>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
          You have unsaved changes to this pattern. What would you like to do?
        </p>
        <div className="modal-actions" style={{ flexDirection: "column", gap: 10 }}>
          <ABtn onClick={onSaveAndContinue} className="btn-primary" style={{ width: "100%" }}>
            💾 Save &amp; Continue
          </ABtn>
          <ABtn onClick={onDiscard} className="btn-danger">
            Discard Changes
          </ABtn>
          <ABtn onClick={onCancel}>Cancel</ABtn>
        </div>
      </motion.div>
    </motion.div>
  );
}
 
// ─── Controls modal ───────────────────────────────────────────────────────────
const CONTROLS = [
  { key: "Middle Mouse / Scroll",  action: "Pan / move the canvas" },
  { key: "Ctrl + Scroll",        action: "Zoom in and out" },
  { key: "Ctrl + Z",      action: "Undo" },
  { key: "Ctrl + Y",      action: "Redo" },
  { key: "Right-click",   action: "Remove a palette colour" },
  { key: "Space",         action: "Next section (track mode)" },
  { key: "Backspace",     action: "Previous section (track mode)" },
];
 
function ControlsModal({ onClose }) {
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
        style={{ maxWidth: 400 }}
      >
        <h2 className="modal-title">⌨️ Controls</h2>
        <div className="controls-list">
          {CONTROLS.map(({ key, action }) => (
            <div key={key} className="controls-row">
              <kbd className="controls-key">{key}</kbd>
              <span className="controls-action">{action}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 20 }}>
          <ABtn onClick={onClose} className="btn-primary">Got it</ABtn>
        </div>
      </motion.div>
    </motion.div>
  );
}
 
// ─── Editor canvas ────────────────────────────────────────────────────────────
const MAX_COLORS = 24;
const DEFAULT_PALETTE = [
  "#000000", "#ffffff", "#ff4d4d", "#ff9900",
  "#ffff00", "#4dff88", "#4d79ff", "#cc44ff",
  "#8B4513", "#D2691E", "#F5DEB3", "#556B2F",
];
 
function EditorCanvas({ project, onSave, saveRef }) {
  const ref = useRef(null);
  const gridContainerRef = useRef(null);
  const { undo, redo } = useDotting(ref);
 
  const [color, setColor]           = useState("#000000");
  const [tool, setTool]             = useState(BrushTool.DOT);
  const [saved, setSaved]           = useState(false);
  const [dirty, setDirty]           = useState(false); // unsaved changes
  const [eyedropper, setEyedropper] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [hoverInfo, setHoverInfo]   = useState(null);
  const [pickerValue, setPickerValue] = useState("#ff0000");
  const [palette, setPalette]       = useState(() => {
    try {
      const stored = localStorage.getItem("stitchhouse-palette");
      return stored ? JSON.parse(stored) : DEFAULT_PALETTE;
    } catch { return DEFAULT_PALETTE; }
  });
 
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
 
  // Hover tracking
  useEffect(() => {
    if (!ref.current) return;
    const onHover = ({ indices }) => {
      if (!indices) { setHoverInfo(null); return; }
      const { rowIndex, columnIndex } = indices;
      let pixelColor = "";
      try {
        const layers = ref.current.getLayersAsArray();
        pixelColor = layers[0]?.data?.[rowIndex]?.[columnIndex]?.color || "";
      } catch (_) {}
      setHoverInfo({ rowIndex, columnIndex, color: pixelColor || "#ffffff" });
    };
    ref.current.addHoverPixelChangeListener(onHover);
    return () => { ref.current?.removeHoverPixelChangeListener(onHover); };
  }, []);
 
  // Mark dirty after any stroke
  useEffect(() => {
    if (!ref.current) return;
    const onStroke = () => setDirty(true);
    ref.current.addStrokeEndListener(onStroke);
    return () => { ref.current?.removeStrokeEndListener(onStroke); };
  }, []);
 
  // Eyedropper — capture phase mousedown on container
  const hoverInfoRef = useRef(null);
  useEffect(() => { hoverInfoRef.current = hoverInfo; }, [hoverInfo]);
 
  useEffect(() => {
    if (!eyedropper) return;
    const container = gridContainerRef.current;
    if (!container) return;
    const onCapture = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const info = hoverInfoRef.current;
      const picked = info?.color || "#ffffff";
      setColor(picked);
      setPalette(prev =>
        prev.includes(picked) || prev.length >= MAX_COLORS ? prev : [...prev, picked]
      );
      setEyedropper(false);
      setTool(BrushTool.DOT);
    };
    container.addEventListener("mousedown", onCapture, { capture: true });
    return () => container.removeEventListener("mousedown", onCapture, { capture: true });
  }, [eyedropper]);
 
  const initLayers = useMemo(() => {
    const data = project.gridData || {};
    return [{
      id: "layer1",
      data: Array.from({ length: project.rows }, (_, r) =>
        Array.from({ length: project.cols }, (_, c) => ({
          rowIndex: r, columnIndex: c,
          color: data[r]?.[c]?.color || "",
        }))
      ),
    }];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleSave = useCallback(() => {
    if (!ref.current) return;
    try {
      // also register this function so parent can trigger save
      const layers = ref.current.getLayersAsArray();
      const gridData = {};
      layers[0]?.data?.forEach(row =>
        row.forEach(({ rowIndex, columnIndex, color: c }) => {
          if (!c) return;
          if (!gridData[rowIndex]) gridData[rowIndex] = {};
          gridData[rowIndex][columnIndex] = { color: c };
        })
      );
      onSave(gridData);
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) { console.error("[save] error:", e); }
  }, [onSave]);
 
  // Register save function + dirty flag with parent
  useEffect(() => {
    if (saveRef) saveRef.current = { save: handleSave, isDirty: () => dirty };
  }, [saveRef, handleSave, dirty]);
 
  const coordLabel = useMemo(() => {
    if (!hoverInfo) return null;
    const rowFromBottom = project.rows - hoverInfo.rowIndex;
    const colFromLeft = hoverInfo.columnIndex + 1;
    return `${rowFromBottom} ↑ · ${colFromLeft} →`;
  }, [hoverInfo, project.rows]);
 
  const colorLabel = useMemo(() => nearestColorName(hoverInfo?.color), [hoverInfo]);
 
  return (
    <div className="editor">
      <div className="sidebar">
        <h3>Tools</h3>
        <ABtn
          onClick={() => { setTool(BrushTool.DOT); setEyedropper(false); }}
          className={tool === BrushTool.DOT && !eyedropper ? "btn-active" : "btn-secondary"}
        >Brush</ABtn>
        <ABtn
          onClick={() => { setTool(BrushTool.ERASER); setEyedropper(false); }}
          className={tool === BrushTool.ERASER ? "btn-active" : "btn-secondary"}
        >Eraser</ABtn>
        <ABtn
          onClick={() => { setTool(BrushTool.PAINT_BUCKET); setEyedropper(false); }}
          className={tool === BrushTool.PAINT_BUCKET ? "btn-active" : "btn-secondary"}
        >Fill</ABtn>
        <ABtn
          onClick={() => { setEyedropper(e => !e); setTool(BrushTool.DOT); }}
          className={eyedropper ? "btn-active" : "btn-secondary"}
        >Pick Colour</ABtn>
        <ABtn onClick={undo}>↩ Undo</ABtn>
        <ABtn onClick={redo}>↪ Redo</ABtn>
 
        <h3>Canvas</h3>
        <ABtn
          onClick={() => setGridVisible(v => !v)}
          className={gridVisible ? "btn-active" : "btn-secondary"}
        >{gridVisible ? "⊞ Grid On" : "⊟ Grid Off"}</ABtn>
        <ABtn
          onClick={() => setShowControls(true)}
          className="btn-secondary"
        >View Controls</ABtn>
 
        <h3>Colours</h3>
        <div className="color-add-row">
          <motion.div
            className="color-current"
            style={{ background: color }}
            animate={{ boxShadow: `0 0 0 3px ${color}55, 0 0 0 5px white` }}
            transition={{ duration: 0.2 }}
            title="Active color"
          />
          <label className="color-picker-label" title="Pick a colour">
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
        <div className="palette palette--wide">
          {palette.map(c => (
            <motion.button
              key={c}
              className="palette-swatch"
              style={{ background: c, boxShadow: color === c ? "0 0 0 3px #646cff" : "0 0 0 1px #aaa" }}
              onClick={() => { setColor(c); setEyedropper(false); }}
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
          {saved ? "✓ Saved!" : "💾 Save"}
        </motion.button>
      </div>
 
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <HoverBar hoverInfo={hoverInfo} coordLabel={coordLabel} colorLabel={colorLabel} />
        <div
          ref={gridContainerRef}
          className="grid-container"
          style={{ cursor: eyedropper ? "crosshair" : "default" }}
        >
          <Dotting
            ref={ref}
            brushTool={tool}
            brushColor={color}
            backgroundColor="#ffffff"
            width={900}
            height={680}
            isGridFixed={true}
            isGridVisible={gridVisible}
            gridStrokeColor="#cccccc"
            gridStrokeWidth={gridVisible ? 0.5 : 0}
            initLayers={initLayers}
          />
        </div>
      </div>
      {/* Controls popup */}
      <AnimatePresence>
        {showControls && (
          <ControlsModal onClose={() => setShowControls(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
 
// ─── Tracking mode ────────────────────────────────────────────────────────────
function buildSections(gridData, rows, cols, startDir, vertDir) {
  const sections = [];
  const rowOrder = vertDir === "bottom"
    ? Array.from({ length: rows }, (_, i) => rows - 1 - i)
    : Array.from({ length: rows }, (_, i) => i);
 
  rowOrder.forEach((rowIdx, lineNum) => {
    const goRight = startDir === "left" ? lineNum % 2 === 0 : lineNum % 2 === 1;
    const colOrder = goRight
      ? Array.from({ length: cols }, (_, i) => i)
      : Array.from({ length: cols }, (_, i) => cols - 1 - i);
 
    let runColor = null;
    let runCols = [];
 
    const flushRun = () => {
      if (runCols.length === 0) return;
      sections.push({
        rowIndex: rowIdx,
        lineNum: lineNum + 1,
        cols: [...runCols],
        color: runColor || "#ffffff",
        count: runCols.length,
        goRight,
      });
      runCols = [];
    };
 
    colOrder.forEach(c => {
      const color = gridData[rowIdx]?.[c]?.color || "#ffffff";
      if (color === runColor) {
        runCols.push(c);
      } else {
        flushRun();
        runColor = color;
        runCols = [c];
      }
    });
    flushRun();
  });
 
  return sections;
}
 
function RowInstruction({ sections, current, granularity }) {
  const rowSections = sections.filter(s => s.rowIndex === current.rowIndex);
  const sectionIdxInRow = rowSections.indexOf(current);
  const rowInstruction = rowSections.map(s => `${s.count} sc ${nearestColorName(s.color)}`).join(", ");
  const totalSc = rowSections.reduce((n, s) => n + s.count, 0);
 
  return (
    <>
      <div className="track-row-full">
        <div className="track-row-header">
          <span className="track-row-label">Row {current.lineNum}</span>
          <span className="track-direction-badge">
            {current.goRight ? "→ Right" : "← Left"}
          </span>
        </div>
        <p className="track-row-written">{rowInstruction}. ({totalSc} sc)</p>
      </div>
      {granularity === "section" && (
        <div className="track-current">
          <div className="track-current-swatch" style={{ background: current.color }} />
          <div className="track-current-info">
            <span className="track-row-label">
              Section {sectionIdxInRow + 1} of {rowSections.length}
            </span>
            <span className="track-instruction">
              <strong>{current.count} sc</strong> in{" "}
              <strong>{nearestColorName(current.color)}</strong>
              <span className="track-hex"> {current.color}</span>
            </span>
            <span className="track-dir">{current.goRight ? "→ left to right" : "← right to left"}</span>
          </div>
        </div>
      )}
    </>
  );
}
 
function Lookahead({ sections, sectionCursor, cursor, total, granularity, current }) {
  if (granularity === "row") {
    // In row mode: show all color blocks of the current row instead of coming up
    const rowSections = current ? sections.filter(s => s.rowIndex === current.rowIndex) : [];
    return (
      <div className="track-lookahead">
        <p className="track-lookahead-title">This row's blocks:</p>
        {cursor === total - 1 && rowSections.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: 13 }}>🎉 Pattern complete!</p>
        ) : (
          rowSections.map((s, i) => (
            <div key={i} className="track-lookahead-row-group">
              <div className="track-lookahead-swatches">
                <span className="track-lookahead-chip">
                  <span className="track-lookahead-swatch" style={{ background: s.color }} />
                  <strong>{s.count} sc</strong> {nearestColorName(s.color)}
                  <span className="track-hex" style={{ marginLeft: 4 }}>{s.color}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
 
  // Section mode: show only the next row (current row is already shown in RowInstruction)
  const upcomingRows = [];
  const seen = new Set();
  for (const s of sections.slice(sectionCursor + 1)) {
    if (!seen.has(s.rowIndex)) {
      seen.add(s.rowIndex);
      const rowSecs = sections.filter(x => x.rowIndex === s.rowIndex);
      upcomingRows.push({ lineNum: s.lineNum, goRight: s.goRight, rowSecs });
    }
    if (upcomingRows.length >= 1) break; // only show the next row
  }
 
  return (
    <div className="track-lookahead">
      <p className="track-lookahead-title">Coming up:</p>
      {upcomingRows.length === 0 && cursor === total - 1 ? (
        <p style={{ color: "#aaa", fontSize: 13 }}>🎉 Pattern complete!</p>
      ) : (
        upcomingRows.map((row, i) => (
          <div key={i} className="track-lookahead-row-group">
            <span className="track-lookahead-rowlabel">
              Row {row.lineNum} {row.goRight ? "(→)" : "(←)"}
            </span>
            <div className="track-lookahead-swatches">
              {row.rowSecs.map((s, j) => (
                <span key={j} className="track-lookahead-chip">
                  <span className="track-lookahead-swatch" style={{ background: s.color }} />
                  {s.count} sc {nearestColorName(s.color)}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
 
function TrackingMode({ project, dottingRef }) {
  // Read directly from localStorage on mount so we always get the freshest data
  // regardless of whether the parent's active state is stale
  const progress = (() => {
    try {
      const all = loadProjects();
      const found = all.find(p => p.id === project.id);
      return found?.trackProgress || {};
    } catch { return {}; }
  })();
  const [startDir, setStartDir]       = useState(progress.startDir    || "right");
  const [vertDir, setVertDir]         = useState(progress.vertDir     || "bottom");
  const [granularity, setGranularity] = useState(progress.granularity || "section");
  const [cursor, setCursor]           = useState(progress.cursor || 0);
  const [hoverInfo, setHoverInfo]     = useState(null);
  const [gridVisible, setGridVisible] = useState(true);
 
  // Save progress to localStorage whenever cursor or settings change
  const saveProgress = useCallback((update) => {
    const all = loadProjects();
    const idx = all.findIndex(p => p.id === project.id);
    if (idx < 0) return;
    const updated = { ...all[idx], trackProgress: { ...all[idx].trackProgress, ...update } };
    all[idx] = updated;
    saveProjects(all);
    setActiveProject(updated);
 
 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);
 
  // Hover tracking
  useEffect(() => {
    if (!dottingRef.current) return;
    const onHover = ({ indices }) => {
      if (!indices) { setHoverInfo(null); return; }
      const { rowIndex, columnIndex } = indices;
      let pixelColor = "";
      try {
        const layers = dottingRef.current.getLayersAsArray();
        pixelColor = layers[0]?.data?.[rowIndex]?.[columnIndex]?.color || "";
      } catch (_) {}
      setHoverInfo({ rowIndex, columnIndex, color: pixelColor || "#ffffff" });
    };
    dottingRef.current.addHoverPixelChangeListener(onHover);
    return () => { dottingRef.current?.removeHoverPixelChangeListener(onHover); };
  }, [dottingRef]);
 
  const coordLabel = useMemo(() => {
    if (!hoverInfo) return null;
    const { rowIndex, columnIndex } = hoverInfo;
    const crochetRow = vertDir === "bottom" ? project.rows - rowIndex : rowIndex + 1;
    const lineNum = crochetRow - 1;
    const goRight = startDir === "left" ? lineNum % 2 === 0 : lineNum % 2 === 1;
    const stitchNum = goRight ? columnIndex + 1 : project.cols - columnIndex;
    const stitchDir = goRight ? "→" : "←";
    const vertArrow = vertDir === "bottom" ? "↑" : "↓";
    return `${crochetRow} ${vertArrow} · ${stitchNum} ${stitchDir}`;
  }, [hoverInfo, project.rows, project.cols, vertDir, startDir]);
 
  const colorLabel = useMemo(() => nearestColorName(hoverInfo?.color), [hoverInfo]);
 
  const trackInitLayers = useMemo(() => {
    const data = project.gridData || {};
    return [{
      id: "layer1",
      data: Array.from({ length: project.rows }, (_, r) =>
        Array.from({ length: project.cols }, (_, c) => ({
          rowIndex: r, columnIndex: c,
          color: data[r]?.[c]?.color || "",
        }))
      ),
    }];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const sections = useMemo(
    () => buildSections(project.gridData || {}, project.rows, project.cols, startDir, vertDir),
    [project.gridData, project.rows, project.cols, startDir, vertDir]
  );
 
  const rowStarts = useMemo(() => {
    const seen = new Set();
    return sections.reduce((acc, s, i) => {
      if (!seen.has(s.rowIndex)) { seen.add(s.rowIndex); acc.push(i); }
      return acc;
    }, []);
  }, [sections]);
 
  const total = granularity === "section" ? sections.length : rowStarts.length;
  const sectionCursor = granularity === "section" ? cursor : (rowStarts[cursor] ?? 0);
  const current = sections[sectionCursor] ?? null;
 
  // Highlight on canvas
  useEffect(() => {
    if (!dottingRef.current || !current) return;
    const applyHighlight = () => {
      let pixels;
      if (granularity === "row") {
        const rowSecs = sections.filter(s => s.rowIndex === current.rowIndex);
        pixels = rowSecs.flatMap(s => s.cols.map(c => ({
          rowIndex: s.rowIndex, columnIndex: c, color: "#646cff",
        })));
      } else {
        pixels = current.cols.map(c => ({
          rowIndex: current.rowIndex, columnIndex: c, color: "#646cff",
        }));
      }
      try { dottingRef.current.setIndicatorPixels(pixels); } catch (_) {}
    };
    // Small delay on first mount to let the canvas finish initialising
    const t = setTimeout(applyHighlight, 100);
    applyHighlight(); // also try immediately for subsequent changes
    return () => {
      clearTimeout(t);
      try { dottingRef.current?.setIndicatorPixels([]); } catch (_) {}
    };
  }, [cursor, sections, granularity, dottingRef]);
 
  // Use a ref for cursor so keyboard handler always sees latest value
  const cursorRef = useRef(cursor);
  useEffect(() => { cursorRef.current = cursor; }, [cursor]);
 
  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        const n = Math.min(cursorRef.current + 1, total - 1);
        setCursor(n);
        saveProgress({ cursor: n, startDir, vertDir, granularity });
      }
      if (e.code === "Backspace") {
        e.preventDefault();
        const n = Math.max(cursorRef.current - 1, 0);
        setCursor(n);
        saveProgress({ cursor: n, startDir, vertDir, granularity });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, saveProgress, startDir, vertDir, granularity]);
 
  // Only reset cursor when settings actually change from their initial values
  const prevSettings = useRef({ startDir, vertDir, granularity });
  useEffect(() => {
    const prev = prevSettings.current;
    if (prev.startDir === startDir && prev.vertDir === vertDir && prev.granularity === granularity) return;
    prevSettings.current = { startDir, vertDir, granularity };
    setCursor(0);
    saveProgress({ cursor: 0, startDir, vertDir, granularity });
  }, [startDir, vertDir, granularity]);
 
  const prev = () => {
    const n = Math.max(cursorRef.current - 1, 0);
    setCursor(n);
    saveProgress({ cursor: n, startDir, vertDir, granularity });
  };
  const next = () => {
    const n = Math.min(cursorRef.current + 1, total - 1);
    setCursor(n);
    saveProgress({ cursor: n, startDir, vertDir, granularity });
  };
 
  return (
    <div className="track-layout">
      <div className="track-settings">
        <span className="track-settings-label">Step by:</span>
        <ABtn
          onClick={() => { setGranularity("section"); setCursor(0); }}
          className={granularity === "section" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >Color section</ABtn>
        <ABtn
          onClick={() => { setGranularity("row"); setCursor(0); }}
          className={granularity === "row" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >Whole row</ABtn>
        <span className="track-settings-label" style={{ marginLeft: 12 }}>Start dir:</span>
        <ABtn
          onClick={() => setStartDir("left")}
          className={startDir === "left" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >← Left first</ABtn>
        <ABtn
          onClick={() => setStartDir("right")}
          className={startDir === "right" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >Right first →</ABtn>
        <span className="track-settings-label" style={{ marginLeft: 12 }}>Direction:</span>
        <ABtn
          onClick={() => setVertDir("bottom")}
          className={vertDir === "bottom" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >↑ Bottom up</ABtn>
        <ABtn
          onClick={() => setVertDir("top")}
          className={vertDir === "top" ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >↓ Top down</ABtn>
        <span className="track-settings-label" style={{ marginLeft: 12 }}>Grid:</span>
        <ABtn
          onClick={() => setGridVisible(v => !v)}
          className={gridVisible ? "btn-active btn-sm" : "btn-secondary btn-sm"}
        >{gridVisible ? "⊞ On" : "⊟ Off"}</ABtn>
      </div>
 
      <div className="track-body">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <HoverBar hoverInfo={hoverInfo} coordLabel={coordLabel} colorLabel={colorLabel} />
          <div className="track-canvas-wrap">
            <Dotting
              key={`track-canvas-${gridVisible}`}
              ref={dottingRef}
              brushTool={BrushTool.DOT}
              backgroundColor="#ffffff"
              width={900}
              height={680}
              isGridFixed={true}
              isDrawingEnabled={false}
              isGridVisible={gridVisible}
              gridStrokeColor="#cccccc"
              gridStrokeWidth={gridVisible ? 0.5 : 0}
              initLayers={trackInitLayers}
            />
          </div>
        </div>
 
        <div className="track-panel">
          {/* Progress pinned at top, outside scroll */}
          <div className="track-progress-bar">
            <div
              className="track-progress-fill"
              style={{ width: `${total ? ((cursor + 1) / total) * 100 : 0}%` }}
            />
          </div>
          <p className="track-progress-text">
            {granularity === "section"
              ? `${cursor + 1} / ${total} sections`
              : `Row ${cursor + 1} / ${total}`}
          </p>
 
          <div className="track-panel-scroll">
            {current && (
              <RowInstruction
                sections={sections}
                current={current}
                granularity={granularity}
              />
            )}
 
            <Lookahead
              sections={sections}
              sectionCursor={sectionCursor}
              cursor={cursor}
              total={total}
              granularity={granularity}
              current={current}
            />
          </div>
 
          <div className="track-nav">
            <motion.button
              onClick={prev}
              className="track-nav-btn track-nav-btn--back"
              disabled={cursor === 0}
              whileHover={cursor === 0 ? {} : { scale: 1.05, x: -2 }}
              whileTap={cursor === 0 ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >← Back</motion.button>
            <span className="track-nav-hint">Space / Backspace</span>
            <motion.button
              onClick={next}
              className="track-nav-btn track-nav-btn--next"
              disabled={cursor === total - 1}
              whileHover={cursor === total - 1 ? {} : { scale: 1.05, x: 2 }}
              whileTap={cursor === total - 1 ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >Next →</motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── Grid page ────────────────────────────────────────────────────────────────
function Grid() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [active, setActiveState]  = useState(getActiveProject);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("draw");
  const [unsavedTarget, setUnsavedTarget] = useState(null); // {action: fn} pending confirmation
  const sharedDottingRef          = useRef(null);
  const activeRef                 = useRef(active);
  const editorSaveRef             = useRef(null); // set by EditorCanvas to trigger save
  useEffect(() => { activeRef.current = active; }, [active]);
 
  useEffect(() => {
    if (location.search.includes("new=1")) setShowModal(true);
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
    // Read fresh from storage to preserve trackProgress saved by TrackingMode
    const all = loadProjects();
    const idx = all.findIndex(p => p.id === current.id);
    const existing = idx >= 0 ? all[idx] : current;
    const updated = { ...existing, gridData, updatedAt: new Date().toISOString(), lastSavedAt: new Date().toISOString() };
    if (idx >= 0) all[idx] = updated; else all.unshift(updated);
    saveProjects(all);
    setActiveProject(updated);
    setActiveState(updated);
  }, []);
 
  // Warn on page reload / tab close when there are unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (editorSaveRef.current?.isDirty?.()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
 
  // Wrap potentially destructive actions with unsaved check
  const guardUnsaved = (action) => {
    if (editorSaveRef.current?.isDirty?.()) {
      setUnsavedTarget({ action });
    } else {
      action();
    }
  };
 
  const handleClose = () => {
    guardUnsaved(() => {
      setActiveProject(null);
      setActiveState(null);
    });
  };
 
  return (
    <motion.div
      className="grid-page page-bg"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid-content">
        {/* Page title — always visible */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: -100 }}
        >
          <PageTitle viewBox="60 0 180 250" maxWidth={300}>
            {GRID_LETTER_BLOCKS}
          </PageTitle>
        </motion.div>
 
        {!active ? (
          <motion.div
            className="no-project-prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
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
                <ABtn onClick={() => guardUnsaved(() => setShowModal(true))} className="btn-secondary">+ New</ABtn>
                <ABtn onClick={handleClose} className="btn-secondary">Close</ABtn>
              </div>
            </div>
 
            <div className="mode-toggle">
              <motion.button
                className={`learn-tab${mode === "draw" ? " learn-tab--active" : ""}`}
                onClick={() => setMode("draw")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >Draw</motion.button>
              <motion.button
                className={`learn-tab${mode === "track" ? " learn-tab--active" : ""}`}
                onClick={() => { editorSaveRef.current?.save(); setMode("track"); }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >Track Progress</motion.button>
            </div>
 
            {mode === "draw" ? (
              <DottingBoundary>
                <EditorCanvas
                  key={active.id}
                  project={active}
                  onSave={handleSave}
                  saveRef={editorSaveRef}
                />
              </DottingBoundary>
            ) : (
              <TrackingMode
                project={active}
                dottingRef={sharedDottingRef}
              />
            )}
          </motion.div>
        )}
      </div>
 
      <AnimatePresence>
        {showModal && (
          <NewProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
 
      {/* Unsaved changes warning */}
      <AnimatePresence>
        {unsavedTarget && (
          <UnsavedModal
            onDiscard={() => { unsavedTarget.action(); setUnsavedTarget(null); }}
            onSaveAndContinue={() => {
              editorSaveRef.current?.save();
              unsavedTarget.action();
              setUnsavedTarget(null);
            }}
            onCancel={() => setUnsavedTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
 
export default Grid;