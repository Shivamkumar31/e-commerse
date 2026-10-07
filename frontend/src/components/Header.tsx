import Link from 'next/link';

const NAV_ITEMS = ['Shop', 'Skills', 'Stories', 'About', 'Contact us'];

/**
 * Header (Server Component - zero JS shipped).
 * Layout from the design: thin announcement bar, logo row (mark | LOGO | icons + language), then main navigation.
 * Only implemented destinations are links; the remaining design-only labels are not fake links.
 */
export function Header() {
  return (
    <>
      <div className="topbar">
        <p>Lorem ipsum dolor sit amet consectetur</p>
        <p>Lorem ipsum dolor sit amet consectetur</p>
        <p>Lorem ipsum dolor sit amet consectetur</p>
      </div>
      <header className="header">
        <div className="header__row">
          <Link href="/" className="header__mark" aria-label="Home">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="16" height="16" /><path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </Link>
          <Link href="/" className="header__brand">LOGO</Link>
          <div className="header__actions">
            <Link href="/#search" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></svg>
            </Link>
            <span aria-label="Wishlist (demo only)" title="Wishlist (demo only)" role="img">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>
            </span>
            <span aria-label="Shopping bag (demo only)" title="Shopping bag (demo only)" role="img">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8a3 3 0 016 0" /></svg>
            </span>
            <span aria-label="Account (demo only)" title="Account (demo only)" role="img">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            </span>
            <span className="header__lang">ENG</span>
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <ul>
            {NAV_ITEMS.map((label) => (
              <li key={label}>{label === 'Shop' ? <Link href="/">{label}</Link> : <span title="Demo only">{label}</span>}</li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
