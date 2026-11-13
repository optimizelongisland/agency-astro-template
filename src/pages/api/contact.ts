// CORE - do not edit per client. See src/core/README.md.
//
// Receives the lead form (src/core/components/LeadForm.astro) and delivers the lead.
// This is the only server-rendered route on the site; every page stays static.
//
// Works two ways:
// - With JavaScript: the form posts here via fetch and gets JSON back.
// - Without JavaScript: the browser posts here directly and is redirected to /thank-you/.
import type { APIRoute } from 'astro';
import {
  LEAD_FROM_EMAIL,
  LEAD_TO_EMAIL,
  LEAD_WEBHOOK_URLS,
  RESEND_API_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import {
  deliverLead,
  escapeHtml,
  hasAnyChannel,
  isHoneypotTripped,
  parseLead,
  splitList,
  validateLead,
  verifyTurnstile,
  type DeliveryConfig,
  type FieldErrors,
} from '../../core/lib/leads';

export const prerender = false;

const THANK_YOU_PATH = '/thank-you/';
const MAX_BODY_BYTES = 50_000;

interface Outcome {
  status: number;
  ok: boolean;
  message: string;
  errors?: FieldErrors;
}

function respond(request: Request, outcome: Outcome): Response {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  if (wantsJson) {
    return new Response(
      JSON.stringify({
        ok: outcome.ok,
        message: outcome.message,
        errors: outcome.errors,
        redirect: outcome.ok ? THANK_YOU_PATH : undefined,
      }),
      { status: outcome.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
    );
  }

  // No-JavaScript path.
  if (outcome.ok) {
    return new Response(null, { status: 303, headers: { Location: THANK_YOU_PATH } });
  }
  const details = outcome.errors ? Object.values(outcome.errors).join(' ') : '';
  // Link back to the page the visitor came from, but only if it is on this site.
  let backHref = '/';
  try {
    const referer = new URL(request.headers.get('referer') ?? '');
    if (referer.origin === new URL(request.url).origin) backHref = referer.pathname;
  } catch {
    // no usable referer, fall back to the homepage
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Message not sent</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:0 24px;line-height:1.5"><h1>Your message wasn't sent</h1><p>${escapeHtml(details || outcome.message)}</p><p><a href="${escapeHtml(backHref)}">Go back and try again</a></p></body></html>`;
  return new Response(html, {
    status: outcome.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) {
    return respond(request, { status: 413, ok: false, message: 'That message is too long.' });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, { status: 400, ok: false, message: 'We could not read the form. Please try again.' });
  }

  // Bots that fill the hidden field get a normal-looking success and nothing is sent.
  if (isHoneypotTripped(form)) {
    return respond(request, { status: 200, ok: true, message: 'Thanks. Your message has been sent.' });
  }

  const lead = parseLead(form);
  const errors = validateLead(lead);
  if (Object.keys(errors).length > 0) {
    return respond(request, { status: 422, ok: false, message: 'Please check the highlighted fields.', errors });
  }

  if (TURNSTILE_SECRET_KEY) {
    let ip: string | undefined;
    try {
      ip = clientAddress;
    } catch {
      ip = undefined;
    }
    const token = form.get('cf-turnstile-response');
    const passed = await verifyTurnstile(typeof token === 'string' ? token : '', TURNSTILE_SECRET_KEY, ip);
    if (!passed) {
      return respond(request, {
        status: 400,
        ok: false,
        message: 'The spam check did not complete. Please refresh the page and try again.',
      });
    }
  }

  const config: DeliveryConfig = {
    resendApiKey: RESEND_API_KEY,
    fromEmail: LEAD_FROM_EMAIL,
    toEmails: splitList(LEAD_TO_EMAIL),
    webhookUrls: splitList(LEAD_WEBHOOK_URLS),
  };

  const url = new URL(request.url);
  const meta = {
    site: url.hostname,
    page: request.headers.get('referer') ?? '',
    submittedAt: new Date().toISOString(),
  };

  if (!hasAnyChannel(config)) {
    if (import.meta.env.DEV) {
      // Local development with no keys set: show the lead in the terminal so the
      // form can be tested end to end without sending anything.
      console.log('[contact form] DEV MODE, no delivery configured. Lead received:', { ...lead, ...meta });
      return respond(request, { status: 200, ok: true, message: 'Thanks. Your message has been sent.' });
    }
    console.error(
      '[contact form] NO DELIVERY CONFIGURED. Set RESEND_API_KEY, LEAD_FROM_EMAIL and LEAD_TO_EMAIL (or LEAD_WEBHOOK_URLS) in the host environment. A lead was just lost.',
    );
    return respond(request, {
      status: 500,
      ok: false,
      message: 'We could not send your message right now. Please call us instead.',
    });
  }

  const result = await deliverLead(lead, meta, config);

  if (result.failed.length > 0) {
    console.error(`[contact form] delivery problems: ${result.failed.join(', ')}`);
  }
  if (result.delivered.length === 0) {
    return respond(request, {
      status: 502,
      ok: false,
      message: 'We could not send your message right now. Please call us instead.',
    });
  }

  return respond(request, { status: 200, ok: true, message: 'Thanks. Your message has been sent.' });
};

// Anything other than POST gets a clear answer instead of a blank page.
export const ALL: APIRoute = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
