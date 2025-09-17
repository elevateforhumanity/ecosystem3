import React, { useState } from 'react';

export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function ask(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
      const data = await res.json();
      setHistory(h => [{ q, a: data.answer, topic: data.topic, ts: data.ts }, ...h]);
      setQ('');
    } catch (err) {
      setHistory(h => [{ q, a: 'Error retrieving answer', topic: 'error', ts: Date.now() }, ...h]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, fontFamily: 'system-ui, Arial, sans-serif', zIndex: 9999 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={btnStyle}>Ask</button>
      )}
      {open && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Assistant</strong>
            <button onClick={() => setOpen(false)} style={closeStyle}>×</button>
          </div>
          <form onSubmit={ask} style={{ marginTop: 8 }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Ask about pricing, affiliate, offers..."
              style={inputStyle}
              disabled={loading}
            />
            <button type="submit" disabled={loading} style={submitStyle}>{loading ? '...' : 'Ask'}</button>
          </form>
          <div style={{ marginTop: 8, maxHeight: 220, overflowY: 'auto', fontSize: 12 }}>
            {history.length === 0 && <div style={{ opacity: 0.7 }}>No questions yet.</div>}
            {history.map((h,i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>Q: {h.q}</div>
                <div>A: {h.a}</div>
                <div style={{ opacity: 0.6 }}>topic: {h.topic}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 24,
  cursor: 'pointer',
  fontSize: 14,
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
};

const panelStyle = {
  width: 300,
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
};

const closeStyle = { background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', lineHeight: 1 };

const inputStyle = { width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', marginBottom: 6 };

const submitStyle = { width: '100%', padding: '8px 10px', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 };
