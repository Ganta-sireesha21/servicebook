import crypto from "crypto";

const generateId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const now = () => new Date().toISOString();

const users = [
  {
    id: generateId(),
    name: "Alex Rivera",
    email: "provider@example.com",
    password: "$2b$10$uP7g27eVP4xAEJfeyaCgI.5/qeqIj0t6YdmJci18S3nFZx3gUZIei", // password: provider123
    role: "PROVIDER",
    phone: "+1-555-1234",
    profile_image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80",
    created_at: now(),
    updated_at: now(),
  },
];

const services = [
  {
    id: generateId(),
    provider_id: users[0].id,
    title: "Home Cleaning",
    description: "Full home cleaning service with eco-friendly products.",
    category: "Cleaning",
    price: 80,
    duration: 90,
    image_url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    status: "active",
    created_at: now(),
    updated_at: now(),
    availableSlots: [
      {
        id: generateId(),
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 86400000 + 90 * 60000).toISOString(),
        isBooked: false,
      },
      {
        id: generateId(),
        startTime: new Date(Date.now() + 2 * 86400000).toISOString(),
        endTime: new Date(Date.now() + 2 * 86400000 + 90 * 60000).toISOString(),
        isBooked: false,
      },
    ],
  },
  {
    id: generateId(),
    provider_id: users[0].id,
    title: "Mobile Car Wash",
    description: "Convenient on-site car washing and detailing.",
    category: "Auto",
    price: 55,
    duration: 60,
    image_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    status: "active",
    created_at: now(),
    updated_at: now(),
    availableSlots: [
      {
        id: generateId(),
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 86400000 + 60 * 60000).toISOString(),
        isBooked: false,
      },
      {
        id: generateId(),
        startTime: new Date(Date.now() + 3 * 86400000).toISOString(),
        endTime: new Date(Date.now() + 3 * 86400000 + 60 * 60000).toISOString(),
        isBooked: false,
      },
    ],
  },
];

const bookings = [];
const payments = [];
const notifications = [];

const getUserByEmail = (email) => users.find((user) => user.email.toLowerCase() === email.toLowerCase());
const getUserById = (id) => users.find((user) => user.id === id);
const getServiceById = (id) => services.find((service) => service.id === id);
const findServiceIndex = (id) => services.findIndex((service) => service.id === id);
const findSlotById = (slotId) => {
  for (const service of services) {
    const slot = service.availableSlots.find((availableSlot) => availableSlot.id === slotId);
    if (slot) {
      return { slot, service };
    }
  }
  return null;
};
const getBookingById = (id) => bookings.find((booking) => booking.id === id);
const getPaymentByBookingId = (bookingId) => payments.find((payment) => payment.bookingId === bookingId);

const createUser = ({ email, password, name, phone = "", profile_image = "" }) => {
  const newUser = {
    id: generateId(),
    email,
    password,
    name,
    role: "USER",
    phone,
    profile_image,
    created_at: now(),
    updated_at: now(),
  };
  users.push(newUser);
  return newUser;
};

const updateUserProfile = (userId, updates) => {
  const user = getUserById(userId);
  if (!user) return null;
  Object.assign(user, {
    ...updates,
    updated_at: now(),
  });
  return user;
};

const createService = ({ provider_id, title, description, category, price, duration, image_url, status = "active", availableSlots = [] }) => {
  const service = {
    id: generateId(),
    provider_id,
    title,
    description,
    category,
    price,
    duration,
    image_url,
    status,
    created_at: now(),
    updated_at: now(),
    availableSlots: (availableSlots || []).map((slot) => ({
      id: generateId(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: false,
    })),
  };
  services.push(service);
  return service;
};

const updateService = (id, updates) => {
  const index = findServiceIndex(id);
  if (index === -1) return null;
  const existing = services[index];
  services[index] = {
    ...existing,
    ...updates,
    updated_at: now(),
  };
  return services[index];
};

const deleteService = (id) => {
  const index = findServiceIndex(id);
  if (index === -1) return false;
  services.splice(index, 1);
  return true;
};

const createBooking = ({ userId, serviceId, slotId }) => {
  const service = getServiceById(serviceId);
  const slotRecord = findSlotById(slotId);
  if (!service || !slotRecord) return null;
  const { slot } = slotRecord;
  const booking = {
    id: generateId(),
    user_id: userId,
    service_id: serviceId,
    slot_id: slotId,
    booking_date: slot.startTime.split("T")[0],
    time_slot: `${slot.startTime} - ${slot.endTime}`,
    status: "confirmed",
    created_at: now(),
    updated_at: now(),
  };
  bookings.push(booking);
  slot.isBooked = true;

  const payment = {
    id: generateId(),
    booking_id: booking.id,
    amount: service.price,
    payment_method: "card",
    transaction_id: `txn_${Date.now()}`,
    payment_status: "completed",
    created_at: now(),
  };
  payments.push(payment);

  return { booking, payment };
};

const createPayment = ({ bookingId, paymentMethod = "card", transactionId, amount }) => {
  const booking = getBookingById(bookingId);
  if (!booking) return null;

  const existing = payments.find((payment) => payment.booking_id === bookingId);
  if (existing) return existing;

  const service = getServiceById(booking.service_id);
  const payment = {
    id: generateId(),
    booking_id: bookingId,
    amount: amount ?? service?.price ?? 0,
    payment_method: paymentMethod,
    transaction_id: transactionId ?? `txn_${Date.now()}`,
    payment_status: "completed",
    created_at: now(),
  };
  payments.push(payment);
  return payment;
};

const updateBooking = (id, updates) => {
  const booking = getBookingById(id);
  if (!booking) return null;
  Object.assign(booking, {
    ...updates,
    updated_at: now(),
  });
  return booking;
};

const cancelBooking = (id) => {
  const booking = getBookingById(id);
  if (!booking) return null;
  booking.status = "cancelled";
  booking.updated_at = now();
  const payment = getPaymentByBookingId(id);
  if (payment) payment.payment_status = "refunded";
  const slotRecord = findSlotById(booking.slot_id);
  if (slotRecord) slotRecord.slot.isBooked = false;
  return booking;
};

const getBookingsByUserId = (userId) =>
  bookings
    .filter((booking) => booking.user_id === userId)
    .map((booking) => ({
      ...booking,
      service: getServiceById(booking.service_id),
      payment: getPaymentByBookingId(booking.id),
      slot: findSlotById(booking.slot_id)?.slot,
    }));

const getAllBookings = () =>
  bookings.map((booking) => ({
    ...booking,
    service: getServiceById(booking.service_id),
    payment: getPaymentByBookingId(booking.id),
    slot: findSlotById(booking.slot_id)?.slot,
  }));

const getPaymentsByUserId = (userId) =>
  payments.filter((payment) => {
    const booking = bookings.find((item) => item.id === payment.booking_id);
    return booking?.user_id === userId;
  });

const getNotificationsByUserId = (userId) => notifications.filter((notification) => notification.user_id === userId);

const markNotificationRead = (userId, id) => {
  const notification = notifications.find((item) => item.id === id && item.user_id === userId);
  if (!notification) return null;
  notification.is_read = true;
  return notification;
};

const createNotification = ({ user_id, title, message }) => {
  const notification = {
    id: generateId(),
    user_id,
    title,
    message,
    is_read: false,
    created_at: now(),
  };
  notifications.push(notification);
  return notification;
};

export default {
  users,
  services,
  bookings,
  payments,
  notifications,
  getUserByEmail,
  getUserById,
  getServiceById,
  findSlotById,
  getBookingById,
  getPaymentByBookingId,
  getNotificationsByUserId,
  createUser,
  updateUserProfile,
  createService,
  updateService,
  deleteService,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingsByUserId,
  getAllBookings,
  getPaymentsByUserId,
  createPayment,
  createNotification,
  getNotificationsByUserId,
  markNotificationRead,
};
