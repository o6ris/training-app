import classes from "./privacyPolicy.module.css";

export const metadata = {
  title: "GrindPal Privacy Policy",
  description:
    "Learn how GrindPal collects, uses, and protects your personal data. Read our privacy policy to understand your rights and our data handling practices.",
  keywords: [
    "privacy policy",
    "user data protection",
    "fitness app privacy",
    "GrindPal data policy",
    "secure fitness tracking",
    "data rights",
  ].join(", "),
  openGraph: {
    title: "GrindPal Privacy Policy",
    description:
      "Learn how GrindPal collects, uses, and protects your personal data. Read our privacy policy to understand your rights and our data handling practices.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_API_URL}/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <main className={classes.main}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> April 9, 2025
      </p>

      <p>
        Your privacy matters to us. This Privacy Policy describes what data we
        collect, how we use it, and your rights.
      </p>
      <p>By using GrindPal, you agree to this Privacy Policy.</p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect the following data when you use our Service:
        <ul>
          <li>Name, email, and password (encrypted)</li>
          <li>Optional profile data: weight, height, age</li>
          <li>Workout statistics and progress data</li>
          <li>Login method (email or Google OAuth)</li>
        </ul>
      </p>

      <h2>2. How We Use Your Data</h2>
      <p>
        We use your data to:
        <ul>
          <li>Provide personalized workout tracking and stats</li>
          <li>Display your workout history and progress</li>
          <li>
            Send necessary account-related communications (e.g. password reset)
          </li>
          <li>Improve the Service</li>
        </ul>
        We do not sell your data to third parties.
      </p>

      <h2>3. Email Communication</h2>
      <p>
        We use <strong>Brevo</strong> to send automatic transactional emails
        such as account confirmation, password reset, and updates. You may not
        opt out of essential emails related to your account.
      </p>

      <h2>4. Cookies & Analytics</h2>
      <p>
        GrindPal may use cookies to improve user experience (e.g. saving login
        sessions). We currently do not use external analytics tools, but may
        introduce them in the future (with notice).
      </p>

      <h2>5. Data Storage & Security</h2>
      <p>
        We store your data securely using modern encryption and authentication
        standards. Passwords are hashed and never stored in plain text.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        We use trusted third-party providers, including:
        <ul>
          <li>
            <strong>Supabase</strong> for file and image storage
          </li>
          <li>
            <strong>Brevo</strong> for sending emails
          </li>
          <li>
            <strong>Google OAuth</strong> for authentication (if selected)
          </li>
        </ul>
        These services have their own privacy policies.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to:
        <ul>
          <li>Access your data</li>
          <li>Request correction or deletion</li>
          <li>Withdraw consent</li>
        </ul>
        To request changes or deletion of your data, contact us at{" "}
        <a href="mailto:tsiry@grindpal.org">tsiry@grindpal.org</a>.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your data as long as your account is active or as needed to
        provide services. You can delete your account at any time.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        GrindPal is not intended for users under 16. We do not knowingly collect
        data from children under 16.
      </p>

      <h2>10. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy. When we do, we will update the
        &apos;Last updated&apos; date and notify you via the Service if
        necessary.
      </p>

      <h2>11. Contact Us</h2>
      <p>For questions or requests, contact: contact@grindpal.org</p>
      <p>Calgary, Canada</p>
    </main>
  );
}
