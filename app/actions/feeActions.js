"use server";
import { createClient } from "../utils/supabase/server";
import { supabaseQuery } from "@/app/utils/utils";
import { calculateDueDates } from "@/app/utils/calculateDueDates";

export const showFeeSlabs = () => supabaseQuery((supabase) => supabase.from("fee_slabs").select("*"));

export const addFeeSlab = ({ name, fees, feetype, description, remark }) =>
  supabaseQuery((supabase) =>
    supabase
      .from("fee_slabs")
      .insert([{ name, amount: fees, recurrence: feetype, description, remark }])
      .select()
  );

export async function updateStudentFeeStatus({ admission_id, fees, academicYearStartMonth = 3 }) {
  console.log("Updating fee status:", { student_id: admission_id, slab_ids: fees, academicYearStartMonth });
  const supabase = createClient();

  try {
    for (const feeSlab of fees) {
      const { slab_id, name, amount, recurrence } = feeSlab;
      const dueDates = calculateDueDates(recurrence, academicYearStartMonth);

      for (const dueDate of dueDates) {
        const { data, error } = await supabase.from("student_fee_status").insert({
          student_id: admission_id,
          slab_id,
          due_date: dueDate,
          fee_amount: amount,
          is_paid: false,
        });

        if (error) throw error;
      }

      console.log(`Fee receipts created for slab: ${name}`);
    }

    return { success: true, message: "Fee status updated successfully" };
  } catch (error) {
    console.error("Error updating fee status:", error);
    return { success: false, error: error.message };
  }
}

export async function processPayment(paymentData) {
  const { studentId, selectedReceipts, totalAmount, paymentMode, remark } = paymentData;
  const supabase = createClient();
  try {
    const { data: transactionData, error: transactionError } = await supabase.from("transactions").insert({
      student_id: studentId,
      amount: totalAmount,
      payment_time: new Date().toISOString(),
      status: "PAID",
      reference_number: Date.now().toString(),
      all_slabs: selectedReceipts,
      payment_method:paymentMode,
      remark,
    });

    if (transactionError) throw transactionError;

    const updatePromises = selectedReceipts.map((receipt) =>
      supabase
        .from("student_fee_status")
        .update({ is_paid: true })
        .eq("student_id", studentId)
        .eq("slab_id", receipt.slab_id)
        .eq("due_date", receipt.due_date)
    );

    const updateResults = await Promise.all(updatePromises);
    const updateErrors = updateResults.filter((result) => result.error);

    if (updateErrors.length > 0) {
      throw new Error("Error updating student_fee_status");
    }

    return { success: true, data: transactionData };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { success: false, error: error.message };
  }
}
