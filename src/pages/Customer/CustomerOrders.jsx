import OrderCard from "../../components/OrderCard.jsx";
import { getOrders } from "../../utils/storage.js";

export default function CustomerOrders() {
  const orders = getOrders();

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Customer orders</span>
        <h1>Track local orders</h1>
        <p>New orders placed from the order form show up here immediately.</p>
      </section>

      <section className="order-grid">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
    </main>
  );
}
