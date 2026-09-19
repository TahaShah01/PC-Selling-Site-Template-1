"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { cn } from "../../lib/utils";
import { PRIMARY_NAV } from "../../data/navigation";
import type { NavItem } from "../../data/navigation";
import { useCartStore } from "@/lib/store/cart";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useCursor } from "../motion/Cursor";
import { Magnetic } from "../motion/Reveal";
import { useScrollLock } from "../providers/SmoothScrollProvider";
import { EASE } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   SITE HEADER

   Fixes from the previous pass:
   • the full-screen menu used to close the instant your
     pointer left the 80px header — i.e. the moment you moved
     down to actually click a category. Closing is now
     debounced across a shared hover zone (header + overlay),
     so crossing the gap between them no longer kills it.
   • scroll locking now goes through Lenis (useScrollLock)
     instead of hand-toggling documentElement.overflow, so the
     page can't double-scroll under an open overlay.
   • mobile had no way to reach anything with children — Shop
     was simply missing on phones. It now drills down into a
     second full-screen level with a back control.
   • trigger buttons carry aria-expanded / aria-haspopup.
───────────────────────────────────────────────────────── */

const CLOSE_DELAY = 180;

export function SiteHeader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const cursor = useCursor();

  const [hidden, setHidden] = React.useState(false);
  const [solid, setSolid] = React.useState(false);
  const [menu, setMenu] = React.useState<NavItem | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileLevel, setMobileLevel] = React.useState<NavItem | null>(null);

  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.cart.itemCount);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const setIsCartOpen = useCartStore((s) => s.setIsOpen);

  const { scrollY } = useScroll();
  const last = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 40);
    if (menu || mobileOpen) return;
    const delta = y - last.current;
    if (y > 320 && delta > 4) setHidden(true);
    else if (delta < -4) setHidden(false);
    last.current = y;
  });

  const openMenu = React.useCallback((item: NavItem) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(item);
  }, []);

  const scheduleClose = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), CLOSE_DELAY);
  }, []);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  React.useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Close everything on navigation
  React.useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
    setMobileLevel(null);
  }, [pathname]);

  // Escape closes whatever is open
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      if (mobileLevel) setMobileLevel(null);
      else setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileLevel]);

  const overlayOpen = Boolean(menu) || mobileOpen;
  useScrollLock(overlayOpen);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !reduced ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE.out }}
        className={cn(
          "fixed inset-x-0 top-0 z-[var(--dc-z-sticky)]",
          "transition-[background-color,border-color,backdrop-filter] duration-500",
          solid && !overlayOpen
            ? "border-b border-[var(--dc-border)] bg-[rgba(8,8,8,0.72)] backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="dc-gutter flex h-[var(--dc-header-height)] items-center justify-between gap-6">
          {/* ── LOGO ── */}
          <Link
            href="/"
            aria-label="Daddu Charger — home"
            className="flex shrink-0 items-center gap-2.5"
            onMouseEnter={() => {
              cancelClose();
              setMenu(null);
              cursor.set("hover");
            }}
            onMouseLeave={cursor.reset}
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--dc-radius-md)] bg-[var(--dc-accent)]">
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                whileHover={reduced ? undefined : { rotate: -12, scale: 1.15 }}
                transition={{ duration: 0.5, ease: EASE.spring }}
              >
                <path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill="var(--dc-accent-text)" strokeLinejoin="round" />
              </motion.svg>
            </span>
            <span className="font-display text-lg font-bold leading-none tracking-[-0.03em] text-[var(--dc-text)]">
              daddu<span className="text-[var(--dc-accent)]">charger</span>
            </span>
          </Link>

          {/* ── NAV ── */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const active =
                  pathname === item.href ||
                  (hasChildren && pathname.startsWith(item.href + "/"));

                if (item.isHighlighted) {
                  return (
                    <li key={item.href} className="ml-3">
                      <Magnetic strength={0.3}>
                        <Link
                          href={item.href}
                          onMouseEnter={() => {
                            cancelClose();
                            setMenu(null);
                            cursor.set("hover");
                          }}
                          onMouseLeave={cursor.reset}
                          className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-[var(--dc-accent)] px-5 text-sm font-semibold text-[var(--dc-accent-text)]"
                        >
                          <span className="relative z-10">{item.label}</span>
                          <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                        </Link>
                      </Magnetic>
                    </li>
                  );
                }

                return (
                  <li key={item.href} onMouseEnter={() => hasChildren && openMenu(item)}>
                    <NavLabel
                      href={item.href}
                      label={item.label}
                      active={active || menu?.href === item.href}
                      hasChildren={hasChildren}
                      expanded={menu?.href === item.href}
                      onClick={() => hasChildren && (menu?.href === item.href ? setMenu(null) : openMenu(item))}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── ACTIONS ── */}
          <div className="flex shrink-0 items-center gap-1">
            <IconLink href="/search" label="Search">
              <Search size={18} />
            </IconLink>
            <IconLink href="/wishlist" label="Wishlist" className="hidden sm:inline-flex">
              <Heart size={18} />
            </IconLink>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              onMouseEnter={() => {
                cancelClose();
                setMenu(null);
                cursor.set("hover");
              }}
              onMouseLeave={cursor.reset}
              className="relative flex h-10 items-center gap-2 rounded-full px-3 text-[var(--dc-text-muted)] transition-colors hover:text-[var(--dc-text)]"
            >
              <ShoppingBag size={18} />
              <AnimatePresence initial={false}>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE.spring }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dc-accent)] px-1 text-[11px] font-bold leading-none text-[var(--dc-accent-text)] tabular-nums"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Burger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="dc-mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onMouseEnter={() => cursor.set("hover")}
              onMouseLeave={cursor.reset}
              className="ml-1 flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full lg:hidden"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE.out }}
                className="block h-px w-5 bg-[var(--dc-text)]"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.4, ease: EASE.out }}
                className="block h-px w-5 bg-[var(--dc-text)]"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── FULL-SCREEN MEGA MENU (desktop) ──
          Shares the same hover zone as the header via
          openMenu/scheduleClose/cancelClose, so moving the
          pointer from the nav link, through the gap, into
          this panel never triggers a close. */}
      <AnimatePresence>
        {menu && (
          <motion.div
            key={menu.href}
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.65, ease: EASE.out }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="fixed inset-0 z-[var(--dc-z-overlay)] hidden bg-[var(--dc-bg-elevated)] lg:block"
          >
            <div className="dc-gutter flex h-full flex-col justify-center pt-[var(--dc-header-height)]">
              <p className="mb-10 text-xs text-[var(--dc-text-subtle)]">{menu.label}</p>
              <ul className="grid grid-cols-2 gap-x-12 xl:grid-cols-3">
                {menu.children!.map((child, i) => (
                  <li key={child.href} className="overflow-hidden border-t border-[var(--dc-border)]">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%", transition: { duration: 0.3 } }}
                      transition={{ duration: 0.8, ease: EASE.out, delay: 0.1 + i * 0.045 }}
                    >
                      <Link
                        href={child.href}
                        onMouseEnter={() => cursor.set("view", "Open")}
                        onMouseLeave={cursor.reset}
                        className="group flex items-baseline justify-between gap-4 py-5"
                      >
                        <span className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--dc-text)] transition-colors duration-300 group-hover:text-[var(--dc-accent)]">
                          {child.label}
                        </span>
                        <span className="text-xs tabular-nums text-[var(--dc-text-subtle)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FULL-SCREEN MOBILE MENU — two levels ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="dc-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.75, ease: EASE.out }}
            className="fixed inset-0 z-[var(--dc-z-overlay)] overflow-hidden bg-[var(--dc-bg-elevated)] lg:hidden"
          >
            <div className="relative h-full overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {!mobileLevel ? (
                  <motion.div
                    key="level-0"
                    initial={{ x: "-30%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "-30%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                    className="dc-gutter flex min-h-full flex-col justify-between pb-10 pt-[calc(var(--dc-header-height)+2rem)]"
                  >
                    <ul>
                      {PRIMARY_NAV.map((item, i) => {
                        const hasChildren = Boolean(item.children?.length);
                        return (
                          <li key={item.href} className="overflow-hidden border-b border-[var(--dc-border)]">
                            <motion.div
                              initial={{ y: "110%", opacity: 0 }}
                              animate={{ y: "0%", opacity: 1 }}
                              transition={{ duration: 0.7, ease: EASE.out, delay: 0.15 + i * 0.06 }}
                            >
                              {hasChildren ? (
                                <button
                                  type="button"
                                  onClick={() => setMobileLevel(item)}
                                  className="flex w-full items-baseline justify-between py-5 text-left"
                                >
                                  <span className="font-display text-[clamp(2rem,9vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-[var(--dc-text)]">
                                    {item.label}
                                  </span>
                                  <span className="text-xs tabular-nums text-[var(--dc-text-subtle)]">
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                </button>
                              ) : (
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-baseline justify-between py-5"
                                >
                                  <span className="font-display text-[clamp(2rem,9vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-[var(--dc-text)]">
                                    {item.label}
                                  </span>
                                  <span className="text-xs tabular-nums text-[var(--dc-text-subtle)]">
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                </Link>
                              )}
                            </motion.div>
                          </li>
                        );
                      })}
                    </ul>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--dc-text-muted)]"
                    >
                      <Link href="/search" onClick={() => setMobileOpen(false)}>Search</Link>
                      <Link href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                      <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                      <span className="text-[var(--dc-text-subtle)]">Rawalpindi, PK</span>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mobileLevel.href}
                    initial={{ x: "30%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "30%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                    className="dc-gutter flex min-h-full flex-col pb-10 pt-[calc(var(--dc-header-height)+1.5rem)]"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileLevel(null)}
                      className="mb-8 flex items-center gap-2 text-sm text-[var(--dc-text-muted)]"
                    >
                      <ArrowLeft size={16} />
                      {mobileLevel.label}
                    </button>

                    <ul>
                      {mobileLevel.children!.map((child, i) => (
                        <li key={child.href} className="overflow-hidden border-b border-[var(--dc-border)]">
                          <motion.div
                            initial={{ y: "60%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            transition={{ duration: 0.55, ease: EASE.out, delay: i * 0.05 }}
                          >
                            <Link
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-baseline justify-between py-5"
                            >
                              <span className="font-display text-[clamp(1.5rem,6vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--dc-text)]">
                                {child.label}
                              </span>
                              <span className="text-xs tabular-nums text-[var(--dc-text-subtle)]">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </Link>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

/* ─── Nav label with hover swap ─── */
function NavLabel({
  href,
  label,
  active,
  hasChildren,
  expanded,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  hasChildren: boolean;
  expanded: boolean;
  onClick?: () => void;
}) {
  const cursor = useCursor();

  const inner = (
    <span className="relative block h-5 overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute inset-0 block translate-y-full text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
        {label}
      </span>
    </span>
  );

  const className = cn(
    "group inline-flex h-10 items-center px-3 text-sm font-medium leading-5 transition-colors",
    active ? "text-[var(--dc-text)]" : "text-[var(--dc-text-muted)]"
  );

  const handlers = {
    onMouseEnter: () => cursor.set("hover"),
    onMouseLeave: cursor.reset,
  };

  return hasChildren ? (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="true"
      aria-expanded={expanded}
      className={className}
      {...handlers}
    >
      {inner}
    </button>
  ) : (
    <Link href={href} className={className} {...handlers}>
      {inner}
    </Link>
  );
}

function IconLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cursor = useCursor();
  return (
    <Link
      href={href}
      aria-label={label}
      onMouseEnter={() => cursor.set("hover")}
      onMouseLeave={cursor.reset}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-[var(--dc-text-muted)] transition-colors hover:text-[var(--dc-text)]",
        className
      )}
    >
      {children}
    </Link>
  );
}