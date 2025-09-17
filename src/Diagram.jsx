import React from "react";

// Hybrid Hyperledger Fabric + ADI (ZK Rollup) Architecture Diagram (JSX version)
// Clean JSX (no TypeScript syntax) to avoid JSX/TS parse errors.

export default function Diagram() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 p-4">
      <div className="max-w-[1280px] mx-auto grid gap-4">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Hybrid Fabric + ADI (ZK Rollup) — Solution Architecture</h1>
          <p className="mt-1 text-neutral-300">Permissioned workflows on Fabric with zk-rollup settlement on ADI, verified on Ethereum.</p>
        </header>

        <section className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900 shadow-xl">
          <SVGDiagram />
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900">
            <h2 className="text-xl font-medium">Key Components & Flow</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300 list-disc list-inside">
              <li><b>Client Applications</b>: Web, Mobile, and Admin portals invoking Fabric chaincode via SDK.</li>
              <li><b>Hyperledger Fabric</b>: Peers, Orderer, CA; endorsement & private data collections.</li>
              <li><b>Fabric↔ADI Bridge</b>: Relayer/connector that exports state commitments (Merkle roots) from Fabric and submits to ADI.</li>
              <li><b>ADI L2 (ZK Rollup)</b>: Sequencer, Prover, Data Availability; produces zk proofs.</li>
              <li><b>Ethereum L1</b>: Verifier contract validates proofs; optional settlement/finality anchor.</li>
              <li><b>Off-chain Services</b>: Oracles, cron jobs, analytics & subgraph.</li>
              <li><b>Key Management</b>: HSM/KMS/Web3Signer for custodial keys and relayer ops.</li>
            </ul>
            <h3 className="mt-5 text-base font-semibold text-neutral-200">Flow (High-Level)</h3>
            <ol className="mt-2 space-y-2 text-sm text-neutral-300 list-decimal list-inside">
              <li>Clients submit transactions to <b>Fabric</b> (endorsement → order → commit).</li>
              <li>Bridge extracts block/state root; constructs <b>Commitment</b> and posts to <b>ADI L2</b>.</li>
              <li><b>Sequencer</b> orders commitments; <b>Prover</b> generates zk proof of validity.</li>
              <li>Proof is verified on <b>Ethereum L1</b> (verifier contract), anchoring finality.</li>
              <li>Optional callbacks/receipts flow back to Fabric or client services.</li>
              <li>Monitoring & analytics index events on Fabric/ADI/Ethereum for dashboards.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900 md:col-span-2">
            <h2 className="text-xl font-medium">Fit to RFP Use Cases</h2>
            <div className="mt-3 space-y-4 text-sm text-neutral-300">
              {/* UC1 */}
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3">
                <div className="flex items-baseline justify-between">
                  <b>Use Case 1 — TDR (DTCP)</b>
                  <span className="text-emerald-400 text-xs font-semibold">Hybrid fit: Strong</span>
                </div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><b>RFP asks:</b> DRC issuance, transfer, redemption; integrations with <i>Khasra P2</i>, <i>MP Bhulekh</i>, and <i>Samagra ID</i>; marketplace support; auditable lifecycle.</li>
                  <li><b>Fabric:</b> Channels/PDCs for sensitive landowner & parcel data, CA-backed identities, multi-org endorsement (DTCP + allied depts), and role-based approvals.</li>
                  <li><b>Bridge → ADI (ZK):</b> Batch-commit lifecycle events as commitments; public zk proofs on ADI with Ethereum finality for tamper-evident audit, without exposing PII.</li>
                  <li><b>Outcome:</b> Private operations with public assurance; external verifier portals/marketplaces can independently validate state without joining the consortium.</li>
                </ul>
              </div>

              {/* UC2 */}
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3">
                <div className="flex items-baseline justify-between">
                  <b>Use Case 2 — ESB Examination Lifecycle & Certification</b>
                  <span className="text-emerald-400 text-xs font-semibold">Hybrid fit: Strong</span>
                </div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><b>RFP asks:</b> Secure issuance/verification of admit cards, controlled evaluation workflow, results publication, revocation/reissue, bulk legacy anchoring.</li>
                  <li><b>Fabric:</b> Chaincode to hash artefacts (admit cards, encrypted scripts/marks), approvals via endorsement policies, and fine-grained access for exam cells.</li>
                  <li><b>Bridge → ADI (ZK):</b> Periodic rollups of artefact proofs; public verifier/API returns <i>valid / revoked / reissued</i> status backed by L1-verified proofs.</li>
                  <li><b>Outcome:</b> Citizen/recruiter verification at scale without exposing raw records; peak-time load absorbed by L2 while keeping governance on Fabric.</li>
                </ul>
              </div>

              {/* UC3 */}
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3">
                <div className="flex items-baseline justify-between">
                  <b>Use Case 3 — Blockchain-Enabled Samagra Identity</b>
                  <span className="text-emerald-400 text-xs font-semibold">Hybrid fit: Strong</span>
                </div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><b>RFP asks:</b> Minimal on-chain identity assertions, linkage to schemes/benefits, consented verification, immutable change audit, QR-based checks.</li>
                  <li><b>Fabric:</b> Stores consented hashes & linkage references; sync listener mirrors Samagra DB updates; departmental ACLs protect PII.</li>
                  <li><b>Bridge → ADI (ZK):</b> QR resolves to a zk-verified attestation (time-bounded); verifiers get yes/no proofs without accessing personal data.</li>
                  <li><b>Outcome:</b> Front-desk & bulk verification across departments; cross-jurisdiction trust via public anchors, while PII remains private.</li>
                </ul>
              </div>

              <div className="mt-3 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3">
                <div className="flex items-baseline justify-between">
                  <b>Example — Preventing TDR double-spend across districts</b>
                  <span className="text-xs text-neutral-400">Why Hybrid &gt; Fabric-only</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <div>
                    <div className="text-emerald-400 text-xs font-semibold mb-1">Hybrid flow (Fabric + ADI zk)</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li><b>Issue in District A</b> on Fabric with endorsements; state root updated.</li>
                      <li><b>Bridge → ADI</b>: commitment posted; zk proof generated; anchor on Ethereum.</li>
                      <li><b>Attempted reuse in District B</b>: verifier checks proof & policy → detects already-redeemed/locked DRC; rejects instantly <i>without</i> seeing PII.</li>
                      <li><b>Audit</b>: public, tamper-evident trail proves one-time redemption across all districts.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-rose-400 text-xs font-semibold mb-1">Fabric-only flow</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                      <li>District B must trust District A’s API or be onboarded as a peer.</li>
                      <li>If API is down/misconfigured or data is stale, duplicate acceptance risk rises.</li>
                      <li>Cross-district dispute needs inter-ledger log reconciliation—no L1-grade finality.</li>
                      <li>Citizen-facing proof requires opening read paths or data dumps → privacy/ops risks.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900 md:col-span-3">
            <h2 className="text-xl font-medium">Why Hybrid Fits Best</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300 list-disc list-inside">
              <li><b>Privacy & governance where they belong (Fabric)</b>: MSP/CA identities, endorsement policies, channels/PDCs keep PII and departmental workflows private without compromising accountability.</li>
              <li><b>Public verifiability where it matters (ADI ZK)</b>: Periodic, succinct proofs anchor key state to a public chain; citizens, auditors, and other states can verify <i>without</i> joining the consortium or seeing PII.</li>
              <li><b>Inter-department & cross-jurisdiction ready</b>: Bridge publishes minimal commitments/signals; other departments—or even other states—can consume proofs via lightweight verifier tools.</li>
              <li><b>Scale & performance</b>: Day-to-day throughput stays in Fabric; ADI batches/rolls up—cutting cost and avoiding L1 latency in user flows while still achieving cryptographic finality.</li>
              <li><b>Future composability</b>: Verifier portals, wallets, and third-party marketplaces can trust attestations on ADI/Ethereum—unlocking ecosystem integrations.</li>
            </ul>

            <h3 className="mt-5 text-base font-semibold text-neutral-200">If We Used Fabric Only — What We’d Lose</h3>
            <ul className="mt-2 space-y-2 text-sm text-neutral-300 list-disc list-inside">
              <li><b>Citizen-facing transparency gap</b>: External parties must trust a government-run API or be onboarded as peers—neither scales for public verification.</li>
              <li><b>Weaker cross-jurisdiction audit</b>: Hard to prove non-duplication/double-spend across states without a public finality anchor.</li>
              <li><b>Limited ecosystem interoperability</b>: Public dApps/marketplaces can’t independently verify claims; onboarding every verifier into Fabric is operationally heavy.</li>
              <li><b>Operational overhead or privacy leakage</b>: To be transparent, you’d publish data dumps or add many read-only members—either increases cost/complexity or risks exposing sensitive data.</li>
              <li><b>No L1-grade finality</b>: Governance disputes or misconfigurations remain an internal matter; public proofs reduce this risk and improve confidence.</li>
            </ul>

            <p className="mt-4 text-neutral-300/90"><b>Bottom line:</b> <b>Choose Hybrid</b> for MPBSP. It preserves departmental privacy/governance on Fabric while giving citizens, auditors, and other states cryptographic, public verifiability via ADI/Ethereum. <span className="text-neutral-400">Fabric-only</span> leaves structural gaps in public auditability, cross-jurisdiction assurance, and ecosystem integration—addressable only with high cost or unacceptable data-exposure risks.</p>

            <div className="mt-3 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-3">
              <div className="flex items-baseline justify-between">
                <b>Example — Results Day Surge (ESB)</b>
                <span className="text-xs text-neutral-400">Why Hybrid &gt; Fabric-only</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                <div>
                  <div className="text-emerald-400 text-xs font-semibold mb-1">Hybrid flow</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                    <li><b>Public QR verify:</b> Candidates/recruiters scan a QR on the result PDF; the verifier portal checks a zk proof on ADI/Ethereum—no PII is exposed.</li>
                    <li><b>Scale:</b> Peak traffic hits the public proof layer; Fabric peers stay reserved for governed writes and approvals.</li>
                    <li><b>Revocation/reissue:</b> New commitments are rolled up; verifiers immediately see <i>valid/revoked/reissued</i> without trusting a private API.</li>
                    <li><b>Audit:</b> Anyone can independently confirm authenticity even months later, using the same public proof.</li>
                  </ul>
                </div>
                <div>
                  <div className="text-rose-400 text-xs font-semibold mb-1">Fabric-only risks</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
                    <li><b>Chokepoint:</b> Public verification must go through a government API or onboarded peers → overloads and single-operator trust.</li>
                    <li><b>Transparency vs privacy trade-off:</b> Opening read replicas/data dumps to be “transparent” risks sensitive leakage.</li>
                    <li><b>No L1-grade finality:</b> Cross-department or cross-state disputes need inter-ledger reconciliation—slower, less trust-minimized.</li>
                    <li><b>Poor ecosystem fit:</b> Recruiter portals/wallets can’t verify independently; each verifier must be onboarded and maintained.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-neutral-400">
          <p>Adjustable: add more peers/orgs, DA layer choices, multiple provers, or L1 settlement chains.</p>
        </footer>
      </div>
    </div>
  );
}

function Box({ x, y, w, h, title, subtitle, tone = "indigo", icon, iconType }) {
  const tones = {
    indigo: "stroke-indigo-400",
    emerald: "stroke-emerald-400",
    amber: "stroke-amber-400",
    rose: "stroke-rose-400",
    sky: "stroke-sky-400",
    slate: "stroke-slate-400",
  };
  const strokeClass = tones[tone];
  const cx = x + 18; const cy = y + 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} className={`fill-neutral-900 ${strokeClass} drop-shadow-md`} strokeWidth={1.8} />
      {(iconType || icon) && (
        <>
          <circle cx={cx} cy={cy} r={10} className={`fill-neutral-900 ${strokeClass}`} strokeWidth={1.6} />
          {iconType ? (
            <BrandIcon type={iconType} cx={cx} cy={cy} strokeClass={strokeClass} />
          ) : (
            <text x={cx} y={cy + 4} className="fill-neutral-100" fontSize={11} textAnchor="middle">{icon}</text>
          )}
        </>
      )}
      <text x={x + w / 2} y={y + 28} className="fill-white" fontSize={16} fontWeight={700} textAnchor="middle">{title}</text>
      {subtitle && (
        <text x={x + w / 2} y={y + 50} className="fill-neutral-300" fontSize={12} textAnchor="middle">{subtitle}</text>
      )}
    </g>
  );
}

function BrandIcon({ type, cx, cy, strokeClass }) {
  if (type === "ethereum") {
    return (
      <g className={`fill-none ${strokeClass}`} strokeWidth={1.4}>
        <polygon points={`${cx},${cy-7} ${cx+5},${cy} ${cx},${cy+2} ${cx-5},${cy}`} />
        <polygon points={`${cx},${cy+3} ${cx+5},${cy+6} ${cx},${cy+10} ${cx-5},${cy+6}`} />
      </g>
    );
  }
  if (type === "fabric") {
    const s = 3; const g = 2;
    return (
      <g className={`fill-none ${strokeClass}`} strokeWidth={1.4}>
        <rect x={cx - s - g} y={cy - s - g} width={s} height={s} />
        <rect x={cx + g} y={cy - s - g} width={s} height={s} />
        <rect x={cx - s - g} y={cy + g} width={s} height={s} />
        <rect x={cx + g} y={cy + g} width={s} height={s} />
      </g>
    );
  }
  if (type === "adi") {
    return (
      <g className={`fill-none ${strokeClass}`} strokeWidth={1.4}>
        <path d={`M ${cx},${cy-7} L ${cx-6},${cy+7} L ${cx+6},${cy+7} Z`} />
        <line x1={cx - 3} y1={cy + 1} x2={cx + 3} y2={cy + 1} />
      </g>
    );
  }
  return null;
}

function Port({ x, y }) {
  return <circle cx={x} cy={y} r={3.5} className="fill-neutral-200" />;
}

function OrthoArrow({ from, to, mode = "HV", mid, label, n, nPlacement = "suffix", labelDx = 0, labelDy = 0, labelAlign = "middle" }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const midX = mode === "HV" ? (mid ?? (x1 + x2) / 2) : x1;
  const midY = mode === "VH" ? (mid ?? (y1 + y2) / 2) : y1;
  const path = mode === "HV"
    ? `M ${x1},${y1} L ${midX},${y1} L ${midX},${y2} L ${x2},${y2}`
    : `M ${x1},${y1} L ${x1},${midY} L ${x2},${midY} L ${x2},${y2}`;
  const baseLabelX = mode === "HV" ? midX : (x1 + x2) / 2;
  const baseLabelY = mode === "HV" ? (y1 + y2) / 2 - 8 : midY - 8;

  const displayLabel = label
    ? (n ? (nPlacement === "prefix" ? `[${n}] ${label}` : `${label} [${n}]`) : label)
    : undefined;

  return (
    <g>
      <defs>
        <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" className="fill-neutral-300" />
        </marker>
      </defs>
      <path d={path} className="fill-none stroke-neutral-400" strokeWidth={1.6} markerEnd="url(#arrowHead)" />
      <Port x={x1} y={y1} />
      <Port x={x2} y={y2} />
      {displayLabel && (
        <text x={baseLabelX + labelDx} y={baseLabelY + labelDy} className="fill-neutral-300" fontSize={11} textAnchor={labelAlign}>{displayLabel}</text>
      )}
    </g>
  );
}

function SVGDiagram() {
  // Canvas
  const W = 2000;
  const H = 1100;

  // Grid columns
  const xClient = 80;
  const xFabric = 80;
  const xBridge = 740;
  const xADI = 1000;
  const xRight = 1640; // Off-chain & KMS column

  // Rows
  const y1 = 60;   // Clients
  const y2 = 240;  // Fabric
  const y3 = 480;  // Bridge
  const y4 = 700;  // ADI & KMS
  const y5 = 940;  // Ethereum

  // External Interfaces box position (below Fabric, same column, with extra spacing)
  const xEXT = xFabric + 130; // centered under Fabric
  const yEXT = y2 + 300;      // more breathing room

  return (
    <div className="w-full overflow-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Client */}
        <rect x={xClient - 6} y={y1 - 6} width={340 + 12} height={100 + 12} rx={16} className="fill-none stroke-sky-400" opacity={0.18} strokeWidth={8} />
        <Box x={xClient} y={y1} w={340} h={100} title="Client Applications" subtitle="Web • Mobile • Admin Portals" tone="sky" icon="🌐" />
        <text x={xClient + 12} y={y1 + 90} className="fill-neutral-400" fontSize={11}>SDK (Fabric Gateway) · OIDC/IAM</text>

        {/* Fabric */}
        <rect x={xFabric - 6} y={y2 - 8} width={560 + 12} height={240 + 16} rx={18} className="fill-none stroke-indigo-400" opacity={0.18} strokeWidth={8} />
        <Box x={xFabric} y={y2} w={560} h={240} title="Hyperledger Fabric Network" subtitle="Peers • Orderer • CA • Chaincode • PDC" tone="indigo" iconType="fabric" />
        {/* Org1 */}
        <g>
          <rect x={xFabric + 24} y={y2 + 66} width={240} height={80} rx={12} className="fill-neutral-900 stroke-indigo-300" strokeWidth={1.2} />
          <text x={xFabric + 36} y={y2 + 92} className="fill-white" fontSize={13} fontWeight={600}>Org1 Peers</text>
          <text x={xFabric + 36} y={y2 + 114} className="fill-neutral-300" fontSize={11}>Endorsement & State DB</text>
        </g>
        {/* Org2 */}
        <g>
          <rect x={xFabric + 304} y={y2 + 66} width={240} height={80} rx={12} className="fill-neutral-900 stroke-indigo-300" strokeWidth={1.2} />
          <text x={xFabric + 316} y={y2 + 92} className="fill-white" fontSize={13} fontWeight={600}>Org2 Peers</text>
          <text x={xFabric + 316} y={y2 + 114} className="fill-neutral-300" fontSize={11}>Endorsement & State DB</text>
        </g>
        {/* Ordering */}
        <g>
          <rect x={xFabric + 24} y={y2 + 166} width={220} height={60} rx={10} className="fill-neutral-900 stroke-indigo-300" strokeWidth={1.2} />
          <text x={xFabric + 36} y={y2 + 200} className="fill-white" fontSize={12} fontWeight={600}>Ordering Service</text>
        </g>
        {/* PDC */}
        <g>
          <rect x={xFabric + 280} y={y2 + 166} width={260} height={60} rx={10} className="fill-neutral-900 stroke-indigo-300" strokeWidth={1.2} />
          <text x={xFabric + 292} y={y2 + 200} className="fill-white" fontSize={12} fontWeight={600}>Private Data Collections (PDC)</text>
        </g>

        {/* Off-chain */}
        <rect x={xRight - 6} y={y2 - 6} width={300 + 12} height={240 + 12} rx={16} className="fill-none stroke-slate-400" opacity={0.18} strokeWidth={8} />
        <Box x={xRight} y={y2} w={300} h={240} title="Off-chain Services" subtitle="Oracles • Cron • Subgraph • Analytics" tone="slate" icon="🛠️" />
        <text x={xRight + 16} y={y2 + 92} className="fill-neutral-400" fontSize={11}>Chainlink Feeds</text>
        <text x={xRight + 16} y={y2 + 116} className="fill-neutral-400" fontSize={11}>Event Indexer</text>
        <text x={xRight + 16} y={y2 + 140} className="fill-neutral-400" fontSize={11}>Monitoring / Alerts</text>

        {/* Interfaces to External Systems (clearer panel) */}
        <rect x={xEXT - 8} y={yEXT - 8} width={300 + 16} height={180 + 16} rx={16} className="fill-none stroke-slate-400" opacity={0.22} strokeWidth={8} />
        <Box x={xEXT} y={yEXT} w={300} h={180} title="Interfaces to External Systems" tone="slate" icon="🔌" />
        {(() => {
          const items = [
            { t: "Khasra P2", icon: "📄" },
            { t: "MP Bhulekh", icon: "🗺️" },
            { t: "Samagra ID", icon: "🪪" },
            { t: "Bank/PG", icon: "🏦" },
            { t: "GIS", icon: "📍" },
          ];
          return (
            <g>
              {items.map((it, i) => (
                <g key={it.t}>
                  <rect x={xEXT + 14} y={yEXT + 56 + i * 24} width={300 - 28} height={20} rx={6} className="fill-neutral-900 stroke-slate-300" strokeWidth={1} />
                  <text x={xEXT + 30} y={yEXT + 70 + i * 24} className="fill-neutral-300" fontSize={11}>{it.icon} {it.t}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {/* Fabric ↔ ADI Bridge */}
        <rect x={xBridge - 6} y={y3 - 6} width={320 + 12} height={120 + 12} rx={16} className="fill-none stroke-amber-400" strokeWidth={8} opacity={0.18}>
          <animate attributeName="opacity" dur="2.6s" values="0.18;0.36;0.18" begin="0s" repeatCount="indefinite" />
        </rect>
        <Box x={xBridge} y={y3} w={320} h={120} title="Fabric ↔ ADI Bridge" subtitle="Relayer • Commitment Exporter" tone="amber" icon="🔗" />
        <text x={xBridge + 20} y={y3 + 104} className="fill-neutral-400" fontSize={11}>Merkle Root / State Diff</text>

        {/* ADI L2 (ZK Rollup) */}
        <rect x={xADI - 6} y={y4 - 8} width={520 + 12} height={170 + 16} rx={18} className="fill-none stroke-emerald-400" strokeWidth={8} opacity={0.18}>
          <animate attributeName="opacity" dur="2.6s" values="0.18;0.34;0.18" begin="0.3s" repeatCount="indefinite" />
        </rect>
        <Box x={xADI} y={y4} w={520} h={170} title="ADI L2 (ZK Rollup)" subtitle="Sequencer • Prover • Data Availability" tone="emerald" iconType="adi" />
        <g>
          <rect x={xADI + 20} y={y4 + 60} width={160} height={80} rx={12} className="fill-neutral-900 stroke-emerald-300" strokeWidth={1.2} />
          <text x={xADI + 32} y={y4 + 86} className="fill-white" fontSize={13} fontWeight={600}>⏩ Sequencer</text>
          <text x={xADI + 32} y={y4 + 110} className="fill-neutral-300" fontSize={11}>Order commitments</text>
        </g>
        <g>
          <rect x={xADI + 190} y={y4 + 60} width={160} height={80} rx={12} className="fill-neutral-900 stroke-emerald-300" strokeWidth={1.2} />
          <text x={xADI + 202} y={y4 + 86} className="fill-white" fontSize={13} fontWeight={600}>🧮 Prover</text>
          <text x={xADI + 202} y={y4 + 110} className="fill-neutral-300" fontSize={11}>Generate zkSNARK</text>
        </g>
        <g>
          <rect x={xADI + 360} y={y4 + 60} width={160} height={80} rx={12} className="fill-neutral-900 stroke-emerald-300" strokeWidth={1.2} />
          <text x={xADI + 372} y={y4 + 86} className="fill-white" fontSize={13} fontWeight={600}>📦 Data Availability</text>
          <text x={xADI + 372} y={y4 + 110} className="fill-neutral-300" fontSize={11}>Commitment blobs</text>
        </g>

        {/* Ethereum & KMS (same row) */}
        <rect x={xADI - 6} y={y5 - 6} width={380 + 12} height={110 + 12} rx={16} className="fill-none stroke-rose-400" strokeWidth={8} opacity={0.22}>
          <animate attributeName="opacity" dur="2.6s" values="0.22;0.38;0.22" begin="0.6s" repeatCount="indefinite" />
        </rect>
        <Box x={xADI} y={y5} w={380} h={110} title="Ethereum L1" subtitle="Verifier Contract • Finality Anchor" tone="rose" iconType="ethereum" />
        <rect x={xRight - 6} y={y5 - 6} width={300 + 12} height={110 + 12} rx={16} className="fill-none stroke-slate-400" opacity={0.2} strokeWidth={8} />
        <Box x={xRight} y={y5} w={300} h={110} title="KMS / HSM / Web3Signer" subtitle="Custodial Keys • Relayer" tone="slate" icon="🔒" />

        {/* ---- Ports (precomputed) ---- */}
        {(() => {
          const ports = {
            clientBottom: [xClient + 340 / 2, y1 + 100],
            org1Top: [xFabric + 24 + 240 / 2, y2 + 66],
            fabricTopAligned: [xClient + 340 / 2, y2],
            pdcRight: [xFabric + 280 + 260, y2 + 166 + 30],
            bridgeLeft: [xBridge, y3 + 60],
            bridgeRight: [xBridge + 320, y3 + 60],
            bridgeBottom: [xBridge + 160, y3 + 120],
            seqLeft: [xADI + 20, y4 + 60 + 40],
            proverBottom: [xADI + 190 + 80, y4 + 60 + 80],
            ethTop: [xADI + 380 / 2, y5],
            ethRight: [xADI + 380, y5 + 55],
            kmsLeft: [xRight, y5 + 55],
            fabricRight: [xFabric + 560, y2 + 120],
            offLeftMid: [xRight, y2 + 120],
            adiRight: [xADI + 520, y4 + 85],
            offLeftHigh: [xRight, y2 + 90],
            offLeftLow: [xRight, y2 + 150],
            extTop: [xEXT + 150, yEXT],
            fabricBottom: [xFabric + 560 / 2, y2 + 240],
          };

          return (
            <g>
              {/* (1) Client → Fabric */}
              <OrthoArrow from={ports.clientBottom} to={ports.fabricTopAligned} mode="VH" n={1} label="Txn (endorse→order→commit)" />

              {/* Fabric → External Interfaces (downwards) */}
              <OrthoArrow from={ports.fabricBottom} to={ports.extTop} mode="VH" label="External registries / systems" />

              {/* (2) PDC → Bridge */}
              <OrthoArrow from={ports.pdcRight} to={ports.bridgeLeft} mode="HV" n={2} label="State root / block header" />

              {/* (3) Bridge → Sequencer */}
              <OrthoArrow from={ports.bridgeBottom} to={ports.seqLeft} mode="VH" mid={y4 + 100} n={3} label="Commitment batch → Sequencer" labelDx={-50} labelAlign="end" />

              {/* (4) Prover → Ethereum */}
              <OrthoArrow from={ports.proverBottom} to={ports.ethTop} mode="VH" mid={y4 + 192} n={4} label="zk proof" />

              {/* (5) Ethereum → KMS */}
              <OrthoArrow from={ports.ethRight} to={ports.kmsLeft} mode="HV" n={5} label="Receipt / event (optional)" />

              {/* (6) Fabric/ADI/Ethereum → Off-chain (shared intake rail) */}
              <OrthoArrow from={ports.fabricRight} to={ports.offLeftMid} mode="HV" mid={xRight - 60} n={6} label="Events / metrics" />
              <OrthoArrow from={ports.adiRight} to={ports.offLeftHigh} mode="HV" mid={xRight - 60} />
              <OrthoArrow from={ports.ethRight} to={ports.offLeftLow} mode="HV" mid={xRight - 60} />
            </g>
          );
        })()}

        {/* Legend */}
        <g>
          <text x={80} y={H - 30} className="fill-neutral-400" fontSize={12}>Legend: 1 Client→Fabric | 2 Fabric→Bridge | 3 Bridge→ADI | 4 ADI→Ethereum | 5 Ethereum→KMS | 6 Observability</text>
        </g>
      </svg>
    </div>
  );
}
