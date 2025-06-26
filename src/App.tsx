import { useState, useEffect, useRef } from "react";
import { CanvasRenderer } from "./canvas/CanvasRenderer";
import { ToolsPanel } from "./components/ToolsPanel"; 
import { updateParticle } from "./utlis/physics";
import { isMouseOverParticle } from "./utlis/particleUtils";
import type { Particle as BaseParticle, ShapeType } from "./types/particle"; 

type Particle = BaseParticle & { fadeIn?: boolean };

function App() {
  // Define the fixed width for the sidebar
  const SIDEBAR_WIDTH = 400;

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth - SIDEBAR_WIDTH, 
    height: window.innerHeight,
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme); 
  }, [theme]);

  const [particles, setParticles] = useState<Particle[]>([
    {
      id: 1,
      x: 100,
      y: 100,
      vx: 100,
      vy: -50,
      mass: 2,
      shape: "circle",
      color: "#FF0000",
    },
    {
      id: 2,
      x: 300,
      y: 200,
      vx: -50,
      vy: 60,
      mass: 1.5,
      shape: "square",
      color: "#00FF00",
    },
  ]);

  const [toolShape, setToolShape] = useState<ShapeType>("circle");
  const [toolMass, setToolMass] = useState<number>(2);
  const [toolVelocity, setToolVelocity] = useState<number>(60);
  const [toolColor, setToolColor] = useState<string>("#00BFFF");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [forceField, setForceField] = useState({ x: 0, y: 0 });

  const dragInfo = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastFrameTime = useRef<number>(performance.now());

  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const handleClearParticles = () => {
    setParticles([]);
    setSelectedId(null); 
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left; 
    const my = e.clientY - rect.top; 

    const clickedParticle = particles.find((p) => isMouseOverParticle(p, mx, my));

    if (clickedParticle) {
      setSelectedId(clickedParticle.id); 
    } else {
      const newParticle: Particle = {
        id: Date.now(), 
        x: mx,
        y: my,
        vx: rand(-toolVelocity, toolVelocity),
        vy: rand(-toolVelocity, toolVelocity),
        mass: toolMass, 
        shape: toolShape, 
        color: toolColor, 
        fadeIn: true, 
      };
      setParticles((prev) => [...prev, newParticle]); 
      setSelectedId(null); 
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const p of particles) {
      if (isMouseOverParticle(p, mx, my)) {
        setSelectedId(p.id); 
        dragInfo.current = { id: p.id, dx: mx - p.x, dy: my - p.y };
        setIsDragging(true); 
        return; 
      }
    }

    setIsDragging(false);
    dragInfo.current = null;
    setSelectedId(null);
  };

  const handleMouseUp = () => {
    setIsDragging(false); 
    dragInfo.current = null; 
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragInfo.current) return; 

    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setParticles((prev) =>
      prev.map((p) =>
        p.id === dragInfo.current!.id 
          ? { ...p, x: mx - dragInfo.current!.dx, y: my - dragInfo.current!.dy, vx: 0, vy: 0 } 
          : p
      )
    );
  };


  useEffect(() => {
    let animationFrameId: number; 

    const tick = (now: number) => {
      const dt = Math.min((now - lastFrameTime.current) / 1000, 0.04);
      lastFrameTime.current = now; 

      setParticles((prev) =>
        prev.map((p) =>
          updateParticle(
            p,
            dt,
            forceField,
            canvasDimensions.width, 
            canvasDimensions.height 
          )
        )
      );

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick); 
    return () => cancelAnimationFrame(animationFrameId);
  }, [forceField, canvasDimensions]); 

  useEffect(() => {
    if (particles.some(p => (p as any).fadeIn)) {
      const timeout = setTimeout(() => {
        setParticles(prev =>
          prev.map(p => {
            if ((p as any).fadeIn) {
              const { fadeIn, ...rest } = p as any; 
              return rest;
            }
            return p;
          })
        );
      }, 400); 
      return () => clearTimeout(timeout); 
    }
  }, [particles]); 

  return (
    <div
      className="fixed inset-0 flex"
      style={{
        background: `var(--main-bg-gradient)`,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Sidebar component */}
      {(
        <aside
          className="z-10 h-full pt-8 flex-shrink-0"
          style={{
            width: SIDEBAR_WIDTH,
            minWidth: SIDEBAR_WIDTH,
            maxWidth: SIDEBAR_WIDTH,
            background: `var(--sidebar-bg)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingLeft: "10px",
            paddingRight: "10px",
            height: "100vh",
            overflow: "auto",
          }}
        >
          <div className="p-4 flex-1 flex flex-col">
            <ToolsPanel
              toolShape={toolShape}
              setToolShape={setToolShape}
              toolMass={toolMass}
              setToolMass={setToolMass}
              toolVelocity={toolVelocity}
              setToolVelocity={setToolVelocity}
              toolColor={toolColor}
              setToolColor={setToolColor}
              forceField={forceField}
              setForceField={setForceField}
              onClearParticles={handleClearParticles}
              theme={theme} 
              setTheme={setTheme} 
            />
          </div>
        </aside>
      )}
      {/* Main canvas area */}
      <main
        className="flex-1 relative flex flex-col items-center justify-center"
        style={{
          width: sidebarCollapsed ? "100vw" : `calc(100vw - ${SIDEBAR_WIDTH}px)`,
          height: "calc(100% - 20)",
          padding: 0,
          margin: 20,
          overflow: "hidden",
        }}
      >
        <CanvasRenderer
          particles={particles.map(p => ({
            ...p,
            radius: p.mass ? Math.max(10, Math.sqrt(p.mass) * 8) : 16
          }))}
          selectedId={selectedId}
          gridSize={32}
          baseCanvasWidth={canvasDimensions.width}
          baseCanvasHeight={canvasDimensions.height}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          currentTheme={theme} 
        />

      </main>
      {/* Global styles using CSS variables for theme switching */}
      <style>{`
        /* Define CSS variables for light mode */
        html.light, :root {
          --main-bg-gradient: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
          --sidebar-bg: #ffffffcc;
          --sidebar-border: 1px solid #e5e7eb;
          --text-color: #000;
        }

        /* Override CSS variables for dark mode when 'dark' class is present on html */
        html.dark {
          --main-bg-gradient: linear-gradient(135deg, #232526 0%, #414345 100%);
          --sidebar-bg: #232526cc;
          --sidebar-border: 1px solid #333;
          --text-color: #fff;
        }

        /* Apply text color globally using the CSS variable */
        html {
          color: var(--text-color);
          font-family: 'Inter', sans-serif;
        }

        /* CSS for particle fade-in animation */
        .particle-fade-in {
          animation: fadeInParticle 0.4s;
        }
        @keyframes fadeInParticle {
          from { opacity: 0; transform: scale(0.7);}
          to { opacity: 1; transform: scale(1);}
        }

        html, body, #root {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        @media (max-width: 700px) {
          aside {
        display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
