import { useState } from "react";
import { RentCost, RentPayment, Member, User } from "../types";
import { supabase } from "../utils/supabase";

interface RentTabProps {
  rentCosts: RentCost[];
  rentPayments: RentPayment[];
  members: Member[];
  user: User | null;
  selectedMonth: string;
  setRentCosts: (rentCosts: RentCost[]) => void;
  setRentPayments: (rentPayments: RentPayment[]) => void;
  setSelectedMonth: (month: string) => void; // Added
}

export default function RentTab({
  rentCosts,
  rentPayments,
  members,
  user,
  selectedMonth,
  setRentCosts,
  setRentPayments,
  setSelectedMonth, // Added
}: RentTabProps) {
  const [rentAmount, setRentAmount] = useState<string>("");

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;

  const addRentCost = async () => {
    if (rentAmount && !isNaN(Number(rentAmount)) && canEdit) {
      const newRentCost = {
        id: crypto.randomUUID(),
        month: selectedMonth,
        amount: Number(rentAmount),
        created_by: user!.username,
      };
      await supabase.from("rent_costs").insert(newRentCost);
      setRentCosts([...rentCosts, newRentCost]);
      setRentAmount("");
    }
  };

  const toggleRentPayment = async (memberId: string) => {
    if (canEdit) {
      const monthStart = selectedMonth + "-01";
      const existingPayment = rentPayments.find(
        (p) => p.member_id === memberId && p.month === monthStart
      );

      if (existingPayment) {
        const updatedPayment = {
          ...existingPayment,
          paid: !existingPayment.paid,
        };
        await supabase
          .from("rent_payments")
          .update({ paid: updatedPayment.paid })
          .eq("id", existingPayment.id);
        setRentPayments(
          rentPayments.map((p) =>
            p.id === existingPayment.id ? updatedPayment : p
          )
        );
      } else {
        const newPayment = {
          id: crypto.randomUUID(),
          member_id: memberId,
          month: monthStart,
          paid: true,
          created_by: user!.username,
        };
        await supabase.from("rent_payments").insert(newPayment);
        setRentPayments([...rentPayments, newPayment]);
      }
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
            value={rentAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRentAmount(e.target.value)
            }
            placeholder="Rent amount"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            min="0"
          />
          <button
            onClick={addRentCost}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
          >
            Add Rent
          </button>
        </div>
      )}
      <div className="space-y-3">
        {members.map((member) => {
          const payment = rentPayments.find(
            (p) =>
              p.member_id === member.id && p.month === selectedMonth + "-01"
          );
          return (
            <div
              key={member.id}
              className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
            >
              <div className="font-medium text-sm sm:text-base">
                {member.name}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  checked={payment?.paid || false}
                  onChange={() => toggleRentPayment(member.id)}
                  disabled={!canEdit}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm sm:text-base">
                  {payment?.paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
