/** Country dial codes + national number formatting for WhatsApp lead forms */

export const PHONE_COUNTRIES = [
  {
    code: "PK",
    name: "Pakistan",
    dial: "92",
    flag: "🇵🇰",
    placeholder: "300 1234567",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 3) return d;
      return `${d.slice(0, 3)} ${d.slice(3, 10)}`;
    },
  },
  {
    code: "IN",
    name: "India",
    dial: "91",
    flag: "🇮🇳",
    placeholder: "98765 43210",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 10)}`;
    },
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    dial: "971",
    flag: "🇦🇪",
    placeholder: "50 123 4567",
    maxDigits: 9,
    format: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
    },
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    dial: "966",
    flag: "🇸🇦",
    placeholder: "50 123 4567",
    maxDigits: 9,
    format: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
    },
  },
  {
    code: "GB",
    name: "United Kingdom",
    dial: "44",
    flag: "🇬🇧",
    placeholder: "7400 123456",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 10)}`;
    },
  },
  {
    code: "US",
    name: "United States",
    dial: "1",
    flag: "🇺🇸",
    placeholder: "(555) 123-4567",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
  },
  {
    code: "CA",
    name: "Canada",
    dial: "1",
    flag: "🇨🇦",
    placeholder: "(555) 123-4567",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
  },
  {
    code: "AU",
    name: "Australia",
    dial: "61",
    flag: "🇦🇺",
    placeholder: "412 345 678",
    maxDigits: 9,
    format: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
    },
  },
  {
    code: "BD",
    name: "Bangladesh",
    dial: "880",
    flag: "🇧🇩",
    placeholder: "1712 345678",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 10)}`;
    },
  },
  {
    code: "QA",
    name: "Qatar",
    dial: "974",
    flag: "🇶🇦",
    placeholder: "3312 3456",
    maxDigits: 8,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    },
  },
  {
    code: "OM",
    name: "Oman",
    dial: "968",
    flag: "🇴🇲",
    placeholder: "9123 4567",
    maxDigits: 8,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    },
  },
  {
    code: "KW",
    name: "Kuwait",
    dial: "965",
    flag: "🇰🇼",
    placeholder: "5000 1234",
    maxDigits: 8,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    },
  },
  {
    code: "MY",
    name: "Malaysia",
    dial: "60",
    flag: "🇲🇾",
    placeholder: "12-345 6789",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 5)} ${d.slice(5, 10)}`;
    },
  },
  {
    code: "SG",
    name: "Singapore",
    dial: "65",
    flag: "🇸🇬",
    placeholder: "8123 4567",
    maxDigits: 8,
    format: (d) => {
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    },
  },
  {
    code: "TR",
    name: "Turkey",
    dial: "90",
    flag: "🇹🇷",
    placeholder: "532 123 4567",
    maxDigits: 10,
    format: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
    },
  },
];

export function getPhoneCountry(code) {
  return PHONE_COUNTRIES.find((c) => c.code === code) || PHONE_COUNTRIES[0];
}

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

/** Strip leading 0 and country dial if user pasted a full international number */
export function normalizeNationalDigits(raw, country) {
  let d = digitsOnly(raw);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith(country.dial)) d = d.slice(country.dial.length);
  return d.slice(0, country.maxDigits);
}

export function formatNationalNumber(raw, country) {
  const digits = normalizeNationalDigits(raw, country);
  return country.format(digits);
}

export function toE164(nationalFormatted, country) {
  const national = normalizeNationalDigits(nationalFormatted, country);
  if (!national) return "";
  return `+${country.dial}${national}`;
}

export const DEFAULT_WA_SUBSCRIPTION_MESSAGE =
  "Hi EduToolsHub, I need more info related to SaaS solution subscription.";
