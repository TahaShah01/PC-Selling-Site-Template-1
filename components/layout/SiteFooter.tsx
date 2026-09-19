import Link from "next/link";
import { Share2, Users, Play } from "lucide-react";
import { BUSINESS } from "../../data/business";
import { FOOTER_NAV } from "../../data/navigation";
import { Container } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — SITE FOOTER
───────────────────────────────────────────────────────── */

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--dc-bg-elevated)] border-t border-[var(--dc-border)] mt-auto"
      role="contentinfo"
    >
      {/* ─── MAIN FOOTER CONTENT ─── */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* ─── BRAND COLUMN ─── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 bg-[var(--dc-accent)] rounded-[var(--dc-radius-md)] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill="#080808" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-[var(--dc-text)] text-lg tracking-tight">
                daddu<span className="text-[var(--dc-accent)]">charger</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-[var(--dc-text-muted)] leading-relaxed max-w-xs mb-6">
              {BUSINESS.tagline}. Founded in Rawalpindi, Pakistan.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <SocialLink href="#" label="Instagram">
                <Share2 size={16} />
              </SocialLink>
              <SocialLink href="#" label="Facebook">
                <Users size={16} />
              </SocialLink>
              <SocialLink href="#" label="YouTube">
                <Play size={16} />
              </SocialLink>
            </div>
          </div>

          {/* ─── NAV COLUMNS ─── */}
          {Object.values(FOOTER_NAV).map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--dc-text-subtle)] mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors duration-[var(--dc-duration-fast)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* ─── BOTTOM BAR ─── */}
      <div className="border-t border-[var(--dc-border)]">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--dc-text-subtle)]">
              © {currentYear} {BUSINESS.legalName}. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--dc-text-subtle)]">
                Made with
              </span>
              <span className="text-[var(--dc-accent)] text-xs">⚡</span>
              <span className="text-xs text-[var(--dc-text-subtle)]">
                in Pakistan
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

/* ─── SOCIAL LINK ─── */
function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="h-9 w-9 flex items-center justify-center rounded-[var(--dc-radius-md)] bg-[var(--dc-surface)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface-2)] transition-colors duration-[var(--dc-duration-fast)]"
    >
      {children}
    </a>
  );
}
