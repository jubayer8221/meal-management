import { Member, MealEntry, ShoppingItem, RentCost, User } from '../types';

export const loadMembers = (): Member[] => {
  const saved = localStorage.getItem('members');
  return saved ? JSON.parse(saved) : [];
};

export const saveMembers = (members: Member[]) => {
  localStorage.setItem('members', JSON.stringify(members));
};

export const loadMealEntries = (): MealEntry[] => {
  const saved = localStorage.getItem('mealEntries');
  return saved ? JSON.parse(saved) : [];
};

export const saveMealEntries = (mealEntries: MealEntry[]) => {
  localStorage.setItem('mealEntries', JSON.stringify(mealEntries));
};

export const loadShoppingList = (): ShoppingItem[] => {
  const saved = localStorage.getItem('shoppingList');
  return saved ? JSON.parse(saved) : [];
};

export const saveShoppingList = (shoppingList: ShoppingItem[]) => {
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
};

export const loadRentCosts = (): RentCost[] => {
  const saved = localStorage.getItem('rentCosts');
  return saved ? JSON.parse(saved) : [];
};

export const saveRentCosts = (rentCosts: RentCost[]) => {
  localStorage.setItem('rentCosts', JSON.stringify(rentCosts));
};

export const loadUser = (): User | null => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
};

export const saveUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem('user');
};