"use server";
import { supabaseQuery } from "@/app/utils/utils";
import { updateStudentFeeStatus } from "./feeActions";

export async function addNewStudent({
  full_name,
  admission_id,
  dob,
  phone_no,
  fatherName,
  classname,
  roll_number,
  address,
  fees,
}) {
  const result = await supabaseQuery((supabase) =>
    supabase
      .from("students")
      .insert([{ full_name, admission_id, dob, phone_no, fatherName, classname, roll_number, address }])
      .select()
  );

  if (result?.error === null) {
    await updateStudentFeeStatus({ admission_id, fees, academicYearStartMonth: 3 });
  } else {
    return { error: result?.error };
  }

  return result;
}

export const fetchAllStudents = () => supabaseQuery((supabase) => supabase.from("students").select("*"));

export const fetchAstudent = (admission_id) =>
  supabaseQuery((supabase) => supabase.from("students").select("*").eq("admission_id", admission_id));

export const fetchFutureReceipts = (admission_id) =>
  supabaseQuery((supabase) => supabase.from("student_fee_status").select("*").eq("student_id", admission_id));

export const fetchFeeHistory = (admission_id) =>
  supabaseQuery((supabase) => supabase.from("transactions").select("*").eq("student_id", admission_id));