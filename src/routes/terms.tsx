import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — trainr" },
      {
        name: "description",
        content:
          "The terms and conditions governing your use of trainr, the operating system for fitness.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="label-eyebrow">Legal</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <Section title="1. Acceptance of Terms">
          By accessing or using trainr (the "Service"), you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the Service.
        </Section>

        <Section title="2. Description of Service">
          trainr provides workout tracking, program building, fitness community, creator tools, challenges,
          and AI coaching features. We reserve the right to modify, suspend, or discontinue any aspect of the
          Service at any time.
        </Section>

        <Section title="3. User Accounts">
          You are responsible for maintaining the confidentiality of your account credentials and for all
          activities that occur under your account. You agree to provide accurate, current, and complete
          information during registration.
        </Section>

        <Section title="4. User Content">
          You retain ownership of content you submit to trainr. By submitting content, you grant trainr a
          worldwide, non-exclusive, royalty-free license to use, display, and distribute that content in
          connection with the Service.
        </Section>

        <Section title="5. Health and Safety Disclaimer">
          trainr provides fitness information and tracking tools but is not a substitute for professional
          medical advice. Consult a qualified healthcare provider before starting any exercise program. You
          assume all risks associated with physical activity.
        </Section>

        <Section title="6. Prohibited Conduct">
          You agree not to misuse the Service, including but not limited to: violating laws, infringing
          intellectual property, transmitting malicious code, harassing other users, or attempting to gain
          unauthorized access to the Service.
        </Section>

        <Section title="7. Subscriptions and Payments">
          Paid plans renew automatically until canceled. You can cancel at any time from your account
          settings. Refunds are issued at our discretion in accordance with applicable law.
        </Section>

        <Section title="8. Termination">
          We may suspend or terminate your access to the Service at any time for violation of these terms.
          You may stop using the Service at any time.
        </Section>

        <Section title="9. Limitation of Liability">
          To the maximum extent permitted by law, trainr shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of the Service.
        </Section>

        <Section title="10. Changes to Terms">
          We may update these Terms from time to time. Continued use of the Service after changes constitutes
          acceptance of the new terms.
        </Section>

        <Section title="11. Contact">
          For questions about these Terms, contact us at support@trainr.app.
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
