"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

/**
 * Minimal client island: just the show/hide toggle. Everything else about the
 * auth forms stays server-rendered. The input still submits with the form.
 * Reused by both the login and signup pages.
 */
export default function PasswordInput({
  placeholder,
  id = "password",
  name = "password",
  autoComplete = "current-password",
  minLength = 6,
}: {
  placeholder: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const t = useTranslations("a11y");
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
        <Icon name="lock" size={18} />
      </span>
      <input
        id={id}
        type={show ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-11 text-[15px] text-ink shadow-[var(--shadow-subtle)] transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon name={show ? "eye-off" : "eye"} size={18} />
      </button>
    </div>
  );
}
