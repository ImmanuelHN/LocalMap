import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { addChatMessage, getChatMessages, getCurrentUser } from "../utils/storage.js";

export default function ChatWindow({ conversationId, title = "Chat" }) {
  const user = getCurrentUser();
  const sender = user?.role === "business" ? "business" : "customer";
  const replySender = sender === "business" ? "customer" : "business";
  const [messages, setMessages] = useState(() => getChatMessages(conversationId));
  const [text, setText] = useState("");

  useEffect(() => {
    function sync() {
      setMessages(getChatMessages(conversationId));
    }

    window.addEventListener("localhub:storage", sync);
    return () => window.removeEventListener("localhub:storage", sync);
  }, [conversationId]);

  function sendMessage(event) {
    event.preventDefault();
    if (!text.trim()) return;
    const next = addChatMessage(conversationId, { sender, text: text.trim() });
    setMessages(next);
    setText("");
  }

  function simulateReply() {
    const next = addChatMessage(conversationId, {
      sender: replySender,
      text: replySender === "business" ? "Yes, we can help with that today." : "Thanks, I will confirm the order.",
    });
    setMessages(next);
  }

  return (
    <section className="chat-window">
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Direct chat</span>
          <h2>{title}</h2>
        </div>
        <button className="button ghost small" type="button" onClick={simulateReply}>
          Simulate reply
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-bubble ${message.sender === sender ? "mine" : ""}`}>
            <p>{message.text}</p>
            <span>{message.createdAt}</span>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message"
          aria-label="Message"
        />
        <button className="button primary" type="submit">
          <SendHorizonal size={17} />
          Send
        </button>
      </form>
    </section>
  );
}
