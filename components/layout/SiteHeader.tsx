"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, ArrowLeft, X } from "lucide-react";
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
import { useWishlistStore } from "@/lib/store/wishlist";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { useCursor } from "../motion/Cursor";
import { Magnetic } from "../motion/Reveal";
import { useScrollLock } from "../providers/SmoothScrollProvider";
import { EASE } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   SITE HEADER — + mobile/responsive fix pass

   MOBILE FIXES on top of the previous pass:

   1. Safe area. The header is `fixed top-0` with no top
      padding, so on a notched phone with `viewportFit: "cover"`
      (added in layout.tsx last round) it draws its background
      and content starting at the true top edge of the screen —
      under the notch/Dynamic Island — rather than below it. It
      now carries `pt-[env(safe-area-inset-top,0px)]`, and
      everywhere that positions something "below the header"
      (the mega-menu, the mobile menu's top padding) now reads
      the new `--dc-header-offset` token from globals.css instead
      of `--dc-header-height` directly — that token already
      equals height + safe area, so this is a one-line swap per
      spot, not a recalculation.

   2. Cramped compact header. On a narrow phone the action row
      (Search, Wishlist, ThemeToggle, Cart, Burger) plus the
      wordmark logo is tight — Wishlist was already hidden below
      `sm` for this reason. ThemeToggle is now hidden the same
      way; it's still fully reachable via `<ThemeToggle showLabel />`
      in the mobile menu, so nothing is lost, just decluttered
      where space is tightest.

   3. Mobile menu bottom row now pads for
      `env(safe-area-inset-bottom)` too, so the search/wishlist/
      contact row and theme toggle don't sit flush against a
      phone's home-indicator gesture area.

   Everything else — the debounced mega-menu hover, the
   contained ~70vh panel with click-outside scrim, the two-level
   mobile drill-down — is exactly the previous pass, untouched.
───────────────────────────────────────────────────────── */

const CLOSE_DELAY = 200;

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
  const wishlistCount = useWishlistStore((s) => s.items.length);

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

  const closeMenu = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(null);
  }, []);

  React.useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const closeAllMobile = React.useCallback(() => {
    setMobileOpen(false);
    setMobileLevel(null);
  }, []);

  // Close everything on navigation
  React.useEffect(() => {
    setMenu(null);
    closeAllMobile();
  }, [pathname, closeAllMobile]);

  // Escape closes whatever is open
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      closeAllMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAllMobile]);

  const overlayOpen = Boolean(menu) || mobileOpen;
  useScrollLock(overlayOpen);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !reduced ? "-130%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE.out }}
        className={cn(
          "fixed z-[var(--dc-z-sticky)] transition-all duration-500",
          // Mobile Floating Pill
          "left-4 right-4 top-4 rounded-full sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[24rem]",
          "border border-[var(--dc-border)] bg-[var(--dc-header-bg)] backdrop-blur-2xl shadow-2xl",
          // Desktop Full Bar
          "lg:inset-x-0 lg:top-0 lg:left-0 lg:translate-x-0 lg:w-full lg:max-w-none lg:rounded-none lg:shadow-none lg:border-x-0 lg:border-t-0",
          "lg:pt-[env(safe-area-inset-top,0px)]",
          solid && !overlayOpen
            ? "lg:border-b lg:border-[var(--dc-border)] lg:bg-[var(--dc-header-bg)] lg:backdrop-blur-2xl"
            : "lg:border-b-transparent lg:bg-transparent lg:border-transparent lg:backdrop-blur-none"
        )}
      >
        <div className="flex h-14 lg:h-[var(--dc-header-height)] items-center justify-between gap-3 lg:gap-6 px-4 lg:px-[var(--dc-gutter)] w-full">
          {/* ── LOGO ── */}
          {/* ── BRAND / LOGO ── */}
          <Link
            href="/"
            aria-label="Daddu Charger — home"
            className="group flex shrink-0 items-center"
            onMouseEnter={() => {
              cancelClose();
              setMenu(null);
              cursor.set("hover");
            }}
            onMouseLeave={cursor.reset}
          >
            {/* Logo */}
            <div className="relative flex shrink-0 items-center justify-center">
              <Image
                src="/logo.png"
                alt="Daddu Charger"
                width={400}
                height={400}
                priority
                className="
        h-auto
        w-12
        object-contain
        transition-transform
        duration-500
        ease-[var(--dc-ease-out)]
        group-hover:scale-[1.04]

        lg:w-[68px]
        xl:w-[72px]
      "
              />
            </div>

            {/* Desktop / Tablet Brand Wordmark */}
            <div
              className="
      ml-3
      hidden
      sm:flex
      items-center
      whitespace-nowrap
      select-none

      lg:ml-4
    "
            >
              <div className="relative flex items-center">
                {/* GAMING */}
                <span
                  className="
          relative
          font-display
          text-[1.4rem]
          font-black
          uppercase
          leading-none
          tracking-[0.035em]
          text-[var(--dc-text)]

          lg:text-[1.65rem]
          xl:text-[1.8rem]
        "
                  style={{
                    textShadow:
                      "0 2px 8px rgba(0,0,0,.6), 0 0 1px rgba(255,255,255,.45)",
                  }}
                >
                  GAMING
                </span>

                {/* Divider */}
                <span
                  aria-hidden="true"
                  className="
          mx-2.5
          h-6
          w-[2px]
          -skew-x-[18deg]
          bg-[var(--dc-accent)]
          shadow-[0_0_12px_var(--dc-accent-glow)]
          lg:h-7
        "
                />

                {/* STORE */}
                <span
                  className="
          relative
          font-display
          text-[1.4rem]
          font-black
          uppercase
          italic
          leading-none
          tracking-[0.055em]
          text-[var(--dc-accent)]

          lg:text-[1.65rem]
          xl:text-[1.8rem]
        "
                  style={{
                    textShadow:
                      "0 0 12px rgba(255,106,26,.22), 0 2px 8px rgba(0,0,0,.55)",
                  }}
                >
                  STORE

                  {/* Orange underline */}
                  <span
                    aria-hidden="true"
                    className="
            absolute
            -bottom-1.5
            left-0
            h-[2px]
            w-full
            origin-left
            scale-x-[0.72]
            bg-gradient-to-r
            from-[var(--dc-accent)]
            to-transparent
            transition-transform
            duration-500
            group-hover:scale-x-100
          "
                  />
                </span>
              </div>
            </div>
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
                          className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-[var(--dc-accent)] px-5 text-sm font-semibold"
                          style={{ color: "var(--dc-accent-text)" }}
                        >
                          <span className="relative z-10" style={{ color: "var(--dc-accent-text)" }}>{item.label}</span>
                          <span className="absolute inset-0 origin-bottom scale-y-0 bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
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
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
              className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--dc-text-muted)] transition-colors hover:text-[var(--dc-text)]"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--dc-accent)] px-1 text-[9px] font-bold leading-none text-[var(--dc-accent-text)] tabular-nums"
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            {/* Hidden below `sm` — the compact phone header is tight
                on space, and this is still reachable via the mobile
                menu's own <ThemeToggle showLabel /> below. */}
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>

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
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dc-accent)] px-1 text-[11px] font-bold leading-none tabular-nums"
                    style={{ color: "var(--dc-accent-text)" }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Burger */}
            <button
              type="button"
              onClick={() => {
                if (mobileOpen) closeAllMobile();
                else setMobileOpen(true);
              }}
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

      {/* ── CONTAINED MEGA MENU (desktop, max ~70vh) ── */}
      <AnimatePresence>
        {menu && (
          <>
            {/* Scrim — click anywhere below the panel to close */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[calc(var(--dc-z-overlay)-1)] hidden lg:block"
              style={{ top: "var(--dc-header-offset)" }}
              onClick={closeMenu}
            />

            {/* Panel */}
            <motion.div
              key={menu.href}
              initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE.out }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="fixed inset-x-0 z-[var(--dc-z-overlay)] hidden border-b border-[var(--dc-border)] bg-[var(--dc-menu-bg)] backdrop-blur-2xl lg:block"
              style={{
                top: "var(--dc-header-offset)",
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <div className="dc-gutter py-8 pb-10">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--dc-text-subtle)]">
                    {menu.label}
                  </p>
                  <button
                    type="button"
                    onClick={closeMenu}
                    onMouseEnter={() => cursor.set("hover")}
                    onMouseLeave={cursor.reset}
                    className="flex items-center gap-1.5 text-xs text-[var(--dc-text-subtle)] transition-colors hover:text-[var(--dc-text)]"
                    aria-label="Close menu"
                  >
                    <X size={14} />
                    Close
                  </button>
                </div>

                <ul className="grid grid-cols-2 gap-x-12 xl:grid-cols-3">
                  {menu.children!.map((child, i) => (
                    <li key={child.href} className="overflow-hidden border-t border-[var(--dc-border)]">
                      <motion.div
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "110%", opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.65, ease: EASE.out, delay: 0.05 + i * 0.04 }}
                      >
                        <Link
                          href={child.href}
                          onMouseEnter={() => cursor.set("view", "Open")}
                          onMouseLeave={cursor.reset}
                          className="group flex items-baseline justify-between gap-4 py-4"
                        >
                          <span className="font-display text-[clamp(1.25rem,2vw,1.9rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--dc-text)] transition-colors duration-300 group-hover:text-[var(--dc-accent)]">
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
          </>
        )}
      </AnimatePresence>

      {/* ── FULL-SCREEN CINEMATIC MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="dc-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ opacity: 0, clipPath: "circle(0% at 90% 10%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 90% 10%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 90% 10%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[calc(var(--dc-z-overlay)+10)] flex flex-col overflow-hidden bg-[var(--dc-bg)]/95 backdrop-blur-3xl lg:hidden"
          >
            {/* Minimalist Top Bar for Drawer */}
            <div className="flex h-20 items-center justify-between px-6 pt-[env(safe-area-inset-top,0px)]">
              {mobileLevel ? (
                <button
                  type="button"
                  onClick={() => setMobileLevel(null)}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--dc-text)] hover:text-[var(--dc-accent)] transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Back to main navigation"
                >
                  <ArrowLeft size={18} className="text-[var(--dc-accent)]" />
                  <span>Back</span>
                </button>
              ) : (
                <Link
                  href="/"
                  onClick={closeAllMobile}
                  className="flex items-center gap-2 min-h-[44px]"
                  aria-label="Daddu Charger Home"
                >
                  <Image
                    src="/logo.png"
                    alt="Daddu Charger"
                    width={400}
                    height={400}
                    className="w-12 h-auto object-contain"
                    priority
                  />
                  <span className="font-display font-black text-2xl tracking-[0.2em] uppercase mt-1 ml-2 block cursor-default select-none transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_var(--dc-accent)]">
                    <span className="text-white">GAMING</span> <span className="text-[var(--dc-accent)]">STORE</span>
                  </span>

                </Link>
              )}

              <button
                type="button"
                onClick={closeAllMobile}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--dc-surface)] text-[var(--dc-text)] hover:bg-[var(--dc-accent)] hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-[var(--dc-accent)] active:scale-95 border border-[var(--dc-border)]"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Body - Centered, Cinematic Stagger */}
            <div className="relative flex-1 overflow-y-auto px-6 flex flex-col justify-center pb-[env(safe-area-inset-bottom,0px)]">
              <AnimatePresence mode="wait" initial={false}>
                {!mobileLevel ? (
                  <motion.div
                    key="level-0"
                    initial={{ x: "-10%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "-10%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                    className="flex flex-col gap-6"
                  >
                    <ul className="flex flex-col gap-4">
                      {PRIMARY_NAV.map((item, i) => {
                        const hasChildren = Boolean(item.children?.length);
                        return (
                          <li key={item.href} className="overflow-hidden">
                            <motion.div
                              initial={{ y: "100%", opacity: 0, rotate: 2 }}
                              animate={{ y: "0%", opacity: 1, rotate: 0 }}
                              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.1 + i * 0.05 }}
                            >
                              {hasChildren ? (
                                <button
                                  type="button"
                                  onClick={() => setMobileLevel(item)}
                                  className="flex w-full items-center justify-between text-left group"
                                >
                                  <span className="font-display text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none tracking-[-0.04em] text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors">
                                    {item.label}
                                  </span>
                                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dc-surface-2)] text-[var(--dc-accent)]">
                                    →
                                  </span>
                                </button>
                              ) : (
                                <Link
                                  href={item.href}
                                  onClick={closeAllMobile}
                                  className="flex items-center justify-between group"
                                >
                                  <span
                                    className={cn(
                                      "font-display text-[clamp(2.5rem,10vw,4rem)] font-bold leading-none tracking-[-0.04em] transition-colors",
                                      item.isHighlighted ? "text-[var(--dc-accent)]" : "text-[var(--dc-text)] group-hover:text-[var(--dc-accent)]"
                                    )}
                                  >
                                    {item.label}
                                  </span>
                                </Link>
                              )}
                            </motion.div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Footer Row inside Drawer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--dc-border-strong)] pt-8"
                    >
                      <div className="flex gap-6">
                        <Link href="/wishlist" onClick={closeAllMobile} className="flex flex-col gap-1 hover:text-[var(--dc-accent)] transition-colors">
                          <Heart size={20} className="text-[var(--dc-text)]" />
                          <span className="text-[10px] font-semibold tracking-wider text-[var(--dc-text-muted)] uppercase">Wishlist</span>
                        </Link>
                        <Link href="/search" onClick={closeAllMobile} className="flex flex-col gap-1 hover:text-[var(--dc-accent)] transition-colors">
                          <Search size={20} className="text-[var(--dc-text)]" />
                          <span className="text-[10px] font-semibold tracking-wider text-[var(--dc-text-muted)] uppercase">Search</span>
                        </Link>
                      </div>
                      <ThemeToggle showLabel />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mobileLevel.href}
                    initial={{ x: "10%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "10%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-xs font-semibold tracking-[0.2em] text-[var(--dc-accent)] uppercase mb-4">
                      {mobileLevel.label}
                    </p>
                    <ul className="flex flex-col gap-4">
                      {mobileLevel.children!.map((child, i) => (
                        <li key={child.href} className="overflow-hidden">
                          <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.04 }}
                          >
                            <Link
                              href={child.href}
                              onClick={closeAllMobile}
                              className="flex items-center gap-4 group"
                            >
                              <span className="text-sm font-mono text-[var(--dc-text-subtle)]">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="font-display text-[clamp(1.75rem,8vw,2.5rem)] font-bold leading-none tracking-[-0.03em] text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors">
                                {child.label}
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