export interface Member {
  id: string;
  name: string;
  role: 'manager' | 'member';
  created_by: string;
}

export interface MealEntry {
  id: string;
  member_id: string;
  date: string;
  count: number;
  created_by: string;
  updated_by: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  cost: number;
  date: string;
  created_by: string;
  updated_by: string;
}

export interface RentCost {
  id: string;
  month: string;
  amount: number;
  created_by: string;
}

export interface RentPayment {
  id: string;
  member_id: string;
  month: string;
  paid: boolean;
  created_by: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'member';
}

export interface MemberCost {
  memberId: string;
  name: string;
  mealCount: number;
  mealCost: number;
  rentShare: number;
  rentPaid: boolean;
  totalCost: number;
}

export interface MonthlyCosts {
  month: string;
  totalCost: number;
  perMealCost: number;
  rentCost: number;
  perPersonRent: number;
  memberCosts: MemberCost[];
}