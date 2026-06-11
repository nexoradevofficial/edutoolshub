import { useCallback, useId, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Button from "../ui/Button";
import { IconPlus, IconTrash } from "../icons/ToolIcons";

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const sectionClass =
  "rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "PKR", symbol: "Rs", label: "PKR — Pakistani Rupee" },
  { code: "AUD", symbol: "A$", label: "AUD — Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "CAD — Canadian Dollar" },
];

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Online", "Cheque"];
const PAYMENT_STATUSES = ["Paid", "Partial", "Pending"];

const STATUS_STYLES = {
  Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Partial: "bg-amber-100 text-amber-800 border-amber-200",
  Pending: "bg-red-100 text-red-800 border-red-200",
};

let subjectIdCounter = 1;

function createSubjectRow() {
  return { id: subjectIdCounter++, name: "", amount: "" };
}

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseAmount(value) {
  const n = parseFloat(String(value).replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function formatMoney(amount, symbol) {
  const n = Number(amount) || 0;
  return `${symbol}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ToggleGroup({ options, value, onChange, name }) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface-muted p-1"
      role="group"
      aria-label={name}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-primary shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, htmlFor, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FeeReceiptGenerator() {
  const uid = useId();
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [receiptNumber, setReceiptNumber] = useState(
    () => `REC-${Date.now().toString().slice(-6)}`
  );
  const [receiptDate, setReceiptDate] = useState(() => formatDateInput(new Date()));
  const [footerText, setFooterText] = useState(
    "This is a computer-generated receipt and does not require a physical signature."
  );

  const [signatureMode, setSignatureMode] = useState("text");
  const [signatureText, setSignatureText] = useState("Authorized Signatory");
  const [signatureImage, setSignatureImage] = useState("");

  const [studentName, setStudentName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [section, setSection] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [subjects, setSubjects] = useState(() => [
    createSubjectRow(),
    createSubjectRow(),
  ]);

  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxLabel, setTaxLabel] = useState("GST");
  const [taxPercent, setTaxPercent] = useState("");

  const [discountMode, setDiscountMode] = useState("flat");
  const [discountValue, setDiscountValue] = useState("");

  const [currencyCode, setCurrencyCode] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [dueDate, setDueDate] = useState("");

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0],
    [currencyCode]
  );

  const totals = useMemo(() => {
    const subtotal = subjects.reduce(
      (sum, row) => sum + parseAmount(row.amount),
      0
    );

    const rawDiscount = parseAmount(discountValue);
    let discountAmount = 0;
    if (discountMode === "percent") {
      discountAmount = subtotal * (Math.min(rawDiscount, 100) / 100);
    } else {
      discountAmount = Math.min(rawDiscount, subtotal);
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);

    const taxRate = parseAmount(taxPercent);
    const taxAmount = taxEnabled ? afterDiscount * (taxRate / 100) : 0;

    const grandTotal = afterDiscount + taxAmount;

    return { subtotal, discountAmount, afterDiscount, taxAmount, grandTotal };
  }, [subjects, discountMode, discountValue, taxEnabled, taxPercent]);

  const addSubject = useCallback(() => {
    setSubjects((prev) => [...prev, createSubjectRow()]);
  }, []);

  const removeSubject = useCallback((id) => {
    setSubjects((prev) =>
      prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)
    );
  }, []);

  const updateSubject = useCallback((id, field, value) => {
    setSubjects((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }, []);

  const handleSignatureUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => setSignatureImage(String(reader.result ?? ""));
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const downloadPdf = useCallback(async () => {
    const element = receiptRef.current;
    if (!element || downloading) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const safeName = (receiptNumber || "fee-receipt").replace(/[^\w-]+/g, "_");
      pdf.save(`${safeName}.pdf`);
    } finally {
      setDownloading(false);
    }
  }, [downloading, receiptNumber]);

  const sym = currency.symbol;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-accent/5 p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-text">How this tool works</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Fill in school and student details, add subject-wise fees, and optionally
          apply discounts or tax. The receipt preview updates live — download a
          polished PDF when you are ready to share with parents or keep for your
          records.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* School / Teacher */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-semibold text-text">
              School &amp; teacher details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="School name" htmlFor={`${uid}-school`}>
                <input
                  id={`${uid}-school`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Greenwood High School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </Field>
              <Field label="Teacher name" htmlFor={`${uid}-teacher`}>
                <input
                  id={`${uid}-teacher`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Ms. Sarah Johnson"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </Field>
              <Field label="Receipt number" htmlFor={`${uid}-receipt-no`}>
                <input
                  id={`${uid}-receipt-no`}
                  type="text"
                  className={inputClass}
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                />
              </Field>
              <Field label="Date" htmlFor={`${uid}-date`}>
                <input
                  id={`${uid}-date`}
                  type="date"
                  className={inputClass}
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-text">Authorized signature</p>
              <ToggleGroup
                name="Signature mode"
                value={signatureMode}
                onChange={setSignatureMode}
                options={[
                  { value: "text", label: "Text placeholder" },
                  { value: "upload", label: "Upload image" },
                ]}
              />
              {signatureMode === "text" ? (
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Authorized Signatory"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center rounded-xl border border-border bg-surface-muted px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary/40">
                      Choose image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleSignatureUpload}
                    />
                  </label>
                  {signatureImage && (
                    <button
                      type="button"
                      onClick={() => setSignatureImage("")}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            <Field
              label="Receipt footer text"
              htmlFor={`${uid}-footer`}
              className="mt-4"
            >
              <textarea
                id={`${uid}-footer`}
                rows={2}
                className={inputClass}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
              />
            </Field>
          </section>

          {/* Student */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-semibold text-text">
              Student details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Student name" htmlFor={`${uid}-student`}>
                <input
                  id={`${uid}-student`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Ali Khan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </Field>
              <Field label="Class / grade" htmlFor={`${uid}-class`}>
                <input
                  id={`${uid}-class`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Grade 8"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                />
              </Field>
              <Field label="Section" htmlFor={`${uid}-section`}>
                <input
                  id={`${uid}-section`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </Field>
              <Field label="Parent / guardian name" htmlFor={`${uid}-parent`}>
                <input
                  id={`${uid}-parent`}
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Mr. Khan"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </Field>
              <Field
                label="Contact number"
                htmlFor={`${uid}-contact`}
                className="sm:col-span-2"
              >
                <input
                  id={`${uid}-contact`}
                  type="tel"
                  className={inputClass}
                  placeholder="e.g. +1 555 123 4567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Subjects */}
          <section className={sectionClass}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-text">Subject-wise fees</h3>
              <Button variant="secondary" size="sm" onClick={addSubject}>
                <IconPlus className="h-4 w-4" />
                Add subject
              </Button>
            </div>

            <div className="space-y-3">
              <div className="hidden gap-3 text-xs font-medium uppercase tracking-wide text-text-muted sm:grid sm:grid-cols-[1fr_140px_40px]">
                <span>Subject</span>
                <span>Amount ({currency.code})</span>
                <span className="sr-only">Remove</span>
              </div>

              {subjects.map((row) => (
                <div
                  key={row.id}
                  className="grid gap-2 rounded-xl border border-border/60 bg-surface-muted/50 p-3 sm:grid-cols-[1fr_140px_40px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <div>
                    <label className="mb-1 block text-xs text-text-muted sm:sr-only">
                      Subject name
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Mathematics"
                      value={row.name}
                      onChange={(e) =>
                        updateSubject(row.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted sm:sr-only">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                        {sym}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${inputClass} pl-8`}
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(e) =>
                          updateSubject(row.id, "amount", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(row.id)}
                    disabled={subjects.length <= 1}
                    className="flex h-10 w-10 items-center justify-center self-end rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 sm:self-center"
                    aria-label="Remove subject"
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Discount & Tax */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-semibold text-text">
              Discount &amp; tax
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-text">Discount</p>
                <ToggleGroup
                  name="Discount mode"
                  value={discountMode}
                  onChange={setDiscountMode}
                  options={[
                    { value: "flat", label: "Flat amount" },
                    { value: "percent", label: "Percentage (%)" },
                  ]}
                />
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <div className="min-w-[140px] flex-1">
                    <label className="mb-1 block text-xs text-text-muted">
                      {discountMode === "percent" ? "Discount %" : `Amount (${sym})`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step={discountMode === "percent" ? "0.1" : "0.01"}
                      max={discountMode === "percent" ? "100" : undefined}
                      className={inputClass}
                      placeholder={discountMode === "percent" ? "e.g. 10" : "0.00"}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>
                  {parseAmount(discountValue) > 0 && (
                    <p className="text-sm text-text-muted">
                      Discount:{" "}
                      <span className="font-semibold text-emerald-700">
                        −{formatMoney(totals.discountAmount, sym)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                    checked={taxEnabled}
                    onChange={(e) => setTaxEnabled(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-text">Apply tax</span>
                </label>

                {taxEnabled && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field label="Tax type label" htmlFor={`${uid}-tax-label`}>
                      <input
                        id={`${uid}-tax-label`}
                        type="text"
                        className={inputClass}
                        placeholder="e.g. GST, VAT"
                        value={taxLabel}
                        onChange={(e) => setTaxLabel(e.target.value)}
                      />
                    </Field>
                    <Field label="Tax percentage (%)" htmlFor={`${uid}-tax-pct`}>
                      <input
                        id={`${uid}-tax-pct`}
                        type="number"
                        min="0"
                        step="0.1"
                        className={inputClass}
                        placeholder="e.g. 15"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                      />
                    </Field>
                    {parseAmount(taxPercent) > 0 && (
                      <p className="text-sm text-text-muted sm:col-span-2">
                        {taxLabel || "Tax"}:{" "}
                        <span className="font-semibold text-text">
                          {formatMoney(totals.taxAmount, sym)}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Currency & Payment */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-semibold text-text">
              Currency &amp; payment
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Currency" htmlFor={`${uid}-currency`}>
                <select
                  id={`${uid}-currency`}
                  className={inputClass}
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment method" htmlFor={`${uid}-method`}>
                <select
                  id={`${uid}-method`}
                  className={inputClass}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
              <div>
                <p className="mb-2 text-sm font-medium text-text">Payment status</p>
                <ToggleGroup
                  name="Payment status"
                  value={paymentStatus}
                  onChange={setPaymentStatus}
                  options={PAYMENT_STATUSES.map((s) => ({
                    value: s,
                    label: s,
                  }))}
                />
              </div>
              <Field label="Due date (optional)" htmlFor={`${uid}-due`}>
                <input
                  id={`${uid}-due`}
                  type="date"
                  className={inputClass}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
            </div>

            <div
              className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4"
              aria-live="polite"
            >
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>{formatMoney(totals.subtotal, sym)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>−{formatMoney(totals.discountAmount, sym)}</span>
                  </div>
                )}
                {taxEnabled && totals.taxAmount > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>
                      {taxLabel || "Tax"} ({taxPercent || 0}%)
                    </span>
                    <span>{formatMoney(totals.taxAmount, sym)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-primary/20 pt-2 text-base font-bold text-text">
                  <span>Grand total</span>
                  <span>{formatMoney(totals.grandTotal, sym)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Preview */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <section className={`${sectionClass} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-text">Receipt preview</h3>
              <Button
                variant="accent"
                size="sm"
                onClick={downloadPdf}
                disabled={downloading}
              >
                {downloading ? "Generating…" : "Download PDF"}
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/30 p-2">
              <div
                ref={receiptRef}
                className="mx-auto w-full max-w-[360px] bg-white p-6 text-text shadow-sm"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {/* Header */}
                <div className="border-b-2 border-text/80 pb-4 text-center">
                  <h4 className="text-lg font-bold uppercase tracking-wide">
                    {schoolName || "School Name"}
                  </h4>
                  <p className="mt-1 text-xs uppercase tracking-widest text-text-muted">
                    Fee Receipt
                  </p>
                </div>

                {/* Meta row */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>
                    <span className="text-text-muted">Receipt No.</span>
                    <p className="font-semibold">{receiptNumber || "—"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted">Date</span>
                    <p className="font-semibold">{formatDisplayDate(receiptDate)}</p>
                  </div>
                  {teacherName && (
                    <div className="col-span-2">
                      <span className="text-text-muted">Issued by</span>
                      <p className="font-semibold">{teacherName}</p>
                    </div>
                  )}
                </div>

                {/* Student block */}
                <div className="mt-4 rounded border border-border/60 bg-surface-muted/40 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div>
                      <span className="text-text-muted">Student</span>
                      <p className="font-semibold">{studentName || "—"}</p>
                    </div>
                    <div>
                      <span className="text-text-muted">Class</span>
                      <p className="font-semibold">
                        {[classGrade, section && `Sec ${section}`]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                    {parentName && (
                      <div>
                        <span className="text-text-muted">Parent / Guardian</span>
                        <p className="font-semibold">{parentName}</p>
                      </div>
                    )}
                    {contactNumber && (
                      <div>
                        <span className="text-text-muted">Contact</span>
                        <p className="font-semibold">{contactNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items table */}
                <table className="mt-4 w-full text-xs">
                  <thead>
                    <tr className="border-b border-text/30">
                      <th className="py-2 text-left font-semibold">Subject</th>
                      <th className="py-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((row) => (
                      <tr key={row.id} className="border-b border-border/40">
                        <td className="py-2">{row.name || "—"}</td>
                        <td className="py-2 text-right">
                          {formatMoney(parseAmount(row.amount), sym)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span>{formatMoney(totals.subtotal, sym)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount</span>
                      <span>−{formatMoney(totals.discountAmount, sym)}</span>
                    </div>
                  )}
                  {taxEnabled && totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>
                        {taxLabel} ({taxPercent}%)
                      </span>
                      <span>{formatMoney(totals.taxAmount, sym)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-text/40 pt-2 text-sm font-bold">
                    <span>Grand Total</span>
                    <span>{formatMoney(totals.grandTotal, sym)}</span>
                  </div>
                </div>

                {/* Payment info */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
                  <div>
                    <span className="text-text-muted">Payment</span>
                    <p className="font-semibold">{paymentMethod}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[paymentStatus]}`}
                  >
                    {paymentStatus}
                  </span>
                </div>
                {dueDate && paymentStatus !== "Paid" && (
                  <p className="mt-1 text-xs text-text-muted">
                    Due by: {formatDisplayDate(dueDate)}
                  </p>
                )}

                {/* Signature */}
                <div className="mt-8 text-center">
                  {signatureMode === "upload" && signatureImage ? (
                    <img
                      src={signatureImage}
                      alt="Authorized signature"
                      className="mx-auto h-12 max-w-[160px] object-contain"
                    />
                  ) : (
                    <div className="mx-auto w-40 border-t border-text/50 pt-1">
                      <p className="text-[10px] text-text-muted">
                        {signatureText || "Authorized Signatory"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {footerText && (
                  <p className="mt-6 border-t border-border/40 pt-3 text-center text-[10px] leading-relaxed text-text-muted">
                    {footerText}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
