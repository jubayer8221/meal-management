import { useState } from "react";
import { ShoppingItem, User } from "../types";
import { supabase } from "../utils/supabase";

interface ShoppingTabProps {
  shoppingList: ShoppingItem[];
  user: User | null;
  selectedDate: string;
  setShoppingList: (shoppingList: ShoppingItem[]) => void;
  setSelectedDate: (date: string) => void;
}

export default function ShoppingTab({
  shoppingList,
  user,
  selectedDate,
  setShoppingList,
  setSelectedDate,
}: ShoppingTabProps) {
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemCost, setNewItemCost] = useState<string>("");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>("");
  const [editItemCost, setEditItemCost] = useState<string>("");
  const [editItemDate, setEditItemDate] = useState<string>("");

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;

  const addShoppingItem = async () => {
    if (newItemName.trim() && !isNaN(Number(newItemCost)) && canEdit) {
      const newItem = {
        id: crypto.randomUUID(),
        name: newItemName.trim(),
        cost: Number(newItemCost),
        date: selectedDate,
        created_by: user!.username,
        updated_by: user!.username,
      };
      await supabase.from("shopping_list").insert(newItem);
      setShoppingList([...shoppingList, newItem]);
      setNewItemName("");
      setNewItemCost("");
    }
  };

  const editShoppingItem = (item: ShoppingItem) => {
    if (canEdit) {
      setEditItemId(item.id);
      setEditItemName(item.name);
      setEditItemCost(item.cost.toString());
      setEditItemDate(item.date);
    }
  };

  const saveEditShoppingItem = async (itemId: string) => {
    if (
      editItemName.trim() &&
      !isNaN(Number(editItemCost)) &&
      editItemDate &&
      canEdit
    ) {
      const updatedItem = {
        name: editItemName.trim(),
        cost: Number(editItemCost),
        date: editItemDate,
        updated_by: user!.username,
      };
      await supabase.from("shopping_list").update(updatedItem).eq("id", itemId);
      setShoppingList(
        shoppingList.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
      setEditItemId(null);
      setEditItemName("");
      setEditItemCost("");
      setEditItemDate("");
    }
  };

  const deleteShoppingItem = async (itemId: string) => {
    if (canEdit) {
      await supabase.from("shopping_list").delete().eq("id", itemId);
      setShoppingList(shoppingList.filter((item) => item.id !== itemId));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedDate(e.target.value)
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItemName(e.target.value)
            }
            placeholder="Item name"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <input
            type="number"
            value={newItemCost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItemCost(e.target.value)
            }
            placeholder="Cost"
            className="w-full sm:w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            min="0"
          />
          <button
            onClick={addShoppingItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      )}
      <div className="space-y-3">
        {shoppingList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
          >
            {editItemId === item.id && canEdit ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={editItemName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditItemName(e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <input
                  type="number"
                  value={editItemCost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditItemCost(e.target.value)
                  }
                  className="w-full sm:w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  min="0"
                />
                <input
                  type="date"
                  value={editItemDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditItemDate(e.target.value)
                  }
                  className="w-full sm:w-44 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <button
                  onClick={() => saveEditShoppingItem(item.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditItemId(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className="font-medium text-sm sm:text-base">
                    {item.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {item.date}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="font-semibold text-sm sm:text-base">
                    ${item.cost.toFixed(2)}
                  </div>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => editShoppingItem(item)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteShoppingItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
