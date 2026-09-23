/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — BUSINESS INFORMATION
   ⚠️  Items marked [CONFIRM WITH CLIENT] need verification
       before publishing to production.
───────────────────────────────────────────────────────── */

export const BUSINESS = {
  name: "Daddu Charger",
  legalName: "Daddu Charger Gaming Store",
  tagline: "Pakistan's Premium Gaming Hardware Destination",
  description:
    "Founded in Rawalpindi, Pakistan, Daddu Charger is a premier destination for custom-built gaming PCs and high-performance components. We build rigs that meet the unique demands of every gamer.",

  /* ─── LOCATION ─── */
  city: "Rawalpindi",
  country: "Pakistan",
  address: "Royal Plaza, Basement (LG 04), 6th Road, Satellite Town, Rawalpindi",
  postalCode: "46000",
  mapsLink: "https://maps.app.goo.gl/DadduCharger", 
  coordinates: {
    lat: 33.6429, 
    lng: 73.0722,
  },

  /* ─── CONTACT ─── */
  phone: "[CONFIRM WITH CLIENT]",
  whatsapp: "[CONFIRM WITH CLIENT]", // WhatsApp number for order widget
  email: "[CONFIRM WITH CLIENT]",
  
  /* ─── HOURS ─── */
  hours: {
    weekdays: "[CONFIRM WITH CLIENT]", // e.g. "10:00 AM – 8:00 PM"
    saturday: "[CONFIRM WITH CLIENT]",
    sunday: "[CONFIRM WITH CLIENT]",
  },

  /* ─── SOCIAL ─── */
  social: {
    instagram: "[CONFIRM WITH CLIENT]", // e.g. "@dadducharger"
    facebook: "[CONFIRM WITH CLIENT]",
    youtube: "[CONFIRM WITH CLIENT]",
    tiktok: "[CONFIRM WITH CLIENT]",
  },

  /* ─── COMMERCE ─── */
  currency: "PKR" as const,
  currencySymbol: "Rs.",
  moneyFormat: "Rs.{{amount}}",

  /* ─── POLICIES ─── */
  returnWindow: 2, // Hours to cancel order (from FAQ)
  paymentMethods: [
    "Bank Transfer",
    "Credit/Debit Card",
    "[CONFIRM: PayPal availability for PK]",
  ],
  
  /* ─── BRANDS STOCKED ─── */
  featuredBrands: [
    "ASUS ROG",
    "MSI",
    "Corsair",
    "Cooler Master",
    "DeepCool",
    "Lian Li",
    "Gigabyte",
    "NZXT",
    "Thermaltake",
    "Kingston",
    "Samsung",
    "Western Digital",
    "Seagate",
  ],
} as const;
