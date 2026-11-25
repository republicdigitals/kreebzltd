// Display-only currency conversion. Rates are not live market data —
// the naira figure is a guide price. Admin-editable rate arrives with
// the site-content editing wave; until then update the constant here.
export const NGN_PER_USD = 1500;

export type Currency = "USD" | "NGN";

export function formatConvertedPrice(priceValue: number, currency: Currency): string {
  if (currency === "NGN") {
    return `₦${Math.round(priceValue * NGN_PER_USD).toLocaleString()}`;
  }
  return `$${priceValue.toLocaleString()}`;
}
