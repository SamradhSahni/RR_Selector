# Antigravity Knowledge Base: 3D Frontend Engineering, Walkthroughs & Tactile UI

## 0. Meta-Instructions & Classification Taxonomy for AI Agents

This document serves as the authoritative architectural standard and implementation blueprint for building high-craft, production-grade web applications combining **3D WebGL/WebGPU graphics**, **tactile physical user interfaces**, **contextual 3D/AI onboarding walkthroughs**, and **adaptive performance/accessibility**.

### Classification Tags
Every concept, pattern, and architectural rule in this specification is strictly classified into one of two categories:

1. **`[MANDATORY]`**: Non-negotiable engineering, UX, performance, stability, or accessibility requirements. **Rule:** *Anything that universally improves web performance, frame pacing, visual polish, tactile responsiveness, resilience, or accessibility is strictly `[MANDATORY]`, never optional.* Every production deployment must implement these patterns by default.
2. **`[ACCORDING TO PS]` (Problem Statement)**: Architectural choices, visual themes, 3D scene topologies, domain workflows, or interaction paradigms that are dictated by the specific project brief, brand identity, target user persona, or functional problem statement.

---

## 1. Visual Direction, Theme Architecture & Design Tokens

While the underlying physics and rendering pipelines are invariant (`[MANDATORY]`), the aesthetic expression adapts to the domain (`[ACCORDING TO PS]`).

### 1.1 Aesthetic Archetypes & Theme Selection `[ACCORDING TO PS]`
Before initializing shaders, lighting, or UI tokens, inspect the Problem Statement (PS) to lock in the visual archetype:
* **Industrial / Deep-Tech / AI Infrastructure**: High-contrast obsidian/carbon surfaces, monochromatic wireframes, subtle specular rim lighting, crisp $1\text{ px}$ structural hairlines, and surgical telemetry typography (monospace numerical readouts).
* **Consumer Luxury / Spatial Commerce**: Warm editorial palettes, physically based rendering (PBR) with studio softboxes, shallow depth-of-field (Bokeh), slow fluid inertia, and high-fashion serif/sans pairings.
* **Creative Studio / Experimental Interactive**: Custom post-processing shaders, kinetic typography, chromatic distortion on velocity, bold OKLCH accent gradients, and expressive camera choreography.
* **Scientific / Bio-Medical / Geospatial Visualization**: High-legibility semantic color encoding, volumetric or instanced data point clouds, cross-section clipping planes, and zero-distortion orthographic/perspective camera toggles.

### 1.2 Perceptual Color Architecture & Surface Tokens `[MANDATORY]`
* **OKLCH Color Space**: Define all design tokens in `oklch(L C H)` rather than hex or standard RGB so that programmatic hover states, glow intensities, and disabled states maintain uniform perceived lightness across hues.
* **Tabular Numerals**: Any UI displaying live 3D coordinates, AI token streams, counters, or performance telemetry must enforce `font-variant-numeric: tabular-nums` to prevent horizontal layout jitter during high-frequency updates.
* **Layered Surface Elevation**: Use translucent surface stacking (`backdrop-filter: blur(16px) saturate(140%)`) paired with subtle inner top-edge specular borders (`box-shadow: inset 0 1px 0 0 oklch(1 0 0 / 0.12)`) so floating HUD overlays remain legible over dynamic 3D backgrounds without heavy opaque boxes.

---

## 2. WebGL / WebGPU & 3D Asset Pipeline (React Three Fiber)

A professional 3D web application must load rapidly, maintain a locked frame rate ($60\text{ FPS}$ to $120\text{ FPS}$, i.e., $\le 16.67\text{ ms}$ or $\le 8.33\text{ ms}$ per frame), and never crash the browser tab.

### 2.1 Asset Compression & Delivery Pipeline `[MANDATORY]`
Raw `.obj`, `.fbx`, or uncompressed `.gltf` files must never be shipped to production.
* **Geometry Compression (Draco & Meshopt)**:
  * Compress static high-poly geometry using **Draco** (`EXT_draco_mesh_compression`) for maximum file size reduction over the network.
  * Compress morph targets, skinned animations, or rapidly decoded meshes using **Meshopt** (`EXT_meshopt_compression`), which decodes significantly faster on the client CPU than Draco and pairs directly with byte-level gzip/Brotli compression.
* **Texture Compression (KTX2 / Basis Universal)**:
  * Never ship `.png` or `.jpg` textures for 3D materials; they decompress to full raw RGBA8 in GPU VRAM (e.g., a single $4096 \times 4096$ PNG consumes $\approx 67\text{ MB}$ of VRAM plus mipmaps $\approx 89\text{ MB}$).
  * Convert all textures into `.ktx2` containers using `toktx` or `gltf-transform` (`UASTC` for normal/roughness/metallic maps; `ETC1S` for diffuse/albedo maps). KTX2 transcodes directly to native GPU block formats (`BC7`, `ASTC`, `ETC2`) and stays compressed inside VRAM, reducing memory footprint by $75\%$ to $85\%$.
* **Automated CLI Pipeline (`gltf-transform`)**:
  * Enforce an offline/CI asset build pipeline that runs deduplication, weld, simplify, instance detection, texture resize, and KTX2/Draco compression before bundling.
* **Preloading & Suspense Boundaries**:
  * Register critical assets via `useGLTF.preload('/model.glb')` and `useKTX2.preload('/tex.ktx2')` at module initialization or route prefetch.
  * Wrap 3D subtrees in granular `<Suspense fallback={<ProceduralWireframePlaceholder />}>` boundaries so the scene interactive shell mounts immediately without blocking the main thread.

### 2.2 Lighting, Baking & Environment Architecture
* **Baked Lighting & Lightmaps `[MANDATORY]` (for static architecture/environments)**:
  * Real-time shadows and multiple dynamic area lights destroy mobile and integrated GPU frame budgets. Bake global illumination (GI), ambient occlusion (AO), and soft shadows into compressed KTX2 lightmaps or vertex colors in Blender/Octane.
  * Use unlit (`MeshBasicMaterial`) or lightweight custom shaders for fully baked background architecture, reserving expensive PBR calculations (`MeshStandardMaterial` / `MeshPhysicalMaterial`) exclusively for hero interactive objects.
* **Procedural Environment Maps (`<Environment>`) `[MANDATORY]`**:
  * Instead of loading a massive $4\text{ MB}$ `.hdr` file over the network for reflections, construct a live procedural studio lighting setup using `<Environment resolution={256} frames={1}>` with `<Lightformer>` planes inside `@react-three/drei`. Setting `frames={1}` bakes the PMREM cubemap once on mount with zero ongoing per-frame cost.
* **Dynamic Shadow & Light Budgets `[ACCORDING TO PS]`**:
  * When dynamic object manipulation is required by the PS, cap real-time shadow-casting lights to a maximum of $1$ directional or spot light, combined with `@react-three/drei`'s `<ContactShadows frames={1} />` (baked once for static placement, or throttled for moving objects) or `<AccumulativeShadows>` for studio product showcases.

### 2.3 Draw Call Optimization & Scene Graph Discipline `[MANDATORY]`
The primary bottleneck in WebGL is CPU-to-GPU draw call overhead. Target $\le 100$ draw calls per frame and $\le 500,000$ active triangles.
* **Instanced Meshes (`THREE.InstancedMesh` / `<Instances>`)**:
  * Any geometry repeated $\ge 3$ times with identical material (particles, foliage, grid nodes, architectural modularity, data points) **must** be rendered via `InstancedMesh` in a single draw call.
  * Update instance transformations via a pre-allocated dummy `THREE.Object3D` or direct `Float32Array` matrix buffer writes, flagging `instanceMatrix.needsUpdate = true` only on frames where transforms actually mutate.
* **BatchedMesh (`THREE.BatchedMesh`)**:
  * When rendering multiple *distinct* geometries that share a single material/texture atlas, merge them into a `THREE.BatchedMesh` to collapse dozens of heterogeneous objects into $1$ draw call while retaining per-object frustum culling and visibility toggling.
* **Accelerated Raycasting (`three-mesh-bvh`)**:
  * Standard Three.js raycasting iterates over every triangle on the CPU, causing severe frame spikes when the user moves the pointer over complex meshes. Wrap interactive scenes in `<Bvh firstHitOnly>` from `@react-three/drei` to build a Bounding Volume Hierarchy (BVH), reducing pointer intersection checks from $O(N)$ to $O(\log N)$ ($\le 0.2\text{ ms}$).

### 2.4 Render Loop Discipline & Zero-Allocation `useFrame` `[MANDATORY]`
* **Zero Garbage Collection in the Render Loop**:
  * **NEVER** instantiate `new THREE.Vector3()`, `new THREE.Color()`, `new THREE.Matrix4()`, or `new THREE.Quaternion()` inside `useFrame`. Allocating objects $60$ to $120$ times per second triggers V8 Garbage Collection (GC) pauses, manifesting as periodic micro-stutters.
  * Pre-allocate scratch math primitives at the module scope or inside a `useMemo` / `useRef` outside the loop.
* **Frame-Rate Independent Damping**:
  * Never use naive linear interpolation `value += (target - value) * 0.1` inside `useFrame`, because it runs twice as fast on a $120\text{ Hz}$ ProMotion display as on a $60\text{ Hz}$ monitor.
  * Always use exponential decay via `maath/easing` (`easing.damp`, `easing.damp3`, `easing.dampE`, `easing.dampC`) or explicit delta-time exponential smoothing:
    $$x(t + \Delta t) = \text{lerp}\left(x(t), \text{target}, 1 - e^{-\lambda \Delta t}\right)$$
    where $\Delta t$ is clamped ($\min(\Delta t, 0.1)$) to prevent explosive jumps when switching browser tabs.
* **On-Demand Rendering (`frameloop="demand"`) `[ACCORDING TO PS]`**:
  * If the 3D scene does not contain continuous idle ambient motion, configure `<Canvas frameloop="demand">`. Trigger re-renders purely when camera controls move, props change, or spring animations run via `invalidate()`. This drops GPU utilization to $0\%$ when idle, preserving laptop battery and keeping fans silent.

### 2.5 WebGL Context-Loss Recovery & Graceful Resilience `[MANDATORY]`
Mobile browsers, backgrounded tabs, GPU driver resets, or heavy parallel AI workloads can force the browser to evict the WebGL context (`webglcontextlost`). Unhandled context loss leaves a dead white/black screen.
* **Event Interception**: Attach listeners to `gl.domElement` on canvas creation (`onCreated`):
  * On `webglcontextlost`: Call `event.preventDefault()` immediately to instruct the browser that the application intends to recover the context, pause all `useFrame` loops, and display a sleek, non-alarming glassmorphic status banner ("Restoring 3D graphics engine...").
  * On `webglcontextrestored`: Re-initialize custom render targets, re-upload dynamic data textures, force a scene graph mount refresh (or increment a React `key` on the `<Canvas>`), and seamlessly dismiss the recovery overlay.
* **Zero-WebGL / Hardware Acceleration Disabled Fallback**:
  * Detect WebGL2 availability prior to mounting `<Canvas>`. If WebGL is blocked by enterprise policy or hardware failure, automatically render an interactive 2.5D parallax SVG/HTML/CSS fallback or high-efficiency `<video>` loop so the application remains $100\%$ functional.

### 2.6 Memory Management, Disposal & Shader Pre-Compilation `[MANDATORY]`
* **Explicit VRAM Disposal**: While R3F automatically disposes of declarative JSX primitives on unmount, any imperatively created `Geometry`, `Material`, `Texture`, or `WebGLRenderTarget` must be explicitly disposed inside a `useEffect` cleanup (`asset.dispose()`).
* **Shader Pre-Compilation**: Prevent first-interaction frame hitching (shader compilation stutter when an object first enters the camera frustum) by calling `gl.compileAsync(scene, camera)` during the initial loading/Suspense phase before revealing the canvas.

---

## 3. Synchronization Bridge: DOM $\leftrightarrow$ 3D Canvas & State Management

Bridging React's declarative DOM tree with an imperative $120\text{ Hz}$ 3D scene graph requires strict state isolation.

### 3.1 Transient State Management (`zustand`) `[MANDATORY]`
* **The Anti-Pattern**: Storing continuous values (scroll progress, mouse coordinates, audio frequency bins, camera positions, or active drag deltas) in `React.useState` or standard `React.useContext` causes the entire React component tree to re-render $60+$ times per second, destroying performance.
* **The Transient Pattern**:
  * Use a centralized `zustand` store.
  * **For continuous 60/120fps reads inside `useFrame`**: Read directly via `useAppStore.getState().scrollProgress` or subscribe transiently via `useEffect(() => useAppStore.subscribe(state => ...), [])`. This updates 3D transforms at native refresh rates with **zero** React component re-renders.
  * **For discrete UI states** (active walkthrough step, selected object ID, modal open/close, AI workflow phase): Use standard reactive selectors `const step = useAppStore(s => s.activeStep)`.

### 3.2 Spatial DOM Projection & Multi-Viewport Scissoring `[MANDATORY]`
* **Projected 3D Annotations (`@react-three/drei` `<Html>`)**:
  * Anchor rich DOM pins, AI telemetry badges, and interactive callouts directly to 3D mesh coordinates using `<Html transform={false} occlude="blending" zIndexRange={[10, 0]}>`.
  * Keep the number of simultaneous `<Html>` instances low ($\le 15$) because each instance calculates a 3D-to-2D matrix projection (`vector.project(camera)`) and applies CSS `transform: translate3d(...)` on every frame.
* **Single-Context Multi-Canvas (`<View>` Scissor Portals) `[MANDATORY]` (when rendering multiple 3D cards/viewports)**:
  * Browsers enforce a hard limit of $8$ to $16$ active WebGL contexts per page; creating multiple `<Canvas>` components across a page causes older canvases to crash with context loss.
  * Render a **single** fixed full-viewport `<Canvas>` at the root layout level and use `@react-three/drei` `<View track={domRef}>` portals inside standard DOM cards/sections. R3F uses `gl.setScissor` and `gl.setViewport` to render multiple independent 3D scenes, cameras, and lighting setups inside a single WebGL context.

### 3.3 Smooth Scroll & Camera Choreography `[ACCORDING TO PS]`
* When the PS calls for scrollytelling or spatial architecture exploration:
  * Synchronize **Lenis** smooth scrolling with R3F's `useFrame` loop (`lenis.raf(time)`).
  * Drive the 3D camera along a pre-computed `THREE.CatmullRomCurve3` spline path or interpolate between discrete camera keyframes (Position $\vec{p}_i$ + LookAt Target $\vec{t}_i$) using damped scroll progress $s \in [0, 1]$.

---

## 4. Tactile "Premium" UI Physics, Shaders & Micro-Interactions

Digital interfaces feel "cheap" when elements teleport between states or move along rigid linear/cubic-bezier curves that ignore user momentum. A tactile interface behaves like precision-machined physical hardware.

### 4.1 Spring Physics Mechanics (`framer-motion` / `motion`) `[MANDATORY]`
Abandon duration-based CSS transitions (`transition: all 0.3s ease`) for interactive layout movements. Use damped harmonic oscillator physics modeled by Hooke's Law:
$$F = -k \cdot x - c \cdot v$$
where $k$ is spring stiffness, $c$ is damping friction, $x$ is displacement, and $v$ is current velocity.
* **Preserve Interruption Velocity**: If a user hovers in and rapidly pulls the cursor away mid-animation, a spring solver reverses direction smoothly from its current velocity $v(t)$, whereas a duration-based CSS bezier curve snaps or resets unnaturally.
* **Standardized Tactile Spring Presets**:
  * **Micro-Snap (Buttons, Toggles, Checkboxes, Magnetic Pull)**: `{ type: "spring", stiffness: 500, damping: 30, mass: 0.6 }` — High responsiveness, near-critical damping ($\zeta \approx 0.95$) with zero sloppy oscillation.
  * **Spatial Fluid (Drawers, Command Palette, Walkthrough Spotlights, Cards)**: `{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }` — Supple deceleration with subtle physical weight.
  * **Camera / Heavy 3D Rig Transition**: `{ type: "spring", stiffness: 120, damping: 22, mass: 1.4 }` — Cinematic inertia.
* **Press Compression & Specular Shift**:
  * On `:active` / `whileTap`, scale interactive buttons down slightly (`scale: 0.97` or `translateY(1px)`) while simultaneously dimming the top specular border highlight and tightening the drop shadow to simulate physical key travel into the chassis.

### 4.2 Magnetic Hover Mechanics & Cursor Force Fields `[MANDATORY]`
Primary CTAs, floating dock icons, and 3D gizmo triggers must exhibit subtle magnetic attraction when the pointer enters their proximity field:
* **Mathematical Formulation**:
  * Given element center $(c_x, c_y)$ and pointer coordinates $(p_x, p_y)$, compute Euclidean distance $d = \sqrt{(p_x - c_x)^2 + (p_y - c_y)^2}$.
  * When $d < R_{\text{mag}}$ (magnetic radius), apply spring-damped translation $(\Delta x, \Delta y)$:
    $$\Delta x = (p_x - c_x) \cdot \alpha_{\text{container}}, \quad \Delta y = (p_y - c_y) \cdot \alpha_{\text{container}}$$
    where $\alpha_{\text{container}} \in [0.15, 0.30]$.
  * **Parallax Inner Label**: Displace the inner text/icon layer at a slightly higher coefficient $\alpha_{\text{inner}} \in [0.25, 0.45]$ in the same direction to create a 3D depth separation between the button housing and its label.
  * On `pointerleave`, spring both $(\Delta x, \Delta y)$ back to $(0, 0)$.

### 4.3 Radial Cursor Glow Borders & Specular Surface Tracking `[MANDATORY]`
Give cards, bento grids, and action buttons physical surface reactivity by tracking pointer coordinates relative to each element's bounding box:
* **Zero-Re-Render CSS Variable Injection**:
  * Track pointer coordinates inside a single passive `pointermove` listener and write directly to CSS custom properties `--mouse-x` and `--mouse-y` on the container via `element.style.setProperty(...)` inside `requestAnimationFrame`. Never trigger React state updates on mouse move!
* **Dual-Layer Radial Masking**:
  * **Layer 1 (Border Specular Glow)**: Use a `1px` padding mask (`mask-composite: exclude` / `-webkit-mask-composite: xor`) filled with `radial-gradient(240px circle at var(--mouse-x) var(--mouse-y), oklch(0.85 0.15 var(--hue) / 0.65), transparent 100%)`. Adjacent cards sharing a grid wrapper will illuminate their shared borders simultaneously as the cursor approaches the seam.
  * **Layer 2 (Surface Diffuse sheen)**: Render an ultra-subtle interior glow (`opacity: 0.06`) across the card face to simulate light reflecting off anodized aluminum or matte glass.

### 4.4 Magnetic / Tactile UI Shaders `[ACCORDING TO PS]`
* When the PS calls for signature hero interactions or experimental tactile polish:
  * **GLSL / TSL Hover Distortion**: Apply a subtle vertex/fragment displacement driven by normalized pointer velocity $\vec{v}_{\text{mouse}}$ and a simplex/curl noise field so hero surfaces ripple organically like ferrofluid or натянутая (tensioned) membrane upon contact.
  * **Chromatic Micro-Refraction**: Add subtle RGB channel separation at the edges of glassmorphic lenses or 3D transmission meshes (`MeshTransmissionMaterial` with `chromaticAberration={0.03}` and `anisotropicBlur={0.1}`).

### 4.5 Procedural Web Audio API Tactile Engine `[MANDATORY]`
Subtle, high-precision acoustic feedback elevates digital interfaces into physical instruments.
* **Zero-Network Procedural Synthesis**:
  * Instead of loading external `.mp3` or `.wav` files (which suffer from network latency, memory overhead, and repetitive ear fatigue), synthesize micro-sounds procedurally using the native **Web Audio API** (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`, `GainNode` with exponential gain ramps).
  * **Hover Tick**: A $4\text{ ms}$ filtered white-noise burst or high-damped sine impulse ($f_0 = 1800\text{ Hz} \rightarrow 400\text{ Hz}$, gain $0.025$) with slight random pitch jitter ($\pm 3\%$) to mimic mechanical watch escapement ticks.
  * **Primary Actuation Down-Click**: Low-end transient thud ($f_0 = 160\text{ Hz} \rightarrow 45\text{ Hz}$ over $18\text{ ms}$, gain $0.08$).
  * **Release Up-Click**: Crisp higher-pitched release ($f_0 = 240\text{ Hz} \rightarrow 90\text{ Hz}$ over $12\text{ ms}$, gain $0.05$).
  * **AI Completion / Step Advance Chime**: Warm harmonic fifth dyad with soft low-pass filter sweep.
* **Strict Audio Hygiene**:
  * **Lazy Initialization**: Instantiate/resume `AudioContext` strictly inside the first user gesture (`pointerdown` or `keydown`) to respect browser autoplay policies.
  * **Global Mute Toggle & Persistence**: Provide an accessible header/Cmd+K sound toggle persisted in `localStorage`, and immediately silence all audio when `document.hidden === true` or `prefers-reduced-motion: reduce` is active.

### 4.6 Optimistic UI States & AI Streaming Ergonomics `[MANDATORY]`
Never leave the user staring at a frozen button or layout-shifting text stream during async 3D computations or AI inference.
* **Optimistic State Transitions**:
  * Immediately transition the UI to its target state on click (e.g., toggling a 3D material configuration, bookmarking a node, submitting an AI prompt) while the network request resolves in the background.
  * If the background request fails, smoothly roll back the state with a spring shake animation (`x: [0, -6, 6, -4, 4, 0]`), a low-frequency error tone, and an actionable recovery toast.
* **Multi-Phase Button Morphing**:
  * Morph action buttons fluidly across `idle` $\rightarrow$ `optimistic/processing` $\rightarrow$ `success` $\rightarrow$ `error` using `<AnimatePresence mode="popLayout">` and layout projection (`layout="position"`), keeping button width transitions spring-damped so surrounding toolbar elements glide rather than snap.

---

## 5. Interactive Guided Walkthroughs & Contextual Onboarding

Complex 3D workspaces and multi-step AI pipelines fail when users are dropped into a cockpit of unfamiliar controls without spatial orientation.

### 5.1 Hybrid DOM + 3D Spotlight Architecture `[MANDATORY]`
Standard DOM tour libraries (e.g., Driver.js) only highlight flat 2D HTML elements. A 3D + AI web application requires a **Unified Spatial Tour Orchestrator** that coordinates DOM overlays and 3D scene state simultaneously:
* **DOM Target Highlighting (Driver.js or Custom SVG Mask Cutout)**:
  * Render a full-viewport dimmed backdrop (`oklch(0 0 0 / 0.65)`) with a spring-animated cutout window (`rx="12px"`) that smoothly morphs its $(x, y, w, h)$ bounding box from step $i$ to step $i+1$.
* **3D Mesh Target Highlighting (Canvas Spotlight & Post-Processing)**:
  * When a walkthrough step targets an object *inside* the 3D scene rather than a DOM button:
    1. Project the 3D object's bounding sphere center and radius into 2D screen-space coordinates $(s_x, s_y, r_{\text{screen}})$ on every frame so the SVG spotlight aperture dynamically tracks the 3D mesh even while the camera is moving!
    2. Simultaneously highlight the target 3D mesh using `@react-three/postprocessing` `<Select enabled>` paired with `<Outline edgeStrength={3} pulseSpeed={0.4} />` or dim non-target scene lights by $60\%$ to create theatrical focus.

### 5.2 Synchronized 3D Camera Choreography per Tour Step `[MANDATORY]`
Each walkthrough step definition must support an optional 3D camera pose and scene state payload:
```typescript
interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  targetType: 'dom' | '3d-mesh' | 'hybrid';
  domSelector?: string;
  meshName?: string;
  cameraPose?: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov?: number;
  };
  requiredAction?: 'click-target' | 'orbit-camera' | 'submit-ai-prompt' | 'manual-next';
  onEnterStep?: () => void;
}
```
* When advancing to step $i$, lock manual OrbitControls temporarily during the transition, damp the 3D camera smoothly to `step.cameraPose`, and re-enable restricted user interaction once the camera settles within $\epsilon < 0.05$ units of its target.

### 5.3 Interactive "Learn-by-Doing" Gateways `[ACCORDING TO PS]`
Passive "Next $\rightarrow$ Next $\rightarrow$ Next" tooltip tours are ignored by users.
* **Event-Driven Step Advancement**: Configure critical workflow steps to wait for the user to actually perform the action inside the spotlighted region (e.g., *"Drag to rotate the 3D assembly"*, *"Click the highlighted manifold to inspect stress telemetry"*, or *"Run the AI synthesizer prompt"*). Once the store dispatches the completion event, automatically advance to the next step with tactile audio confirmation.
* **Non-Destructive Persistence & Replayability `[MANDATORY]`**:
  * Persist tour completion and current step index in `localStorage` so page refreshes mid-tour resume seamlessly.
  * Always provide a prominent **"Skip Tour" (`Esc`)** action and a permanent **"Replay Interactive Guide"** command inside the `Cmd+K` Command Palette.

---

## 6. Adaptive Performance, Tiering & Accessibility (A11y)

A truly world-class application runs effortlessly on both an M4 Max workstation and an integrated-GPU ultrabook, and is fully operable via keyboard and assistive technologies.

### 6.1 Client GPU Tier Detection & Dynamic Quality Scaling `[MANDATORY]`
Never hardcode `dpr={[1, 2]}` and heavy post-processing for all users. Implement a two-stage adaptive performance governor:

1. **Stage 1: Static Boot Classification (`detect-gpu`)**:
   * Query client GPU capabilities on initialization and classify into $4$ tiers:
     * **Tier 0 (No WebGL / Software Renderer / Battery Saver)**: Render 2.5D static/SVG fallback; disable WebGL canvas.
     * **Tier 1 (Integrated / Low-Power Mobile GPU, $\approx 30\text{ FPS}$ baseline)**: Cap `dpr` at $1.0$, disable post-processing (`Bloom`, `SSAO`, `DepthOfField`), disable real-time shadows, use low-mip KTX2 textures, and set antialiasing to `false`.
     * **Tier 2 (Mid-Range Desktop / Modern Mobile GPU, $\approx 60\text{ FPS}$)**: Set dynamic `dpr` range $[1.0, 1.5]$, enable selective bloom and contact shadows, enable MSAA.
     * **Tier 3 (High-End Discrete GPU / Apple Silicon Pro-Max)**: Allow `dpr` up to $2.0$, enable full PBR transmission, environment reflections, and multi-pass post-processing.
2. **Stage 2: Closed-Loop Runtime Telemetry (`<PerformanceMonitor>`)**:
   * Static GPU tables can be wrong if the user has $40$ tabs open or is running on low battery. Wrap the scene in `@react-three/drei`'s `<PerformanceMonitor onIncline={...} onDecline={...} onFallback={...}>`.
   * Monitor a rolling window of frame times $\Delta t$. If FPS drops below $45\text{ FPS}$ for $> 1.5\text{ s}$, progressively step down the resolution scale factor:
     $$\text{DPR}_{\text{current}} = \max\left(0.75, \text{DPR}_{\text{current}} - 0.25\right)$$
     and shed non-essential visual effects (particles, post-processing passes) without interrupting user interaction.

### 6.2 Command Palette (`Cmd+K` / `Ctrl+K`) & Spatial Keyboard Navigation `[MANDATORY]`
Every 3D camera preset, AI tool, walkthrough trigger, theme/audio toggle, and object inspection action must be accessible without touching a mouse:
* **Universal Command Palette (`Cmd+K` / `Ctrl+K`)**:
  * Implement an instant, fuzzy-searchable command menu with full keyboard arrow navigation (`Up`/`Down`, `Enter`, `Esc`), categorized actions, and visible keyboard shortcut badges (`G` then `C` to center camera, `T` to toggle wireframe, `?` to launch walkthrough).
* **Keyboard-Driven 3D Canvas Controls**:
  * When the 3D canvas or its proxy controls are focused, bind arrow keys / `WASD` to smooth camera orbit/pan, `+`/`-` to zoom, and `R` to reset camera view.

### 6.3 Semantic 3D Accessibility (Screen Readers & Focus Proxies) `[MANDATORY]`
To a screen reader, a raw `<canvas>` element is a completely opaque black box. Bridge this gap using the **Parallel Accessible DOM Architecture**:
* **Interactive 3D Mesh Proxy Nodes**:
  * For every interactive 3D object in the scene, render a semantically synchronized `<button>` or `<article>` inside an visually hidden (or HUD-overlaid) `<div role="region" aria-label="Interactive 3D Scene Explorer">` alongside the canvas.
  * When a keyboard user presses `Tab` to focus a proxy button:
    1. Smoothly lerp the 3D camera to focus the corresponding 3D mesh.
    2. Apply the visual focus ring/outline shader to the 3D mesh so sighted keyboard users clearly see which 3D object holds focus.
    3. Pressing `Enter` or `Space` triggers the exact same selection/inspection handler as clicking the 3D mesh with a mouse.
* **ARIA Live Regions (`aria-live="polite"`)**:
  * Announce dynamic scene transitions, walkthrough step changes, and AI generation status updates via an `aria-live="polite"` status region so screen reader users receive real-time spatial feedback.

### 6.4 Motion Sensitivity & `prefers-reduced-motion` Architecture `[MANDATORY]`
Respecting vestibular disorders and motion sensitivity is a hard engineering requirement:
* Detect `window.matchMedia('(prefers-reduced-motion: reduce)')` reactively and provide a manual override toggle in the UI.
* **When Reduced Motion is Active**:
  * Replace long sweeping 3D camera spline flights with instant or short cross-dissolve cuts ($\le 150\text{ ms}$ opacity fade).
  * Stop continuous ambient 3D rotation, floating bobbing animations, and vertex wave shaders.
  * Replace bouncy spring physics with critically damped, near-instant state transitions (`{ duration: 0.1 }`).

---

## 7. Production Implementation Blueprints

The following reference patterns demonstrate how to wire these systems together cleanly in a modern React + TypeScript + React Three Fiber stack.

### 7.1 Transient Store Bridging 3D Scene, Walkthrough & Audio (`store.ts`)
```typescript
import { create } from 'zustand';

export type QualityTier = 'low' | 'medium' | 'high';

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface SpatialAppState {
  // Continuous high-frequency values (Read transiently via getState() in useFrame)
  pointerNormalized: [number, number];
  scrollProgress: number;

  // Discrete reactive states
  qualityTier: QualityTier;
  dpr: number;
  audioEnabled: boolean;
  reducedMotion: boolean;
  selectedMeshId: string | null;
  activeWalkthroughStep: number | null;
  cameraTarget: CameraTarget;

  // Actions
  setQualityTier: (tier: QualityTier, dpr: number) => void;
  toggleAudio: () => void;
  selectMesh: (id: string | null, focusPose?: CameraTarget) => void;
  setWalkthroughStep: (step: number | null, pose?: CameraTarget) => void;
}

export const useSpatialStore = create<SpatialAppState>((set) => ({
  pointerNormalized: [0, 0],
  scrollProgress: 0,
  qualityTier: 'high',
  dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  audioEnabled: true,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  selectedMeshId: null,
  activeWalkthroughStep: null,
  cameraTarget: { position: [0, 2, 6], lookAt: [0, 0, 0] },

  setQualityTier: (qualityTier, dpr) => set({ qualityTier, dpr }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  selectMesh: (selectedMeshId, focusPose) =>
    set((s) => ({
      selectedMeshId,
      cameraTarget: focusPose ?? s.cameraTarget,
    })),
  setWalkthroughStep: (activeWalkthroughStep, pose) =>
    set((s) => ({
      activeWalkthroughStep,
      cameraTarget: pose ?? s.cameraTarget,
    })),
}));
```

### 7.2 Zero-Latency Procedural Web Audio Tactile Synth (`tactileAudio.ts`)
```typescript
import { useSpatialStore } from './store';

class TactileSoundEngine {
  private ctx: AudioContext | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!useSpatialStore.getState().audioEnabled || document.hidden) return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Ultra-short mechanical hover tick */
  public playHoverTick() {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Slight pitch randomization (+/- 3%) prevents robotic ear fatigue
    const jitter = 0.97 + Math.random() * 0.06;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1650 * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(380 * jitter, now + 0.008);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.009);
  }

  /** Tactile physical switch actuation press */
  public playPressDown() {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.022);

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.024);
  }
}

export const soundEngine = new TactileSoundEngine();
```

### 7.3 Tactile Magnetic Button with Radial Specular Border (`TactileButton.tsx`)
```tsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { soundEngine } from './tactileAudio';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticStrength?: number;
}

const SPRING_CONFIG = { stiffness: 500, damping: 30, mass: 0.6 };

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  magneticStrength = 0.22,
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  // Outer housing magnetic displacement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  // Inner label parallax displacement (moves slightly further for depth)
  const labelX = useSpring(useMotionValue(0), SPRING_CONFIG);
  const labelY = useSpring(useMotionValue(0), SPRING_CONFIG);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // Update radial glow CSS variables with zero React re-renders
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${localX}px`);
    el.style.setProperty('--mouse-y', `${localY}px`);

    // Calculate magnetic vector from button center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * magneticStrength);
    y.set(deltaY * magneticStrength);
    labelX.set(deltaX * (magneticStrength * 1.4));
    labelY.set(deltaY * (magneticStrength * 1.4));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
    labelX.set(0);
    labelY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.965 }}
      onPointerEnter={() => soundEngine.playHoverTick()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => soundEngine.playPressDown()}
      onClick={onClick}
      className="group relative isolate overflow-hidden rounded-xl bg-neutral-900/80 px-5 py-2.5 text-sm font-medium text-neutral-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      {...props}
    >
      {/* Radial Cursor Glow Border Overlay */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(140px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(0.82 0.16 210 / 0.45), transparent 100%)',
        }}
      />
      <motion.span
        style={{ x: labelX, y: labelY }}
        className="relative z-10 flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.button>
  );
};
```

### 7.4 Adaptive R3F Canvas with Context-Loss Recovery & Zero-Allocation Camera Rig (`SpatialCanvas.tsx`)
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor, Bvh } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { useSpatialStore } from './store';

// Pre-allocated scratch vectors outside the render loop (Zero GC Allocation!)
const _targetPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0, 0);

const CameraRig: React.FC = () => {
  useFrame((state, delta) => {
    const { cameraTarget, reducedMotion } = useSpatialStore.getState();
    const clampedDelta = Math.min(delta, 0.1);

    _targetPos.set(...cameraTarget.position);
    _targetLookAt.set(...cameraTarget.lookAt);

    const smoothTime = reducedMotion ? 0.01 : 0.28;
    easing.damp3(state.camera.position, _targetPos, smoothTime, clampedDelta);
    easing.damp3(_currentLookAt, _targetLookAt, smoothTime, clampedDelta);
    state.camera.lookAt(_currentLookAt);
  });

  return null;
};

export const SpatialCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dpr = useSpatialStore((s) => s.dpr);
  const setQualityTier = useSpatialStore((s) => s.setQualityTier);
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  return (
    <div className="relative h-full w-full">
      {contextLost && (
        <div
          role="alert"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-lg"
        >
          <p className="text-sm font-medium text-neutral-200">
            Restoring 3D hardware context...
          </p>
          <button
            onClick={() => {
              setContextLost(false);
              setCanvasKey((k) => k + 1);
            }}
            className="mt-3 rounded-lg bg-white/10 px-4 py-1.5 text-xs text-white hover:bg-white/20"
          >
            Force Reload Scene
          </button>
        </div>
      )}

      <Canvas
        key={canvasKey}
        dpr={dpr}
        gl={{
          powerPreference: 'high-performance',
          antialias: dpr < 1.5,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          const domElement = gl.domElement;
          const handleContextLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
          };
          const handleContextRestored = () => {
            setContextLost(false);
            setCanvasKey((k) => k + 1);
          };

          domElement.addEventListener('webglcontextlost', handleContextLost, false);
          domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

          cleanupRef.current = () => {
            domElement.removeEventListener('webglcontextlost', handleContextLost);
            domElement.removeEventListener('webglcontextrestored', handleContextRestored);
          };
        }}
      >
        <PerformanceMonitor
          onIncline={() => setQualityTier('high', Math.min(window.devicePixelRatio, 2))}
          onDecline={() => setQualityTier('medium', 1.25)}
          onFallback={() => setQualityTier('low', 0.85)}
        />
        <CameraRig />
        <Bvh firstHitOnly>{children}</Bvh>
      </Canvas>
    </div>
  );
};
```

---

## 8. Master Architectural Decision & Verification Matrix

Use this matrix during system design, code generation, and final QA review to confirm full compliance with all `[MANDATORY]` invariants and `[ACCORDING TO PS]` configurations.

| Subsystem | Feature / Engineering Pattern | Classification | Target Metric / Verification Standard |
| :--- | :--- | :---: | :--- |
| **Asset Pipeline** | Draco / Meshopt `.glb` geometry compression | `[MANDATORY]` | $\ge 70\%$ payload reduction; zero raw `.obj`/`.fbx` in network tab. |
| **Asset Pipeline** | KTX2 (`UASTC`/`ETC1S`) GPU-compressed textures | `[MANDATORY]` | Textures stay compressed in VRAM; total VRAM budget $\le 250\text{ MB}$. |
| **Lighting** | Baked GI/AO lightmaps + procedural `<Environment frames={1}>` | `[MANDATORY]` | Zero multi-megabyte `.hdr` network blocks; $0\text{ ms}$ runtime GI overhead. |
| **Lighting** | Dynamic real-time shadow casters & studio setups | `[ACCORDING TO PS]` | Max $1$ real-time shadow light; use `<ContactShadows>` where applicable. |
| **Scene Graph** | `InstancedMesh` / `BatchedMesh` for repeated elements | `[MANDATORY]` | Total scene draw calls $\le 100$; active triangles $\le 500\text{k}$. |
| **Raycasting** | Spatial BVH acceleration (`<Bvh firstHitOnly>`) | `[MANDATORY]` | Pointer intersection raycast time $\le 0.2\text{ ms}$ per frame. |
| **Render Loop** | Zero object allocation inside `useFrame` + `maath` damping | `[MANDATORY]` | Zero GC sawtooth spikes in Chrome DevTools Memory profiler; frame-rate independent across $60\text{ Hz}$ and $120\text{ Hz}$. |
| **Resilience** | `webglcontextlost` / `webglcontextrestored` + 2D fallback | `[MANDATORY]` | Simulated context loss (`WEBGL_lose_context`) recovers automatically without crashing React tree. |
| **State Bridge** | Transient `zustand` reads (`getState()`) inside `useFrame` | `[MANDATORY]` | $0$ React component re-renders during continuous scroll or pointer movement. |
| **Tactile UI** | Spring-physics micro-interactions (`framer-motion` / `motion`) | `[MANDATORY]` | Interruption-safe velocity preservation; zero linear/janky CSS transitions on interactive nodes. |
| **Tactile UI** | Magnetic hover force fields + inner label parallax | `[MANDATORY]` | Smooth pull within proximity radius; instant spring-back on `pointerleave`. |
| **Tactile UI** | Radial cursor specular borders via CSS custom properties | `[MANDATORY]` | `--mouse-x`/`--mouse-y` updated via DOM refs with zero React state churn. |
| **Tactile Audio** | Procedural Web Audio API micro-synthesizer | `[MANDATORY]` | Zero network audio requests; sub-$2\text{ ms}$ trigger latency; respects mute & `document.hidden`. |
| **Async / AI UX** | Optimistic UI state transitions + layout-stable streaming | `[MANDATORY]` | Immediate $< 16\text{ ms}$ visual feedback on actuation; graceful rollback on error. |
| **Walkthroughs** | Hybrid DOM + 3D spotlight tour with camera pose lerping | `[MANDATORY]` | Tour step synchronizes DOM spotlight cutout, 3D mesh outline, and smooth camera transition. |
| **Walkthroughs** | Domain-specific "learn-by-doing" interactive step gates | `[ACCORDING TO PS]` | Step advances automatically upon detecting required user 3D/AI action. |
| **Performance** | `detect-gpu` boot tiering + `<PerformanceMonitor>` closed loop | `[MANDATORY]` | Automatic DPR scaling ($0.75 \le \text{DPR} \le 2.0$) and effect shedding to hold $\ge 55\text{ FPS}$. |
| **Accessibility** | `Cmd+K` Command Palette + full keyboard camera/UI navigation | `[MANDATORY]` | $100\%$ of features and 3D viewpoints reachable via keyboard alone. |
| **Accessibility** | Parallel Accessible DOM proxy nodes + `aria-live` announcements | `[MANDATORY]` | Screen readers can tab through 3D interactive targets and hear live state changes. |
| **Accessibility** | `prefers-reduced-motion` reactive compliance | `[MANDATORY]` | Eliminates sweeping camera flights and continuous ambient motion when enabled. |
| **Visual Theme** | Aesthetic direction, shaders, color palette & scene topology | `[ACCORDING TO PS]` | Tailored to domain brief using perceptual `oklch()` color tokens and tabular numerals. |