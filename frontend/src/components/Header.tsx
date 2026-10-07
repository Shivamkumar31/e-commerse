import Link from 'next/link';
import Image from 'next/image';
import { CartLink } from '@/components/CartLink';

const NAV_ITEMS = ['Shop', 'Skills', 'Stories', 'About', 'Contact us'];
const navHref: Record<string, string> = {
  Shop: '/#results',
  Skills: '/#results',
  Stories: '/#results',
  About: '/#footer',
  'Contact us': '/#contact-title',
};

/**
 * Header (mostly server-rendered); its bag indicator subscribes to the shared cart state.
 */
export function Header() {
  return (
    <>
      <div className="topbar">
        <p>Complimentary shipping on orders over $100</p>
        <p>Thoughtfully chosen pieces for everyday living</p>
        <p>Discover something you will love</p>
      </div>
      <header className="header">
        <div className="header__row">
          <Link href="/" className="header__mark" aria-label="Home">
            <Image src="/metta-muse-mark.svg" alt="" width={42} height={42} priority />
          </Link>
          <Link href="/" className="header__brand" aria-label="mettā muse home">mettā muse</Link>
          <div className="header__actions">
            <Link href="/#search" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></svg>
            </Link>
            <Link href="/#results" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>
            </Link>
            <CartLink />
            <Link href="/#footer" aria-label="Account">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            </Link>
            <span className="header__lang">ENG</span>
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <ul>
            {NAV_ITEMS.map((label) => (
              <li key={label}><Link href={navHref[label]}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
