import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiEnvelope, HiCheck } from 'react-icons/hi2';
import { FaWhatsapp, FaTshirt, FaPen, FaSuitcase } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';
import { printingMethods, tshirtDetails, contactInfo } from '../data/products';
import './OrderForm.css';

const categories = [
  { id: 'tshirts', label: 'T-Shirts', icon: FaTshirt },
  { id: 'stationery', label: 'Stationery', icon: FaPen },
  { id: 'bags', label: 'Bags', icon: FaSuitcase },
];

const stationeryItems = ['Pens', 'Diaries', 'Notebooks', 'ID Cards', 'Lanyards'];
const bagItems = ['School Bags', 'Laptop Bags', 'Sling Bags', 'Duffle Bags', 'Backpacks', 'Travel Bags'];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  category: 'tshirts',
  // T-shirt fields
  material: '',
  method: '',
  size: '',
  quantity: '',
  color: '',
  // Stationery / Bags
  itemType: '',
  brandingDetails: '',
  // Common
  designDescription: '',
  notes: '',
};

export default function OrderForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.quantity || Number(form.quantity) < 1) e.quantity = 'Quantity is required';

    if (form.category === 'tshirts') {
      if (!form.material) e.material = 'Select a material';
      if (!form.method) e.method = 'Select a printing method';
      if (!form.size) e.size = 'Select a size';
    } else {
      if (!form.itemType) e.itemType = 'Select an item type';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildMessage = () => {
    let msg = `🖨️ *NEW ORDER — INK & IMPACT*\n\n`;
    msg += `👤 *Name:* ${form.name}\n`;
    msg += `📱 *Phone:* ${form.phone}\n`;
    if (form.email) msg += `📧 *Email:* ${form.email}\n`;
    msg += `\n📦 *Category:* ${categories.find(c => c.id === form.category)?.label}\n`;

    if (form.category === 'tshirts') {
      msg += `👕 *Material:* ${form.material}\n`;
      msg += `🖌️ *Method:* ${form.method}\n`;
      msg += `📏 *Size:* ${form.size}\n`;
      msg += `🔢 *Quantity:* ${form.quantity}\n`;
      if (form.color) msg += `🎨 *Color:* ${form.color}\n`;
    } else {
      msg += `📋 *Item:* ${form.itemType}\n`;
      msg += `🔢 *Quantity:* ${form.quantity}\n`;
      if (form.brandingDetails) msg += `✏️ *Branding:* ${form.brandingDetails}\n`;
    }

    if (form.designDescription) msg += `\n🎨 *Design Description:*\n${form.designDescription}\n`;
    if (form.notes) msg += `\n📝 *Additional Notes:*\n${form.notes}\n`;

    return msg;
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${contactInfo.orderWhatsapp}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const sendEmail = () => {
    if (!validate()) return;
    const subject = encodeURIComponent(`New Order from ${form.name} — INK & IMPACT`);
    const body = encodeURIComponent(buildMessage());
    window.open(`mailto:${contactInfo.orderEmail}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="order" id="order">
        <div className="container">
          <motion.div
            className="order__success glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="order__success-icon">
              <HiCheck />
            </div>
            <h3>Order Sent Successfully!</h3>
            <p>We'll get back to you within 24 hours with a quote. Thanks for choosing INK & IMPACT!</p>
            <button
              className="btn-primary"
              onClick={() => { setSubmitted(false); setForm(initialForm); }}
            >
              Place Another Order
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="order" id="order">
      <div className="container">
        <ScrollReveal>
          <div className="order__header">
            <span className="section-label">Get Started</span>
            <h2 className="section-title">
              Place Your <span className="gradient-text">Order</span>
            </h2>
            <p className="section-subtitle">
              Fill in the details below and we'll get back to you with a quote. It's that simple.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="order__form glass">
            {/* Customer Info */}
            <div className="order__section">
              <h4 className="order__section-title">Your Details</h4>
              <div className="order__grid order__grid--3">
                <div className="order__field">
                  <label>Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={errors.name ? 'order__input--error' : ''}
                  />
                  {errors.name && <span className="order__error">{errors.name}</span>}
                </div>
                <div className="order__field">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={errors.phone ? 'order__input--error' : ''}
                  />
                  {errors.phone && <span className="order__error">{errors.phone}</span>}
                </div>
                <div className="order__field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="order__section">
              <h4 className="order__section-title">What do you need?</h4>
              <div className="order__categories">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`order__category ${form.category === cat.id ? 'order__category--active' : ''}`}
                    onClick={() => update('category', cat.id)}
                  >
                    <cat.icon />
                    <span>{cat.label}</span>
                    {form.category === cat.id && (
                      <motion.div
                        className="order__category-bg"
                        layoutId="category-bg"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Fields */}
            <AnimatePresence mode="wait">
              <motion.div
                key={form.category}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {form.category === 'tshirts' ? (
                  <div className="order__section">
                    <h4 className="order__section-title">T-Shirt Details</h4>
                    <div className="order__grid order__grid--2">
                      <div className="order__field">
                        <label>Material *</label>
                        <div className="order__pill-group">
                          {tshirtDetails.materials.map((m) => (
                            <button
                              key={m}
                              className={`order__pill ${form.material === m ? 'order__pill--active' : ''}`}
                              onClick={() => update('material', m)}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                        {errors.material && <span className="order__error">{errors.material}</span>}
                      </div>
                      <div className="order__field">
                        <label>Size *</label>
                        <div className="order__pill-group">
                          {tshirtDetails.sizes.map((s) => (
                            <button
                              key={s}
                              className={`order__pill order__pill--sm ${form.size === s ? 'order__pill--active' : ''}`}
                              onClick={() => update('size', s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {errors.size && <span className="order__error">{errors.size}</span>}
                      </div>
                    </div>
                    <div className="order__field" style={{ marginTop: 'var(--space-md)' }}>
                      <label>Printing Method *</label>
                      <div className="order__pill-group">
                        {printingMethods.map((m) => (
                          <button
                            key={m.name}
                            className={`order__pill ${form.method === m.name ? 'order__pill--active' : ''}`}
                            onClick={() => update('method', m.name)}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                      {errors.method && <span className="order__error">{errors.method}</span>}
                    </div>
                    <div className="order__grid order__grid--2" style={{ marginTop: 'var(--space-md)' }}>
                      <div className="order__field">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 50"
                          value={form.quantity}
                          onChange={(e) => update('quantity', e.target.value)}
                          className={errors.quantity ? 'order__input--error' : ''}
                        />
                        {errors.quantity && <span className="order__error">{errors.quantity}</span>}
                      </div>
                      <div className="order__field">
                        <label>Preferred Color</label>
                        <input
                          type="text"
                          placeholder="e.g. Navy Blue"
                          value={form.color}
                          onChange={(e) => update('color', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="order__section">
                    <h4 className="order__section-title">
                      {form.category === 'stationery' ? 'Stationery' : 'Bag'} Details
                    </h4>
                    <div className="order__grid order__grid--2">
                      <div className="order__field">
                        <label>Item Type *</label>
                        <select
                          value={form.itemType}
                          onChange={(e) => update('itemType', e.target.value)}
                          className={errors.itemType ? 'order__input--error' : ''}
                        >
                          <option value="">Select an item</option>
                          {(form.category === 'stationery' ? stationeryItems : bagItems).map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        {errors.itemType && <span className="order__error">{errors.itemType}</span>}
                      </div>
                      <div className="order__field">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 100"
                          value={form.quantity}
                          onChange={(e) => update('quantity', e.target.value)}
                          className={errors.quantity ? 'order__input--error' : ''}
                        />
                        {errors.quantity && <span className="order__error">{errors.quantity}</span>}
                      </div>
                    </div>
                    <div className="order__field" style={{ marginTop: 'var(--space-md)' }}>
                      <label>Branding Details</label>
                      <input
                        type="text"
                        placeholder="Logo, text, colors, etc."
                        value={form.brandingDetails}
                        onChange={(e) => update('brandingDetails', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Design & Notes */}
            <div className="order__section">
              <h4 className="order__section-title">Design & Notes</h4>
              <div className="order__field">
                <label>Design Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe your design — colors, placement, text, logo, etc."
                  value={form.designDescription}
                  onChange={(e) => update('designDescription', e.target.value)}
                />
              </div>
              <div className="order__field" style={{ marginTop: 'var(--space-md)' }}>
                <label>Additional Notes</label>
                <textarea
                  rows="2"
                  placeholder="Any special requirements or deadlines"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="order__actions">
              <button className="order__submit order__submit--whatsapp" onClick={sendWhatsApp}>
                <FaWhatsapp />
                <span>Send via WhatsApp</span>
              </button>
              <button className="order__submit order__submit--email" onClick={sendEmail}>
                <HiEnvelope />
                <span>Send via Email</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
