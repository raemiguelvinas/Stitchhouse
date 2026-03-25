import { useRef, useState, useEffect, useCallback, useMemo, Component } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dotting, useDotting, BrushTool } from "dotting";
import bg from "../images/home-bg.png";

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
  const [eyedropper, setEyedropper] = useState(false);
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
      setTimeout(() => setSaved(false), 1800);
    } catch (e) { console.error("[save] error:", e); }
  }, [onSave]);

  // Register save function with parent so mode-switch can trigger it
  useEffect(() => {
    if (saveRef) saveRef.current = handleSave;
  }, [saveRef, handleSave]);

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
        >✏️ Brush</ABtn>
        <ABtn
          onClick={() => { setTool(BrushTool.ERASER); setEyedropper(false); }}
          className={tool === BrushTool.ERASER ? "btn-active" : "btn-secondary"}
        >⬜ Eraser</ABtn>
        <ABtn
          onClick={() => { setTool(BrushTool.PAINT_BUCKET); setEyedropper(false); }}
          className={tool === BrushTool.PAINT_BUCKET ? "btn-active" : "btn-secondary"}
        >🪣 Fill</ABtn>
        <ABtn
          onClick={() => { setEyedropper(e => !e); setTool(BrushTool.DOT); }}
          className={eyedropper ? "btn-active" : "btn-secondary"}
        >🩸 Pick</ABtn>
        <ABtn onClick={undo}>↩ Undo</ABtn>
        <ABtn onClick={redo}>↪ Redo</ABtn>
        <ABtn
          onClick={() => setGridVisible(v => !v)}
          className={gridVisible ? "btn-active" : "btn-secondary"}
        >{gridVisible ? "⊞ Grid On" : "⊟ Grid Off"}</ABtn>

        <h3>Colors</h3>
        <div className="color-add-row">
          <motion.div
            className="color-current"
            style={{ background: color }}
            animate={{ boxShadow: `0 0 0 3px ${color}55, 0 0 0 5px white` }}
            transition={{ duration: 0.2 }}
            title="Active color"
          />
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
        <span className="track-row-label">
          Row {current.lineNum} {current.goRight ? "(→)" : "(←)"}
        </span>
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

  // Section mode: show upcoming rows
  const upcomingRows = [];
  const seen = new Set();
  for (const s of sections.slice(sectionCursor + 1)) {
    if (!seen.has(s.rowIndex)) {
      seen.add(s.rowIndex);
      const rowSecs = sections.filter(x => x.rowIndex === s.rowIndex);
      upcomingRows.push({ lineNum: s.lineNum, goRight: s.goRight, rowSecs });
    }
    if (upcomingRows.length >= 4) break;
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

  // ─── Progress bar: always based on rows completed, not sections ──────────
  // In section mode, find which row index (0-based) we're currently on,
  // then express that as a fraction of total rows.
  const progressPct = useMemo(() => {
    if (!project.rows) return 0;
    if (granularity === "row") {
      return ((cursor + 1) / total) * 100;
    }
    // Section mode: cursor indexes into sections[]. Find how many rowStarts
    // are at or before the current sectionCursor — that's the completed-row count.
    const currentRowIndex = rowStarts.findIndex(startIdx => startIdx > sectionCursor);
    // currentRowIndex === -1 means we're on the last row (all rowStarts are <= sectionCursor)
    const rowNum = currentRowIndex === -1 ? rowStarts.length : currentRowIndex;
    return (rowNum / rowStarts.length) * 100;
  }, [granularity, cursor, total, sectionCursor, rowStarts, project.rows]);

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
    const t = setTimeout(applyHighlight, 100);
    applyHighlight();
    return () => {
      clearTimeout(t);
      try { dottingRef.current?.setIndicatorPixels([]); } catch (_) {}
    };
  }, [cursor, sections, granularity, dottingRef]);

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
              width={760}
              height={580}
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
          <div className="track-panel-scroll">
            <div className="track-progress-bar">
              <div
                className="track-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="track-progress-text">
              {granularity === "section"
                ? `Row ${current?.lineNum ?? 0} / ${project.rows} · section ${cursor + 1} / ${total}`
                : `Row ${cursor + 1} / ${total}`}
            </p>

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
            <ABtn onClick={prev} className="btn-secondary" disabled={cursor === 0}>← Back</ABtn>
            <span className="track-nav-hint">or Space / Backspace</span>
            <ABtn onClick={next} className="btn-primary" disabled={cursor === total - 1}>Next →</ABtn>
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
  const sharedDottingRef          = useRef(null);
  const activeRef                 = useRef(active);
  const editorSaveRef             = useRef(null);
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
    const all = loadProjects();
    const idx = all.findIndex(p => p.id === current.id);
    const existing = idx >= 0 ? all[idx] : current;
    const updated = { ...existing, gridData, updatedAt: new Date().toISOString() };
    if (idx >= 0) all[idx] = updated; else all.unshift(updated);
    saveProjects(all);
    setActiveProject(updated);
    setActiveState(updated);
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

            <div className="mode-toggle">
              <ABtn
                onClick={() => setMode("draw")}
                className={mode === "draw" ? "btn-active" : "btn-secondary"}
              >✏️ Draw</ABtn>
              <ABtn
                onClick={() => { editorSaveRef.current?.(); setMode("track"); }}
                className={mode === "track" ? "btn-active" : "btn-secondary"}
              >🧶 Track Progress</ABtn>
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
    </motion.div>
  );
}

export default Grid;