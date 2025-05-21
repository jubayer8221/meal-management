"use client";

import { useState, useEffect } from "react";
import {
  Member,
  MealEntry,
  ShoppingItem,
  RentCost,
  User,
  MonthlyCosts,
  RentPayment,
} from "../types";
import {
  loadMembers,
  saveMembers,
  loadMealEntries,
  saveMealEntries,
  loadShoppingList,
  saveShoppingList,
  loadRentCosts,
  saveRentCosts,
  loadUser,
  loadRentPayments,
  saveRentPayments,
  supabase,
} from "../utils/supabase";
import Login from "../components/Login";
import Tabs from "../components/Tabs";
import MembersTab from "../components/MembersTab";
import ShoppingTab from "../components/ShoppingTab";
import RentTab from "../components/RentTab";
import CalculationTab from "../components/CalculationTab";

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [rentCosts, setRentCosts] = useState<RentCost[]>([]);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [activeTab, setActiveTab] = useState<
    "members" | "shopping" | "rent" | "calculation"
  >("members");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setMembers(await loadMembers());
        setMealEntries(await loadMealEntries());
        setShoppingList(await loadShoppingList());
        setRentCosts(await loadRentCosts());
        setRentPayments(await loadRentPayments());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const userData = await loadUser(session.user.id);
          if (userData) setUser(userData);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  useEffect(() => {
    saveMealEntries(mealEntries);
  }, [mealEntries]);

  useEffect(() => {
    saveShoppingList(shoppingList);
  }, [shoppingList]);

  useEffect(() => {
    saveRentCosts(rentCosts);
  }, [rentCosts]);

  useEffect(() => {
    saveRentPayments(rentPayments);
  }, [rentPayments]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const calculateMonthlyCosts = (): MonthlyCosts => {
    const monthStart = selectedMonth + "-01";
    const monthEnd = selectedMonth + "-31";

    const monthlyShoppingList = shoppingList.filter(
      (item) => item.date >= monthStart && item.date <= monthEnd
    );

    const monthlyMealEntries = mealEntries.filter(
      (entry) => entry.date >= monthStart && entry.date <= monthEnd
    );

    const monthlyRent =
      rentCosts.find((rent) => rent.month.startsWith(selectedMonth))?.amount ||
      0;

    const totalCost = monthlyShoppingList.reduce(
      (sum, item) => sum + item.cost,
      0
    );
    const totalMeals = monthlyMealEntries.reduce(
      (sum, entry) => sum + entry.count,
      0
    );
    const perMealCost = totalMeals > 0 ? totalCost / totalMeals : 0;
    const perPersonRent = members.length > 0 ? monthlyRent / members.length : 0;

    return {
      month: selectedMonth,
      totalCost,
      perMealCost,
      rentCost: monthlyRent,
      perPersonRent,
      memberCosts: members.map((member) => {
        const memberMealCount = monthlyMealEntries
          .filter((entry) => entry.member_id === member.id)
          .reduce((sum, entry) => sum + entry.count, 0);
        const mealCost = memberMealCount * perMealCost;
        const rentPaid = rentPayments.some(
          (p) => p.member_id === member.id && p.month === monthStart && p.paid
        );
        const totalCost = mealCost + (rentPaid ? 0 : perPersonRent);
        return {
          memberId: member.id,
          name: member.name,
          mealCount: memberMealCount,
          mealCost,
          rentShare: perPersonRent,
          rentPaid,
          totalCost,
        };
      }),
    };
  };

  const costs = calculateMonthlyCosts();

  // Pass onLogin callback to Login component
  if (!user) {
    return (
      <Login
        onLogin={async (supabaseUser) => {
          const userData = await loadUser(supabaseUser.id);
          if (userData) setUser(userData);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg sm:text-xl font-semibold">
            Welcome, {user.username} ({user.role})
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "members" && (
          <MembersTab
            members={members}
            mealEntries={mealEntries}
            user={user}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            selectedMember={selectedMember}
            setMembers={setMembers}
            setMealEntries={setMealEntries}
            setSelectedMember={setSelectedMember}
            setSelectedDate={setSelectedDate}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {activeTab === "shopping" && (
          <ShoppingTab
            shoppingList={shoppingList}
            user={user}
            selectedDate={selectedDate}
            setShoppingList={setShoppingList}
            setSelectedDate={setSelectedDate}
          />
        )}
        {activeTab === "rent" && (
          <RentTab
            rentCosts={rentCosts}
            rentPayments={rentPayments}
            members={members}
            user={user}
            selectedMonth={selectedMonth}
            setRentCosts={setRentCosts}
            setRentPayments={setRentPayments}
            setSelectedMonth={setSelectedMonth}
          />
        )}
        {activeTab === "calculation" && (
          <CalculationTab
            costs={costs}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}
      </div>
    </div>
  );
}
