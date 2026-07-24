"use client";

/**
 * Invisible bot protection fields.
 * Real users never see or fill these; automation often does.
 *
 * Important: avoid autofill-friendly names (company, fax, website, email…).
 * Chrome often ignores autocomplete="off" on those and fills honeypots,
 * which false-positives real customers and auto-blacklists their phone.
 */
const HP_NAME_A = "nrv_meta_ref";
const HP_NAME_B = "nrv_confirm_token";

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
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <label htmlFor={HP_NAME_A}>Reference</label>
      <input
        id={HP_NAME_A}
        name={HP_NAME_A}
        type="text"
        autoComplete="one-time-code"
        tabIndex={-1}
        defaultValue=""
        readOnly
        data-hp="1"
      />
      <label htmlFor={HP_NAME_B}>Token</label>
      <input
        id={HP_NAME_B}
        name={HP_NAME_B}
        type="text"
        autoComplete="one-time-code"
        tabIndex={-1}
        defaultValue=""
        readOnly
        data-hp="1"
      />
    </div>
  );
}

export function readHoneypotFromForm(form: HTMLFormElement): string {
  const a = (form.elements.namedItem(HP_NAME_A) as HTMLInputElement | null)?.value || "";
  const b = (form.elements.namedItem(HP_NAME_B) as HTMLInputElement | null)?.value || "";
  return `${a}${b}`.trim();
}
