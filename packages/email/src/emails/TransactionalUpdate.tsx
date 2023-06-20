import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface TransactionalUpdateEmailProps {
  updateTarget: string;
  actionUrl: string;
  unsubscribeUrl: string;
}

const baseUrl = 'https://debate.land';

export const TransactionalUpdateEmail = ({
  updateTarget,
  actionUrl,
  unsubscribeUrl,
}: TransactionalUpdateEmailProps) => (
  <Html>
    <Head />
    <Preview>{"You've"} got an update from Debate Land!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/assets/img/wordmark.png`}
            width="212"
            height="80"
            alt="Debate Land"
          />
        </Section>
        <Heading style={h1}>{"You've"} got an update from Debate Land!</Heading>

        <Section style={section}>
          <Text style={heroText}>
            We just logged an update for {updateTarget}. Click below to see what changed!
          </Text>
          <Link href={actionUrl} style={confirmationCodeText}>View Update</Link>
        </Section>

        <Text style={text}>
          If you {"didn't"} request this email or want to unsubscribe, <Link href={unsubscribeUrl}>click here</Link>.
        </Text>

        <Section>
          <Link
            style={footerLink}
            href="https://debate.land"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://debate.land/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://debate.land/roadmap"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roadmap
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://debate.land/contact"
            target="_blank"
            rel="noopener noreferrer"
            data-auth="NotApplicable"
            data-linkindex="6"
          >
            Contact
          </Link>
          <Text style={footerText}>
            ©2023 Debate Land. <br />
            Data for all things debate. <br />
            <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TransactionalUpdateEmail;

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#b7b7b7',
  lineHeight: '15px',
  textAlign: 'left' as const,
  marginBottom: '50px',
};

const footerLink = {
  color: '#b7b7b7',
  textDecoration: 'underline',
};

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
};

const logoContainer = {
  marginTop: '32px',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
};

const heroText = {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '30px',
};

const confirmationCodeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
  width: 'full'
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
};
