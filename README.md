# 🎨 Interactive Design Patterns Learning Platform

> An interactive simulation engine for understanding design patterns deeply, not just reading about them.

Instead of reading abstract documentation, this platform allows developers to:
- 👁️ **See object interactions animated**
- 🕹️ **Manipulate runtime behavior**
- ⚡ **Trigger pattern flows**
- 🔄 **Observe state changes in real-time**

Targeted toward mid-level and advanced developers looking for intuitive, hands-on understanding of architectural concepts.

---

## ✨ Features

- **Interactive Visualizations**: Each pattern features a code + runtime dual view.
- **Teaching Animations**: Lifecycle, flow direction, object creation, and state propagation are all represented visually.
- **Visual Metaphors**: Abstract patterns made tangible (e.g., Singleton as a "Locked Control Room", Observer as a "Broadcast Tower").
- **Progressive Learning**: Move from concept overview → visual explanation → interactive sandbox → challenge mode.
- **Extensible Engine**: An architecture built specifically to sandbox and register any structural, creational, or behavioral pattern seamlessly.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://motion.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## 🏗️ High-Level Architecture

The platform operates on a **feature-first modular design** utilizing a **Pattern Engine**.

```text
App
 ├── Router
 ├── Layout System
 ├── Pattern Engine
 │    ├── Pattern Registry
 │    ├── Visualization Renderer
 │    ├── Animation Orchestrator
 │    └── State Simulation Engine
 ├── Global State (Zustand)
 └── Gamification / Progress System
```

Each pattern is strictly sandboxed. It maintains its own decoupled simulation logic (acting as an individual mini-runtime) ensuring the visualization and the internal state representation are kept securely separated.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd design-patterns
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Visit `http://localhost:5173` to view the platform locally.

### 4. Build for production
```bash
npm run build
npm run preview
```

## 🧩 Adding a New Pattern

To add a new pattern to the platform, you don't need to touch the core engine. Simply:

1. Create a new folder under `src/patterns/`.
2. Implement the core interface (e.g. `DesignPatternModule`).
3. Define its `PatternSimulation` containing its local state transitions.
4. Export and register it in the `PatternRegistry`.

## 🛣️ Roadmap

- **Phase 1**: Core platform + Singleton & Observer patterns.
- **Phase 2**: Strategy, Factory, and Decorator.
- **Phase 3**: State, Command, and Mediator.
- **Phase 4**: Architectural patterns, Microservices visualizations, Event Sourcing.

## 📄 License

This project is internal/private.
