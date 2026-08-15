// Replace with actual n8n webhook URL when ready
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export async function submitTicket(ticketData) {
  if (!N8N_WEBHOOK_URL) {
    // Mock response when webhook URL is not configured
    return {
      success: true,
      ticketId: `TKT-${1000 + Math.floor(Math.random() * 9000)}`,
      status: 'Open',
    };
  }

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error(`Webhook error: ${response.status}`);
  }

  return response.json();
}
