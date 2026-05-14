export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

export function getWhatsAppUrl(phone: string, restaurantName: string) {
  const text = encodeURIComponent(
    `Hi ${restaurantName}, I would like to place an order.`
  );
  return `https://wa.me/${normalizeWhatsAppNumber(phone)}?text=${text}`;
}
