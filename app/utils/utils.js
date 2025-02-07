"use server";
import { createClient } from "../utils/supabase/server";

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  return { success: false, error: error.message };
};

// Helper function for Supabase queries
export const supabaseQuery = async (queryFn) => {
  const supabase = createClient();
  try {
    const result = await queryFn(supabase);
    console.log("Result for query:", result);
    return result;
  } catch (error) {
    return handleSupabaseError(error, "executing query");
  }
};