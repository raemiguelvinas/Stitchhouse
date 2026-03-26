import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";

// ─── Individual animated letter ───────────────────────────────────────────────
function AnimatedLetter({ children, index, viewBox, width, height }) {
  const controls = useAnimation();
  let spinning = false;

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        type: "spring",
        stiffness: 200,
        damping: 12,
      },
    });
  }, [controls, index]);

  const handleHover = async () => {
    if (spinning) return;
    spinning = true;
    await controls.set({ rotate: 0 });
    await controls.start({
      rotate: 360,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    spinning = false;
  };

  return (
    <motion.g
      initial={{ opacity: 0, y: -20, rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHover}
      filter="url(#page-title-shadow)"
      style={{ originX: 0.5, originY: 0.5 }}
    >
      {children}
    </motion.g>
  );
}

// ─── PageTitle ────────────────────────────────────────────────────────────────
// Usage:
//   <PageTitle viewBox="0 0 507 294" maxWidth={600}>
//     {LETTER_BLOCKS}
//   </PageTitle>
//
// Where LETTER_BLOCKS is an array of <g> elements, one per letter.
// Each <g> should have a unique key.

export default function PageTitle({ children, viewBox, maxWidth = 500 }) {
  const letters = Array.isArray(children) ? children : [children];

  return (
    <svg
      viewBox={viewBox}
      style={{ width: "100%", maxWidth, height: "300" }}
      overflow="visible"
    >
      <defs>
        <filter
          id="page-title-shadow"
          x="-50"
          y="-50"
          width="200%"
          height="200%"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="3" dy="4" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
        </filter>
      </defs>

      {letters.map((letter, i) => (
        <AnimatedLetter key={letter.key ?? i} index={i}>
          {letter}
        </AnimatedLetter>
      ))}
    </svg>
  );
}