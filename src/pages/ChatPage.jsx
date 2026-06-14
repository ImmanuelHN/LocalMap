import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow.jsx";
import { getBusinesses, getCurrentUser, getOrders } from "../utils/storage.js";

export default function ChatPage() {
  const { businessId } = useParams();
  const user = getCurrentUser();
  const businesses = getBusinesses();
  const orders = getOrders();
  const business = businesses.find((item) => item.id === businessId);
  const businessThreads = useMemo(() => orders.slice(0, 5), [orders]);
  const [selectedThreadId, setSelectedThreadId] = useState(businessThreads[0]?.id || "business-inbox");

  if (user.role === "business") {
    const selectedOrder = businessThreads.find((order) => order.id === selectedThreadId) || businessThreads[0];

    return (
      <main className="page-stack">
        <section className="section-heading">
          <span className="eyebrow">Chat customers</span>
          <h1>Customer inbox</h1>
          <p>Dummy conversations are stored in LocalStorage so the flow feels real in demos.</p>
        </section>

        <section className="split-layout">
          <aside className="thread-list">
            {businessThreads.map((order) => (
              <button
                type="button"
                key={order.id}
                className={order.id === selectedThreadId ? "active" : ""}
                onClick={() => setSelectedThreadId(order.id)}
              >
                <MessageCircle size={17} />
                <span>
                  <strong>{order.customerName}</strong>
                  {order.productName}
                </span>
              </button>
            ))}
          </aside>
          <ChatWindow
            key={selectedThreadId}
            conversationId={`thread-${selectedThreadId}`}
            title={selectedOrder ? `${selectedOrder.customerName} about ${selectedOrder.productName}` : "Customer chat"}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Direct chat</span>
        <h1>{business?.name || "Business chat"}</h1>
        <p>Ask availability, pricing, delivery timing, or custom requests before ordering.</p>
      </section>

      <ChatWindow conversationId={`business-${businessId}`} title={business?.name || "Business chat"} />
    </main>
  );
}
