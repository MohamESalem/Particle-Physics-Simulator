

# Particle Physics Simulator

---

## 🧠 Introduction

This is a real-time, interactive particle physics simulator built with React and TypeScript. Users can create particles, apply forces, and observe realistic motion and interaction, illustrating key principles of Newtonian mechanics in an engaging, visual format.

---

## ✨ Features

* **🧩 Interactive Particle Creation**
  Add circles, squares, or triangles with customizable mass, velocity, and color via an intuitive control panel.

* **⏱ Real-Time Simulation**
  Particles respond to gravity, applied forces, collisions, and friction in real time.

* **🌀 Adjustable Force Fields**
  Control global horizontal and vertical forces to simulate various environments.

* **🎯 Realistic Collision Response**
  Particles bounce off walls with adjustable restitution (bounciness).

* **🛑 Kinetic Friction**
  Simulates surface friction when particles touch the bottom boundary.

* **📈 Visual Feedback**
  See velocity vectors and mass indicators for each particle.

* **🖱 Particle Interaction**
  Click to select and drag particles, halting their current motion.

* **🗑 Reset Simulation**
  Clear all particles with a single button.

* **🌗 Dark/Light Theming**
  Toggle between light and dark modes.

* **📱 Responsive Design**
  Fully functional on various screen sizes.

---

## 🧰 Tech Stack

* **Frontend:** React
  Utilizes `useState` and `useEffect` for state and lifecycle control.

* **Language:** TypeScript
  Ensures type safety and clearer structure for components and physics logic.

* **Rendering:** HTML5 Canvas API
  Enables high-performance drawing of particles, animations, and interactions.

* **Styling:** Tailwind CSS + Custom CSS
  Rapid UI development with responsive layouts and theme switching via CSS variables.

---

## 🔬 Physics Concepts

### 🔄 Verlet Integration

A stable numerical method for updating particle positions—great for maintaining consistent energy and preventing infinite bouncing.

### ⚙ Forces

* **Gravity**: Constant downward acceleration (`9.81 m/s²`).
* **Custom Fields**: Adjustable X and Y axis forces.
* **Air Resistance**: Modeled using velocity, particle size, and drag coefficients.

### 💥 Collisions

* **Canvas Boundaries**: Detect and respond to edge collisions.
* **Restitution**: Controls bounce behavior (`0.0–1.0`).
* **Kinetic Friction**: Applies resistance when particles move along the ground.

### 🧮 Stability Enhancements

* **Sub-Stepping**: Breaks physics calculations into smaller steps for high accuracy.
* **Resting Thresholds**: Stops minor particle movement when energy is negligible.

---

## 🧑‍💻 How to Use

1. **Customize Particles**
   Choose shape, mass, velocity, and color from the side panel.

2. **Control Forces**
   Adjust X/Y force sliders to simulate environmental effects.

3. **Add Particles**
   Click the canvas to place a particle with current settings.

4. **Interact with Particles**
   Select and drag particles to reposition or inspect.

5. **Reset Simulation**
   Use the "Clear All" button to start fresh.

6. **Switch Theme**
   Toggle between light and dark modes anytime.

---

## ⚙ Installation & Local Setup

```bash
git clone https://github.com/your-username/particle-physics-simulator.git
cd particle-physics-simulator
npm install     # or yarn install
npm run dev     # or yarn start
```

Access the app at [http://localhost:3000](http://localhost:3000).

---

## 🗂 Project Structure

```
.
├── public/                 
├── src/
│   ├── App.tsx              # Root component
│   ├── canvas/
│   │   └── CanvasRenderer.tsx
│   ├── components/
│   │   └── ToolsPanel.tsx
│   ├── themes/
│   │   └── colors.ts
│   ├── types/
│   │   └── particle.ts
│   └── utils/
│       ├── drawUtils.ts
│       ├── particleUtils.ts
│       └── physics.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Planned Enhancements

* **Particle-Particle Collisions** (elastic/inelastic)
* **Advanced Force Fields** (e.g., radial, magnetic)
* **Save/Load Simulations**
* **Performance Tuning** for large particle counts
* **Per-Particle Properties**: Density, elasticity, etc.
* **Undo/Redo System** for interactions

---

## 🤝 Contributing

Feel free to fork the repo, open issues, or submit pull requests. Contributions are highly welcome!

---

## 📄 License

This project is released under the [MIT License](./LICENSE).


