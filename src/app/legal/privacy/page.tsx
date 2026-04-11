import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Dukshaft LLC",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-24 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-12">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground font-medium">Dukshaft LLC</p>
          <p className="text-sm text-muted-foreground">Last Updated: April 9, 2026</p>
        </header>

        <div className="space-y-10 text-base leading-relaxed text-foreground/90">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">1. Introduction</h2>
            <p>
              Dukshaft LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting it through this Privacy Policy.
            </p>
            <p>This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Visit our websites</li>
              <li>Use our mobile applications (iOS and Android)</li>
              <li>Access our software-as-a-service (&ldquo;SaaS&rdquo;) platforms</li>
              <li>Engage with our services in any manner</li>
            </ul>
            <p>By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">2. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>

            <div className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
              <p>Information that identifies you as an individual, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Account credentials (username, encrypted password)</li>
                <li>Billing and payment details</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">2.2 Usage Data</h3>
              <p>Automatically collected data, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>IP address</li>
                <li>Device type and operating system</li>
                <li>App usage statistics (e.g., sessions, time spent)</li>
                <li>Crash logs and performance diagnostics</li>
                <li>Browser type and access times</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">2.3 User Content</h3>
              <p>Information you voluntarily provide, such as:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Notes, files, or content created within apps (e.g., Pomonote)</li>
                <li>Uploaded media or documents</li>
                <li>Messages or support inquiries</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">2.4 Cookies and Tracking Technologies</h3>
              <p>We may use cookies, pixels, and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Improve user experience</li>
                <li>Analyze traffic and behavior</li>
                <li>Store user preferences</li>
              </ul>
              <p>You may disable cookies via your browser settings.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide, operate, and maintain our services</li>
              <li>Authenticate users and manage accounts</li>
              <li>Process transactions and payments</li>
              <li>Improve functionality, performance, and user experience</li>
              <li>Monitor usage and detect fraud or misuse</li>
              <li>Communicate updates, support responses, and service-related notices</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">4. Legal Basis for Processing (If Applicable)</h2>
            <p>Where required (e.g., GDPR jurisdictions), we process data based on:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Your consent</li>
              <li>Performance of a contract</li>
              <li>Legitimate business interests</li>
              <li>Legal compliance obligations</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">5. Sharing and Disclosure of Information</h2>
            <p>We do not sell your personal data.</p>
            <p>We may share your information with:</p>

            <div className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold">5.1 Service Providers</h3>
              <p>Third-party vendors that support operations, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cloud hosting providers</li>
                <li>Payment processors</li>
                <li>Analytics services</li>
                <li>Email and communication platforms</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">5.2 Legal Compliance</h3>
              <p>If required by law, regulation, or legal process, we may disclose information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Government authorities</li>
                <li>Law enforcement</li>
                <li>Courts or regulators</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">5.3 Business Transfers</h3>
              <p>In the event of a merger, sale, or acquisition, your information may be transferred as part of business assets.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">6. Data Retention</h2>
            <p>We retain personal information only as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Fulfill the purposes outlined in this policy</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p>You may request deletion of your data at any time (see Section 9).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">7. Data Security</h2>
            <p>We implement reasonable administrative, technical, and physical safeguards to protect your information, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Encryption (where applicable)</li>
              <li>Secure servers and infrastructure</li>
              <li>Access control mechanisms</li>
            </ul>
            <p>However, no system is completely secure, and we cannot guarantee absolute security.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">8. Third-Party Services and Links</h2>
            <p>Our services may integrate with or link to third-party platforms, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Apple App Store</li>
              <li>Google Play Store</li>
              <li>External APIs and integrations</li>
            </ul>
            <p>We are not responsible for the privacy practices of third-party services. You should review their respective privacy policies.</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">9. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>

            <div className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold">9.1 General Rights</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-semibold">9.2 California Residents (CCPA/CPRA)</h3>
              <p>If you are a California resident, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Request disclosure of collected personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of data &ldquo;sales&rdquo; (we do not sell data)</li>
                <li>Non-discrimination for exercising your rights</li>
              </ul>
              <p>To exercise these rights, contact us using the details provided in our communications.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">10. Children&apos;s Privacy</h2>
            <p>Our services are not intended for individuals under the age of 13.</p>
            <p>We do not knowingly collect personal information from children. If we become aware that such data has been collected, we will take steps to delete it.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">11. International Data Transfers</h2>
            <p>If you access our services from outside the United States, your information may be transferred to and processed in the United States.</p>
            <p>By using our services, you consent to such transfers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b border-border/50 pb-2">12. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy periodically.</p>
            <p>Changes will be posted with an updated &ldquo;Last Updated&rdquo; date. Continued use of services constitutes acceptance of the revised policy.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
