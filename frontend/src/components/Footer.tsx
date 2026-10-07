import Link from 'next/link';

const QUICK_LINKS = ['Orders & Shipping', 'Join/Login as a Seller', 'Payment & Pricing', 'Return & Refunds', 'FAQs', 'Privacy Policy', 'Terms & Conditions'];
const COMPANY_LINKS = ['About Us', 'Stories', 'Artisans', 'Boutiques', 'Contact Us', 'EU Compliances Docs'];
const PAYMENTS = ['GPay', 'Mastercard', 'PayPal', 'Amex', 'Apple Pay', 'Shop Pay'];

function FooterLink({ children }: { children: string }) {
  return <Link href="/#results" title="More details coming soon; return to the product collection">{children}</Link>;
}

/**
 * Footer (Server Component). Dark footer from the design:
 * newsletter + contact/currency on top, then brand links, quick links, follow us and accepted payments.
 * Real <h2> headings and <ul> lists keep it semantic without extra wrapper divs.
 */
export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <section className="footer__newsletter" aria-labelledby="newsletter-title">
          <h2 id="newsletter-title">Be the first to know</h2>
          <p>Sign up for updates from mettā muse.</p>
          <p className="footer__note">Newsletter sign-up is not connected in this demo.</p>
        </section>

        <section className="footer__contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact us</h2>
          <p><a href="tel:+442211335360">+44 221 133 5360</a></p>
          <p><a href="mailto:customercare@mettamuse.com">customercare@mettamuse.com</a></p>
          <h2 className="footer__sub">Currency</h2>
          <p>USD</p>
          <p className="footer__note">Transactions will be completed in Euros and a currency reference is available on hover.</p>
        </section>

        <section className="footer__col" aria-labelledby="brand-title">
          <h2 id="brand-title">mettā muse</h2>
          <ul>{COMPANY_LINKS.map((l) => <li key={l}><FooterLink>{l}</FooterLink></li>)}</ul>
        </section>

        <section className="footer__col" aria-labelledby="quick-title">
          <h2 id="quick-title">Quick links</h2>
          <ul>{QUICK_LINKS.map((l) => <li key={l}><FooterLink>{l}</FooterLink></li>)}</ul>
        </section>

        <section className="footer__col" aria-labelledby="follow-title">
          <h2 id="follow-title">Follow us</h2>
          <ul className="footer__social">
            <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
          <h2 className="footer__sub">mettā muse accepts</h2>
          <ul className="footer__pay">{PAYMENTS.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>
      </div>
      <p className="footer__copy">Copyright © 2023 mettamuse. All rights reserved.</p>
    </footer>
  );
}
