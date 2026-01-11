import { Message } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.sender === 'customer';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCustomer
            ? 'bg-white text-gray-900 rounded-tl-none'
            : message.sender === 'ai'
            ? 'bg-blue-100 text-blue-900 rounded-tr-none'
            : 'bg-whatsapp-light text-gray-900 rounded-tr-none'
        }`}
      >
        {/* Sender label for AI/Human */}
        {!isCustomer && (
          <div className="text-xs font-medium mb-1">
            {message.sender === 'ai' ? '🤖 AI' : '👨 Operador'}
          </div>
        )}
        
        {/* Message content */}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        
        {/* Timestamp */}
        <div className={`text-xs mt-1 ${isCustomer ? 'text-gray-500' : 'text-gray-600'}`}>
          {format(new Date(message.created_at), "HH:mm", { locale: es })}
        </div>
      </div>
    </div>
  );
}