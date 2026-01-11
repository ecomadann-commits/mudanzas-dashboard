'use client';

import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatListProps {
  conversations: Conversation[];
  selectedId: string | undefined;
  onSelect: (conversation: Conversation) => void;
  onToggleMode: (conversation: Conversation) => void;
}

export default function ChatList({
  conversations,
  selectedId,
  onSelect,
  onToggleMode,
}: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No hay conversaciones</p>
          <p className="text-sm mt-2">Las conversaciones aparecerán aquí cuando lleguen mensajes de WhatsApp</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === conversation.id ? 'bg-gray-100' : ''
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-lg mr-3">
              {(conversation.name || conversation.wa_id).charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conversation.name || `+${conversation.wa_id}`}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {conversation.origin_city && conversation.destination_city
                    ? `${conversation.origin_city} → ${conversation.destination_city}`
                    : 'Nueva conversación'}
                </p>
                
                {/* Mode Badge */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMode(conversation);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    conversation.mode === 'AI'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {conversation.mode === 'AI' ? '🤖 AI' : '👨 Humano'}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}