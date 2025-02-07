"use server";
import { supabaseQuery } from "@/app/utils/utils";

export const lastTransactions = (start, limit) =>
  supabaseQuery((supabase) =>
    supabase
      .from("financial_transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(start, limit - 1)
  );

export const addFinancialTransaction = ({
  transaction_type,
  amount,
  payment_method,
  person_involved,
  purpose,
  notes,
}) =>
  supabaseQuery((supabase) =>
    supabase
      .from("financial_transactions")
      .insert({ amount, transaction_type, payment_method, person_involved, purpose, notes })
      .select()
  );
