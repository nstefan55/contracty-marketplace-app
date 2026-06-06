import ContactForm from "./ContactForm";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact | Contracty",
  description:
    "Get in touch with the Contracty team — questions, partnerships, or support.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@contracty.app",
    href: "mailto:hello@contracty.app",
  },
  {
    icon: MessageCircle,
    label: "Support",
    value: "support@contracty.app",
    href: "mailto:support@contracty.app",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Zagreb, Croatia",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 1–2 business days",
  },
];

const ContactPage = () => {
  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-white px-4 pt-16 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F97316]">
            Contact
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#071426] leading-tight">
            Let&apos;s talk.
          </h1>
          <p className="mt-5 text-gray-500 text-base sm:text-lg">
            Questions, feedback or a partnership idea? We read every message.
          </p>
        </div>
      </section>

      {/* Two-column: info + form */}
      <section className="w-full bg-white px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Channels */}
          <aside className="lg:col-span-2 flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold text-[#071525]">
              Other ways to reach us
            </h2>
            <ul className="flex flex-col gap-4">
              {CHANNELS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-primary-light text-primary-dark">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-[#071525] hover:text-[#F97316] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-[#071525]">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Looking for a tradesperson? You don&apos;t need to email us —
                browse profiles directly and message contractors from their
                page.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
