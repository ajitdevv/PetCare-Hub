import bcrypt from "bcryptjs";
import { getMemoryStore } from "@/lib/server/memory-store";
import { getSupabaseAdmin } from "@/lib/server/supabase";

const ADMIN_USER = {
  id: "admin-hardcoded-001",
  name: "System Admin",
  email: "admin@petcare.com",
  role: "admin"
};

function useMemory() {
  return !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === "your-service-role-key-here";
}

function nowIso() {
  return new Date().toISOString();
}

function sb() {
  return getSupabaseAdmin();
}

function sbCheck({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    role: row.role
  };
}

function mapPet(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    type: row.type,
    breed: row.breed || "",
    age: row.age,
    owner: row.owner,
    createdAt: row.created_at
  };
}

function mapBooking(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    petId: row.pet_id,
    userId: row.user_id,
    serviceType: row.service_type,
    date: row.date,
    status: row.status,
    createdAt: row.created_at
  };
}

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    image: row.image || "",
    description: row.description,
    createdAt: row.created_at
  };
}

function mapComplaint(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

function mapOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    items: row.items,
    totalAmount: row.total_amount,
    status: row.status,
    createdAt: row.created_at
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (useMemory()) {
    const store = getMemoryStore();
    if (store.users.some((u) => u.email === normalizedEmail)) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      createdAt: nowIso()
    };
    store.users.push(user);
    return sanitizeUser({ id: user._id, ...user });
  }

  const { data: existing } = await sb().from("users").select("id").eq("email", normalizedEmail).maybeSingle();
  if (existing) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const row = sbCheck(
    await sb().from("users").insert({ name, email: normalizedEmail, password: hashedPassword, role: "user" }).select().single()
  );
  return sanitizeUser(row);
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === ADMIN_USER.email && password === "admin123") {
    return ADMIN_USER;
  }

  if (useMemory()) {
    const user = getMemoryStore().users.find((u) => u.email === normalizedEmail);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return sanitizeUser({ id: user._id, ...user });
  }

  const { data: row } = await sb().from("users").select("*").eq("email", normalizedEmail).maybeSingle();
  if (!row || !(await bcrypt.compare(password, row.password))) {
    throw new Error("Invalid credentials");
  }
  return sanitizeUser(row);
}

export async function loginAdmin({ email, password }) {
  const user = await loginUser({ email, password });
  if (user.role !== "admin") throw new Error("Invalid admin credentials");
  return user;
}

export async function getUserById(id) {
  if (!id) return null;
  if (id === ADMIN_USER.id) return ADMIN_USER;

  if (useMemory()) {
    const user = getMemoryStore().users.find((u) => u._id === id);
    return user ? sanitizeUser({ id: user._id, ...user }) : null;
  }

  const { data: row } = await sb().from("users").select("*").eq("id", id).maybeSingle();
  return sanitizeUser(row);
}

export async function listUsers(currentUser) {
  if (currentUser?.role !== "admin") throw new Error("Admin access required");

  if (useMemory()) {
    return [ADMIN_USER, ...getMemoryStore().users.map((u) => sanitizeUser({ id: u._id, ...u }))];
  }

  const rows = sbCheck(await sb().from("users").select("*").order("created_at", { ascending: false }));
  const users = rows.map(sanitizeUser);
  if (!users.some((u) => u.id === ADMIN_USER.id)) users.unshift(ADMIN_USER);
  return users;
}

// ─── Pets ────────────────────────────────────────────────────────────────────

export async function listPets(currentUser) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const pets =
      currentUser.role === "admin"
        ? getMemoryStore().pets
        : getMemoryStore().pets.filter((p) => p.owner === currentUser.id);
    return pets.map((p) => ({ ...p, id: p._id }));
  }

  let query = sb().from("pets").select("*").order("created_at", { ascending: false });
  if (currentUser.role !== "admin") query = query.eq("owner", currentUser.id);
  const rows = sbCheck(await query);
  return rows.map(mapPet);
}

export async function addPet(currentUser, petData) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const pet = {
      _id: crypto.randomUUID(),
      name: petData.name,
      type: petData.type,
      breed: petData.breed || "",
      age: Number(petData.age || 0),
      owner: currentUser.id,
      createdAt: nowIso()
    };
    getMemoryStore().pets.unshift(pet);
    return { ...pet, id: pet._id };
  }

  const row = sbCheck(
    await sb().from("pets").insert({
      name: petData.name,
      type: petData.type,
      breed: petData.breed || "",
      age: Number(petData.age || 0),
      owner: currentUser.id
    }).select().single()
  );
  return mapPet(row);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function listBookings(currentUser) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const bookings =
      currentUser.role === "admin"
        ? getMemoryStore().bookings
        : getMemoryStore().bookings.filter((b) => b.userId === currentUser.id);
    return bookings.map((b) => ({ ...b, id: b._id }));
  }

  let query = sb().from("bookings").select("*").order("date", { ascending: true });
  if (currentUser.role !== "admin") query = query.eq("user_id", currentUser.id);
  const rows = sbCheck(await query);
  return rows.map(mapBooking);
}

export async function addBooking(currentUser, bookingData) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const booking = {
      _id: crypto.randomUUID(),
      petId: bookingData.petId,
      userId: currentUser.id,
      serviceType: bookingData.serviceType,
      date: bookingData.date,
      status: "upcoming",
      createdAt: nowIso()
    };
    getMemoryStore().bookings.unshift(booking);
    return { ...booking, id: booking._id };
  }

  const row = sbCheck(
    await sb().from("bookings").insert({
      pet_id: bookingData.petId,
      user_id: currentUser.id,
      service_type: bookingData.serviceType,
      date: bookingData.date,
      status: "upcoming"
    }).select().single()
  );
  return mapBooking(row);
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function listProducts() {
  if (useMemory()) {
    return getMemoryStore().products.map((p) => ({ ...p, id: p._id }));
  }

  let rows = sbCheck(await sb().from("products").select("*").order("created_at", { ascending: false }));
  if (rows.length === 0) {
    const seed = getMemoryStore().products.map(({ _id, id, createdAt, ...p }) => p);
    await sb().from("products").insert(seed);
    rows = sbCheck(await sb().from("products").select("*").order("created_at", { ascending: false }));
  }
  return rows.map(mapProduct);
}

export async function addProduct(currentUser, productData) {
  if (currentUser?.role !== "admin") throw new Error("Admin access required");

  const payload = {
    name: productData.name,
    price: Number(productData.price),
    category: productData.category,
    image: productData.image || "",
    description: productData.description
  };

  if (useMemory()) {
    const product = { _id: crypto.randomUUID(), ...payload, createdAt: nowIso() };
    getMemoryStore().products.unshift(product);
    return { ...product, id: product._id };
  }

  const row = sbCheck(await sb().from("products").insert(payload).select().single());
  return mapProduct(row);
}

export async function removeProduct(currentUser, id) {
  if (currentUser?.role !== "admin") throw new Error("Admin access required");

  if (useMemory()) {
    const store = getMemoryStore();
    store.products = store.products.filter((p) => p._id !== id);
    return true;
  }

  const { error } = await sb().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

// ─── Complaints ──────────────────────────────────────────────────────────────

export async function listComplaints(currentUser) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const complaints =
      currentUser.role === "admin"
        ? getMemoryStore().complaints
        : getMemoryStore().complaints.filter((c) => c.userId === currentUser.id);
    return complaints.map((c) => ({ ...c, id: c._id }));
  }

  let query = sb().from("complaints").select("*").order("created_at", { ascending: false });
  if (currentUser.role !== "admin") query = query.eq("user_id", currentUser.id);
  const rows = sbCheck(await query);
  return rows.map(mapComplaint);
}

export async function addComplaint(currentUser, message) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const complaint = {
      _id: crypto.randomUUID(),
      userId: currentUser.id,
      message,
      status: "Pending",
      createdAt: nowIso()
    };
    getMemoryStore().complaints.unshift(complaint);
    return { ...complaint, id: complaint._id };
  }

  const row = sbCheck(
    await sb().from("complaints").insert({ user_id: currentUser.id, message, status: "Pending" }).select().single()
  );
  return mapComplaint(row);
}

export async function resolveComplaint(currentUser, id) {
  if (currentUser?.role !== "admin") throw new Error("Admin access required");

  if (useMemory()) {
    const complaint = getMemoryStore().complaints.find((c) => c._id === id);
    if (!complaint) return null;
    complaint.status = "Resolved";
    return { ...complaint, id: complaint._id };
  }

  const row = sbCheck(
    await sb().from("complaints").update({ status: "Resolved" }).eq("id", id).select().single()
  );
  return mapComplaint(row);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function listOrders(currentUser) {
  if (!currentUser) throw new Error("Unauthorized");

  if (useMemory()) {
    const orders =
      currentUser.role === "admin"
        ? getMemoryStore().orders
        : getMemoryStore().orders.filter((o) => o.userId === currentUser.id);
    return orders.map((o) => ({ ...o, id: o._id }));
  }

  let query = sb().from("orders").select("*").order("created_at", { ascending: false });
  if (currentUser.role !== "admin") query = query.eq("user_id", currentUser.id);
  const rows = sbCheck(await query);
  return rows.map(mapOrder);
}

export async function createOrder(currentUser, items) {
  if (!currentUser) throw new Error("Unauthorized");
  if (!Array.isArray(items) || items.length === 0) throw new Error("Cart is empty");

  const normalizedItems = items.map((item) => ({
    productId: item.id || item.productId,
    name: item.name,
    quantity: Number(item.quantity),
    price: Number(item.price)
  }));
  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (useMemory()) {
    const order = {
      _id: crypto.randomUUID(),
      userId: currentUser.id,
      items: normalizedItems,
      totalAmount,
      status: "completed",
      createdAt: nowIso()
    };
    getMemoryStore().orders.unshift(order);
    return { ...order, id: order._id };
  }

  const row = sbCheck(
    await sb().from("orders").insert({
      user_id: currentUser.id,
      items: normalizedItems,
      total_amount: totalAmount,
      status: "completed"
    }).select().single()
  );
  return mapOrder(row);
}
