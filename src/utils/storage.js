import businessesSeed from "../data/businesses.json";
import reviewsSeed from "../data/reviews.json";
import ordersSeed from "../data/orders.json";
import ridersSeed from "../data/riders.json";
import deliveryJobsSeed from "../data/deliveryJobs.json";

const KEYS = {
  seeded: "localhub_seeded_v1",
  businesses: "localhub_businesses",
  reviews: "localhub_reviews",
  orders: "localhub_orders",
  riders: "localhub_riders",
  deliveryJobs: "localhub_delivery_jobs",
  user: "localhub_user",
  pendingEmail: "localhub_pending_email",
  businessProfile: "localhub_business_profile",
  riderProfile: "localhub_rider_profile",
  profile: "localhub_profile",
  notifications: "localhub_notifications",
};

const seedPayload = {
  [KEYS.businesses]: businessesSeed,
  [KEYS.reviews]: reviewsSeed,
  [KEYS.orders]: ordersSeed,
  [KEYS.riders]: ridersSeed,
  [KEYS.deliveryJobs]: deliveryJobsSeed,
  [KEYS.notifications]: [
    {
      id: "notification-1",
      type: "Order Received",
      text: "Home Bakery received a new cake order.",
      read: false,
      createdAt: "2026-06-11",
    },
    {
      id: "notification-2",
      type: "Delivery Assigned",
      text: "A delivery job is waiting near Jubilee Hills.",
      read: false,
      createdAt: "2026-06-12",
    },
  ],
};

function hasStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function read(key, fallback = null) {
  if (!hasStorage()) return fallback;
  seedLocalhubData();
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!hasStorage()) return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("localhub:storage", { detail: { key } }));
  return value;
}

export function seedLocalhubData() {
  if (!hasStorage()) return;
  if (window.localStorage.getItem(KEYS.seeded)) return;

  Object.entries(seedPayload).forEach(([key, value]) => {
    if (!window.localStorage.getItem(key)) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  });

  window.localStorage.setItem(KEYS.seeded, "true");
}

export function getCurrentUser() {
  return read(KEYS.user, null);
}

export function setCurrentUser(user) {
  return write(KEYS.user, user);
}

export function logout() {
  if (!hasStorage()) return;
  window.localStorage.removeItem(KEYS.user);
}

export function setPendingEmail(email) {
  return write(KEYS.pendingEmail, email);
}

export function getPendingEmail() {
  return read(KEYS.pendingEmail, "");
}

export function getBusinesses() {
  return read(KEYS.businesses, businessesSeed);
}

export function saveBusinesses(businesses) {
  return write(KEYS.businesses, businesses);
}

export function upsertBusiness(business) {
  const businesses = getBusinesses();
  const exists = businesses.some((item) => item.id === business.id);
  const updated = exists
    ? businesses.map((item) => (item.id === business.id ? business : item))
    : [business, ...businesses];
  return saveBusinesses(updated);
}

export function getReviews() {
  return read(KEYS.reviews, reviewsSeed);
}

export function addReview(review) {
  const next = [
    {
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...review,
    },
    ...getReviews(),
  ];
  addNotification("Review Added", `A new review was added for ${review.businessName || "a business"}.`);
  return write(KEYS.reviews, next);
}

export function getOrders() {
  return read(KEYS.orders, ordersSeed);
}

export function addOrder(order) {
  const next = [
    {
      id: `order-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10),
      ...order,
    },
    ...getOrders(),
  ];
  addNotification("Order Received", `${order.businessName} received a new order.`);
  return write(KEYS.orders, next);
}

export function updateOrderStatus(orderId, status) {
  const updated = getOrders().map((order) => (order.id === orderId ? { ...order, status } : order));
  addNotification("Order Accepted", `Order ${orderId} moved to ${status}.`);
  return write(KEYS.orders, updated);
}

export function getRiders() {
  return read(KEYS.riders, ridersSeed);
}

export function saveRiders(riders) {
  return write(KEYS.riders, riders);
}

export function upsertRider(rider) {
  const riders = getRiders();
  const exists = riders.some((item) => item.id === rider.id);
  const updated = exists
    ? riders.map((item) => (item.id === rider.id ? rider : item))
    : [rider, ...riders];
  return saveRiders(updated);
}

export function getDeliveryJobs() {
  return read(KEYS.deliveryJobs, deliveryJobsSeed);
}

export function updateDeliveryStatus(jobId, status) {
  const updated = getDeliveryJobs().map((job) => (job.id === jobId ? { ...job, status } : job));
  addNotification("Delivery Assigned", `Delivery ${jobId} moved to ${status}.`);
  return write(KEYS.deliveryJobs, updated);
}

export function getBusinessProfile() {
  return read(KEYS.businessProfile, null);
}

export function saveBusinessProfile(profile) {
  return write(KEYS.businessProfile, profile);
}

export function getRiderProfile() {
  return read(KEYS.riderProfile, null);
}

export function saveRiderProfile(profile) {
  return write(KEYS.riderProfile, profile);
}

export function getProfile() {
  return read(KEYS.profile, {});
}

export function saveProfile(profile) {
  return write(KEYS.profile, profile);
}

export function getChatMessages(conversationId) {
  return read(`localhub_chat_${conversationId}`, [
    {
      id: "message-1",
      sender: "business",
      text: "Hi, thanks for reaching out. How can we help today?",
      createdAt: "10:00 AM",
    },
    {
      id: "message-2",
      sender: "customer",
      text: "I want to check availability before placing an order.",
      createdAt: "10:02 AM",
    },
  ]);
}

export function addChatMessage(conversationId, message) {
  const next = [
    ...getChatMessages(conversationId),
    {
      id: `message-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      ...message,
    },
  ];
  return write(`localhub_chat_${conversationId}`, next);
}

export function getNotifications() {
  return read(KEYS.notifications, []);
}

export function addNotification(type, text) {
  const notification = {
    id: `notification-${Date.now()}`,
    type,
    text,
    read: false,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return write(KEYS.notifications, [notification, ...getNotifications()]);
}

export function markNotificationRead(notificationId) {
  const updated = getNotifications().map((notification) =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  return write(KEYS.notifications, updated);
}
