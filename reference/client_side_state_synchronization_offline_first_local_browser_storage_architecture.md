# Client-Side State Synchronization, Offline-First & Local Browser Storage
> **Antigravity Knowledge Base & Architectural Reference Manual**  
> **Scope:** High-Performance Web Applications, 3D/Canvas-to-DOM Real-Time Bridges, Resilient Client Caching, Offline-First Sync Engines, and Browser Storage Hierarchies.

---

## 0. Antigravity Classification System & Directives

Every architectural concept, pattern, and implementation rule in this document is strictly governed by two operational tags. Any AI agent, architect, or developer utilizing this knowledge base must enforce these rules without exception:

*   **`[MANDATORY]`**: **Non-Negotiable Engineering Standard.**  
    Applies to any concept, API, optimization, or safeguard that is required for a highly professional production web application **OR** anything that measurably improves frame rate, latency, resilience, memory safety, UX responsiveness, or architectural maintainability. *Rule: If it improves the web application's quality, speed, or reliability, it is `[MANDATORY]`, never optional.*
*   **`[ACCORDING TO PS]`**: **Problem Statement & Domain Driven.**  
    Applies to architectural configurations, data schemas, conflict resolution rules, visual themes, offline UI treatments, and asset pipelines whose specific parameters depend on the project's **Problem Statement (PS)**, business domain, target persona, or aesthetic direction.

---

## 1. Complete Architectural Taxonomy & Master Matrix

| Subsystem / Concept | Primary Technology / Web API | Performance / UX Target | Classification |
| :--- | :--- | :--- | :--- |
| **State Segregation (5-Tier Model)** | Zustand, Jotai, TanStack Query, Nuqs | Zero unnecessary React re-renders | `[MANDATORY]` |
| **DOM-to-Canvas Transient State Bridge** | Zustand `subscribe`, Jotai Atoms, `requestAnimationFrame` | $60\text{–}120\text{ FPS}$ ($\le 8.33\text{ ms}$ frame budget) | `[MANDATORY]` |
| **Off-Main-Thread State & Physics Sync** | Web Workers, `SharedArrayBuffer`, `Atomics` | $0\text{ ms}$ main-thread serialization overhead | `[ACCORDING TO PS]` |
| **Theme & Visual Preference Hydration** | Blocking `<head>` Script + `localStorage` + CSS Variables | $0\text{ ms}$ Flash of Unstyled Content (FOUC) | `[MANDATORY]` |
| **Theme Palette, Typography & Motion Tokens** | Design Tokens, Custom Shaders, Post-Processing | Brand/Domain alignment | `[ACCORDING TO PS]` |
| **URL & Router State Synchronization** | `History API`, `nuqs` / TanStack Router Search Params | Deep-linkable, shareable UI & 3D camera states | `[MANDATORY]` |
| **Server Cache & Request Deduplication** | TanStack Query v5 (`staleTime`, `gcTime`, `AbortSignal`) | Zero duplicate in-flight network requests | `[MANDATORY]` |
| **Optimistic Mutations & Instant Rollback** | TanStack Query `onMutate` / `onError` / `onSettled` | $< 16\text{ ms}$ perceived interaction latency | `[MANDATORY]` |
| **Real-Time Stream-to-Cache Ingestion** | WebSockets / SSE / WebTransport $\rightarrow$ `setQueryData` | Sub-$50\text{ ms}$ live delta propagation | `[ACCORDING TO PS]` |
| **Offline Mutation Queue & Hydration** | `persistQueryClient`, IndexedDB Persister, `networkMode` | 100% mutation survival across page reloads | `[MANDATORY]` |
| **Multi-Tab State & Cache Coordination** | `BroadcastChannel API` + `Web Locks API` (`navigator.locks`) | Zero cross-tab race conditions or duplicate syncs | `[MANDATORY]` |
| **Conflict Resolution Policy (LWW vs CRDT)** | Yjs / Automerge (CRDT) or Hybrid Logical Clocks (HLC) | Deterministic eventual consistency | `[ACCORDING TO PS]` |
| **Structured Local Database & Auto-Drafts** | IndexedDB (via Dexie.js or `idb`) | Zero data loss on accidental tab closure/crash | `[MANDATORY]` |
| **Heavy Binary & 3D Asset Storage** | Origin Private File System (OPFS) + Web Workers | Near-native disk I/O for `.glb`, `.ktx2`, `.hdr`, SQLite | `[MANDATORY]` |
| **PWA Service Worker & Asset Caching** | Workbox / Custom Service Worker + `Cache Storage API` | Instant repeat loads ($< 100\text{ ms}$ Time-to-Interactive) | `[MANDATORY]` |
| **Background Sync (Tab Closed Recovery)** | Service Worker `SyncManager` & `PeriodicSyncManager` | OS-level deferred payload delivery | `[MANDATORY]` |
| **Storage Quota & Eviction Protection** | `navigator.storage.persist()` + `.estimate()` + LRU | Prevents silent browser deletion of cached assets | `[MANDATORY]` |
| **Client-Side Stream Compression** | `CompressionStream` / `DecompressionStream` (`gzip`) | $60\%\text{–}85\%$ reduction in IndexedDB/OPFS footprint | `[MANDATORY]` |
| **Runtime Schema Validation on Hydration** | Zod / Valibot + Schema Version Migrators | Prevents crash-loops from stale local storage schemas | `[MANDATORY]` |
| **Client-Side Encryption at Rest** | `Web Crypto API` (`SubtleCrypto` AES-GCM 256) | Protects sensitive PII/drafts on shared devices | `[ACCORDING TO PS]` |

---

## 2. Client-Side State Taxonomy & Segregation `[MANDATORY]`

A foundational failure in complex web applications is treating all state identically inside a single React context or monolithic store. A production system **must** segregate state into five distinct operational tiers based on **mutation frequency**, **ownership**, and **persistence lifecycle**:

1.  **Tier 1: High-Frequency Ephemeral State ($60\text{–}120\text{ Hz}$) `[MANDATORY]`**
    *   *Examples:* 3D camera matrices, pointer/raycaster coordinates, physics body transforms, scroll velocity, audio FFT frequency bins, gesture deltas.
    *   *Rule:* **Never** store in `React.useState` or trigger React component re-renders on every frame. Must use transient subscriptions, mutable refs, or CSS Custom Properties.
2.  **Tier 2: Reactive Client UI State ($< 10\text{ Hz}$) `[MANDATORY]`**
    *   *Examples:* Active sidebar panels, selected 3D mesh ID, modal visibility, command palette state, active tool mode.
    *   *Rule:* Managed via atomic stores (Jotai) or selector-optimized stores (Zustand with `useShallow`).
    *   *Domain Specifics `[ACCORDING TO PS]`:* Which panels, tools, inspector widgets, and workspace layouts exist depend entirely on the Problem Statement.
3.  **Tier 3: Asynchronous Server Cache State `[MANDATORY]`**
    *   *Examples:* User profiles, REST/GraphQL entities, paginated feeds, permissions, remote scene metadata.
    *   *Rule:* Owned exclusively by **TanStack Query** (or Apollo/urql for specialized GraphQL). **Never** copy server state into a global Zustand/Redux store manually (creates stale dual-source-of-truth bugs).
4.  **Tier 4: Durable Local & Offline-First State `[MANDATORY]`**
    *   *Examples:* Unsaved user drafts, offline mutation queues, cached `.glb`/`.ktx2` binary buffers, user preferences, undo/redo history stacks.
    *   *Rule:* Persisted asynchronously to **IndexedDB** or **OPFS** with schema versioning and corruption recovery.
5.  **Tier 5: URL & Location State `[MANDATORY]`**
    *   *Examples:* Search filters, pagination cursors, active tab, modal entity IDs, and shareable 3D viewport coordinates (`?cam=12.4,5.0,-8.2&target=mesh_42`).
    *   *Rule:* Synchronized bidirectionally with the browser URL via type-safe search param managers (`nuqs` or TanStack Router) with debounced `history.replaceState` for continuous inputs.

---

## 3. DOM-to-Canvas High-Frequency State Bridge ($60\text{–}120\text{ FPS}$)

Modern interactive applications frequently combine a WebGL/WebGPU canvas (Three.js, React Three Fiber, Babylon.js, PixiJS, or HTML5 2D Canvas) with a React DOM overlay (HUDs, floating spatial annotations, property inspectors, timelines).

### 3.1 The Render-Loop Bottleneck & Mathematical Frame Budget `[MANDATORY]`
At $60\text{ FPS}$, the browser has a strict frame budget of:
$$T_{\text{frame}} = \frac{1000\text{ ms}}{60} \approx 16.67\text{ ms}$$
At $120\text{ FPS}$ (ProMotion / high-refresh displays), the budget drops to:
$$T_{\text{frame}} = \frac{1000\text{ ms}}{120} \approx 8.33\text{ ms}$$

If a 3D object moves every frame and calls a standard React state setter (`setCoordinates({ x, y, z })`), React triggers Virtual DOM reconciliation across the component tree on every tick. This easily consumes $10\text{–}30\text{ ms}$ per frame, causing severe frame drops, input lag, and garbage collection pauses.

### 3.2 Pattern A: Zustand Transient Subscriptions (Canvas $\leftrightarrow$ DOM) `[MANDATORY]`
Use Zustand's `.subscribe()` and `.getState()` / `.setState()` to read and write state at $60\text{–}120\text{ FPS}$ **completely outside React's render cycle**.

```typescript
// store/useSpatialBridgeStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SpatialTelemetry {
  cameraPosition: [number, number, number];
  pointerWorld: [number, number, number];
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  fps: number;
}

interface SpatialBridgeActions {
  // High-frequency transient mutators (DO NOT subscribe to these in standard React hooks)
  setTransientTelemetry: (partial: Partial<Pick<SpatialTelemetry, 'cameraPosition' | 'pointerWorld' | 'fps'>>) => void;
  // Low-frequency reactive mutators (Safe for React UI re-renders)
  setHoveredNode: (id: string | null) => void;
  setSelectedNode: (id: string | null) => void;
}

export const useSpatialBridgeStore = create<SpatialTelemetry & SpatialBridgeActions>()(
  subscribeWithSelector((set) => ({
    cameraPosition: [0, 5, 10],
    pointerWorld: [0, 0, 0],
    hoveredNodeId: null,
    selectedNodeId: null,
    fps: 60,

    setTransientTelemetry: (partial) => set(partial),
    setHoveredNode: (id) => set((state) => (state.hoveredNodeId === id ? state : { hoveredNodeId: id })),
    setSelectedNode: (id) => set({ selectedNodeId: id }),
  }))
);
```

#### Writing from 3D Canvas (`useFrame`) & Reading in React DOM via Direct Ref Mutation:
```tsx
// components/SpatialHudOverlay.tsx
import React, { useEffect, useRef } from 'react';
import { useSpatialBridgeStore } from '../store/useSpatialBridgeStore';

export const SpatialHudOverlay: React.FC = () => {
  const coordsTextRef = useRef<HTMLSpanElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);

  // Reactive subscription ONLY to low-frequency state (re-renders only when selection changes)
  const selectedNodeId = useSpatialBridgeStore((s) => s.selectedNodeId);

  useEffect(() => {
    // Transient subscription: fires at 60-120 FPS WITHOUT re-rendering the React component
    const unsubscribe = useSpatialBridgeStore.subscribe(
      (state) => state.pointerWorld,
      ([x, y, z]) => {
        if (coordsTextRef.current) {
          coordsTextRef.current.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)} | Z: ${z.toFixed(2)}`;
        }
        if (crosshairRef.current) {
          // GPU-composited transform update without layout thrashing
          crosshairRef.current.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
        }
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      <div ref={crosshairRef} className="will-change-transform" />
      <div className="fixed bottom-4 left-4 font-mono text-xs">
        <span ref={coordsTextRef}>X: 0.00 | Y: 0.00 | Z: 0.00</span>
        {selectedNodeId && <div>Active Entity: {selectedNodeId}</div>}
      </div>
    </div>
  );
};
```

### 3.3 Pattern B: Jotai Atomic Fine-Grained Bridge `[MANDATORY]`
When managing hundreds of independent interactive nodes (e.g., node graphs, CAD layers, 3D scene tree items), use **Jotai** `atomFamily` so updating a single node's transform or visibility only notifies the exact DOM element or 3D mesh subscribed to that specific atom.

*   **Canvas Reading Atom Value without React Re-render:** Use `useStore()` from Jotai inside the `requestAnimationFrame` / `useFrame` loop via `store.get(nodeAtom(id))` and `store.set(nodeAtom(id), newValue)`.

### 3.4 Pattern C: Off-Main-Thread Bridge via `SharedArrayBuffer` & Web Workers `[ACCORDING TO PS]`
*   **When to Apply `[ACCORDING TO PS]`:** Required when the Problem Statement involves heavy physics simulations (Rapier/Havok), crowd simulations, procedural terrain generation, particle systems ($> 10,000$ entities), or real-time audio/signal processing.
*   **Implementation `[MANDATORY]` (when applicable):**
    1. Configure HTTP security headers required for shared memory:
       * `Cross-Origin-Opener-Policy: same-origin`
       * `Cross-Origin-Embedder-Policy: require-corp` (or `credentialless`)
    2. Allocate a `SharedArrayBuffer` backed by a `Float32Array` for entity transforms ($[x, y, z, q_x, q_y, q_z, q_w]$ per entity).
    3. The Web Worker writes physics/spatial results directly into the `Float32Array` using `Atomics` synchronization.
    4. The Main Thread (or `OffscreenCanvas`) reads the exact same memory address in the render loop with **zero `postMessage` serialization cost** ($0\text{ ms}$ structured clone overhead).

### 3.5 Memory-Safe Undo/Redo Command Stack (Canvas + DOM) `[MANDATORY]`
Any application allowing user creation, editing, or transformation must provide deterministic Undo/Redo (`Ctrl+Z` / `Ctrl+Y`).
*   **Never** clone the entire state tree on every keystroke or drag tick.
*   **Drag/Transform Coalescing `[MANDATORY]`:** During a continuous 3D gizmo drag (`pointerdown` $\rightarrow$ `pointermove` $\times 120$ $\rightarrow$ `pointerup`), mutate the 3D scene transiently during `pointermove` and commit **only a single state patch** on `pointerup`.
*   **Patch-Based History `[MANDATORY]`:** Use **Immer `produceWithPatches`** to store only forward `patches` and `inversePatches` ( typically $< 200\text{ bytes}$ per action) rather than deep snapshots, and persist the patch stack to IndexedDB so Undo history survives page reloads.

---

## 4. Server State, Client Cache & Optimistic Synchronization

### 4.1 TanStack Query Architecture & Tuning `[MANDATORY]`
All asynchronous REST, GraphQL, or RPC communication must flow through **TanStack Query (v5+)** configured with strict deterministic policies:

*   **Hierarchical Query Key Factories `[MANDATORY]`:** Prevent cache key collisions and enable both broad and surgical invalidation.
    ```typescript
    export const projectKeys = {
      all: ['projects'] as const,
      lists: () => [...projectKeys.all, 'list'] as const,
      list: (filters: Record<string, unknown>) => [...projectKeys.lists(), filters] as const,
      details: () => [...projectKeys.all, 'detail'] as const,
      detail: (id: string) => [...projectKeys.details(), id] as const,
      sceneGraph: (id: string) => [...projectKeys.detail(id), 'scene-graph'] as const,
    };
    ```
*   **Request Deduplication & Cancellation `[MANDATORY]`:**
    *   Multiple components mounting simultaneously and requesting `projectKeys.detail(id)` trigger **only 1 network call**.
    *   Every `queryFn` must accept and forward the `{ signal }` (`AbortSignal`) to `fetch` or `graphql-request` so superseded searches/filter requests are immediately aborted at the TCP/HTTP layer.
*   **Stale-While-Revalidate (`staleTime` vs `gcTime`) `[MANDATORY]`:**
    *   `staleTime`: Duration data is considered fresh (zero background network refetches on mount/window focus). Tune `[ACCORDING TO PS]` (e.g., $30\text{ s}$ for collaborative dashboards, $5\text{ min}$ for static catalogs, `Infinity` for immutable versioned configs).
    *   `gcTime`: Duration inactive cache entries remain in memory/persister before garbage collection (minimum $24\text{ hours}$ when paired with offline persistence).

### 4.2 Optimistic Mutations & Deterministic Rollback Lifecycle `[MANDATORY]`
Users must never wait for a server round-trip ($100\text{–}600\text{ ms}$) to see the result of their action (toggling states, renaming entities, moving cards, updating 3D material properties).

```typescript
// hooks/useOptimisticUpdateNode.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '../api/queryKeys';

interface SceneNodePatch {
  projectId: string;
  nodeId: string;
  changes: { name?: string; position?: [number, number, number]; visible?: boolean };
  clientTimestamp: number; // Hybrid/monotonic timestamp for out-of-order protection
}

export function useOptimisticUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateSceneNode'],
    networkMode: 'offlineFirst', // Enqueues automatically when offline
    mutationFn: async (payload: SceneNodePatch) => {
      const res = await fetch(`/api/projects/${payload.projectId}/nodes/${payload.nodeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      return res.json();
    },

    // 1. INSTANT OPTIMISTIC UPDATE (< 1ms)
    onMutate: async (newPatch) => {
      const queryKey = projectKeys.sceneGraph(newPatch.projectId);

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value for deterministic rollback
      const previousScene = queryClient.getQueryData<Record<string, any>>(queryKey);

      // Optimistically mutate cache
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old || !old.nodes) return old;
        return {
          ...old,
          nodes: {
            ...old.nodes,
            [newPatch.nodeId]: {
              ...old.nodes[newPatch.nodeId],
              ...newPatch.changes,
              _syncStatus: 'optimistic-pending',
            },
          },
        };
      });

      return { previousScene, queryKey };
    },

    // 2. DETERMINISTIC ROLLBACK ON ERROR
    onError: (_err, _newPatch, context) => {
      if (context?.previousScene) {
        queryClient.setQueryData(context.queryKey, context.previousScene);
      }
      // Note: Visual error toast/notification styling is handled [ACCORDING TO PS]
    },

    // 3. RECONCILE SERVER TRUTH
    onSettled: (_data, _error, variables) => {
      // Only invalidate if online; if offline, keep optimistic state until queue flushes
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: projectKeys.sceneGraph(variables.projectId) });
      }
    },
  });
}
```

### 4.3 Handling Concurrent & Dependent Optimistic Mutations `[MANDATORY]`
When a user triggers multiple rapid mutations on the same entity (e.g., creating an item offline and immediately editing it before the server assigns a canonical UUID):
1.  **Client-Generated UUIDv7 `[MANDATORY]`:** Always generate time-ordered **UUIDv7** IDs on the client (`crypto.randomUUID()` or `uuidv7()`) at creation time. Never rely on temporary integer IDs (`temp-1`) that require complex foreign-key rewriting after server response.
2.  **Scoped Mutation Serializing `[MANDATORY]`:** Use TanStack Query v5 `scope: { id: entityId }` inside `useMutation` so mutations targeting the same entity execute sequentially in strict FIFO order rather than racing in parallel over the network.

### 4.4 Real-Time Push Ingestion (WebSocket / SSE $\rightarrow$ Query Cache) `[ACCORDING TO PS]`
*   **When to Apply `[ACCORDING TO PS]`:** Required when the Problem Statement involves live collaboration, multiplayer state, live telemetry, financial tickers, or real-time notifications.
*   **Implementation `[MANDATORY]` (when applicable):**
    *   Never poll with `refetchInterval` when WebSockets or Server-Sent Events (SSE) are available.
    *   Pipe incoming WebSocket JSON Patch events (RFC 6902) directly into `queryClient.setQueryData()`.
    *   Attach a monotonically increasing `revision` or `serverSequenceId` to every cached entity; ignore any incoming WebSocket message where $\text{msg.sequenceId} \le \text{cache.sequenceId}$ to prevent out-of-order network packets from corrupting newer state.

---

## 5. Offline-First Architecture, Conflict Resolution & Multi-Tab Sync

### 5.1 True Connectivity Detection & Exponential Backoff `[MANDATORY]`
*   **The `navigator.onLine` Fallacy `[MANDATORY]`:** `navigator.onLine === true` only means the device is connected to a local router/LAN—it returns `true` on captive portals or dead ISP connections.
*   **Heartbeat Probe & Adaptive Sync `[MANDATORY]`:** Combine `window.addEventListener('online' | 'offline')` with a lightweight `/api/health` `HEAD` probe on failed requests.
*   **Exponential Backoff with Full Jitter `[MANDATORY]`:** Reconnection and mutation retry intervals must follow:
    $$T_{\text{retry}}(n) = \min\left(T_{\max}, \; T_{\text{base}} \cdot 2^n\right) \cdot \text{rand}(0.5, 1.0)$$
    where $T_{\text{base}} = 1000\text{ ms}$ and $T_{\max} = 30000\text{ ms}$, preventing "thundering herd" server overload when connectivity returns.

### 5.2 Persistent Query Cache & Resumable Offline Mutations `[MANDATORY]`
Using `@tanstack/react-query-persist-client` with an **IndexedDB asynchronous persister** (never `localStorage`, which blocks the main thread and is capped at $\sim 5\text{ MB}$):
1.  Persist the dehydrated Query Cache to IndexedDB (throttled every $1000\text{ ms}$).
2.  Register default mutation functions via `queryClient.setMutationDefaults(['updateSceneNode'], { mutationFn: ... })`.
3.  On application boot, inside `PersistQueryClientProvider`'s `onSuccess` callback, invoke:
    ```typescript
    queryClient.resumePausedMutations().then(() => {
      queryClient.invalidateQueries();
    });
    ```
    This guarantees that if a user makes changes while offline, closes the laptop, and reopens the browser hours later, their queued mutations automatically resume and sync.

### 5.3 Conflict Resolution Strategies `[ACCORDING TO PS]`
When offline mutations reconnect and collide with changes made by other users or devices, the resolution strategy must be chosen `[ACCORDING TO PS]`:

| Conflict Strategy | Mechanism | When to Select `[ACCORDING TO PS]` |
| :--- | :--- | :--- |
| **Field-Level Last-Write-Wins (LWW)** | Hybrid Logical Clock (HLC) timestamp per property field (`{ field: value, hlc: "..." }`). | Single-user multi-device apps, CRM forms, settings, standard CRUD dashboards. |
| **State/Operation CRDTs (Yjs / Automerge)** | Mathematical commutative/idempotent merge of concurrent edits at byte/character/node level. | Real-time collaborative rich-text editors, shared whiteboards, multi-user 3D/CAD scenes. |
| **3-Way Merge with Manual Resolution UI** | Server returns HTTP `409 Conflict` with `{ base, local, remote }`; user picks winner in diff modal. | Financial transactions, legal/medical records, code/configuration management systems. |

### 5.4 Multi-Tab Coordination (`BroadcastChannel` + `Web Locks API`) `[MANDATORY]`
Users frequently open multiple tabs of the same application. Without coordination, tabs overwrite each other's IndexedDB state, fire duplicate offline mutation queues, and open redundant WebSocket connections.

```typescript
// sync/MultiTabCoordinator.ts
type TabMessage =
  | { type: 'INVALIDATE_QUERY'; queryKey: unknown[] }
  | { type: 'THEME_CHANGED'; theme: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'DRAFT_UPDATED'; draftId: string; timestamp: number };

export class MultiTabCoordinator {
  private channel: BroadcastChannel;

  constructor(channelName = 'app_state_sync_v1') {
    this.channel = new BroadcastChannel(channelName);
  }

  public broadcast(msg: TabMessage): void {
    this.channel.postMessage(msg);
  }

  public onMessage(handler: (msg: TabMessage) => void): () => void {
    const listener = (event: MessageEvent<TabMessage>) => handler(event.data);
    this.channel.addEventListener('message', listener);
    return () => this.channel.removeEventListener('message', listener);
  }

  /**
   * [MANDATORY] Leader Election via Web Locks API
   * Ensures ONLY ONE tab across the entire browser executes background sync queues
   * or IndexedDB compaction at any given time. If the leader tab closes, the lock
   * is automatically released and acquired by the next standby tab.
   */
  public async runAsLeader(lockName: string, task: (signal: AbortSignal) => Promise<void>): Promise<void> {
    if (!('locks' in navigator)) {
      const ctrl = new AbortController();
      return task(ctrl.signal);
    }
    await navigator.locks.request(lockName, { mode: 'exclusive' }, async () => {
      const abortController = new AbortController();
      await task(abortController.signal);
    });
  }
}
```

---

## 6. Local Browser Storage Hierarchy & Engine Architecture

### 6.1 The Browser Storage Decision Matrix `[MANDATORY]`

| Storage Engine | Thread Model | Capacity Limit | Ideal Data Payload | Anti-Pattern (Never Use For) |
| :--- | :--- | :--- | :--- | :--- |
| **In-Memory (Zustand/Map)** | Main / Worker (Sync) | RAM Bound | Ephemeral $60\text{ FPS}$ state, active decoded GPU references | Unsaved user work, large raw binary caches |
| **`localStorage`** | **Synchronous (Main-Thread Blocking)** | $\sim 5\text{ MB}$ (UTF-16 strings) | Tiny boot flags ($< 4\text{ KB}$): Theme mode, locale | JSON caches, tokens (XSS risk), binary data, drafts |
| **`IndexedDB` (Dexie / `idb`)** | Asynchronous (Main + Worker) | Up to $60\%\text{–}80\%$ of free disk | Structured JSON records, indexed queries, unsaved drafts, mutation queues | High-frequency byte-range writes on massive files |
| **Origin Private File System (OPFS)** | Async (Main) / **Synchronous in Web Worker** | Up to $60\%\text{–}80\%$ of free disk | Heavy `.glb`/`.gltf` models, `.ktx2`/`.hdr` textures, WASM SQLite DBs, video/audio chunks | Tiny key-value flags |
| **Cache Storage API** | Asynchronous (Main + Service Worker) | Shared Origin Quota | HTTP `Request`/`Response` pairs, static bundles, immutable CDN assets | Mutating structured application state |

### 6.2 Origin Private File System (OPFS) for Zero-Latency Heavy Assets `[MANDATORY]`
Unlike `IndexedDB`, which serializes objects through the Structured Clone algorithm and incurs transaction overhead, **OPFS** provides direct, private virtual filesystem access optimized at the OS level. Inside a dedicated Web Worker, `FileSystemSyncAccessHandle` allows synchronous `read()` and `write()` directly into `ArrayBuffer` / `SharedArrayBuffer` at near-native C++ speeds ($3\times\text{–}10\times$ faster than IndexedDB for large binary blobs).

```typescript
// workers/opfsAssetWorker.ts
/// <reference lib="webworker" />

type AssetWorkerRequest =
  | { id: string; action: 'READ_OR_FETCH'; cacheKey: string; url: string }
  | { id: string; action: 'WRITE_BUFFER'; cacheKey: string; buffer: ArrayBuffer }
  | { id: string; action: 'DELETE'; cacheKey: string };

async function getAssetsDirectory(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle('binary_assets_v1', { create: true });
}

self.onmessage = async (event: MessageEvent<AssetWorkerRequest>) => {
  const { id, action, cacheKey } = event.data;
  try {
    const dir = await getAssetsDirectory();
    const safeFileName = encodeURIComponent(cacheKey);

    if (action === 'READ_OR_FETCH') {
      let fileHandle: FileSystemFileHandle;
      let exists = true;
      try {
        fileHandle = await dir.getFileHandle(safeFileName, { create: false });
      } catch {
        exists = false;
        fileHandle = await dir.getFileHandle(safeFileName, { create: true });
      }

      // Synchronous fast-path inside Web Worker
      const syncHandle = await (fileHandle as any).createSyncAccessHandle();
      try {
        if (exists && syncHandle.getSize() > 0) {
          const size = syncHandle.getSize();
          const buffer = new ArrayBuffer(size);
          syncHandle.read(new DataView(buffer), { at: 0 });
          // Zero-copy transfer back to Main Thread
          self.postMessage({ id, status: 'HIT', buffer }, [buffer]);
          return;
        }

        // Cache Miss: Stream from network and write directly to OPFS disk
        const response = await fetch(event.data.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const netBuffer = await response.arrayBuffer();

        syncHandle.truncate(0);
        syncHandle.write(new DataView(netBuffer), { at: 0 });
        syncHandle.flush();

        // Transfer buffer to Main Thread without cloning
        self.postMessage({ id, status: 'MISS_FETCHED', buffer: netBuffer }, [netBuffer]);
      } finally {
        syncHandle.close(); // CRITICAL: Always close sync handles to release OS lock
      }
    }
  } catch (error: any) {
    self.postMessage({ id, status: 'ERROR', message: error?.message ?? 'OPFS Error' });
  }
};
```

### 6.3 3D & Binary Asset Pipeline (`.glb`, `.ktx2`, `.hdr`, Draco) `[MANDATORY]`
When loading 3D scenes in Three.js / React Three Fiber / Babylon.js:
1.  **Content-Addressable Cache Keys `[MANDATORY]`:** Key every asset by its content hash or explicit version (`model_spaceship_v3.4.2.glb`) so updates automatically bypass stale local entries while unchanged models load in $< 5\text{ ms}$ from OPFS.
2.  **Loader Interception `[MANDATORY]`:** Wrap `GLTFLoader` / `KTX2Loader` so requests check the OPFS Worker first, returning the transferred `ArrayBuffer` directly to `loader.parse(arrayBuffer, path, onLoad, onError)`.
3.  **Strict Memory & GPU Disposal `[MANDATORY]`:**
    *   If creating a `Blob` URL (`URL.createObjectURL(blob)`), revoke it via `URL.revokeObjectURL(url)` immediately after the GPU texture/geometry uploads.
    *   When unmounting 3D scenes, traverse the scene graph and explicitly invoke `geometry.dispose()`, `material.dispose()`, and `texture.dispose()` to prevent WebGL context loss (`CONTEXT_LOST_WEBGL`).
4.  **Specific 3D Assets, Compression Formats & LODs `[ACCORDING TO PS]`:** Whether the application uses Meshopt, Draco geometry compression, KTX2/Basis Universal textures, Gaussian Splats (`.splat`/`.ksplat`), or CAD STEP files is defined `[ACCORDING TO PS]`.

### 6.4 IndexedDB Auto-Draft Engine & Crash Recovery `[MANDATORY]`
Every user input surface (forms, rich-text editors, node graphs, 3D scene modifications, code editors) must implement **Zero-Data-Loss Auto-Drafting**:

```typescript
// storage/draftDatabase.ts
import Dexie, { type Table } from 'dexie';

export interface LocalDraftRecord {
  draftId: string;          // Primary key (e.g., "project_123_scene" or "form_checkout")
  entityType: string;       // Categorization [ACCORDING TO PS]
  schemaVersion: number;    // For safe migration
  payloadCompressed: Uint8Array | Record<string, unknown>;
  isDirty: boolean;         // True if not yet acknowledged by remote server
  updatedAt: number;        // Unix ms
}

export class AppLocalDatabase extends Dexie {
  drafts!: Table<LocalDraftRecord, string>;

  constructor() {
    super('AntigravityOfflineDB');
    this.version(1).stores({
      // Indexed fields ONLY (never index large binary/JSON payload columns)
      drafts: 'draftId, entityType, isDirty, updatedAt',
    });
  }
}

export const localDb = new AppLocalDatabase();
```
*   **Debounced + Lifecycle Flush `[MANDATORY]`:** Debounce IndexedDB writes during active typing/dragging ($300\text{–}500\text{ ms}$), **AND** attach a synchronous listener to `document.addEventListener('visibilitychange')` (when `document.visibilityState === 'hidden'`) and `window.addEventListener('pagehide')` to flush any pending in-memory draft immediately before the tab is backgrounded or closed.

---

## 7. PWA Service Workers, Background Sync & Zero-Latency Reloads

### 7.1 Granular Caching Strategies by Resource Type `[MANDATORY]`
A single caching strategy cannot serve an entire web application. The Service Worker (built via **Workbox `injectManifest`** for full control) must route requests by classification:

1.  **App Shell & Fingerprinted Bundles (`/assets/*.[hash].js|css|wasm`) $\rightarrow$ `CacheFirst` `[MANDATORY]`**
    *   Precached during Service Worker `install`. Served instantaneously from `Cache Storage` ($0\text{ ms}$ network latency).
2.  **Versioned 3D Models, Fonts & Static Media (`.glb`, `.ktx2`, `.hdr`, `.woff2`) $\rightarrow$ `CacheFirst` with Range Request Support `[MANDATORY]`**
    *   Served from OPFS or dedicated `Cache Storage` bucket (`3d-assets-cache-v1`) with `CacheableResponsePlugin({ statuses: [0, 200, 206] })`.
3.  **Non-Fingerprinted Metadata, CMS Content & Avatars $\rightarrow$ `StaleWhileRevalidate` `[MANDATORY]`**
    *   Returns cached response immediately for zero-latency boot, then updates the cache in the background for the next visit.
4.  **HTML Navigation Requests (`mode === 'navigate'`) $\rightarrow$ `NetworkFirst` (with $1.5\text{ s}$ Timeout Fallback to Cached App Shell) `[MANDATORY]`**
    *   Ensures users on fast connections always get the latest deployment, while users on flaky/offline connections fall back to the cached App Shell within $1.5\text{ seconds}$ instead of staring at a white screen for $30\text{ seconds}$.
5.  **REST / GraphQL Mutations (`POST`, `PUT`, `PATCH`, `DELETE`) $\rightarrow$ `NetworkOnly` + `BackgroundSyncPlugin` `[MANDATORY]`**
    *   Registers with the browser's `SyncManager` so failed mutations replay automatically at the OS level even if the user immediately closes the browser tab.

### 7.2 Safe Service Worker Upgrades (Preventing Version Skew) `[MANDATORY]`
*   **Never call `self.skipWaiting()` unconditionally** inside the Service Worker `install` event if the application uses lazy-loaded code splitting (`React.lazy` / dynamic `import()`). Doing so causes the active page to request old chunk hashes against a new Service Worker manifest, crashing the app.
*   **Coordinated Upgrade Flow `[MANDATORY]`:**
    1. New Service Worker installs and enters the `waiting` state.
    2. UI displays a non-intrusive toast/banner (styled `[ACCORDING TO PS]`): *"New version ready to install."* (Or automatically triggers on the next client-side route navigation).
    3. When confirmed, the client posts `{ type: 'SKIP_WAITING' }` to the waiting worker and reloads inside the `navigator.serviceWorker.addEventListener('controllerchange')` callback.

---

## 8. Data Integrity, Compression, Security & Quota Management

### 8.1 Storage Quota Protection & Persistent Storage Request `[MANDATORY]`
Browsers treat all origin storage (IndexedDB, OPFS, Cache API) as **"Best Effort"** by default—meaning under device disk pressure, the browser will silently wipe your cached `.glb` models and offline drafts using an internal LRU algorithm.

```typescript
// storage/quotaManager.ts
export interface StorageHealthReport {
  isPersisted: boolean;
  usageBytes: number;
  quotaBytes: number;
  usagePercentage: number;
}

export async function initializeAndProtectStorage(): Promise<StorageHealthReport> {
  let isPersisted = false;

  if (navigator.storage && navigator.storage.persist) {
    isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      // Request OS/Browser exemption from automatic LRU eviction
      isPersisted = await navigator.storage.persist();
    }
  }

  let usageBytes = 0;
  let quotaBytes = 1;
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    usageBytes = estimate.usage ?? 0;
    quotaBytes = estimate.quota ?? 1;
  }

  const usagePercentage = (usageBytes / quotaBytes) * 100;

  // [MANDATORY] Self-Healing LRU Pruning if storage exceeds 80% of browser quota
  if (usagePercentage > 80) {
    await pruneLeastRecentlyUsedBinaryAssets(0.25); // Free 25% of cached 3D/media assets
  }

  return { isPersisted, usageBytes, quotaBytes, usagePercentage };
}
```
*   **Critical Rule `[MANDATORY]`:** Automated LRU pruning may evict **re-fetchable binary assets** (`.glb`, textures, cached read-queries), but must **NEVER** evict dirty unsaved user drafts (`isDirty === true`) or pending offline mutations.

### 8.2 Native Stream Compression (`CompressionStream`) `[MANDATORY]`
Before writing large JSON scene graphs, undo histories, or dehydrated query caches to IndexedDB/OPFS, compress them natively using the browser's built-in `CompressionStream('gzip')` (zero external library bundle size):

```typescript
// utils/streamCompression.ts
export async function compressJsonToBytes(data: unknown): Promise<Uint8Array> {
  const jsonString = JSON.stringify(data);
  const byteStream = new Blob([jsonString]).stream();
  const compressedStream = byteStream.pipeThrough(new CompressionStream('gzip'));
  const arrayBuffer = await new Response(compressedStream).arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function decompressBytesToJson<T>(bytes: Uint8Array): Promise<T> {
  const byteStream = new Blob([bytes]).stream();
  const decompressedStream = byteStream.pipeThrough(new DecompressionStream('gzip'));
  const jsonString = await new Response(decompressedStream).text();
  return JSON.parse(jsonString) as T;
}
```

### 8.3 Runtime Schema Validation & Corruption Self-Healing `[MANDATORY]`
Local browser storage persists across months of application deployments. Reading raw JSON from `localStorage` or `IndexedDB` without validation is a primary cause of production "white screen of death" crash loops.
*   **Validation Gate `[MANDATORY]`:** Every persisted store (Zustand `persist`, TanStack Query hydrator, IndexedDB draft reader) must validate hydrated data against a **Zod** or **Valibot** schema with an explicit `version` integer and `migrate(persistedState, version)` function.
*   **Self-Healing Fallback `[MANDATORY]`:** If schema validation fails and migration cannot recover the structure, backup the raw payload to a `corrupted_quarantine` IndexedDB table (for diagnostics) and reset the active state cleanly to defaults without crashing the UI.

### 8.4 Client-Side Encryption at Rest (`Web Crypto API`) `[ACCORDING TO PS]`
*   **When to Apply `[ACCORDING TO PS]`:** Required when the Problem Statement involves healthcare (HIPAA), finance, legal documents, confidential enterprise CAD designs, or sensitive PII stored offline.
*   **Implementation `[MANDATORY]` (when applicable):** Use `window.crypto.subtle` with `AES-GCM` ($256\text{-bit}$) and a unique $96\text{-bit}$ Initialization Vector (`IV`) per record before writing to IndexedDB or OPFS. Never store raw encryption keys in `localStorage`.

---

## 9. Problem Statement (PS) Customization & UI/Theme Integration Blueprint

While the underlying synchronization and storage engines are `[MANDATORY]`, how they manifest visually and behaviorally must be tailored **`[ACCORDING TO PS]`**:

### 9.1 Zero-FOUC Theme & Visual State Hydration
*   **Mechanism `[MANDATORY]`:** Inject a tiny, synchronous inline `<script>` inside `<head>` that reads the user's persisted theme/visual state from `localStorage` and sets `document.documentElement.dataset.theme` and CSS Custom Properties **before** the browser paints the first frame ($0\text{ ms}$ Flash of Unstyled Content).
*   **Theme Tokens, Palettes & 3D Environment Sync `[ACCORDING TO PS]`:**
    *   *Visual Identity:* Color palettes, dark/light/high-contrast modes, glassmorphism vs. brutalist borders, typography, and motion curves are strictly defined `[ACCORDING TO PS]`.
    *   *DOM-to-Canvas Theme Sync:* When the theme switches in the DOM, the `useSpatialBridgeStore` must transiently interpolate the 3D Canvas environment lighting, fog color, `.hdr` environment map intensity, and post-processing bloom without tearing down or remounting the WebGL context.

### 9.2 Offline, Sync & Optimistic UI Feedback Surface
*   **Existence of Sync State Indicators `[MANDATORY]`:** The user must always have transparent visibility into whether their work is saved locally, syncing, or offline.
*   **Aesthetic & UX Design `[ACCORDING TO PS]`:**
    *   *Creative / 3D / CAD Studio PS:* Minimalist status pill in the top toolbar (`Saved to Local Disk (OPFS)` $\rightarrow$ `Syncing...` $\rightarrow$ `Cloud Synced`), plus a subtle storage quota meter in the project settings modal.
    *   *Consumer / E-Commerce / Social PS:* Seamless optimistic heart/cart animations with non-blocking bottom toast notifications only if an offline action requires user attention.
    *   *Enterprise / Financial / Mission-Critical PS:* Explicit row-level sync badges (`Pending Sync`, `Conflict Detected`), audit timestamp logs, and side-by-side conflict resolution drawers.

---

## 10. Antigravity Production Audit Checklist

Before marking any web application's State, Offline, and Storage architecture as complete, verify every `[MANDATORY]` gate below:

- [ ] **`[MANDATORY]` Zero React Re-Renders at 60 FPS:** All $60\text{–}120\text{ Hz}$ 3D/Canvas/Pointer coordinates flow through Zustand transient `.subscribe()` or mutable refs/atoms; verified via React DevTools Profiler showing $0$ component renders during continuous camera movement.
- [ ] **`[MANDATORY]` Deterministic Query Caching:** TanStack Query is configured with hierarchical key factories, `AbortSignal` cancellation, and tuned `staleTime`/`gcTime`.
- [ ] **`[MANDATORY]` Sub-16ms Optimistic Mutations:** All user-initiated mutations implement `onMutate` cache updates, `cancelQueries`, and deterministic `onError` snapshot rollbacks.
- [ ] **`[MANDATORY]` Offline Mutation Resumption:** `PersistQueryClientProvider` is backed by IndexedDB with `networkMode: 'offlineFirst'` and `resumePausedMutations()` on boot.
- [ ] **`[MANDATORY]` Multi-Tab Safety:** `BroadcastChannel` syncs state invalidations across tabs, and `navigator.locks` (Web Locks API) prevents concurrent background sync collisions.
- [ ] **`[MANDATORY]` OPFS Binary Asset Pipeline:** Heavy `.glb`, `.ktx2`, `.hdr`, and binary assets are cached and streamed via Origin Private File System (OPFS) Web Workers with proper `URL.revokeObjectURL()` and WebGL `.dispose()` cleanup.
- [ ] **`[MANDATORY]` Zero-Data-Loss Drafts:** Unsaved user inputs auto-save to IndexedDB with `CompressionStream('gzip')` and flush immediately on `visibilitychange` / `pagehide`.
- [ ] **`[MANDATORY]` Quota & Eviction Protection:** `navigator.storage.persist()` is requested, and automated LRU asset pruning triggers at $80\%$ quota while protecting unsaved user drafts.
- [ ] **`[MANDATORY]` Safe Hydration & PWA Updates:** All hydrated local storage payloads pass through Zod/Valibot schema validation, and the Service Worker uses coordinated user-safe upgrade prompts without breaking lazy-loaded chunks.
- [ ] **`[ACCORDING TO PS]` Domain & Visual Alignment:** Conflict resolution rules (LWW vs. CRDT vs. Manual Merge), specific 3D compression formats, encryption-at-rest policies, and theme/sync UI indicators are aligned with the specific Problem Statement.