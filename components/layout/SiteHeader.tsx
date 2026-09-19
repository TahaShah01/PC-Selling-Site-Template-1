"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { PRIMARY_NAV } from "../../data/navigation";
import type { NavItem } from "../../data/navigation";
import { useCartStore } from "@/lib/store/cart";
import { CartDrawer } from "@/components/shop/CartDrawer";

/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — SITE HEADER
   Premium navigation with dropdown menus and mobile drawer.
───────────────────────────────────────────────────────── */

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const pathname = usePathname();
  
  const itemCount = useCartStore((state) => state.cart.itemCount);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Scroll detection for header background
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (Cart handles its own lock)
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isCartOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      if (!isCartOpen) document.body.style.overflow = "";
    };
  }, [isMobileOpen, isCartOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--dc-z-sticky)]",
          "transition-all duration-[var(--dc-duration-normal)] ease-[var(--dc-ease-out)]",
          isScrolled
            ? "bg-[rgba(8,8,8,0.92)] backdrop-blur-xl border-b border-[var(--dc-border)]"
            : "bg-transparent"
        )}
      >
        <div className="dc-container">
          <nav
            className="flex items-center justify-between h-[var(--dc-header-height)]"
            aria-label="Primary navigation"
          >
            {/* ─── LOGO ─── */}
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="Daddu Charger — Home"
            >
              <DadduLogo />
            </Link>

            {/* ─── DESKTOP NAV ─── */}
            <ul
              className="hidden lg:flex items-center gap-1"
              role="menubar"
            >
              {PRIMARY_NAV.map((item) => (
                <DesktopNavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || (item.children && pathname.startsWith(item.href + "/")) || false}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </ul>

            {/* ─── DESKTOP ACTIONS ─── */}
            <div className="hidden lg:flex items-center gap-2">
              <HeaderIconButton href="/search" label="Search">
                <Search size={18} />
              </HeaderIconButton>
              <HeaderIconButton href="/wishlist" label="Wishlist">
                <Heart size={18} />
              </HeaderIconButton>
              <button
                aria-label={`Cart (${itemCount} items)`}
                onClick={() => setIsCartOpen(true)}
                className="h-10 w-10 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors duration-[var(--dc-duration-fast)]"
              >
                <CartIcon count={itemCount} />
              </button>
            </div>

            {/* ─── MOBILE ACTIONS ─── */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                aria-label={`Cart (${itemCount} items)`}
                onClick={() => setIsCartOpen(true)}
                className="h-10 w-10 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors duration-[var(--dc-duration-fast)]"
              >
                <CartIcon count={itemCount} />
              </button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="h-10 w-10 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors duration-[var(--dc-duration-fast)]"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── CART DRAWER ─── */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ─── MOBILE DRAWER ─── */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

/* ─── LOGO ─── */
function DadduLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Bolt icon */}
      <div className="w-8 h-8 bg-[var(--dc-accent)] rounded-[var(--dc-radius-md)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-[var(--dc-duration-fast)] ease-[var(--dc-ease-spring)]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 1L3 9H8L7 15L13 7H8L9 1Z"
            fill="#080808"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-display font-bold text-[var(--dc-text)] text-lg tracking-tight leading-none">
        daddu<span className="text-[var(--dc-accent)]">charger</span>
      </span>
    </div>
  );
}

/* ─── DESKTOP NAV ITEM ─── */
interface DesktopNavItemProps {
  item: NavItem;
  isActive: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (v: string | null) => void;
}

function DesktopNavItem({ item, isActive, activeDropdown, setActiveDropdown }: DesktopNavItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = activeDropdown === item.href;

  if (item.isHighlighted) {
    return (
      <li role="none">
        <Link
          href={item.href}
          className="inline-flex items-center gap-1 h-9 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-accent)] text-[var(--dc-accent-text)] font-semibold text-sm hover:bg-[var(--dc-accent-hover)] hover:scale-[1.02] transition-all duration-[var(--dc-duration-fast)] ease-[var(--dc-ease-out)]"
          role="menuitem"
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      role="none"
      className="relative"
      onMouseEnter={() => hasChildren && setActiveDropdown(item.href)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {hasChildren ? (
        <button
          className={cn(
            "inline-flex items-center gap-1 h-9 px-3 rounded-[var(--dc-radius-md)] text-sm font-medium transition-colors duration-[var(--dc-duration-fast)]",
            isActive || isOpen
              ? "text-[var(--dc-text)]"
              : "text-[var(--dc-text-muted)] hover:text-[var(--dc-text)]",
            isOpen && "bg-[var(--dc-surface)]"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
          role="menuitem"
        >
          {item.label}
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-[var(--dc-duration-fast)]",
              isOpen && "rotate-180"
            )}
          />
        </button>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "inline-flex items-center h-9 px-3 rounded-[var(--dc-radius-md)] text-sm font-medium transition-colors duration-[var(--dc-duration-fast)]",
            isActive
              ? "text-[var(--dc-text)]"
              : "text-[var(--dc-text-muted)] hover:text-[var(--dc-text)]"
          )}
          role="menuitem"
        >
          {item.label}
        </Link>
      )}

      {/* Dropdown */}
      {hasChildren && isOpen && (
        <div
          className="absolute top-full left-0 mt-1 min-w-52 py-1 bg-[var(--dc-surface-2)] border border-[var(--dc-border)] rounded-[var(--dc-radius-xl)] shadow-[var(--dc-shadow-xl)] z-[var(--dc-z-dropdown)]"
          role="menu"
        >
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="flex items-center px-4 py-2.5 text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface-3)] transition-colors duration-[var(--dc-duration-fast)]"
              role="menuitem"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

/* ─── HEADER ICON BUTTON ─── */
interface HeaderIconButtonProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function HeaderIconButton({ href, label, children }: HeaderIconButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="h-10 w-10 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors duration-[var(--dc-duration-fast)]"
    >
      {children}
    </Link>
  );
}

/* ─── CART ICON WITH COUNT ─── */
function CartIcon({ count }: { count: number }) {
  return (
    <div className="relative">
      <ShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-0.5 bg-[var(--dc-accent)] text-[var(--dc-accent-text)] text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}

/* ─── MOBILE NAV DRAWER ─── */
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

function MobileNav({ isOpen, onClose, pathname }: MobileNavProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  return (
    <>
      {/* Scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[var(--dc-z-overlay)] bg-[var(--dc-overlay)]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[var(--dc-z-modal)] w-80 max-w-[calc(100vw-3rem)]",
          "bg-[var(--dc-surface)] border-l border-[var(--dc-border)]",
          "flex flex-col",
          "transition-transform duration-[var(--dc-duration-normal)] ease-[var(--dc-ease-out)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-[var(--dc-header-height-mobile)] border-b border-[var(--dc-border)]">
          <DadduLogo />
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface-2)] transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                expanded={expandedItem === item.href}
                onExpand={() =>
                  setExpandedItem(expandedItem === item.href ? null : item.href)
                }
              />
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[var(--dc-border)] flex gap-2">
          <Link
            href="/search"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[var(--dc-radius-md)] bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] text-sm transition-colors"
            onClick={onClose}
          >
            <Search size={16} />
            Search
          </Link>
          <Link
            href="/wishlist"
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[var(--dc-radius-md)] bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] text-sm transition-colors"
            onClick={onClose}
          >
            <Heart size={16} />
            Wishlist
          </Link>
        </div>
      </div>
    </>
  );
}

interface MobileNavItemProps {
  item: NavItem;
  isActive: boolean;
  expanded: boolean;
  onExpand: () => void;
}

function MobileNavItem({ item, isActive, expanded, onExpand }: MobileNavItemProps) {
  const hasChildren = Boolean(item.children?.length);

  if (item.isHighlighted) {
    return (
      <li>
        <Link
          href={item.href}
          className="flex items-center justify-center h-12 rounded-[var(--dc-radius-lg)] bg-[var(--dc-accent)] text-[var(--dc-accent-text)] font-semibold text-sm"
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={onExpand}
            className={cn(
              "w-full flex items-center justify-between px-4 h-12 rounded-[var(--dc-radius-lg)] text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--dc-surface-2)] text-[var(--dc-text)]"
                : "text-[var(--dc-text-muted)] hover:bg-[var(--dc-surface-2)] hover:text-[var(--dc-text)]"
            )}
            aria-expanded={expanded}
          >
            {item.label}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-[var(--dc-duration-fast)]",
                expanded && "rotate-180"
              )}
            />
          </button>
          {expanded && (
            <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-[var(--dc-border)] pl-4">
              {item.children!.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="flex items-center h-10 px-2 text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "flex items-center px-4 h-12 rounded-[var(--dc-radius-lg)] text-sm font-medium transition-colors",
            isActive
              ? "bg-[var(--dc-surface-2)] text-[var(--dc-text)]"
              : "text-[var(--dc-text-muted)] hover:bg-[var(--dc-surface-2)] hover:text-[var(--dc-text)]"
          )}
        >
          {item.label}
        </Link>
      )}
    </li>
  );
}
