export interface Conversation {
  id: string;
  wa_id: string;
  name: string | null;
  mode: 'AI' | 'HUMAN';
  lead_status: string;
  origin_city: string | null;
  destination_city: string | null;
  move_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'customer' | 'ai' | 'human' | 'system';
  message_type: string;
  wa_message_id: string | null;
  created_at: string;
}