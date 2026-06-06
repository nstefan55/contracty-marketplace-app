export const metadata = {
  title: "Terms of Service | Contracty",
  description:
    "The terms governing your use of Contracty as a homeowner or contractor.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of these terms",
    body: [
      "By creating an account or otherwise using Contracty (the 'Service'), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.",
    ],
  },
  {
    title: "2. The service",
    body: [
      "Contracty is a marketplace that connects homeowners with independent tradespeople ('Contractors'). We are not a party to any agreement made between homeowners and Contractors, and we do not perform, supervise, or guarantee any work.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You must provide accurate information when creating an account and keep your credentials confidential. You are responsible for all activity that occurs under your account.",
      "You must be at least 18 years old to use the Service.",
    ],
  },
  {
    title: "4. Contractor obligations",
    body: [
      "Contractors must hold all licenses, certifications and insurance required for the work they offer, comply with all applicable laws, and represent themselves and their work truthfully on the Service.",
    ],
  },
  {
    title: "5. Homeowner obligations",
    body: [
      "Homeowners agree to communicate respectfully, describe their projects honestly, and resolve disputes about workmanship or payment directly with the relevant Contractor.",
    ],
  },
  {
    title: "6. Reviews and content",
    body: [
      "By posting reviews, portfolio images or other content, you confirm that the content is yours to share and grant Contracty a non-exclusive, worldwide license to display it on the Service.",
      "We may remove content that is unlawful, misleading, or violates these terms.",
    ],
  },
  {
    title: "7. Fees",
    body: [
      "Basic use of the Service is free. Paid features may be introduced; we will tell you about pricing before you incur a charge.",
    ],
  },
  {
    title: "8. Disclaimers",
    body: [
      "The Service is provided on an 'as is' and 'as available' basis. To the maximum extent permitted by law, Contracty disclaims all warranties — express or implied — including merchantability, fitness for a particular purpose, and non-infringement.",
    ],
  },
  {
    title: "9. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, Contracty will not be liable for any indirect, incidental, special or consequential damages arising out of your use of the Service or any agreement you enter into with a Contractor or homeowner you found through it.",
    ],
  },
  {
    title: "10. Termination",
    body: [
      "You can stop using the Service at any time. We may suspend or terminate accounts that breach these terms or harm other users.",
    ],
  },
  {
    title: "11. Changes to these terms",
    body: [
      "We may update these terms from time to time. Material changes will be communicated by updating the date below. Continued use of the Service constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "12. Governing law",
    body: [
      "These terms are governed by the laws of the Republic of Croatia. Disputes will be resolved in the competent courts of Croatia, unless local law requires otherwise.",
    ],
  },
  {
    title: "13. Contact",
    body: [
      "Questions about these terms? Email hello@contracty.app or use our contact page.",
    ],
  },
];

const TermsOfServicePage = () => {
  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-white px-4 pt-16 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F97316]">
            Legal
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#071426] leading-tight">
            Terms of Service
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
            These Terms of Service (the &quot;Terms&quot;) describe the rules
            for using Contracty. Please read them carefully — they include
            important information about your rights and obligations.
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

export default TermsOfServicePage;
