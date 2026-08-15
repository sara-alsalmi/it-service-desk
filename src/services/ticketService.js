const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function submitTicket(ticketData) {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not configured');
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`);
  }

  return response.json();
}