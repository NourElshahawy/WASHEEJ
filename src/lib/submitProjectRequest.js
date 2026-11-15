/**
 * Sends a project request from the contact form.
 *
 * THIS IS THE ONE PLACE TO CONNECT A BACKEND.
 * There is no backend yet: the request is only logged to the browser console.
 * Replace the body with a real call (an API route, a form service, an email
 * API …) and keep the contract:
 *
 *   payload = { name, company, country, service, message, locale, sentAt }
 *   resolves on success, throws on failure (the form then shows an error).
 */
export async function submitProjectRequest(payload) {
  console.info('[Washeej] Project request (not sent anywhere yet):', payload);

  // Example for later:
  // const response = await fetch('/api/project-request', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error('Request failed');

  // A short pause so the "sending" state is visible.
  await new Promise((resolve) => setTimeout(resolve, 600));
}
