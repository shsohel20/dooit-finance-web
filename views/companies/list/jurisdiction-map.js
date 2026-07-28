"use client";
import React, { useMemo } from "react";
import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";

/**
 * Jurisdiction choropleth for the Company Dashboard (docs/65 Step 58,
 * ported from the design's jurisdiction-map.html).
 *
 * Differences from the design file, all deliberate:
 *  - The design fetched d3, topojson and the world atlas from unpkg/jsDelivr
 *    at runtime inside an iframe. Here they're real dependencies and the
 *    topology is imported, so the panel doesn't depend on a CDN being
 *    reachable (and can't be blocked by CSP or break offline).
 *  - Countries are matched by NAME against our own data, because that's what
 *    general_information.country_of_incorporation stores. The atlas uses its
 *    own spellings, so ATLAS_ALIASES bridges the ones that differ — without
 *    it those countries would silently render as "zero", which is the worst
 *    kind of failure for a compliance map.
 *  - Sequential encoding: ONE hue, light→dark, more-is-darker. The lightest
 *    step is allowed to recede toward the surface here because it means
 *    "none" — that's the documented sequential rule (an *ordinal* ramp would
 *    have to clear 2:1 instead).
 */

// Our country list (constants/index.js) vs the atlas's spellings. Only the
// pairs that actually differ; verified against both lists rather than guessed.
const ATLAS_ALIASES = {
  "united states": "United States of America",
  "czech republic": "Czechia",
  "ivory coast": "Côte d'Ivoire",
  "bosnia and herzegovina": "Bosnia and Herz.",
  "dominican republic": "Dominican Rep.",
  "central african republic": "Central African Rep.",
  "democratic republic of the congo": "Dem. Rep. Congo",
  "republic of the congo": "Congo",
  "south sudan": "S. Sudan",
  "north macedonia": "Macedonia",
  "east timor": "Timor-Leste",
};

// Map labels are short codes, not full country names (the design does the
// same). Full names collide badly in dense regions — "United Kingdom 29" and
// "United States of America 9" overlap across the North Atlantic at this
// projection size. The full name still shows on hover and in the
// Concentration list beside the map.
const SHORT_NAMES = {
  "united states of america": "US",
  "united kingdom": "UK",
  australia: "AU",
  "new zealand": "NZ",
  canada: "CA",
  china: "CN",
  india: "IN",
  germany: "DE",
  france: "FR",
  italy: "IT",
  spain: "ES",
  japan: "JP",
  "south korea": "KR",
  "north korea": "KP",
  ireland: "IE",
  netherlands: "NL",
  switzerland: "CH",
  "south africa": "ZA",
  brazil: "BR",
  mexico: "MX",
  indonesia: "ID",
  malaysia: "MY",
  thailand: "TH",
  vietnam: "VN",
  philippines: "PH",
  "united arab emirates": "AE",
  "saudi arabia": "SA",
  turkey: "TR",
  russia: "RU",
  "papua new guinea": "PG",
  czechia: "CZ",
  "côte d'ivoire": "CI",
};
const shortLabel = (name) =>
  SHORT_NAMES[String(name).toLowerCase()] || String(name).replace(/[^A-Za-z ]/g, "").slice(0, 3).toUpperCase();

// City-states and micro-jurisdictions have no polygon at 110m resolution, so
// a choropleth fill can never show them. The design hit this too and
// hard-coded a Singapore dot; this generalises that to the ones our country
// list can actually produce. [lon, lat]
const POINT_ONLY = {
  singapore: { label: "SG", coords: [103.82, 1.35] },
  "hong kong": { label: "HK", coords: [114.17, 22.32] },
  bahrain: { label: "BH", coords: [50.55, 26.07] },
  malta: { label: "MT", coords: [14.38, 35.9] },
  monaco: { label: "MC", coords: [7.42, 43.74] },
  liechtenstein: { label: "LI", coords: [9.55, 47.17] },
  "san marino": { label: "SM", coords: [12.46, 43.94] },
  luxembourg: { label: "LU", coords: [6.13, 49.61] },
  mauritius: { label: "MU", coords: [57.55, -20.35] },
  seychelles: { label: "SC", coords: [55.49, -4.68] },
  barbados: { label: "BB", coords: [-59.54, 13.19] },
  "marshall islands": { label: "MH", coords: [171.18, 7.11] },
};

/* Sequential teal ramp, light→dark. Steps 2–5 are the design's own; the
   "none" step is the recessive surface tint. */
const RAMP = ["#f0efea", "#cfdedb", "#9dc0ba", "#4f9089", "#0f7368"];
const stepFor = (count, max) => {
  if (!count) return RAMP[0];
  const r = count / (max || 1);
  if (r > 0.6) return RAMP[4];
  if (r > 0.25) return RAMP[3];
  if (r > 0.1) return RAMP[2];
  return RAMP[1];
};

export default function JurisdictionMap({ byCountry = [], height = 190 }) {
  const { paths, points, max } = useMemo(() => {
    const W = 620;
    const H = height;
    const fc = feature(worldTopo, worldTopo.objects.countries);
    // Antarctica ('010') is dropped — it's a third of the projection's ink
    // and never carries a company.
    const features = fc.features.filter((f) => f.id !== "010");

    const counts = new Map();
    for (const row of byCountry) {
      const key = String(row.country || "").trim().toLowerCase();
      if (key) counts.set(key, (counts.get(key) || 0) + (row.count || 0));
    }
    const maxCount = Math.max(1, ...byCountry.map((r) => r.count || 0));

    // Atlas name -> our count, resolving aliases in the direction that lets
    // one lookup per feature.
    const byAtlasName = new Map();
    for (const [key, count] of counts) {
      const atlasName = ATLAS_ALIASES[key] || key;
      byAtlasName.set(String(atlasName).toLowerCase(), count);
    }

    const projection = geoNaturalEarth1().fitExtent(
      [
        [4, 4],
        [W - 4, H - 4],
      ],
      { type: "FeatureCollection", features },
    );
    const pathGen = geoPath(projection);

    const built = features.map((f) => {
      const name = f.properties?.name || "";
      const count = byAtlasName.get(name.toLowerCase()) || 0;
      return { d: pathGen(f), fill: stepFor(count, maxCount), name, count, centroid: count ? geoCentroid(f) : null };
    });

    // Labelled dots: the top few polygon countries, plus every point-only
    // jurisdiction that has companies (which would otherwise be invisible).
    const labelled = built
      .filter((p) => p.count > 0 && p.centroid)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((p) => ({ xy: projection(p.centroid), label: `${shortLabel(p.name)} ${p.count}`, key: p.name }));

    for (const [key, count] of counts) {
      const pt = POINT_ONLY[key];
      if (pt && count > 0) labelled.push({ xy: projection(pt.coords), label: `${pt.label} ${count}`, key });
    }

    return { paths: built, points: labelled.filter((p) => p.xy), max: maxCount, W, H };
  }, [byCountry, height]);

  return (
    <svg viewBox={`0 0 620 ${height}`} className="block h-auto w-full" role="img" aria-label="Companies by country of incorporation">
      <g>
        {paths.map((p, i) => (
          <path key={p.name || i} d={p.d} fill={p.fill} stroke="#ffffff" strokeWidth="0.6">
            {p.count > 0 && <title>{`${p.name}: ${p.count}`}</title>}
          </path>
        ))}
      </g>
      <g>
        {points.map((pt) => (
          <g key={pt.key}>
            <circle cx={pt.xy[0]} cy={pt.xy[1]} r="3.5" fill="#0f7368" stroke="#fff" strokeWidth="1.5" />
            {/* Label ink is a text token, never the mark's own colour. */}
            <text x={pt.xy[0] + 7} y={pt.xy[1] + 3.5} fontSize="10.5" fill="#1a1a18" style={{ fontVariantNumeric: "tabular-nums" }}>
              {pt.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export { RAMP as JURISDICTION_RAMP };
