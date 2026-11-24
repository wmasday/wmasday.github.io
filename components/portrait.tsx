"use client";

import { useEffect, useRef } from "react";

export function Portrait({
  eager = false,
  src = "/assets/img/muhammad-square.png",
}: {
  eager?: boolean;
  src?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // High density grid for intricate ASCII character fidelity
    const gridW = 60;
    const gridH = 60;
    const offscreen = document.createElement("canvas");
    offscreen.width = gridW;
    offscreen.height = gridH;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });

    let pixelData: Uint8ClampedArray | null = null;
    const img = new Image();
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;

    const loadPixels = () => {
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, gridW, gridH);
      try {
        pixelData = offCtx.getImageData(0, 0, gridW, gridH).data;
      } catch (err) {
        console.warn("Pixel data read warning:", err);
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      loadPixels();
    } else {
      img.onload = loadPixels;
    }

    const asciiRamp = [" ", "·", ":", "+", "x", "*", "░", "%", "▒", "#", "▓", "█", "@"];
    const cyberGlyphs = ["0", "1", "X", "/", "#", "_", ">", "!", "░", "▓", "█"];

    let glitchRows: { start: number; end: number }[] = [];
    let glitchShift: number[] = [];
    let glitchTimer = 0;
    let isHeavyGlitch = false;

    const mouse = { x: -1000, y: -1000, active: false };

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mouseleave", onPointerLeave);

    let animId: number;

    const render = (timestamp: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const cellW = width / gridW;
      const cellH = height / gridH;

      // Transparent canvas background: no card box, no borders
      ctx.clearRect(0, 0, width, height);

      // Glitch timing logic
      glitchTimer++;
      if (glitchTimer % 40 === 0) {
        glitchRows = [];
        glitchShift = [];
        const count = Math.floor(Math.random() * 4) + 1;
        isHeavyGlitch = Math.random() < 0.3;
        for (let s = 0; s < count; s++) {
          const start = Math.floor(Math.random() * (gridH - 5));
          const span = Math.floor(Math.random() * 5) + 2;
          const off = (Math.random() - 0.5) * (isHeavyGlitch ? 36 : 20);
          glitchRows.push({ start, end: start + span });
          glitchShift.push(off);
        }
      } else if (glitchTimer % 40 === 8) {
        glitchRows = [];
        glitchShift = [];
        isHeavyGlitch = false;
      }

      if (!pixelData) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let y = 0; y < gridH; y++) {
        let rowOffset = 0;
        let isGlitched = false;
        for (let g = 0; g < glitchRows.length; g++) {
          if (y >= glitchRows[g].start && y <= glitchRows[g].end) {
            rowOffset = glitchShift[g];
            isGlitched = true;
            break;
          }
        }

        for (let x = 0; x < gridW; x++) {
          const idx = (y * gridW + x) * 4;
          const r = pixelData[idx];
          const gVal = pixelData[idx + 1];
          const b = pixelData[idx + 2];
          const a = pixelData[idx + 3];

          // Exclude transparent background so ONLY the person is drawn
          if (a < 35) continue;

          // Grayscale luminance (0.0 to 1.0)
          let lum = (r * 0.299 + gVal * 0.587 + b * 0.114) / 255;
          lum = Math.pow(lum, 1.15);

          let px = x * cellW + cellW / 2 + rowOffset;
          let py = y * cellH + cellH / 2;

          // Mouse magnetic ripple physics
          if (mouse.active) {
            const mdx = px - mouse.x;
            const mdy = py - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 90) {
              const force = (1 - mdist / 90) * 11;
              px += (mdx / mdist) * force;
              py += (mdy / mdist) * force;
            }
          }

          if (isGlitched && isHeavyGlitch && Math.random() < 0.18) {
            lum = 1 - lum;
          }

          // Choose ASCII character or cyber glitch symbol
          let char: string;
          let isCyberGlyph = false;

          if (isGlitched && Math.random() < 0.4) {
            char = cyberGlyphs[Math.floor(Math.random() * cyberGlyphs.length)];
            isCyberGlyph = true;
          } else {
            const charIdx = Math.min(asciiRamp.length - 1, Math.floor(lum * (asciiRamp.length - 1)));
            char = asciiRamp[charIdx];
          }

          // Luminance-scaled white opacity
          const alpha = isCyberGlyph ? 0.95 : Math.min(1, Math.max(0.24, lum * 1.25));
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;

          if (lum > 0.68 || isCyberGlyph) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
            ctx.shadowBlur = 3;
          } else {
            ctx.shadowBlur = 0;
          }

          const fontSize = Math.floor(cellW * (isCyberGlyph ? 1.4 : 1.2));
          ctx.font = `bold ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
          ctx.fillText(char, px, py);

          // Glitch ghost trail
          if (isGlitched && Math.random() < 0.2) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.fillText(char, px - 6, py);
          }
        }
      }

      ctx.shadowBlur = 0;

      // Subtle CRT raster scanline
      if (!reduceMotion) {
        const scanY = (timestamp * 0.08) % height;
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.fillRect(0, scanY, width, 1.5);
      }

      if (!reduceMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onPointerMove);
      canvas.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [src]);

  return (
    <div className="ascii-portrait-wrap" aria-label="Monochrome ASCII Glitch Portrait">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="ascii-canvas"
      />
    </div>
  );
}
