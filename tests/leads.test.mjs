// Unit tests for the contact form's lead handling. Run with `npm test`.
// No network calls are made: every outbound request goes to a fake fetch.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEmail,
  deliverLead,
  escapeHtml,
  hasAnyChannel,
  isHoneypotTripped,
  parseLead,
  splitList,
  validateLead,
  verifyTurnstile,
} from '../src/lib/leads.ts';

function form(fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const goodLead = { name: 'Pat Smith', email: 'pat@example.com', phone: '(631) 555-0148', message: 'Need a quote.' };
const meta = { site: 'example.com', page: 'https://example.com/', submittedAt: '2026-01-01T00:00:00.000Z' };

function fakeFetch(handler) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler(String(url), init);
  };
  return { impl, calls };
}
const ok = () => new Response('{}', { status: 200 });
const fail = () => new Response('nope', { status: 500 });

test('parseLead trims, collapses whitespace and strips control characters', () => {
  const lead = parseLead(form({ name: '  Pat \u0000  Smith ', email: ' pat@example.com ', phone: '', message: ' hi\nthere ' }));
  assert.deepEqual(lead, { name: 'Pat Smith', email: 'pat@example.com', phone: '', message: 'hi\nthere' });
});

test('parseLead treats missing and non-text fields as empty', () => {
  const fd = new FormData();
  fd.set('name', new Blob(['x']), 'file.txt');
  assert.deepEqual(parseLead(fd), { name: '', email: '', phone: '', message: '' });
});

test('validateLead accepts a good lead, with or without a phone', () => {
  assert.deepEqual(validateLead(goodLead), {});
  assert.deepEqual(validateLead({ ...goodLead, phone: '' }), {});
});

test('validateLead reports each missing required field', () => {
  const errors = validateLead({ name: '', email: '', phone: '', message: '' });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name']);
});

test('validateLead rejects bad emails, bad phones and oversized input', () => {
  for (const email of ['pat', 'pat@', 'pat@example', 'pat @example.com', '@example.com']) {
    assert.ok(validateLead({ ...goodLead, email }).email, `should reject ${email}`);
  }
  for (const phone of ['123', 'call me maybe', '555-0148<script>']) {
    assert.ok(validateLead({ ...goodLead, phone }).phone, `should reject ${phone}`);
  }
  assert.ok(validateLead({ ...goodLead, name: 'x'.repeat(101) }).name);
  assert.ok(validateLead({ ...goodLead, message: 'x'.repeat(5001) }).message);
});

test('honeypot is tripped only when the hidden field has a value', () => {
  assert.equal(isHoneypotTripped(form({ company_website: '' })), false);
  assert.equal(isHoneypotTripped(form({})), false);
  assert.equal(isHoneypotTripped(form({ company_website: 'http://spam.example' })), true);
});

test('splitList handles empty, single and comma-separated values', () => {
  assert.deepEqual(splitList(undefined), []);
  assert.deepEqual(splitList(''), []);
  assert.deepEqual(splitList(' a@x.com , b@x.com ,'), ['a@x.com', 'b@x.com']);
});

test('buildEmail escapes HTML in every visitor-supplied value', () => {
  const email = buildEmail({ ...goodLead, name: '<b>Pat</b>', message: '<script>alert(1)</script>' }, meta);
  assert.ok(!email.html.includes('<script>'));
  assert.ok(!email.html.includes('<b>Pat</b>'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.text.includes('<script>alert(1)</script>'));
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
});

test('deliverLead sends email through Resend with reply-to set to the visitor', async () => {
  const { impl, calls } = fakeFetch(ok);
  const config = { resendApiKey: 'key', fromEmail: 'Leads <leads@x.com>', toEmails: ['owner@x.com'], webhookUrls: [] };
  const result = await deliverLead(goodLead, meta, config, impl);
  assert.deepEqual(result, { delivered: ['email'], failed: [] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer key');
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.reply_to, 'pat@example.com');
  assert.deepEqual(body.to, ['owner@x.com']);
  assert.equal(body.from, 'Leads <leads@x.com>');
});

test('deliverLead posts the lead as JSON to every webhook', async () => {
  const { impl, calls } = fakeFetch(ok);
  const config = { toEmails: [], webhookUrls: ['https://hooks.example/a', 'https://hooks.example/b'] };
  const result = await deliverLead(goodLead, meta, config, impl);
  assert.deepEqual(result.delivered, ['webhook-1', 'webhook-2']);
  const body = JSON.parse(calls[1].init.body);
  assert.equal(body.email, 'pat@example.com');
  assert.equal(body.site, 'example.com');
  assert.equal(body.source, 'website-contact-form');
});

test('deliverLead still delivers by webhook when email fails, and reports the failure', async () => {
  const { impl } = fakeFetch((url) => (url.includes('resend') ? fail() : ok()));
  const config = { resendApiKey: 'key', fromEmail: 'a@x.com', toEmails: ['o@x.com'], webhookUrls: ['https://hooks.example/a'] };
  const result = await deliverLead(goodLead, meta, config, impl);
  assert.deepEqual(result.delivered, ['webhook-1']);
  assert.deepEqual(result.failed, ['email (HTTP 500)']);
});

test('deliverLead reports total failure when every channel errors or throws', async () => {
  const { impl } = fakeFetch(() => {
    throw new Error('network down');
  });
  const config = { resendApiKey: 'key', fromEmail: 'a@x.com', toEmails: ['o@x.com'], webhookUrls: ['https://hooks.example/a'] };
  const result = await deliverLead(goodLead, meta, config, impl);
  assert.deepEqual(result.delivered, []);
  assert.equal(result.failed.length, 2);
});

test('email needs key, from and to all set before it counts as a channel', () => {
  assert.equal(hasAnyChannel({ toEmails: [], webhookUrls: [] }), false);
  assert.equal(hasAnyChannel({ resendApiKey: 'k', toEmails: ['o@x.com'], webhookUrls: [] }), false);
  assert.equal(hasAnyChannel({ resendApiKey: 'k', fromEmail: 'a@x.com', toEmails: [], webhookUrls: [] }), false);
  assert.equal(hasAnyChannel({ resendApiKey: 'k', fromEmail: 'a@x.com', toEmails: ['o@x.com'], webhookUrls: [] }), true);
  assert.equal(hasAnyChannel({ toEmails: [], webhookUrls: ['https://hooks.example/a'] }), true);
});

test('verifyTurnstile passes only on a confirmed success', async () => {
  const pass = fakeFetch(() => Response.json({ success: true }));
  assert.equal(await verifyTurnstile('token', 'secret', '1.2.3.4', pass.impl), true);
  assert.equal(pass.calls[0].init.body.get('remoteip'), '1.2.3.4');

  assert.equal(await verifyTurnstile('token', 'secret', undefined, fakeFetch(() => Response.json({ success: false })).impl), false);
  assert.equal(await verifyTurnstile('token', 'secret', undefined, fakeFetch(fail).impl), false);
  assert.equal(await verifyTurnstile('token', 'secret', undefined, fakeFetch(() => { throw new Error('x'); }).impl), false);

  const empty = fakeFetch(ok);
  assert.equal(await verifyTurnstile('', 'secret', undefined, empty.impl), false);
  assert.equal(empty.calls.length, 0);
});
