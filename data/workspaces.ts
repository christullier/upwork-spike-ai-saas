export type DocType = "PDF" | "DOCX" | "MD";

export type Chunk = {
  id: string;
  docId: string;
  text: string;
};

export type Doc = {
  id: string;
  title: string;
  type: DocType;
  updated: string;
  chunks: Chunk[];
};

export type Workspace = {
  id: string;
  name: string;
  plan: string;
  docs: Doc[];
  suggestions: string[];
};

function makeChunks(docId: string, texts: string[]): Chunk[] {
  return texts.map((text, i) => ({
    id: `${docId}-${i + 1}`,
    docId,
    text,
  }));
}

export const workspaces: Workspace[] = [
  {
    id: "northwind",
    name: "Northwind Logistics",
    plan: "Growth",
    suggestions: [
      "What is the refund window for damaged freight?",
      "Which plan includes API access?",
      "Where is customer data stored?",
    ],
    docs: [
      {
        id: "refunds",
        title: "Refund & Returns Policy",
        type: "PDF",
        updated: "Sep 12, 2026",
        chunks: makeChunks("refunds", [
          "Refunds are available within 30 days of the delivery date. The refund goes to the original payment method. Most refunds arrive in 5 to 10 business days.",
          "Damage claims for freight must be filed within 7 days of delivery. Attach at least two photos of the damaged freight to the claim form. Claims filed after 7 days are not accepted.",
          "Returned items must include the original packaging and the shipment label. Northwind Logistics pays return freight when the damage is our fault.",
          "To start a return, open the shipment in the Northwind dashboard and select Request return. A support agent confirms the claim within one business day.",
        ]),
      },
      {
        id: "pricing",
        title: "Pricing Tiers 2026",
        type: "PDF",
        updated: "Oct 02, 2026",
        chunks: makeChunks("pricing", [
          "The Starter plan costs $49 per month and includes 500 shipments each month. It is designed for small teams that ship to one region.",
          "The Growth plan costs $199 per month and includes 5,000 shipments and API access. It also includes priority email support.",
          "The Enterprise plan has custom pricing. It includes SSO, a dedicated customer success manager, custom SLAs and unlimited shipments.",
          "Annual billing gives two months free on the Starter and Growth plans. You can change plans at any time and the change is prorated.",
        ]),
      },
      {
        id: "sla",
        title: "SLA & Support",
        type: "PDF",
        updated: "Aug 28, 2026",
        chunks: makeChunks("sla", [
          "Northwind Logistics targets 99.9% uptime each calendar month. Planned maintenance happens on Sundays between 02:00 and 04:00 UTC.",
          "Priority 1 incidents get a first response within 1 hour on the Growth and Enterprise plans. Starter customers get a response within 8 business hours.",
          "Support hours are Monday to Friday, 8am to 8pm Eastern Time. Enterprise customers have a 24/7 emergency phone line.",
        ]),
      },
      {
        id: "security",
        title: "Security FAQ",
        type: "MD",
        updated: "Oct 18, 2026",
        chunks: makeChunks("security", [
          "Northwind Logistics is SOC 2 Type II certified. The audit report is available under NDA.",
          "Customer data is encrypted with AES-256 at rest and TLS 1.2 or higher in transit. Data is stored in AWS us-east-1.",
          "Audit logs are retained for 90 days. Enterprise customers can extend log retention to one year.",
          "We run automated vulnerability scans each week. A third-party penetration test happens every year.",
        ]),
      },
      {
        id: "onboarding",
        title: "Customer Onboarding Guide",
        type: "DOCX",
        updated: "Jul 30, 2026",
        chunks: makeChunks("onboarding", [
          "First connect your carrier account in Settings > Carriers. Northwind supports major carriers and regional freight partners.",
          "Import your open shipments from a CSV file. The importer accepts up to 10,000 rows per file.",
          "Invite teammates from Settings > Team and assign the Admin, Operator or Viewer role. Seats are included in every plan.",
          "Create a webhook endpoint to receive shipment status events. Each request is signed with an HMAC secret.",
        ]),
      },
    ],
  },
  {
    id: "acme",
    name: "Acme Health Clinic",
    plan: "Starter",
    suggestions: [
      "What is the no-show fee?",
      "Which insurance plans do you accept?",
      "How fast do lab results appear?",
    ],
    docs: [
      {
        id: "appointments",
        title: "Appointment Policy",
        type: "PDF",
        updated: "Sep 05, 2026",
        chunks: makeChunks("appointments", [
          "Patients must cancel or reschedule at least 24 hours before the appointment. This gives the clinic time to offer the slot to another patient.",
          "A no-show fee of $40 applies when a patient misses an appointment without notice. The fee is charged to the card on file.",
          "Late arrivals more than 15 minutes after the appointment time may need to reschedule. The clinic will try to fit the patient into the next open slot.",
        ]),
      },
      {
        id: "insurance",
        title: "Insurance Accepted",
        type: "PDF",
        updated: "Aug 19, 2026",
        chunks: makeChunks("insurance", [
          "Acme Health Clinic accepts Aetna, Cigna and BlueCross BlueShield plans. Please confirm your plan when you book.",
          "Please bring your insurance card and a photo ID to each visit. Eligibility is checked before the appointment.",
          "Patients without insurance can ask about the self-pay rate. The front desk gives an estimate before the visit.",
        ]),
      },
      {
        id: "portal",
        title: "Patient Portal Help",
        type: "MD",
        updated: "Oct 11, 2026",
        chunks: makeChunks("portal", [
          "To reset your password, select Forgot password on the portal login page. A reset link goes to the email on your record.",
          "Lab results appear in the portal within 48 hours after the lab releases them. Your care team may call you sooner about urgent results.",
          "The portal shows appointments, messages and billing statements. Contact the front desk if you cannot see a recent visit.",
        ]),
      },
    ],
  },
];

export const docTypeStyles: Record<DocType, string> = {
  PDF: "bg-rose-50 text-rose-600 ring-rose-200",
  DOCX: "bg-sky-50 text-sky-600 ring-sky-200",
  MD: "bg-amber-50 text-amber-600 ring-amber-200",
};
