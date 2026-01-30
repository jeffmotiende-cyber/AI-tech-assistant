import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, clearMessages } from '../store/chatSlice';

const Chat = () => {
  console.log('Chat component rendering');
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  console.log('Chat state:', { messages, loading, error });

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  console.log('About to render Chat component');
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        <button onClick={() => dispatch(clearMessages())} className="px-4 py-2 bg-gray-500 text-white rounded">Clear Chat</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && <p className="text-center text-gray-500">Welcome! How can I help you today?</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-center">AI is thinking...</p>}
        {error && <p className="text-center text-red-500">{error.message || 'Error sending message'}</p>}
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;