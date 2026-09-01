export const PRODUCT_NAME = "Elina Collections"; // Or your specific apparel/product name
export const PRODUCT_PRICE = 3400; // سعر الفستان
export const SHOPPING_STANDARD = 600;
export const SHOPPING_REMOTE = 1100;

export const REMOTE_WILAYAS_CODES = [
  "01", "03", "07", "11", "30", "33", "32", "39", "37", "45", "47", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58"
];

export function getShippingPrice(formattedWilayaString: string): number {
  if (!formattedWilayaString) return SHOPPING_STANDARD;
  const code = formattedWilayaString.split(" - ")[0];
  if (REMOTE_WILAYAS_CODES.includes(code)) {
    return SHOPPING_REMOTE;
  }
  return SHOPPING_STANDARD;
}