'use client';

import { Phone, Send, MessageCircle, ArrowRight, Paperclip } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    // Manually construct FormData to guarantee a perfectly clean payload
    const form = e.currentTarget;
    const formDataToSubmit = new FormData();
    
    formDataToSubmit.append("fi-sender-fullName", formData.name);
    formDataToSubmit.append("fi-sender-phone", formData.phone);
    formDataToSubmit.append("fi-sender-email", formData.email);
    formDataToSubmit.append("fi-text-subject", formData.subject);
    formDataToSubmit.append("fi-text-message", formData.message);

    // Safely append files only if they actually exist and have content
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach((file) => {
        if (file.size > 0) {
          // Use [] syntax so the backend knows to expect an array of files
          formDataToSubmit.append("fi-file-attachment[]", file);
        }
      });
    }

    try {
      const res = await fetch("https://getform.io/f/os7pmf0zkrv", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataToSubmit,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Getform API Error Status:", res.status);
        console.error("Getform API Error Body:", errorText);
        alert(`Message Failed to Send (Code: ${res.status}). Please try again or use WhatsApp.`);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }
      
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setFileName('');
      if (formRef.current) formRef.current.reset();
      setTimeout(() => setStatus('idle'), 5000);
      
    } catch (error: unknown) {
      console.error("Fetch Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Network Error: Could not connect to the server. (${errorMessage})`);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <main className="contact-page">
      <div className="container contact-container">
        
        {/* Left Column: Hero Text & Direct Contacts */}
        <div className="contact-content-left">
          <span className="subtitle">Let&apos;s Connect</span>
          <h1 className="title">Frame Your<br/>Moments<span className="gold-slash">.</span></h1>
          <p className="description">
            Looking for a custom design, corporate gifting, or just have a question? 
            Send us a message directly to our inbox or connect instantly via WhatsApp.
          </p>

          <div className="direct-contact-cards">
            <a href="https://api.whatsapp.com/send?phone=94750350109" target="_blank" rel="noopener noreferrer" className="info-card glass" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex' }}>
              <div className="icon-box whatsapp"><MessageCircle size={28} /></div>
              <div className="info-text">
                <span className="label">Fastest Response</span>
                <h3>WhatsApp Chat</h3>
                <p>Click to message instantly</p>
              </div>
              <ArrowRight className="action-arrow" size={20} />
            </a>

            <div className="info-card glass">
              <div className="icon-box"><Phone size={28} /></div>
              <div className="info-text">
                <span className="label">Direct Line</span>
                <h3>+94 75 035 0109</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Form */}
        <div className="contact-form-right">
          <div className="form-glass-container">
            <h2 className="form-title">Send an Inquiry</h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="premium-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+94 7X XXX XXXX" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="E.g., Custom Wood Frame Quote" 
                  required 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message"
                  rows={4} 
                  placeholder="Tell us about the details of your project..." 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group file-upload-group">
                <input 
                  type="file" 
                  name="attachment" 
                  id="attachment" 
                  accept="image/*" 
                  multiple 
                  className="hidden-file-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileName(e.target.files.length === 1 ? e.target.files[0].name : `${e.target.files.length} images selected`);
                    } else {
                      setFileName('');
                    }
                  }}
                />
                <label htmlFor="attachment" className="file-upload-label">
                  <Paperclip size={18} />
                  {fileName ? fileName : 'Attach Images (Optional)'}
                </label>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${status}`}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'SENDING SECURELY...' : 
                 status === 'success' ? 'MESSAGE SENT SUCCESSFULLY ✓' : 
                 status === 'error' ? 'ERROR - PLEASE TRY AGAIN' : 
                 'SEND SECURE MESSAGE'}
                 {status === 'idle' && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>

      </div>

      <style jsx>{`
        .contact-page {
          padding: 140px 0 100px;
          min-height: 100vh;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        /* Background Ambient Glow */
        .contact-page::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 6rem;
          position: relative;
          z-index: 10;
        }

        /* Left Side Typography */
        .contact-content-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .subtitle {
          color: var(--primary);
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: inline-block;
        }
        .title {
          font-size: clamp(3.5rem, 6vw, 5rem);
          font-family: var(--font-elegant);
          font-weight: 400;
          letter-spacing: -2px;
          line-height: 0.95;
          margin-bottom: 2rem;
          color: var(--foreground);
        }
        .gold-slash { color: var(--primary); }
        .description {
          font-size: 1.15rem;
          line-height: 1.8;
          opacity: 0.6;
          margin-bottom: 4rem;
          max-width: 450px;
        }

        /* Direct Contact Cards */
        .direct-contact-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .info-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.8rem;
          border-radius: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .info-card[onClick] { cursor: pointer; }
        .info-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(212,175,55,0.5);
          transform: translateX(10px);
        }
        .icon-box {
          width: 55px;
          height: 55px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--foreground);
        }
        .icon-box.whatsapp {
          background: rgba(37, 211, 102, 0.1);
          color: #25D366;
        }
        .label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 0.3rem;
          display: block;
        }
        .info-text h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.2rem; }
        .info-text p { font-size: 0.85rem; opacity: 0.5; }
        .action-arrow {
          position: absolute;
          right: 2rem;
          opacity: 0;
          color: var(--primary);
          transition: 0.3s;
          transform: translateX(-10px);
        }
        .info-card:hover .action-arrow { opacity: 1; transform: translateX(0); }

        /* Right Side Form */
        .contact-form-right {
          display: flex;
          align-items: center;
        }
        .form-glass-container {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          padding: 3.5rem;
          border-radius: 40px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }
        .form-title {
          font-size: 1.8rem;
          margin-bottom: 2.5rem;
          font-family: var(--font-heading);
          font-weight: 700;
        }
        
        .premium-form { display: grid; gap: 1.5rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .form-group label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 800;
          opacity: 0.5;
        }
        .form-group input, .form-group textarea {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.2rem;
          border-radius: 16px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 4px rgba(212,175,55,0.1);
        }

        /* File Upload Styling */
        .hidden-file-input { display: none; }
        .file-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: rgba(255,255,255,0.01);
          border: 1px dashed rgba(255,255,255,0.2);
          padding: 1.2rem;
          border-radius: 16px;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        .file-upload-label:hover {
          background: rgba(255,255,255,0.04);
          border-color: var(--primary);
        }

        .submit-btn {
          background: var(--primary);
          color: black;
          border: none;
          padding: 1.2rem;
          border-radius: 100px;
          font-weight: 800;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: 0.4s;
          margin-top: 1rem;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .submit-btn.success { background: #25D366; color: white; border-color: #25D366; }
        .submit-btn.error { background: #ff4444; color: white; border-color: #ff4444; }

        @media (max-width: 1024px) {
          .contact-container { grid-template-columns: 1fr; gap: 4rem; }
          .contact-content-left { text-align: center; align-items: center; }
          .description { max-width: 600px; }
          .info-card:hover { transform: translateY(-5px); }
        }
        @media (max-width: 768px) {
          .contact-page { padding: 110px 0 60px; }
          .title { font-size: 3rem; }
          .form-glass-container { padding: 2rem; border-radius: 24px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
