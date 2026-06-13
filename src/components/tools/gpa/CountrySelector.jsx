import { COUNTRIES } from "../../../services/gpa";

export default function CountrySelector({ value, onChange }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-text">Select your country</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COUNTRIES.map((country) => {
          const selected = value === country.code;
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onChange(country.code)}
              className={`cursor-pointer rounded-xl border-2 bg-white p-4 text-left transition-all hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selected ? "border-primary bg-primary/5 shadow-sm" : "border-border"
              }`}
              aria-pressed={selected}
            >
              <span className="text-2xl" aria-hidden>
                {country.flag}
              </span>
              <span className="mt-2 block text-sm font-semibold text-text">{country.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
