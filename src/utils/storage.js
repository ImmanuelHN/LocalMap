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
  window.localStorage.removeItem(KEYS.pendingEmail);
  window.localStorage.removeItem("localhub_user_location");
}

export function setPendingEmail(email) {
  return write(KEYS.pendingEmail, email);
}

export function getPendingEmail() {
  return read(KEYS.pendingEmail, "");
}

export function getUserLocation() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const val = window.localStorage.getItem("localhub_user_location");
  if (val) {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }
  const user = getCurrentUser();
  if (!user) return null;
  if (user.role === "customer") {
    const profile = getProfile();
    return profile.customer?.location || null;
  }
  if (user.role === "business") {
    const profile = getBusinessProfile();
    return profile?.location || null;
  }
  if (user.role === "rider") {
    const profile = getRiderProfile();
    return profile?.location || null;
  }
  return null;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
}

const seededIds = new Set([
  "home-bakery",
  "cloud-kitchen",
  "tailor-shop",
  "handmade-crafts",
  "beauty-services",
  "electrician",
  "mechanic",
  "freelance-designer",
  "organic-grocer",
  "pet-care-home"
]);

export function getBusinesses() {
  const list = read(KEYS.businesses, businessesSeed);
  const userLoc = getUserLocation();
  if (userLoc) {
    return list.map((b) => {
      let realLocation = b.location;
      if (seededIds.has(b.id)) {
        const dLat = b.location.lat - 17.4305;
        const dLng = b.location.lng - 78.407;
        realLocation = {
          lat: Number((userLoc.lat + dLat).toFixed(5)),
          lng: Number((userLoc.lng + dLng).toFixed(5))
        };
      }
      const distance = calculateDistance(userLoc.lat, userLoc.lng, realLocation.lat, realLocation.lng);
      return { ...b, location: realLocation, distance };
    });
  }
  return list;
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

const seededRiderIds = new Set(["rider-1", "rider-2", "rider-3", "rider-4", "rider-5"]);

export function getRiders() {
  const list = read(KEYS.riders, ridersSeed);
  const userLoc = getUserLocation();
  if (userLoc) {
    return list.map((r) => {
      let realLocation = r.location;
      if (seededRiderIds.has(r.id)) {
        const dLat = r.location.lat - 17.4305;
        const dLng = r.location.lng - 78.407;
        realLocation = {
          lat: Number((userLoc.lat + dLat).toFixed(5)),
          lng: Number((userLoc.lng + dLng).toFixed(5))
        };
      }
      return { ...r, location: realLocation };
    });
  }
  return list;
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
  const list = read(KEYS.deliveryJobs, deliveryJobsSeed);
  const userLoc = getUserLocation();
  if (userLoc) {
    return list.map((j) => {
      let pickupLocation = j.pickupLocation;
      let dropLocation = j.dropLocation;
      if (j.id.startsWith("delivery-")) {
        const dPickupLat = j.pickupLocation.lat - 17.4305;
        const dPickupLng = j.pickupLocation.lng - 78.407;
        const dDropLat = j.dropLocation.lat - 17.4305;
        const dDropLng = j.dropLocation.lng - 78.407;
        pickupLocation = {
          lat: Number((userLoc.lat + dPickupLat).toFixed(5)),
          lng: Number((userLoc.lng + dPickupLng).toFixed(5))
        };
        dropLocation = {
          lat: Number((userLoc.lat + dDropLat).toFixed(5)),
          lng: Number((userLoc.lng + dDropLng).toFixed(5))
        };
      }
      const distance = calculateDistance(pickupLocation.lat, pickupLocation.lng, dropLocation.lat, dropLocation.lng);
      return { ...j, pickupLocation, dropLocation, distance };
    });
  }
  return list;
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

export function getCustomerProfile() {
  const profiles = getProfile();
  return profiles.customer || null;
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
