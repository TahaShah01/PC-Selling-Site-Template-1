import Link from "next/link";
import { BUSINESS } from "../../data/business";
import { FOOTER_NAV } from "../../data/navigation";
import { Container } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   SITE FOOTER
   Labelled columns, hairline rules, no cards.
───────────────────────────────────────────────────────── */

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[var(--dc-bg-elevated)] border-t border-[var(--dc-border)] mt-auto relative z-10"
      role="contentinfo"
    >
      <Container className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
          {Object.values(FOOTER_NAV).map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-medium text-[var(--dc-text-subtle)] mb-5">
                {group.title}
              </h2>
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

          <div>
            <h2 className="text-xs font-medium text-[var(--dc-text-subtle)] mb-5">
              Visit
            </h2>
            <address className="not-italic text-sm text-[var(--dc-text-muted)] leading-relaxed">
              {BUSINESS.city}, Pakistan
            </address>
          </div>

          <div>
            <h2 className="text-xs font-medium text-[var(--dc-text-subtle)] mb-5">
              Follow
            </h2>
            <ul className="space-y-3">
              {[
                { label: "Instagram", href: "#" },
                { label: "Facebook", href: "#" },
                { label: "YouTube", href: "#" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors duration-[var(--dc-duration-fast)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="pb-10">
        <p className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,12vw,9rem)] leading-[0.85] tracking-[-0.05em] border-t border-[var(--dc-border)] pt-8">
          daddu<span className="text-[var(--dc-accent)]">charger</span>
        </p>
      </Container>

      <div className="border-t border-[var(--dc-border)]">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--dc-text-subtle)]">
            © {year} {BUSINESS.legalName}
          </p>
          <p className="text-xs text-[var(--dc-text-subtle)]">
            {BUSINESS.tagline}
          </p>
        </Container>
      </div>
    </footer>
  );
}