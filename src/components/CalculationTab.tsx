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
    <div className="space-y-6">
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
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
        <div className="text-base sm:text-lg font-semibold mb-2">
          Monthly Summary
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Total Meal Cost:</span>
          <span className="font-semibold">${costs.totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Cost per Meal:</span>
          <span className="font-semibold">${costs.perMealCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Total Rent:</span>
          <span className="font-semibold">${costs.rentCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Rent per Person:</span>
          <span className="font-semibold">
            ${costs.perPersonRent.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {costs.memberCosts.map(
          ({ memberId, name, mealCount, mealCost, rentShare, totalCost }) => (
            <div
              key={memberId}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2"
            >
              <div className="font-medium text-base sm:text-lg">{name}</div>
              <div className="text-xs sm:text-sm text-gray-500">
                {mealCount} meals
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Meal Cost:</span>
                <span className="font-semibold">${mealCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Rent Share:</span>
                <span className="font-semibold">${rentShare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Total:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
