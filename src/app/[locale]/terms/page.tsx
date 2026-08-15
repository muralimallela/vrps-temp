import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 text-[#2B0904]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#EECDA3] p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#5A1C16] mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: June 2026 | Effective immediately in compliance with Indian Laws
        </p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">1. Introduction & Acceptance</h2>
            <p>
              Welcome to <strong>Vaddera Reservation Porata Samithi (VRPS)</strong> (&quot;Organization&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our official website, registering for membership, or contributing voluntary donations, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;) and our Privacy Policy. If you do not agree to these terms, please do not access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">2. Eligibility</h2>
            <p>
              By registering or donating on this platform, you represent that you are at least 18 years of age and competent to enter into a legally binding contract under the Indian Contract Act, 1872. If you are accessing the site on behalf of an entity, you confirm you possess authority to bind that entity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">3. Membership & User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Accuracy:</strong> Users must provide true, accurate, and complete information during registration (via Clerk authentication).
              </li>
              <li>
                <strong>Membership Cards:</strong> Digital membership cards generated via the platform remain the property of VRPS. Unauthorized modification, misuse, or counterfeiting of digital ID cards is strictly prohibited.
              </li>
              <li>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">4. Donations & Payments</h2>
            <p>
              All financial transactions processed on our platform (membership fees, voluntary one-time or monthly contributions) are facilitated through authorized third-party payment gateways (Razorpay). By making a payment, you agree to abide by the gateway&apos;s terms. Please refer to our{" "}
              <Link href="/payment-policy" className="text-[#5A1C16] underline font-medium">
                Payment & Refund Policy
              </Link>{" "}
              for detailed cancellation and refund guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">5. User Conduct & Community Guidelines</h2>
            <p>
              Users agree not to upload, post, transmit, or share any content that is unlawful, defamatory, abusive, obscene, hateful, or derogatory toward any community, religion, or gender. VRPS reserves the right to terminate membership or access without prior notice for violations of these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">6. Intellectual Property Rights</h2>
            <p>
              All content, logos, designs, text, graphics, and software code on this website are the intellectual property of VRPS and protected under Indian Copyright and Trademark laws. Unauthorized reproduction is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">7. Limitation of Liability</h2>
            <p>
              VRPS and its office bearers shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the site, network outages, or unauthorized access to user transmissions or data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">8. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>9. Data Protection & DPDP Act (2023) Compliance</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              VRPS processes personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and our{" "}
              <Link href="/privacy" className="text-[#5A1C16] underline font-medium">
                Privacy Notice
              </Link>
              . By using this website, creating a membership profile, or submitting voluntary contributions:
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">A. Data Fiduciary Commitment & Processing Basis</strong>
                <p className="text-gray-600">
                  VRPS operates as a Data Fiduciary and processes your personal data strictly upon your affirmative consent or for recognized statutory purposes. We implement reasonable technical and organizational safeguards against personal data breaches.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">B. Statutory Duties of Data Principals (Section 15)</strong>
                <p className="text-gray-600 mb-1.5">
                  Under Section 15 of the DPDP Act 2023, every user (Data Principal) agrees and undertakes to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Not impersonate another person while providing personal data for membership, ID generation, or donations.</li>
                  <li>Not suppress any material information while providing address proof or personal details for community records.</li>
                  <li>Not file false or frivolous grievances or complaints with the Organization or the Data Protection Board of India.</li>
                  <li>Furnish only verifiably authentic and accurate information at all times.</li>
                </ul>
                <p className="text-[11px] text-amber-900 mt-2 font-medium">
                  <em>Note: Failure to adhere to Section 15 duties may attract statutory penalties up to ₹10,000 as prescribed under the DPDP Act 2023.</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">C. Exercise of Data Rights & Grievance Redressal</strong>
                <p className="text-gray-600">
                  You may exercise your statutory rights to access, correction, erasure, nomination, or consent withdrawal at any time via our{" "}
                  <Link href="/data-rights" className="text-[#5A1C16] underline font-medium">
                    Data Rights Portal
                  </Link>
                  . For unresolved grievances, you may contact our Nodal Grievance Officer at <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline font-medium">vaddera@gmail.com</a>.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">Contact Us</h2>
            <p>
              For any queries regarding these Terms, please contact our administrative team at{" "}
              <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline">
                vaddera@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
