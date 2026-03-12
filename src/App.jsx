import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import Grid from "./pages/Grid";
import Saved from "./pages/Saved";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;