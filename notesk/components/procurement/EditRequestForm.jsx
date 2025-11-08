"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function EditRequestForm({ request }) {
  const router = useRouter();

  // ---------- State ----------
  const [title, setTitle] = useState(request?.title || "");
  const [description, setDescription] = useState(request?.description || "");
  const [items, setItems] = useState(
    request?.items?.length
      ? request.items.map((i) => ({
          name: i.name || "",
          description: i.description || "",
          quantity: parseFloat(i.quantity) || 1,
          unitPrice: parseFloat(i.unitPrice) || 1,
          totalPrice: parseFloat(i.totalPrice) || 1,
        }))
      : [{ name: "", description: "", quantity: 1, unitPrice: 1, totalPrice: 1 }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- Handlers ----------
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] =
      name === "quantity" || name === "unitPrice"
        ? parseFloat(value) || 0
        : value;
    updatedItems[index].totalPrice =
      updatedItems[index].quantity * updatedItems[index].unitPrice;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([{ name: "", description: "", quantity: 1, unitPrice: 1, totalPrice: 1 }, ...items]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems.length ? updatedItems : [{ name: "", description: "", quantity: 1, unitPrice: 1, totalPrice: 1 }]);
  };

  const requestTotalPrice = items.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        id: request.id,
        title,
        description,
        items,
      };

      const res = await fetch("/actions/updateRequest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update request");

      router.push("/protected/dashboard/employee");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Edit Procurement Request</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Title & Description */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="border p-2 w-full rounded"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        rows={4}
        className="border p-2 w-full rounded"
      />

      {/* Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Items</h3>
          <Button type="button" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="border p-4 rounded space-y-2">
            <div className="flex justify-between items-center">
              <h4>Item {idx + 1}</h4>
              <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(e, idx)}
            />
            <Input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(e, idx)}
            />
            <Input
              type="number"
              step="0.01"
              name="unitPrice"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(e, idx)}
            />
            <div>Total: ${item.totalPrice.toFixed(2)}</div>
            <Textarea
              name="description"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => handleItemChange(e, idx)}
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="text-right font-bold text-lg">Total Request: ${requestTotalPrice}</div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : <><Send className="mr-2 h-4 w-4" /> Update Request</>}
      </Button>
    </form>
  );
}
