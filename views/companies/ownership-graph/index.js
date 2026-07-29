"use client";
import React, { useMemo } from "react";
import GraphCanvas, { C, mk, pct, layoutRows } from "@/views/kyb/graph-canvas";

/**
 * Ownership & control graph (docs/65 Step 61) — implements
 * `docs/kyb-ui-design/project/KYB Ownership Graph.dc.html`, embedded in the
 * Review page's "Ownership & control" section rather than as its own page.
 *
 * Differences from the design file, all deliberate:
 *  - The design is a full-viewport screen with its own nav and a fixed
 *    340px detail rail. Here the graph takes the full width of the section
 *    card and node detail is a hover card over the canvas (docs/65 Step 63),
 *    so no space is permanently spent on a pane that is empty until clicked.
 *  - The canvas opens FIT TO VIEW: the whole graph is visible without
 *    scrolling, and scrollbars only appear once zoomed past that fit.
 *  - Node positions are COMPUTED from the record, not hard-coded. The design
 *    hard-codes six nodes at literal pixel offsets; a real company has an
 *    arbitrary number of parents, shareholders, trusts and subsidiaries.
 *  - Nothing is invented. The design shows sanctions-match percentages and
 *    "requested" dates that this schema has no field for, so those notes are
 *    driven by data we actually hold (UBO unresolved, PEP/flagged screening
 *    status) and omitted otherwise.
 *
 * LAYERING — trusts are the top level, per owner instruction. Reading top to
 * bottom: trusts that hold shares, then the other direct owners (parent
 * entities, beneficial owners, remaining shareholders), then the subject,
 * then what the subject owns. Directors sit in a side column because they
 * are control, not ownership, and stacking them in the chain would imply
 * they own something.
 *
 * This file is the SCENE only — which nodes exist and what they mean. The
 * canvas that draws it (zoom, drag, hover card, edge routing) is shared with
 * the Trust dossier's graph in views/kyb/graph-canvas.js (docs/65 Step 70).
 */

export default function OwnershipGraph({
  legalName,
  jurisdiction,
  relatedEntities = [],
  shareholders = [],
  ubos = [],
  appointments = [],
}) {
  const scene = useMemo(() => {
    const parents = relatedEntities.filter((r) => r.relation === "parent");
    const subs = relatedEntities.filter((r) => r.relation && r.relation !== "parent");

    // Trusts come from shareholder rows linked to a real TrustKyc record.
    const trustRows = shareholders.filter((s) => s.holder_model === "TrustKyc");
    const otherHolders = shareholders.filter((s) => s.holder_model !== "TrustKyc");

    // Each trust's own parties — trustees, settlor, beneficiaries — become
    // nodes above their trust, so the chain doesn't stop at "a trust owns
    // this" without showing who stands behind the trust. Capped per trust so
    // a large beneficiary class can't flood the canvas.
    const trustParties = [];
    const trustPartyEdges = [];
    const addParty = (trustId, idx, kind, title, subtitle, detail) => {
      const id = `${trustId}-p${idx}`;
      trustParties.push(mk(id, kind, title, subtitle, detail));
      trustPartyEdges.push({ from: id, to: trustId });
      return id;
    };

    const trustNodes = trustRows.map((s, i) => {
      const te = s.holder_entity && typeof s.holder_entity === "object" ? s.holder_entity : null;
      const name = te?.trust_details?.full_trust_name || s.holder_name || "Trust";
      const trustId = `trust-${i}`;

      if (te) {
        let p = 0;
        const settlorName = te.settlor?.full_name || te.settlor?.company?.company_name;
        if (settlorName) {
          addParty(trustId, p++, te.settlor?.is_company ? "entity-plain" : "person", settlorName, "Settlor", {
            role: `Settlor${te.settlor?.is_company ? " (company)" : ""}`,
            rows: [
              ["Country of residence", te.settlor?.country_of_residence || "—"],
              ["Date of birth", te.settlor?.date_of_birth ? String(te.settlor.date_of_birth).slice(0, 10) : "—"],
              ["Registration", te.settlor?.company?.registration_number || "—"],
            ],
            notes: [],
          });
        }
        (te.individual_trustees?.trustees || []).slice(0, 3).forEach((tr) => {
          if (!tr.full_name) return;
          addParty(trustId, p++, "person", tr.full_name, "Trustee", {
            role: "Individual trustee",
            rows: [
              ["Date of birth", tr.date_of_birth ? String(tr.date_of_birth).slice(0, 10) : "—"],
              ["Country", tr.residential_address?.country || "—"],
            ],
            notes: [],
          });
        });
        (te.company_trustees?.company_details || []).slice(0, 2).forEach((c) => {
          if (!c.company_name) return;
          addParty(trustId, p++, "entity-plain", c.company_name, "Company trustee", {
            role: "Company trustee",
            rows: [
              ["ACN / reg. no.", c.registration_number || "—"],
              ["ABN", c.abn || "—"],
              ["Directors", (c.directors || []).map((x) => x.full_name).filter(Boolean).join(", ") || "—"],
            ],
            notes: [],
          });
        });
        (te.controllers?.controlling_persons || []).slice(0, 2).forEach((cp) => {
          if (!cp.full_name) return;
          const flagged = cp.pep_status === "pep" || cp.pep_status === "flagged" || cp.sanctions_status === "flagged";
          addParty(trustId, p++, flagged ? "person-flag" : "person", cp.full_name, cp.role || "Controlling person", {
            role: "Controls the trust",
            rows: [
              ["Role", cp.role || "—"],
              ["PEP", cp.pep_status || "—"],
              ["Sanctions", cp.sanctions_status || "—"],
            ],
            notes: flagged
              ? [[C.warnBg, C.warnLine, C.warnInk, "Screening flag", "This controlling person is flagged by PEP or sanctions screening."]]
              : [],
          });
        });
        (te.beneficiaries || []).slice(0, 2).forEach((b) => {
          if (!b.named_beneficiaries) return;
          addParty(trustId, p++, "person-dashed", b.named_beneficiaries, "Beneficiary", {
            role: "Beneficiary",
            rows: [
              ["Type", b.beneficiary_type || "—"],
              ["Interest", pct(b.beneficial_interest_percent) ?? "—"],
              ["Class", b.beneficiary_classes || "—"],
            ],
            notes: [],
          });
        });
      }

      return mk(trustId, "trust", name, "Trust · holds shares", {
        role: "Trust (shareholding held on trust)",
        rows: [
          ["Units held", s.units_held ?? "—"],
          ["% of issued", pct(s.percent_held) ?? "—"],
          ["Security class", s.security_class || "—"],
          ["Country", te?.trust_details?.country_of_establishment || "—"],
          ["Settlor", te?.settlor?.full_name || "—"],
          ["Trustee(s)", (te?.individual_trustees?.trustees || []).map((t) => t.full_name).filter(Boolean).join(", ") || "—"],
        ],
        notes: te
          ? []
          : [[C.warnBg, C.warnLine, C.warnInk, "Trust record not linked", "This holding is marked as held on trust but no trust record is attached."]],
      });
    });

    const uboNodes = ubos.map((u, i) =>
      mk(`ubo-${i}`, "person", u.full_name || "Unnamed person", `Beneficial owner${u.ownership_percent ? ` · ${u.ownership_percent}%` : ""}`, {
        role: "Beneficial owner (natural person)",
        rows: [
          ["Ownership", pct(u.ownership_percent) ?? "—"],
          ["Voting", pct(u.voting_percent) ?? "—"],
          ["Control type", (u.control_type || "—").replace(/_/g, " ")],
          ["Country", u.residential_address?.country || "—"],
        ],
        notes: [],
      }),
    );

    const parentNodes = parents.map((p, i) =>
      mk(`parent-${i}`, "entity", p.name || "Parent entity", `Parent${p.jurisdiction ? ` · ${p.jurisdiction}` : ""}`, {
        role: "Parent entity",
        rows: [
          ["Jurisdiction", p.jurisdiction || "—"],
          ["Interest held", pct(p.percent_interest) ?? "—"],
          ["Voting", pct(p.percent_voting) ?? "—"],
        ],
        notes:
          ubos.length === 0
            ? [[C.warnBg, C.warnLine, C.warnInk, "Ownership gap", "No natural-person owner is recorded behind this entity. Ownership must resolve to a person before approval."]]
            : [],
      }),
    );

    // Remaining shareholders shown as owners too, capped so a long register
    // doesn't make the graph unreadable.
    const CAP = 4;
    const holderNodes = otherHolders.slice(0, CAP).map((s, i) =>
      mk(`holder-${i}`, s.beneficially_held === false ? "person-dashed" : "entity-plain", s.holder_name || "Shareholder", `Shareholder${s.percent_held ? ` · ${s.percent_held}%` : ""}`, {
        role: "Shareholder",
        rows: [
          ["Units held", s.units_held ?? "—"],
          ["% of issued", pct(s.percent_held) ?? "—"],
          ["Beneficially held", s.beneficially_held === false ? "No" : "Yes"],
          ["Security class", s.security_class || "—"],
        ],
        notes:
          s.beneficially_held === false && !s.beneficial_arrangement?.arrangement_type
            ? [[C.warnBg, C.warnLine, C.warnInk, "Arrangement unresolved", "Held on behalf of someone else, but who benefits has not been recorded."]]
            : [],
      }),
    );

    const subject = mk("subject", "subject", legalName || "This entity", `Subject${jurisdiction ? ` · ${jurisdiction}` : ""}`, {
      role: "Subject entity",
      rows: [["Jurisdiction", jurisdiction || "—"]],
      notes: [],
    });

    const subNodes = subs.map((s, i) =>
      mk(`sub-${i}`, "plain", s.name || "Subsidiary", `${(s.relation || "subsidiary").replace(/^\w/, (c) => c.toUpperCase())}${s.jurisdiction ? ` · ${s.jurisdiction}` : ""}`, {
        role: "Subsidiary / branch",
        rows: [
          ["Jurisdiction", s.jurisdiction || "—"],
          ["Interest held", pct(s.percent_interest) ?? "—"],
          ["Voting", pct(s.percent_voting) ?? "—"],
        ],
        notes: [],
      }),
    );

    const dirRows = appointments.filter((a) => a.role === "director").slice(0, 4);
    const dirNodes = dirRows.map((a, i) => {
      const name = [a.given_name, a.surname].filter(Boolean).join(" ") || "Director";
      const flagged = a.screening_status === "pep" || a.screening_status === "flagged";
      return mk(`dir-${i}`, flagged ? "person-flag" : "person", name, `Director${a.screening_status ? ` · ${a.screening_status}` : ""}`, {
        role: "Director",
        rows: [
          ["Screening", a.screening_status || "not screened"],
          ["Appointed", a.date_appointed ? String(a.date_appointed).slice(0, 10) : "—"],
          ["Birth place", a.birth_place || "—"],
        ],
        notes: flagged
          ? [[C.warnBg, C.warnLine, C.warnInk, "Screening flag", `Screening returned "${a.screening_status}". Enhanced due diligence applies.`]]
          : [],
      });
    });

    // Row 2 holds every other direct owner.
    const ownerRow = [...parentNodes, ...uboNodes, ...holderNodes];

    // Rows are only emitted when populated, so an empty layer doesn't leave
    // a gap in the middle of the chain. Trust parties sit above their trust,
    // which is itself the top of the ownership chain.
    const rows = [];
    if (trustParties.length) rows.push(trustParties);
    if (trustNodes.length) rows.push(trustNodes);
    if (ownerRow.length) rows.push(ownerRow);
    const subjectRowIndex = rows.push([subject]) - 1;
    if (subNodes.length) rows.push(subNodes);

    // Directors: right column, vertically centred on the subject row.
    const { nodes: placed, sceneW, sceneH } = layoutRows(rows, {
      sideColumn: dirNodes,
      sideRowIndex: subjectRowIndex,
    });

    const byId = Object.fromEntries(placed.map((n) => [n.id, n]));
    const e = [];
    const line = (from, to, label, style) => {
      if (byId[from] && byId[to]) e.push({ from, to, label, ...style });
    };
    // Trusts own the subject directly — the edge spans the owner row rather
    // than routing through it, because a trust holding shares is not owned
    // by the parent.
    trustNodes.forEach((n, i) => line(n.id, "subject", pct(trustRows[i].percent_held), { stroke: C.trustLine, width: 2.5 }));
    // Trustees / settlor / beneficiaries / controllers -> their own trust.
    trustPartyEdges.forEach((te) => line(te.from, te.to, null, { stroke: C.trustLine, width: 1.8, dash: "4 4" }));
    parentNodes.forEach((n, i) => line(n.id, "subject", pct(parents[i].percent_interest), { stroke: "#9aa1ac", width: 2.5 }));
    holderNodes.forEach((n, i) => line(n.id, "subject", pct(otherHolders[i].percent_held), { stroke: "#c9d0c8", width: 2 }));
    // A beneficial owner sits behind the parent when there is one.
    uboNodes.forEach((n) => {
      if (parentNodes.length) line(n.id, parentNodes[0].id, null, { stroke: "#cdb389", width: 2, dash: "5 4" });
      else line(n.id, "subject", null, { stroke: "#cdb389", width: 2, dash: "5 4" });
    });
    subNodes.forEach((n, i) => line("subject", n.id, pct(subs[i].percent_interest), { stroke: "#9aa1ac", width: 2.5 }));
    dirNodes.forEach((n) => line("subject", n.id, null, { stroke: "#c9d0c8", width: 2 }));

    return { nodes: placed, edges: e, sceneW, sceneH };
  }, [legalName, jurisdiction, relatedEntities, shareholders, ubos, appointments]);

  return <GraphCanvas {...scene} />;
}
