export const metadata = {
  title: "Privacy Policy | Contracty",
  description:
    "How Contracty collects, uses and protects your personal data, and the rights you have under GDPR.",
};

const SECTIONS = [
  {
    title: "1. Who we are",
    body: [
      "Contracty (the 'Service') is operated from Zagreb, Croatia. For the purposes of the General Data Protection Regulation (GDPR), Contracty is the controller of the personal data processed via the Service.",
    ],
  },
  {
    title: "2. What data we collect",
    body: [
      "Account information: name, email, profile image, password hash (if you sign up with email) or Google account identifier (if you use Google sign-in), and your role (homeowner or contractor).",
      "Contractor profile information: trade, bio, phone, service area, certifications, price range and portfolio media you choose to upload.",
      "Activity data: inquiries, reviews, bookmarks, search filters and basic usage events such as profile views.",
      "Technical data: IP address (for rate limiting and security), browser type and approximate location derived from the IP.",
    ],
  },
  {
    title: "3. Why we use your data",
    body: [
      "To create and operate your account, including authentication and role-based access.",
      "To match homeowners and contractors and to display profiles, reviews and portfolios.",
      "To send transactional emails such as verification codes, inquiry notifications and account-related messages.",
      "To prevent abuse, fraud and spam, and to keep the Service secure.",
      "To improve the Service through aggregate, non-identifying analytics.",
    ],
  },
  {
    title: "4. Legal basis (GDPR)",
    body: [
      "Contract: processing necessary to provide the Service you signed up for.",
      "Legitimate interests: keeping the Service secure, preventing fraud, and improving features.",
      "Consent: where we ask for it explicitly — for example, marketing emails (if introduced) or optional analytics cookies.",
      "Legal obligation: where we must retain data to comply with applicable laws.",
    ],
  },
  {
    title: "5. Sharing with third parties",
    body: [
      "We do not sell your personal data. We share it only with service providers who help us run the Service, under appropriate data-processing terms:",
      "MongoDB Atlas — database hosting.",
      "Google — OAuth sign-in (if you choose that method).",
      "Cloudinary — storage and delivery of uploaded images.",
      "Email and SMS providers — delivery of transactional messages.",
      "We may also disclose data when required by law or to protect the rights, property or safety of Contracty or others.",
    ],
  },
  {
    title: "6. Cookies and similar technologies",
    body: [
      "We use a small number of cookies that are strictly necessary to keep you signed in and to protect the Service from abuse. We do not currently use advertising cookies.",
    ],
  },
  {
    title: "7. Data retention",
    body: [
      "We keep your account data for as long as your account is active. If you delete your account, we remove or anonymise personal data within a reasonable timeframe, except where we are required by law to retain certain information.",
    ],
  },
  {
    title: "8. Your rights under GDPR",
    body: [
      "You have the right to access, correct, delete or export your personal data, and to restrict or object to certain processing. To exercise any of these rights, email privacy@contracty.app — we'll respond within one month.",
      "You also have the right to lodge a complaint with your local data protection authority. In Croatia, that is the Croatian Personal Data Protection Agency (AZOP).",
    ],
  },
  {
    title: "9. Security",
    body: [
      "We use industry-standard measures to protect your data, including encrypted connections (HTTPS), hashed passwords and access controls. No method of transmission or storage is 100% secure, but we work hard to minimise risk.",
    ],
  },
  {
    title: "10. International transfers",
    body: [
      "Some of our service providers may process data outside the European Economic Area. Where that happens, we rely on adequacy decisions or Standard Contractual Clauses to ensure your data is protected to GDPR standards.",
    ],
  },
  {
    title: "11. Children",
    body: [
      "Contracty is not directed at children under 16, and we do not knowingly collect their personal data. If you believe a child has provided us with personal data, please contact us so we can remove it.",
    ],
  },
  {
    title: "12. Changes to this policy",
    body: [
      "We may update this policy as the Service evolves. The 'Last updated' date below will always reflect the latest revision. Material changes will be communicated through the Service.",
    ],
  },
  {
    title: "13. Contact",
    body: [
      "Privacy questions or requests? Email privacy@contracty.app or use our contact page.",
    ],
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-white px-4 pt-16 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F97316]">
            Legal
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#071426] leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-5 text-gray-500 text-base">
            Last updated: 6 June 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="w-full bg-white px-4 pb-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <p className="text-gray-500 leading-relaxed">
            This Privacy Policy explains what personal data Contracty collects,
            why we collect it, how we use it and the rights you have over it
            under the EU General Data Protection Regulation (GDPR).
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-3">
              <h2 className="text-lg font-extrabold text-[#071525]">{title}</h2>
              {body.map((p, i) => (
                <p key={i} className="text-gray-500 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
