"use client";
import { useEffect, useRef, useState } from "react";
type ChatMessage = { from: "user" | "bot"; text: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hola, soy ROMI 🩺. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/chat";
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === "bot_message") {
          setMessages((p) => [...p, { from: "bot", text: payload.text }]);
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text || !wsRef.current) return;
    setMessages((p) => [...p, { from: "user", text }]);
    wsRef.current.send(JSON.stringify({ type: "user_message", text }));
    setInput("");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Chat con ROMI</h1>
        <div className="border rounded-2xl p-3 h-[60vh] overflow-y-auto bg-muted">
          {messages.map((m, i) => (
            <div key={i} className={`my-2 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-xl max-w-[80%] ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-white border"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="Escribe tu mensaje…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={send}>Enviar</button>
        </div>
      </div>
    </main>
  );
}
