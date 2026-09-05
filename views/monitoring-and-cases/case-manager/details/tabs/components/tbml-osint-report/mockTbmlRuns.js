// Dummy TBML/OSINT screening runs for one case: an original invoice, an
// amendment that corrects the flagged line item, and a credit note that
// reconciles the residual document inconsistency. Shaped for this view
// specifically (not the raw API payload) — see reportHelpers.js for the
// formatting/derivation helpers that turn these numbers into display text.

const finding = (indicator, severity, description, evidence, recommendation) => ({
  indicator,
  severity,
  description,
  evidence,
  recommendation,
});

const mockTbmlRuns = [
  {
    id: "TBML-DDF975C066E1",
    pillMeta: "22 Aug · HIGH 70",
    createdAtLabel: "Screening run completed 22 Aug 2026 08:21 AM",
    overallRisk: { level: "HIGH", score: 70 },
    indicators: [
      { label: "PRICE_ANOMALY", kind: "danger" },
      { label: "DOCUMENT_INCONSISTENCY", kind: "warn" },
    ],
    docSummaryLine: "Invoice 123456 · 1 document · 2 line items",
    testedLine: "1 of 2 line items",
    sanctionsHit: false,
    summary:
      "The transaction presents a HIGH overall risk primarily due to a significant price anomaly identified for the Labor component, where the declared price is substantially above market rates for comparable services. Several document inconsistencies, including missing currency information and a discrepancy in the total amount, further contribute to the elevated risk profile.",

    sourceDocument: {
      type: "PI",
      file: "PI-123456.pdf",
      meta: "1 page · 214 KB · uploaded 22 Aug 08:14 · auto-detected Proforma Invoice",
    },

    documentExtract: {
      documentType: "Invoice",
      documentNumber: "123456",
      documentDate: "May 10, 2006",
      lcNumber: null,
      pageNumber: 1,
      incoterms: null,
      portOfLoading: null,
      portOfDischarge: null,
      shippingMethod: "UPS",
      containerNumber: null,
      vesselFlight: null,
      paymentTerms: "2%15 Days, Net 45",
      salesTerms: null,
      subtotal: 8500.0,
      freightCharges: null,
      insurance: null,
      totalAmount: 8623.75,
      currency: null,
      amountInWords: null,
      fobValue: null,
      cifValue: null,
    },
    parties: {
      Exporter: { name: "Supplier Street Address", address: "City, State ZIP", country: null, phone: "000.000.0000" },
      Importer: { name: "Intel Corporation", address: "P.O. Box 1000 Hillsboro, OR 97123-1000", country: null },
      "Notify party": { name: "Intel Corporation", address: "3601 Juliette Lane Santa Clara, CA 95052", country: null },
      "Issuing bank": {},
      "Beneficiary bank": {},
    },
    gap: {
      label: "Unexplained 123.75",
      note: "total_amount exceeds subtotal with no freight or insurance itemised; raw text shows SALES TAX 123.75.",
    },
    absentFields: ["currency", "quantities", "HS codes", "incoterms", "ports", "banks / SWIFT", "container & vessel", "LC reference"],

    products: [
      {
        lineNumber: 1,
        description: "Labor- Paint the risers and stringers on all five stairways in RNB with paint to match color",
        hsCode: null,
        quantity: null,
        unit: null,
        unitPrice: 7000.0,
        totalPrice: 7000.0,
        currency: null,
      },
      {
        lineNumber: 2,
        description: "Material - Paint",
        hsCode: null,
        quantity: null,
        unit: null,
        unitPrice: 1500.0,
        totalPrice: 1500.0,
        currency: null,
      },
    ],

    lineAnalyses: [
      {
        lineNumber: 1,
        title: "Labor — paint the risers and stringers on all five stairways in RNB",
        declared: 7000.0,
        testable: true,
        reference: { low: 700.0, high: 1350.0, mid: 1000.0, currency: "USD", unit: "for 20-riser project", observations: 28 },
        dataAvailability: "SUFFICIENT",
        riskLevel: "HIGH",
        riskScore: 75,
        summary:
          "Market range established from 9 comparable observations across 28 price points. The declared price for labor is substantially higher than market rates for comparable projects, indicating a potential over-invoicing risk. The currency for the declared price is also missing.",
        findings: [
          finding(
            "PRICE_ANOMALY",
            "HIGH",
            "The declared price for labor is significantly higher than the established market range for comparable painting projects. While the units of comparison are not perfectly aligned (declared as a total for 'five stairways' versus market data 'per 20-riser project'), the magnitude of the difference is substantial.",
            "Declared price: $7,000.00. Market price range for a 20-riser project: $700.00 – $1,350.00. The declared price is over five times the high end of the market range.",
            "Investigate the justification for the declared labor cost, requesting a detailed breakdown of hours, rates, and scope of work for the 'five stairways' project to compare against market benchmarks more precisely. Seek clarification on how 'five stairways' translates to 'risers' for a direct comparison.",
          ),
          finding(
            "DOCUMENT_INCONSISTENCY",
            "LOW",
            "The currency for the declared unit price is not specified on the invoice.",
            "Invoice line item unit_price is '7000.00' with no currency indicated.",
            "Request clarification on the currency used for the transaction.",
          ),
        ],
        marketEvidence: [
          { source: "www.homeadvisor.com", quote: "detailed painting of railings and balusters can cost up to $20 per linear foot due to the intricate work involved." },
          { source: "latestcost.com", quote: "labor is typically the largest cost element for stair riser painting; 10–15 risers can take 1–2 days, larger jobs 2–3 days." },
        ],
      },
      {
        lineNumber: 2,
        title: "Material — paint",
        declared: 1500.0,
        testable: false,
        blockedNote:
          "Invoice states no quantity or unit for the paint, so the per-litre benchmark cannot be applied. Two comparable observations available once quantity is supplied.",
        reference: { low: 12.0, high: 25.0, mid: 18.5, currency: "USD", unit: "per litre", observations: 2 },
        dataAvailability: "SUFFICIENT (market)",
        riskLevel: "INSUFFICIENT_DATA",
        riskScore: 0,
        summary:
          "No quantity for 'Material - Paint' is provided on the invoice, preventing a direct price comparison against the market reference price per litre. The declared price could not be tested. The currency for the declared price is also missing.",
        findings: [
          finding(
            "DOCUMENT_INCONSISTENCY",
            "LOW",
            "The currency for the declared unit price is not specified on the invoice.",
            "Invoice line item unit_price is '1500.00' with no currency indicated.",
            "Request clarification on the currency used for the transaction.",
          ),
        ],
        marketEvidence: [
          { source: "procalclab.com", quote: "calculations are approximate; actual material use and costs depend on application method, surface condition and local prices." },
          { source: "www.facebook.com", quote: "forum context captured but not used to establish the range." },
        ],
      },
    ],

    osintResults: [
      {
        productKey: "labor_paint_the_risers_and_stringers",
        productDescription: "Labor- Paint the risers and stringers on all five stairways in RNB with paint to match color",
        hsCode: null,
        dataAvailability: "SUFFICIENT",
        availabilityNote: "Market range established from 9 comparable observation(s).",
        referenceLow: 700.0,
        referenceHigh: 1350.0,
        referenceMid: 1000.0,
        currency: "USD",
        unit: "for 20-riser project",
        observations: 28,
        typicalOrigins: [],
        typicalRoutes: [],
        sanctionedJurisdiction: false,
        hsCodesObserved: [],
        priceSources: ["www.homeadvisor.com", "latestcost.com"],
        findings: [
          { source: "www.homeadvisor.com", text: "Keep in mind that detailed painting of railings and balusters can cost up to $20 per linear foot due to the intricate work involved." },
          { source: "latestcost.com", text: "Labor is typically the largest cost element for stair riser painting. A small project with 10–15 risers can take 1–2 days; larger jobs may extend to 2–3 days." },
        ],
      },
      {
        productKey: "material_paint",
        productDescription: "Material - Paint",
        hsCode: null,
        dataAvailability: "SUFFICIENT",
        availabilityNote: "Market range established from 2 comparable observation(s).",
        referenceLow: 12.0,
        referenceHigh: 25.0,
        referenceMid: 18.5,
        currency: "USD",
        unit: "litre",
        observations: 2,
        typicalOrigins: [],
        typicalRoutes: [],
        sanctionedJurisdiction: false,
        hsCodesObserved: [],
        priceSources: ["procalclab.com"],
        findings: [
          { source: "www.facebook.com", text: "Is $25k labor and material a fair price to paint a 6 unit complex in Texas?" },
          { source: "www.facebook.com", text: "Always price your paint and materials first then have a panel price." },
          { source: "procalclab.com", text: "Note: calculations are approximate. Actual material use and costs depend on application method, surface condition and local prices." },
        ],
      },
    ],

    references: [
      { domain: "www.homeadvisor.com", title: "Cost to paint stair risers, stringers and railings", note: "Detailed painting of railings and balusters can cost up to $20 per linear foot due to the intricate work involved.", usedFor: "Labour range", role: "PRICED", retrieved: "22 Aug 08:17" },
      { domain: "latestcost.com", title: "Stair riser painting cost breakdown", note: "Labour is the largest cost element; a 10–15 riser project takes 1–2 days, larger jobs 2–3 days.", usedFor: "Labour range", role: "PRICED", retrieved: "22 Aug 08:17" },
      { domain: "procalclab.com", title: "Paint quantity and cost calculator", note: "Calculations are approximate; actual material use and costs depend on application method, surface condition and local prices.", usedFor: "Paint range", role: "PRICED", retrieved: "22 Aug 08:17" },
      { domain: "ofac.treasury.gov", title: "OFAC sanctions list search", note: "Both named parties screened; no match returned.", usedFor: "Sanctions", role: "SCREENED", retrieved: "22 Aug 08:18" },
      { domain: "www.facebook.com", title: "Contractor pricing discussion threads", note: "Practitioner commentary on labour-and-material pricing; retained as context only.", usedFor: "Context", role: "CONTEXT", retrieved: "22 Aug 08:17" },
      { domain: "www.supplychainbrain.com", title: "Trade-based money laundering typologies", note: "Background on over-invoicing patterns; not used to establish any price range.", usedFor: "Context", role: "CONTEXT", retrieved: "22 Aug 08:17" },
    ],
    referencesFooter: "14 domains consulted across 24 queries; 15 URLs selected, 12 pages read, 5 assessed relevant. Only sources marked PRICED contributed to a reference range.",

    audit: {
      stats: [
        { value: "24/24", label: "queries ok" },
        { value: "342", label: "results seen" },
        { value: "12 / 3", label: "read / failed" },
        { value: "30", label: "price obs." },
      ],
      domains: ["www.homeadvisor.com", "latestcost.com", "procalclab.com", "ofac.treasury.gov", "sanctionssearch.ofac.treas.gov", "www.sigma360.com", "www.linzalytics.com", "www.supplychainbrain.com", "www.livemint.com", "www.scribd.com", "github.com", "nlp.biu.ac.il", "www.linkedin.com", "www.facebook.com"],
      footer: "searxng · collected 22 Aug 08:17 UTC",
    },

    narrative:
      "## Executive Summary\nThis trade transaction involves the provision of painting labor and materials. A significant price anomaly has been identified for the labor component, where the declared price of $7,000.00 is substantially higher than market rates for comparable projects. Several document inconsistencies, including missing currency details for product prices and a discrepancy in the invoice total, further elevate the risk. The 'Material - Paint' component could not be price-tested due to a lack of quantity information on the invoice. The overall risk level for this transaction is assessed as HIGH.\n\n## Price Analysis\nThe declared price for the labor item is $7,000.00. Market research indicates a price range of USD 700.00 to USD 1,350.00 for a 20-riser project, established from 28 independent observations. The declared price is over five times the upper bound of the market range, suggesting potential over-invoicing.\n\nThe declared price for 'Material - Paint' is $1,500.00 against a market range of USD 12.00 to USD 25.00 per litre. However, the invoice does not specify a quantity, so the total declared price cannot be compared against the market unit price and no deviation can be computed.\n\n## Document Consistency Review\n*   **Missing currency:** the currency for the declared product prices and the overall total amount is not specified on the invoice.\n*   **Total amount discrepancy:** the subtotal is listed as $8,500.00, but the total amount is $8,623.75, with no freight or insurance itemised to account for the $123.75 difference.\n\n## Recommendations\n1.  Request a detailed breakdown of the labor costs, including hours, rates, and scope of work, to enable a more precise comparison with market benchmarks.\n2.  Request the explicit currency for all monetary values on the invoice.\n3.  Request an explanation for the $123.75 difference between the subtotal and the total amount.\n4.  Obtain the quantity of 'Material - Paint' supplied to allow a proper price comparison against market rates.\n\n## Conclusion\nThe transaction exhibits a HIGH risk profile primarily due to the substantial over-invoicing indicator for the labor component and multiple document inconsistencies. Further investigation and clarification from the transacting parties is warranted to mitigate potential TBML risk.",
  },

  {
    id: "TBML-7B41E0C9AD52",
    pillMeta: "24 Aug · MED 45",
    createdAtLabel: "Re-screening completed 24 Aug 2026 03:02 PM",
    overallRisk: { level: "MEDIUM", score: 45 },
    indicators: [{ label: "DOCUMENT_INCONSISTENCY", kind: "warn" }],
    docSummaryLine: "Amended invoice 123456-A · 2 documents · 2 line items",
    testedLine: "2 of 2 line items",
    sanctionsHit: false,
    summary:
      "Re-screening of the amended invoice. Quantities were supplied for both line items and the labour charge was restated, bringing both declared prices inside the market reference ranges. Residual risk is driven by document inconsistencies: currency is still not stated and the amendment is not cross-referenced to the original invoice.",

    sourceDocument: {
      type: "PI",
      file: "PI-123456-A.pdf",
      meta: "1 page · 318 KB · uploaded 24 Aug 14:41 · auto-detected Proforma Invoice (amendment)",
    },

    documentExtract: {
      documentType: "Amended invoice",
      documentNumber: "123456-A",
      documentDate: "Aug 23, 2026",
      lcNumber: null,
      pageNumber: 1,
      incoterms: null,
      portOfLoading: null,
      portOfDischarge: null,
      shippingMethod: "UPS",
      containerNumber: null,
      vesselFlight: null,
      paymentTerms: "2%15 Days, Net 45",
      salesTerms: "Amendment to invoice 123456",
      subtotal: 2900.0,
      freightCharges: null,
      insurance: null,
      totalAmount: 2900.0,
      currency: null,
      amountInWords: null,
      fobValue: null,
      cifValue: null,
    },
    parties: {
      Exporter: { name: "Riser Coatings LLC", address: "1420 Foundry Row, Portland, OR 97209", country: "US", phone: "503.555.0142", email: "ap@risercoatings.example" },
      Importer: { name: "Intel Corporation", address: "P.O. Box 1000 Hillsboro, OR 97123-1000", country: "US" },
      "Notify party": { name: "Intel Corporation", address: "3601 Juliette Lane Santa Clara, CA 95052", country: "US" },
      "Issuing bank": {},
      "Beneficiary bank": {},
    },
    gap: null,
    absentFields: ["currency", "incoterms", "ports", "banks / SWIFT", "container & vessel", "LC reference", "supersedes reference"],

    products: [
      { lineNumber: 1, description: "Labor - Paint risers and stringers, five stairways (20 risers)", hsCode: null, quantity: 20, unit: "riser", unitPrice: 70.0, totalPrice: 1400.0, currency: null },
      { lineNumber: 2, description: "Material - Paint, interior enamel", hsCode: "3209.10", quantity: 60, unit: "litre", unitPrice: 25.0, totalPrice: 1500.0, currency: null },
    ],

    lineAnalyses: [
      {
        lineNumber: 1,
        title: "Labor — paint risers and stringers, five stairways (20 risers)",
        declared: 1400.0,
        testable: true,
        reference: { low: 700.0, high: 1350.0, mid: 1000.0, currency: "USD", unit: "for 20-riser project", observations: 28 },
        dataAvailability: "SUFFICIENT",
        riskLevel: "LOW",
        riskScore: 20,
        summary:
          "With the riser count supplied the declared total sits just above the upper bound of the market range, a deviation consistent with regional labour rates rather than over-invoicing.",
        findings: [
          finding(
            "DOCUMENT_INCONSISTENCY",
            "LOW",
            "The amended invoice does not reference the original invoice number it supersedes.",
            "Document number '123456-A' with no supersedes reference; original invoice 123456 remains open in the case file.",
            "Request written confirmation that 123456-A replaces 123456, and reconcile against the purchase order.",
          ),
        ],
        marketEvidence: [
          { source: "latestcost.com", quote: "labour rates for stair riser painting vary by region; upper-quartile metro rates exceed national medians." },
        ],
      },
      {
        lineNumber: 2,
        title: "Material — paint, interior enamel",
        declared: 25.0,
        testable: true,
        reference: { low: 12.0, high: 25.0, mid: 18.5, currency: "USD", unit: "per litre · 60 litres declared", observations: 2 },
        dataAvailability: "SUFFICIENT",
        riskLevel: "LOW",
        riskScore: 15,
        summary:
          "Quantity of 60 litres now declared. The unit price sits at the ceiling of the observed range but within it; thin observation count keeps confidence moderate.",
        findings: [
          finding(
            "DOCUMENT_INCONSISTENCY",
            "LOW",
            "The currency for the declared unit price is still not specified on the amended invoice.",
            "Line item unit_price is '25.00' with no currency indicated.",
            "Request clarification on the currency used for the transaction.",
          ),
        ],
        marketEvidence: [
          { source: "procalclab.com", quote: "interior enamel pricing clusters between USD 12 and USD 25 per litre depending on finish." },
        ],
      },
    ],

    osintResults: [
      {
        productKey: "labor_paint_risers_20riser_basis",
        productDescription: "Labor - Paint risers and stringers, five stairways (20 risers)",
        hsCode: null,
        dataAvailability: "SUFFICIENT",
        availabilityNote: "Market range established from 9 comparable observation(s); riser count now declared, so the benchmark applies on a like basis.",
        referenceLow: 700.0,
        referenceHigh: 1350.0,
        referenceMid: 1000.0,
        currency: "USD",
        unit: "for 20-riser project",
        observations: 28,
        typicalOrigins: ["US"],
        typicalRoutes: [],
        sanctionedJurisdiction: false,
        hsCodesObserved: [],
        priceSources: ["www.homeadvisor.com", "latestcost.com"],
        findings: [{ source: "latestcost.com", text: "Labour rates for stair riser painting vary by region; upper-quartile metro rates exceed national medians." }],
      },
      {
        productKey: "material_paint_interior_enamel",
        productDescription: "Material - Paint, interior enamel",
        hsCode: "3209.10",
        dataAvailability: "SUFFICIENT",
        availabilityNote: "Market range established from 2 comparable observation(s); 60 litres declared, so the per-litre range is applicable.",
        referenceLow: 12.0,
        referenceHigh: 25.0,
        referenceMid: 18.5,
        currency: "USD",
        unit: "litre",
        observations: 2,
        typicalOrigins: ["US"],
        typicalRoutes: [],
        sanctionedJurisdiction: false,
        hsCodesObserved: ["3209.10"],
        priceSources: ["procalclab.com"],
        findings: [{ source: "procalclab.com", text: "Interior enamel pricing clusters between USD 12 and USD 25 per litre depending on finish." }],
      },
    ],

    references: [
      { domain: "www.homeadvisor.com", title: "Cost to paint stair risers, stringers and railings", note: "Per-riser labour benchmarks applied to the restated 20-riser scope.", usedFor: "Labour range", role: "PRICED", retrieved: "24 Aug 14:48" },
      { domain: "latestcost.com", title: "Regional variation in stair painting labour rates", note: "Upper-quartile metro rates exceed national medians, consistent with the declared total.", usedFor: "Labour range", role: "PRICED", retrieved: "24 Aug 14:48" },
      { domain: "procalclab.com", title: "Interior enamel price per litre", note: "Interior enamel pricing clusters between USD 12 and USD 25 per litre depending on finish.", usedFor: "Paint range", role: "PRICED", retrieved: "24 Aug 14:48" },
      { domain: "ofac.treasury.gov", title: "OFAC sanctions list search", note: "Riser Coatings LLC and Intel Corporation screened; no match returned.", usedFor: "Sanctions", role: "SCREENED", retrieved: "24 Aug 14:49" },
    ],
    referencesFooter: "8 domains consulted across 18 queries; 9 pages read, 1 failed. Only sources marked PRICED contributed to a reference range.",

    audit: {
      stats: [
        { value: "18/18", label: "queries ok" },
        { value: "214", label: "results seen" },
        { value: "9 / 1", label: "read / failed" },
        { value: "30", label: "price obs." },
      ],
      domains: ["www.homeadvisor.com", "latestcost.com", "procalclab.com", "ofac.treasury.gov", "sanctionssearch.ofac.treas.gov", "www.sigma360.com", "www.supplychainbrain.com", "www.scribd.com"],
      footer: "searxng · collected 24 Aug 14:48 UTC",
    },

    narrative:
      "## Summary\nRe-screening of amended invoice 123456-A closed the price anomaly raised on 22 August. Both line items now carry quantities and unit bases, and both declared prices fall inside the OSINT reference ranges — labour at USD 1,400.00 against a USD 700.00 – 1,350.00 range on a 20-riser basis, and paint at USD 25.00 per litre against a USD 12.00 – 25.00 range across 60 declared litres.\n\nTwo document inconsistencies remain open: the amendment does not reference the invoice it supersedes, and currency is still absent from all monetary values. Overall risk is assessed as MEDIUM pending those clarifications.",
  },

  {
    id: "TBML-2C88F51D3E07",
    pillMeta: "25 Aug · LOW 15",
    createdAtLabel: "Screening run completed 25 Aug 2026 09:34 AM",
    overallRisk: { level: "LOW", score: 15 },
    indicators: [{ label: "NO_INDICATORS", kind: "ok" }],
    docSummaryLine: "Credit note 123456-CN · 1 document · 1 line item",
    testedLine: "1 of 1 line item",
    sanctionsHit: false,
    summary:
      "Credit note screening. The single line reconciles the 123.75 difference previously flagged between subtotal and total on invoice 123456. No price anomaly and no sanctions exposure; the document is internally consistent.",

    sourceDocument: {
      type: "LC",
      file: "CN-123456-CN.pdf",
      meta: "1 page · 96 KB · uploaded 25 Aug 09:12 · credit note against PI-123456",
    },

    documentExtract: {
      documentType: "Credit note",
      documentNumber: "123456-CN",
      documentDate: "Aug 24, 2026",
      lcNumber: null,
      pageNumber: 1,
      incoterms: null,
      portOfLoading: null,
      portOfDischarge: null,
      shippingMethod: null,
      containerNumber: null,
      vesselFlight: null,
      paymentTerms: "Applied to invoice 123456",
      salesTerms: "Sales tax adjustment",
      subtotal: 123.75,
      freightCharges: null,
      insurance: null,
      totalAmount: 123.75,
      currency: "USD",
      amountInWords: "One hundred twenty three and 75/100 US dollars",
      fobValue: null,
      cifValue: null,
    },
    parties: {
      Exporter: { name: "Riser Coatings LLC", address: "1420 Foundry Row, Portland, OR 97209", country: "US", phone: "503.555.0142", email: "ap@risercoatings.example" },
      Importer: { name: "Intel Corporation", address: "P.O. Box 1000 Hillsboro, OR 97123-1000", country: "US" },
      "Notify party": {},
      "Issuing bank": {},
      "Beneficiary bank": {},
    },
    gap: null,
    absentFields: ["incoterms", "ports", "banks / SWIFT", "container & vessel", "LC reference", "shipping method"],

    products: [{ lineNumber: 1, description: "Credit - sales tax adjustment against invoice 123456", hsCode: null, quantity: 1, unit: "adjustment", unitPrice: 123.75, totalPrice: 123.75, currency: "USD" }],

    lineAnalyses: [
      {
        lineNumber: 1,
        title: "Credit — sales tax adjustment against invoice 123456",
        declared: 123.75,
        testable: false,
        notRequired: true,
        dataAvailability: "NOT_REQUIRED",
        riskLevel: "LOW",
        riskScore: 5,
        summary:
          "The credit equals the previously unexplained difference between subtotal and total on invoice 123456, resolving that document inconsistency. Tax adjustments are not price-benchmarked.",
        findings: [],
        marketEvidence: [{ source: "internal", quote: "matched against case document invoice 123456; difference of 123.75 now accounted for." }],
      },
    ],

    osintResults: [
      {
        productKey: "credit_sales_tax_adjustment",
        productDescription: "Credit - sales tax adjustment against invoice 123456",
        hsCode: null,
        dataAvailability: "NOT_REQUIRED",
        availabilityNote: "Tax adjustments are not price-benchmarked; no market research was performed.",
        referenceLow: null,
        referenceHigh: null,
        referenceMid: null,
        currency: null,
        unit: null,
        observations: 0,
        typicalOrigins: ["US"],
        typicalRoutes: [],
        sanctionedJurisdiction: false,
        hsCodesObserved: [],
        priceSources: [],
        findings: [{ source: "ofac.treasury.gov", text: "Sanctions lists consulted for both named parties; no match returned." }],
      },
    ],

    references: [
      { domain: "ofac.treasury.gov", title: "OFAC sanctions list search", note: "Both named parties screened against consolidated lists; no match returned.", usedFor: "Sanctions", role: "SCREENED", retrieved: "25 Aug 09:20" },
      { domain: "sanctionssearch.ofac.treas.gov", title: "Specially Designated Nationals search", note: "Secondary confirmation of the primary list search.", usedFor: "Sanctions", role: "SCREENED", retrieved: "25 Aug 09:20" },
    ],
    referencesFooter: "No price benchmarking was required for a tax adjustment; 2 domains consulted across 6 queries.",

    audit: {
      stats: [
        { value: "6/6", label: "queries ok" },
        { value: "48", label: "results seen" },
        { value: "4 / 0", label: "read / failed" },
        { value: "0", label: "price obs." },
      ],
      domains: ["ofac.treasury.gov", "sanctionssearch.ofac.treas.gov"],
      footer: "searxng · collected 25 Aug 09:20 UTC",
    },

    narrative:
      "## Summary\nScreening of credit note 123456-CN found no TBML indicators. The single line item credits USD 123.75 against invoice 123456, which reconciles the subtotal-to-total discrepancy recorded in the 22 August screening. Currency is stated, the amount is internally consistent, and no party or jurisdiction on the document appears on the sanctions lists consulted.\n\nOverall risk is assessed as LOW; no analyst action is required beyond linking the credit note to the original invoice in the case file.",
  },
];

export default mockTbmlRuns;
