"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function ProductsManagerPage() {
  const { products, addProduct, deleteProduct } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: ""
  });

  async function handleDelete(id) {
    setDeleteError("");
    setDeleteLoading(id);
    try {
      await deleteProduct(id);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete product.");
    } finally {
      setDeleteLoading(null);
    }
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    setFormError("");
    setLoading(true);
    try {
      await addProduct(formData);
      setFormData({ name: "", price: "", category: "", image: "", description: "" });
    } catch (error) {
      setFormError(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard adminOnly>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="mt-1 text-gray-500">Add or remove products from the store catalog.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Add New Product</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>
                )}
                <Input label="Name" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                <Input label="Price (Rs)" type="number" required value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} />
                <Input label="Category" required value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} />
                <Input label="Image URL" value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} />
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea required className="w-full rounded-xl border border-gray-300 p-2.5 text-sm" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Plus size={16} className="mr-2" /> Add Product
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Products</CardTitle>
              {deleteError && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{deleteError}</div>
              )}
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center italic text-gray-400">No products available.</td></tr>
                  ) : products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-primary-600">Rs {product.price}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" className="px-2.5 py-1.5 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(product.id)} disabled={deleteLoading === product.id}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
