"use client";

import { formatNumber } from "./reportHelpers";

// Clamp a percentage so labels/markers never render fully off the track.
const clampPct = (pct) => Math.min(98, Math.max(2, pct));

/**
 * Horizontal "declared vs OSINT market range" scale.
 *
 * Testable line items get the full treatment: a solid segment for the
 * market low–high range, a dashed segment bridging to the declared value,
 * and a marker line at the declared position. Non-testable items (no usable
 * quantity to place the declared total on the scale) just show the market
 * range on its own with an explanatory note underneath.
 */
export default function PriceComparisonBar({ low, high, mid, declared, unit, testable, note }) {
  if (low == null || high == null) return null;

  // Scale the track so the market range and (when present) the declared
  // marker both fit comfortably, with a little breathing room on the right.
  const scaleMax = Math.max(high, declared || 0) * 1.08;
  const lowPct = clampPct((low / scaleMax) * 100);
  const highPct = clampPct((high / scaleMax) * 100);
  const declaredPct = declared != null ? clampPct((declared / scaleMax) * 100) : null;
  const isOverCeiling = testable && declaredPct != null && declared > high;

  return (
    <div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Solid segment: the OSINT market range itself. */}
        <div
          className="absolute inset-y-0 rounded-full bg-primary/70"
          style={{ left: `${lowPct}%`, width: `${Math.max(highPct - lowPct, 1.5)}%` }}
        />

        {/* Dashed bridge from the top of the market range out to the declared value. */}
        {testable && isOverCeiling && (
          <div
            className="absolute top-1/2 h-0 -translate-y-1/2"
            style={{
              left: `${highPct}%`,
              width: `${declaredPct - highPct}%`,
              backgroundImage:
                "repeating-linear-gradient(to right, var(--danger) 0 4px, transparent 4px 8px)",
              height: 2,
            }}
          />
        )}

        {/* Declared-value marker. */}
        {testable && declaredPct != null && (
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger"
            style={{ left: `${declaredPct}%` }}
          />
        )}
      </div>

      <div className="relative mt-1.5 h-8 text-[11px]">
        <span className="absolute text-muted-foreground" style={{ left: `${lowPct}%` }}>
          {formatNumber(low, { maximumFractionDigits: 0 })}
        </span>
        <span
          className="absolute -translate-x-full text-muted-foreground"
          style={{ left: `${highPct}%` }}
        >
          {formatNumber(high, { maximumFractionDigits: 0 })}
        </span>

        {mid != null && (
          <span className="absolute left-1/2 top-4 -translate-x-1/2 text-muted-foreground">
            market range (mid {formatNumber(mid, { maximumFractionDigits: 0 })})
          </span>
        )}

        {testable && declaredPct != null && (
          <span
            className="absolute top-4 font-semibold text-danger"
            style={{
              left: declaredPct > 85 ? "auto" : `${declaredPct}%`,
              right: declaredPct > 85 ? 0 : "auto",
              transform: declaredPct > 85 ? "none" : "translateX(-50%)",
            }}
          >
            declared {formatNumber(declared, { maximumFractionDigits: 0 })}
          </span>
        )}
      </div>

      {unit && <p className="text-[11px] text-muted-foreground">{unit}</p>}
      {note && <p className="mt-0.5 text-[11px] text-muted-foreground/80">{note}</p>}
    </div>
  );
}
