import { MonthlyCosts } from "../types";

interface CalculationTabProps {
  costs: MonthlyCosts;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function CalculationTab({
  costs,
  selectedMonth,
  setSelectedMonth,
}: CalculationTabProps) {
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
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Summary for {costs.month}
        </h3>
        <p className="text-sm sm:text-base">
          Total Shopping Cost: ${costs.totalCost.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base">
          Per Meal Cost: ${costs.perMealCost.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base">
          Total Rent: ${costs.rentCost.toFixed(2)}
        </p>
        <p className="text-sm sm:text-base">
          Per Person Rent: ${costs.perPersonRent.toFixed(2)}
        </p>
      </div>
      <div className="space-y-3">
        {costs.memberCosts.map((memberCost) => (
          <div
            key={memberCost.memberId}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
          >
            <div className="font-medium text-sm sm:text-base">
              {memberCost.name}
            </div>
            <div className="text-sm sm:text-base space-y-1 sm:space-y-0">
              <p>Meals: {memberCost.mealCount}</p>
              <p>Meal Cost: ${memberCost.mealCost.toFixed(2)}</p>
              <p>Rent Share: ${memberCost.rentShare.toFixed(2)}</p>
              <p>Rent Status: {memberCost.rentPaid ? "Paid" : "Unpaid"}</p>
              <p className="font-semibold">
                Total: ${memberCost.totalCost.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
