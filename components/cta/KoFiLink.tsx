"use client";

type KoFiLinkProps = {
  href?: string;
  variant?: "link" | "button";
};

export function KoFiLink({
  href = process.env.NEXT_PUBLIC_KO_FI_URL ?? "https://ko-fi.com/",
  variant = "link",
}: KoFiLinkProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

  if (variant === "button") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${baseStyles} bg-brand-primary px-4 py-2 text-white hover:bg-brand-secondary`}
      >
        Buy us a cuppa on Ko-fi
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${baseStyles} text-brand-primary underline-offset-2 hover:underline`}
    >
      Support on Ko-fi
    </a>
  );
}
