"use client";
/**
 * Shared KYB form kit (docs/65 Step 62).
 *
 * These primitives and design tokens were defined inside the company
 * add/edit wizard. They were lifted here unchanged when the standalone Trust
 * pages were built, so both surfaces render one implementation instead of
 * two that drift. No behaviour was altered in the move.
 */
import React, { useMemo } from "react";
import { countriesData } from "@/constants";
import SearchableSelect from "@/components/AsyncPaginatedSelect";

/* ------------------------------------------------------------------ */
/* Design tokens (KYB design bundle)                                   */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#eef0ee",
  ink: "#1a2331",
  sub: "#79808d",
  subtle: "#8a92a0",
  body: "#3f4756",
  mid: "#5b6474",
  faint: "#a7aeb8",
  line: "#e2e5df",
  hair: "#e8eae6",
  green: "#1f6f5c",
  greenDark: "#16513f",
  greenText: "#17795e",
  greenBg: "#e7f2ee",
  amber: "#b5731f",
  amberDeep: "#8a5615",
  amberIcon: "#c9822a",
  amberBg: "#fbf3e8",
  amberSoft: "#fdf9f2",
  amberLine: "#f0dcbd",
  amberHair: "#e4cba1",
  red: "#a5342a",
  redDeep: "#7a2b23",
  redSoft: "#fdf2f1",
  redLine: "#f1cfc9",
  blueBg: "#e7edf7",
  blueIcon: "#2a5fa5",
};

const monoFam = "var(--font-mono)";

const fld = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d9ddd6",
  borderRadius: 9,
  fontSize: 13.5,
  fontFamily: "inherit",
  color: C.ink,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelCss = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  color: C.body,
  marginBottom: 6,
};

// Jurisdiction is a plain country pick — same shared list used for every
// other country field in the app (@/constants), not the design mockup's
// bespoke combined "State, Country" strings.
const COUNTRY_OPTIONS = countriesData.map((c) => c.value);

const toNum = (v) => (v === "" || v === undefined || v === null ? undefined : Number(v));

// Reverse-lookup a [label, value] tuple list by stored value. Several labels
// can share one value (e.g. ENTITY_TYPES/CONTROL_TYPES collapse multiple
// options into "other") — the first matching label wins, which may not be
// the exact label the record was originally saved with (docs/65 Step 29).
const labelFor = (list, value, fallback) => list.find(([, v]) => v === value)?.[0] || fallback;

const dateOnly = (v) => (v ? String(v).slice(0, 10) : "");

// True when every one of `keys` on `row` is blank — used to decide whether
// an OCR-derived list should replace a still-untouched default row (one
// empty starter row) or append alongside rows the user already filled in,
// so pre-filling never silently discards manual entry.
const rowIsBlank = (row, keys) => keys.every((k) => !row[k] || !String(row[k]).trim());

/* ------------------------------------------------------------------ */
/* Beneficial-trust validation (docs/65 Step 62)                       */
/* ------------------------------------------------------------------ */
// One validator for the whole trust form. Returns a flat map of
// field-key -> message; array rows use dotted keys ("trustees.0.dob") so the
// same object drives the inline messages, the per-section counts and the
// wizard's own submit gate. Required set follows the standalone Trust KYC
// form's schema (ui/views/customer-registration/trust/Schema.js) so the two
// places a trust can be captured demand the same things, plus per-row
// integrity and format checks the schema leaves to the backend.
const blankStr = (v) => !String(v ?? "").trim();

const digitsOnly = (v) => String(v ?? "").replace(/\D/g, "");

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
// `error` (docs/65 Step 62) is the one place a field's validation message is
// rendered, so every validated field looks the same. `data-invalid` is the
// hook the trust modal uses to scroll to the first offending field.
function Fld({ label, required, mono, error, children }) {
  return (
    <div data-invalid={error ? "true" : undefined}>
      <label style={labelCss}>
        {label} {required && <span style={{ color: C.red }}>*</span>}
      </label>
      {children}
      {error && <div style={errCss}>{error}</div>}
    </div>
  );
}

// Wraps a single field with its required ✱, inline message and red border,
// and marks it touched so a blank field the user hasn't been near yet stays
// quiet until they leave it (or until Save/Done reveals everything).
// Module-scope on purpose: a component declared inside TrustFields would be
// a new type on every keystroke and remount the input, losing focus.
function VField({ label, required, error, onTouch, children }) {
  const child = React.cloneElement(children, {
    invalid: Boolean(error),
    // A dropdown never blurs the way an input does — Radix moves focus into
    // the popover — so selects are touched on change instead.
    ...(children.type === Select
      ? {
          onChange: (ev) => {
            children.props.onChange?.(ev);
            onTouch?.();
          },
        }
      : {
          onBlur: (ev) => {
            children.props.onBlur?.(ev);
            onTouch?.();
          },
        }),
  });
  return (
    <Fld label={label} required={required} error={error}>
      {child}
    </Fld>
  );
}

function Input({ mono, style, invalid, onFocus, onBlur, ...props }) {
  // Focus/blur repaint the border directly, so the resting colour has to be
  // resolved in both places — otherwise blurring an invalid field would
  // repaint it back to the neutral grey.
  const resting = invalid ? C.red : "#d9ddd6";
  return (
    <input
      style={{ ...fld, borderColor: resting, ...(mono ? { fontFamily: monoFam } : {}), ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = invalid ? C.red : C.green;
        e.target.style.boxShadow = invalid ? "0 0 0 3px rgba(165,52,42,.15)" : "0 0 0 3px rgba(31,111,92,.15)";
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = resting;
        e.target.style.boxShadow = "none";
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

// Every dropdown in this wizard goes through this one component, so making
// it a searchable combobox (shared CustomSelect — Popover + cmdk Command,
// already used elsewhere in the app) makes every dropdown searchable in one
// place, with no changes needed at any of the ~40 call sites. Keeps the
// existing [label, value] / plain-string `options` contract and the
// "state holds the display label" convention (docs/65 Step 34/labelFor) —
// the DOM/combobox value has always been the label, never the backend
// value, exactly like the native <select> this replaces.
function Select({ value, onChange, options, style, placeholder, onAddItem, invalid }) {
  const opts = useMemo(
    () =>
      options.map((o) => {
        const label = Array.isArray(o) ? o[0] : o;
        return { label: label === "" ? "—" : label, value: label };
      }),
    [options],
  );
  const { width, flexShrink, ...rest } = style || {};
  return (
    <div style={{ width: width ?? "100%", flexShrink, ...rest }}>
      <SearchableSelect
        onAddItem={onAddItem}
        options={opts}
        value={value}
        onChange={onChange}
        // CustomSelect's own `error` prop paints the red border, so an
        // invalid dropdown reads the same as an invalid input.
        error={invalid}
        placeholder={placeholder || "Select…"}
        searchPlaceholder="Search…"
        className="w-full justify-between font-normal text-[13.5px] h-[38px] rounded-[9px] border-[#d9ddd6] bg-white"
      />
    </div>
  );
}

// A field that captures multiple values of the same kind (e.g. several
// phone numbers or emails) — one Input per row, add/remove freely, always
// keeps at least one (blank) row so the field never disappears entirely.
function MultiField({ label, required, values, onChange, placeholder, type = "text" }) {
  const rows = values.length ? values : [""];
  const set = (i, v) => onChange(rows.map((x, idx) => (idx === i ? v : x)));
  const add = () => onChange([...rows, ""]);
  const remove = (i) => onChange(rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows);
  return (
    <Fld label={label} required={required}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input type={type} value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} style={{ flex: 1 }} />
            {rows.length > 1 && (
              <button
                type="button"
                title="Remove"
                onClick={() => remove(i)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#b0b6bd", padding: 2, flexShrink: 0 }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.green,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
            padding: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add {label.toLowerCase()}
        </button>
      </div>
    </Fld>
  );
}

function Seg({ value, onChange, options = ["Yes", "No"] }) {
  return (
    <div style={{ display: "inline-flex", background: "#f1f3f0", borderRadius: 9, padding: 3 }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          style={{
            border: "none",
            background: value === o ? C.green : "transparent",
            color: value === o ? "#fff" : C.mid,
            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "7px 18px",
            borderRadius: 7,
            cursor: "pointer",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function AddBtn({ onClick, children, amber }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: amber ? "#fff" : "#f1f3f0",
        color: amber ? C.amberDeep : C.green,
        border: `1px solid ${amber ? C.amberHair : "#dfe3dc"}`,
        borderRadius: 8,
        padding: "7px 12px",
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {children}
    </button>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Remove"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#b0b6bd",
        padding: 2,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

// Shared validators/formatters — used by both the company wizard and the
// trust form (docs/65 Step 62).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/;
const POSTCODE_RE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;

const isAdultDob = (iso) => {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return new Date(iso) <= cutoff;
};

const splitName = (full) => {
  const parts = String(full || "").trim().split(/\s+/);
  return { given_name: parts.slice(0, -1).join(" ") || parts[0] || "", surname: parts.length > 1 ? parts[parts.length - 1] : "" };
};

const errCss = { fontSize: 11.5, color: C.red, marginTop: 5, lineHeight: 1.35 };

export { C, monoFam, fld, labelCss, COUNTRY_OPTIONS, toNum, labelFor, dateOnly, rowIsBlank, blankStr, digitsOnly, todayISO, Fld, VField, Input, Select, MultiField, Seg, AddBtn, RemoveBtn, EMAIL_RE, URL_RE, POSTCODE_RE, isAdultDob, splitName, errCss };
