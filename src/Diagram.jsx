import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

/**
 * Fix for SyntaxError around edge labels:
 * - When using JSX inside object literals, wrap the JSX in parentheses.
 *   This avoids TSX parsing ambiguities that can surface as
 *   "Unexpected token, expected ','" in some bundler configurations.
 */

const COLORS = {
  user: { bg: "#E3F2FD", border: "#1565C0", text: "#0D47A1" },
  issuer: { bg: "#E8F5E9", border: "#2E7D32", text: "#1B5E20" },
  zk: { bg: "#F3E5F5", border: "#6A1B9A", text: "#4A148C" },
  chain: { bg: "#FFF3E0", border: "#EF6C00", text: "#E65100" },
  infra: { bg: "#ECEFF1", border: "#37474F", text: "#263238" },
};

function nodeStyle(kind) {
  const c = COLORS[kind] ?? COLORS.infra;
  return {
    background: c.bg,
    border: `2px solid ${c.border}`,
    color: c.text,
    borderRadius: 14,
    padding: 10,
    fontSize: 13,
    lineHeight: 1.25,
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    width: 250,
  };
}

function groupStyle(kind) {
  const c = COLORS[kind] ?? COLORS.infra;
  return {
    background: "rgba(255,255,255,0.55)",
    border: `2px dashed ${c.border}`,
    borderRadius: 18,
    padding: 12,
    zIndex: -20,
    pointerEvents: "none",
    textAlign: "center",
  };
}

const sectionBadge = (text) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 11,
      padding: "2px 8px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.06)",
      marginBottom: 6,
    }}
  >
    {text}
  </span>
);

const nowrapLabel = (text) => (
  <span style={{ whiteSpace: "nowrap" }}>{text}</span>
);

// ====== NODES (single source of truth; views will filter + layout) ======
const initialNodes = [
  // ====== GROUP FRAMES ======
  {
    id: "G_DASH",
    type: "default",
    position: { x: 20, y: -120 },
    data: { label: <div style={{ fontWeight: 900 }}>Control Plane · Dashboard</div> },
    style: { ...groupStyle("user"), width: 720, height: 120 },
    selectable: false,
    draggable: false,
  },
  {
    id: "G_USERS",
    type: "default",
    position: { x: 20, y: 60 },
    data: { label: <div style={{ fontWeight: 900 }}>Users & Apps</div> },
    style: { ...groupStyle("user"), width: 320, height: 620 },
    selectable: false,
    draggable: false,
  },
  {
    id: "G_ISSUER",
    type: "default",
    position: { x: 360, y: 60 },
    data: { label: <div style={{ fontWeight: 900 }}>Issuer Platform</div> },
    style: { ...groupStyle("issuer"), width: 360, height: 620 },
    selectable: false,
    draggable: false,
  },
  {
    id: "G_ZK",
    type: "default",
    position: { x: 740, y: 220 },
    data: { label: <div style={{ fontWeight: 900 }}>ZK Tooling</div> },
    style: { ...groupStyle("zk"), width: 360, height: 320 },
    selectable: false,
    draggable: false,
  },
  {
    id: "G_CHAIN",
    type: "default",
    position: { x: 1120, y: 60 },
    data: { label: <div style={{ fontWeight: 900 }}>ADI Chain</div> },
    style: { ...groupStyle("chain"), width: 380, height: 620 },
    selectable: false,
    draggable: false,
  },

  // ====== DASHBOARD ======
  {
    id: "DASH",
    type: "default",
    position: { x: 260, y: -80 },
    sourcePosition: Position.Right,
    data: {
      label: (
        <div>
          {sectionBadge("One-Click Dashboard")}
          <div style={{ fontWeight: 900, fontSize: 14 }}>🚀 ADI One-Click Dashboard</div>
          <div style={{ opacity: 0.9 }}>(Create Issuers • Schemas • Verifier configs)</div>
        </div>
      ),
    },
    style: nodeStyle("user"),
  },

  // ====== USERS ======
  {
    id: "W",
    type: "default",
    position: { x: 60, y: 190 },
    sourcePosition: Position.Right,
    data: {
      label: (
        <div>
          {sectionBadge("Users & Apps")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🪪 User Wallet</div>
          <div style={{ opacity: 0.9 }}>(Privado-compatible today · ADI Wallet later)</div>
        </div>
      ),
    },
    style: nodeStyle("user"),
  },
  {
    id: "VAPP",
    type: "default",
    position: { x: 60, y: 420 },
    sourcePosition: Position.Right,
    data: {
      label: (
        <div>
          {sectionBadge("Users & Apps")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>✅ Verifier App / dApp</div>
          <div style={{ opacity: 0.9 }}>(Web / Mobile / Backend)</div>
        </div>
      ),
    },
    style: nodeStyle("user"),
  },

  // ====== ISSUER PLATFORM ======
  {
    id: "IUI",
    type: "default",
    position: { x: 410, y: 90 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("Issuer Platform")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🛠️ Issuer Node UI</div>
          <div style={{ opacity: 0.9 }}>(Low-level ops / troubleshooting)</div>
        </div>
      ),
    },
    style: nodeStyle("infra"),
  },
  {
    id: "INODE",
    type: "default",
    position: { x: 410, y: 240 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("Issuer Platform")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🏢 ADI Issuer Node API</div>
          <div style={{ opacity: 0.9 }}>(Fork: issuer-node · iden3-compatible)</div>
        </div>
      ),
    },
    style: nodeStyle("issuer"),
  },
  {
    id: "SCHEMA",
    type: "default",
    position: { x: 410, y: 410 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("Issuer Platform")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>📄 Schemas & VC Templates</div>
          <div style={{ opacity: 0.9 }}>(VC defs, rules)</div>
        </div>
      ),
    },
    style: nodeStyle("infra"),
  },
  {
    id: "KMS",
    type: "default",
    position: { x: 410, y: 560 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("Issuer Platform")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🔑 KMS / Vault / HSM</div>
          <div style={{ opacity: 0.9 }}>(issuer keys)</div>
        </div>
      ),
    },
    style: nodeStyle("infra"),
  },

  // ====== ZK TOOLING ======
  {
    id: "CIR",
    type: "default",
    position: { x: 780, y: 280 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("ZK Tooling")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🧩 ZK Circuits</div>
          <div style={{ opacity: 0.9 }}>(iden3/circuits)</div>
        </div>
      ),
    },
    style: nodeStyle("zk"),
  },
  {
    id: "PROVER",
    type: "default",
    position: { x: 780, y: 430 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("ZK Tooling")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🔐 Prover Engine</div>
          <div style={{ opacity: 0.9 }}>(generates proofs)</div>
        </div>
      ),
    },
    style: nodeStyle("zk"),
  },

  // ====== ADI CHAIN ======
  {
    id: "RPC",
    type: "default",
    position: { x: 1180, y: 160 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Left,
    data: {
      label: (
        <div>
          {sectionBadge("ADI Chain")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>⛓️ ADI RPC</div>
          <div style={{ opacity: 0.9 }}>
            https://rpc.testnet.adifoundation.ai/rpc
            <br />
            chainId = 36900
          </div>
        </div>
      ),
    },
    style: nodeStyle("chain"),
  },
  {
    id: "STATE",
    type: "default",
    position: { x: 1180, y: 340 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: {
      label: (
        <div>
          {sectionBadge("ADI Chain")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>🧾 Iden3 State Contracts</div>
          <div style={{ opacity: 0.9 }}>(iden3/contracts)</div>
        </div>
      ),
    },
    style: nodeStyle("chain"),
  },
  {
    id: "VER",
    type: "default",
    position: { x: 1180, y: 520 },
    targetPosition: Position.Top,
    data: {
      label: (
        <div>
          {sectionBadge("ADI Chain")}
          <div style={{ fontWeight: 800, fontSize: 14 }}>✅ Verifier Contracts</div>
          <div style={{ opacity: 0.9 }}>(on-chain proof verification)</div>
        </div>
      ),
    },
    style: nodeStyle("chain"),
  },
];

// ====== EDGES (kept minimal to avoid overlap; “read/write” are separated) ======
const initialEdges = [
  // Dashboard orchestration (admin flow)
  {
    id: "e-DASH-INODE",
    source: "DASH",
    target: "INODE",
    label: "Create issuers / issuance",
    animated: true,
  },
  { id: "e-DASH-SCHEMA", source: "DASH", target: "SCHEMA", label: "Schemas / VC templates" },
  {
    id: "e-DASH-VAPP",
    source: "DASH",
    target: "VAPP",
    label: "Verifier proof templates",
    pathOptions: { offset: -40 },
  },
  {
    id: "e-DASH-RPC",
    source: "DASH",
    target: "RPC",
    label: "Network + contracts",
    pathOptions: { offset: 40 },
  },
  {
    id: "e-DASH-IUI",
    source: "DASH",
    target: "IUI",
    label: "Deep admin",
    pathOptions: { offset: 60 },
  },

  // Issuer internals (admin flow)
  { id: "e-IUI-INODE", source: "IUI", target: "INODE", label: "Admin ops" },
  { id: "e-INODE-KMS", source: "INODE", target: "KMS", label: "sign/keys" },
  { id: "e-INODE-SCHEMA", source: "INODE", target: "SCHEMA", label: "schemas" },

  // ZK prep
  { id: "e-CIR-PROVER", source: "CIR", target: "PROVER", label: "compile/refs" },
  { id: "e-INODE-PROVER", source: "INODE", target: "PROVER", label: "uses circuits & keys" },

  // Issuance + proof flow (user flow)
  { id: "e-INODE-W", source: "INODE", target: "W", label: "Issue VC", animated: true },
  {
    id: "e-VAPP-W",
    source: "VAPP",
    target: "W",
    label: "Proof Request",
    animated: true,
    pathOptions: { offset: 25 },
  },
  { id: "e-W-PROVER", source: "W", target: "PROVER", label: "Generate ZK Proof", animated: true },
  { id: "e-PROVER-W", source: "PROVER", target: "W", label: "Proof + Signals" },
  {
    id: "e-W-VAPP",
    source: "W",
    target: "VAPP",
    label: "Submit Proof",
    animated: true,
    pathOptions: { offset: -25 },
  },

  // Chain anchoring & checks
  { id: "e-INODE-RPC", source: "INODE", target: "RPC", label: "Publish identity state" },

  // IMPORTANT: JSX labels are wrapped in parentheses to avoid TSX parser ambiguity.
  {
    id: "e-RPC-STATE-W",
    source: "RPC",
    target: "STATE",
    label: (nowrapLabel("State write / update")),
    pathOptions: { offset: 18 },
  },
  {
    id: "e-RPC-STATE-R",
    source: "RPC",
    target: "STATE",
    label: (nowrapLabel("State read")),
    pathOptions: { offset: -18 },
  },

  { id: "e-VAPP-RPC-RESOLVE", source: "VAPP", target: "RPC", label: "Resolve identity state", pathOptions: { offset: -30 } },
  { id: "e-VAPP-RPC-VERIFY", source: "VAPP", target: "RPC", label: "Optional on-chain verify", pathOptions: { offset: 30 } },
  {
    id: "e-RPC-VER",
    source: "RPC",
    target: "VER",
    label: "verify",
    pathOptions: { offset: -20 },
    style: { strokeDasharray: "6 6" },
  },
].map((e) => ({
  ...e,
  type: "smoothstep",
  style: { strokeWidth: 2, strokeDasharray: e.style?.strokeDasharray },
  labelStyle: { fontWeight: 800, fontSize: 12, whiteSpace: "nowrap" },
  labelShowBg: true,
  labelBgPadding: [12, 6],
  labelBgBorderRadius: 8,
  labelBgStyle: { fill: "rgba(255,255,255,0.92)" },
  pathOptions: e.pathOptions,
}));

// ========= Views (clean separation like Emperio tabs) =========
const VIEWS = {
  runtime: "User Flow",
  control: "Admin Flow",
};

const VIEW_NODE_IDS = {
  runtime: ["G_USERS", "G_ISSUER", "G_ZK", "G_CHAIN", "W", "VAPP", "INODE", "CIR", "PROVER", "RPC", "STATE", "VER"],
  control: ["G_DASH", "G_ISSUER", "G_CHAIN", "DASH", "IUI", "INODE", "SCHEMA", "KMS", "RPC", "STATE"],
};

const VIEW_EDGE_IDS = {
  runtime: [
    "e-INODE-W",
    "e-VAPP-W",
    "e-W-PROVER",
    "e-PROVER-W",
    "e-W-VAPP",
    "e-CIR-PROVER",
    "e-INODE-PROVER",
    "e-INODE-RPC",
    "e-RPC-STATE-W",
    "e-RPC-STATE-R",
    "e-VAPP-RPC-RESOLVE",
    "e-VAPP-RPC-VERIFY",
    "e-RPC-VER",
  ],
  control: [
    "e-DASH-INODE",
    "e-DASH-SCHEMA",
    "e-DASH-RPC",
    "e-DASH-IUI",
    "e-IUI-INODE",
    "e-INODE-KMS",
    "e-INODE-SCHEMA",
    "e-INODE-RPC",
    "e-RPC-STATE-W",
    "e-RPC-STATE-R",
  ],
};

// Compact, non-overlapping layouts per view
const VIEW_LAYOUTS = {
  runtime: {
    // frames
    G_USERS: { x: 20, y: 60 },
    G_ISSUER: { x: 360, y: 60 },
    G_ZK: { x: 740, y: 220 },
    G_CHAIN: { x: 1120, y: 60 },

    // nodes
    W: { x: 60, y: 190 },
    VAPP: { x: 60, y: 420 },
    INODE: { x: 410, y: 240 },
    CIR: { x: 780, y: 280 },
    PROVER: { x: 780, y: 430 },
    RPC: { x: 1180, y: 160 },
    STATE: { x: 1180, y: 340 },
    VER: { x: 1180, y: 520 },
  },
  control: {
    // frames
    G_DASH: { x: 20, y: -120 },
    G_ISSUER: { x: 20, y: 60 },
    G_CHAIN: { x: 760, y: 60 },

    // nodes
    DASH: { x: 260, y: -80 },
    IUI: { x: 60, y: 120 },
    INODE: { x: 60, y: 280 },
    SCHEMA: { x: 60, y: 450 },
    KMS: { x: 60, y: 600 },
    RPC: { x: 820, y: 180 },
    STATE: { x: 820, y: 380 },
  },
};

function applyLayout(nodes, viewKey) {
  const layout = VIEW_LAYOUTS[viewKey] ?? {};
  return nodes.map((n) => {
    const pos = layout[n.id];
    return pos ? { ...n, position: pos } : n;
  });
}

function filterByView(allNodes, allEdges, viewKey) {
  const nodeSet = new Set(VIEW_NODE_IDS[viewKey] ?? []);
  const edgeSet = new Set(VIEW_EDGE_IDS[viewKey] ?? []);
  const nodes = allNodes.filter((n) => nodeSet.has(n.id));
  const edges = allEdges.filter((e) => edgeSet.has(e.id));
  return { nodes, edges };
}

// --- lightweight runtime checks (acts like basic tests) ---
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runSanityChecks() {
  // Ensure every ID referenced in views exists as a node.
  const nodeIds = new Set(initialNodes.map((n) => n.id));
  Object.entries(VIEW_NODE_IDS).forEach(([viewKey, ids]) => {
    ids.forEach((id) => {
      assert(nodeIds.has(id), `VIEW_NODE_IDS.${viewKey} references missing node id: ${id}`);
    });
  });

  // Ensure every edge ID referenced in views exists.
  const edgeIds = new Set(initialEdges.map((e) => e.id));
  Object.entries(VIEW_EDGE_IDS).forEach(([viewKey, ids]) => {
    ids.forEach((id) => {
      assert(edgeIds.has(id), `VIEW_EDGE_IDS.${viewKey} references missing edge id: ${id}`);
    });
  });
}

// Run checks once in dev environments. Safe in production too (only runs once at module init).
runSanityChecks();

export default function ADIDIDZKReactFlowDiagram() {
  const [view, setView] = useState("runtime");

  const { nodes: viewNodesInit, edges: viewEdgesInit } = useMemo(() => {
    const filtered = filterByView(initialNodes, initialEdges, view);
    return {
      nodes: applyLayout(filtered.nodes, view),
      edges: filtered.edges,
    };
  }, [view]);

  const [nodes, setNodes, onNodesChange] = useNodesState(viewNodesInit);
  const [edges, setEdges, onEdgesChange] = useEdgesState(viewEdgesInit);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const filtered = filterByView(initialNodes, initialEdges, view);
    setNodes(applyLayout(filtered.nodes, view));
    setEdges(filtered.edges);
    setSelected(null);
  }, [view, setEdges, setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelected({ kind: "node", id: node.id, raw: node });
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    setSelected({ kind: "edge", id: edge.id, raw: edge });
  }, []);

  const legend = useMemo(
    () => [
      { name: "Users & Apps", c: COLORS.user },
      { name: "Issuer Platform", c: COLORS.issuer },
      { name: "ZK Tooling", c: COLORS.zk },
      { name: "ADI Chain", c: COLORS.chain },
      { name: "Infra", c: COLORS.infra },
    ],
    []
  );

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          padding: "10px 12px",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 16,
          marginBottom: 10,
          background: "white",
          boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontWeight: 900 }}>ADI Identity Stack (iden3-compatible) · {VIEWS[view]}</div>
        <div style={{ opacity: 0.6, fontSize: 12 }}>
          Admin Flow = configure issuers, schemas, networks · User Flow = wallets, proofs, verification
        </div>
        <div style={{ opacity: 0.7, fontSize: 13 }}>Clean grouped view. Drag nodes if needed.</div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setView("runtime")}
            title="Live user interactions: wallets generate proofs, verifiers check"
            style={{
              padding: "6px 10px",
              borderRadius: 12,
              border: view === "runtime" ? "2px solid rgba(0,0,0,0.25)" : "1px solid rgba(0,0,0,0.12)",
              background: view === "runtime" ? "rgba(0,0,0,0.05)" : "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            User Flow
          </button>
          <button
            onClick={() => setView("control")}
            title="Admin setup: issuers, schemas, keys, chain configuration"
            style={{
              padding: "6px 10px",
              borderRadius: 12,
              border: view === "control" ? "2px solid rgba(0,0,0,0.25)" : "1px solid rgba(0,0,0,0.12)",
              background: view === "control" ? "rgba(0,0,0,0.05)" : "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Admin Flow
          </button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {legend.map((x) => (
            <div key={x.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: x.c.bg,
                  border: `2px solid ${x.c.border}`,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 12, opacity: 0.8 }}>{x.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(80vh - 60px)",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
          background: "#FAFAFA",
        }}
      >
        {/* Inspector */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 50,
            width: 340,
            maxWidth: "calc(100% - 24px)",
            background: "white",
            borderRadius: 16,
            padding: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Inspector</div>
          {!selected ? (
            <div style={{ fontSize: 13, opacity: 0.75 }}>Click any node or edge to see details.</div>
          ) : selected.kind === "node" ? (
            <div style={{ fontSize: 13 }}>
              <div style={{ opacity: 0.7 }}>Node</div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{selected.id}</div>
              <div style={{ opacity: 0.85 }}>
                In this diagram: Admin Flow = setup/governance · User Flow = live proof execution.
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13 }}>
              <div style={{ opacity: 0.7 }}>Edge</div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{selected.id}</div>
              <div style={{ opacity: 0.7, marginBottom: 4 }}>From → To</div>
              <div style={{ opacity: 0.85 }}>
                {selected.raw?.source} → {selected.raw?.target}
              </div>
              <div style={{ opacity: 0.7, marginTop: 10, marginBottom: 4 }}>Label</div>
              <div style={{ opacity: 0.85 }}>{selected.raw?.label ?? "—"}</div>
            </div>
          )}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          fitViewOptions={{ padding: 0.28 }}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap pannable zoomable nodeStrokeWidth={3} nodeBorderRadius={10} />
          <Controls />
          <Background gap={18} />
        </ReactFlow>
      </div>
    </div>
  );
}
