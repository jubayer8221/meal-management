import { createClient } from '@supabase/supabase-js';
import { Member, MealEntry, ShoppingItem, RentCost, User, RentPayment } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const loadMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const saveMembers = async (members: Member[]) => {
  const { error } = await supabase.from('members').upsert(members);
  if (error) throw new Error(error.message);
};

export const loadMealEntries = async (): Promise<MealEntry[]> => {
  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const saveMealEntries = async (mealEntries: MealEntry[]) => {
  const { error } = await supabase.from('meal_entries').upsert(mealEntries);
  if (error) throw new Error(error.message);
};

export const loadShoppingList = async (): Promise<ShoppingItem[]> => {
  const { data, error } = await supabase
    .from('shopping_list')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const saveShoppingList = async (shoppingList: ShoppingItem[]) => {
  const { error } = await supabase.from('shopping_list').upsert(shoppingList);
  if (error) throw new Error(error.message);
};

export const loadRentCosts = async (): Promise<RentCost[]> => {
  const { data, error } = await supabase
    .from('rent_costs')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const saveRentCosts = async (rentCosts: RentCost[]) => {
  const { error } = await supabase.from('rent_costs').upsert(rentCosts);
  if (error) throw new Error(error.message);
};

export const loadRentPayments = async (): Promise<RentPayment[]> => {
  const { data, error } = await supabase
    .from('rent_payments')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

export const saveRentPayments = async (rentPayments: RentPayment[]) => {
  const { error } = await supabase.from('rent_payments').upsert(rentPayments);
  if (error) throw new Error(error.message);
};

export const loadUser = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
};

export const saveUser = async (user: User) => {
  const { error } = await supabase.from('users').upsert(user);
  if (error) throw new Error(error.message);
};