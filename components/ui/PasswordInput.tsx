"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import { authIcon, authInput } from "@/components/auth/styles";
import { cn } from "@/lib/cn";

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
      <input
        id={id}
        type={show ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        placeholder={placeholder}
        className={cn(authInput, "pr-12")}
      />
      {/* After the input so `peer-focus` can tint it */}
      <span className={authIcon}>
        <Icon name="lock" size={18} />
      </span>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[10px] text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon name={show ? "eye-off" : "eye"} size={18} />
      </button>
    </div>
  );
}
