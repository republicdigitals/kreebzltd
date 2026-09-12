/**
 * Bourdillon project content — single source of truth.
 *
 * EDITING GUIDE (no code deployment needed for copy changes):
 * - Update `status`, `progress`, `faqs`, and `proofPoints` below.
 * - Every proof point carries an `approval` status. Only items marked
 *   "approved" are rendered on the public site.
 * - Do NOT publish partner names, logos, prices, dates, or construction
 *   claims here unless they have written approval.
 */

export type ProofApproval = "draft" | "pending" | "approved" | "expired";

export type FeatureStatus = "proposed" | "planned" | "under-construction" | "completed";

export interface ProgressUpdate {
  /** Display date, e.g. "September 2026" */
  date: string;
  milestone: string;
  detail: string;
  /** Optional image path under /public, e.g. "/images/townhouse-ibj-render.webp" */
  image?: string;
  /** Label for the image, e.g. "Site photo" or "Illustrative render" */
  imageLabel?: string;
}

export interface ProofPoint {
  category: "authority" | "execution" | "people" | "capability" | "place" | "confidence";
  title: string;
  body: string;
  approval: ProofApproval;
}

export interface ProjectFaq {
  question: string;
  answer: string;
}

export interface ProjectFeature {
  label: string;
  status: FeatureStatus;
  detail?: string;
}

export const bourdillon = {
  name: "Bourdillon",
  slug: "bourdillon",
  url: "/projects/bourdillon",
  location: "Bourdillon, Ikoyi",
  city: "Lagos, Nigeria",
  positioning:
    "A private residence on Bourdillon Road, Ikoyi — we designed it, we're building it, and we'll manage it after you move in.",
  /** Approved current status. Keep this accurate — it is shown publicly. */
  status: "Foundation stage",
  statusLabel: "Current status",
  heroImage: "/images/townhouse-ibj-render-aerial.webp",
  /** Required whenever the hero image is not a photograph of completed work. */
  heroImageLabel: "Illustrative render — proposed design, subject to approval",
  heroImageAlt:
    "Illustrative aerial render of the proposed Bourdillon residence, Ikoyi",

  /** "What is happening now" — latest first. */
  progress: [
    {
      date: "September 2026",
      milestone: "Foundation works in progress",
      detail:
        "Substructure and foundation works are underway on site. This stage establishes the structural base for the residence and is verified by the project engineer before superstructure works begin.",
      image: "/images/townhouse-ibj-render-angle.webp",
      imageLabel: "Illustrative render",
    },
  ] as ProgressUpdate[],

  /** "What is being created" — approved information only. */
  vision: {
    designIntent:
      "A contemporary private residence arranged across multiple floors, planned for privacy, natural light, and long-term manageability.",
    features: [
      { label: "Private residence, Bourdillon Road", status: "under-construction" },
      { label: "Lift access across all floors", status: "planned" },
      { label: "Private pool and wellness facilities", status: "proposed" },
      { label: "Cinema and family lounge", status: "proposed" },
      { label: "Staff and service quarters", status: "planned" },
      { label: "Kreebz facility management on completion", status: "planned" },
    ] as ProjectFeature[],
    rationale:
      "Bourdillon Road sits within Ikoyi's established residential grid — a low-density, tree-lined neighbourhood with controlled access and proximity to Ikoyi Club, the Lagoon, and Victoria Island's commercial district.",
  },

  /**
   * Proof library — only `approval: "approved"` items render publicly.
   * Add a source/owner note in the internal fact sheet for each item.
   */
  proofPoints: [
    {
      category: "authority",
      title: "Official marketing & facility management mandate",
      body: "Kreebz Ltd is the appointed marketing and facility-management company for this development.",
      approval: "approved",
    },
    {
      category: "execution",
      title: "Dated construction milestones",
      body: "Foundation-stage progress is documented with dated site updates, verified by the project representative before publication.",
      approval: "approved",
    },
    {
      category: "capability",
      title: "End-to-end operating capability",
      body: "Kreebz provides facility operations, resident care, and a vetted contractor network — the same team that markets the residence manages it after handover.",
      approval: "approved",
    },
    {
      category: "confidence",
      title: "One-business-day response standard",
      body: "Every enquiry is reviewed by a principal and answered within one business day.",
      approval: "approved",
    },
  ] as ProofPoint[],

  locationFacts: [
    "Bourdillon Road, Ikoyi — an established residential district of Lagos",
    "Controlled-access neighbourhood with low-density housing",
    "Minutes from Ikoyi Club 1938 and the Lekki–Ikoyi Link Bridge",
    "Direct access to Victoria Island and Lagos Island business districts",
  ],

  faqs: [
    {
      question: "What is the current construction stage?",
      answer:
        "The project is at foundation stage. Substructure works are underway and each milestone is verified by the project team before it is published.",
    },
    {
      question: "What is the expected completion timeline?",
      answer:
        "A confirmed completion date will be published once the construction programme is approved. Register your interest to receive dated progress updates.",
    },
    {
      question: "What is the residence configuration?",
      answer:
        "The residence is planned as a multi-floor private home with lift access, staff quarters, and dedicated leisure spaces. Final configuration is subject to approved drawings.",
    },
    {
      question: "What amenities are planned?",
      answer:
        "Proposed amenities include a private pool, cinema, family lounge, and wellness facilities. Items marked 'proposed' are not yet built and remain subject to approval.",
    },
    {
      question: "Is pricing available?",
      answer:
        "Pricing is released to qualified enquirers during a private consultation. Request the project information to begin that conversation.",
    },
    {
      question: "What is the reservation process?",
      answer:
        "After a private consultation, qualified buyers receive the approved documentation and reservation terms directly from a Kreebz principal.",
    },
    {
      question: "Who manages the property after completion?",
      answer:
        "Kreebz Ltd provides facility management, resident care, and contractor coordination for the completed residence.",
    },
    {
      question: "How do I arrange a private consultation or viewing?",
      answer:
        "Use the enquiry form on this page and select 'Arrange a private consultation'. A principal will respond within one business day.",
    },
    {
      question: "Which details are proposed and which are completed?",
      answer:
        "Every feature on this page is labelled Proposed, Planned, Under construction, or Completed. Renders are marked 'Illustrative render' and are subject to approval.",
    },
  ] as ProjectFaq[],

  /** Primary conversion block copy */
  cta: {
    heading: "Get the Bourdillon brochure",
    subheading:
      "We'll send the approved brochure and can set up a call or a site visit — whatever's easier.",
  },
};

/** Only approved proof points are safe to render publicly. */
export function getApprovedProofPoints(): ProofPoint[] {
  return bourdillon.proofPoints.filter((p) => p.approval === "approved");
}
