"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { SERVICES } from "@/lib/constants";

const AppContext = createContext(null);
const CART_KEY = "petcare_cart";

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistCart(cart) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setProducts(await apiFetch("/api/products"));
  }, []);

  const refetchData = useCallback(async (currentUser) => {
    const [productsData, petsData, bookingsData, complaintsData, ordersData, usersData] =
      await Promise.all([
        apiFetch("/api/products"),
        currentUser ? apiFetch("/api/pets") : Promise.resolve([]),
        currentUser ? apiFetch("/api/bookings") : Promise.resolve([]),
        currentUser ? apiFetch("/api/complaints") : Promise.resolve([]),
        currentUser ? apiFetch("/api/orders") : Promise.resolve([]),
        currentUser?.role === "admin" ? apiFetch("/api/users") : Promise.resolve([])
      ]);

    setProducts(productsData);
    setPets(petsData);
    setBookings(bookingsData);
    setComplaints(complaintsData);
    setOrders(ordersData);
    setUsers(usersData);
  }, []);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await apiFetch("/api/auth/me");
      setUser(session.user);
      await refetchData(session.user);
    } catch {
      setUser(null);
      setUsers([]);
      setPets([]);
      setBookings([]);
      setComplaints([]);
      setOrders([]);
      await loadProducts();
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts, refetchData]);

  useEffect(() => {
    setCart(readCart());
    bootstrap();
  }, [bootstrap]);

  const addToCart = useCallback((product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      const next = existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...current, { ...product, quantity: 1 }];
      persistCart(next);
      return next;
    });
  }, []);

  const loginUser = useCallback(async (email, password, role = "user") => {
    const data = await apiFetch(
      role === "admin" ? "/api/auth/admin/login" : "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password })
      }
    );
    setUser(data.user);
    await refetchData(data.user);
    return data;
  }, [refetchData]);

  const registerUser = useCallback(async (email, password, name) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name })
    });
    setUser(data.user);
    await refetchData(data.user);
    return data;
  }, [refetchData]);

  const logoutUser = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUsers([]);
    setPets([]);
    setBookings([]);
    setComplaints([]);
    setOrders([]);
    await loadProducts();
  }, [loadProducts]);

  const addPet = useCallback(async (newPet) => {
    const pet = await apiFetch("/api/pets", {
      method: "POST",
      body: JSON.stringify(newPet)
    });
    setPets((current) => [pet, ...current]);
    return pet;
  }, []);

  const bookAppointment = useCallback(async (booking) => {
    const created = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(booking)
    });
    setBookings((current) => [created, ...current]);
    return created;
  }, []);

  const createComplaint = useCallback(async (message) => {
    const complaint = await apiFetch("/api/complaints", {
      method: "POST",
      body: JSON.stringify({ message })
    });
    setComplaints((current) => [complaint, ...current]);
    return complaint;
  }, []);

  const resolveComplaint = useCallback(async (id) => {
    const resolved = await apiFetch(`/api/complaints/${id}`, { method: "PUT" });
    setComplaints((current) =>
      current.map((complaint) => (complaint.id === id ? resolved : complaint))
    );
    return resolved;
  }, []);

  const addProduct = useCallback(async (product) => {
    const created = await apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product)
    });
    setProducts((current) => [created, ...current]);
    return created;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  const checkout = useCallback(async () => {
    const order = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({ items: cart })
    });
    setOrders((current) => [order, ...current]);
    setCart([]);
    persistCart([]);
    return order;
  }, [cart]);

  const value = useMemo(
    () => ({
      user,
      users,
      pets,
      bookings,
      products,
      complaints,
      orders,
      cart,
      services: SERVICES,
      isLoading,
      addPet,
      addProduct,
      deleteProduct,
      bookAppointment,
      createComplaint,
      resolveComplaint,
      loginUser,
      registerUser,
      logoutUser,
      addToCart,
      checkout,
      refetchData: () => refetchData(user)
    }),
    [
      addPet,
      addProduct,
      addToCart,
      bookAppointment,
      cart,
      checkout,
      complaints,
      createComplaint,
      deleteProduct,
      isLoading,
      loginUser,
      logoutUser,
      orders,
      pets,
      products,
      refetchData,
      registerUser,
      resolveComplaint,
      user,
      users,
      bookings
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
