export function LiveLink({ href, domain }: { href: string; domain?: string }) {
  return (
    <a className={domain ? "live-link has-domain" : "live-link"} href={href} target="_blank" rel="noreferrer" aria-label={domain ? `Open ${domain}` : "Open live site"}>
      {domain ? <span>{domain}</span> : null}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export function liveDomain(label?: string) {
  if (label === "onlinechalisa.com" || label === "mymirro.in") return label;
  return undefined;
}
