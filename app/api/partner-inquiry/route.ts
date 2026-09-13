import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  classifyMailFailure,
  failureResponse,
  undeliveredRecord,
} from './deliveryOutcome';

export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 4;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requestCounts.get(ip);

  if (!current || current.resetAt <= now) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS) return true;
  current.count += 1;
  return false;
}

export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'This request is not allowed.' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid request format.' }, { status: 415 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages were sent. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Please complete every field.' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const subject = typeof payload.subject === 'string' ? payload.subject.trim().replace(/[\r\n]+/g, ' ') : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const website = typeof payload.website === 'string' ? payload.website.trim() : '';
  const destination = payload.destination === 'contact' ? 'contact' : 'partners';

  // Quietly accept bot submissions so the honeypot is not discoverable.
  if (website) return NextResponse.json({ ok: true });

  if (!isEmail(email) || email.length > 254) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (subject.length < 3 || subject.length > 120) {
    return NextResponse.json({ error: 'The title must be between 3 and 120 characters.' }, { status: 400 });
  }
  if (message.length < 20 || message.length > 4000) {
    return NextResponse.json({ error: 'The message must be between 20 and 4,000 characters.' }, { status: 400 });
  }

  const sender = process.env.EMAIL;
  const password = process.env.EMAIL_PASS;
  const recipient = destination === 'contact'
    ? process.env.EMAIL_CONTACT_TO || 'cs@moilapp.com'
    : process.env.EMAIL_TO;

  if (!sender || !password || !recipient) {
    // THE SAME LEAD LOSS, ONE BRANCH EARLIER, and this is the likelier of
    // the two: a host missing EMAIL_TO drops every inquiry it ever receives,
    // silently, for as long as the variable is unset. It also cannot be
    // retried into working, so the copy must not ask anyone to.
    console.error(
      undeliveredRecord({
        destination,
        email,
        subject,
        message,
        reason: 'not_configured',
      }),
    );
    console.error('Partner inquiry email is not configured.');
    const { error: copy, status } = failureResponse('config');
    return NextResponse.json({ error: copy }, { status });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: sender, pass: password },
  });

  // The lead, kept in one place so both the send and the failure record
  // describe the same thing. A second literal here is how the log and the
  // email start disagreeing about what somebody wrote.
  const lead = { destination, email, subject, message };

  try {
    await transporter.sendMail({
      from: `Moil Partnerships <${sender}>`,
      to: recipient,
      replyTo: email,
      subject: `[${destination === 'contact' ? 'Contact' : 'Partner inquiry'}] ${subject}`,
      text: `${destination === 'contact' ? 'Contact message' : 'Partnership inquiry'} from ${email}\n\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#171325"><p style="font-size:12px;letter-spacing:.12em;color:#7c3aed;text-transform:uppercase">New ${destination === 'contact' ? 'contact message' : 'partnership inquiry'}</p><h1 style="font-size:24px">${escapeHtml(subject)}</h1><p><strong>Reply to:</strong> ${escapeHtml(email)}</p><hr style="border:0;border-top:1px solid #e7e1f3;margin:24px 0"><p>${escapeHtml(message).replaceAll('\n', '<br>')}</p></div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { kind } = classifyMailFailure(error);

    // KEEP THE LEAD FIRST — before anything in this block can RETURN.
    // This is the only copy of what the person wrote, and every way a
    // lead is lost from here looks the same: some path answers and
    // leaves without recording. Keeping it at the top is what makes a
    // guard or a branch added below this line safe by default.
    // See deliveryOutcome.js for why a log is the store here, and what
    // that honestly does and does not guarantee.
    console.error(undeliveredRecord({ ...lead, reason: kind }));
    console.error(
      'Partner inquiry email failed:',
      kind,
      error instanceof Error ? error.message : 'Unknown mail error',
    );

    // "Try again" is an instruction, and an instruction that cannot work is
    // worse than none: a rejected credential fails identically every time.
    const { error: message, status } = failureResponse(kind);
    return NextResponse.json({ error: message }, { status });
  }
}
