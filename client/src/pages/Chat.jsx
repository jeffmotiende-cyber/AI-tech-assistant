import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, clearMessages } from '../store/chatSlice';

const Chat = () => {
  console.log('Chat component rendering');
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  console.log('Chat state:', { messages, loading, error });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage(input));
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  console.log('About to render Chat component');

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gradient-to-br from-purple-50 via-white to-emerald-50">
      {/* Header */}
      <div className="glass-dark border-b border-purple-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">AI Chat Assistant</h1>
            <p className="text-sm text-gray-600 mt-1">Ask me anything about electronics in Kenya</p>
          </div>
          <button
            onClick={() => dispatch(clearMessages())}
            className="btn btn-ghost text-sm px-3 py-2"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to AI Chat!</h3>
              <p className="text-gray-500">How can I help you find the perfect electronics today?</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${msg.role === 'user' ? 'order-2' : 'order-1'
                }`}>
                {/* Avatar */}
                <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user'
                      ? 'bg-gradient-primary'
                      : 'bg-gradient-accent'
                    }`}>
                    {msg.role === 'user' ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-5 py-3 rounded-2xl shadow-md ${msg.role === 'user'
                      ? 'bg-gradient-primary text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                    }`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="px-5 py-3 bg-white rounded-2xl rounded-tl-sm shadow-md border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center animate-slide-up">
              <div className="px-5 py-3 bg-red-50 border-l-4 border-red-500 rounded-lg max-w-md">
                <p className="text-red-700 text-sm font-medium">
                  {error.message || 'Error sending message. Please try again.'}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-dark rounded-2xl p-2 flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none resize-none text-gray-800 placeholder-gray-400"
                disabled={loading}
                style={{ maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
