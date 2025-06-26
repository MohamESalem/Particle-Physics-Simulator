import React, { useEffect, useCallback } from "react";
import type { ShapeType, ForceField } from "../types/particle";


interface ToolsPanelProps {
  toolShape: ShapeType;
  setToolShape: (s: ShapeType) => void;
  toolMass: number;
  setToolMass: (m: number) => void;
  toolVelocity: number;
  setToolVelocity: (v: number) => void;
  toolColor: string;
  setToolColor: (c: string) => void;
  forceField: ForceField;
  setForceField: (f: ForceField) => void;
  onClearParticles: () => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

const shapeIcons: Record<ShapeType, React.ReactNode> = {
  circle: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block align-middle"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  square: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block align-middle"
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  ),
  triangle: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block align-middle"
    >
      <polygon points="12,4 20,19 4,19" />
    </svg>
  ),
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; 
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <section className={`mb-8 last:mb-0 ${className || ""}`}>
    <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">
      {"title"}
    </h3>
    {children}
  </section>
);

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  toolShape,
  setToolShape,
  toolMass,
  setToolMass,
  toolVelocity,
  setToolVelocity,
  toolColor,
  setToolColor,
  forceField,
  setForceField,
  onClearParticles,
  theme,
  setTheme,
}) => {
  const shapeOptions: ShapeType[] = ["circle", "square", "triangle"];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <aside
      className="flex flex-col gap-6 w-full max-w-sm min-w-[330px] p-6 md:p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out transform overflow-y-auto overflow-x-hidden h-full box-border"
      style={{ maxHeight: "100vh" }}
    >
      {/* Panel Header */}
      <div className="pb-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3 gradient-text">
          Particle Controls
        </h2>
      </div>

      {/* Particle Shape Section */}
    <Section title="Particle Shape" className="flex-shrink-0">
      <div className="flex justify-center w-full gap-5">
        {shapeOptions.map((shape, idx) => (
          <button
            key={shape}
            onClick={() => setToolShape(shape)}
            className={`
              flex-1 min-w-0 py-3 px-0 text-base font-semibold transition-all duration-200 ease-in-out
              flex flex-col items-center justify-center gap-2 rounded-lg
              ${toolShape === shape
                ? "bg-primary text-white shadow"
                : "bg-secondary text-default hover:bg-tertiary dark:hover:bg-gray-700"
              }
              border border-border
            `}
            aria-pressed={toolShape === shape}
            aria-label={`Select ${shape.charAt(0).toUpperCase() + shape.slice(1)} Shape`}
            style={{ maxWidth: "110px" }}
          >
            <span className="mb-1">{shapeIcons[shape]}</span>
            {shape.charAt(0).toUpperCase() + shape.slice(1)}
          </button>
        ))}
      </div>
    </Section>

      {/* Particle Mass Section */}
      <Section title="Particle Mass" className="flex-shrink-0">
        <label
          htmlFor="mass-slider"
          className="block text-base font-medium mb-3 flex justify-between items-center text-default"
        >
          <span>Current Mass:</span>
          <span className="font-mono text-sm px-3 py-2 rounded-md bg-tertiary text-default min-w-[70px] text-center">
            {toolMass.toFixed(1)} kg
          </span>
        </label>
        <input
          id="mass-slider"
          type="range"
          min={0.5}
          max={5}
          step={0.1}
          value={toolMass}
          onChange={(e) => setToolMass(Number(e.target.value))}
          aria-label="Particle Mass"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
        />
      </Section>

      {/* Particle Velocity Section */}
      <Section title="Particle Velocity" className="flex-shrink-0">
        <label
          htmlFor="velocity-slider"
          className="block text-base font-medium mb-3 flex justify-between items-center text-default"
        >
          <span>Current Velocity:</span>
          <span className="font-mono text-sm px-3 py-2 rounded-md bg-tertiary text-default min-w-[70px] text-center">
            {toolVelocity} m/s
          </span>
        </label>
        <input
          id="velocity-slider"
          type="range"
          min={0}
          max={200}
          step={1}
          value={toolVelocity}
          onChange={(e) => setToolVelocity(Number(e.target.value))}
          aria-label="Particle Velocity"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
        />
      </Section>

      {/* Particle Color Section */}
      <Section title="Particle Color" className="flex-shrink-0">
        <div className="flex items-center gap-4 w-full">
          <input
            type="color"
            value={toolColor}
            onChange={(e) => setToolColor(e.target.value)}
            aria-label="Pick Particle Color"
            className="w-12 h-12 rounded-lg cursor-pointer border border-border-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0"
          />
          <span
            className="flex-1 px-4 py-3 rounded-lg font-mono text-base bg-secondary border border-border text-default text-center overflow-hidden text-ellipsis"
            style={{
              backgroundColor: toolColor + "30",
              borderColor: toolColor,
              minWidth: 0,
            }}
          >
            {toolColor.toUpperCase()}
          </span>
        </div>
      </Section>

      {/* Force Field Controls Section */}
      <Section title="Force Field (m/s²)" className="flex-shrink-0">
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label
              htmlFor="x-force-slider"
              className="block text-base font-medium mb-3 flex justify-between items-center text-default"
            >
              <span>X-Force:</span>
              <span className="font-mono px-3 py-2 rounded-md text-sm bg-tertiary text-default min-w-[70px] text-center">
                {forceField.x.toFixed(1)}
              </span>
            </label>
            <input
              id="x-force-slider"
              type="range"
              min={-20}
              max={20}
              step={0.1}
              value={forceField.x}
              onChange={(e) =>
                setForceField({ ...forceField, x: Number(e.target.value) })
              }
              aria-label="X-axis Force Field"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
            />
          </div>
          <div>
            <label
              htmlFor="y-force-slider"
              className="block text-base font-medium mb-3 flex justify-between items-center text-default"
            >
              <span>Y-Force:</span>
              <span className="font-mono px-3 py-2 rounded-md text-sm bg-tertiary text-default min-w-[70px] text-center">
                {forceField.y.toFixed(1)}
              </span>
            </label>
            <input
              id="y-force-slider"
              type="range"
              min={-20}
              max={40}
              step={0.1}
              value={forceField.y}
              onChange={(e) =>
                setForceField({ ...forceField, y: Number(e.target.value) })
              }
              aria-label="Y-axis Force Field"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
            />
          </div>
        </div>
      </Section>

      {/* Action Buttons Section */}
    <div className="pt-6 border-gray-200 dark:border-gray-700 mt-auto flex flex-col gap-4 flex-shrink-0">
      <div className="flex flex-col gap-3">
        <button
        onClick={onClearParticles}
        className="btn w-full py-3 px-5 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                bg-error hover:bg-red-600 active:bg-red-700 transition-colors duration-200 ease-in-out"
        >
        <span role="img" aria-label="trash can emoji">
          🗑️
        </span>{" "}
        Clear All Particles
        </button>

        <button
        onClick={toggleTheme}
        className="btn w-full py-3 px-5 rounded-lg font-semibold flex items-center justify-center gap-2
                bg-tertiary text-default border border-border hover:bg-border-light active:bg-border transition-colors duration-200 ease-in-out"
        >
        {theme === "dark" ? (
          <>
            <span role="img" aria-label="sun emoji">
            ☀️
            </span>{" "}
            Light Mode
          </>
        ) : (
          <>
            <span role="img" aria-label="moon emoji">
            🌙
            </span>{" "}
            Dark Mode
          </>
        )}
        </button>
      </div>
    </div>
    </aside>
  );
};