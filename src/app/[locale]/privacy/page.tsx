import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 text-[#2B0904]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#EECDA3] p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#5A1C16] mb-2">
          User Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: June 2026 | Compliant with IT Act 2000 & Digital Personal Data Protection Act (DPDP) 2023
        </p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">1. Overview</h2>
            <p>
              <strong>Vaddera Reservation Porata Samithi (VRPS)</strong> is committed to safeguarding the privacy of our members, supporters, and visitors. This Privacy Policy outlines how we collect, use, store, disclose, and protect your Personal Information in accordance with the Information Technology Act, 2000, the SPDI Rules 2011, and the Digital Personal Data Protection Act (DPDP) 2023 of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect personal details necessary to provide organizational services, verify identity, and manage contributions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Information:</strong> Name, photo, mobile number, email address, and Clerk authentication ID.</li>
              <li><strong>Address Details:</strong> State, district, mandal, village, street address, and pincode for regional identification.</li>
              <li><strong>Financial & Transaction Data:</strong> Payment IDs, transaction status, donation amounts, and membership fees. <em>Note: We do not store credit card numbers or banking passwords; payment processing is securely handled by Razorpay.</em></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To issue official community membership digital ID cards with QR verification.</li>
              <li>To process membership payments and voluntary donations.</li>
              <li>To manage community communications, news updates, and event notifications.</li>
              <li>To maintain administrative audit logs and regulatory compliance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">4. Public Visibility & User Consent Preferences</h2>
            <p>
              We respect your privacy preferences. Through your profile settings, you have granular control over how your information is displayed publicly on our member lists and supporter leaderboards:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Private (Default):</strong> Your details remain strictly visible only to administrative officers.</li>
              <li><strong>Public:</strong> Your public display name and membership status are shown publicly.</li>
              <li><strong>Anonymous:</strong> Your contribution is listed publicly without displaying your name or mobile number.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">5. Data Sharing & Third-Party Service Providers</h2>
            <p>
              We do not sell, trade, or rent user personal data to third parties. We share data only with trusted infrastructure providers bound by confidentiality obligations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Razorpay:</strong> Payment processing gateway.</li>
              <li><strong>Clerk Authentication:</strong> Secure user sign-in & identity management.</li>
              <li><strong>Appwrite Cloud / Infrastructure:</strong> Encrypted backend database storage.</li>
              <li><strong>Legal Authorities:</strong> When required by court order or Indian law enforcement agencies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">6. Data Security & Storage</h2>
            <p>
              We implement technical and organizational security measures, including HTTPS encryption, strict access controls, and encrypted database infrastructure to protect personal data against unauthorized access, loss, or alteration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">7. Grievance Redressal Officer</h2>
            <p className="mb-2">
              In accordance with the Information Technology Act 2000 and rules made thereunder, the details of the Nodal & Grievance Officer for privacy matters are:
            </p>
            <div className="bg-[#FFF8EE] p-4 rounded-xl border border-[#EECDA3] text-sm text-[#2B0904]">
              <p><strong>Grievance Officer:</strong> Administrative Nodal Officer, VRPS</p>
              <p><strong>Email:</strong> <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline">vaddera@gmail.com</a></p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Address:</strong> Vaddera Reservation Porata Samithi Headquarters, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
