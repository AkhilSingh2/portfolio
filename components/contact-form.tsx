"use client";

import { person } from "@/lib/site";

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
const action = endpoint || (web3Key ? "https://api.web3forms.com/submit" : "");

export function ContactForm() {
  return (
    <form
      className="contact-form"
      action={action || undefined}
      method="POST"
      onSubmit={(event) => {
        if (action) return;
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (String(data.get("company") || "")) return;
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const message = String(data.get("message") || "").trim();
        const subject = encodeURIComponent(name ? `Portfolio — ${name}` : "Portfolio");
        const body = encodeURIComponent(`From: ${name}${email ? ` <${email}>` : ""}\n\n${message}`);
        window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
      }}
    >
      {web3Key && !endpoint ? <input type="hidden" name="access_key" value={web3Key} /> : null}
      {web3Key && !endpoint ? <input type="hidden" name="subject" value="Portfolio note" /> : null}
      <p className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="field" htmlFor="contact-name">
        <span>Name</span>
        <input id="contact-name" name="name" autoComplete="name" required />
      </label>
      <label className="field" htmlFor="contact-email">
        <span>Email</span>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field" htmlFor="contact-message">
        <span>Message</span>
        <textarea id="contact-message" name="message" rows={6} required />
      </label>
      <button className="btn btn-solid" type="submit">
        {action ? "Send" : "Open email"}
      </button>
    </form>
  );
}
