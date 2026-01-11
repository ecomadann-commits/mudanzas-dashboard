'use client';

import { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '@/lib/types';
import MessageBubble from './MessageBubble';
import ModeToggle from './ModeToggle';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleMode: () => void;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onToggleMode,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-whatsapp-dark text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold mr-3">
            {(conversation.name || conversation.wa_id).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold">
              {conversation.name || `+${conversation.wa_id}`}
            </h2>
            <p className="text-sm text-gray-200">
              {conversation.origin_city && conversation.destination_city
                ? `${conversation.origin_city} → ${conversation.destination_city}`
                : conversation.wa_id}
            </p>
          </div>
        </div>
        
        <ModeToggle mode={conversation.mode} onToggle={onToggleMode} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 chat-pattern chat-scroll">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-100 p-3 border-t">
        {conversation.mode === 'HUMAN' ? (
          <div className="flex items-center space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-whatsapp-green"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="bg-whatsapp-green text-white px-6 py-3 rounded-lg font-medium hover:bg-whatsapp-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-700">
            <span className="font-medium">🤖 Modo AI activo</span>
            <p className="text-sm mt-1">
              El AI está respondiendo automáticamente. Cambia a modo Humano para escribir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}