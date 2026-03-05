import { useRef, useState, useEffect } from "react";
import { Dotting, BrushTool } from "dotting";
import bg from "../images/home-bg.png";

function Grid() {
  const dottingRef = useRef(null);

  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState(BrushTool.DOT);

  // Save grid state to localStorage whenever it changes (unused, persistence doesn't currently work)
  const saveGrid = () => {
    if (dottingRef.current) {
      const data = dottingRef.current.getData();
      localStorage.setItem("stitchhouse-grid", JSON.stringify(data));
    }
  };

  // Undo/redo helpers
  const undo = () => {
    dottingRef.current?.undo();
    saveGrid();
  };
  const redo = () => {
    dottingRef.current?.redo();
    saveGrid();
  };

  // Load saved grid on mount
  useEffect(() => {
    const saved = localStorage.getItem("stitchhouse-grid");
    if (saved && dottingRef.current) {
      dottingRef.current.setData(JSON.parse(saved));
    }
  }, []);

  return (
    <div
      className="grid-page"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="grid-content">
        <div className="editor">

          {/* Sidebar */}
          <div className="sidebar">
            <h3>Tools</h3>
            <button onClick={() => setTool(BrushTool.DOT)}>Brush</button>
            <button onClick={() => setTool(BrushTool.ERASER)}>Eraser</button>
            <button onClick={() => setTool(BrushTool.PAINT_BUCKET)}>Paint Bucket</button>
            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>

            <h3>Colors</h3>
            <div className="palette">
              <button style={{ background: "#000" }} onClick={() => setColor("#000")} />
              <button style={{ background: "#ff4d4d" }} onClick={() => setColor("#ff4d4d")} />
              <button style={{ background: "#4d79ff" }} onClick={() => setColor("#4d79ff")} />
            </div>
          </div>

          {/* Grid */}
          <div className="grid-container">
            <Dotting
              ref={dottingRef}
              brushTool={tool}
              brushColor={color}
              backgroundColor="#ffffff"
              width={700}
              height={500}
              rows={30}
              columns={40}
              onChange={saveGrid} // attempt to save whenever user edits
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Grid;