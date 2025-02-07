"use server";
import { supabaseQuery } from "@/app/utils/utils";

export const showClasses = () => supabaseQuery((supabase) => supabase.from("classes").select("*"));

export const addClass = ({ class_name, class_desc }) =>
  supabaseQuery((supabase) => supabase.from("classes").insert([{ class_name, class_desc }]).select());
