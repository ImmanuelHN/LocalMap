import { useState } from "react";
import OrderCard from "../../components/OrderCard.jsx";
import { getOrders, updateOrderStatus } from "../../utils/storage.js";

export default function ManageOrders() {
  const [orders, setOrders] = useState(() => getOrders());

  function handleStatusChange(orderId, status) {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Manage orders</span>
        <h1>All dummy orders</h1>
        <p>Move each order through Pending, Accepted, Preparing, Ready, and Completed.</p>
      </section>

      <section className="order-grid">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} editable onStatusChange={handleStatusChange} />
        ))}
      </section>
    </main>
  );
}
