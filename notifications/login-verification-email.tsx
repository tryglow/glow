import {
  Body,
  Button,
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
} from '@react-email/components';

interface VerificationCodeEmailProps {
  url: string;
}

export const VerificationCodeEmail = ({ url }: VerificationCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your Glow login</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://glow.as/assets/logo.png`}
          width="42"
          height="42"
          alt="Glow"
          style={logo}
        />
        <Heading style={heading}>Your login code for Glow</Heading>
        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Log in to Glow
          </Button>
        </Section>
        <Text style={paragraph}>
          This link will only be valid for the next 5 minutes. Click this button
          on the same device you started logging in from. If you didn&apos;t
          request this, you can ignore this email.
        </Text>
        <Hr style={hr} />
        <Link href="https://glow.as" style={reportLink}>
          Glow
        </Link>
      </Container>
    </Body>
  </Html>
);

VerificationCodeEmail.PreviewProps = {
  url: 'https://glow.as/login',
} as VerificationCodeEmailProps;

export default VerificationCodeEmail;

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '8px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};
