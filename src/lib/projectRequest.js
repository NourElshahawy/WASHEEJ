/**
 * Sends a project request from the contact form through Web3Forms
 * (https://web3forms.com). Web3Forms emails each submission to the inbox
 * linked to the access key.
 *
 * The access key comes from NEXT_PUBLIC_WEB3FORMS_KEY (Vercel environment
 * variables for Production and Preview; .env.local for local work). It is
 * never written in the code. Web3Forms access keys are designed to be used
 * from the browser: the key only allows sending to its own inbox.
 *
 *   payload = { name, phone, email?, company?, country?, service, message, project?, locale }
 *   resolves when Web3Forms confirms the submission, throws otherwise.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 15000;

export async function sendProjectRequest(payload, { botcheck = false } = {}) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) throw new Error('Web3Forms access key is not configured (NEXT_PUBLIC_WEB3FORMS_KEY).');

  const body = {
    access_key: accessKey,
    subject: `طلب مشروع جديد — ${payload.name}`,
    from_name: 'Washeej website',
    // Web3Forms' honeypot: real visitors never tick this hidden box.
    botcheck,
    name: payload.name,
    phone: payload.phone,
    company: payload.company || '—',
    country: payload.country || '—',
    service: payload.service,
    message: payload.message,
    ...(payload.project ? { project: payload.project } : {}),
    page_language: payload.locale,
  };
  // Replies go straight to the visitor when they gave an email.
  if (payload.email) {
    body.email = payload.email;
    body.replyto = payload.email;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true) {
      throw new Error(result.message || `Web3Forms responded with ${response.status}`);
    }
    return result;
  } finally {
    clearTimeout(timer);
  }
}
