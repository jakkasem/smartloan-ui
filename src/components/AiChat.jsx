import React, { useState, useRef, useEffect } from 'react';
import './AiChat.css';

const WEBHOOK_URL = 'https://feelings-arrested-provincial-stopping.trycloudflare.com/webhook/web-chatbot';

const SESSION_ID = `session_${Math.random().toString(36).substring(2, 10)}`;

function formatTime(date) {
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setError(null);
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, user_id: SESSION_ID }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data?.output ?? data?.message ?? data?.reply ?? JSON.stringify(data);

      setMessages(prev => [...prev, { role: 'ai', text: reply, time: new Date() }]);
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <p>สอบถามข้อมูลสินเชื่อหรือขอความช่วยเหลือจาก AI</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">🤖</span>
            <p>เริ่มการสนทนากับ AI Assistant</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className={`message-avatar ${msg.role}`}>
                {msg.role === 'ai' ? 'AI' : 'AD'}
              </div>
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className="message-bubble">{msg.text}</div>
                <div className="message-time">{formatTime(msg.time)}</div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="message-row ai">
            <div className="message-avatar ai">AI</div>
            <div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="chat-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="พิมพ์ข้อความ... (Enter ส่ง, Shift+Enter ขึ้นบรรทัดใหม่)"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default AiChat;
