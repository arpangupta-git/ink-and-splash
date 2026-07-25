import { FaPrint } from 'react-icons/fa';
import { HiHeart } from 'react-icons/hi2';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__gradient-border" />
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">
              <FaPrint className="footer__logo-icon" />
              <span className="footer__logo-text">
                INK <span className="footer__logo-amp">&</span> IMPACT
              </span>
            </div>
            <p className="footer__tagline">
              Your One-Stop Printing & Promotional Solution
            </p>
          </div>

          <div className="footer__links">
            <a href="#!" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }); }}>Place an Order</a>
            <a href="#!" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
          </div>

          <div className="footer__bottom">
            <p>
              © {new Date().getFullYear()} INK & IMPACT. All rights reserved.
            </p>
            <p className="footer__made-with">
              Made with <HiHeart className="footer__heart" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
