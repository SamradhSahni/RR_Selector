---
name: shader-webgl-optimization
description: Use this skill when building, debugging, or optimizing Three.js, React Three Fiber (R3F), WebGL, WebGPU, or custom GLSL/WGSL shaders. Enforces GPU memory disposal, draw-call instancing, shader math optimization, and 60 FPS frame budgets.
---

# 3D, WebGL & Shader Performance Engineering Playbook

## 1. Geometry, Texture & Draw-Call Budgets [MANDATORY]
- **Draw Calls:** Keep total draw calls <= 100 on desktop and <= 40 on mobile. Use `THREE.InstancedMesh` or `MergedGeometry` for repeated geometry (>10 identical meshes).
- **Polygon & Texture Compression:** Compress all `.glb`/`.gltf` assets using Draco or Meshopt (`gltf-transform`). Convert textures to KTX2 / Basis Universal and cap dimensions at 2048x2048 (1024x1024 on mobile).
- **Deterministic GPU Memory Disposal:** Every geometry, material, texture, and render target created dynamically must call `.dispose()` on component unmount. Never instantiate vectors or matrices inside the `useFrame` render loop.

## 2. GLSL / WGSL Shader Optimization Rules [MANDATORY]
- **Eliminate Dynamic Branching in Fragment Shaders:** Replace `if/else` conditionals on non-uniform values with branchless math intrinsics: `step()`, `smoothstep()`, `mix()`, and `clamp()`.
- **Move Invariant Math to the Vertex Shader:** Compute lighting vectors, UV transforms, and world-space coordinates in the vertex shader.
- **Precision Qualifiers:** Use `mediump` for colors, normals, and UVs on mobile GPUs; reserve `highp` strictly for world positions and depth calculations.
- **Device Pixel Ratio (DPR) Clamping:** Always clamp canvas DPR via `Math.min(window.devicePixelRatio, 2)`.

## 3. Live Chrome DevTools MCP Verification Loop [MANDATORY]
1. Ensure `attachMcp3DBridge(renderer, scene, camera)` is active.
2. Open the scene in Chrome DevTools MCP and execute `window.__MCP_3D_BRIDGE__.getSceneReport()`.
3. Verify: `fps >= 55`, `frameTimeMs <= 18.0`, `shaderErrors.length === 0`, and zero memory growth after unmounting.
4. Provide a `prefers-reduced-motion` and low-power fallback.
