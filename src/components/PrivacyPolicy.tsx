'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import { Shield, Eye, Lock, RefreshCw, Mail, Phone, MapPin, Globe, CheckCircle } from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-neutral-600 dark:text-neutral-400 pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#D72626] text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Compliance & Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-xl mx-auto">
            Effective Date: July 7, 2026. This Privacy Policy details how Rebon Motor Company collects, protects, and handles your information, ensuring full compliance with Meta Platforms and WhatsApp Cloud API standards.
          </p>
        </div>

        {/* Quick Summary Banner */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-[#D72626]/20 p-6 rounded-2xl space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#D72626]" />
            <span>Core Privacy Assurances</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72626]" />
              <span>We never sell your personal data to third parties.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72626]" />
              <span>WhatsApp message data is processed strictly for support.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72626]" />
              <span>All communications are transmitted over secure TLS protocols.</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72626]" />
              <span>You retain full rights to request data deletion at any time.</span>
            </li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl space-y-8 shadow-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              1. Introduction
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Welcome to Rebon Motor Company. We manufacture and sell electric bikes, petrol bikes, electric scooters, spare parts, and provide dealership services globally. We value your privacy and are committed to protecting your personal data. This policy explains our practices regarding data collection, usage, and sharing when you visit our website, utilize our support tools, or connect with us via Meta services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-1 h-3 bg-[#D72626] rounded-sm" />
                  <span>Personal Information</span>
                </h4>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  When you submit forms, register interest in dealership partnerships, subscribe to newsletters, or schedule test rides, we collect personal identity info. This includes your name, email address, phone number, company name, address, region, and details of vehicle preference.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-1 h-3 bg-[#D72626] rounded-sm" />
                  <span>Device & Analytics Information</span>
                </h4>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  We automatically log standard technical data when you browse our website. This includes browser type, device identifiers, operating system version, page referrers, and generalized IP locations used solely to generate anonymized traffic metrics.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-1 h-3 bg-[#D72626] rounded-sm" />
                  <span>Cookies and Tracking</span>
                </h4>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  We use cookies to maintain your preferences (such as your chosen bike colors or range calculation units). You can choose to disable cookies through your browser preferences, though this may disable certain interactive features.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              3. WhatsApp Communication & Meta Integration
            </h2>
            <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Rebon Motor Company actively integrates with Meta Developer platforms and uses the WhatsApp Cloud API to facilitate instant customer support, booking confirmations, and transactional updates.
              </p>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span>WhatsApp Cloud API Usage</span>
                </h4>
                <p>
                  When you communicate with us via WhatsApp links or chatbots on our website, your phone number and conversation records are transmitted securely through Meta's WhatsApp Cloud API infrastructure. This data is handled in strict compliance with the Meta Platform Terms and Developer Policies.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span>Facebook Login Support (Future Integration)</span>
                </h4>
                <p>
                  Our authentication service is designed to support Facebook Login in future releases. When integrated, we will collect authorized profile attributes (such as your public name and email) solely to simplify account registration. We will never post back to your profile or distribute your social graph.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span>Purpose Limitation & Communication Integrity</span>
                </h4>
                <p>
                  Your phone number, chat history, and messages are processed <strong>strictly to deliver direct customer support and handle inquiries</strong>. We will never use these channels to send unsolicited spam, and we strictly prohibit selling or sharing communication records with external marketers or advertising networks.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              4. Data Usage & Legal Basis
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              We process your personal information under the following legal foundations: (a) your explicit consent (e.g. subscribing to newsletter bulletins), (b) execution of a contract (e.g. registering dealership agreements), and (c) legitimate interest in delivering customer service, managing platform security, and troubleshooting website operations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              5. Data Sharing & Third-Party Services
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              We do not share your information with third parties except as necessary to fulfill service delivery: specifically, transmitting transactional records through API service providers (like Meta) or database hosting services. We disclose information only when legally mandated by statutory enforcement bodies or to defend our intellectual property rights.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              6. Security & Data Retention
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Your personal details are stored inside encrypted database layers. WhatsApp Cloud API transactions are processed using industry-standard secure socket layers (TLS/HTTPS). We retain your data only for as long as needed to support your active inquiries or dealership relationship. Anonymized analytics traffic data may be preserved indefinitely.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              7. User Rights & Data Deletion
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              You possess the right to view, modify, or restrict the processing of your personal information. Under Meta Developer rules, we support instant data erasure. If you wish to delete your account, contact logs, phone records, or request complete removal of your information from our systems, please submit a written directive to our security desk at <strong className="text-neutral-900 dark:text-white">support@rebonmotorcompany.com.pk</strong>. Your requests will be processed within 15 business days.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              8. Children's Privacy
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Our website, products, and dealership platforms are not intended for children under the age of 13. We do not intentionally compile information from children, and will delete any such information immediately if discovered.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              9. International Data Transfers
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Because our website hosting and Meta APIs process information globally, your details may traverse border lines into servers situated in Europe, North America, or South Asia. We mandate that our processing partners implement robust data protection standards equivalent to cross-border transfer agreements.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              10. Changes to this Policy
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              We reserve the right to revise this Privacy Policy to ensure alignment with Meta Developer guidelines or international privacy regulations. Changes will be posted to this page with an updated effective date.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              11. Contact Information
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              For security requests, policy disputes, or data erasure directives, please communicate directly with our representative office:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-neutral-50 dark:bg-neutral-950 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="space-y-2">
                <p className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300">
                  <Globe className="w-4 h-4 text-[#D72626]" />
                  <span><strong>Company:</strong> Rebon Motor Company</span>
                </p>
                <p className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300">
                  <Mail className="w-4 h-4 text-[#D72626]" />
                  <span><strong>Email:</strong> support@rebonmotorcompany.com.pk</span>
                </p>
                <p className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300">
                  <Phone className="w-4 h-4 text-[#D72626]" />
                  <span><strong>Phone:</strong> 0323-6659451</span>
                </p>
              </div>
              <div className="flex items-start space-x-2 text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-[#D72626] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Office Address:</strong><br />
                  Army Market, Near Punjab Bank,<br />
                  Airport Road, Bahawalpur,<br />
                  Punjab, Pakistan
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#D72626] text-white text-xs font-bold uppercase rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-lg"
          >
            <span>Return to Landing Page</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
