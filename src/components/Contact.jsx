import { motion } from 'framer-motion';
import { HiPhone, HiEnvelope } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import ScrollReveal, { ScrollRevealItem } from './ScrollReveal';
import { contactInfo } from '../data/products';
import './Contact.css';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <ScrollReveal>
          <div className="contact__header">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="section-subtitle">
              Have questions? Need a custom quote? We're just a call or message away.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger>
          <div className="contact__grid">
            <ScrollRevealItem>
              <a href="tel:+918400519209" className="contact__card glass">
                <div className="contact__card-icon contact__card-icon--phone">
                  <HiPhone />
                </div>
                <h3 className="contact__card-title">Call Us</h3>
                <p className="contact__card-value">+91 8400519209</p>
                <span className="contact__card-cta">Tap to Call →</span>
              </a>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <a href="https://wa.me/918400519209" target="_blank" rel="noopener noreferrer" className="contact__card glass contact__card--whatsapp">
                <div className="contact__card-icon contact__card-icon--whatsapp">
                  <FaWhatsapp />
                </div>
                <h3 className="contact__card-title">WhatsApp Chat</h3>
                <p className="contact__card-value">Quick chat for instant quotes</p>
                <span className="contact__card-cta">Message Now →</span>
              </a>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <a href="mailto:lowkeyinsilence@gmail.com" className="contact__card glass">
                <div className="contact__card-icon contact__card-icon--email">
                  <HiEnvelope />
                </div>
                <h3 className="contact__card-title">Email</h3>
                <p className="contact__card-value">lowkeyinsilence@gmail.com</p>
                <span className="contact__card-cta">Send Email →</span>
              </a>
            </ScrollRevealItem>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="contact__cta-banner glass">
            <div className="contact__cta-content">
              <h3>Ready to make an <span className="gradient-text">impact</span>?</h3>
              <p>Get your custom order started in under 2 minutes.</p>
            </div>
            <a href="#order" className="btn-primary">
              Place Your Order
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
