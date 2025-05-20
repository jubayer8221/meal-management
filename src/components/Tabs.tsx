import { Users, ShoppingBag, Home, Calculator } from "lucide-react";

interface TabsProps {
  activeTab: "members" | "shopping" | "rent" | "calculation";
  setActiveTab: (tab: "members" | "shopping" | "rent" | "calculation") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {[
        { tab: "members" as const, label: "Members", Icon: Users },
        { tab: "shopping" as const, label: "Shopping", Icon: ShoppingBag },
        { tab: "rent" as const, label: "Rent", Icon: Home },
        { tab: "calculation" as const, label: "Costs", Icon: Calculator },
      ].map(({ tab, label, Icon }) => (
        <button
          key={tab}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base ${
            activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
          } flex items-center justify-center`}
          onClick={() => setActiveTab(tab)}
        >
          <Icon className="inline-block mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
