import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addOrder, getBusinesses, getCurrentUser } from "../utils/storage.js";

export default function OrderPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const business = getBusinesses().find((item) => item.id === businessId);
  const [form, setForm] = useState({
    productName: "",
    quantity: 1,
    instructions: "",
  });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!business || !form.productName.trim()) return;

    addOrder({
      businessId: business.id,
      businessName: business.name,
      customerName: user.name || "Demo Customer",
      productName: form.productName,
      quantity: Number(form.quantity) || 1,
      instructions: form.instructions,
      total: (Number(form.quantity) || 1) * 250,
    });

    navigate("/customer/orders");
  }

  if (!business) {
    return (
      <main className="page-stack">
        <section className="content-card">
          <h1>Business not found</h1>
          <Link className="button primary" to="/customer">Back to dashboard</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Place order</span>
        <h1>{business.name}</h1>
        <p>Orders are saved to LocalStorage and appear immediately in customer and business screens.</p>
      </section>

      <section className="content-card two-column">
        <div className="order-business-summary">
          <img src={business.images?.[0]} alt={business.name} />
          <h2>{business.name}</h2>
          <p>{business.description}</p>
          <span className="category-pill">{business.category}</span>
        </div>

        <form className="form-grid" onSubmit={placeOrder}>
          <label>
            Product Name
            <input
              name="productName"
              value={form.productName}
              onChange={updateField}
              placeholder="Cake, service, repair, hamper"
              required
            />
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={updateField} />
          </label>
          <label>
            Special Instructions
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={updateField}
              placeholder="Delivery timing, customization, pickup notes"
            />
          </label>
          <button className="button primary" type="submit">
            <ShoppingBag size={17} />
            Place Order
          </button>
        </form>
      </section>
    </main>
  );
}
