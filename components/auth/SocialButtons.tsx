import { authSocial } from "./styles";

/** Google "G" in brand colours, locale-independent. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.78c.03 3.27 2.86 4.35 2.9 4.37-.02.07-.45 1.55-1.49 3.07-.9 1.32-1.83 2.62-3.3 2.65-1.44.03-1.9-.85-3.55-.85-1.64 0-2.16.82-3.52.88-1.42.05-2.5-1.43-3.41-2.74-1.86-2.69-3.28-7.6-1.37-10.92.95-1.64 2.64-2.68 4.48-2.71 1.39-.03 2.7.94 3.55.94.85 0 2.44-1.16 4.11-.99.7.03 2.66.28 3.92 2.13-.1.06-2.34 1.37-2.31 4.09M13.78 3.84c.75-.91 1.26-2.18 1.12-3.44-1.08.04-2.39.72-3.17 1.63-.7.8-1.31 2.09-1.15 3.32 1.21.09 2.45-.61 3.2-1.51" />
    </svg>
  );
}

/** Google + Apple, side by side from `sm` up. Not wired to a provider yet. */
export default function SocialButtons({ label }: { label: (provider: string) => string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" className={authSocial}>
        <GoogleIcon />
        <span className="sm:hidden">{label("Google")}</span>
        <span className="hidden sm:inline">Google</span>
      </button>
      <button type="button" className={authSocial}>
        <AppleIcon />
        <span className="sm:hidden">{label("Apple")}</span>
        <span className="hidden sm:inline">Apple</span>
      </button>
    </div>
  );
}
