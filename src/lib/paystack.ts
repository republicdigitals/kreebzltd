/**
 * Minimal Paystack API client over native fetch — replaces the unmaintained
 * `paystack-api` npm package (which breaks under the current toolchain).
 * Docs: https://paystack.com/docs/api/
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export class PaystackError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = "PaystackError";
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new PaystackError("PAYSTACK_SECRET_KEY is not configured");

  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || body?.status === false) {
    throw new PaystackError(body?.message ?? `Paystack request failed (${res.status})`, res.status);
  }
  return body as T;
}

export interface PaystackInitializeResponse {
  status: boolean;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  data: {
    status: string; // "success" | "failed" | "abandoned" | ...
    reference: string;
    amount: number; // kobo
    currency: string;
    metadata?: { bookingId?: string; type?: string } & Record<string, unknown>;
  };
}

export function initializeTransaction(params: {
  amount: number; // kobo
  email: string;
  reference: string;
  callback_url: string;
  metadata?: Record<string, unknown>;
}) {
  return call<PaystackInitializeResponse>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function verifyTransaction(reference: string) {
  return call<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
