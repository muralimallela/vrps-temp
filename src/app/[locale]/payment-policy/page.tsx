import Link from "next/link";

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 text-[#2B0904]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#EECDA3] p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#5A1C16] mb-2">
          Payment, Refund & Cancellation Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: June 2026 | Mandated for Razorpay Payment Gateway Compliance
        </p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">1. Payment Processing</h2>
            <p>
              All online payments on the <strong>Vaddera Reservation Porata Samithi (VRPS)</strong> portal, including membership registration fees and voluntary contributions, are securely processed via Razorpay Software Private Limited. Payments are accepted in Indian Rupees (INR) using Credit/Debit Cards, Net Banking, Unified Payments Interface (UPI), and authorized Wallets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">2. Voluntary Donations</h2>
            <p>
              Donations made to VRPS are voluntary contributions used exclusively for social community welfare, awareness programs, empowerment initiatives, and organizational maintenance.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Non-Refundable Nature:</strong> As contributions are immediately allocated toward community welfare activities, voluntary donations once successfully processed are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">3. Membership Fees</h2>
            <p>
              Membership registration fees support administrative operations and digital ID card issuance. Membership fees are non-refundable once an official digital membership ID card has been generated and issued to the member.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">4. Failed Transactions & Double Deductions</h2>
            <p>
              In the event of a technical glitch, bank server downtime, or double deduction where money is debited from your account but the payment status displays as &quot;Failed&quot; or &quot;Pending&quot; on our portal:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Automated Bank Refunds:</strong> In most cases, payment gateways and banking networks auto-refund failed debits within 5 to 7 business days directly to the original payment source.</li>
              <li><strong>Manual Verification:</strong> If your account has been debited twice for a single transaction or if you do not receive an auto-refund within 7 business days, please write to us at <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline font-medium">vaddera@gmail.com</a> with your transaction reference ID and proof of payment. Verified excess debits will be refunded within 7–10 working days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">5. Monthly Recurring Subscription Cancellation</h2>
            <p>
              Supporters who opt for recurring monthly contributions via Razorpay subscriptions can cancel their monthly auto-debit recurring payments at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Cancellation Process:</strong> You may request cancellation by navigating to your user dashboard or emailing us at least 3 business days prior to the next billing date.</li>
              <li><strong>Post-Cancellation:</strong> Once cancelled, no further automated monthly debits will occur. Past monthly contributions processed prior to the cancellation date are non-refundable.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-[#5A1C16] mb-3">Need Help with Payments?</h2>
            <p>
              For any payment assistance, receipt queries, or billing clarifications, please contact our financial support team at{" "}
              <a href="mailto:vaddera@gmail.com" className="text-[#5A1C16] underline font-medium">
                vaddera@gmail.com
              </a>{" "}
              or call +91 9876543210.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
