'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { ChatMessage, MOCK_CONVERSATIONS, SenderRole } from '@/lib/mockMessages';

interface ChatModalProps {
  bookingId: number;
  /** Who is currently viewing — determines bubble alignment */
  viewerRole: SenderRole;
  /** Display name of the other party */
  otherPartyName: string;
  /** Short context line shown in the header (e.g. vehicle + dates) */
  context: string;
  onClose: () => void;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Group messages by calendar date */
function groupByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
  }
  return groups;
}

export default function ChatModal({
  bookingId,
  viewerRole,
  otherPartyName,
  context,
  onClose,
}: ChatModalProps) {
  const seed = MOCK_CONVERSATIONS[bookingId] ?? [];
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: viewerRole,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groups = groupByDate(messages);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
           style={{ height: 'min(600px, 92dvh)' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-foreground text-base leading-tight">
                {otherPartyName}
              </h3>
              <p className="text-xs text-foreground/40 mt-0.5 truncate max-w-[220px]">{context}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Message list ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {groups.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <MessageSquare size={24} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-foreground text-sm">No messages yet</p>
              <p className="text-xs text-foreground/40 mt-1">Start the conversation below</p>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-foreground/30 font-medium shrink-0">{group.date}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-2">
                {group.messages.map((msg) => {
                  const isMine = msg.sender === viewerRole;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[78%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm border border-border'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-foreground/30 px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="shrink-0 border-t border-border px-4 py-3 flex items-end gap-3 bg-background">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-border bg-muted/40 text-sm focus:outline-none focus:border-primary transition-colors leading-relaxed"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40"
          >
            {sending
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
