// Display-only currency conversion. Rates are not live market data —
// the naira figure is a guide price. Admin-editable rate arrives with
// the site-content editing wave; until then update the constant here.
export const NGN_PER_USD = 1500;

export type Currency = "USD" | "NGN";

export function formatConvertedPrice(
  priceValue: number,
  currency: Currency,
  listingCurrency?: string | null
): string {
  // priceValue is denominated in the listing's own currency — convert from
  // that basis. Listings with no explicit currency are treated as USD.
  const nativeIsNgn = (listingCurrency ?? "USD").toUpperCase().includes("NGN") || (listingCurrency ?? "").includes("₦");
  if (nativeIsNgn) {
    return currency === "NGN"
      ? `₦${priceValue.toLocaleString()}`
      : `$${Math.round(priceValue / NGN_PER_USD).toLocaleString()}`;
  }
  return currency === "NGN"
    ? `₦${Math.round(priceValue * NGN_PER_USD).toLocaleString()}`
    : `$${priceValue.toLocaleString()}`;
}
