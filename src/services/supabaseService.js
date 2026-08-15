import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

function mapTicket(ticket) {
  return {
    id: ticket.ticket_id,
    employeeName: ticket.employee_name,
    employeeEmail: ticket.employee_email,
    department: ticket.department,
    issueDescription: ticket.issue_description,

    category: ticket.category,
    impact: ticket.impact,
    urgency: ticket.urgency,
    priority: ticket.priority,

    assignedTeam: ticket.assigned_team,
    status: ticket.status,
    submittedAt: ticket.submitted_at,

    isEscalated: ticket.is_escalated,
    escalatedAt: ticket.escalated_at,
  };
}

export async function getTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapTicket);
}

export async function getTicketById(id) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_id', id)
    .single();

  if (error) {
    throw error;
  }

  return mapTicket(data);
}

export async function updateTicketStatus(id, status) {
  const { error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('ticket_id', id);

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function deleteTicket(id) {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('ticket_id', id);

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function getAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((alert) => ({
    id: alert.alert_id,
    ticketId: alert.ticket_id,
    type: alert.alert_type,
    message: alert.message,
    isRead: alert.is_read,
    createdAt: alert.created_at,
  }));
}

export async function markAlertAsRead(id) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('alert_id', id);

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}