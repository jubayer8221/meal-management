interface TabsProps {
  activeTab: "members" | "shopping" | "rent" | "calculation";
  setActiveTab: (tab: "members" | "shopping" | "rent" | "calculation") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex border-b mb-4">
      <button
        className={`px-4 py-2 -mb-px text-sm sm:text-base ${
          activeTab === "members"
            ? "border-b-2 border-blue-500 text-blue-500"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("members")}
      >
        Members
      </button>
      <button
        className={`px-4 py-2 -mb-px text-sm sm:text-base ${
          activeTab === "shopping"
            ? "border-b-2 border-blue-500 text-blue-500"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("shopping")}
      >
        Shopping
      </button>
      <button
        className={`px-4 py-2 -mb-px text-sm sm:text-base ${
          activeTab === "rent"
            ? "border-b-2 border-blue-500 text-blue-500"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("rent")}
      >
        Rent
      </button>
      <button
        className={`px-4 py-2 -mb-px text-sm sm:text-base ${
          activeTab === "calculation"
            ? "border-b-2 border-blue-500 text-blue-500"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("calculation")}
      >
        Calculation
      </button>
    </div>
  );
}
