import type { Property } from "@/data/properties";

export interface CompletenessResult {
  score: number;
  total: number;
  missing: string[];
}

/**
 * Which listing essentials are filled. Mirrors the sections buyers ask for
 * first — media, specification, utilities, legal, and (for leases) terms.
 */
export function propertyCompleteness(p: Property): CompletenessResult {
  const checks: { label: string; ok: boolean }[] = [
    { label: "photos", ok: Boolean(p.image) || (p.gallery?.length ?? 0) > 0 },
    { label: "floor plans", ok: (p.floorPlans?.length ?? 0) > 0 },
    { label: "sizes", ok: Boolean(p.internalSqm) || Boolean(p.landSqm) },
    { label: "parking", ok: p.parkingCount != null && p.parkingCount > 0 },
    { label: "furnishing", ok: Boolean(p.furnishing) },
    { label: "utilities (power/water/security)", ok: Boolean(p.powerDetails || p.waterDetails || p.securityDetails) },
    { label: "service charge", ok: Boolean(p.serviceCharge) },
    { label: "title & tenure", ok: Boolean(p.titleStatus || p.tenure) },
    { label: "availability & inspections", ok: Boolean(p.availabilityNote || p.inspectionInfo) },
    { label: "pricing clarity", ok: Boolean(p.price) || p.priceOnRequest === true },
  ];
  if (p.status === "For Lease") {
    checks.push({ label: "lease terms", ok: Boolean(p.leaseAnnualRent) });
  }
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  return { score: checks.length - missing.length, total: checks.length, missing };
}
