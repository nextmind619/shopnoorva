"use client";

/**
 * Invisible bot protection fields.
 * Real users never see or fill these; automation often does.
 */
export function FraudHoneypotFields() {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor="company_website">Company website</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        defaultValue=""
      />
      <label htmlFor="fax_number">Fax</label>
      <input
        id="fax_number"
        name="fax_number"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        defaultValue=""
      />
    </div>
  );
}

export function readHoneypotFromForm(form: HTMLFormElement): string {
  const company = (form.elements.namedItem("company_website") as HTMLInputElement | null)?.value || "";
  const fax = (form.elements.namedItem("fax_number") as HTMLInputElement | null)?.value || "";
  return `${company}${fax}`.trim();
}
