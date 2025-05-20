import { useState } from "react";
import { Member, MealEntry, User } from "../types";
import { PlusCircle, MinusCircle } from "lucide-react";

interface MembersTabProps {
  members: Member[];
  mealEntries: MealEntry[];
  user: User | null;
  selectedDate: string;
  selectedMonth: string;
  selectedMember: string | null;
  setMembers: (members: Member[]) => void;
  setMealEntries: (mealEntries: MealEntry[]) => void;
  setSelectedMember: (memberId: string | null) => void;
}

export default function MembersTab({
  members,
  mealEntries,
  user,
  selectedDate,
  selectedMonth,
  selectedMember,
  setMembers,
  setMealEntries,
  setSelectedMember,
}: MembersTabProps) {
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [mealCountInput, setMealCountInput] = useState<string>("");
  const [editMealId, setEditMealId] = useState<string | null>(null);
  const [editMealCount, setEditMealCount] = useState<string>("");

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;

  const addMember = () => {
    if (newMemberName.trim() && isAdmin) {
      setMembers([
        ...members,
        {
          id: Date.now().toString(),
          name: newMemberName.trim(),
          role: "member",
          created_by: user!.username,
        },
      ]);
      setNewMemberName("");
    }
  };

  const updateMemberRole = (
    memberId: string,
    newRole: "manager" | "member"
  ) => {
    if (isAdmin) {
      setMembers(
        members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    }
  };

  const addMeal = (memberId: string) => {
    if (
      canEdit &&
      !isNaN(Number(mealCountInput)) &&
      Number(mealCountInput) >= 0
    ) {
      const existingEntryIndex = mealEntries.findIndex(
        (e) => e.member_id === memberId && e.date === selectedDate
      );
      if (existingEntryIndex >= 0) {
        const updatedEntries = [...mealEntries];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          count: Number(mealCountInput),
          updated_by: user!.username,
        };
        setMealEntries(updatedEntries);
      } else {
        setMealEntries([
          ...mealEntries,
          {
            id: Date.now().toString(),
            member_id: memberId,
            date: selectedDate,
            count: Number(mealCountInput),
            created_by: user!.username,
            updated_by: user!.username,
          },
        ]);
      }
      setMealCountInput("");
    }
  };

  const editMeal = (entry: MealEntry) => {
    if (canEdit) {
      setEditMealId(entry.id);
      setEditMealCount(entry.count.toString());
    }
  };

  const saveEditMeal = (entryId: string) => {
    if (
      canEdit &&
      !isNaN(Number(editMealCount)) &&
      Number(editMealCount) >= 0
    ) {
      setMealEntries(
        mealEntries.map((e) =>
          e.id === entryId
            ? { ...e, count: Number(editMealCount), updated_by: user!.username }
            : e
        )
      );
      setEditMealId(null);
      setEditMealCount("");
    }
  };

  const deleteMeal = (entryId: string) => {
    if (canEdit) {
      setMealEntries(mealEntries.filter((e) => e.id !== entryId));
    }
  };

  const getMemberMeals = (memberId: string): MealEntry[] => {
    const monthStart = selectedMonth + "-01";
    const monthEnd = selectedMonth + "-31";
    return mealEntries
      .filter(
        (entry) =>
          entry.member_id === memberId &&
          entry.date >= monthStart &&
          entry.date <= monthEnd
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return (
    <div>
      {!selectedMember && (
        <div>
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMemberName(e.target.value)
                }
                placeholder="Member name"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button
                onClick={addMember}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
              >
                Add
              </button>
            </div>
          )}
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
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
              >
                <button
                  className="font-medium text-left flex-1 text-sm sm:text-base"
                  onClick={() => setSelectedMember(member.id)}
                >
                  {member.name} ({member.role})
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  {canEdit && (
                    <>
                      <input
                        type="number"
                        value={mealCountInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMealCountInput(e.target.value)
                        }
                        placeholder="Meals"
                        className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        min="0"
                      />
                      <button
                        onClick={() => addMeal(member.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Add
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <select
                      value={member.role}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        updateMemberRole(
                          member.id,
                          e.target.value as "manager" | "member"
                        )
                      }
                      className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMember && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {members.find((m) => m.id === selectedMember)?.name || "Unknown"}
              's Meals
            </h2>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-blue-500 hover:text-blue-600 text-sm sm:text-base"
            >
              Back
            </button>
          </div>
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
          <div className="space-y-3">
            {getMemberMeals(selectedMember).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
              >
                <div className="font-medium text-sm sm:text-base">
                  {entry.date}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {editMealId === entry.id && canEdit ? (
                    <>
                      <input
                        type="number"
                        value={editMealCount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditMealCount(e.target.value)
                        }
                        className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        min="0"
                      />
                      <button
                        onClick={() => saveEditMeal(entry.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMealId(null)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="w-8 text-center font-semibold text-sm sm:text-base">
                        {entry.count}
                      </span>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => editMeal(entry)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMeal(entry.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
