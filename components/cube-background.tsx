"use client";

import { useEffect, useRef } from "react";

/**
 * CubeBackground: 3D Isometric Compound Wireframe with Chromatic Aberration
 * Ultra-crisp, HD modern developer aesthetic.
 * Fixed viewport background with strict mathematical boundary containment
 * guaranteeing ZERO edge clipping across all screen sizes (mobile to ultra-wide).
 */
export function CubeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 8 vertices of the outer 3D unit cube
    const outerVertices = [
      [-1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [-1,  1, -1],
      [-1, -1,  1], [ 1, -1,  1], [ 1,  1,  1], [-1,  1,  1]
    ];

    // 12 outer edges
    const outerEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // 4 isometric inner cross axes meeting at center
    const innerSpokes = [
      [0, 6], [1, 7], [2, 4], [3, 5]
    ];
    const allOuterEdges = outerEdges.concat(innerSpokes);

    // Inner octahedral core (6 vertices at ±0.52)
    const innerVertices = [
      [ 0.52,  0,     0    ],
      [-0.52,  0,     0    ],
      [ 0,     0.52,  0    ],
      [ 0,    -0.52,  0    ],
      [ 0,     0,     0.52 ],
      [ 0,     0,    -0.52 ]
    ];

    // 12 edges of octahedron connecting the axial poles
    const innerEdges = [
      [0, 2], [2, 1], [1, 3], [3, 0],
      [0, 4], [4, 1], [1, 5], [5, 0],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];

    // Initial isometric rotation angles
    let rotX = Math.atan(1 / Math.SQRT2); // ~35.264°
    let rotY = Math.PI / 4;               // 45°
    let rotZ = 0;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    let width = 0;
    let height = 0;

    const onResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    onResize();
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      const cxScreen = window.innerWidth / 2;
      const cyScreen = window.innerHeight / 2;
      targetParallaxX = (e.clientX - cxScreen) / cxScreen;
      targetParallaxY = (e.clientY - cyScreen) / cyScreen;
    };

    window.addEventListener("mousemove", onMouseMove);

    let glitchTimer = 0;
    let glitchActive = false;
    let glitchOffset = 1.3;
    let animId: number;

    const render = () => {
      if (!reduceMotion) {
        rotX += 0.0032;
        rotY += 0.0048;
        rotZ += 0.0016;
      }

      // Smooth mouse parallax damping
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;

      // Scroll fade: gently dim out as user scrolls past hero into articles
      const scrollY = window.scrollY || 0;
      const scrollFade = Math.max(0, Math.min(1, 1 - scrollY / 520));

      ctx.clearRect(0, 0, width, height);

      if (scrollFade <= 0.01) {
        if (!reduceMotion) animId = requestAnimationFrame(render);
        return;
      }

      glitchTimer++;
      if (glitchTimer % 180 === 0) {
        glitchActive = true;
        glitchOffset = 3.6;
      } else if (glitchActive && glitchTimer % 180 === 6) {
        glitchActive = false;
        glitchOffset = 1.3;
      }

      const isMobile = width < 768;

      // Positioned on the left side of the hero section
      const cx = isMobile
        ? Math.max(85, Math.min(width * 0.35, 150))
        : Math.max(160, Math.min(width * 0.22, 280));
      const cy = isMobile
        ? Math.max(110, Math.min(height * 0.26, 185))
        : Math.max(170, Math.min(height * 0.45, 360));

      // Strictly calculate distance to all 4 edges of the viewport
      const distLeft = cx;
      const distRight = width - cx;
      const distTop = cy;
      const distBottom = height - cy;
      const minMargin = Math.min(distLeft, distRight, distTop, distBottom);

      // Max projected vertex distance formula:
      // maxDist = radius * sqrt(3) * maxPerspectiveScale (approx 1.45) = radius * 2.51
      // Safe boundary: radius * 2.51 + glitchOffset + 8px < minMargin - 25px
      // => radius <= (minMargin - 35) / 2.55
      const maxContainmentRadius = Math.max(25, (minMargin - 35) / 2.55);
      const targetRadius = isMobile
        ? Math.min(50, width * 0.14)
        : Math.min(115, width * 0.10);
      const radius = Math.min(maxContainmentRadius, targetRadius);

      // Rotation angles with parallax
      const rX = rotX + currentParallaxY * 0.12;
      const rY = rotY + currentParallaxX * 0.16;
      const rZ = rotZ;

      const project = (
        verts: number[][],
        rXVal: number,
        rYVal: number,
        rZVal: number,
        scaleFactor: number
      ) => {
        const cosX = Math.cos(rXVal), sinX = Math.sin(rXVal);
        const cosY = Math.cos(rYVal), sinY = Math.sin(rYVal);
        const cosZ = Math.cos(rZVal), sinZ = Math.sin(rZVal);
        const pDist = 5.5;

        return verts.map((v) => {
          const x1 = v[0] * cosY - v[2] * sinY;
          const z1 = v[0] * sinY + v[2] * cosY;

          const y2 = v[1] * cosX - z1 * sinX;
          const z2 = v[1] * sinX + z1 * cosX;

          const x3 = x1 * cosZ - y2 * sinZ;
          const y3 = x1 * sinZ + y2 * cosZ;

          const pScale = pDist / (pDist + z2);

          return {
            x: cx + x3 * radius * scaleFactor * pScale,
            y: cy + y3 * radius * scaleFactor * pScale,
            z: z2,
          };
        });
      };

      const outerProjected = project(outerVertices, rX, rY, rZ, 1.0);
      const innerProjected = project(
        innerVertices,
        -rX * 1.3,
        rY * 1.6,
        -rZ * 1.2,
        0.95
      );

      // Sort edges by Z-depth for 3D realism
      const sortedOuterEdges = allOuterEdges
        .map(([i, j]) => ({
          p1: outerProjected[i],
          p2: outerProjected[j],
          depth: (outerProjected[i].z + outerProjected[j].z) / 2,
        }))
        .sort((a, b) => a.depth - b.depth);

      const sortedInnerEdges = innerEdges
        .map(([i, j]) => ({
          p1: innerProjected[i],
          p2: innerProjected[j],
          depth: (innerProjected[i].z + innerProjected[j].z) / 2,
        }))
        .sort((a, b) => a.depth - b.depth);

      // Draw Edges with 3-Pass Chromatic Dispersion
      const drawEdgePass = (
        edges: { p1: { x: number; y: number; z: number }; p2: { x: number; y: number; z: number }; depth: number }[],
        colorPrefix: string,
        widthMultiplier: number,
        ox: number,
        oy: number,
        baseAlpha: number
      ) => {
        for (let e = 0; e < edges.length; e++) {
          const { p1, p2, depth } = edges[e];
          const depthAlpha = Math.min(1, Math.max(0.2, (depth + 2.0) / 4.0));
          const strokeAlpha = (depthAlpha * baseAlpha * scrollFade).toFixed(2);

          ctx.beginPath();
          ctx.strokeStyle = `${colorPrefix}${strokeAlpha})`;
          ctx.lineWidth = Math.max(0.65, widthMultiplier * depthAlpha);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(p1.x + ox, p1.y + oy);
          ctx.lineTo(p2.x + ox, p2.y + oy);
          ctx.stroke();
        }
      };

      const rAlpha = glitchActive ? 0.95 : 0.44;
      const cAlpha = glitchActive ? 0.95 : 0.44;

      // 1. Draw Inner Octahedron Core (Refined subtle cyber core)
      drawEdgePass(sortedInnerEdges, `rgba(0, 230, 255, `, 0.8, glitchOffset * 0.5, glitchOffset * 0.3, cAlpha * 0.5);
      drawEdgePass(sortedInnerEdges, `rgba(255, 255, 255, `, 0.7, 0, 0, 0.45);

      // 2. Draw Outer Isometric Cube with Chromatic Glitch Dispersion
      // Pass 1: Red/Orange Dispersion
      drawEdgePass(sortedOuterEdges, `rgba(255, 60, 50, `, rAlpha * 1.25, -glitchOffset, -glitchOffset * 0.6, rAlpha);
      // Pass 2: Cyan/Blue Dispersion
      drawEdgePass(sortedOuterEdges, `rgba(0, 230, 255, `, cAlpha * 1.25, glitchOffset, glitchOffset * 0.6, cAlpha);
      // Pass 3: Crisp White Center Core
      drawEdgePass(sortedOuterEdges, `rgba(255, 255, 255, `, 0.85, 0, 0, 0.75);

      // 3. Glowing Corner Nodes at all 8 outer vertices
      for (let p = 0; p < outerProjected.length; p++) {
        const pt = outerProjected[p];
        const depthAlpha = Math.min(1, Math.max(0.25, (pt.z + 2.0) / 4.0));
        const nodeRadius = Math.max(1.2, 2.0 * depthAlpha);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(depthAlpha * 0.92 * scrollFade).toFixed(2)})`;
        ctx.fill();

        if (depthAlpha > 0.55) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 230, 255, ${(depthAlpha * 0.25 * scrollFade).toFixed(2)})`;
          ctx.fill();
        }
      }

      if (!reduceMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="hero-cube-background" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-cube-canvas" />
    </div>
  );
}
