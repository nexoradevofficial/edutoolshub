/**
 * World country dial codes + national WhatsApp number formatting.
 * Flag emoji is derived from ISO 3166-1 alpha-2.
 */

function flagEmoji(iso2) {
  if (!iso2 || iso2.length !== 2) return "🌐";
  const A = 0x1f1e6;
  const c = iso2.toUpperCase();
  return String.fromCodePoint(A + c.charCodeAt(0) - 65, A + c.charCodeAt(1) - 65);
}

/** Group digits with spaces using a pattern of chunk sizes, e.g. [3,3,4] */
function groupDigits(digits, chunks) {
  const parts = [];
  let i = 0;
  for (const size of chunks) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.filter(Boolean).join(" ");
}

function formatNanp(d) {
  if (d.length <= 3) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

function formatByChunks(d, chunks) {
  return groupDigits(d, chunks);
}

/**
 * [iso2, name, dial, maxDigits, formatKey]
 * formatKey: nanp | chunks like "3-3-4" | "2-3-4" etc.
 */
const RAW = [
  ["AF", "Afghanistan", "93", 9, "2-3-4"],
  ["AL", "Albania", "355", 9, "3-3-3"],
  ["DZ", "Algeria", "213", 9, "3-2-4"],
  ["AS", "American Samoa", "1", 10, "nanp"],
  ["AD", "Andorra", "376", 9, "3-3-3"],
  ["AO", "Angola", "244", 9, "3-3-3"],
  ["AI", "Anguilla", "1", 10, "nanp"],
  ["AG", "Antigua and Barbuda", "1", 10, "nanp"],
  ["AR", "Argentina", "54", 10, "2-4-4"],
  ["AM", "Armenia", "374", 8, "2-6"],
  ["AW", "Aruba", "297", 7, "3-4"],
  ["AU", "Australia", "61", 9, "3-3-3"],
  ["AT", "Austria", "43", 10, "3-3-4"],
  ["AZ", "Azerbaijan", "994", 9, "2-3-4"],
  ["BS", "Bahamas", "1", 10, "nanp"],
  ["BH", "Bahrain", "973", 8, "4-4"],
  ["BD", "Bangladesh", "880", 10, "4-6"],
  ["BB", "Barbados", "1", 10, "nanp"],
  ["BY", "Belarus", "375", 9, "2-3-4"],
  ["BE", "Belgium", "32", 9, "3-2-4"],
  ["BZ", "Belize", "501", 7, "3-4"],
  ["BJ", "Benin", "229", 8, "2-2-4"],
  ["BM", "Bermuda", "1", 10, "nanp"],
  ["BT", "Bhutan", "975", 8, "2-2-4"],
  ["BO", "Bolivia", "591", 8, "1-7"],
  ["BA", "Bosnia and Herzegovina", "387", 8, "2-3-3"],
  ["BW", "Botswana", "267", 8, "2-3-3"],
  ["BR", "Brazil", "55", 11, "2-5-4"],
  ["IO", "British Indian Ocean Territory", "246", 7, "3-4"],
  ["VG", "British Virgin Islands", "1", 10, "nanp"],
  ["BN", "Brunei", "673", 7, "3-4"],
  ["BG", "Bulgaria", "359", 9, "3-3-3"],
  ["BF", "Burkina Faso", "226", 8, "2-2-4"],
  ["BI", "Burundi", "257", 8, "2-2-4"],
  ["KH", "Cambodia", "855", 9, "2-3-4"],
  ["CM", "Cameroon", "237", 9, "3-2-4"],
  ["CA", "Canada", "1", 10, "nanp"],
  ["CV", "Cape Verde", "238", 7, "3-4"],
  ["KY", "Cayman Islands", "1", 10, "nanp"],
  ["CF", "Central African Republic", "236", 8, "2-2-4"],
  ["TD", "Chad", "235", 8, "2-2-4"],
  ["CL", "Chile", "56", 9, "1-4-4"],
  ["CN", "China", "86", 11, "3-4-4"],
  ["CX", "Christmas Island", "61", 9, "3-3-3"],
  ["CC", "Cocos (Keeling) Islands", "61", 9, "3-3-3"],
  ["CO", "Colombia", "57", 10, "3-3-4"],
  ["KM", "Comoros", "269", 7, "3-4"],
  ["CG", "Congo", "242", 9, "2-3-4"],
  ["CD", "Congo (DRC)", "243", 9, "3-3-3"],
  ["CK", "Cook Islands", "682", 5, "2-3"],
  ["CR", "Costa Rica", "506", 8, "4-4"],
  ["CI", "Côte d'Ivoire", "225", 10, "2-2-2-4"],
  ["HR", "Croatia", "385", 9, "2-3-4"],
  ["CU", "Cuba", "53", 8, "1-7"],
  ["CW", "Curaçao", "599", 7, "3-4"],
  ["CY", "Cyprus", "357", 8, "2-6"],
  ["CZ", "Czech Republic", "420", 9, "3-3-3"],
  ["DK", "Denmark", "45", 8, "2-2-2-2"],
  ["DJ", "Djibouti", "253", 8, "2-2-4"],
  ["DM", "Dominica", "1", 10, "nanp"],
  ["DO", "Dominican Republic", "1", 10, "nanp"],
  ["EC", "Ecuador", "593", 9, "2-3-4"],
  ["EG", "Egypt", "20", 10, "2-4-4"],
  ["SV", "El Salvador", "503", 8, "4-4"],
  ["GQ", "Equatorial Guinea", "240", 9, "3-3-3"],
  ["ER", "Eritrea", "291", 7, "1-6"],
  ["EE", "Estonia", "372", 8, "4-4"],
  ["SZ", "Eswatini", "268", 8, "2-2-4"],
  ["ET", "Ethiopia", "251", 9, "2-3-4"],
  ["FK", "Falkland Islands", "500", 5, "5"],
  ["FO", "Faroe Islands", "298", 6, "3-3"],
  ["FJ", "Fiji", "679", 7, "3-4"],
  ["FI", "Finland", "358", 10, "2-3-4"],
  ["FR", "France", "33", 9, "1-2-2-2-2"],
  ["GF", "French Guiana", "594", 9, "3-2-2-2"],
  ["PF", "French Polynesia", "689", 8, "2-2-2-2"],
  ["GA", "Gabon", "241", 8, "1-2-2-3"],
  ["GM", "Gambia", "220", 7, "3-4"],
  ["GE", "Georgia", "995", 9, "3-2-4"],
  ["DE", "Germany", "49", 11, "3-4-4"],
  ["GH", "Ghana", "233", 9, "2-3-4"],
  ["GI", "Gibraltar", "350", 8, "4-4"],
  ["GR", "Greece", "30", 10, "3-3-4"],
  ["GL", "Greenland", "299", 6, "2-2-2"],
  ["GD", "Grenada", "1", 10, "nanp"],
  ["GP", "Guadeloupe", "590", 9, "3-2-2-2"],
  ["GU", "Guam", "1", 10, "nanp"],
  ["GT", "Guatemala", "502", 8, "4-4"],
  ["GG", "Guernsey", "44", 10, "4-6"],
  ["GN", "Guinea", "224", 9, "3-2-4"],
  ["GW", "Guinea-Bissau", "245", 7, "3-4"],
  ["GY", "Guyana", "592", 7, "3-4"],
  ["HT", "Haiti", "509", 8, "2-2-4"],
  ["HN", "Honduras", "504", 8, "4-4"],
  ["HK", "Hong Kong", "852", 8, "4-4"],
  ["HU", "Hungary", "36", 9, "2-3-4"],
  ["IS", "Iceland", "354", 7, "3-4"],
  ["IN", "India", "91", 10, "5-5"],
  ["ID", "Indonesia", "62", 11, "3-4-4"],
  ["IR", "Iran", "98", 10, "3-3-4"],
  ["IQ", "Iraq", "964", 10, "3-3-4"],
  ["IE", "Ireland", "353", 9, "2-3-4"],
  ["IM", "Isle of Man", "44", 10, "4-6"],
  ["IL", "Israel", "972", 9, "2-3-4"],
  ["IT", "Italy", "39", 10, "3-3-4"],
  ["JM", "Jamaica", "1", 10, "nanp"],
  ["JP", "Japan", "81", 10, "2-4-4"],
  ["JE", "Jersey", "44", 10, "4-6"],
  ["JO", "Jordan", "962", 9, "1-4-4"],
  ["KZ", "Kazakhstan", "7", 10, "3-3-4"],
  ["KE", "Kenya", "254", 9, "3-3-3"],
  ["KI", "Kiribati", "686", 8, "4-4"],
  ["XK", "Kosovo", "383", 8, "2-3-3"],
  ["KW", "Kuwait", "965", 8, "4-4"],
  ["KG", "Kyrgyzstan", "996", 9, "3-3-3"],
  ["LA", "Laos", "856", 10, "2-2-3-3"],
  ["LV", "Latvia", "371", 8, "2-3-3"],
  ["LB", "Lebanon", "961", 8, "2-3-3"],
  ["LS", "Lesotho", "266", 8, "2-2-4"],
  ["LR", "Liberia", "231", 8, "2-3-3"],
  ["LY", "Libya", "218", 9, "2-3-4"],
  ["LI", "Liechtenstein", "423", 7, "3-4"],
  ["LT", "Lithuania", "370", 8, "3-2-3"],
  ["LU", "Luxembourg", "352", 9, "3-3-3"],
  ["MO", "Macao", "853", 8, "4-4"],
  ["MG", "Madagascar", "261", 9, "2-2-5"],
  ["MW", "Malawi", "265", 9, "1-4-4"],
  ["MY", "Malaysia", "60", 10, "2-3-4"],
  ["MV", "Maldives", "960", 7, "3-4"],
  ["ML", "Mali", "223", 8, "2-2-4"],
  ["MT", "Malta", "356", 8, "4-4"],
  ["MH", "Marshall Islands", "692", 7, "3-4"],
  ["MQ", "Martinique", "596", 9, "3-2-2-2"],
  ["MR", "Mauritania", "222", 8, "2-2-4"],
  ["MU", "Mauritius", "230", 8, "4-4"],
  ["YT", "Mayotte", "262", 9, "3-2-2-2"],
  ["MX", "Mexico", "52", 10, "3-3-4"],
  ["FM", "Micronesia", "691", 7, "3-4"],
  ["MD", "Moldova", "373", 8, "4-4"],
  ["MC", "Monaco", "377", 8, "2-2-4"],
  ["MN", "Mongolia", "976", 8, "2-2-4"],
  ["ME", "Montenegro", "382", 8, "2-3-3"],
  ["MS", "Montserrat", "1", 10, "nanp"],
  ["MA", "Morocco", "212", 9, "1-2-2-4"],
  ["MZ", "Mozambique", "258", 9, "2-3-4"],
  ["MM", "Myanmar", "95", 9, "1-3-5"],
  ["NA", "Namibia", "264", 9, "2-3-4"],
  ["NR", "Nauru", "674", 7, "3-4"],
  ["NP", "Nepal", "977", 10, "2-4-4"],
  ["NL", "Netherlands", "31", 9, "1-4-4"],
  ["NC", "New Caledonia", "687", 6, "2-2-2"],
  ["NZ", "New Zealand", "64", 9, "2-3-4"],
  ["NI", "Nicaragua", "505", 8, "4-4"],
  ["NE", "Niger", "227", 8, "2-2-4"],
  ["NG", "Nigeria", "234", 10, "3-3-4"],
  ["NU", "Niue", "683", 4, "4"],
  ["NF", "Norfolk Island", "672", 6, "2-4"],
  ["KP", "North Korea", "850", 10, "3-3-4"],
  ["MK", "North Macedonia", "389", 8, "2-3-3"],
  ["MP", "Northern Mariana Islands", "1", 10, "nanp"],
  ["NO", "Norway", "47", 8, "3-2-3"],
  ["OM", "Oman", "968", 8, "4-4"],
  ["PK", "Pakistan", "92", 10, "3-7"],
  ["PW", "Palau", "680", 7, "3-4"],
  ["PS", "Palestine", "970", 9, "2-3-4"],
  ["PA", "Panama", "507", 8, "4-4"],
  ["PG", "Papua New Guinea", "675", 8, "3-2-3"],
  ["PY", "Paraguay", "595", 9, "3-3-3"],
  ["PE", "Peru", "51", 9, "3-3-3"],
  ["PH", "Philippines", "63", 10, "3-3-4"],
  ["PL", "Poland", "48", 9, "3-3-3"],
  ["PT", "Portugal", "351", 9, "3-3-3"],
  ["PR", "Puerto Rico", "1", 10, "nanp"],
  ["QA", "Qatar", "974", 8, "4-4"],
  ["RE", "Réunion", "262", 9, "3-2-2-2"],
  ["RO", "Romania", "40", 9, "3-3-3"],
  ["RU", "Russia", "7", 10, "3-3-4"],
  ["RW", "Rwanda", "250", 9, "3-3-3"],
  ["BL", "Saint Barthélemy", "590", 9, "3-2-2-2"],
  ["SH", "Saint Helena", "290", 4, "4"],
  ["KN", "Saint Kitts and Nevis", "1", 10, "nanp"],
  ["LC", "Saint Lucia", "1", 10, "nanp"],
  ["MF", "Saint Martin", "590", 9, "3-2-2-2"],
  ["PM", "Saint Pierre and Miquelon", "508", 6, "2-2-2"],
  ["VC", "Saint Vincent and the Grenadines", "1", 10, "nanp"],
  ["WS", "Samoa", "685", 7, "2-5"],
  ["SM", "San Marino", "378", 10, "3-3-4"],
  ["ST", "São Tomé and Príncipe", "239", 7, "3-4"],
  ["SA", "Saudi Arabia", "966", 9, "2-3-4"],
  ["SN", "Senegal", "221", 9, "2-3-4"],
  ["RS", "Serbia", "381", 9, "2-3-4"],
  ["SC", "Seychelles", "248", 7, "1-3-3"],
  ["SL", "Sierra Leone", "232", 8, "2-3-3"],
  ["SG", "Singapore", "65", 8, "4-4"],
  ["SX", "Sint Maarten", "1", 10, "nanp"],
  ["SK", "Slovakia", "421", 9, "3-3-3"],
  ["SI", "Slovenia", "386", 8, "2-3-3"],
  ["SB", "Solomon Islands", "677", 7, "3-4"],
  ["SO", "Somalia", "252", 8, "2-3-3"],
  ["ZA", "South Africa", "27", 9, "2-3-4"],
  ["KR", "South Korea", "82", 10, "2-4-4"],
  ["SS", "South Sudan", "211", 9, "3-3-3"],
  ["ES", "Spain", "34", 9, "3-3-3"],
  ["LK", "Sri Lanka", "94", 9, "2-3-4"],
  ["SD", "Sudan", "249", 9, "2-3-4"],
  ["SR", "Suriname", "597", 7, "3-4"],
  ["SE", "Sweden", "46", 9, "2-3-4"],
  ["CH", "Switzerland", "41", 9, "2-3-4"],
  ["SY", "Syria", "963", 9, "2-3-4"],
  ["TW", "Taiwan", "886", 9, "3-3-3"],
  ["TJ", "Tajikistan", "992", 9, "2-3-4"],
  ["TZ", "Tanzania", "255", 9, "3-3-3"],
  ["TH", "Thailand", "66", 9, "2-3-4"],
  ["TL", "Timor-Leste", "670", 8, "3-4"],
  ["TG", "Togo", "228", 8, "2-2-4"],
  ["TK", "Tokelau", "690", 4, "4"],
  ["TO", "Tonga", "676", 7, "3-4"],
  ["TT", "Trinidad and Tobago", "1", 10, "nanp"],
  ["TN", "Tunisia", "216", 8, "2-3-3"],
  ["TR", "Turkey", "90", 10, "3-3-4"],
  ["TM", "Turkmenistan", "993", 8, "1-3-4"],
  ["TC", "Turks and Caicos Islands", "1", 10, "nanp"],
  ["TV", "Tuvalu", "688", 6, "2-4"],
  ["UG", "Uganda", "256", 9, "3-3-3"],
  ["UA", "Ukraine", "380", 9, "2-3-4"],
  ["AE", "United Arab Emirates", "971", 9, "2-3-4"],
  ["GB", "United Kingdom", "44", 10, "4-6"],
  ["US", "United States", "1", 10, "nanp"],
  ["UY", "Uruguay", "598", 8, "1-3-4"],
  ["UZ", "Uzbekistan", "998", 9, "2-3-4"],
  ["VU", "Vanuatu", "678", 7, "3-4"],
  ["VA", "Vatican City", "39", 10, "3-3-4"],
  ["VE", "Venezuela", "58", 10, "3-3-4"],
  ["VN", "Vietnam", "84", 9, "2-3-4"],
  ["VI", "U.S. Virgin Islands", "1", 10, "nanp"],
  ["WF", "Wallis and Futuna", "681", 6, "2-2-2"],
  ["EH", "Western Sahara", "212", 9, "1-2-2-4"],
  ["YE", "Yemen", "967", 9, "1-3-5"],
  ["ZM", "Zambia", "260", 9, "2-3-4"],
  ["ZW", "Zimbabwe", "263", 9, "2-3-4"],
];

function makeFormatter(formatKey) {
  if (formatKey === "nanp") return formatNanp;
  const chunks = formatKey.split("-").map((n) => Number(n)).filter((n) => n > 0);
  return (d) => formatByChunks(d, chunks.length ? chunks : [3, 3, 4]);
}

function makePlaceholder(formatKey, maxDigits) {
  if (formatKey === "nanp") return "(555) 123-4567";
  const chunks = formatKey.split("-").map((n) => Number(n)).filter((n) => n > 0);
  let n = 1;
  const parts = [];
  for (const size of chunks) {
    let part = "";
    for (let i = 0; i < size && n <= maxDigits; i += 1, n += 1) {
      part += String((n % 10) || 0);
    }
    if (part) parts.push(part);
  }
  return parts.join(" ") || "123456789";
}

export const PHONE_COUNTRIES = RAW.map(([code, name, dial, maxDigits, formatKey]) => ({
  code,
  name,
  dial: String(dial),
  flag: flagEmoji(code),
  maxDigits,
  placeholder: makePlaceholder(formatKey, maxDigits),
  format: makeFormatter(formatKey),
})).sort((a, b) => a.name.localeCompare(b.name));

export function getPhoneCountry(code) {
  return PHONE_COUNTRIES.find((c) => c.code === code) || PHONE_COUNTRIES.find((c) => c.code === "PK");
}

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function normalizeNationalDigits(raw, country) {
  let d = digitsOnly(raw);
  if (d.startsWith("0")) d = d.slice(1);
  if (country?.dial && d.startsWith(country.dial)) d = d.slice(country.dial.length);
  return d.slice(0, country?.maxDigits || 15);
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
