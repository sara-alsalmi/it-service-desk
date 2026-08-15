// Replace with actual Supabase client when ready
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { mockTickets } from '../data/mockTickets';

export async function getTickets() {
  // return supabase.from('tickets').select('*').order('submittedAt', { ascending: false });
  return Promise.resolve([...mockTickets]);
}

export async function getTicketById(id) {
  // return supabase.from('tickets').select('*').eq('id', id).single();
  const ticket = mockTickets.find((t) => t.id === id);
  return Promise.resolve(ticket || null);
}

export async function updateTicketStatus(id, status) {
  // return supabase.from('tickets').update({ status }).eq('id', id);
  const ticket = mockTickets.find((t) => t.id === id);
  if (ticket) ticket.status = status;
  return Promise.resolve({ success: true });
}
