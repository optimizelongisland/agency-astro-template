// Lead handling for the native contact form: validation, spam checks, and
// delivery (email via Resend, plus optional webhooks such as Go High Level).
//
// This file is plain TypeScript with no Astro imports on purpose, so it can be
// unit-tested directly with `npm test` and reused unchanged on every client site.

export interface Lead {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface LeadMeta {
  site: string; // hostname the form was submitted on
  page: string; // page URL the visitor was on (from the Referer header)
  submittedAt: string; // ISO timestamp
}

export interface DeliveryConfig {
  resendApiKey?: string;
  fromEmail?: string; // e.g. "Website Leads <leads@send.youragency.com>"
  toEmails: string[]; // where the client receives leads
  webhookUrls: string[]; // GHL inbound webhook, Google Sheet script, Zapier, etc.
}

export interface DeliveryResult {
  delivered: string[]; // channels that accepted the lead
  failed: string[]; // channels that errored, with a short reason
}

export type FieldErrors = Partial<Record<keyof Lead, string>>;

type Fetch = typeof fetch;

const LIMITS = { name: 100, email: 254, phone: 30, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUEST_TIMEOUT_MS = 8000;

// The honeypot field name. It is a field real visitors never see or fill in;
// anything that fills it is a bot. Must match the input in ContactForm.astro.
export const HONEYPOT_FIELD = 'company_website';

function clean(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '';
  // Strip control characters (except newlines/tabs) and trim.
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

export function parseLead(form: FormData): Lead {
  return {
    name: clean(form.get('name')).replace(/\s+/g, ' '),
    email: clean(form.get('email')),
    phone: clean(form.get('phone')).replace(/\s+/g, ' '),
    message: clean(form.get('message')),
  };
}

export function isHoneypotTripped(form: FormData): boolean {
  return clean(form.get(HONEYPOT_FIELD)) !== '';
}

export function validateLead(lead: Lead): FieldErrors {
  const errors: FieldErrors = {};

  if (!lead.name) errors.name = 'Please enter your name.';
  else if (lead.name.length > LIMITS.name) errors.name = 'That name is too long.';

  if (!lead.email) errors.email = 'Please enter your email address.';
  else if (lead.email.length > LIMITS.email || !EMAIL_RE.test(lead.email))
    errors.email = 'Please enter a valid email address.';

  if (lead.phone) {
    const digits = lead.phone.replace(/\D/g, '');
    if (lead.phone.length > LIMITS.phone || digits.length < 7 || !/^[\d\s()+.\-x]+$/i.test(lead.phone))
      errors.phone = 'Please enter a valid phone number.';
  }

  if (!lead.message) errors.message = 'Please tell us a little about what you need.';
  else if (lead.message.length > LIMITS.message) errors.message = 'That message is too long.';

  return errors;
}

export function splitList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildEmail(lead: Lead, meta: LeadMeta): { subject: string; text: string; html: string } {
  const subject = `New website lead: ${lead.name}`;
  const rows: Array<[string, string]> = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone || 'Not provided'],
    ['Message', lead.message],
    ['Submitted from', meta.page || meta.site],
    ['Received', meta.submittedAt],
  ];

  const text =
    rows.map(([label, value]) => `${label}: ${value}`).join('\n') +
    '\n\nReply to this email to respond directly to the customer.';

  const html =
    `<table cellpadding="8" cellspacing="0" style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #ddd">${escapeHtml(label)}</td>` +
          `<td style="border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
      )
      .join('') +
    `</table><p style="font-family:Arial,sans-serif;font-size:13px;color:#555">Reply to this email to respond directly to the customer.</p>`;

  return { subject, text, html };
}

// Verifies a Cloudflare Turnstile token. Returns true only on a confirmed pass.
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | undefined,
  fetchImpl: Fetch = fetch,
): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);
    const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendEmail(lead: Lead, meta: LeadMeta, config: DeliveryConfig, fetchImpl: Fetch): Promise<void> {
  const { subject, text, html } = buildEmail(lead, meta);
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: config.toEmails,
      reply_to: lead.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function postWebhook(url: string, lead: Lead, meta: LeadMeta, fetchImpl: Fetch): Promise<void> {
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, ...meta, source: 'website-contact-form' }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export function emailConfigured(config: DeliveryConfig): boolean {
  return Boolean(config.resendApiKey && config.fromEmail && config.toEmails.length > 0);
}

export function hasAnyChannel(config: DeliveryConfig): boolean {
  return emailConfigured(config) || config.webhookUrls.length > 0;
}

// Sends the lead to every configured channel at once. One channel failing never
// blocks the others, so a webhook copy still lands if email is down (and vice versa).
export async function deliverLead(
  lead: Lead,
  meta: LeadMeta,
  config: DeliveryConfig,
  fetchImpl: Fetch = fetch,
): Promise<DeliveryResult> {
  const jobs: Array<{ channel: string; run: Promise<void> }> = [];

  if (emailConfigured(config)) jobs.push({ channel: 'email', run: sendEmail(lead, meta, config, fetchImpl) });
  config.webhookUrls.forEach((url, i) =>
    jobs.push({ channel: `webhook-${i + 1}`, run: postWebhook(url, lead, meta, fetchImpl) }),
  );

  const settled = await Promise.allSettled(jobs.map((j) => j.run));
  const result: DeliveryResult = { delivered: [], failed: [] };
  settled.forEach((outcome, i) => {
    const channel = jobs[i].channel;
    if (outcome.status === 'fulfilled') result.delivered.push(channel);
    else result.failed.push(`${channel} (${outcome.reason instanceof Error ? outcome.reason.message : 'error'})`);
  });
  return result;
}
