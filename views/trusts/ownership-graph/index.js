"use client";
import React, { useMemo } from "react";
import GraphCanvas, { C, mk, pct, layoutRows } from "@/views/kyb/graph-canvas";

/**
 * Trust ownership & control graph (docs/65 Step 70).
 *
 * The company graph already draws a trust — but only as one node ABOVE a
 * company, because there the trust is a shareholder. On the trust's own file
 * the trust IS the subject, so the picture inverts: its parties stand above
 * it and the companies it holds stand below. That is why this is a separate
 * scene rather than a prop on the company graph; the canvas (zoom, drag,
 * hover card, edge routing) is shared from views/kyb/graph-canvas.js so the
 * two graphs remain the same picture to read.
 *
 * LAYERING, top to bottom:
 *   1. Settlor and beneficiaries — who put the property in and who benefits.
 *      Under AUSTRAC guidance the beneficiaries are the trust's beneficial
 *      owners, so they belong on the ownership side of the subject, not below
 *      it; placing them below would read as "the trust owns them".
 *   2. Trustees (individual and corporate) and controlling persons — legal
 *      title and control, sitting directly above the trust.
 *   3. The trust itself.
 *   4. Companies the trust holds an interest in, from the reverse lookup
 *      (GET /trust/:id/companies) with the holding on the edge label.
 *   Authorised representatives sit in a side column: they act for the trust
 *      but own no part of it, the same reasoning that puts a company's
 *      directors beside the chain rather than in it.
 *
 * Nothing is invented — every node comes from a stored field, and a party
 * with no name recorded is skipped rather than drawn as "Unnamed".
 */

// Long registers are capped so one trust with a large beneficiary class can't
// flood the canvas; the count of what was hidden is surfaced under the graph
// rather than silently dropped.
const CAP = 6;

const capped = (arr, n = CAP) => ({ shown: arr.slice(0, n), hidden: Math.max(0, arr.length - n) });

export default function TrustOwnershipGraph({ trust = {}, companies = [] }) {
  const { scene, hidden, empty } = useMemo(() => {
    const td = trust.trust_details || {};
    const trustName = td.full_trust_name || "This trust";

    let hiddenTotal = 0;

    // ---- Layer 1: settlor + beneficiaries -------------------------------
    const settlorNodes = [];
    const settlor = trust.settlor || {};
    const settlorName = settlor.full_name || settlor.company?.company_name;
    if (settlorName) {
      settlorNodes.push(
        mk("settlor", settlor.is_company ? "entity" : "person", settlorName, "Settlor", {
          role: `Settlor${settlor.is_company ? " (company)" : ""}`,
          rows: [
            ["Country of residence", settlor.country_of_residence || "—"],
            ["Date of birth", settlor.date_of_birth ? String(settlor.date_of_birth).slice(0, 10) : "—"],
            ["Registration", settlor.company?.registration_number || "—"],
          ],
          notes: [],
        }),
      );
    }

    const benList = (trust.beneficiaries || []).filter((b) => b.named_beneficiaries || b.beneficiary_classes);
    const ben = capped(benList);
    hiddenTotal += ben.hidden;
    const beneficiaryNodes = ben.shown.map((b, i) =>
      mk(
        `ben-${i}`,
        "person-dashed",
        b.named_beneficiaries || b.beneficiary_classes || "Beneficiary",
        `Beneficiary${b.beneficial_interest_percent ? ` · ${b.beneficial_interest_percent}%` : ""}`,
        {
          role: "Beneficiary",
          rows: [
            ["Type", (b.beneficiary_type || "—").replace(/_/g, " ")],
            ["Interest", pct(b.beneficial_interest_percent) ?? "—"],
            ["Class", b.beneficiary_classes || "—"],
            ["Date of birth", b.date_of_birth ? String(b.date_of_birth).slice(0, 10) : "—"],
          ],
          notes: [],
        },
      ),
    );

    // ---- Layer 2: trustees + controllers --------------------------------
    const indList = (trust.individual_trustees?.trustees || []).filter((t) => t.full_name);
    const ind = capped(indList, 4);
    hiddenTotal += ind.hidden;
    const trusteeNodes = ind.shown.map((t, i) =>
      mk(`trustee-${i}`, "person", t.full_name, "Individual trustee", {
        role: "Individual trustee",
        rows: [
          ["Date of birth", t.date_of_birth ? String(t.date_of_birth).slice(0, 10) : "—"],
          ["Country", t.residential_address?.country || "—"],
          ["Suburb", t.residential_address?.suburb || "—"],
        ],
        notes: [],
      }),
    );

    const coList = (trust.company_trustees?.company_details || []).filter((c) => c.company_name);
    const co = capped(coList, 3);
    hiddenTotal += co.hidden;
    const companyTrusteeNodes = co.shown.map((c, i) =>
      mk(`cotrustee-${i}`, "entity", c.company_name, "Company trustee", {
        role: "Corporate trustee",
        rows: [
          ["ACN / reg. no.", c.registration_number || "—"],
          ["ABN", c.abn || "—"],
          ["Country", c.registered_address?.country || "—"],
          ["Directors", (c.directors || []).map((x) => x.full_name).filter(Boolean).join(", ") || "—"],
        ],
        notes: [],
      }),
    );

    const cpList = (trust.controllers?.controlling_persons || []).filter((c) => c.full_name);
    const cp = capped(cpList, 3);
    hiddenTotal += cp.hidden;
    const controllerNodes = cp.shown.map((c, i) => {
      const flagged = c.pep_status === "pep" || c.pep_status === "flagged" || c.sanctions_status === "flagged";
      return mk(`ctrl-${i}`, flagged ? "person-flag" : "person", c.full_name, c.role || "Controlling person", {
        role: "Controls the trust",
        rows: [
          ["Role", c.role || "—"],
          ["PEP", c.pep_status || "—"],
          ["Sanctions", c.sanctions_status || "—"],
        ],
        notes: flagged
          ? [[C.warnBg, C.warnLine, C.warnInk, "Screening flag", "This controlling person is flagged by PEP or sanctions screening."]]
          : [],
      });
    });

    // ---- Layer 3: the subject -------------------------------------------
    const noTrustee = trusteeNodes.length + companyTrusteeNodes.length === 0;
    const subject = mk(
      "subject",
      "subject",
      trustName,
      `Trust${td.country_of_establishment ? ` · ${td.country_of_establishment}` : ""}`,
      {
        role: "Subject trust",
        rows: [
          ["Trust type", (td.trust_type?.selected_type || "—").replace(/_/g, " ")],
          ["Country", td.country_of_establishment || "—"],
          ["Established", td.date_established ? String(td.date_established).slice(0, 10) : "—"],
          ["ABN", td.trust_identification?.abn || "—"],
          ["Companies held", String(companies.length)],
        ],
        notes: noTrustee
          ? [[C.redBg, C.redLine, C.redInk, "No trustee recorded", "A trust must have at least one trustee. Legal title to the trust property is unaccounted for."]]
          : [],
      },
    );

    // ---- Layer 4: companies the trust holds ------------------------------
    const held = capped(companies, 5);
    hiddenTotal += held.hidden;
    const companyNodes = held.shown.map((c, i) => {
      const gi = c.general_information || {};
      const h = c.trust_holding || {};
      return mk(
        `co-${i}`,
        "plain",
        gi.legal_name || c.uid || "Company",
        `Holding${h.percent_held ? ` · ${h.percent_held}%` : ""}`,
        {
          role: "Company held by this trust",
          rows: [
            ["Company ID", c.uid || "—"],
            ["Registration", gi.registration_number || "—"],
            ["% of issued", pct(h.percent_held) ?? "—"],
            ["Units held", h.units_held || "—"],
            ["Security class", (h.security_classes || []).join(", ") || "—"],
            ["Review status", (c.review_status || "draft").replace(/_/g, " ")],
          ],
          notes: [],
        },
      );
    });

    // ---- Side column: authorised representatives -------------------------
    const repList = (trust.controllers?.authorised_representatives || []).filter((r) => r.full_name);
    const rep = capped(repList, 4);
    hiddenTotal += rep.hidden;
    const repNodes = rep.shown.map((r, i) =>
      mk(`rep-${i}`, "person", r.full_name, "Authorised rep", {
        role: "Authorised representative",
        rows: [
          ["Role", r.role || "—"],
        ],
        notes: [],
      }),
    );

    // Rows are only emitted when populated, so an absent layer never leaves a
    // gap in the middle of the chain.
    const layer1 = [...settlorNodes, ...beneficiaryNodes];
    const layer2 = [...trusteeNodes, ...companyTrusteeNodes, ...controllerNodes];
    const rows = [];
    if (layer1.length) rows.push(layer1);
    if (layer2.length) rows.push(layer2);
    const subjectRowIndex = rows.push([subject]) - 1;
    if (companyNodes.length) rows.push(companyNodes);

    const { nodes: placed, sceneW, sceneH } = layoutRows(rows, {
      sideColumn: repNodes,
      sideRowIndex: subjectRowIndex,
    });

    const byId = Object.fromEntries(placed.map((n) => [n.id, n]));
    const edges = [];
    const line = (from, to, label, style) => {
      if (byId[from] && byId[to]) edges.push({ from, to, label, ...style });
    };

    // Settlor and beneficiaries attach to the trust directly — they stand
    // behind it, not behind the trustees, so routing them through the trustee
    // row would assert a relationship the record doesn't hold.
    settlorNodes.forEach((n) => line(n.id, "subject", null, { stroke: "#cdb389", width: 2, dash: "5 4" }));
    beneficiaryNodes.forEach((n, i) =>
      line(n.id, "subject", pct(ben.shown[i].beneficial_interest_percent), { stroke: "#cdb389", width: 2, dash: "5 4" }),
    );
    trusteeNodes.forEach((n) => line(n.id, "subject", null, { stroke: C.trustLine, width: 2.5 }));
    companyTrusteeNodes.forEach((n) => line(n.id, "subject", null, { stroke: C.trustLine, width: 2.5 }));
    controllerNodes.forEach((n) => line(n.id, "subject", null, { stroke: "#9aa1ac", width: 2, dash: "4 4" }));
    companyNodes.forEach((n, i) =>
      line("subject", n.id, pct(held.shown[i].trust_holding?.percent_held), { stroke: "#9aa1ac", width: 2.5 }),
    );
    repNodes.forEach((n) => line("subject", n.id, null, { stroke: "#c9d0c8", width: 2 }));

    return {
      scene: { nodes: placed, edges, sceneW, sceneH },
      hidden: hiddenTotal,
      // A draft trust can have nothing but its name. One node alone on a
      // 540px grid reads as a broken chart, so say what's missing instead.
      empty: placed.length <= 1,
    };
  }, [trust, companies]);

  if (empty) {
    return (
      <div
        style={{
          border: `1px dashed ${C.line}`,
          borderRadius: 12,
          padding: "26px 24px",
          background: "#fbfbfa",
          marginBottom: 22,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink }}>Nothing to map yet</p>
        <p style={{ margin: "6px 0 0", fontSize: 12.5, color: C.sub, lineHeight: 1.55 }}>
          No settlor, trustee, beneficiary or controlling person has been recorded, and no company records a
          shareholding held by this trust. The graph appears once at least one party is on file — a trust with no
          trustee cannot be approved.
        </p>
      </div>
    );
  }

  return (
    <div>
      <GraphCanvas
        {...scene}
        legend={[
          ["Trust (subject)", C.navy, C.green, 3],
          ["Person", "#f7f8f6", C.faint, "50%"],
          ["Corporate trustee", C.amberBg, C.amberLine, 3],
          ["Company held", "#fff", C.line, 3],
        ]}
      />
      {hidden > 0 && (
        <p style={{ margin: "-14px 0 18px", fontSize: 11.5, color: C.sub }}>
          {hidden} further part{hidden === 1 ? "y is" : "ies are"} recorded but not drawn — the registers below list every
          one.
        </p>
      )}
    </div>
  );
}
