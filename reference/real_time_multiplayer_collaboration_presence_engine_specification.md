# Real-Time Multiplayer Collaboration & Presence Engine (CRDTs)
## Master Architectural Knowledge Base & Implementation Blueprint for Antigravity

> **Document Purpose:** This document serves as the authoritative, zero-ambiguity engineering specification for building a production-grade, conflict-free multiplayer collaboration engine combining **2D AI Workflow Node Graphs (DAGs)** and **3D Spatial Scene Manipulation**.
>
> **Classification System Used Throughout This Document:**
> * **`[MANDATORY]`**: Non-negotiable architectural requirements, algorithms, data structures, UX polish, performance optimizations, and resilience patterns required for a highly professional, industrial-grade web application. Anything that improves web performance, reliability, visual smoothness, or collaborative integrity is classified as **`[MANDATORY]`**.
> * **`[ACCORDING TO PS]`**: Domain-specific configurations, visual themes, custom AI node schemas, specific 3D asset pipelines, business logic, and role permissions that must be adapted to the specific **Problem Statement (PS)**.

---

## 1. System Architecture Overview & State Taxonomy

In a dual-canvas application featuring both **AI Workflow Co-Editing** and **3D Scene Manipulation**, state cannot be treated as a single monolithic channel. Synchronizing high-frequency cursor movements through the same persistent pipeline as structural graph mutations causes severe memory bloat and network head-of-line blocking.

### 1.1 The Dual-State Architecture `[MANDATORY]`
The collaboration engine must strictly partition state into two distinct lifecycles and transport layers:

1. **Durable Document State (CRDT Store) `[MANDATORY]`**
   * **What it stores:** AI workflow nodes, DAG edges, prompt strings, model hyperparameters, 3D scene graph hierarchy, mesh transforms (committed), PBR material properties, lights, cameras, and 3D spatial pin comment threads.
   * **Characteristics:** Conflict-free, persisted to disk/database and client-side `IndexedDB`, supports scoped Undo/Redo, survives page reloads and offline edits.
   * **Update Frequency:** Event-driven or throttled ($10\text{ Hz}$ to $20\text{ Hz}$ during continuous drags, immediate on discrete commits).

2. **Ephemeral Presence State (Awareness Store) `[MANDATORY]`**
   * **What it stores:** User identity, active viewport tab (2D Graph vs. 3D Scene), 2D canvas pointer coordinates, 3D raycast hit positions and surface normals, active camera frustum/pose, currently selected node/mesh IDs, live gizmo drag deltas (pre-commit preview), and typing indicators.
   * **Characteristics:** In-memory only, zero history/tombstone retention, automatic TTL expiration, loss-tolerant.
   * **Update Frequency:** High-frequency real-time ($30\text{ Hz}$ to $60\text{ Hz}$) with client-side interpolation at $60\text{--}120\text{ FPS}$.

### 1.2 Core CRDT Engine Selection `[MANDATORY]`
* **Primary Recommendation: Yjs (`yjs` + `lib0`) `[MANDATORY]`**
  * **Justification:** Yjs uses a flat list of small structs with highly optimized binary encoding (`lib0`) and in-memory garbage collection. In benchmarks involving rapid spatial coordinate updates and node graph mutations, Yjs exhibits $10\times$ to $50\times$ lower memory overhead and faster parse times than JSON-tree Automerge documents.
* **Alternative (If Rust/WASM Backend or Full Git-Like Branching is Required): Automerge (`@automerge/automerge`) or Loro (`loro-crdt`) `[ACCORDING TO PS]`**
  * Use Automerge or Loro only if the Problem Statement explicitly mandates full historical time-travel branching/merging without external snapshot storage.

---

## 2. CRDT Data Modeling & Document Topology

Designing the internal hierarchy of the `Y.Doc` is critical. Poor nesting leads to unintended **Last-Write-Wins (LWW)** overwrites where one user changing a mesh's $X$ coordinate overwrites another user simultaneously changing its $Y$ coordinate, or conversely, creates torn states.

### 2.1 Root `Y.Doc` Schema Architecture `[MANDATORY]`
The root `Y.Doc` must be partitioned into top-level shared types that isolate domains and prevent cross-domain transaction contention:

```
Y.Doc (Root Collaboration Document)
├── meta: Y.Map<any>                     // [ACCORDING TO PS] Project title, theme config, PS metadata
├── workflowNodes: Y.Map<Y.Map<any>>     // [MANDATORY] Keyed by nodeId -> Node Y.Map
├── workflowEdges: Y.Map<Y.Map<any>>     // [MANDATORY] Keyed by deterministic edgeId -> Edge Y.Map
├── sceneNodes: Y.Map<Y.Map<any>>        // [MANDATORY] Flat 3D entity map keyed by objectUUID
├── materials: Y.Map<Y.Map<any>>         // [MANDATORY] Shared PBR materials keyed by materialUUID
├── annotations: Y.Map<Y.Map<any>>       // [MANDATORY] 3D Spatial Pin Comments & 2D Graph Notes
└── executionState: Y.Map<Y.Map<any>>    // [MANDATORY] Distributed AI pipeline run status & locks
```

### 2.2 Granularity Rules for Conflict-Free Merging `[MANDATORY]`
1. **Never Store Mutable Objects as Plain JSON Inside a Single `Y.Map` Key:**
   * *Anti-Pattern:* `nodeMap.set('data', { prompt: '...', temperature: 0.7, seed: 42 })`. If User A edits `prompt` and User B edits `temperature` concurrently, the entire JSON object undergoes LWW conflict resolution, destroying one user's edit.
   * *Correct Pattern `[MANDATORY]`:* Every independently editable field must be a distinct key in a nested `Y.Map`, and collaborative text fields (like AI prompts or shader code) must use `Y.Text`.
2. **Atomic Tuples for Spatial Vectors `[MANDATORY]`:**
   * Position $\vec{p} = [x, y, z]$, Rotation Quaternion $q = [x, y, z, w]$, and Scale $\vec{s} = [x, y, z]$ should each be stored as a single atomic `Float32Array` or 3-tuple/4-tuple value under keys `'position'`, `'quaternion'`, and `'scale'` inside the mesh's `Y.Map`.
   * *Why:* Updating `'position'` as a single tuple `[x, y, z]` ensures a mesh never ends up at a diagonal half-state combining User A's $X$ and User B's $Z$, while keeping `position`, `quaternion`, and `scale` separate so one user can scale an object while another rotates it without conflict.

### 2.3 Subdocuments for Heavy Assets & Nested Sub-Workflows `[MANDATORY]`
* If the application supports multi-page workflows, nested custom AI sub-graphs (macros), or multiple distinct 3D scenes/levels, implement **Yjs Subdocuments** (`new Y.Doc()` embedded inside a parent `Y.Map`) `[MANDATORY]`.
* Subdocuments allow **lazy loading**: a client only downloads and syncs the sub-graph or 3D room they currently have open, keeping initial load time under $200\text{ ms}$.

### 2.4 Mathematical Formalization of State Convergence `[MANDATORY]`
All state synchronization across $N$ peers must satisfy **Strong Eventual Consistency (SEC)**:
1. **Eventual Delivery:** Every update applied at an honest, connected peer is eventually delivered to all other peers.
2. **Convergence:** Any two peers that have received the same set of update operations $O$ are in an identical state:
   $$\forall i, j \in \text{Peers}, \quad O_i = O_j \implies S_i \equiv S_j$$
3. **Monotonic Semilattice:** State transitions form a join-semilattice $(\mathcal{S}, \sqcup)$ where merging remote state $S_{\text{remote}}$ into local state $S_{\text{local}}$ is:
   * **Idempotent:** $S \sqcup S = S$
   * **Commutative:** $S_A \sqcup S_B = S_B \sqcup S_A$
   * **Associative:** $(S_A \sqcup S_B) \sqcup S_C = S_A \sqcup (S_B \sqcup S_C)$

---

## 3. Network Transport, Hybrid Sync & Offline Persistence

A professional real-time engine must remain responsive over high-jitter Wi-Fi, handle server restarts gracefully, and support instant local loads.

### 3.1 Hybrid Dual-Transport Topology `[MANDATORY]`
```
┌──────────────────┐         WebRTC DataChannels (UDP-like, P2P)          ┌──────────────────┐
│   Client Peer A  │ ◄══════════════════════════════════════════════════► │   Client Peer B  │
│  (Y.Doc + 3D/AI) │    60Hz Presence, Raycasts, Camera Follow, Gizmos    │  (Y.Doc + 3D/AI) │
└────────┬─────────┘                                                      └─────────┬────────┘
         │                                                                          │
         │ WebSockets (Binary lib0 Sync, Auth, Persistence, Turn Fallback)          │
         ▼                                                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                   Authoritative Sync & Persistence Cluster (Hocuspocus / PartyKit)         │
│       ├── State Vector Diffing (SyncStep1 / SyncStep2)                                     │
│       ├── Snapshot Compaction & Redis Pub/Sub Scaling                                      │
│       └── Object Storage (S3/R2) for Immutable 3D Assets (GLB/HDRI) & AI Outputs           │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Persistent WebSocket Channel (`y-websocket` / `@hocuspocus/provider` / `y-partykit`) `[MANDATORY]`:**
   * Handles authentication, room authorization, initial state vector handshake (`SyncStep1` $\to$ `SyncStep2`), guaranteed delivery of CRDT document deltas, and server-side persistence.
   * Acts as an automatic fallback relay for Awareness packets if corporate firewalls block UDP/WebRTC.
2. **Peer-to-Peer WebRTC DataChannel (`y-webrtc` or LiveKit Data Track) `[MANDATORY]`:**
   * Unreliable, unordered UDP-style datagrams (`ordered: false, maxRetransmits: 0`) for ephemeral 3D cursor raycasts, camera follow telemetry, and live audio/video streams if required.
   * Eliminates server round-trip latency, dropping cursor latency from $\sim 80\text{ ms}$ to $\sim 15\text{ ms}$.

### 3.2 Binary Wire Framing & Delta Compression `[MANDATORY]`
* **Never serialize CRDT updates or 3D presence as JSON strings over the wire `[MANDATORY]`.**
* Use `lib0/encoding` and `lib0/decoding` to pack updates into binary `Uint8Array` buffers:
  * Message Type `0`: `Sync` (`0`: `SyncStep1` State Vector, `1`: `SyncStep2` Missing Updates, `2`: Incremental `Update`).
  * Message Type `1`: `Awareness` (Packed binary client IDs, sequence clocks, and quantized spatial floats).
  * Message Type `2`: `Auth / Permission Control`.
  * Message Type `3`: `Custom Ephemeral Telemetry` (Quantized `Float32Array` camera/gizmo streams).

### 3.3 Local-First Caching & Offline Reconnection (`y-indexeddb`) `[MANDATORY]`
* Every client must bind `y-indexeddb` to the local `Y.Doc` alongside the network provider `[MANDATORY]`.
* **Cold Boot Flow:**
  1. Load cached binary updates from IndexedDB in $< 30\text{ ms}$ and render the 3D scene and AI workflow immediately.
  2. In parallel, open the WebSocket connection and send the local $N$-byte **State Vector** (`Y.encodeStateVector(doc)`).
  3. The server computes the exact binary delta (`Y.encodeStateAsUpdate(serverDoc, clientStateVector)`) and sends only missed operations.
  4. If the user edited the workflow or 3D scene while offline, the client pushes its local delta (`Y.encodeStateAsUpdate(clientDoc, serverStateVector)`), merging seamlessly without losing a single keystroke or transform.

---

## 4. Collaborative AI Workflow Engine (DAG Synchronization)

Co-editing AI workflows (similar to ComfyUI, LangFlow, or Unreal Blueprints) introduces unique distributed systems challenges that standard text CRDTs do not handle out of the box.

### 4.1 AI Workflow Node & Edge Schema
* **Structure of a Workflow Node (`workflowNodes.get(nodeId)`) `[MANDATORY]`:**
  * `id`: `string` (UUIDv4 or ULID)
  * `type`: `string` `[ACCORDING TO PS]` (e.g., `'LLM_Prompt'`, `'ControlNet_Conditioning'`, `'3D_Mesh_Generator'`, `'K_Sampler'`, `'Shader_Bake'`)
  * `position`: `[number, number]` (2D canvas coordinates $[x, y]$)
  * `dimensions`: `[number, number]` (Width and height for layout/minimap)
  * `inputs`: `Y.Map<any>` (Port connections and default scalar values)
  * `params`: `Y.Map<any>` `[ACCORDING TO PS]` (Model checkpoints, CFG scale, steps, temperature, seed)
  * `promptText`: `Y.Text` `[MANDATORY]` (Character-by-character collaborative text for prompts, system instructions, or custom Python/GLSL scripts)
  * `outputArtifactRef`: `string | null` (Content-addressable URI pointing to generated 3D mesh, texture, or tensor in Object Storage)

* **Deterministic Edge Keys `[MANDATORY]`:**
  * Never store edges in a `Y.Array` where concurrent deletions shift indices or allow duplicate connections.
  * Store edges in `workflowEdges: Y.Map<Y.Map<any>>` using a deterministic composite key:
    $$\text{edgeId} = \text{`\${sourceNodeId}:\${sourcePortId}->\${targetNodeId}:\${targetPortId}`}$$
  * If two users simultaneously wire the exact same ports together, both clients write to the exact same key in `workflowEdges`, naturally deduplicating the edge without conflict.

### 4.2 The Distributed DAG Cycle Problem & Resolution `[MANDATORY]`
**The Problem:** AI execution pipelines are **Directed Acyclic Graphs (DAGs)**. Suppose the graph currently has nodes $A$ and $B$ with no edges.
* User 1 (offline or concurrent) draws an edge $A \to B$ (locally valid, no cycle).
* User 2 (offline or concurrent) draws an edge $B \to A$ (locally valid, no cycle).
* When the CRDT merges both updates, both edges exist simultaneously: $A \to B \to A$. **The merged graph now contains a cycle, which will crash or infinitely loop the AI execution engine!**

**The Mandatory Solution (Deterministic Post-Merge Cycle Breaking) `[MANDATORY]`:**
1. Attach a reactive observer (`workflowEdges.observeDeep(...)`) that runs a fast incremental cycle detection algorithm (**Kahn's Algorithm** or **Depth-First Search with 3-color marking**) whenever edges are added.
2. Each edge `Y.Map` must include `createdAtLamport: [clock, clientID]` when created.
3. If a cycle $C = \{e_1, e_2, \dots, e_k\}$ is detected after a CRDT merge:
   * Do **not** immediately delete the offending edge in the observer (which can cause infinite ping-pong transactions if multiple clients do it simultaneously).
   * Instead, deterministically identify the "winning" back-edge to suspend by picking the edge $e^* \in C$ with the highest tuple $(\text{clock}, \text{clientID})$:
     $$e^* = \arg\max_{e \in C} (\text{clock}_e, \text{clientID}_e)$$
   * Mark $e^*$ in local derived state (and rendered UI) as `status: 'CYCLE_SUSPENDED'` (rendered as a pulsing red dashed wire with a warning badge) and exclude it from DAG topological sorting until a user removes one of the edges in the loop.

### 4.3 Collaborative AI Execution State, Queueing & Artifact Sync `[MANDATORY]`
* **Distributed Execution Lock & Deduplication `[MANDATORY]`:**
  * When User A clicks **"Run Workflow"**, the client must not trigger local-only execution that leaves Collaborator B in the dark.
  * Execution requests are coordinated via `executionState: Y.Map`:
    * `activeRunId`: `string | null`
    * `triggeredByClientId`: `number`
    * `nodeStatuses`: `Y.Map<{ state: 'IDLE' | 'CACHED' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'ERROR', progress: number, errorMsg?: string }>`
* **Content-Addressable Caching (Graph Memoization) `[MANDATORY]`:**
  * Compute a deterministic Merkle hash $H(v)$ for each node $v$ in the DAG based on its type, parameters, and the hashes of its upstream parent nodes $u \in \text{Parents}(v)$:
    $$H(v) = \text{SHA256}\Big(\text{type}(v) \;\|\; \text{params}(v) \;\|\; \bigoplus_{u \in \text{Parents}(v)} H(u)\Big)$$
  * If User A runs the workflow and generates a 3D mesh or texture on Node $v$, the output is uploaded to storage under key $H(v)$ and linked on the node. Collaborator B immediately sees the live progress bar on Node $v$ and receives the generated 3D asset in their viewport the instant it completes, without re-running inference.
* **Zero-Bloat Binary Artifact Rule `[MANDATORY]`:**
  * **Never** store Base64 images, raw audio buffers, tensor weights, or `.glb` binary blobs directly inside the `Y.Doc` `[MANDATORY]`. Doing so permanently bloats the CRDT document and freezes WebSockets.
  * Store binary outputs in S3/R2/Cloudflare Images or IndexedDB Blob Cache, and write only the lightweight metadata object `{ url, sha256, mimeType, byteSize, dimensions }` into the CRDT node.

---

## 5. Collaborative 3D Scene Graph & Spatial Manipulation

Synchronizing a 3D viewport (Three.js / React Three Fiber / Babylon.js / WebGPU) across multiple simultaneous editors requires careful separation of hierarchy, transform math, and interaction locks.

### 5.1 Flat Scene Graph with Cycle-Safe Reparenting `[MANDATORY]`
* **Why Nested `Y.Map` Trees Fail for 3D Scene Graphs:**
  * In a 3D editor, users frequently drag meshes in the Outliner hierarchy to group/parent them (e.g., parenting a `Sword` mesh to a `Character_Hand` bone/node). In a nested CRDT tree, moving a node requires *deleting* it from parent $A$ and *inserting* a copy into parent $B$—which destroys concurrent property edits made by another user on that node during the move!
* **The Mandatory Flat Map Pattern `[MANDATORY]`:**
  * Store every 3D object (Mesh, Group, Light, Camera, Bone, AI Generator Volume) as an entry in a flat `sceneNodes: Y.Map<string, Y.Map<any>>` keyed by `objectUUID`.
  * Hierarchy is defined via two properties on each node's `Y.Map`:
    * `parentId`: `string | null` (`null` means attached to Scene Root)
    * `sortOrder`: `string` (Fractional indexing string, e.g., `'a0'`, `'a1'`, `'a0V'`, via `fractional-indexing` library for conflict-free sibling ordering in the Scene Outliner).
* **Tree Reparenting Cycle Prevention `[MANDATORY]`:**
  * If User 1 sets `A.parentId = B` concurrently while User 2 sets `B.parentId = A`, a cycle $A \leftrightarrow B$ forms in the 3D scene graph, which will cause an infinite recursion stack overflow during Three.js `updateMatrixWorld()` traversal!
  * **Guard Invariant:** Before rebuilding the Three.js scene graph from `sceneNodes` changes, traverse parent pointers upward from every modified node. If a node encounters itself in its ancestor chain, deterministically break the cycle by falling back the node with the lower `objectUUID` lexicographical order to `parentId = null` (Scene Root) in the runtime scene graph and flagging a non-destructive conflict warning.

### 5.2 3D Transform Synchronization & Mathematical Interpolation `[MANDATORY]`
Each 3D scene node in `sceneNodes` stores its local transformation relative to its parent as decomposed components rather than a raw 16-element matrix (since interpolating raw $4 \times 4$ matrices causes shearing distortion):
* **Translation:** $\vec{t} = [t_x, t_y, t_z] \in \mathbb{R}^3$
* **Rotation (Unit Quaternion):** $q = [q_x, q_y, q_z, q_w] \in \mathbb{H}$ where $\|q\| = \sqrt{q_x^2 + q_y^2 + q_z^2 + q_w^2} = 1$
* **Scale:** $\vec{s} = [s_x, s_y, s_z] \in \mathbb{R}^3$

#### The Two-Tier Gizmo Transform Pipeline `[MANDATORY]`
When User A grabs a 3D Transform Gizmo (Translate / Rotate / Scale) and drags a mesh at $60\text{--}120\text{ FPS}$, writing every single frame into `Y.Doc` creates thousands of CRDT tombstones per second and ruins the Undo/Redo stack. Implement this exact two-tier pipeline:

1. **During Active Drag (`pointermove`) — Ephemeral Fast Path:**
   * Broadcast the live transform delta `(objectUUID, position, quaternion, scale)` via the **Awareness / WebRTC Ephemeral Channel** at $30\text{--}60\text{ Hz}$ **AND** optionally commit throttled checkpoints to `Y.Doc` at low frequency ($5\text{ Hz}$) wrapped in a tracked transaction origin.
   * Remote peers immediately see the object moving smoothly by overriding the mesh's visual transform with the incoming ephemeral stream.
2. **Client-Side Frame Interpolation (`useFrame` / `requestAnimationFrame`) `[MANDATORY]`:**
   * Because network packets arrive at $30\text{--}60\text{ Hz}$ with jitter while the 3D canvas renders at $60\text{--}144\text{ Hz}$, remote meshes must never snap directly to incoming packet values.
   * Apply frame-rate independent exponential damping (LERP) for translation $\vec{t}$ and scale $\vec{s}$:
     $$\vec{t}_{\text{render}}(t + \Delta t) = \text{lerp}\left(\vec{t}_{\text{render}}(t), \vec{t}_{\text{target}}, 1 - e^{-\lambda \Delta t}\right)$$
     where $\lambda \approx 20\text{--}30$ is the responsiveness decay constant and $\Delta t$ is the frame delta time in seconds.
   * Apply **Spherical Linear Interpolation (SLERP)** for rotation quaternions $q_0 \to q_1$ (ensuring shortest-path hemisphere check $q_0 \cdot q_1 \ge 0$, negating $q_1$ if $q_0 \cdot q_1 < 0$):
     $$\theta = \arccos(\text{clamp}(q_0 \cdot q_1, -1, 1))$$
     $$\text{SLERP}(q_0, q_1, \alpha) = \frac{\sin((1 - \alpha)\theta)}{\sin\theta} q_0 + \frac{\sin(\alpha\theta)}{\sin\theta} q_1 \quad \text{where } \alpha = 1 - e^{-\lambda \Delta t}$$
3. **On Drag Release (`pointerup`) — Durable Commit Path:**
   * Write the final $[\vec{t}, q, \vec{s}]$ into the durable `sceneNodes` `Y.Map` inside a single `Y.Doc.transact(..., localUserOrigin)` call. This records **one clean Undo/Redo step** for the entire drag gesture!

### 5.3 Soft Object Locking & Collaborative Selection Auras `[MANDATORY]`
While CRDTs guarantee mathematical convergence if two users drag the same 3D mesh simultaneously, two users fighting over the same gizmo in real time creates a frustrating "tug-of-war" UX.
* **Soft Reservation Lock `[MANDATORY]`:**
  * When User A starts dragging a 3D gizmo on `mesh_123`, their Awareness state immediately broadcasts `activeTransformTarget: 'mesh_123'`.
  * On all other clients, `mesh_123` renders a colored **Selection Outline / Wireframe Cage** in User A's collaborator color with a floating pill badge (`"Alex is moving..."`), and local gizmo manipulation on `mesh_123` is temporarily soft-disabled until `activeTransformTarget` clears (or automatically expires after $5\text{ s}$ of inactivity if User A disconnects mid-drag).

### 5.4 AI-to-3D Bridge (Live Generative Scene Updates) `[MANDATORY]`
In a hybrid AI Workflow + 3D Scene platform, nodes in the 2D AI workflow directly drive or generate 3D entities in the shared scene:
* **Binding Link (`linkedSceneNodeId`) `[MANDATORY]`:** An AI Workflow Node (e.g., `Text-to-3D Mesh`, `AI Texture Projector`, or `Procedural Scatter`) references its target 3D `objectUUID` in `sceneNodes`.
* **Placeholder Ghost Mesh (`[MANDATORY]`):** While an AI node is in the `RUNNING` state generating a 3D mesh, the 3D scene immediately spawns a collaborative **Wireframe Bounding Box / Holographic Shimmer Placeholder** at the target 3D coordinates so all collaborators see where the generated asset will materialize and can position/scale the bounding volume even before inference finishes.

---

## 6. Live Presence, Spatial Cursors & Camera "Follow Mode"

Presence transforms a solitary web app into a living shared space. Every user action must have a clear, non-intrusive visual representation across both 2D and 3D viewports.

### 6.1 Ephemeral Awareness Schema `[MANDATORY]`
Every connected peer broadcasts an Awareness payload structured as follows:

```typescript
interface CollaboratorPresence {
  user: {
    id: string;
    name: string;
    color: string;          // [MANDATORY] High-contrast accessible hex/HSL from deterministic palette
    avatarUrl?: string;
    role: 'VIEWER' | 'COMMENTER' | 'EDITOR' | 'ADMIN'; // [ACCORDING TO PS]
  };
  activeWorkspace: 'WORKFLOW_2D' | 'SCENE_3D' | 'SPLIT_VIEW'; // [MANDATORY]
  
  // 2D AI Workflow Graph Presence
  cursor2D: {
    x: number;              // World-space 2D graph coordinate (pan/zoom invariant)
    y: number;
    hoveredNodeId: string | null;
    activeConnectionDraft?: {
      sourceNodeId: string;
      sourcePortId: string;
      targetX: number;
      targetY: number;
    } | null;               // [MANDATORY] Renders live "ghost wire" while peer drags a noodle!
  } | null;

  // 3D Spatial Viewport Presence
  cursor3D: {
    rayOrigin: [number, number, number];
    rayDirection: [number, number, number];
    hitPosition: [number, number, number] | null; // World-space intersection point on mesh/ground
    hitNormal: [number, number, number] | null;   // Surface normal at hit point
    hitObjectId: string | null;
  } | null;

  // 3D & 2D Camera State (Used for Frustum Rendering & Follow Mode)
  camera: {
    mode: 'PERSPECTIVE' | 'ORTHOGRAPHIC' | 'GRAPH_2D';
    position: [number, number, number]; // For 2D Graph: [panX, panY, zoomScale]
    target: [number, number, number];   // OrbitControls LookAt target in 3D
    quaternion: [number, number, number, number];
    fov: number;
    aspect: number;
  };

  selection: {
    workflowNodeIds: string[];
    sceneObjectIds: string[];
    activeTransformTargetId: string | null; // Soft-lock indicator during gizmo drag
  };

  followState: {
    followingClientId: number | null;       // Who this user is currently following
    isSpotlightBroadcasting: boolean;       // "Follow Me / Presentation Mode" request
  };
  lastUpdated: number;
}
```

### 6.2 2D Workflow Cursors & Live "Ghost Noodle" Wiring `[MANDATORY]`
1. **Pan/Zoom Invariant Coordinates `[MANDATORY]`:**
   * Never broadcast screen pixel coordinates $(px, py)$ for the 2D AI graph cursor, because every user has a different pan offset $(tx, ty)$ and zoom level $k$.
   * Always convert screen coordinates to **Canvas World Coordinates** before broadcasting:
     $$x_{\text{world}} = \frac{px - tx}{k}, \quad y_{\text{world}} = \frac{py - ty}{k}$$
2. **Collaborative Ghost Wires `[MANDATORY]`:**
   * When a peer drags a connection wire out of an AI node port (`activeConnectionDraft`), render a semi-transparent bezier curve in that peer's color from the source port to their live 2D cursor so teammates can see the connection being formed in real time.

### 6.3 3D Spatial Cursors, Laser Rays & Avatar Frustums `[MANDATORY]`
In a 3D scene, a flat 2D screen cursor is meaningless because Collaborator A and Collaborator B are viewing the 3D world from completely different camera angles.
1. **Surface-Aligned 3D Ring + Pin Cursor `[MANDATORY]`:**
   * On the local client, cast a ray from the camera through the mouse NDC coordinates $(u, v) \in [-1, 1]^2$ against the 3D scene BVH (`three-mesh-bvh` for $< 0.2\text{ ms}$ raycasting on high-poly meshes).
   * If the ray intersects a mesh at $\vec{p}_{\text{hit}}$ with surface normal $\vec{n}_{\text{hit}}$, broadcast $(\vec{p}_{\text{hit}}, \vec{n}_{\text{hit}})$.
   * If the ray misses all meshes, intersect against an invisible virtual ground plane ($y = 0$) or project a point at a fixed focal distance $d = \|\vec{c}_{\text{pos}} - \vec{c}_{\text{target}}\|$ along the ray.
   * On remote clients, render a **3D Torus/Disc Decal** at $\vec{p}_{\text{hit}}$ oriented flush with the surface normal $\vec{n}_{\text{hit}}$ via the alignment quaternion $q_{\text{align}}$ from $\vec{u}_{\text{up}} = [0, 0, 1]^T$ to $\vec{n}_{\text{hit}}$, accompanied by a screen-space billboarding name tag that maintains constant pixel size regardless of camera distance.
2. **Collaborator Camera Frustum Avatars `[MANDATORY]`:**
   * In the 3D viewport, render a stylized 3D camera head/avatar with a subtle translucent **Viewing Frustum Cone** at each collaborator's `camera.position` and `camera.quaternion`, plus a subtle laser beam connecting their camera avatar to their 3D cursor $\vec{p}_{\text{hit}}$ when they are actively pointing or dragging.
   * **Proximity Fade `[MANDATORY]`:** If a remote collaborator's 3D camera avatar gets within $1.5\text{ meters}$ of the local user's camera (or when following that user), smoothly fade the avatar's opacity to $0$ using `smoothstep(0.5, 1.5, distance)` so the avatar geometry never blocks the local user's camera lens.

### 6.4 Camera "Follow Mode" & "Spotlight Broadcast" Engine `[MANDATORY]`
Clicking a collaborator's avatar in the top Presence Bar triggers **Follow Mode**, locking the local viewport to mirror their exact experience across both 3D and 2D views.

#### State Machine & Mechanics `[MANDATORY]`
```
                Click Peer Avatar / Accept Spotlight
  ┌───────────┐ ───────────────────────────────────► ┌────────────────┐
  │ FREE_ROAM │                                      │ FOLLOWING_PEER │
  └───────────┘ ◄─────────────────────────────────── └────────────────┘
                Local Input (Orbit/Pan/WASD/Esc)             │
                or Peer Disconnects                          │ Peer switches 2D <-> 3D tab
                                                             ▼
                                                Auto-switch Local Workspace Tab
```

1. **Cross-Viewport Workspace Switching `[MANDATORY]`:**
   * If User A (Follower) is following User B (Leader), and User B switches from the **3D Scene Viewport** to the **2D AI Workflow Graph** (or adjusts a Split View divider), User A's workspace mode automatically transitions to match User B's active view.
2. **3D Camera Pose Synchronization & Aspect Ratio Normalization `[MANDATORY]`:**
   * Simply copying `camera.position` and `camera.quaternion` is not enough: if OrbitControls is used, failing to sync `controls.target` ($\vec{c}_{\text{target}}$) causes the camera to jump violently the moment the follower exits Follow Mode!
   * During every render frame while in `FOLLOWING_PEER` state, smoothly damp both `camera.position` and `orbitControls.target` toward the leader's broadcast values:
     $$\vec{c}_{\text{pos}}(t + \Delta t) = \text{lerp}\left(\vec{c}_{\text{pos}}(t), \vec{c}_{\text{leader\_pos}}, 1 - e^{-18 \Delta t}\right)$$
     $$\vec{c}_{\text{target}}(t + \Delta t) = \text{lerp}\left(\vec{c}_{\text{target}}(t), \vec{c}_{\text{leader\_target}}, 1 - e^{-18 \Delta t}\right)$$
   * **Aspect Ratio Framing Correction `[MANDATORY]`:** If the Leader has an ultrawide monitor ($\text{aspect}_L = 21:9$) and the Follower has a laptop screen ($\text{aspect}_F = 16:9$), objects at the horizontal edges of the Leader's screen will be cropped out on the Follower's screen. When $\text{aspect}_F < \text{aspect}_L$, dynamically widen the Follower's vertical Field of View ($\text{FOV}_F$) so the horizontal frustum width matches the Leader's:
     $$\text{FOV}_F = 2 \arctan\left( \tan\left(\frac{\text{FOV}_L}{2}\right) \cdot \frac{\text{aspect}_L}{\text{aspect}_F} \right)$$
3. **Instant Manual Override / Break-Out `[MANDATORY]`:**
   * Attach capture-phase listeners for user-initiated camera inputs (`pointerdown` on canvas background, `wheel`, `touchstart`, or camera movement hotkeys). Any manual input immediately transitions the state machine from `FOLLOWING_PEER` back to `FREE_ROAM` and hides the colored viewport border.
4. **Visual Indicator Frame `[MANDATORY]`:**
   * While following a user, render a $3\text{ px}$ inset border around the viewport in the Leader's collaborator color with a floating HUD pill at the top center: `"Following [Leader Name] • Press Esc or move camera to exit"`.
5. **Spotlight / "Gather Everyone" Mode `[MANDATORY]`:**
   * Allows a presenter to broadcast `isSpotlightBroadcasting: true`, triggering a non-blocking toast (`"[Name] invites you to follow their view [Follow]"`), or—if the user holds an `ADMIN`/`PRESENTER` role `[ACCORDING TO PS]`—initiating a guided presentation session.

---

## 7. 3D Spatial Annotations & Mesh-Anchored Pin Comments

Standard 2D screen comments break immediately in a 3D environment as soon as the camera rotates. Furthermore, naive 3D world-space comments $(x, y, z)$ break as soon as the underlying 3D mesh is moved, rotated, scaled, or deformed by an AI node!

### 7.1 Multi-Tier Coordinate Anchoring System `[MANDATORY]`
Every 3D Pin Comment stored in `annotations: Y.Map<string, Y.Map<any>>` must use a **Surface-Locked Coordinate Anchor** so the pin stays physically attached to the exact feature on the 3D model no matter how the scene is manipulated:

#### Tier 1: Rigid & Transformed Mesh Anchor (Object-Local Space) `[MANDATORY]`
When a user selects the **Pin Comment Tool** and clicks on a 3D mesh with `objectUUID`:
1. Raycast against the scene to obtain the world-space intersection point $\vec{p}_{\text{world}} \in \mathbb{R}^3$ and world surface normal $\vec{n}_{\text{world}} \in \mathbb{R}^3$.
2. Compute the inverse of the target mesh's current World Matrix $M_{\text{world}}^{-1} \in \mathbb{R}^{4 \times 4}$ and transform the hit point and normal into **Mesh-Local Space**:
   $$\vec{p}_{\text{local}} = M_{\text{world}}^{-1} \begin{bmatrix} \vec{p}_{\text{world}} \\ 1 \end{bmatrix}, \quad \vec{n}_{\text{local}} = \text{normalize}\left((M_{\text{world}}^{-1})^T \vec{n}_{\text{world}}\right)$$
3. Store `anchorMeshId: objectUUID`, `localPosition: [x, y, z]`, and `localNormal: [nx, ny, nz]` in the CRDT annotation object.
4. **On Every Render Frame:** Recompute the pin's live world position by multiplying by the mesh's *current* `matrixWorld`:
   $$\vec{p}_{\text{pin\_world}}(t) = M_{\text{world}}(t) \begin{bmatrix} \vec{p}_{\text{local}} \\ 1 \end{bmatrix}$$
   *Result:* If another collaborator moves, rotates, scales, or parents the 3D mesh to a moving rig, the comment pin travels seamlessly with the mesh surface!

#### Tier 2: Deformable / Skinned / AI-Remeshed Anchor (Barycentric Triangle Coordinates) `[MANDATORY]`
If the mesh has skeletal skinning (`THREE.SkinnedMesh`), morph targets (blendshapes), or vertex displacement:
1. Alongside `localPosition`, record from the raycaster intersection:
   * `faceIndex`: $f \in \mathbb{N}$ (The index of the hit triangle in the mesh geometry index buffer, featuring vertices $\vec{V}_A, \vec{V}_B, \vec{V}_C$).
   * `baryCoord`: $(u, v, w) \in [0, 1]^3$ where $u + v + w = 1$, computed from $\vec{p}_{\text{world}}$ relative to triangle $(\vec{V}_A, \vec{V}_B, \vec{V}_C)$.
2. **On Every Render Frame:** Reconstruct the exact surface point from the deformed positions of vertices $\vec{V}_A', \vec{V}_B', \vec{V}_C'$:
   $$\vec{p}_{\text{surface}} = u \vec{V}_A' + v \vec{V}_B' + w \vec{V}_C'$$
   *Result:* Even if a character waves its arm or a cloth mesh deforms, the 3D comment pin remains glued to the exact polygon!
3. **Fallback Resilience `[MANDATORY]`:** Always store `fallbackWorldPosition: [x, y, z]` in the CRDT annotation. If the referenced `anchorMeshId` is later deleted by a user or regenerated with a completely new topology by an AI node, the comment pin gracefully falls back to `fallbackWorldPosition` (or projects onto the nearest surface of the replacement mesh via BVH `closestPointToPoint`) with a subtle `"Detached from deleted mesh"` badge rather than crashing or disappearing.

### 7.2 Camera Snapshot & Workflow Context Capture `[MANDATORY]`
When a user drops a 3D Pin Comment (or a 2D Workflow Graph Comment), automatically capture and persist in the annotation `Y.Map`:
* `cameraSnapshot`: `{ position, target, quaternion, fov, workspaceMode }`
* `selectedContextIds`: `{ workflowNodeIds, sceneObjectIds }`
* **Click-to-Focus Behavior `[MANDATORY]`:** When any collaborator clicks on a comment thread in the Comment Sidebar or clicks a 3D Pin in the viewport, smoothly animate (`cubic-bezier` or spring SLERP over $650\text{ ms}$) their camera to the exact `cameraSnapshot` pose so they see the exact angle, lighting, and framing the author was looking at when they wrote the comment.

### 7.3 Depth Occlusion, Screen-Space Decluttering & Thread Lifecycle `[MANDATORY]`
1. **Depth-Aware Occlusion Testing `[MANDATORY]`:**
   * A 3D pin located on the *back* side of a mesh must not render at $100\%$ opacity on top of the front of the mesh, as this destroys depth perception.
   * Perform a fast raycast (or WebGL depth buffer readback) from the active camera $\vec{c}_{\text{pos}}$ to $\vec{p}_{\text{pin\_world}}$. If hit distance $d_{\text{hit}} < \|\vec{p}_{\text{pin\_world}} - \vec{c}_{\text{pos}}\| - \epsilon$, mark the pin as `occluded: true` and style its HTML/SVG overlay with `opacity: 0.35`, a dashed border, and reduced scale ($0.85\times$).
2. **Screen-Space Quadtree Clustering `[MANDATORY]`:**
   * When the camera zooms far out and multiple 3D pins project within a $36\text{ px}$ radius in 2D screen space, dynamically merge them into a single **Cluster Badge** (e.g., `"+4"`). Clicking the cluster badge smoothly zooms the camera in to separate the pins.
3. **Rich Collaborative Thread Features `[MANDATORY]`:**
   * Each annotation contains a `messages: Y.Array<Y.Map<any>>` supporting threaded replies, `@mentions` (which trigger real-time notification toasts and offer a `"Jump to Pin"` action), emoji reactions (`Y.Map<string, Y.Array<userId>>`), and `resolved: boolean` status filters.

---

## 8. Distributed Scoped Undo/Redo & History Management

### 8.1 Local-Origin Scoped `Y.UndoManager` `[MANDATORY]`
* **The Multiplayer Undo Rule `[MANDATORY]`:** When User A presses `Ctrl+Z` / `Cmd+Z`, it must **ONLY** undo operations authored by User A, never undoing concurrent edits made by User B on the same 3D scene or AI workflow!
* **Implementation:**
  * Instantiate `new Y.UndoManager([workflowNodes, workflowEdges, sceneNodes, materials, annotations], { trackedOrigins: new Set([localUserOrigin]), captureTimeout: 500 })`.
  * Wrap every local mutation in `doc.transact(() => { ... }, localUserOrigin)`.
  * Remote mutations arriving via WebSocket/WebRTC use the provider instance as their transaction origin and are therefore automatically ignored by User A's `UndoManager`, while seamlessly adjusting User A's undo stack pointers if both users touched the same structure.

### 8.2 Cross-Domain Transaction Grouping `[MANDATORY]`
* If a single user action modifies both the **2D AI Workflow** and the **3D Scene** simultaneously (for example, deleting an AI Generator Node and its linked 3D Mesh in one command), execute both mutations inside a **single `doc.transact(..., localUserOrigin)` block** so a single `Ctrl+Z` restores both the 2D node and the 3D mesh atomically.

---

## 9. Performance, Garbage Collection, Security & Production Resilience

### 9.1 CRDT Tombstone Compaction & Rate Control `[MANDATORY]`
1. **Garbage Collection Enabled (`doc.gc = true`) `[MANDATORY]`:**
   * Keep `doc.gc = true` on all client and server `Y.Doc` instances so overwritten struct blocks from 3D transform commits and parameter scrubbing are immediately compacted in memory.
2. **Scrubber & Color Picker Transaction Coalescing `[MANDATORY]`:**
   * When a user drags a continuous UI slider (e.g., AI `CFG Scale` or 3D `Material Roughness` / `Light Intensity` / `Color Picker`), set `UndoManager` `captureTimeout: 500` and throttle CRDT writes to $15\text{ Hz}$ while broadcasting immediate $60\text{ Hz}$ visual previews via the ephemeral channel.

### 9.2 Security, Validation & Role-Based Access Control (RBAC) `[MANDATORY]`
1. **Read-Only Enforcement at the Protocol Level `[MANDATORY]`:**
   * Never rely solely on hiding UI buttons for `VIEWER` or `COMMENTER` roles. The authoritative WebSocket server (Hocuspocus `onAuthenticate` / `onLoadDocument`) must inspect the user's JWT role:
     * `VIEWER`: Can send Awareness packets (if allowed) and receive `SyncStep2`, but any incoming CRDT `Update` (Message Type `0`, Subtype `2`) from this client is dropped by the server.
     * `COMMENTER`: Server validates incoming CRDT updates in a staging doc or middleware hook, permitting mutations *only* to the top-level `annotations` `Y.Map` and rejecting mutations to `workflowNodes` or `sceneNodes`.
     * `EDITOR` / `ADMIN`: Full read/write access to all shared types.
2. **Schema Sanitization & NaN/Infinity Guards `[MANDATORY]`:**
   * Before applying any 3D transform from a CRDT or Awareness update to the Three.js scene graph, validate that every component of `position`, `quaternion`, and `scale` satisfies `Number.isFinite(val)` and `Math.abs(scale) > 1e-6`. A single `NaN` or `0` scale value injected by a buggy client or malformed packet will corrupt the WebGL projection matrix and turn the entire 3D viewport black for all connected users!

---

## 10. Classification Matrix: `[MANDATORY]` vs. `[ACCORDING TO PS]`

Use this matrix when instructing Antigravity so it knows exactly which engineering systems are non-negotiable vs. which layers must adapt to your specific Problem Statement (PS):

| Subsystem / Feature | Classification | Specification & Adaptation Rules |
| :--- | :---: | :--- |
| **CRDT Core Engine (Yjs + `lib0` Binary Sync)** | **`[MANDATORY]`** | Must use `Y.Doc`, `Y.Map`, `Y.Array`, `Y.Text` with `gc: true` and binary `Uint8Array` framing. |
| **Hybrid WebSocket + WebRTC Transport** | **`[MANDATORY]`** | Durable state over WebSockets; $30\text{--}60\text{ Hz}$ ephemeral cursors/gizmos/cameras over WebRTC or unreliable datagrams. |
| **Offline Persistence (`y-indexeddb`)** | **`[MANDATORY]`** | Instant local hydration and automatic state-vector delta sync upon network recovery. |
| **DAG Cycle Detection & Resolution** | **`[MANDATORY]`** | Automatic post-merge cycle detection on AI workflow edges with deterministic Lamport suspension. |
| **3D Scene Graph Reparenting Cycle Guard** | **`[MANDATORY]`** | Flat `sceneNodes` map with ancestor cycle detection before `updateMatrixWorld()`. |
| **60/120 FPS LERP & Quaternion SLERP** | **`[MANDATORY]`** | Frame-rate independent exponential damping for all remote cursors, gizmo drags, and camera follow modes. |
| **Soft Locking / Selection Auras** | **`[MANDATORY]`** | Colored wireframe outlines and name badges on actively selected/dragged 3D meshes and 2D nodes. |
| **Camera "Follow Mode" & Aspect Normalization** | **`[MANDATORY]`** | Smooth camera + target synchronization, cross-tab auto-switching, FOV aspect adjustment, and instant input break-out. |
| **Mesh-Anchored 3D Pins (Local + Barycentric)** | **`[MANDATORY]`** | Pins must anchor via $(M_{\text{world}}^{-1})$ local coordinates and triangle barycentric $(u, v, w)$ weights with depth occlusion fading. |
| **Local-Origin Scoped `Y.UndoManager`** | **`[MANDATORY]`** | `Ctrl+Z` undoes only the local user's transactions across both 2D and 3D workspaces. |
| **NaN / Infinity Spatial Matrix Guards** | **`[MANDATORY]`** | Strict sanitization of all incoming vectors/quaternions before WebGL/Three.js injection. |
| **Visual Theme, Color Palette & Typography** | **`[ACCORDING TO PS]`** | Dark/Light cybernetic, brutalist, glassmorphic, or industrial studio styling defined by the PS. |
| **Specific AI Node Types & Backend Runners** | **`[ACCORDING TO PS]`** | Whether nodes run Stable Diffusion, LLMs, TripoSR/Meshy 3D generation, Audio, or Agentic workflows depends on PS. |
| **3D Domain & Supported Asset Formats** | **`[ACCORDING TO PS]`** | Architectural CAD, game level design, robotics simulation, medical 3D, or product configurator (.glb, .obj, .splat, .usdz). |
| **User Role Hierarchy & Auth Provider** | **`[ACCORDING TO PS]`** | Specific roles (e.g., Reviewer, Prompt Engineer, 3D Artist, Client) and OAuth/JWT provider determined by PS. |
| **Custom Export / Deployment Pipelines** | **`[ACCORDING TO PS]`** | Exporting the collaborative scene/workflow to JSON, ComfyUI API format, GLTF, or Python code. |

---

## 11. Complete Reference TypeScript Architecture for Antigravity

Provide the following production-ready TypeScript interfaces and core synchronization patterns directly to Antigravity when scaffolding the codebase:

### 11.1 Core Shared CRDT & Spatial Types (`src/types/collaboration.ts`)
```typescript
import * as Y from 'yjs';

export type Vector3Tuple = [number, number, number];
export type QuaternionTuple = [number, number, number, number];
export type Vector2Tuple = [number, number];

// [MANDATORY] 3D Spatial Pin Anchor supporting Rigid, Skinned/Deformable, and World Fallback
export interface SpatialAnchor {
  type: 'MESH_SURFACE' | 'WORLD_SPACE' | 'WORKFLOW_NODE';
  targetObjectId: string | null;       // Mesh UUID or Workflow Node ID
  localPosition: Vector3Tuple;         // Position in target mesh's local space (M_world^-1 * p_world)
  localNormal: Vector3Tuple;           // Surface normal in target mesh's local space
  faceIndex?: number;                  // Triangle index for deformable/skinned meshes
  barycentricCoords?: Vector3Tuple;    // [u, v, w] where u + v + w = 1
  fallbackWorldPosition: Vector3Tuple; // Used if target mesh is deleted
}

export interface CameraSnapshot {
  workspace: 'WORKFLOW_2D' | 'SCENE_3D' | 'SPLIT_VIEW';
  position: Vector3Tuple;
  target: Vector3Tuple;
  quaternion: QuaternionTuple;
  fov: number;
  aspect: number;
}

export interface PinCommentThread {
  id: string;
  anchor: SpatialAnchor;
  cameraSnapshot: CameraSnapshot;
  resolved: boolean;
  createdBy: { id: string; name: string; color: string };
  createdAt: number;
}
```

### 11.2 Mathematical Helpers for Barycentric Pinning & SLERP (`src/lib/spatialMath.ts`)
```typescript
import * as THREE from 'three';
import { SpatialAnchor, Vector3Tuple } from '../types/collaboration';

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();
const _hitLocal = new THREE.Vector3();
const _normalLocal = new THREE.Vector3();
const _invMatrix = new THREE.Matrix4();
const _normalMatrix = new THREE.Matrix3();
const _bary = new THREE.Vector3();

/**
 * [MANDATORY] Computes a surface-locked SpatialAnchor from a Three.js Raycaster Intersection.
 * Guarantees the 3D comment pin moves, rotates, scales, and deforms with the mesh.
 */
export function createMeshSurfaceAnchor(intersection: THREE.Intersection): SpatialAnchor {
  const mesh = intersection.object as THREE.Mesh;
  const worldPoint = intersection.point;
  const worldNormal = intersection.face
    ? intersection.face.normal.clone().transformDirection(mesh.matrixWorld).normalize()
    : new THREE.Vector3(0, 1, 0);

  // Compute inverse world matrix to convert world hit into mesh-local coordinates
  _invMatrix.copy(mesh.matrixWorld).invert();
  _hitLocal.copy(worldPoint).applyMatrix4(_invMatrix);

  _normalMatrix.getNormalMatrix(_invMatrix);
  _normalLocal.copy(worldNormal).applyMatrix3(_normalMatrix).normalize();

  let barycentricCoords: Vector3Tuple | undefined;
  const geometry = mesh.geometry;
  const posAttr = geometry?.attributes?.position;

  if (intersection.face && posAttr) {
    _vA.fromBufferAttribute(posAttr, intersection.face.a);
    _vB.fromBufferAttribute(posAttr, intersection.face.b);
    _vC.fromBufferAttribute(posAttr, intersection.face.c);
    THREE.Triangle.getBarycoord(_hitLocal, _vA, _vB, _vC, _bary);
    barycentricCoords = [_bary.x, _bary.y, _bary.z];
  }

  return {
    type: 'MESH_SURFACE',
    targetObjectId: mesh.uuid,
    localPosition: [_hitLocal.x, _hitLocal.y, _hitLocal.z],
    localNormal: [_normalLocal.x, _normalLocal.y, _normalLocal.z],
    faceIndex: intersection.faceIndex ?? undefined,
    barycentricCoords,
    fallbackWorldPosition: [worldPoint.x, worldPoint.y, worldPoint.z],
  };
}

/**
 * [MANDATORY] Resolves the current world-space [x, y, z] and normal of a SpatialAnchor
 * on every render frame, automatically handling mesh movement, rotation, scaling, or deletion.
 */
export function resolveAnchorWorldTransform(
  anchor: SpatialAnchor,
  sceneMap: Map<string, THREE.Object3D>
): { position: THREE.Vector3; normal: THREE.Vector3; isDetached: boolean } {
  const outPos = new THREE.Vector3(...anchor.fallbackWorldPosition);
  const outNormal = new THREE.Vector3(0, 1, 0);

  if (!anchor.targetObjectId) {
    return { position: outPos, normal: outNormal, isDetached: false };
  }

  const targetObj = sceneMap.get(anchor.targetObjectId) as THREE.Mesh | undefined;
  if (!targetObj) {
    // Mesh was deleted; gracefully fall back to last known world coordinates
    return { position: outPos, normal: outNormal, isDetached: true };
  }

  const posAttr = targetObj.geometry?.attributes?.position;
  const indexAttr = targetObj.geometry?.index;

  // Tier 2: Reconstruct from Barycentric Coordinates if available and valid
  if (
    anchor.barycentricCoords &&
    anchor.faceIndex !== undefined &&
    posAttr
  ) {
    const fIdx = anchor.faceIndex * 3;
    const iA = indexAttr ? indexAttr.getX(fIdx) : fIdx;
    const iB = indexAttr ? indexAttr.getX(fIdx + 1) : fIdx + 1;
    const iC = indexAttr ? indexAttr.getX(fIdx + 2) : fIdx + 2;

    if (iC < posAttr.count) {
      _vA.fromBufferAttribute(posAttr, iA);
      _vB.fromBufferAttribute(posAttr, iB);
      _vC.fromBufferAttribute(posAttr, iC);
      const [u, v, w] = anchor.barycentricCoords;
      outPos.set(0, 0, 0)
        .addScaledVector(_vA, u)
        .addScaledVector(_vB, v)
        .addScaledVector(_vC, w)
        .applyMatrix4(targetObj.matrixWorld);

      outNormal
        .fromArray(anchor.localNormal)
        .transformDirection(targetObj.matrixWorld)
        .normalize();

      return { position: outPos, normal: outNormal, isDetached: false };
    }
  }

  // Tier 1: Reconstruct from Mesh-Local Coordinates
  outPos.fromArray(anchor.localPosition).applyMatrix4(targetObj.matrixWorld);
  outNormal
    .fromArray(anchor.localNormal)
    .transformDirection(targetObj.matrixWorld)
    .normalize();

  return { position: outPos, normal: outNormal, isDetached: false };
}
```

---

## 12. Step-by-Step Execution Checklist for Antigravity

When instructing Antigravity to build or upgrade the application using this knowledge base, execute in the following strict dependency order:

1. **Phase 1: Core CRDT Store & Local-First Persistence `[MANDATORY]`**
   * Initialize singleton `Y.Doc` with `gc: true`, partitioned into `workflowNodes`, `workflowEdges`, `sceneNodes`, `materials`, `annotations`, and `executionState`.
   * Attach `y-indexeddb` for instant offline/local-first hydration and connect hybrid `y-websocket` (Hocuspocus/PartyKit) + `y-webrtc` providers.
   * Configure local-origin scoped `Y.UndoManager` with `Ctrl+Z` / `Ctrl+Y` bindings.
2. **Phase 2: Collaborative AI Workflow Graph Engine `[MANDATORY]`**
   * Bind React Flow / custom 2D WebGL canvas state bidirectionally to `workflowNodes` and `workflowEdges`.
   * Implement deterministic composite edge keys (`source:port->target:port`) and the post-merge **DAG Cycle Detection & Lamport Suspension** guard.
   * Implement `Y.Text` binding for collaborative prompt editing and Merkle hash caching for distributed AI execution status.
3. **Phase 3: Collaborative 3D Scene Graph & Transform Sync `[MANDATORY]`**
   * Bind the 3D scene (`Three.js` / `@react-three/fiber`) to the flat `sceneNodes` map with ancestor cycle prevention.
   * Build the Two-Tier Gizmo Transform Pipeline ($30\text{--}60\text{ Hz}$ ephemeral broadcast during drag + $60\text{--}120\text{ FPS}$ exponential LERP/SLERP damping + single atomic `Y.Doc` commit on `pointerup`).
   * Render collaborative soft-lock selection outlines and AI generation holographic bounding boxes.
4. **Phase 4: Live Presence, 3D Raycast Cursors & Camera Follow Mode `[MANDATORY]`**
   * Broadcast pan/zoom-invariant 2D graph cursors (with live ghost wiring) and BVH-raycasted 3D surface cursors + camera frustum avatars.
   * Implement the `FOLLOWING_PEER` and `SPOTLIGHT` state machine with cross-tab switching, FOV aspect ratio normalization, smooth camera/target damping, and instant user-input break-out.
5. **Phase 5: 3D Mesh-Anchored Pin Comments & Context Snapshots `[MANDATORY]`**
   * Implement the Pin Comment tool using `createMeshSurfaceAnchor` (local matrix inverse + barycentric coordinates).
   * Add per-frame `resolveAnchorWorldTransform` updates, depth-buffer occlusion fading, screen-space quadtree clustering, camera snapshot restoration, and real-time `@mention` threads.