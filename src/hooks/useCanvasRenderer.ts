// import { useEffect, useCallback } from "react";
// import type { Particle } from "../types/particle";
// import { drawParticle, drawGrid } from "../utlis/drawUtils";
// import { COLORS } from "../themes/colors";

// const PADDING = 24; 

// export function useCanvasRenderer(
//     canvasRef: React.RefObject<HTMLCanvasElement>,
//     particles: Particle[],
//     selectedId: number | null,
//     width: number,
//     height: number
// ) {
//     const render = useCallback(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         const dpr = window.devicePixelRatio || 1;
//         const scaledWidth = width * dpr;
//         const scaledHeight = height * dpr;

//         if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
//             canvas.width = scaledWidth;
//             canvas.height = scaledHeight;
//             canvas.style.width = `${width}px`;
//             canvas.style.height = `${height}px`;
//         }

//         ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//         const innerX = PADDING;
//         const innerY = PADDING;
//         const innerWidth = width - PADDING * 2;
//         const innerHeight = height - PADDING * 2;

//         ctx.save();
//         const isDark = COLORS.isDark;
//         if (isDark) {
//             const grad = ctx.createLinearGradient(0, 0, 0, height);
//             grad.addColorStop(0, COLORS.bg1);
//             grad.addColorStop(1, COLORS.bg2);
//             ctx.fillStyle = grad;
//         } else {
//             const grad = ctx.createLinearGradient(0, 0, 0, height);
//             grad.addColorStop(0, COLORS.bg2);
//             grad.addColorStop(1, COLORS.bg3);
//             ctx.fillStyle = grad;
//         }
//         ctx.fillRect(0, 0, width, height);
//         ctx.restore();

//         ctx.save();
//         ctx.translate(innerX, innerY);
//         ctx.strokeStyle = COLORS.grid;
//         ctx.globalAlpha = isDark ? 0.12 : 0.07;
//         ctx.lineWidth = 1;
//         drawGrid(ctx, innerWidth, innerHeight); 
//         ctx.restore();

//         ctx.save();
//         ctx.strokeStyle = COLORS.border;
//         ctx.lineWidth = 2;
//         ctx.globalAlpha = 0.7;
//         ctx.strokeRect(innerX, innerY, innerWidth, innerHeight);
//         ctx.restore();

//         particles.forEach((particle) => {
//             ctx.save();
//             const px = Math.max(innerX + 10, Math.min(innerX + innerWidth - 10, particle.x));
//             const py = Math.max(innerY + 10, Math.min(innerY + innerHeight - 10, particle.y));
//             if (particle.id === selectedId) {
//                 ctx.shadowColor = COLORS.particleSelected;
//                 ctx.shadowBlur = 16;
//             } else {
//                 ctx.shadowColor = isDark ? COLORS.shadowLight : COLORS.shadowDark;
//                 ctx.shadowBlur = 6;
//             }
//             drawParticle(ctx, { ...particle, x: px, y: py }, particle.id === selectedId);
//             ctx.restore();
//         });

//         if (selectedId !== null) {
//             const selected = particles.find((p) => p.id === selectedId);
//             if (selected) {
//                 ctx.save();
//                 const px = Math.max(innerX + 10, Math.min(innerX + innerWidth - 10, selected.x));
//                 const py = Math.max(innerY + 10, Math.min(innerY + innerHeight - 10, selected.y));
//                 const r = 16 + Math.sqrt(selected.mass) * 2;
//                 ctx.beginPath();
//                 ctx.arc(px, py, r + 10, 0, 2 * Math.PI);
//                 ctx.strokeStyle = COLORS.particleSelected;
//                 ctx.lineWidth = 3;
//                 ctx.globalAlpha = 0.8;
//                 ctx.shadowColor = COLORS.particleSelected;
//                 ctx.shadowBlur = 12;
//                 ctx.stroke();
//                 ctx.restore();
//             }
//         }

//         if (particles.length > 50) {
//             ctx.save();
//             ctx.fillStyle = COLORS.warning;
//             ctx.font = "13px Arial";
//             ctx.textAlign = "right";
//             ctx.globalAlpha = 0.7;
//             ctx.fillText(`${particles.length} particles`, width - PADDING, PADDING + 16);
//             ctx.restore();
//         }
//     }, [canvasRef, particles, selectedId, width, height]);

//     useEffect(() => {
//         render();
//     }, [render]);

//     useEffect(() => {
//         const handleThemeChange = () => {
//             render();
//         };
//         window.addEventListener("themechange", handleThemeChange);
//         return () => {
//             window.removeEventListener("themechange", handleThemeChange);
//         };
//     }, [render]);

//     return { render };
// }
