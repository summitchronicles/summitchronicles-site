import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/app/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Summit Chronicles collects, uses, stores, and protects personal information, including optional connected fitness data.',
  alternates: {
    canonical: '/privacy',
  },
};

const sections = [
  ['scope', 'Scope'],
  ['information', 'Information we collect'],
  ['fitness-data', 'Connected fitness data'],
  ['use', 'How information is used'],
  ['sharing', 'When information is shared'],
  ['retention', 'Retention and deletion'],
  ['choices', 'Your choices and rights'],
  ['cookies', 'Cookies and logs'],
  ['transfers', 'International transfers'],
  ['security', 'Security'],
  ['children', 'Children'],
  ['changes', 'Changes to this policy'],
  ['contact', 'Contact'],
] as const;

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="bg-[#070707] text-white">
        <header className="border-b border-white/10 px-6 pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase text-summit-gold">
              Legal / Privacy
            </p>
            <h1 className="mt-6 max-w-5xl font-oswald text-6xl font-bold uppercase leading-[0.9] md:text-8xl">
              Privacy Policy
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
              This policy explains how Summit Chronicles handles personal
              information across the website and optional connected-fitness
              services.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 font-mono text-xs uppercase text-zinc-500">
              <span>Effective: 13 July 2026</span>
              <span>Controller: Summit Chronicles</span>
              <a
                href="mailto:hello@summitchronicles.com"
                className="text-zinc-300 hover:text-summit-gold"
              >
                hello@summitchronicles.com
              </a>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[240px_minmax(0,760px)] lg:justify-between lg:py-24">
          <aside className="hidden lg:block">
            <nav aria-label="Privacy policy sections" className="sticky top-28">
              <p className="font-mono text-xs uppercase text-zinc-600">
                On this page
              </p>
              <ol className="mt-5 space-y-3 border-l border-white/10 pl-5">
                {sections.map(([id, label], index) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-sm leading-5 text-zinc-500 transition-colors hover:text-white"
                    >
                      {String(index + 1).padStart(2, '0')} {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="min-w-0 space-y-16 text-zinc-300">
            <PolicySection id="scope" number="01" title="Scope">
              <p>
                Summit Chronicles is an independent expedition, training, and
                editorial website operated by Sunith Kumar in India. This policy
                applies to summitchronicles.com, its forms and newsletters, and
                any fitness service you expressly connect to Summit Chronicles.
              </p>
              <p>
                Links to external websites and social platforms are governed by
                their own privacy policies. This policy does not replace the
                privacy terms of WHOOP, Strava, Intervals.icu, or another
                service you choose to use.
              </p>
            </PolicySection>

            <PolicySection
              id="information"
              number="02"
              title="Information we collect"
            >
              <h3>Information you provide</h3>
              <ul>
                <li>
                  Email address and subscription source when you join the
                  newsletter.
                </li>
                <li>
                  Your name, contact details, and message when you contact us.
                </li>
                <li>
                  Information you include in partnership, media, or speaking
                  inquiries.
                </li>
              </ul>
              <h3>Information collected automatically</h3>
              <ul>
                <li>
                  IP address, browser and device information, request time, and
                  requested pages.
                </li>
                <li>
                  Security, diagnostic, rate-limit, and server logs needed to
                  operate the site.
                </li>
                <li>
                  Essential session information for restricted administrative
                  features.
                </li>
              </ul>
              <p>
                Summit Chronicles does not sell personal information. It does
                not collect payment-card information through the current site.
              </p>
            </PolicySection>

            <PolicySection
              id="fitness-data"
              number="03"
              title="Connected fitness data"
            >
              <p>
                Fitness integrations are optional. Data is accessed only after
                the account holder completes the provider&apos;s authorization
                process and grants the requested permissions.
              </p>
              <h3>WHOOP</h3>
              <p>
                If WHOOP is connected, Summit Chronicles may receive account or
                profile identifiers and authorized cycle, recovery, sleep, HRV,
                resting-heart-rate, strain, and workout information. OAuth
                access and refresh tokens are also processed to maintain the
                connection.
              </p>
              <h3>Strava</h3>
              <p>
                If Strava is connected, Summit Chronicles may receive athlete
                identifiers and authorized activity information such as sport,
                timestamps, duration, distance, elevation, heart rate, power,
                route, and location data. OAuth tokens are processed to maintain
                the connection.
              </p>
              <h3>Intervals.icu and other sources</h3>
              <p>
                Intervals.icu may provide aggregated activity and wellness data
                that originated from an authorized device or fitness account.
                Summit Chronicles displays source and freshness information when
                this data is presented.
              </p>
              <p>
                Connected-fitness data is used to present the account
                holder&apos;s training record and related analysis. It is not
                sold, used for advertising, used to determine insurance or
                employment, or presented as medical diagnosis or treatment.
              </p>
            </PolicySection>

            <PolicySection id="use" number="04" title="How information is used">
              <ul>
                <li>Operate, secure, troubleshoot, and improve the website.</li>
                <li>Deliver newsletters requested by subscribers.</li>
                <li>
                  Respond to questions, partnerships, and other inquiries.
                </li>
                <li>
                  Authenticate authorized connections and retrieve permitted
                  fitness data.
                </li>
                <li>
                  Build training summaries, activity histories, and recovery
                  context.
                </li>
                <li>Comply with legal obligations and enforce site terms.</li>
              </ul>
              <p>
                Where applicable, processing is based on consent, performance of
                a requested service, legitimate operational interests, or legal
                obligations. Consent can be withdrawn at any time, without
                affecting processing that occurred before withdrawal.
              </p>
            </PolicySection>

            <PolicySection
              id="sharing"
              number="05"
              title="When information is shared"
            >
              <p>Information may be shared only as necessary with:</p>
              <ul>
                <li>
                  Hosting, storage, security, and infrastructure providers.
                </li>
                <li>
                  Buttondown or another disclosed provider used to deliver
                  requested newsletters.
                </li>
                <li>
                  WHOOP, Strava, and Intervals.icu when completing an authorized
                  connection or API request.
                </li>
                <li>
                  Professional advisers, authorities, or other parties when
                  required by law or needed to protect rights and safety.
                </li>
                <li>
                  A successor in a merger, reorganization, or transfer, subject
                  to applicable privacy obligations.
                </li>
              </ul>
              <p>
                Service providers may process information only for the relevant
                service and under their applicable contractual and legal duties.
                Personal information is not rented or sold.
              </p>
            </PolicySection>

            <PolicySection
              id="retention"
              number="06"
              title="Retention and deletion"
            >
              <ul>
                <li>
                  Newsletter information is retained until you unsubscribe,
                  followed by limited suppression records when needed to honor
                  that choice.
                </li>
                <li>
                  Correspondence is retained only while needed to respond,
                  maintain relevant business records, or meet legal obligations.
                </li>
                <li>
                  Operational logs are retained for a limited period appropriate
                  to security and troubleshooting.
                </li>
                <li>
                  OAuth tokens and connected-fitness data are retained only
                  while needed for the authorized integration or another
                  disclosed purpose.
                </li>
              </ul>
              <p>
                When you revoke a fitness connection, delete the source account,
                request deletion, or when Summit Chronicles stops using that
                API, associated provider tokens and stored provider data will be
                promptly and permanently deleted unless retention is legally
                required. Backup copies may persist briefly until routine backup
                rotation completes and will not be restored for ordinary use.
              </p>
            </PolicySection>

            <PolicySection
              id="choices"
              number="07"
              title="Your choices and rights"
            >
              <p>
                Depending on your location, you may request access, correction,
                deletion, restriction, portability, or information about how
                your personal data is processed. You may also withdraw consent
                or object to certain processing.
              </p>
              <ul>
                <li>
                  Use the unsubscribe link in any newsletter to stop marketing
                  email.
                </li>
                <li>
                  Revoke WHOOP or Strava authorization through the
                  provider&apos;s connected-app settings.
                </li>
                <li>
                  Email hello@summitchronicles.com to request access,
                  correction, export, or deletion.
                </li>
              </ul>
              <p>
                Identity may be verified before fulfilling a request. Summit
                Chronicles will respond within the period required by applicable
                law. You may also raise a grievance with the relevant data
                protection authority.
              </p>
            </PolicySection>

            <PolicySection id="cookies" number="08" title="Cookies and logs">
              <p>
                The site may use strictly necessary cookies for authentication,
                security, preferences, and reliable operation. Server logs and
                rate-limiting records may process IP addresses and request
                metadata. Summit Chronicles does not currently use personal data
                from connected fitness providers for cross-site advertising.
              </p>
              <p>
                If optional analytics or advertising technologies are
                introduced, this policy and any required consent controls will
                be updated before they are enabled.
              </p>
            </PolicySection>

            <PolicySection
              id="transfers"
              number="09"
              title="International transfers"
            >
              <p>
                Providers may process information in countries other than your
                own. Where applicable, Summit Chronicles relies on appropriate
                contractual, legal, and security safeguards for international
                transfers and limits information to what the service requires.
              </p>
            </PolicySection>

            <PolicySection id="security" number="10" title="Security">
              <p>
                Reasonable technical and organizational safeguards are used to
                protect personal information, including access controls,
                encrypted transport, secret separation, restricted
                administrative access, and provider-token protection. No
                internet service can guarantee absolute security.
              </p>
              <p>
                If a breach creates a risk requiring notification, affected
                individuals and authorities will be notified as required by
                applicable law.
              </p>
            </PolicySection>

            <PolicySection id="children" number="11" title="Children">
              <p>
                Summit Chronicles is not directed to children under 13 and does
                not knowingly collect their personal information.
                Fitness-account connections are intended for people legally able
                to authorize the relevant provider account. Contact us if you
                believe a child has submitted personal information.
              </p>
            </PolicySection>

            <PolicySection
              id="changes"
              number="12"
              title="Changes to this policy"
            >
              <p>
                This policy may be updated as the site, connected services, or
                legal requirements change. The effective date will be revised,
                and material changes will be communicated through an appropriate
                site or email notice when required.
              </p>
            </PolicySection>

            <PolicySection id="contact" number="13" title="Contact">
              <p>
                For privacy questions, requests, complaints, or fitness-data
                deletion, contact:
              </p>
              <address className="not-italic">
                <strong className="text-white">Summit Chronicles</strong>
                <br />
                Attn: Sunith Kumar
                <br />
                India
                <br />
                <a
                  href="mailto:hello@summitchronicles.com"
                  className="text-summit-gold hover:text-white"
                >
                  hello@summitchronicles.com
                </a>
              </address>
              <p>
                General website terms are available in the{' '}
                <Link
                  href="/terms"
                  className="text-summit-gold hover:text-white"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </PolicySection>

            <div className="border-t border-white/10 pt-8 text-sm leading-7 text-zinc-500">
              This policy is intended to describe Summit Chronicles&apos; actual
              practices clearly. It is not a substitute for legal advice about
              obligations that may apply in a particular jurisdiction.
            </div>
          </article>
        </div>
      </div>
    </PublicLayout>
  );
}

function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-white/10 pt-8">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-summit-gold">/{number}</span>
        <h2 className="font-oswald text-3xl uppercase leading-none text-white md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="privacy-copy mt-7 space-y-5 text-base leading-8">
        {children}
      </div>
    </section>
  );
}
