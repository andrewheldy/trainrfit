import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — trainr" },
      {
        name: "description",
        content:
          "How trainr collects, uses, and protects your personal data across workouts, programs, and community features.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="label-eyebrow">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <Section title="1. Information We Collect">
          We collect information you provide directly (account details, workout logs, profile data), data
          generated automatically through your use of trainr (device, usage, and performance metrics), and
          information from third-party integrations you connect.
        </Section>

        <Section title="2. How We Use Your Information">
          We use your data to operate and improve the Service, personalize workouts and recommendations,
          provide AI coaching, process payments, communicate with you, and ensure security and prevent abuse.
        </Section>

        <Section title="3. Sharing Your Information">
          We do not sell your personal data. We may share data with service providers who help us operate the
          Service, with creators when you follow their programs, with law enforcement when legally required,
          and in connection with a business transfer.
        </Section>

        <Section title="4. Data Retention">
          We retain your data for as long as your account is active or as needed to provide the Service. You
          can request deletion of your account and associated data at any time.
        </Section>

        <Section title="5. Your Rights">
          Depending on your jurisdiction, you may have the right to access, correct, delete, or export your
          personal data, and to object to or restrict certain processing. Contact us to exercise these rights.
        </Section>

        <Section title="6. Cookies and Tracking">
          We use cookies and similar technologies to keep you signed in, remember preferences, and analyze
          usage. You can control cookies through your browser settings.
        </Section>

        <Section title="7. Security">
          We implement reasonable technical and organizational measures to protect your data. No method of
          transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </Section>

        <Section title="8. Children's Privacy">
          trainr is not intended for children under 13. We do not knowingly collect personal information from
          children under 13. If you believe we have, please contact us so we can delete it.
        </Section>

        <Section title="9. International Transfers">
          Your data may be processed in countries other than your own. We take steps to ensure appropriate
          safeguards are in place for such transfers.
        </Section>

        <Section title="10. Changes to This Policy">
          We may update this Privacy Policy from time to time. We'll notify you of material changes through
          the Service or by email.
        </Section>

        <Section title="11. Contact Us">
          For privacy questions or requests, contact us at privacy@trainr.app.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
