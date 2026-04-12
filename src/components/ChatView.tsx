import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { memberColors } from "@/lib/data";
import type { ChatThread, ChatMessage } from "@/lib/types";

export function ChatView({
  thread,
  onBack,
}: {
  thread: ChatThread;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="fixed inset-y-0 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 flex-col overflow-hidden bg-background animate-in slide-in-from-right-4 fade-in duration-200">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0">
        <button onClick={onBack} className="btn-press p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">{thread.name}</h2>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> {thread.participants} people
          </span>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          {thread.image ? (
            <img src={thread.image} alt={thread.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-lg">
              {thread.emoji || "💬"}
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[11px] text-muted-foreground/60 bg-muted/50 px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isYou = msg.sender === "You";
          const colorIdx = msg.sender.charCodeAt(0) % memberColors.length;

          return (
            <div key={msg.id} className={`flex gap-2 ${isYou ? "flex-row-reverse" : ""}`}>
              {!isYou && (
                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                  <AvatarFallback className={`${memberColors[colorIdx]} text-[10px] font-semibold`}>
                    {msg.sender[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[75%] ${isYou ? "items-end" : "items-start"} flex flex-col`}>
                {!isYou && (
                  <span className="text-[10px] text-muted-foreground/60 mb-0.5 ml-1">{msg.sender}</span>
                )}
                <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  isYou
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-foreground rounded-bl-md"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-foreground/40 mt-0.5 mx-1">{msg.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border/40 bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="flex items-end gap-2 rounded-[1.5rem] bg-card p-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write a message..."
            className="h-11 flex-1 rounded-full border-0 bg-transparent px-4 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="btn-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
