'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto'
                  : 'bg-gray-100'
              } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
              <p className="text-sm">Thinking...</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}