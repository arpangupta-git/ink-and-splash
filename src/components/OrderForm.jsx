import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiEnvelope, HiCheck, HiArrowRight, HiArrowLeft } from 'react-icons/hi2';
import { FaWhatsapp, FaTshirt, FaPen, FaSuitcase } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';
import { printingMethods, tshirtDetails, contactInfo } from '../data/products';
import './OrderForm.css';

const categories = [
  { id: 'tshirts', label: 'T-Shirts', icon: FaTshirt, basePrice: 130 },
  { id: 'stationery', label: 'Stationery', icon: FaPen, basePrice: 50 },
  { id: 'bags', label: 'Bags', icon: FaSuitcase, basePrice: 200 },
];

const stationeryItems = ['Pens', 'Diaries', 'Notebooks', 'ID Cards', 'Lanyards'];
const bagItems = ['School Bags', 'Laptop Bags', 'Sling Bags', 'Duffle Bags', 'Backpacks', 'Travel Bags'];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  category: '',
  material: '',
  method: '',
  size: '',
  quantity: '50',
  color: '',
  itemType: '',
  brandingDetails: '',
  designDescription: '',
  notes: '',
  designService: 'self',
};

export default function OrderForm() {
  const [step, setStep] = useState(1);
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

  const calculatePrice = () => {
    if (!form.category || !form.quantity) return 0;
    const cat = categories.find(c => c.id === form.category);
    let price = cat ? cat.basePrice : 0;
    
    if (form.category === 'tshirts') {
      // Material adjustments
      if (form.material === '100% Premium Cotton') price += 40;
      if (form.material === 'Poly-Cotton Blend') price += 0;
      if (form.material === 'Dry-Fit Polyester') price += 20;

      // Print Method adjustments
      if (form.method === 'DTF Printing') price += 50;
      if (form.method === 'Screen Printing') price += 10;
      if (form.method === 'Embroidery') price += 100;
      if (form.method === 'Sublimation') price += 30;
      if (form.method === 'Vinyl Print') price += 25;
    }
    let total = price * Number(form.quantity);
    if (form.designService === 'custom') {
      total += 100;
    }
    return total;
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.category) e.category = 'Please select a category';
    } else if (step === 2) {
      if (!form.quantity || Number(form.quantity) < 1) e.quantity = 'Quantity is required';
      if (form.category === 'tshirts') {
        if (!form.material) e.material = 'Select a material';
        if (!form.method) e.method = 'Select a printing method';
        if (!form.size) e.size = 'Select a size';
      } else {
        if (!form.itemType) e.itemType = 'Select an item type';
      }
    } else if (step === 3) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim()) e.phone = 'Phone number is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const buildMessage = () => {
    let msg = `🖨️ *NEW ORDER — INK & IMPACT*\n\n`;
    msg += `👤 *Name:* ${form.name}\n📱 *Phone:* ${form.phone}\n`;
    if (form.email) msg += `📧 *Email:* ${form.email}\n`;
    msg += `\n📦 *Category:* ${categories.find(c => c.id === form.category)?.label}\n`;

    if (form.category === 'tshirts') {
      msg += `👕 *Material:* ${form.material}\n🖌️ *Method:* ${form.method}\n`;
      msg += `📏 *Size:* ${form.size}\n🔢 *Quantity:* ${form.quantity}\n`;
      if (form.color) msg += `🎨 *Color:* ${form.color}\n`;
    } else {
      msg += `📋 *Item:* ${form.itemType}\n🔢 *Quantity:* ${form.quantity}\n`;
      if (form.brandingDetails) msg += `✏️ *Branding:* ${form.brandingDetails}\n`;
    }
    if (form.designDescription) msg += `\n🎨 *Design Description:*\n${form.designDescription}\n`;
    msg += `🖌️ *Design Service:* ${form.designService === 'custom' ? 'Need custom design (+₹100)' : 'Customer provided design (Free)'}\n`;
    if (form.notes) msg += `\n📝 *Additional Notes:*\n${form.notes}\n`;
    msg += `\n💰 *Estimated Total:* ₹${calculatePrice()}\n`;
    return msg;
  };

  const sendWhatsApp = () => {
    if (!validateStep()) return;
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${contactInfo.orderWhatsapp}?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const sendEmail = () => {
    if (!validateStep()) return;
    const subject = encodeURIComponent(`New Order from ${form.name} — INK & IMPACT`);
    const body = encodeURIComponent(buildMessage());
    window.open(`mailto:${contactInfo.orderEmail}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="order" id="order">
        <div className="container">
          <motion.div className="order__success glass" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
            <div className="order__success-icon"><HiCheck /></div>
            <h3>Order Sent Successfully!</h3>
            <p>We'll get back to you within 24 hours with a quote. Thanks for choosing INK & IMPACT!</p>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm(initialForm); setStep(1); }}>Place Another Order</button>
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
            <span className="section-label">Build Your Quote</span>
            <h2 className="section-title">Get a <span className="gradient-text">Pricing Estimate</span></h2>
          </div>
        </ScrollReveal>

        <div className="wizard glass">
          <div className="wizard__progress">
            <div className="wizard__progress-bar" style={{ width: `${(step / 3) * 100}%` }} />
            <div className="wizard__steps">
              <span className={step >= 1 ? 'active' : ''}>Category</span>
              <span className={step >= 2 ? 'active' : ''}>Details</span>
              <span className={step >= 3 ? 'active' : ''}>Review</span>
            </div>
          </div>

          <div className="wizard__content">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 className="wizard__title">What do you want to print?</h3>
                  <div className="wizard__cards">
                    {categories.map(cat => (
                      <div key={cat.id} className={`wizard__card hover-target ${form.category === cat.id ? 'active' : ''}`} onClick={() => update('category', cat.id)}>
                        <cat.icon className="wizard__card-icon" />
                        <h4>{cat.label}</h4>
                      </div>
                    ))}
                  </div>
                  {errors.category && <span className="order__error">{errors.category}</span>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 className="wizard__title">Customize your order</h3>
                  {form.category === 'tshirts' ? (
                    <div className="order__grid order__grid--2">
                      <div className="order__field">
                        <label>Material *</label>
                        <div className="order__pill-group">
                          {tshirtDetails.materials.map(m => (
                            <button key={m} className={`order__pill ${form.material === m ? 'order__pill--active' : ''} hover-target`} onClick={() => update('material', m)}>{m}</button>
                          ))}
                        </div>
                        {errors.material && <span className="order__error">{errors.material}</span>}
                      </div>
                      <div className="order__field">
                        <label>Size *</label>
                        <div className="order__pill-group">
                          {tshirtDetails.sizes.map(s => (
                            <button key={s} className={`order__pill order__pill--sm ${form.size === s ? 'order__pill--active' : ''} hover-target`} onClick={() => update('size', s)}>{s}</button>
                          ))}
                        </div>
                        {errors.size && <span className="order__error">{errors.size}</span>}
                      </div>
                      <div className="order__field" style={{ gridColumn: '1 / -1' }}>
                        <label>Printing Method *</label>
                        <div className="order__pill-group">
                          {printingMethods.map(m => (
                            <button key={m.name} className={`order__pill ${form.method === m.name ? 'order__pill--active' : ''} hover-target`} onClick={() => update('method', m.name)}>{m.name}</button>
                          ))}
                        </div>
                        {errors.method && <span className="order__error">{errors.method}</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="order__grid order__grid--2">
                      <div className="order__field">
                        <label>Item Type *</label>
                        <select value={form.itemType} onChange={(e) => update('itemType', e.target.value)} className={`hover-target ${errors.itemType ? 'order__input--error' : ''}`}>
                          <option value="">Select an item</option>
                          {(form.category === 'stationery' ? stationeryItems : bagItems).map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                        {errors.itemType && <span className="order__error">{errors.itemType}</span>}
                      </div>
                      <div className="order__field">
                        <label>Branding Details</label>
                        <input type="text" placeholder="Logo, colors..." value={form.brandingDetails} onChange={(e) => update('brandingDetails', e.target.value)} />
                      </div>
                    </div>
                  )}
                  
                  <div className="order__grid order__grid--2" style={{ marginTop: '2rem' }}>
                    <div className="order__field">
                      <label>Quantity *</label>
                      <input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className={errors.quantity ? 'order__input--error' : ''} />
                      {errors.quantity && <span className="order__error">{errors.quantity}</span>}
                    </div>
                    {form.category === 'tshirts' && (
                      <div className="order__field">
                        <label>Preferred Color</label>
                        <input type="text" placeholder="e.g. Navy Blue" value={form.color} onChange={(e) => update('color', e.target.value)} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h3 className="wizard__title">Your Contact Info</h3>
                  
                  {form.category === 'tshirts' ? (
                    <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--color-accent)' }}>Design Instructions:</strong> You can use our <a href="/designer" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>3D Designer Tool</a> to create your design and attach the saved image, or you can directly send us your ready design. If you want us to custom design it from your instructions, a flat ₹100 charge applies.
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--color-accent)' }}>Design Instructions:</strong> Please send us your ready design directly. If you want us to custom design it from your instructions, a flat ₹100 charge applies.
                    </div>
                  )}

                  <div className="order__field" style={{ marginBottom: '1.5rem' }}>
                    <label>Design Service</label>
                    <div className="order__pill-group">
                      <button className={`order__pill ${form.designService === 'self' ? 'order__pill--active' : ''} hover-target`} onClick={() => update('designService', 'self')}>
                        I have my design (Free)
                      </button>
                      <button className={`order__pill ${form.designService === 'custom' ? 'order__pill--active' : ''} hover-target`} onClick={() => update('designService', 'custom')}>
                        Need custom design (+₹100)
                      </button>
                    </div>
                  </div>

                  <div className="order__grid order__grid--2">
                    <div className="order__field">
                      <label>Name *</label>
                      <input type="text" placeholder="Your full name" value={form.name} onChange={(e) => update('name', e.target.value)} className={errors.name ? 'order__input--error' : ''} />
                      {errors.name && <span className="order__error">{errors.name}</span>}
                    </div>
                    <div className="order__field">
                      <label>Phone *</label>
                      <input type="tel" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={errors.phone ? 'order__input--error' : ''} />
                      {errors.phone && <span className="order__error">{errors.phone}</span>}
                    </div>
                    <div className="order__field" style={{ gridColumn: '1 / -1' }}>
                      <label>Design Notes / Description</label>
                      <textarea rows="3" placeholder="Tell us about your design" value={form.designDescription} onChange={(e) => update('designDescription', e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="wizard__footer">
            <div className="wizard__price">
              <span>Estimated Total:</span>
              <strong className="gradient-text">₹{calculatePrice()}</strong>
            </div>
            <div className="wizard__controls">
              {step > 1 && <button className="btn-secondary hover-target" onClick={prevStep}><HiArrowLeft /> Back</button>}
              {step < 3 ? (
                <button className="btn-primary hover-target" onClick={nextStep}>Next <HiArrowRight /></button>
              ) : (
                <div className="wizard__submit-group">
                  <button className="order__submit order__submit--whatsapp hover-target" onClick={sendWhatsApp}><FaWhatsapp /> WhatsApp</button>
                  <button className="order__submit order__submit--email hover-target" onClick={sendEmail}><HiEnvelope /> Email</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
