import { useState } from "react";
import { MessageCircle, Users, ChevronRight, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { memberColors, events } from "@/lib/data";
import { ChatView } from "./ChatView";
import type { Plan, ChatThread, ChatMessage } from "@/lib/types";

function generateChatMessages(name: string, type: "plan" | "event"): ChatMessage[] {
  const msgs: ChatMessage[] = [
    { id: "sys", sender: "", text: "You joined this " + type, time: "", isSystem: true },
  ];
  const sampleChats: Record<string, ChatMessage[]> = {
    "Pub Crawl Poblado": [
      { id: "1", sender: "Alex", text: "Meeting at the entrance at 7:45!", time: "6:30 PM" },
      { id: "2", sender: "Mia", text: "Can't wait! Is there a dress code?", time: "6:45 PM" },
      { id: "3", sender: "Carlos", text: "Nah, come as you are 🍻", time: "7:01 PM" },
    ],
    "Reggaeton Night": [
      { id: "1", sender: "Tom", text: "Anyone want to share an Uber there?", time: "8:15 PM" },
      { id: "2", sender: "Lena", text: "Yes! I'm near Parque Lleras", time: "8:20 PM" },
    ],
    "Latin Dance Party": [
      { id: "1", sender: "João", text: "The beginner class starts at 9 sharp!", time: "7:00 PM" },
      { id: "2", sender: "Emma", text: "So excited, first time doing salsa 💃", time: "7:30 PM" },
      { id: "3", sender: "Ava", text: "Don't worry it's super fun and chill", time: "7:45 PM" },
    ],
    "Rooftop Sunset Session": [
      { id: "1", sender: "Sophie", text: "The sunset is going to be amazing today ☀️", time: "4:00 PM" },
      { id: "2", sender: "Max", text: "Already on my way!", time: "4:30 PM" },
    ],
    "Live Jazz at Calle 10": [
      { id: "1", sender: "Nina", text: "Saved a table near the stage 🎷", time: "6:45 PM" },
    ],
  };
  const extra = sampleChats[name] || [
    { id: "1", sender: "Someone", text: "Hey! See you there 👋", time: "Recently" },
  ];
  return [...msgs, ...extra];
}

export function ActivityTab({
  joinedEvents,
  joinedPlans,
  plans,
  eventGoingCounts,
}: {
  joinedEvents: Set<string>;
  joinedPlans: Set<string>;
  plans: Plan[];
  eventGoingCounts: Record<string, number>;
}) {
  const [openChat, setOpenChat] = useState<ChatThread | null>(null);

  // Build chat threads from joined events
  const eventThreads: ChatThread[] = events
    .filter(e => joinedEvents.has(e.id))
    .map(e => {
      const msgs = generateChatMessages(e.name, "event");
      const lastMsg = msgs[msgs.length - 1];
      return {
        id: `event-${e.id}`,
        type: "event" as const,
        name: e.name,
        emoji: e.emoji,
        image: e.image,
        lastMessage: lastMsg.isSystem ? "You joined" : `${lastMsg.sender}: ${lastMsg.text}`,
        lastMessageTime: lastMsg.time || "Just now",
        participants: eventGoingCounts[e.id] || e.going,
        unread: Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : 0,
        messages: msgs,
      };
    });

  // Build chat threads from joined plans
  const planThreads: ChatThread[] = plans
    .filter(p => joinedPlans.has(p.id))
    .map(p => {
      const msgs = generateChatMessages(p.title, "plan");
      const lastMsg = msgs[msgs.length - 1];
      return {
        id: `plan-${p.id}`,
        type: "plan" as const,
        name: p.title,
        lastMessage: lastMsg.isSystem ? "You joined" : `${lastMsg.sender}: ${lastMsg.text}`,
        lastMessageTime: lastMsg.time || "Just now",
        participants: p.members.length,
        unread: Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0,
        messages: msgs,
      };
    });

  const allThreads = [...eventThreads, ...planThreads];
  const hasActivity = allThreads.length > 0;

  // Activity feed items
  const activityItems = [
    joinedEvents.size > 0 && { text: `You're going to ${joinedEvents.size} event${joinedEvents.size > 1 ? "s" : ""} tonight`, time: "Now" },
    joinedPlans.size > 0 && { text: `${joinedPlans.size} plan${joinedPlans.size > 1 ? "s" : ""} you've joined`, time: "Today" },
    { text: "3 new events added near you", time: "1h ago" },
    { text: "New plan: Sunset drinks in Poblado", time: "2h ago" },
  ].filter(Boolean) as { text: string; time: string }[];

  if (openChat) {
    return <ChatView thread={openChat} onBack={() => setOpenChat(null)} />;
  }

  return (
    <div className="space-y-5 tab-content">
      {/* Chats section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Chats
        </h2>

        {!hasActivity ? (
          <div className="bg-card rounded-2xl p-6 text-center space-y-2">
            <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No chats yet</p>
            <p className="text-xs text-muted-foreground/70">
              Join an event or plan to start chatting with the group
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border/30">
            {allThreads.map((thread, idx) => (
              <button
                key={thread.id}
                onClick={() => setOpenChat(thread)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-secondary/30 transition-colors btn-press animate-in fade-in slide-in-from-bottom-1 duration-200"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden">
                  {thread.image ? (
                    <img src={thread.image} alt={thread.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xl">
                      {thread.emoji || (thread.type === "plan" ? "📋" : "🎉")}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">{thread.name}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0">{thread.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                    {thread.unread > 0 && (
                      <Badge className="shrink-0 bg-primary text-primary-foreground border-0 text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
                        {thread.unread}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" /> {thread.participants} people
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Updates
        </h2>
        <div className="space-y-2">
          {activityItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200"
              style={{ animationDelay: `${(allThreads.length + idx) * 60}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
              <p className="text-xs text-muted-foreground flex-1">{item.text}</p>
              <span className="text-[10px] text-muted-foreground/50 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
