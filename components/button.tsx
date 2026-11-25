import Link from "next/link";

type Variant = "solid" | "ghost" | "line";

type Props = {
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  transitionTypes?: string[];
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  download?: boolean;
  ariaLabel?: string;
};

function isExternal(href: string) {
  return href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export function Button({
  href,
  variant = "solid",
  children,
  transitionTypes,
  className,
  onClick,
  type = "button",
  download,
  ariaLabel,
}: Props) {
  const cls = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  if (href && href.startsWith("#")) {
    return (
      <a className={cls} href={href} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  if (href && isExternal(href)) {
    const outbound = href.startsWith("http");
    return (
      <a
        className={cls}
        href={href}
        aria-label={ariaLabel}
        {...(outbound ? { target: "_blank", rel: "noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link className={cls} href={href} transitionTypes={transitionTypes} aria-label={ariaLabel} download={download}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
