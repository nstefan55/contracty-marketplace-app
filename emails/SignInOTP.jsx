import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function SignInOTP({ verificationCode, userEmail }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Your Contracty sign-in verification code</Preview>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border="0"
              role="presentation"
            >
              <tr>
                <td align="center" style={logoCell}>
                  <Img
                    src={`${baseUrl}/images/logo/contracty-logo.png`}
                    width="100"
                    height="100"
                    alt="Contracty logo"
                  />
                </td>
              </tr>
            </table>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Heading style={heading}>Sign in to Contracty</Heading>
            <Text style={paragraph}>
              We received a sign-in request for <strong>{userEmail}</strong>.
              Use the verification code below to complete your sign-in. If you
              didn&apos;t request this, you can safely ignore this email.
            </Text>

            {/* OTP code block — table-centered for Outlook/Gmail/Yahoo compatibility */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              border="0"
              role="presentation"
            >
              <tr>
                <td align="center" style={codeSectionCell}>
                  <Text style={codeLabel}>Verification code</Text>
                  <Text style={codeText}>{verificationCode}</Text>
                  <Text style={codeExpiry}>
                    (This code is valid for 10 minutes)
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Security notice */}
          <Section style={securitySection}>
            <Text style={securityText}>
              Contracty will never email you asking you to disclose your
              password, credit card, or banking account information.
            </Text>
          </Section>
        </Container>

        {/* Footer */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border="0"
          role="presentation"
        >
          <tr>
            <td align="center">
              <Text style={footer}>
                &copy; {new Date().getFullYear()} Contracty. All rights
                reserved.
                {"  "}
                <Link
                  href="https://www.contracty.com/privacy"
                  style={footerLink}
                >
                  Privacy Policy
                </Link>
                {" · "}
                <Link href="https://www.contracty.com/terms" style={footerLink}>
                  Terms of Service
                </Link>
              </Text>
            </td>
          </tr>
        </table>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: "#f0f0f0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: "#212121",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
};

// Header — dark brand bar. Table-centered instead of flex so it renders in
// Outlook, Gmail, and Yahoo Mail without falling back to block layout.
const header = {
  backgroundColor: "#1a1a2e",
  padding: "0",
};

const logoCell = {
  padding: "20px 0",
};

const content = {
  padding: "28px 36px",
};

const heading = {
  color: "#1a1a2e",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "12px",
  marginTop: "0",
  textAlign: "center",
};

const paragraph = {
  color: "#444444",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

// td style for the centered OTP block
const codeSectionCell = {
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
  padding: "24px 0",
};

const codeLabel = {
  color: "#444444",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 6px",
  textAlign: "center",
};

const codeText = {
  color: "#1a1a2e",
  fontSize: "40px",
  fontWeight: "bold",
  letterSpacing: "6px",
  margin: "0",
  textAlign: "center",
};

const codeExpiry = {
  color: "#888888",
  fontSize: "12px",
  margin: "8px 0 0",
  textAlign: "center",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "0",
};

const securitySection = {
  padding: "20px 36px",
};

const securityText = {
  color: "#888888",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0",
};

const footer = {
  color: "#888888",
  fontSize: "11px",
  lineHeight: "18px",
  margin: "20px auto",
  maxWidth: "560px",
  padding: "0 20px",
  textAlign: "center",
};

// Use text-decoration shorthand — text-decoration-line is not supported in Outlook
const footerLink = {
  color: "#1a1a2e",
  textDecoration: "underline",
};
