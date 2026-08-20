import { forceSimulation, forceManyBody, forceCollide, forceX, forceY, forceLink } from "d3-force";

const TWO_PI = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Relaxes one community's members into an organic (non-grid) cluster
 * around its own local origin, via a small synchronous force simulation —
 * seeded on a phyllotaxis spiral so it starts from an already-organic,
 * non-overlapping arrangement rather than random noise. Ticked manually
 * (not `.on("tick")`) and stopped immediately: this runs once at layout
 * time, not in the render loop.
 */
function packCommunityOrganic(members, allEdges, nodeRadius) {
  const n = members.length;
  if (n === 1) return [{ x: 0, y: 0 }];

  const idIndex = new Map(members.map((m, i) => [m.id, i]));
  const localNodes = members.map((m, i) => {
    const r = (nodeRadius + 4) * 1.6 * Math.sqrt(i + 1);
    const a = i * GOLDEN_ANGLE;
    return { id: m.id, x: Math.cos(a) * r, y: Math.sin(a) * r };
  });

  const links = [];
  for (const e of allEdges) {
    const si = idIndex.get(e.source);
    const ti = idIndex.get(e.target);
    if (si == null || ti == null || si === ti) continue;
    links.push({ source: e.source, target: e.target, weight: e.weight });
  }

  const sim = forceSimulation(localNodes)
    .force("charge", forceManyBody().strength(-22))
    .force("collide", forceCollide(nodeRadius + 3).strength(0.9).iterations(2))
    .force("x", forceX(0).strength(0.05))
    .force("y", forceY(0).strength(0.05))
    .stop();

  if (links.length) {
    sim.force(
      "link",
      forceLink(links)
        .id((d) => d.id)
        .distance((l) => 56 / (0.6 + Math.min(3, l.weight)))
        .strength(0.3),
    );
  }

  for (let i = 0; i < 220; i++) sim.tick();

  return localNodes.map((ln) => ({ x: ln.x, y: ln.y }));
}

/**
 * Computes a community-aware layout: communities are arranged around the
 * root on a circle, at a radius inversely proportional to how strongly
 * connected they are to the root (stronger ties sit closer), each claiming
 * an angular slice proportional to sqrt(its size). Members within a
 * community are then relaxed organically around that community's centroid.
 *
 * Mutates each non-root node's x/y/targetX/targetY (and adds communityId /
 * communityLabel) in place — same contract as the existing `layoutGraph`,
 * so the calling component's force simulation (forceX/forceY toward
 * target, collide) works unmodified regardless of which layout ran.
 *
 * Returns a summary per community for hull/label rendering and hit-testing.
 */
export function calculateClusterLayout({
  nodes,
  edges,
  communities,
  communityMeta,
  rootId,
  rootWeights,
  W,
  H,
  nodeRadius,
  rootRadius,
}) {
  const cx = W / 2;
  const cy = H / 2;

  const root = nodes.find((n) => n.id === rootId);
  if (root) {
    root.x = root.targetX = cx;
    root.y = root.targetY = cy;
  }

  const groups = new Map();
  for (const n of nodes) {
    if (n.id === rootId) continue;
    const commId = communities.get(n.id);
    if (commId == null) continue;
    if (!groups.has(commId)) groups.set(commId, []);
    groups.get(commId).push(n);
  }

  const commIds = [...groups.keys()].sort((a, b) => a - b);
  if (!commIds.length) return [];

  const closeness = new Map();
  let maxCloseness = 0;
  for (const id of commIds) {
    const members = groups.get(id);
    const sum = members.reduce((s, n) => s + (rootWeights.get(n.id) || 0), 0);
    const avg = sum / members.length;
    closeness.set(id, avg);
    if (avg > maxCloseness) maxCloseness = avg;
  }

  const CELL = nodeRadius * 2 + 26;
  const X_STRETCH = 2.3;
  const BASE_RADIUS = rootRadius + CELL * 2.2;
  const RADIUS_RANGE = CELL * 6.5;
  const GAP = 0.12;
  const MIN_SPAN = 0.18;

  const spans = commIds.map((id) => Math.sqrt(groups.get(id).length));
  const spanTotal = spans.reduce((a, b) => a + b, 0) || 1;
  const availableAngle = Math.max(0, TWO_PI - GAP * commIds.length);

  const summaries = [];
  let cursor = -Math.PI / 2;

  commIds.forEach((id, idx) => {
    const members = groups.get(id);
    const span = Math.max(MIN_SPAN, (spans[idx] / spanTotal) * availableAngle);
    const angle = cursor + span / 2;
    cursor += span + GAP;

    const norm = maxCloseness > 0 ? closeness.get(id) / maxCloseness : 0;
    const radius = BASE_RADIUS + (1 - norm) * RADIUS_RANGE;
    const centroidX = cx + Math.cos(angle) * radius * X_STRETCH;
    const centroidY = cy + Math.sin(angle) * radius;

    const positions = packCommunityOrganic(members, edges, nodeRadius);
    const meta = communityMeta.get(id);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    members.forEach((n, i) => {
      const p = positions[i];
      n.x = n.targetX = centroidX + p.x;
      n.y = n.targetY = centroidY + p.y;
      n.communityId = id;
      n.communityLabel = meta?.label ?? "Behavioral Cluster";
      minX = Math.min(minX, n.x - nodeRadius);
      minY = Math.min(minY, n.y - nodeRadius);
      maxX = Math.max(maxX, n.x + nodeRadius);
      maxY = Math.max(maxY, n.y + nodeRadius);
    });

    summaries.push({
      id,
      label: meta?.label ?? "Behavioral Cluster",
      size: members.length,
      centroidX,
      centroidY,
      bounds: { minX, minY, maxX, maxY },
      memberIds: members.map((n) => n.id),
    });
  });

  return summaries;
}
