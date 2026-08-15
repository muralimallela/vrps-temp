import Link from "next/link";
import {
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineScale,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 text-[#2B0904]">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#EECDA3] p-6 md:p-12">
        {/* Header */}
        <div className="border-b border-[#EECDA3]/70 pb-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5A1C16] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <HiOutlineShieldCheck className="h-4 w-4" />
              DPDP Act 2023 Compliant Notice
            </span>
            <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-0.5 text-[11px] font-bold text-amber-900">
              [LEGAL_REVIEW_REQUIRED]
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#5A1C16]">
            Privacy Notice & Data Protection Policy
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Effective Date: August 2026 | Version: v1.0-2026-08 | Applicable under Digital Personal Data Protection (DPDP) Act, 2023 & Information Technology Act, 2000
          </p>
        </div>

        {/* Legal Review Callout Alert */}
        <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3">
          <HiOutlineExclamationCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Notice to Legal Counsel / Compliance Officer:
            </p>
            <p className="leading-relaxed">
              This policy contains baseline legal representations formulated for compliance with the Indian Digital Personal Data Protection Act (DPDP), 2023. All sections marked with <code>[LEGAL_REVIEW_REQUIRED]</code> must be formally vetted by the Organization&apos;s legal counsel before statutory deployment.
            </p>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-[#FFF8EE] border border-[#EECDA3] p-4 text-xs font-semibold">
          <Link
            href="/data-rights"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EECDA3] text-[#5A1C16] hover:bg-[#FFF3E5] transition"
          >
            <span>Exercise Data Principal Rights (Access / Erase / Correct)</span>
            <HiOutlineArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <a
            href="#grievance-officer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EECDA3] text-[#5A1C16] hover:bg-[#FFF3E5] transition"
          >
            <span>Contact Grievance Redressal Officer</span>
            <HiOutlineArrowRight className="h-4 w-4 shrink-0" />
          </a>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>1. Introduction & Role as Data Fiduciary</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-2">
              <strong>Vaddera Reservation Porata Samithi (VRPS)</strong> (&quot;Organization&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) acts as the <strong>Data Fiduciary</strong> in respect of the personal data collected from members, donors, website visitors, and supporters (&quot;Data Principals&quot;).
            </p>
            <p>
              We are dedicated to processing your personal data lawfully, fairly, and transparently in strict adherence to the <strong>Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;)</strong>, the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>2. Personal Data We Collect</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              We practice data minimization and collect only personal data necessary for specified, explicit, and legitimate organizational purposes:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <p className="font-bold text-gray-900 mb-1">A. Identity & Contact Information</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Full Name</li>
                  <li>Mobile Phone Number (verified via Clerk authentication)</li>
                  <li>Email Address</li>
                  <li>Profile Avatar / Photograph</li>
                  <li>Clerk Authentication User Identifier</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <p className="font-bold text-gray-900 mb-1">B. Residential & Geographic Details</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>State & District</li>
                  <li>Mandal & Village</li>
                  <li>Street Address & Door Number</li>
                  <li>Postal Pincode</li>
                  <li>(Used for regional voter roll & ID card issuance)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <p className="font-bold text-gray-900 mb-1">C. Financial & Transactional Records</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Membership registration contribution amount</li>
                  <li>Voluntary donation amounts & payment frequencies</li>
                  <li>Razorpay Order ID & Transaction Reference ID</li>
                  <li><em>We never store credit card numbers, CVVs, or banking PINs</em></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <p className="font-bold text-gray-900 mb-1">D. Technical & Consent Audit Logs</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Consent grant and withdrawal timestamps</li>
                  <li>Consent text version identifier</li>
                  <li>IP address (for security audit and bot prevention)</li>
                  <li>Browser User-Agent and device category</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>3. Purposes of Processing & Lawful Grounds</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              We process personal data solely on the basis of <strong>freely given, specific, informed, unconditional, and unambiguous affirmative consent</strong> under Section 6 of the DPDP Act 2023, or for legitimate uses recognized under Section 7:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-[#FFF3E5] text-[#5A1C16] font-bold">
                  <tr>
                    <th className="p-3 border-b">Purpose</th>
                    <th className="p-3 border-b">Data Categories</th>
                    <th className="p-3 border-b">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3 font-semibold">Digital Member ID Card Issuance</td>
                    <td className="p-3">Name, Mobile, Address, Member ID, Photo</td>
                    <td className="p-3">Affirmative Consent (Section 6)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Payment & Donation Processing</td>
                    <td className="p-3">Name, Amount, Email, Transaction ID</td>
                    <td className="p-3">Contractual / Consent (Section 6)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Public Community Roll Listing</td>
                    <td className="p-3">Display Name, Membership Status</td>
                    <td className="p-3">Optional Granular Consent (Section 6)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Inquiries & Grievance Redressal</td>
                    <td className="p-3">Name, Email, Message, Tracking ID</td>
                    <td className="p-3">Consent & Legal Obligation (Section 13)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Audit Logs & Fraud Prevention</td>
                    <td className="p-3">IP Address, User Agent, Timestamps</td>
                    <td className="p-3">Legitimate Security Safeguards (Section 8)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>4. Data Retention Schedule</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-2">
              Personal data is retained only for as long as necessary to satisfy the purpose for which it was collected, or to comply with statutory retention requirements under Indian Law:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs text-gray-700">
              <li>
                <strong>Active Membership Records:</strong> Retained for the lifetime of active membership plus 3 years following membership lapse or inactivity.
              </li>
              <li>
                <strong>Financial & Donation Records:</strong> Retained for a mandatory statutory period of <strong>8 financial years</strong> in accordance with Section 44AA of the Income Tax Act, 1961 and applicable accounting rules.
              </li>
              <li>
                <strong>Consent Logs:</strong> Retained indefinitely as immutable proof of lawful compliance under Section 8(1) of the DPDP Act.
              </li>
              <li>
                <strong>Account Deletion / Erasure Requests:</strong> Personal identifying details are soft-deleted and anonymized upon verified request within 30 days, retaining only cryptographic transaction hashes for statutory audits.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>5. Third-Party Data Processors</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              We never sell, rent, or monetize your personal data. We engage only trusted <strong>Data Processors</strong> bound by strict technical and contractual data-protection agreements:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <strong className="text-gray-900">Razorpay Software Private Limited:</strong>
                  <p className="text-gray-600">PCI-DSS certified payment gateway used for online fee transactions and donation collections.</p>
                </div>
                <span className="text-emerald-700 font-bold shrink-0 ml-2">Payment Processor</span>
              </div>

              <div className="p-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <strong className="text-gray-900">Clerk Inc.:</strong>
                  <p className="text-gray-600">Identity and authentication provider managing secure sign-in tokens and user sessions.</p>
                </div>
                <span className="text-blue-700 font-bold shrink-0 ml-2">Identity Provider</span>
              </div>

              <div className="p-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <strong className="text-gray-900">Appwrite Cloud Infrastructure:</strong>
                  <p className="text-gray-600">Encrypted backend database and cloud storage for member records and media assets.</p>
                </div>
                <span className="text-purple-700 font-bold shrink-0 ml-2">Cloud Storage</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>6. Data Principal Rights (Under DPDP Act 2023)</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              As a Data Principal under Indian law, you possess enforceable statutory rights:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="p-3.5 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">A. Right to Access Information (Sec. 11)</strong>
                <p className="text-gray-600">You have the right to request a summary of personal data being processed and the identities of all third parties with whom your data has been shared.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">B. Right to Correction & Erasure (Sec. 12)</strong>
                <p className="text-gray-600">You have the right to correct inaccurate data, complete incomplete details, or request erasure of personal data no longer necessary.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">C. Right of Grievance Redressal (Sec. 13)</strong>
                <p className="text-gray-600">You have the right to register grievances with our designated Grievance Redressal Officer and receive resolution within 30 days.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#EECDA3] bg-[#FFFDF9]">
                <strong className="text-[#5A1C16] block mb-1">D. Right to Nominate (Sec. 14)</strong>
                <p className="text-gray-600">You have the right to nominate another individual who shall exercise your data rights in the event of death or incapacity.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#EECDA3] bg-[#FFFDF9] sm:col-span-2">
                <strong className="text-[#5A1C16] block mb-1">E. Right to Withdraw Consent (Sec. 6(4))</strong>
                <p className="text-gray-600">You may withdraw your consent for any processing purpose at any time easily via profile preferences or our Data Rights portal without affecting the lawfulness of past processing.</p>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/data-rights"
                className="inline-flex items-center gap-2 rounded-xl bg-[#5A1C16] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#3E120F] transition"
              >
                <span>Exercise Your Rights on our Data Rights Portal</span>
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Section 7 - Grievance Redressal */}
          <section id="grievance-officer" className="pt-4 border-t border-[#EECDA3]/60">
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>7. Grievance Redressal Officer & Escalation</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p className="mb-3">
              In accordance with Section 13 of the DPDP Act 2023 and Rule 5(9) of the IT SPDI Rules 2011, the details of the designated Data Protection & Grievance Redressal Officer are:
            </p>

            <div className="bg-[#FFF8EE] p-5 rounded-2xl border border-[#EECDA3] text-xs text-[#2B0904] space-y-2">
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 font-medium">Designation:</p>
                  <p className="font-bold text-[#5A1C16]">Data Protection & Grievance Redressal Officer</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Organization:</p>
                  <p className="font-bold">Vaddera Reservation Porata Samithi (VRPS)</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Official Email:</p>
                  <p className="font-bold">
                    <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline">
                      vaddera@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Telephone Helpline:</p>
                  <p className="font-bold">+91 9876543210</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-500 font-medium">Physical Address:</p>
                  <p className="font-bold">VRPS Central Headquarters, Telangana / Andhra Pradesh, India</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#EECDA3] text-gray-700 leading-relaxed">
                <p>
                  <strong>Statutory Redressal SLA:</strong> Inquiries are acknowledged within <strong>48 hours</strong> and resolved within <strong>30 calendar days</strong>.
                </p>
                <p className="mt-1">
                  <strong>Appeals to the Data Protection Board of India:</strong> If your grievance is not resolved satisfactorily within 30 days, you retain the statutory right under Section 13(3) of the DPDP Act to submit an appeal to the <strong>Data Protection Board of India (DPBI)</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#5A1C16] mb-3 flex items-center gap-2">
              <span>8. Updates to this Notice</span>
              <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded">[LEGAL_REVIEW_REQUIRED]</span>
            </h2>
            <p>
              We may update this Privacy Notice periodically to reflect evolving legal requirements or organizational practices. Any material changes will be notified via our website banner and require re-affirmation where required by law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
