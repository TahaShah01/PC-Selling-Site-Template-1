import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { BUSINESS } from "@/data/business";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Daddu Charger team for support, custom build inquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section>
          <Container className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="dc-eyebrow mb-4">Get in Touch</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--dc-text)] mb-6">
                We're Here to Help.
              </h1>
              <p className="text-lg text-[var(--dc-text-muted)] max-w-2xl mx-auto">
                Have a question about a custom build, need technical support, or want to check stock? Reach out to our experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-accent)]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--dc-text)] mb-1">Visit Our Store</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">{BUSINESS.address}</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">{BUSINESS.city}, {BUSINESS.country}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-accent)]">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--dc-text)] mb-1">Call Us</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">{BUSINESS.phone}</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#25D366] bg-opacity-10 flex items-center justify-center text-[#25D366]">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--dc-text)] mb-1">WhatsApp Support</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">{BUSINESS.whatsapp}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-accent)]">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--dc-text)] mb-1">Email</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">{BUSINESS.email}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-accent)]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--dc-text)] mb-1">Business Hours</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">Mon-Fri: {BUSINESS.hours.weekdays}</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">Saturday: {BUSINESS.hours.saturday}</p>
                      <p className="text-sm text-[var(--dc-text-muted)]">Sunday: {BUSINESS.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[var(--dc-card)] border border-[var(--dc-border)] rounded-[var(--dc-radius-2xl)] p-8">
                <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="text-sm font-medium text-[var(--dc-text-subtle)]">First Name</label>
                      <input type="text" id="firstName" className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--dc-accent)]" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="text-sm font-medium text-[var(--dc-text-subtle)]">Last Name</label>
                      <input type="text" id="lastName" className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--dc-accent)]" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-[var(--dc-text-subtle)]">Email Address</label>
                    <input type="email" id="email" className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--dc-accent)]" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-medium text-[var(--dc-text-subtle)]">Subject</label>
                    <select id="subject" className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--dc-accent)] text-[var(--dc-text)]">
                      <option>General Inquiry</option>
                      <option>Custom PC Build</option>
                      <option>Order Status</option>
                      <option>Technical Support</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-[var(--dc-text-subtle)]">Message</label>
                    <textarea id="message" rows={5} className="w-full bg-[var(--dc-bg)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] px-4 py-2 text-sm focus:outline-none focus:border-[var(--dc-accent)] resize-none"></textarea>
                  </div>

                  <button type="button" className="w-full bg-[var(--dc-accent)] text-[var(--dc-accent-text)] font-semibold rounded-[var(--dc-radius-md)] py-3 hover:bg-[var(--dc-accent-hover)] transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
