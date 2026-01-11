'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation, Message } from '@/lib/types';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

export default function Dashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Load conversations
  useEffect(() => {
    loadConversations();

    // Subscribe to real-time changes
    const conversationSubscription = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          console.log('Conversation change:', payload);
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      conversationSubscription.unsubscribe();
    };
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);

      // Subscribe to new messages
      const messageSubscription = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation.id}`,
          },
          (payload) => {
            console.log('New message:', payload);
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        messageSubscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const toggleMode = async (conversation: Conversation) => {
    const newMode = conversation.mode === 'AI' ? 'HUMAN' : 'AI';
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_TOGGLE_MODE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          new_mode: newMode,
        }),
      });

      if (response.ok) {
        // Update local state
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, mode: newMode } : c
          )
        );
        if (selectedConversation?.id === conversation.id) {
          setSelectedConversation({ ...selectedConversation, mode: newMode });
        }
      }
    } catch (error) {
      console.error('Error toggling mode:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_N8N_SEND_MESSAGE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          wa_id: selectedConversation.wa_id,
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar mensaje');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 max-w-md bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-whatsapp-dark text-white p-4">
          <h1 className="text-xl font-semibold">🚚 Mudanzas Express</h1>
          <p className="text-sm text-gray-200">Panel de atención WhatsApp</p>
        </div>
        
        {/* Chat List */}
        <ChatList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
          onToggleMode={toggleMode}
        />
      </div>

      {/* Main - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={sendMessage}
            onToggleMode={() => toggleMode(selectedConversation)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-chat-bg chat-pattern">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">Selecciona una conversación</p>
              <p className="text-sm mt-2">para ver los mensajes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}