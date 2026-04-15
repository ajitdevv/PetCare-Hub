"use client";

import { useState } from "react";
import { CheckCircle, ShoppingBag, ShoppingCart, Tag } from "lucide-react";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function ProductsPage() {
  const { products, cart, addToCart, checkout } = useAppContext();
  const [filter, setFilter] = useState("All");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const filteredProducts =
    filter === "All" ? products : products.filter((product) => product.category === filter);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      await checkout();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      window.alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="relative space-y-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Pet Store</h1>
        <p className="mt-2 text-lg text-gray-500">Premium products for your premium pets.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 pb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
              <div className="flex h-48 items-center justify-center bg-gray-100 p-4">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                ) : (
                  <ShoppingBag size={48} className="text-gray-300" />
                )}
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-bold leading-tight text-gray-900">{product.name}</h3>
                  <span className="rounded-lg bg-primary-50 px-2 py-1 font-bold text-primary-600">
                    Rs {product.price}
                  </span>
                </div>
                <div className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Tag size={12} /> {product.category}
                </div>
                <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600">{product.description}</p>
                <Button className="mt-auto w-full" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cart.length > 0 ? (
        <div className="fixed bottom-8 right-8 z-50 min-w-[250px] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ShoppingCart className="text-primary-600" />
              Cart ({cartItemCount})
            </div>
            <div className="font-bold text-gray-900">Rs {cartTotal}</div>
          </div>
          <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Checkout Now"}
          </Button>
          {success ? (
            <div className="mt-2 flex items-center justify-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} /> Order Placed!
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
