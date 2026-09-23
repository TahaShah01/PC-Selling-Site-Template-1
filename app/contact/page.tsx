"use client";

import * as React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { Button } from "@/components/primitives/Button";
import { BUSINESS } from "@/data/business";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

export default function ContactPage() {
  const [timeStr, setTimeStr] = React.useState("...");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "Custom Build Inquiry",
    message: ""
  });

  // Live PKT time & open status
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Rawalpindi is UTC+5
      const pktOptions: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Karachi', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      };
      setTimeStr(new Intl.DateTimeFormat('en-US', pktOptions).format(now));
      
      const pktHour = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })).getHours();
      // Assume open 11 AM to 9 PM
      setIsOpen(pktHour >= 11 && pktHour < 21);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SiteHeader />
      <PageShell>
        <div className="relative">
          {/* Split Hero */}
          <PageHero
            eyebrow="Contact Support"
            headline={["Get in", "touch."]}
            body="Whether you need a custom build quote, technical support, or just want to talk hardware."
          >
            {/* Live Status indicator attached to hero */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] mt-4">
              <span className="relative flex h-3 w-3">
                {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--dc-accent)] opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? "bg-[var(--dc-accent)]" : "bg-red-500"}`}></span>
              </span>
              <span className="text-sm font-medium text-[var(--dc-text)]">
                {isOpen ? "We're currently open" : "We're currently closed"}
              </span>
              <span className="text-sm text-[var(--dc-text-subtle)] border-l border-[var(--dc-border)] pl-3 ml-1">
                Rawalpindi: {timeStr}
              </span>
            </div>
          </PageHero>
        </div>

        <RevealSection className="dc-container py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left: Contact Methods */}
            <div className="lg:col-span-2 space-y-4">
              <ContactCard 
                icon={<MessageCircle />}
                title="WhatsApp"
                value={BUSINESS.phone}
                href={`https://wa.me/${BUSINESS.phone.replace(/[^0-9]/g, '')}`}
                primary
              />
              <ContactCard 
                icon={<Phone />}
                title="Phone"
                value={BUSINESS.phone}
                href={`tel:${BUSINESS.phone.replace(/[^0-9]/g, '')}`}
              />
              <ContactCard 
                icon={<Mail />}
                title="Email"
                value={BUSINESS.email}
                href={`mailto:${BUSINESS.email}`}
              />
              
              <div className="p-8 rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface-2)] mt-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[var(--dc-text-muted)] mt-1" />
                  <div>
                    <h3 className="font-bold text-[var(--dc-text)] mb-2">Daddu Charger Workshop</h3>
                    <p className="text-[var(--dc-text-muted)] leading-relaxed mb-4">
                      {BUSINESS.address.split(',').map((line, i) => (
                        <span key={i} className="block">{line.trim()}</span>
                      ))}
                    </p>
                    <a 
                      href={(BUSINESS as any).mapsLink || `https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--dc-accent)] hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 mt-6 pt-6 border-t border-[var(--dc-border)]">
                  <Clock className="text-[var(--dc-text-muted)] mt-1" />
                  <div>
                    <h3 className="font-bold text-[var(--dc-text)] mb-2">Store Hours</h3>
                    <div className="text-[var(--dc-text-muted)] space-y-1 text-sm">
                      <p>Mon-Fri: {BUSINESS.hours.weekdays}</p>
                      <p>Saturday: {BUSINESS.hours.saturday}</p>
                      <p>Sunday: {BUSINESS.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 lg:p-10 rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)]">
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--dc-orange-dim)] text-[var(--dc-accent)] mb-4">
                      <MessageCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[var(--dc-text)] mb-2">Message Received!</h2>
                    <p className="text-[var(--dc-text-muted)] max-w-md mx-auto mb-6">
                      Thank you for contacting Daddu Charger. Our team in Rawalpindi typically responds within 2 business hours during operating hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({ name: "", email: "", subject: "Custom Build Inquiry", message: "" });
                        }}
                      >
                        Send Another Message
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        href={`https://wa.me/${BUSINESS.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Chat on WhatsApp Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold mb-6">Send us a message</h2>
                    <form 
                      className="space-y-6" 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!formData.name || !formData.email || !formData.message) return;
                        setIsSubmitting(true);
                        setTimeout(() => {
                          setIsSubmitting(false);
                          setFormSubmitted(true);
                        }, 800);
                      }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-[var(--dc-text-muted)]">Name *</label>
                          <input 
                            type="text" 
                            id="name" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-lg)] px-4 py-3 text-[var(--dc-text)] focus:border-[var(--dc-accent)] focus:outline-none transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-[var(--dc-text-muted)]">Email *</label>
                          <input 
                            type="email" 
                            id="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-lg)] px-4 py-3 text-[var(--dc-text)] focus:border-[var(--dc-accent)] focus:outline-none transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-[var(--dc-text-muted)]">Subject</label>
                        <select 
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-lg)] px-4 py-3 text-[var(--dc-text)] focus:border-[var(--dc-accent)] focus:outline-none transition-colors appearance-none"
                        >
                          <option>Custom Build Inquiry</option>
                          <option>Order Support</option>
                          <option>Product Availability</option>
                          <option>Warranty Claim</option>
                          <option>Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-[var(--dc-text-muted)]">Message *</label>
                        <textarea 
                          id="message" 
                          rows={5}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-lg)] px-4 py-3 text-[var(--dc-text)] focus:border-[var(--dc-accent)] focus:outline-none transition-colors resize-none"
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                      
                      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </RevealSection>
        
        <ClosingCTA />
      </PageShell>
      <SiteFooter />
    </>
  );
}

function ContactCard({ icon, title, value, href, primary }: { icon: React.ReactNode, title: string, value: string, href: string, primary?: boolean }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer" 
      className={`flex items-center gap-6 p-6 rounded-[var(--dc-radius-xl)] border transition-all duration-[var(--dc-duration-normal)] group ${
        primary 
          ? "border-[var(--dc-accent)] bg-[var(--dc-accent)]/5 hover:bg-[var(--dc-accent)]/10" 
          : "border-[var(--dc-border)] bg-[var(--dc-surface)] hover:border-[var(--dc-accent)]"
      }`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
        primary 
          ? "bg-[var(--dc-accent)] text-[var(--dc-bg)] border-transparent" 
          : "bg-[var(--dc-bg)] text-[var(--dc-text)] border-[var(--dc-border)] group-hover:border-[var(--dc-accent)] group-hover:text-[var(--dc-accent)]"
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--dc-text-subtle)] mb-1">{title}</p>
        <p className="text-lg font-bold text-[var(--dc-text)]">{value}</p>
      </div>
    </a>
  );
}
