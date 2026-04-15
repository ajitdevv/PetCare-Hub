import { DEMO_PRODUCTS } from "@/lib/constants";

function createStore() {
  return {
    users: [],
    pets: [],
    bookings: [],
    products: DEMO_PRODUCTS.map((product) => ({
      ...product,
      _id: product.id,
      createdAt: new Date().toISOString()
    })),
    complaints: [],
    orders: []
  };
}

export function getMemoryStore() {
  if (!globalThis.__PETCARE_MEMORY_STORE__) {
    globalThis.__PETCARE_MEMORY_STORE__ = createStore();
  }
  return globalThis.__PETCARE_MEMORY_STORE__;
}
