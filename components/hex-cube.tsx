"use client";

import { useEffect, useRef } from "react";

interface HexCubeProps {
  size?: number;
  className?: string;
}

/**
 * HexCube: 3D Isometric Rotating Wireframe Cube with Chromatic Aberration (RGB Split)
 * Based on the reference cyber isometric tesseract GIF.
 */
export function HexCube({ size = 32, className = "" }: HexCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 8 Vertices of a 3D Cube
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];

    // 12 Edges connecting vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back square
      [4, 5], [5, 6], [6, 7], [7, 4], // front square
      [0, 4], [1, 5], [2, 6], [3, 7]  // vertical posts
    ];

    // Inner spokes forming sacred geometry / tesseract spokes
    const innerSpokes = [
      [0, 6], [1, 7], [2, 4], [3, 5]
    ];
    const allEdges = edges.concat(innerSpokes);

    // Initial isometric rotation angles
    let rotX = Math.atan(1 / Math.SQRT2); // ~35.264°
    let rotY = Math.PI / 4;               // 45°
    let rotZ = 0;

    const velX = 0.007;
    const velY = 0.012;
    const velZ = 0.004;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      rotY += dx * 0.015;
      rotX += dy * 0.015;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);

    let glitchTimer = 0;
    let glitchActive = false;
    let glitchOffset = 1.4;
    let animId: number;

    const render = () => {
      if (!reduceMotion && !isDragging) {
        rotX += velX;
        rotY += velY;
        rotZ += velZ;
      }

      glitchTimer++;
      if (glitchTimer % 140 === 0) {
        glitchActive = true;
        glitchOffset = 3.2 + Math.random() * 2.2;
      } else if (glitchActive && glitchTimer % 140 === 6) {
        glitchActive = false;
        glitchOffset = 1.4;
      }

      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.36;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      const projected: { x: number; y: number }[] = [];

      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];

        // Y rotation
        const x1 = v[0] * cosY - v[2] * sinY;
        const z1 = v[0] * sinY + v[2] * cosY;

        // X rotation
        const y2 = v[1] * cosX - z1 * sinX;
        const z2 = v[1] * sinX + z1 * cosX;

        // Z rotation
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = x1 * sinZ + y2 * cosZ;

        // Perspective scale
        const pDist = 3.2;
        const scale = pDist / (pDist + z2);

        projected.push({
          x: cx + x3 * radius * scale,
          y: cy + y3 * radius * scale,
        });
      }

      const drawPass = (color: string, width: number, ox: number, oy: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let e = 0; e < allEdges.length; e++) {
          const p1 = projected[allEdges[e][0]];
          const p2 = projected[allEdges[e][1]];
          ctx.moveTo(p1.x + ox, p1.y + oy);
          ctx.lineTo(p2.x + ox, p2.y + oy);
        }
        ctx.stroke();
      };

      // Pass 1: Red/Orange Chromatic Dispersion
      const rColor = glitchActive ? "rgba(255, 50, 80, 0.95)" : "rgba(255, 80, 50, 0.85)";
      drawPass(rColor, 1.3, -glitchOffset, -glitchOffset * 0.6);

      // Pass 2: Cyan/Blue Chromatic Dispersion
      const cColor = glitchActive ? "rgba(0, 240, 255, 0.95)" : "rgba(0, 210, 255, 0.85)";
      drawPass(cColor, 1.3, glitchOffset, glitchOffset * 0.6);

      // Pass 3: White Central Core
      drawPass("rgba(255, 255, 255, 0.96)", 1.1, 0, 0);

      // Corner nodes
      for (let p = 0; p < projected.length; p++) {
        const pt = projected[p];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      if (!reduceMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, [size]);

  return (
    <div
      className={`hex-cube-wrapper ${className}`}
      style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      title="Quantum 3D Isometric Wireframe Cube — drag or hover to interact"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, display: "block", cursor: "grab" }}
      />
    </div>
  );
}
