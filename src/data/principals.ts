export interface Principal {
  name: string;
  title: string;
  /** One-line credential shown under the name. */
  credential: string;
  /** Optional photo path under /public. Falls back to a monogram. */
  photo?: string;
  phone: string;
  email: string;
}

/**
 * The named people behind the "talk to a principal" promise.
 * Sourced from the principals already listed on property mandates —
 * add an entry here when a new principal joins a mandate.
 */
export const principals: Principal[] = [
  {
    name: "Michael Eugene",
    title: "Key Principal",
    credential: "Leads acquisitions, development and client mandates",
    phone: "+234 806 994 9948",
    email: "hello@kreebzltd.com",
  },
];
