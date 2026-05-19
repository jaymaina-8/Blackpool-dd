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

export function getCtaLabel(type: string) {
  switch (type) {
    case "Reserve Table":
      return "Reserve a table";
    case "Explore Menu":
      return "Explore the menu";
    case "Book Event":
      return "Book an event";
    case "Visit Us":
      return "Visit us";
    case "Call Now":
      return "Call now";
    case "Get Directions":
      return "Get directions";
    default:
      return "Order on WhatsApp";
  }
}

export function getCtaUrl(
  type: string,
  phone: string,
  restaurantName: string,
  area: string,
  googleMapsUrl?: string,
  slug?: string
) {
  if (type === "Call Now") {
    return `tel:${phone}`;
  }

  if (type === "WhatsApp Order") {
    return getWhatsAppUrl(phone, restaurantName);
  }

  if (type === "Reserve Table") {
    return googleMapsUrl || `https://reserve.example.com/${slug || "restaurant"}`;
  }

  if (type === "Explore Menu") {
    return slug ? `/demo/${slug}#menu` : `#menu`;
  }

  if (type === "Book Event") {
    return `https://events.example.com/book/${slug || "restaurant"}`;
  }

  if (type === "Visit Us") {
    return googleMapsUrl || `https://maps.google.com/search/${encodeURIComponent(area)}`;
  }

  if (type === "Get Directions") {
    return googleMapsUrl || `https://maps.google.com/search/${encodeURIComponent(area)}`;
  }

  return `https://wa.me/${normalizeWhatsAppNumber(phone)}`;
}
