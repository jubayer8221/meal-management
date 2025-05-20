import { useState } from "react";
import { RentCost, User } from "../types";

interface RentTabProps {
  rentCosts: RentCost[];
  user: User | null;
  selectedMonth: string;
  setRentCosts: (rentCosts: RentCost[]) => void;
}

export default function RentTab({
  rentCosts,
  user,
  selectedMonth,
  setRentCosts,
}: RentTabProps) {
  const [newRentAmount, setNewRentAmount] = useState<string>("");
  const [editRentId, setEditRentId] = useState<string | null>(null);
  const [editRentAmount, setEditRentAmount] = useState<string>("");

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;

  const addRentCost = () => {
    if (!isNaN(Number(newRentAmount)) && canEdit) {
      setRentCosts([
        ...rentCosts,
        {
          id: Date.now().toString(),
          month: selectedMonth + "-01",
          amount: Number(newRentAmount),
          created_by: user!.username,
          updated_by: user!.username,
        },
      ]);
      setNewRentAmount("");
    }
  };

  const editRentCost = (rent: RentCost) => {
    if (canEdit) {
      setEditRentId(rent.id);
      setEditRentAmount(rent.amount.toString());
    }
  };

  const saveEditRentCost = (rentId: string) => {
    if (!isNaN(Number(editRentAmount)) && canEdit) {
      setRentCosts(
        rentCosts.map((rent) =>
          rent.id === rentId
            ? {
                ...rent,
                amount: Number(editRentAmount),
                updated_by: user!.username,
              }
            : rent
        )
      );
      setEditRentId(null);
      setEditRentAmount("");
    }
  };

  const deleteRentCost = (rentId: string) => {
    if (canEdit) {
      setRentCosts(rentCosts.filter((rent) => rent.id !== rentId));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSelectedMonth(e.target.value)
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="number"
            value={newRentAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRentAmount(e.target.value)
            }
            placeholder="Rent amount"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            min="0"
          />
          <button
            onClick={addRentCost}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      )}
      <div className="space-y-3">
        {rentCosts
          .filter((rent) => rent.month.startsWith(selectedMonth))
          .map((rent) => (
            <div
              key={rent.id}
              className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
            >
              {editRentId === rent.id && canEdit ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="number"
                    value={editRentAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditRentAmount(e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    min="0"
                  />
                  <button
                    onClick={() => saveEditRentCost(rent.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditRentId(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="font-medium text-sm sm:text-base">
                    Rent for {rent.month.slice(0, 7)}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="font-semibold text-sm sm:text-base">
                      ${rent.amount.toFixed(2)}
                    </div>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => editRentCost(rent)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRentCost(rent.id)}
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
