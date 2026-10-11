"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { company, sectors, serviceOptions, type ServiceValue } from "@/lib/site";

type Fields = {
  service: ServiceValue;
  premises: string;
  city: "Abuja" | "Lagos" | "Other";
  address: string;
  date: string;
  name: string;
  organisation: string;
  phone: string;
  details: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const isService = (value: string | null): value is ServiceValue =>
  serviceOptions.some((option) => option.value === value);

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Enter your name so we know who to ask for.";
  if (!/^[+\d][\d\s()-]{6,}$/.test(fields.phone.trim())) {
    errors.phone = "Enter a phone number we can call, for example 0803 704 1918.";
  }
  if (!fields.address.trim()) errors.address = "Enter the area or address of the site.";
  return errors;
}

/** Turns the form into the plain-text email the office receives. */
function buildEmail(fields: Fields) {
  const service = serviceOptions.find((option) => option.value === fields.service)?.label ?? fields.service;
  const lines = [
    `Service: ${service}`,
    `Type of premises: ${fields.premises}`,
    `Location: ${fields.address.trim()} (${fields.city})`,
    `Preferred date: ${fields.date || "Flexible"}`,
    "",
    `Name: ${fields.name.trim()}`,
    fields.organisation.trim() ? `Organisation: ${fields.organisation.trim()}` : null,
    `Phone: ${fields.phone.trim()}`,
    "",
    fields.details.trim() ? `Details:\n${fields.details.trim()}` : null,
  ].filter((line): line is string => line !== null);

  return {
    subject: `Booking request: ${service}, ${fields.city}`,
    body: lines.join("\n"),
  };
}

export function BookingForm() {
  const params = useSearchParams();
  const requested = params.get("service");
  const formId = useId();

  const [fields, setFields] = useState<Fields>({
    service: isService(requested) ? requested : "fumigation",
    premises: sectors[0],
    city: "Abuja",
    address: "",
    date: "",
    name: "",
    organisation: "",
    phone: "",
    details: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

  const set = <Key extends keyof Fields>(key: Key, value: Fields[Key]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setOpened(false);
  };

  const id = (name: keyof Fields) => `${formId}-${name}`;
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);

    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }

    // There is no server behind this form yet. It writes the email for the
    // visitor and hands it to their own mail app, which is honest about what
    // happens and needs no backend. See README for swapping in a real endpoint.
    const { subject, body } = buildEmail(fields);
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <fieldset className="form-group">
        <legend>What you need</legend>

        <div className="field">
          <label htmlFor={id("service")}>Service</label>
          <select id={id("service")} value={fields.service} onChange={(e) => set("service", e.target.value as ServiceValue)}>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor={id("premises")}>Type of premises</label>
          <select id={id("premises")} value={fields.premises} onChange={(e) => set("premises", e.target.value)}>
            {sectors.map((sector) => (
              <option key={sector}>{sector}</option>
            ))}
            <option>Other</option>
          </select>
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>Where and when</legend>

        <div className="field">
          <span className="field-label" id={`${formId}-city-label`}>
            Nearest office
          </span>
          <div className="segmented" role="radiogroup" aria-labelledby={`${formId}-city-label`}>
            {(["Abuja", "Lagos", "Other"] as const).map((city) => (
              <label key={city} className="segmented-option">
                <input
                  type="radio"
                  name={`${formId}-city`}
                  value={city}
                  checked={fields.city === city}
                  onChange={() => set("city", city)}
                />
                <span>{city === "Other" ? "Somewhere else" : city}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor={id("address")}>Area or address of the site</label>
          <input
            id={id("address")}
            type="text"
            autoComplete="street-address"
            value={fields.address}
            onChange={(e) => set("address", e.target.value)}
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? `${id("address")}-error` : undefined}
          />
          {errors.address ? (
            <p className="field-error" id={`${id("address")}-error`}>
              {errors.address}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={id("date")}>
            Preferred date <span className="optional">optional</span>
          </label>
          <input id={id("date")} type="date" min={today} value={fields.date} onChange={(e) => set("date", e.target.value)} />
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend>How to reach you</legend>

        <div className="field">
          <label htmlFor={id("name")}>Your name</label>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
          />
          {errors.name ? (
            <p className="field-error" id={`${id("name")}-error`}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={id("organisation")}>
            Organisation <span className="optional">optional</span>
          </label>
          <input
            id={id("organisation")}
            type="text"
            autoComplete="organization"
            value={fields.organisation}
            onChange={(e) => set("organisation", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor={id("phone")}>Phone number</label>
          <input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id("phone")}-error` : undefined}
          />
          {errors.phone ? (
            <p className="field-error" id={`${id("phone")}-error`}>
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={id("details")}>
            Anything we should know <span className="optional">optional</span>
          </label>
          <textarea
            id={id("details")}
            rows={4}
            value={fields.details}
            onChange={(e) => set("details", e.target.value)}
          />
        </div>
      </fieldset>

      <div className="form-submit">
        <button type="submit" className="btn btn-primary">
          Write my booking email
        </button>
        <p className="form-hint">Opens your email app with the request filled in. You press send.</p>
      </div>

      <div role="status" aria-live="polite">
        {opened ? (
          <p className="form-status">
            Your email app should now show the request, ready to send. Nothing opened? Email{" "}
            <a href={`mailto:${company.email}`} className="break-anywhere">
              {company.email}
            </a>{" "}
            or call <a href={company.phones[0].href}>{company.phones[0].display}</a>.
          </p>
        ) : null}
      </div>
    </form>
  );
}
