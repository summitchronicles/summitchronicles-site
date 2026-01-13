import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string; // default to 'Summit Chronicles <newsletter@summitchronicles.com>'
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!resend) {
    console.warn('RESEND_API_KEY not found. Logging email instead.');
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return { success: true, id: 'mock-id' };
  }

  try {
    const data = await resend.emails.send({
      from: from || 'Summit Chronicles <newsletter@summitchronicles.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
