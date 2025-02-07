"use server";
import { showFeeSlabs } from "./feeActions";
import { addNewStudent } from "./studentActions";

async function getFeeSlabDetails(feeNames) {
  if (!feeNames.length) return [];

  try {
    const { data, error } = await showFeeSlabs();
    if (error) throw new Error(`Error fetching fee slabs: ${error.message}`);

    return data.filter((slab) => feeNames.includes(slab.name));
  } catch (error) {
    console.error("Error fetching fee slabs:", error);
    throw new Error(`Error fetching fee slabs: ${error.message}`);
  }
}

export async function processBulkAdmission(records) {
  try {
    if (!records.length) throw new Error("No valid student records found.");

    const failedRecords = [];
    const passedRecords = [];

    for (const record of records) {
      try {
        const feeNames = (record.fee_types || "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

        const feeSlabs = feeNames.length ? await getFeeSlabDetails(feeNames) : [];

        const dob = record.dob ? new Date(record.dob) : null;
        if (!dob || isNaN(dob)) throw new Error("Invalid DOB format.");

        const studentData = {
          full_name: record.full_name,
          admission_id: record.admission_id,
          dob,
          phone_no: record.phone_no,
          fatherName: record.fatherName,
          classname: record.classname,
          roll_number: record.roll_number,
          address: record.address,
          fees: feeSlabs,
        };

        const result = await addNewStudent(studentData);

        if (result.status === 201) {
          console.log("Student added successfully:", result.data);
          passedRecords.push({ ...record, success: true, message: result.statusText });
        }
        if (result.error) {
          failedRecords.push({ ...record, success: false, message: result.error });
        }
      } catch (error) {
        failedRecords.push({ ...record, success: false, message: error.message });
      }
    }

    return {
      success: true,
      message: `${records.length - failedRecords.length} students processed successfully.`,
      report: {
        failed: failedRecords.length,
        passed: passedRecords.length,
        failedRecords,
        passedRecords,
      },
    };
  } catch (error) {
    console.error("Bulk admission error:", error);
    return { success: false, message: error.message };
  }
}
