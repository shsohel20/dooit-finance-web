import { getRiskColor } from "./lib/graphColors";

export default function NodeDetailPanel({ node, onClose }) {
  const color = getRiskColor(node.riskRating);
  return (
    <div
      className="absolute top-4 right-4 w-72 bg-[#1a1d2e] border border-white/10
                    rounded-xl p-4 shadow-2xl text-sm text-slate-200 z-10"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold text-base">{node.label}</div>
          <div className="text-slate-400 text-xs">{node.id}</div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <Row label="Type" value={node.partyType} />
        <Row label="Role" value={node.role} />
        <Row label="Relation" value={node.relationType ?? "—"} />
        <div className="flex justify-between">
          <span className="text-slate-400">Risk Rating</span>
          <span className="font-semibold" style={{ color }}>
            {node.riskRating}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
